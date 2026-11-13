<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useClipboard } from '@vueuse/core'
import { useMessage } from 'naive-ui'

interface PlaygroundState {
  primary: string
  accent: string
  radius: number
  fontSize: number
  density: number
  border: number
  elevation: number
  dark: boolean
}

const defaults: PlaygroundState = {
  primary: '#f04e23',
  accent: '#2f6bff',
  radius: 12,
  fontSize: 15,
  density: 18,
  border: 1,
  elevation: 24,
  dark: false,
}

const state = reactive<PlaygroundState>({ ...defaults })

const primarySwatches = ['#f04e23', '#d64545', '#d6409f', '#7cb518', '#3e9b4f', '#2f6bff']
const accentSwatches = ['#2f6bff', '#7cb518', '#e8a013', '#d6409f']

function mixHex(hex: string, target: string, weight: number) {
  const parse = (h: string) => [1, 3, 5].map((i) => Number.parseInt(h.slice(i, i + 2), 16))
  const [r1, g1, b1] = parse(hex)
  const [r2, g2, b2] = parse(target)
  const ch = (a: number, b: number) =>
    Math.round(a + (b - a) * weight)
      .toString(16)
      .padStart(2, '0')
  return `#${ch(r1, r2)}${ch(g1, g2)}${ch(b1, b2)}`
}

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const s = Number.parseInt(hex.slice(i, i + 2), 16) / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a: string, b: string) {
  const la = luminance(a)
  const lb = luminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

const onPrimary = computed(() =>
  contrast(state.primary, '#ffffff') >= contrast(state.primary, '#1c1a15') ? '#ffffff' : '#1c1a15',
)
const primaryContrast = computed(() => Math.round(contrast(state.primary, onPrimary.value) * 100) / 100)
const primaryPass = computed(() => primaryContrast.value >= 4.5)

const palette = computed(() =>
  state.dark
    ? { bg: '#141310', surface: '#1c1a16', fg: '#f0ede3', fg2: '#b5b1a2', fg3: '#979280', divider: '#322e25', fill: '#2c2820' }
    : { bg: '#f4f1ea', surface: '#fbfaf6', fg: '#1c1a15', fg2: '#57534a', fg3: '#6c675b', divider: '#dfdacc', fill: '#ece8de' },
)

const previewVars = computed(() => ({
  '--pg-primary': state.primary,
  '--pg-primary-hover': mixHex(state.primary, state.dark ? '#ffffff' : '#000000', 0.14),
  '--pg-on-primary': onPrimary.value,
  '--pg-accent': state.accent,
  '--pg-radius': `${state.radius}px`,
  '--pg-font': `${state.fontSize}px`,
  '--pg-density': `${state.density}px`,
  '--pg-border': `${state.border}px`,
  '--pg-shadow': state.elevation === 0 ? 'none' : `0 ${Math.round(state.elevation * 0.6)}px ${state.elevation}px rgba(0,0,0,${state.dark ? 0.5 : 0.14})`,
  '--pg-bg': palette.value.bg,
  '--pg-surface': palette.value.surface,
  '--pg-fg': palette.value.fg,
  '--pg-fg2': palette.value.fg2,
  '--pg-fg3': palette.value.fg3,
  '--pg-divider': palette.value.divider,
  '--pg-fill': palette.value.fill,
}))

const message = useMessage()
const { copy } = useClipboard()
const exported = ref(false)
let exportedTimer: ReturnType<typeof setTimeout> | undefined

function reset() {
  Object.assign(state, defaults)
  message.info('调参台已重置为默认令牌')
}

function randomize() {
  state.primary = primarySwatches[Math.floor(Math.random() * primarySwatches.length)]
  state.accent = accentSwatches[Math.floor(Math.random() * accentSwatches.length)]
  state.radius = Math.floor(Math.random() * 25)
  state.fontSize = 12 + Math.floor(Math.random() * 7)
  state.density = 8 + Math.floor(Math.random() * 17)
  state.border = Math.floor(Math.random() * 4)
  state.elevation = Math.floor(Math.random() * 49)
  state.dark = Math.random() > 0.5
}

const exportedCss = computed(() => {
  const p = palette.value
  return `:root {
  /* 主色与强调 */
  --color-primary: ${state.primary};
  --color-primary-hover: ${mixHex(state.primary, '#ffffff', 0.18)};
  --color-accent-secondary: ${state.accent};

  /* 度量 */
  --radius-base: ${state.radius}px;
  --font-size-base: ${state.fontSize}px;
  --spacing-base: ${state.density}px;
  --border-width: ${state.border}px;
  --shadow-elevation: ${state.elevation === 0 ? 'none' : `0 ${Math.round(state.elevation * 0.6)}px ${state.elevation}px rgba(0, 0, 0, 0.14)`};

  /* ${state.dark ? '暗色' : '亮色'}中性色 */
  --color-background: ${p.bg};
  --color-surface: ${p.surface};
  --color-foreground: ${p.fg};
  --color-foreground-secondary: ${p.fg2};
  --color-foreground-tertiary: ${p.fg3};
  --color-divider: ${p.divider};
  --color-fill: ${p.fill};
}`
})

async function exportCss() {
  try {
    await copy(exportedCss.value)
    exported.value = true
    message.success('令牌 CSS 已复制到剪贴板')
    if (exportedTimer) clearTimeout(exportedTimer)
    exportedTimer = setTimeout(() => {
      exported.value = false
    }, 1800)
  }
  catch {
    message.warning('当前环境无法访问剪贴板，请手动选择复制')
  }
}

const demoProgress = ref(68)
</script>

<template>
  <section class="pg bm-corner-marks" aria-label="令牌调参台">
    <header class="pg-head">
      <span class="bm-mono-label">TOKEN PLAYGROUND · 令牌调参台</span>
      <span class="pg-status"><i class="pg-dot bm-blink" aria-hidden="true"></i>LIVE</span>
    </header>

    <div class="pg-layout">
      <div class="pg-controls">
        <div class="pg-control pg-control-wide">
          <span class="pg-label">主色 <em>PRIMARY</em></span>
          <div class="pg-swatches">
            <button
              v-for="c in primarySwatches"
              :key="c"
              type="button"
              class="pg-swatch"
              :class="{ active: state.primary === c }"
              :style="{ '--sw': c }"
              :aria-label="`主色 ${c}`"
              @click="state.primary = c"
            ></button>
            <label class="pg-colorpick" title="自定义主色">
              <input v-model="state.primary" type="color" aria-label="自定义主色" />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 3v18M3 12h18" /></svg>
            </label>
          </div>
        </div>

        <div class="pg-control pg-control-wide">
          <span class="pg-label">强调色 <em>ACCENT</em></span>
          <div class="pg-swatches">
            <button
              v-for="c in accentSwatches"
              :key="c"
              type="button"
              class="pg-swatch"
              :class="{ active: state.accent === c }"
              :style="{ '--sw': c }"
              :aria-label="`强调色 ${c}`"
              @click="state.accent = c"
            ></button>
            <label class="pg-colorpick" title="自定义强调色">
              <input v-model="state.accent" type="color" aria-label="自定义强调色" />
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 3v18M3 12h18" /></svg>
            </label>
          </div>
        </div>

        <div class="pg-control">
          <span class="pg-label">圆角 <em>{{ state.radius }}px</em></span>
          <input v-model.number="state.radius" type="range" min="0" max="24" step="1" aria-label="圆角" />
        </div>
        <div class="pg-control">
          <span class="pg-label">字号 <em>{{ state.fontSize }}px</em></span>
          <input v-model.number="state.fontSize" type="range" min="12" max="18" step="1" aria-label="基础字号" />
        </div>
        <div class="pg-control">
          <span class="pg-label">密度 <em>{{ state.density }}px</em></span>
          <input v-model.number="state.density" type="range" min="8" max="24" step="1" aria-label="间距密度" />
        </div>
        <div class="pg-control">
          <span class="pg-label">描边 <em>{{ state.border }}px</em></span>
          <input v-model.number="state.border" type="range" min="0" max="3" step="1" aria-label="描边宽度" />
        </div>
        <div class="pg-control">
          <span class="pg-label">层级 <em>{{ state.elevation }}</em></span>
          <input v-model.number="state.elevation" type="range" min="0" max="48" step="1" aria-label="阴影层级" />
        </div>
        <div class="pg-control">
          <span class="pg-label">暗色预览 <em>DARK</em></span>
          <button
            type="button"
            class="pg-toggle"
            :class="{ on: state.dark }"
            role="switch"
            :aria-checked="state.dark"
            @click="state.dark = !state.dark"
          ><i></i></button>
        </div>

        <div class="pg-actions">
          <button type="button" class="pg-btn" @click="reset">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" /></svg>
            重置
          </button>
          <button type="button" class="pg-btn" @click="randomize">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" /></svg>
            随机
          </button>
          <button type="button" class="pg-btn pg-btn-primary" @click="exportCss">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path v-if="!exported" d="M12 3v12M7 10l5 5 5-5M4 21h16" /><path v-else d="M4 12.5 9.5 18 20 6.5" /></svg>
            {{ exported ? '已复制' : '导出 CSS' }}
          </button>
        </div>

        <p class="pg-readout" aria-live="polite">
          {{ state.primary }} · {{ state.accent }} · r{{ state.radius }} · {{ state.fontSize }}px
          <span class="pg-contrast" :class="{ pass: primaryPass }">主色/字 {{ primaryContrast }}:1 {{ primaryPass ? 'AA✓' : 'AA✗' }}</span>
        </p>
      </div>

      <div class="pg-preview" :style="previewVars">
        <div class="pg-card">
          <div class="pg-card-top">
            <span class="pg-card-label">PRODUCTION · 产能概览</span>
            <span class="pg-card-badge">实时</span>
          </div>
          <h4 class="pg-card-title">本月精炼产能</h4>
          <div class="pg-card-metric">
            <span class="pg-metric-num">1,284</span>
            <span class="pg-metric-unit">吨</span>
            <span class="pg-metric-delta">▲ 12.4%</span>
          </div>
          <p class="pg-card-body">所有令牌即时作用于这张卡片：表面、描边、圆角、间距与层级均由左侧控件驱动。</p>
          <div class="pg-card-tags">
            <span class="pg-tag pg-tag-accent">配置化</span>
            <span class="pg-tag pg-tag-success">就绪</span>
            <span class="pg-tag pg-tag-warning">迭代中</span>
          </div>
          <div class="pg-card-progress">
            <div class="pg-progress-head">
              <span>季度目标</span>
              <span class="pg-progress-val">{{ demoProgress }}%</span>
            </div>
            <div class="pg-progress-track">
              <div class="pg-progress-fill" :style="{ width: demoProgress + '%' }"></div>
            </div>
            <input v-model.number="demoProgress" type="range" min="0" max="100" step="1" aria-label="进度演示" class="pg-progress-slider" />
          </div>
          <div class="pg-card-actions">
            <button type="button" class="pg-card-btn pg-card-btn-primary">主要操作</button>
            <button type="button" class="pg-card-btn">次要操作</button>
          </div>
          <div class="pg-card-alert">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5 9.5 18 20 6.5" /></svg>
            令牌已实时应用，导出即可用于业务项目。
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pg {
  border: 1px solid var(--color-divider);
  border-radius: 14px;
  background: var(--color-surface);
  box-shadow: 0 18px 50px var(--color-shadow);
  overflow: hidden;
}
.pg-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  border-bottom: 1px dashed var(--color-divider);
}
.pg-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  color: var(--color-success);
}
.pg-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-success);
}
.pg-layout {
  display: grid;
  grid-template-columns: minmax(280px, 340px) minmax(0, 1fr);
}
.pg-controls {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 16px;
  padding: 18px;
  border-right: 1px solid var(--color-divider);
  align-content: start;
}
.pg-control {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}
.pg-control-wide {
  grid-column: 1 / -1;
}
.pg-label {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-foreground-secondary);
}
.pg-label em {
  font-style: normal;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--color-primary);
}
.pg-swatches {
  display: flex;
  align-items: center;
  gap: 7px;
  flex-wrap: wrap;
}
.pg-swatch {
  width: 24px;
  height: 24px;
  border-radius: 7px;
  border: 2px solid transparent;
  background: var(--sw);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.pg-swatch:hover {
  transform: scale(1.12);
}
.pg-swatch.active {
  box-shadow: 0 0 0 2px var(--color-surface), 0 0 0 4px var(--sw);
}
.pg-colorpick {
  position: relative;
  width: 24px;
  height: 24px;
  border-radius: 7px;
  border: 1.5px dashed var(--color-input-border);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-foreground-tertiary);
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.2s ease, color 0.2s ease;
}
.pg-colorpick:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.pg-colorpick svg {
  width: 12px;
  height: 12px;
  pointer-events: none;
}
.pg-colorpick input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}
.pg-control input[type='range'] {
  width: 100%;
  height: 22px;
  accent-color: var(--color-primary);
  cursor: pointer;
}
.pg-toggle {
  width: 42px;
  height: 24px;
  border-radius: 24px;
  border: 1px solid var(--color-divider);
  background: var(--color-fill);
  cursor: pointer;
  position: relative;
  transition: background-color 0.25s ease, border-color 0.25s ease;
}
.pg-toggle i {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-surface);
  box-shadow: 0 1px 4px var(--color-shadow);
  transition: transform 0.25s cubic-bezier(0.19, 1, 0.22, 1);
}
.pg-toggle.on {
  background: var(--color-primary);
  border-color: var(--color-primary);
}
.pg-toggle.on i {
  transform: translateX(18px);
  background: #fff;
}
.pg-actions {
  grid-column: 1 / -1;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.pg-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 13px;
  border-radius: 8px;
  border: 1px solid var(--color-divider);
  background: var(--color-surface);
  font-family: var(--font-sans);
  font-size: 12.5px;
  font-weight: 500;
  color: var(--color-foreground-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}
.pg-btn svg {
  width: 14px;
  height: 14px;
}
.pg-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-hover);
}
.pg-btn:active {
  transform: scale(0.96);
}
.pg-btn-primary {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}
.pg-btn-primary:hover {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
  color: #fff;
}
.pg-readout {
  grid-column: 1 / -1;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.04em;
  color: var(--color-foreground-tertiary);
  border-top: 1px dashed var(--color-divider);
  padding-top: 12px;
}
.pg-contrast {
  padding: 2px 7px;
  border-radius: 5px;
  background: color-mix(in srgb, var(--color-danger) 14%, var(--color-surface));
  color: var(--color-danger);
}
.pg-contrast.pass {
  background: color-mix(in srgb, var(--color-success) 14%, var(--color-surface));
  color: var(--color-success);
}

