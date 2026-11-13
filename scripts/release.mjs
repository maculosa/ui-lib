#!/usr/bin/env node
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { stdin, stdout } from 'node:process'
import { createInterface } from 'node:readline/promises'

const root = resolve(import.meta.dirname, '..')
// token 的作用域是 registry.npmjs.org，换成 .com 会认证失败
const REGISTRY = 'https://registry.npmjs.org/'
const RESUME = `pnpm exec changeset publish --registry=${REGISTRY} && git push --follow-tags`

let committed = false

const log = (msg = '') => console.log(msg)
const fail = (msg) => {
  console.error(`\n✗ ${msg}`)
  process.exit(1)
}

const git = (args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim()
const run = (cmd, args) => execFileSync(cmd, args, { cwd: root, stdio: 'inherit' })
const readPkg = (dir) => JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'))

/** 只有 packages/* 参与发布，根包与 apps 不进 npm */
function libs() {
  const all = JSON.parse(
    execFileSync('pnpm', ['list', '-r', '--depth', '-1', '--json'], { cwd: root, encoding: 'utf8' }),
  )
  return all.filter((p) => p.path.startsWith(join(root, 'packages') + '/'))
}

function pendingChangesets() {
  const dir = join(root, '.changeset')
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md') && f !== 'README.md')
    .map((f) => readFileSync(join(dir, f), 'utf8'))
}

function declaredPackages(content) {
  const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!frontmatter) return []
  return [...frontmatter[1].matchAll(/['"]([^'"]+)['"]\s*:\s*(major|minor|patch)/g)].map((m) => ({
    name: m[1],
    bump: m[2],
  }))
}

async function main() {
  if (git(['status', '--porcelain'])) fail('工作区有未提交改动，请先提交或 stash 后再发布')

  const { baseBranch } = JSON.parse(readFileSync(join(root, '.changeset/config.json'), 'utf8'))
  const branch = git(['rev-parse', '--abbrev-ref', 'HEAD'])
  if (branch !== baseBranch) fail(`当前在 ${branch} 分支，发布需要在 ${baseBranch} 分支`)

  const changesets = pendingChangesets()
  if (!changesets.length) fail('没有待发布的 changeset，先执行 pnpm changeset 记录变更')

  log('待发布变更：')
  for (const d of changesets.flatMap(declaredPackages)) log(`  ${d.name}  ${d.bump}`)

  if (!stdin.isTTY) fail('发布需要在交互式终端里确认，请直接执行 pnpm release:one')

  try {
    execFileSync('npm', ['whoami', `--registry=${REGISTRY}`], { cwd: root, stdio: 'pipe' })
  } catch {
    fail(`未登录 ${REGISTRY}，先执行 npm login --registry=${REGISTRY}`)
  }

  const packages = libs()
  const before = new Map(packages.map((p) => [p.name, readPkg(p.path).version]))

  log('\n▸ changeset version')
  run('pnpm', ['version-packages'])

  const bumped = packages
    .map((p) => {
      const pkg = readPkg(p.path)
      return { name: p.name, path: p.path, version: pkg.version, isPrivate: pkg.private === true }
    })
    .filter((p) => p.version !== before.get(p.name))
  if (!bumped.length) fail('changeset version 没有产生版本变化，请检查 changeset 内容')

  log('\n版本变化：')
  for (const p of bumped) {
    const suffix = p.isPrivate ? '  (private，不发 npm)' : ''
    log(`  ${p.name}  ${before.get(p.name)} → ${p.version}${suffix}`)
  }

  log(`\n▸ 构建 ${bumped.map((p) => p.name).join(', ')}`)
  run('pnpm', [...bumped.flatMap((p) => ['--filter', p.name]), 'run', 'build'])

  const staged = bumped.flatMap((p) => {
    const dir = relative(root, p.path)
    return existsSync(join(p.path, 'CHANGELOG.md'))
      ? [join(dir, 'package.json'), join(dir, 'CHANGELOG.md')]
      : [join(dir, 'package.json')]
  })
  staged.push('.changeset')
  if (git(['status', '--porcelain', '--', 'pnpm-lock.yaml'])) staged.push('pnpm-lock.yaml')
  git(['add', '--', ...staged])

  const single = bumped.length === 1 ? bumped[0] : null
  run('git', [
    'commit',
    '-m',
    single
      ? `chore(${single.name.replace('@banmao/', '')}): 发布 ${single.version}`
      : `chore(release): 发布 ${bumped.length} 个包`,
    '-m',
    bumped.map((p) => `${p.name}@${p.version}`).join('\n'),
  ])
  committed = true

  const publishable = bumped.filter((p) => !p.isPrivate)
  if (publishable.length) {
    const rl = createInterface({ input: stdin, output: stdout })
    const answer = await rl.question(`\n确认发布 ${publishable.map((p) => `${p.name}@${p.version}`).join(', ')} 到 npm？(y/N) `)
    rl.close()
    if (answer.trim().toLowerCase() !== 'y') {
      log(`\n已取消发布，版本提交留在本地。继续发布：${RESUME}`)
      return
    }
    log('\n▸ changeset publish')
    run('pnpm', ['exec', 'changeset', 'publish', `--registry=${REGISTRY}`])
  } else {
    log('\n本次变更全是 private 包，跳过 npm 发布')
  }

  // changeset publish 只创建本地 annotated tag，需要 --follow-tags 才会推上去
  log('\n▸ git push --follow-tags')
  run('git', ['push', '--follow-tags'])
  log('\n✓ 发布完成')
}

main().catch((err) => {
  console.error(`\n✗ ${err.message}`)
  if (committed) console.error(`版本提交已在本地，修复后继续：${RESUME}`)
  process.exit(1)
})