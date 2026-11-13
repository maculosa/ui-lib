<script setup lang="ts">
import { computed, ref } from 'vue'
import { useClipboard } from '@vueuse/core'
import { useMessage } from 'naive-ui'

interface Token {
  key: string
  name: string
  light: string
  dark: string
  usage: string
  text?: boolean
}

interface Group {
  id: string
  label: string
  en: string
  items: Token[]
}

const groups: Group[] = [
  {
    id: 'primary',
    label: '主色 · 朱红',
    en: 'PRIMARY',
    items: [
      { key: '--color-primary', name: '主色', light: '#f04e23', dark: '#ff6a3d', usage: '主操作、强调、激活态' },
      { key: '--color-primary-hover', name: '主色悬停', light: '#f26339', dark: '#ff8159', usage: '指针悬停反馈' },
      { key: '--color-primary-pressed', name: '主色按下', light: '#d8431c', dark: '#e55a2e', usage: '点击按下反馈' },
    ],
  },
  {
    id: 'accent',
    label: '辅助色相',
    en: 'ACCENTS',
    items: [
      { key: '--color-electric', name: '电蓝', light: '#2f6bff', dark: '#6b93ff', usage: '信息提示、图表第二系列' },
      { key: '--color-acid', name: '酸绿', light: '#7cb518', dark: '#a3d65c', usage: '数据高亮、成功辅助' },
      { key: '--color-amber', name: '琥珀', light: '#e8a013', dark: '#f0b429', usage: '警告、渐变收尾' },
      { key: '--color-magenta', name: '品红', light: '#d6409f', dark: '#f06bc0', usage: '装饰标记、特殊分类' },
    ],
  },
  {
    id: 'semantic',
    label: '语义色',
    en: 'SEMANTIC',
    items: [
      { key: '--color-success', name: '成功', light: '#3e9b4f', dark: '#5fbf6e', usage: '完成、就绪、通过' },
      { key: '--color-warning', name: '警告', light: '#e8a013', dark: '#f0b429', usage: '注意、迭代中' },
      { key: '--color-danger', name: '危险', light: '#d64545', dark: '#f0655a', usage: '错误、删除、废弃' },
      { key: '--color-info', name: '信息', light: '#2f6bff', dark: '#6b93ff', usage: '提示、说明' },
    ],
  },
  {
    id: 'neutral',
    label: '纸墨中性色',
    en: 'NEUTRAL',
    items: [
      { key: '--color-background', name: '页面底色', light: '#f4f1ea', dark: '#141310', usage: '纸 / 墨打底' },
      { key: '--color-surface', name: '卡片表面', light: '#fbfaf6', dark: '#1c1a16', usage: '承载内容的表面' },
      { key: '--color-fill', name: '填充', light: '#ece8de', dark: '#2c2820', usage: '凹陷区、输入底' },
      { key: '--color-divider', name: '分隔线', light: '#dfdacc', dark: '#322e25', usage: '边框、分隔' },
      { key: '--color-foreground', name: '正文墨色', light: '#1c1a15', dark: '#f0ede3', usage: '标题与正文', text: true },
      { key: '--color-foreground-secondary', name: '次级文字', light: '#57534a', dark: '#b5b1a2', usage: '描述、次要信息', text: true },
      { key: '--color-foreground-tertiary', name: '三级文字', light: '#6c675b', dark: '#979280', usage: '标注、占位、元信息', text: true },
    ],
  },
]

const surfaces = {
  light: ['#f4f1ea', '#fbfaf6'],
  dark: ['#141310', '#1c1a16'],
}

function toRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [
    Number.parseInt(h.slice(0, 2), 16),
    Number.parseInt(h.slice(2, 4), 16),
    Number.parseInt(h.slice(4, 6), 16),
  ]
}

function luminance(hex: string) {
  const [r, g, b] = toRgb(hex).map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a: string, b: string) {
  const la = luminance(a)
  const lb = luminance(b)
  const hi = Math.max(la, lb)
  const lo = Math.min(la, lb)
  return (hi + 0.05) / (lo + 0.05)
}