/* --- 预览：全部消费 --pg-* 令牌 --- */
.pg-preview {
  padding: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--pg-bg);
  background-image: radial-gradient(color-mix(in srgb, var(--pg-fg) 9%, transparent) 1px, transparent 1px);
  background-size: 16px 16px;
  transition: background-color 0.3s ease;
  min-width: 0;
}
.pg-card {
  width: 100%;
  max-width: 380px;
  padding: var(--pg-density);
  border-radius: var(--pg-radius);
  border: var(--pg-border) solid var(--pg-divider);
  background: var(--pg-surface);
  box-shadow: var(--pg-shadow);
  color: var(--pg-fg);
  font-size: var(--pg-font);
  display: flex;
  flex-direction: column;
  gap: calc(var(--pg-density) * 0.62);
  transition: border-radius 0.2s ease, padding 0.2s ease, background-color 0.3s ease, box-shadow 0.2s ease;
}
.pg-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.pg-card-label {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.12em;
  color: var(--pg-fg3);
}
.pg-card-badge {
  font-family: var(--font-mono);
  font-size: 9.5px;
  padding: 2px 8px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--pg-primary) 16%, var(--pg-surface));
  color: var(--pg-primary);
}
.pg-card-title {
  margin: 0;
  font-family: var(--font-serif);
  font-weight: 400;
  font-size: calc(var(--pg-font) * 1.5);
  line-height: 1.2;
  color: var(--pg-fg);
}
.pg-card-metric {
  display: flex;
  align-items: baseline;
  gap: 7px;
}
.pg-metric-num {
  font-family: var(--font-mono);
  font-size: calc(var(--pg-font) * 2.1);
  font-weight: 500;
  line-height: 1;
  color: var(--pg-fg);
}
.pg-metric-unit {
  font-size: calc(var(--pg-font) * 0.86);
  color: var(--pg-fg3);
}
.pg-metric-delta {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: calc(var(--pg-font) * 0.78);
  padding: 2px 8px;
  border-radius: 6px;
  background: color-mix(in srgb, #3e9b4f 16%, var(--pg-surface));
  color: #3e9b4f;
}
.pg-card-body {
  margin: 0;
  font-size: calc(var(--pg-font) * 0.9);
  line-height: 1.7;
  color: var(--pg-fg2);
}
.pg-card-tags {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
}
.pg-tag {
  font-size: calc(var(--pg-font) * 0.76);
  padding: 3px 10px;
  border-radius: calc(var(--pg-radius) * 0.5);
  border: 1px solid transparent;
}
.pg-tag-accent {
  background: color-mix(in srgb, var(--pg-accent) 15%, var(--pg-surface));
  color: var(--pg-accent);
  border-color: color-mix(in srgb, var(--pg-accent) 32%, transparent);
}
.pg-tag-success {
  background: color-mix(in srgb, #3e9b4f 15%, var(--pg-surface));
  color: #3e9b4f;
  border-color: color-mix(in srgb, #3e9b4f 32%, transparent);
}
.pg-tag-warning {
  background: color-mix(in srgb, #e8a013 16%, var(--pg-surface));
  color: #b57d0a;
  border-color: color-mix(in srgb, #e8a013 34%, transparent);
}
.pg-card-progress {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.pg-progress-head {
  display: flex;
  justify-content: space-between;
  font-size: calc(var(--pg-font) * 0.82);
  color: var(--pg-fg2);
}
.pg-progress-val {
  font-family: var(--font-mono);
  color: var(--pg-primary);
}
.pg-progress-track {
  height: 8px;
  border-radius: 999px;
  background: var(--pg-fill);
  overflow: hidden;
}
.pg-progress-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--pg-primary), var(--pg-accent));
  transition: width 0.2s ease;
}
.pg-progress-slider {
  width: 100%;
  height: 18px;
  accent-color: var(--pg-primary);
  cursor: pointer;
}
.pg-card-actions {
  display: flex;
  gap: 9px;
  flex-wrap: wrap;
}
.pg-card-btn {
  flex: 1;
  min-width: 96px;
  padding: calc(var(--pg-density) * 0.5) 14px;
  border-radius: var(--pg-radius);
  border: var(--pg-border) solid var(--pg-divider);
  background: var(--pg-surface);
  color: var(--pg-fg2);
  font-family: var(--font-sans);
  font-size: calc(var(--pg-font) * 0.9);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}
.pg-card-btn:hover {
  border-color: var(--pg-primary);
  color: var(--pg-primary);
}
.pg-card-btn-primary {
  background: var(--pg-primary);
  border-color: var(--pg-primary);
  color: var(--pg-on-primary);
}
.pg-card-btn-primary:hover {
  background: var(--pg-primary-hover);
  border-color: var(--pg-primary-hover);
  color: var(--pg-on-primary);
}
.pg-card-alert {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: calc(var(--pg-density) * 0.55) 12px;
  border-radius: calc(var(--pg-radius) * 0.7);
  background: color-mix(in srgb, #3e9b4f 12%, var(--pg-surface));
  color: #3e9b4f;
  font-size: calc(var(--pg-font) * 0.82);
  line-height: 1.5;
}
.pg-card-alert svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

@media (max-width: 760px) {
  .pg-layout {
    grid-template-columns: minmax(0, 1fr);
  }
  .pg-controls {
    border-right: none;
    border-bottom: 1px solid var(--color-divider);
  }
}
@media (max-width: 420px) {
  .pg-controls {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
