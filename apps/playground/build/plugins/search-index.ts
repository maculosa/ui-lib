import fs from 'node:fs'
import path from 'node:path'
import glob from 'fast-glob'
import type { Plugin, ViteDevServer } from 'vite'

const VIRTUAL_ID = 'virtual:search-index'
const RESOLVED_ID = `\0${VIRTUAL_ID}`

export interface SearchRecord {
  id: number
  title: string
  heading: string
  description: string
  /** Vue 页面同址双语，构建期只记录词典 key，由搜索面板按当前语言解析。 */
  titleKeys?: string[]
  descriptionKeys?: string[]
  path: string
  hash: string
  locale: 'zh' | 'en'
  group: string
}

/**
 * markdown-it-anchor 默认 slugify 的编码前形态。
 * 路由 push 时 vue-router 会自行编码，DOM 上的 id 则是编码后的结果。
 */
function slugify(text: string) {
  return text.trim().toLowerCase().replace(/\s+/g, '-')
}

function stripInline(text: string) {
  return text
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_~]/g, '')
    .replace(/\{[^}]*\}/g, '')
    .trim()
}

function unquote(value: string) {
  return value.trim().replace(/^['"]|['"]$/g, '')
}

function readFrontmatter(source: string) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source)
  if (!match) return { data: {} as Record<string, string>, body: source }
  const data: Record<string, string> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const pair = /^(\w[\w-]*):\s*(.*)$/.exec(line)
    if (pair) data[pair[1]] = unquote(pair[2])
  }
  return { data, body: source.slice(match[0].length) }
}

function toRoutePath(relDir: 'pages' | 'docs', relative: string) {
  const withoutExt = relative.replace(/\.(md|vue)$/, '')
  const segments = withoutExt.split('/').filter(Boolean)
  if (segments.at(-1) === 'index') segments.pop()
  const joined = segments.join('/')
  if (relDir === 'docs') return joined ? `/docs/${joined}` : '/docs'
  return joined ? `/${joined}` : '/'
}

function localeOf(routePath: string): 'zh' | 'en' {
  if (routePath === '/en' || routePath.startsWith('/en/')) return 'en'
  if (routePath === '/docs/en' || routePath.startsWith('/docs/en/')) return 'en'
  return 'zh'
}

function groupOf(routePath: string) {
  const canonical = routePath.startsWith('/en/') ? routePath.slice(3) : routePath
  return canonical.split('/').filter(Boolean)[0] ?? 'home'
}

function collectMarkdown(file: string, relDir: 'pages' | 'docs', relative: string) {
  const source = fs.readFileSync(file, 'utf-8')
  const { data, body } = readFrontmatter(source)
  const routePath = toRoutePath(relDir, relative)
  const locale = localeOf(routePath)
  const group = groupOf(routePath)

  const headings: { level: number, text: string }[] = []
  let inFence = false
  let h1 = ''
  for (const line of body.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    const heading = /^(#{1,3})\s+(.+?)\s*#*$/.exec(line)
    if (!heading) continue
    const text = stripInline(heading[2])
    if (!text) continue
    if (heading[1].length === 1) {
      if (!h1) h1 = text
      continue
    }
    headings.push({ level: heading[1].length, text })
  }

  const title = data.name || data.title || h1 || path.basename(relative, path.extname(relative))
  const description = data.desc || data.description || ''
  const records: Omit<SearchRecord, 'id'>[] = [
    { title, heading: '', description, path: routePath, hash: '', locale, group },
  ]
  for (const heading of headings) {
    records.push({
      title,
      heading: heading.text,
      description: '',
      path: routePath,
      hash: slugify(heading.text),
      locale,
      group,
    })
  }
  return records
}

const I18N_CALL = /t\(\s*'([^']+)'\s*\)/g

function extractContent(html: string) {
  const keys = [...html.matchAll(I18N_CALL)].map(match => match[1])
  if (keys.length) return { keys, text: '' }
  return { keys: undefined, text: stripInline(html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ')) }
}

function collectVuePage(file: string, relative: string) {
  const source = fs.readFileSync(file, 'utf-8')
  const h1 = /<h1[^>]*>([\s\S]*?)<\/h1>/.exec(source)
  if (!h1) return []
  const title = extractContent(h1[1])
  if (!title.keys && (!title.text || title.text.includes('{{'))) return []
  const descMatch = /<p[^>]*class="[^"]*(?:-desc|hero-sub)[^"]*"[^>]*>([\s\S]*?)<\/p>/.exec(source)
  const desc = descMatch ? extractContent(descMatch[1]) : { keys: undefined, text: '' }
  const routePath = toRoutePath('pages', relative)
  return [
    {
      title: title.text,
      heading: '',
      description: desc.text.includes('{{') ? '' : desc.text,
      titleKeys: title.keys,
      descriptionKeys: desc.keys,
      path: routePath,
      hash: '',
      locale: localeOf(routePath),
      group: groupOf(routePath),
    },
  ]
}

function buildRecords(root: string) {
  const records: Omit<SearchRecord, 'id'>[] = []
  const srcDir = path.resolve(root, 'src')

  for (const relDir of ['pages', 'docs'] as const) {
    const files = glob.sync(`${srcDir}/${relDir}/**/*.md`, { absolute: true })
    for (const file of files.sort()) {
      records.push(...collectMarkdown(file, relDir, path.relative(`${srcDir}/${relDir}`, file)))
    }
  }

  const vueFiles = glob.sync(`${srcDir}/pages/**/*.vue`, {
    absolute: true,
    ignore: ['**/[[]*[]].vue', '**/error.vue'],
  })
  for (const file of vueFiles.sort()) {
    records.push(...collectVuePage(file, path.relative(`${srcDir}/pages`, file)))
  }

  const seen = new Set<string>()
  return records
    .filter(record => {
      const key = `${record.locale}|${record.path}|${record.hash}|${record.title}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .map((record, id) => ({ id, ...record }))
}

export function searchIndex(): Plugin {
  let server: ViteDevServer | undefined

  function invalidate() {
    const mod = server?.moduleGraph.getModuleById(RESOLVED_ID)
    if (mod) server!.moduleGraph.invalidateModule(mod)
  }

  return {
    name: 'banmao-search-index',
    configureServer(devServer) {
      server = devServer
      devServer.watcher.on('add', invalidate)
      devServer.watcher.on('unlink', invalidate)
      devServer.watcher.on('change', file => {
        if (/\.(md|vue)$/.test(file)) invalidate()
      })
    },
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },
    load(id) {
      if (id !== RESOLVED_ID) return
      const records = buildRecords(process.cwd())
      return `export default ${JSON.stringify(records)}`
    },
  }
}