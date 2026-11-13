import { computed, ref, watch } from 'vue'
import zh from './zh'
import en from './en'
import { zh as homeZh, en as homeEn } from './home'
import { zh as datavZh, en as datavEn } from './datav'
import { zh as specimenZh, en as specimenEn } from './specimen'
import { zh as catalogZh, en as catalogEn } from './catalog'
import { zh as blocksZh, en as blocksEn } from './blocks'
import { zh as examplesZh, en as examplesEn } from './examples'

export type Locale = 'zh' | 'en'

const STORAGE_KEY = 'banmao-locale'
const messages: Record<Locale, unknown> = {
  zh: {
    ...zh,
    home: homeZh,
    datav: datavZh,
    specimen: specimenZh,
    catalog: catalogZh,
    blocks: blocksZh,
    examples: examplesZh,
  },
  en: {
    ...en,
    home: homeEn,
    datav: datavEn,
    specimen: specimenEn,
    catalog: catalogEn,
    blocks: blocksEn,
    examples: examplesEn,
  },
}

function readStored(): Locale {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved === 'en' || saved === 'zh' ? saved : 'zh'
}

export const locale = ref<Locale>(readStored())

watch(
  locale,
  value => {
    localStorage.setItem(STORAGE_KEY, value)
    document.documentElement.lang = value === 'zh' ? 'zh-CN' : 'en'
  },
  { immediate: true },
)

export const isEn = computed(() => locale.value === 'en')

function lookup(dict: unknown, key: string): string | undefined {
  const value = key.split('.').reduce<unknown>((acc, part) => {
    return acc && typeof acc === 'object' ? (acc as Record<string, unknown>)[part] : undefined
  }, dict)
  return typeof value === 'string' ? value : undefined
}

export function t(key: string, params?: Record<string, string | number>): string {
  const template = lookup(messages[locale.value], key) ?? lookup(messages.zh, key) ?? key
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  )
}

export function setLocale(value: Locale) {
  locale.value = value
}

export function toggleLocale() {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
}

/**
 * 英文内容位于镜像路由下：src/pages 的页面走 /en/*，src/docs 的页面走 /docs/en/*。
 * 中文保持既有 URL 不变。
 */
export function toLocalePath(path: string, target: Locale): string {
  if (path === '/docs/zh' || path === '/docs/en') {
    return target === 'en' ? '/docs/en' : '/docs/zh'
  }

  if (path.startsWith('/docs/')) {
    const rest = path.slice('/docs/'.length)
    if (target === 'en') return `/docs/en/${rest}`
    return rest.startsWith('en/') ? `/docs/${rest.slice('en/'.length)}` : path
  }

  const underEn = path === '/en' || path.startsWith('/en/')
  if (target === 'en') {
    if (underEn) return path
    return path === '/' ? '/en' : `/en${path}`
  }
  if (!underEn) return path
  return path.slice('/en'.length) || '/'
}

/** 仅从路径中读取明确的语言信号，无信号时返回 null 以保留用户已选语言。 */
export function localeFromPath(path: string): Locale | null {
  if (path === '/docs/en' || path === '/en' || path.startsWith('/en/')) return 'en'
  if (path === '/docs/zh') return 'zh'
  return null
}