function worstOn(hex: string, bgs: string[]) {
  return Math.min(...bgs.map((bg) => contrast(hex, bg)))
}

const contrastMap = computed(() => {
  const map: Record<string, { light: number; dark: number; pass: boolean }> = {}
  for (const g of groups) {
    for (const t of g.items) {
      if (!t.text) continue
      const light = worstOn(t.light, surfaces.light)
      const dark = worstOn(t.dark, surfaces.dark)
      map[t.key] = {
        light: Math.round(light * 100) / 100,
        dark: Math.round(dark * 100) / 100,
        pass: light >= 4.5 && dark >= 4.5,
      }
    }
  }
  return map
})

const message = useMessage()
const { copy } = useClipboard()

const copyMode = ref<'hex' | 'var'>('hex')
const view = ref<'pair' | 'light' | 'dark'>('pair')
const query = ref('')
const activeGroup = ref('all')
const copiedKey = ref('')
let copiedTimer: ReturnType<typeof setTimeout> | undefined

const filterChips = [{ id: 'all', label: '全部' }, ...groups.map((g) => ({ id: g.id, label: g.label.split(' · ')[0] }))]

const filteredGroups = computed(() => {
  const q = query.value.trim().toLowerCase()
  return groups
    .filter((g) => activeGroup.value === 'all' || g.id === activeGroup.value)
    .map((g) => ({
      ...g,
      items: g.items.filter((t) => {
        if (!q) return true
        return (
          t.key.toLowerCase().includes(q) ||
          t.name.toLowerCase().includes(q) ||
          t.usage.toLowerCase().includes(q) ||
          t.light.toLowerCase().includes(q) ||
          t.dark.toLowerCase().includes(q)
        )
      }),
    }))
    .filter((g) => g.items.length > 0)
})

const totalCount = computed(() => filteredGroups.value.reduce((n, g) => n + g.items.length, 0))

async function copyToken(t: Token) {
  const payload = copyMode.value === 'hex' ? `${t.light} / ${t.dark}` : `var(${t.key})`
  try {
    await copy(payload)
    copiedKey.value = t.key
    message.success(`已复制 ${copyMode.value === 'hex' ? '色值' : '变量'}：${payload}`)
    if (copiedTimer) clearTimeout(copiedTimer)
    copiedTimer = setTimeout(() => {
      copiedKey.value = ''
    }, 1400)
  }
  catch {
    message.warning('当前环境无法访问剪贴板，请手动选择复制')
  }
}
</script>

<template>
  <section class="tokens bm-corner-marks" aria-label="色彩令牌库">
    <header class="tokens-head">
      <div class="tokens-title">
        <span class="bm-mono-label">COLOR TOKENS · 色彩令牌</span>
        <span class="tokens-sub">点击任意色卡即可复制，亮 / 暗成对呈现</span>
      </div>
      <div class="tokens-tools">
        <label class="tokens-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.2-3.2" />
          </svg>
          <input v-model="query" type="search" placeholder="搜索令牌 / 色值 / 用途…" aria-label="搜索色彩令牌" />
        </label>
        <div class="tokens-segment" role="group" aria-label="复制内容">
          <button type="button" :class="{ active: copyMode === 'hex' }" @click="copyMode = 'hex'">HEX</button>
          <button type="button" :class="{ active: copyMode === 'var' }" @click="copyMode = 'var'">VAR</button>
        </div>
        <div class="tokens-segment" role="group" aria-label="预览主题">
          <button type="button" :class="{ active: view === 'pair' }" @click="view = 'pair'">配对</button>
          <button type="button" :class="{ active: view === 'light' }" @click="view = 'light'">亮</button>
          <button type="button" :class="{ active: view === 'dark' }" @click="view = 'dark'">暗</button>
        </div>
      </div>
    </header>

    <div class="tokens-filters">
      <button
        v-for="c in filterChips"
        :key="c.id"
        type="button"
        class="tokens-chip"
        :class="{ active: activeGroup === c.id }"
        @click="activeGroup = c.id"
      >
        {{ c.label }}
      </button>
      <span class="tokens-count bm-mono-label">{{ totalCount }} / 18 TOKENS</span>
    </div>

    <div class="tokens-body">
      <div v-for="g in filteredGroups" :key="g.id" class="token-group">
        <div class="token-group-head">
          <span class="bm-mono-label">{{ g.en }} · {{ g.label }}</span>
          <span class="token-group-rule" aria-hidden="true"></span>
        </div>
        <div class="token-grid">
          <button
            v-for="t in g.items"
            :key="t.key"
            type="button"
            class="token-card"
            :class="{ copied: copiedKey === t.key }"
            :aria-label="`复制 ${t.name} ${t.key}`"
            @click="copyToken(t)"
          >
            <span class="token-chip" :class="view">
              <span class="chip-half chip-light" :style="{ background: t.light }"></span>
              <span class="chip-half chip-dark" :style="{ background: t.dark }"></span>
              <span class="chip-flag chip-flag-light">亮</span>
              <span class="chip-flag chip-flag-dark">暗</span>
              <span class="chip-copied" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 12.5 9.5 18 20 6.5" />
                </svg>
              </span>
            </span>
            <span class="token-meta">
              <span class="token-name">{{ t.name }}</span>
              <span class="token-var">{{ t.key }}</span>
              <span class="token-hexes">
                <span class="token-hex"><em>亮</em>{{ t.light }}</span>
                <span class="token-hex"><em>暗</em>{{ t.dark }}</span>
              </span>
              <span class="token-usage">{{ t.usage }}</span>
              <span v-if="contrastMap[t.key]" class="token-contrast" :class="{ pass: contrastMap[t.key].pass }">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path v-if="contrastMap[t.key].pass" d="M4 12.5 9.5 18 20 6.5" />
                  <path v-else d="M12 8v5M12 16.5v.5" />
                  <circle v-if="!contrastMap[t.key].pass" cx="12" cy="12" r="9" />
                </svg>
                WCAG AA · 亮 {{ contrastMap[t.key].light }} · 暗 {{ contrastMap[t.key].dark }}
              </span>
            </span>
          </button>
        </div>
      </div>

      <div v-if="totalCount === 0" class="tokens-empty">
        <span class="bm-mono-label">NO MATCH</span>
        <p>没有匹配「{{ query }}」的令牌，换个关键词试试。</p>
      </div>
    </div>

    <footer class="tokens-foot">
      <span class="bm-mono-label">CLICK TO COPY · {{ copyMode === 'hex' ? '亮 / 暗色值' : 'CSS 变量' }}</span>
      <span class="tokens-foot-note">所有令牌随 <code>html.dark</code> 自动切换，业务组件只需引用变量。</span>
    </footer>
  </section>
</template>

<style scoped>
.tokens {
  border: 1px solid var(--color-divider);
  border-radius: 14px;
  background: var(--color-surface);
  box-shadow: 0 18px 50px var(--color-shadow);
  overflow: hidden;
}
.tokens-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 16px 18px;
  border-bottom: 1px dashed var(--color-divider);
}
.tokens-title {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.tokens-sub {
  font-size: 12.5px;
  color: var(--color-foreground-secondary);
}
.tokens-tools {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.tokens-search {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 11px;
  border: 1px solid var(--color-input-border);
  border-radius: 9px;
  background: var(--color-input);
  color: var(--color-foreground-tertiary);
  transition: border-color 0.2s ease;
}
.tokens-search:focus-within {
  border-color: var(--color-primary);
}
.tokens-search svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}
.tokens-search input {
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--font-sans);
  font-size: 12.5px;
  color: var(--color-foreground);
  width: 168px;
}
.tokens-search input::placeholder {
  color: var(--color-foreground-tertiary);
}
.tokens-segment {
  display: inline-flex;
  border: 1px solid var(--color-divider);
  border-radius: 9px;
  overflow: hidden;
}
.tokens-segment button {
  padding: 6px 11px;
  border: none;
  background: transparent;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--color-foreground-secondary);
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}
.tokens-segment button + button {
  border-left: 1px solid var(--color-divider);
}
.tokens-segment button.active {
  background: var(--color-primary);
  color: #fff;
}
.tokens-filters {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 12px 18px;
  border-bottom: 1px solid var(--color-divider);
  background: var(--color-surface-secondary);
}
.tokens-chip {
  padding: 5px 13px;
  border: 1px solid var(--color-divider);
  border-radius: 999px;
  background: var(--color-surface);
  font-size: 12px;
  color: var(--color-foreground-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}
.tokens-chip:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.tokens-chip.active {
  background: var(--color-foreground);
  border-color: var(--color-foreground);
  color: var(--color-background);
}
.tokens-count {
  margin-left: auto;
}
.tokens-body {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}
.token-group-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.token-group-rule {
  flex: 1;
  height: 1px;
  background: var(--color-divider);
}
.token-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.token-card {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
  border: 1px solid var(--color-divider);
  border-radius: 11px;
  background: var(--color-surface);
  cursor: pointer;
  text-align: left;
  overflow: hidden;
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}
.token-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 10px 26px var(--color-shadow);
}
.token-card.copied {
  border-color: var(--color-success);
}
.token-chip {
  position: relative;
  display: flex;
  height: 62px;
  border-bottom: 1px solid var(--color-divider);
}
.chip-half {
  flex: 1;
  transition: flex 0.3s ease;
}
.token-chip.light .chip-dark,
.token-chip.dark .chip-light {
  flex: 0;
  overflow: hidden;
}
.token-chip.light .chip-light,
.token-chip.dark .chip-dark {
  flex: 1;
}
.token-chip.pair .chip-dark {
  border-left: 1px solid rgba(128, 128, 128, 0.28);
}
.chip-flag {
  position: absolute;
  top: 6px;
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.08em;
  padding: 1px 5px;
  border-radius: 4px;
  background: rgba(20, 19, 16, 0.42);
  color: #f4f1ea;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.chip-flag-light {
  left: 6px;
}
.chip-flag-dark {
  right: 6px;
}
.token-card:hover .chip-flag {
  opacity: 1;
}
.token-chip.light .chip-flag-dark,
.token-chip.dark .chip-flag-light {
  display: none;
}
.chip-copied {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--color-success) 82%, transparent);
  color: #fff;
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.chip-copied svg {
  width: 26px;
  height: 26px;
}
.token-card.copied .chip-copied {
  opacity: 1;
  transform: scale(1);
}
.token-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 11px 12px 13px;
}
.token-name {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--color-foreground);
}
.token-var {
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--color-primary);
  word-break: break-all;
}
.token-hexes {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 2px;
}
.token-hex {
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--color-foreground-secondary);
}
.token-hex em {
  font-style: normal;
  color: var(--color-foreground-tertiary);
  margin-right: 3px;
}
.token-usage {
  font-size: 11.5px;
  line-height: 1.5;
  color: var(--color-foreground-tertiary);
  margin-top: 2px;
}
.token-contrast {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 6px;
  padding: 3px 8px;
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.02em;
  background: var(--color-fill);
  color: var(--color-foreground-secondary);
  width: fit-content;
}
.token-contrast svg {
  width: 11px;
  height: 11px;
  flex-shrink: 0;
}
.token-contrast.pass {
  background: color-mix(in srgb, var(--color-success) 14%, var(--color-surface));
  color: var(--color-success);
}
.tokens-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 40px 20px;
  text-align: center;
}
.tokens-empty p {
  margin: 0;
  font-size: 13px;
  color: var(--color-foreground-secondary);
}
.tokens-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 12px 18px;
  border-top: 1px dashed var(--color-divider);
  background: var(--color-surface-secondary);
}
.tokens-foot-note {
  font-size: 11.5px;
  color: var(--color-foreground-tertiary);
}
.tokens-foot-note code {
  font-family: var(--font-mono);
  font-size: 10.5px;
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--color-fill);
  color: var(--color-primary);
}

@media (max-width: 720px) {
  .token-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .tokens-tools {
    width: 100%;
  }
  .tokens-search {
    flex: 1;
  }
  .tokens-search input {
    width: 100%;
  }
}
@media (max-width: 460px) {
  .token-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
