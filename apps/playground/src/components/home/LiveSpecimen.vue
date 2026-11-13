<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import {
  NAlert,
  NButton,
  NConfigProvider,
  NInput,
  NProgress,
  NRate,
  NSlider,
  NSwitch,
  NTag,
  darkTheme,
  useMessage,
} from 'naive-ui'
import { useClipboard } from '@vueuse/core'

interface SpecimenState {
  accent: string
  radius: number
  size: 'small' | 'medium' | 'large'
  fontSize: number
  compact: boolean
  ghost: boolean
  dark: boolean
}

const defaults: SpecimenState = {
  accent: '#f04e23',
  radius: 6,
  size: 'medium',
  fontSize: 14,
  compact: false,
  ghost: false,
  dark: false,
}

const state = reactive<SpecimenState>({ ...defaults })

const swatches = [
  { name: '朱红', value: '#f04e23' },
  { name: '电蓝', value: '#2f6bff' },
  { name: '酸绿', value: '#7cb518' },
  { name: '琥珀', value: '#e8a013' },
  { name: '品红', value: '#d6409f' },
]

const sizes = [
  { label: 'S', value: 'small' },
  { label: 'M', value: 'medium' },
  { label: 'L', value: 'large' },
] as const

function mixHex(hex: string, target: string, weight: number) {
  const parse = (h: string) => [1, 3, 5].map(i => Number.parseInt(h.slice(i, i + 2), 16))
  const [r1, g1, b1] = parse(hex)
  const [r2, g2, b2] = parse(target)
  const ch = (a: number, b: number) =>
    Math.round(a + (b - a) * weight)
      .toString(16)
      .padStart(2, '0')
  return `#${ch(r1, r2)}${ch(g1, g2)}${ch(b1, b2)}`
}

const heights = { small: '28px', medium: '34px', large: '40px' }

const themeOverrides = computed(() => ({
  common: {
    primaryColor: state.accent,
    primaryColorHover: mixHex(state.accent, '#ffffff', 0.18),
    primaryColorPressed: mixHex(state.accent, '#000000', 0.16),
    primaryColorSuppl: state.accent,
    borderRadius: `${state.radius}px`,
    borderRadiusSmall: `${Math.max(2, state.radius - 2)}px`,
    fontSize: `${state.fontSize}px`,
    fontSizeSmall: `${state.fontSize - 1}px`,
    fontSizeMedium: `${state.fontSize}px`,
    fontSizeLarge: `${state.fontSize + 1}px`,
    heightSmall: heights.small,
    heightMedium: heights[state.size],
    heightLarge: heights.large,
  },
  Button: {
    fontWeight: '500',
    // naive-ui Button 的圆角经 common.borderRadius → self() 派生时不会随覆盖响应式更新，
    // 直接在 Button 层覆盖各尺寸圆角，确保滑块实时生效
    borderRadiusTiny: `${state.radius}px`,
    borderRadiusSmall: `${state.radius}px`,
    borderRadiusMedium: `${state.radius}px`,
    borderRadiusLarge: `${state.radius}px`,
  },
}))

const message = useMessage()
const { copy } = useClipboard()
const exported = ref(false)

function reset() {
  Object.assign(state, defaults)
  message.info('标本已重置为默认主题')
}

function randomize() {
  state.accent = swatches[Math.floor(Math.random() * swatches.length)].value
  state.radius = Math.floor(Math.random() * 17)
  state.size = sizes[Math.floor(Math.random() * sizes.length)].value
  state.fontSize = 12 + Math.floor(Math.random() * 5)
  state.compact = Math.random() > 0.5
  state.ghost = Math.random() > 0.6
}

async function exportTheme() {
  await copy(JSON.stringify(themeOverrides.value, null, 2))
  exported.value = true
  message.success('主题配置 JSON 已复制到剪贴板')
  setTimeout(() => {
    exported.value = false
  }, 1800)
}

const demoInput = ref('')
const demoSwitch = ref(true)
const demoSlider = ref(42)
const demoRate = ref(4)
</script>

<template>
  <section class="specimen bm-corner-marks" aria-label="实时主题标本">
    <header class="specimen-head">
      <span class="bm-mono-label">LIVE SPECIMEN · 实时标本</span>
      <span class="specimen-status">
        <i class="specimen-dot bm-blink" aria-hidden="true"></i>
        RUNNING
      </span>
    </header>

    <div class="specimen-preview" :class="{ 'is-dark': state.dark, 'is-compact': state.compact }">
      <NConfigProvider
        :theme="state.dark ? darkTheme : null"
        :theme-overrides="themeOverrides"
        class="specimen-provider"
      >
        <div class="specimen-stage">
          <div class="specimen-row">
            <NButton type="primary" :ghost="state.ghost">主要操作</NButton>
            <NButton :dashed="state.ghost">次要操作</NButton>
            <NButton quaternary>文字按钮</NButton>
          </div>
          <div class="specimen-row">
            <NTag type="primary" size="small">配置化</NTag>
            <NTag type="info" size="small">TypeScript</NTag>
            <NTag type="success" size="small">就绪</NTag>
            <NTag type="warning" size="small">迭代中</NTag>
            <NTag type="error" size="small">废弃</NTag>
          </div>
          <div class="specimen-row specimen-row-grow">
            <NInput v-model:value="demoInput" placeholder="输入组件名称…" clearable />
            <NSwitch v-model:value="demoSwitch" />
          </div>
          <div class="specimen-row specimen-row-grow">
            <NSlider v-model:value="demoSlider" :step="1" />
            <NProgress
              type="line"
              :percentage="demoSlider"
              :indicator-placement="'inside'"
              processing
              :height="10"
              :border-radius="state.radius"
            />
          </div>
          <div class="specimen-row">
            <NRate v-model:value="demoRate" />
            <span class="specimen-rate-label">{{ demoRate }}.0 / 5.0</span>
          </div>
          <NAlert type="success" :bordered="false" class="specimen-alert">
            所有参数已实时应用到上方真实组件
          </NAlert>
        </div>
      </NConfigProvider>
    </div>

    <div class="specimen-controls">
      <div class="specimen-control specimen-control-wide">
        <span class="specimen-label">主题色 <em>ACCENT</em></span>
        <div class="specimen-swatches">
          <button
            v-for="s in swatches"
            :key="s.value"
            type="button"
            class="specimen-swatch"
            :class="{ active: state.accent === s.value }"
            :style="{ '--sw': s.value }"
            :title="s.name"
            :aria-label="`主题色 ${s.name}`"
            @click="state.accent = s.value"
          ></button>
          <label class="specimen-colorpick" title="自定义颜色">
            <input v-model="state.accent" type="color" aria-label="自定义主题色" />
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
              <path d="M12 3v18M3 12h18" />
            </svg>
          </label>
        </div>
      </div>

      <div class="specimen-control">
        <span class="specimen-label">圆角 <em>{{ state.radius }}px</em></span>
        <input v-model.number="state.radius" type="range" min="0" max="16" step="1" aria-label="圆角" />
      </div>

      <div class="specimen-control">
        <span class="specimen-label">字号 <em>{{ state.fontSize }}px</em></span>
        <input v-model.number="state.fontSize" type="range" min="12" max="16" step="1" aria-label="字号" />
      </div>

      <div class="specimen-control">
        <span class="specimen-label">尺寸 <em>SIZE</em></span>
        <div class="specimen-segment" role="group" aria-label="组件尺寸">
          <button
            v-for="s in sizes"
            :key="s.value"
            type="button"
            :class="{ active: state.size === s.value }"
            @click="state.size = s.value"
          >
            {{ s.label }}
          </button>
        </div>
      </div>

      <div class="specimen-control">
        <span class="specimen-label">紧凑密度 <em>DENSITY</em></span>
        <button
          type="button"
          class="specimen-toggle"
          :class="{ on: state.compact }"
          role="switch"
          :aria-checked="state.compact"
          @click="state.compact = !state.compact"
        >
          <i></i>
        </button>
      </div>

      <div class="specimen-control">
        <span class="specimen-label">描边模式 <em>GHOST</em></span>
        <button
          type="button"
          class="specimen-toggle"
          :class="{ on: state.ghost }"
          role="switch"
          :aria-checked="state.ghost"
          @click="state.ghost = !state.ghost"
        >
          <i></i>
        </button>
      </div>

      <div class="specimen-control">
        <span class="specimen-label">标本深色 <em>DARK</em></span>
        <button
          type="button"
          class="specimen-toggle"
          :class="{ on: state.dark }"
          role="switch"
          :aria-checked="state.dark"
          @click="state.dark = !state.dark"
        >
          <i></i>
        </button>
      </div>

      <div class="specimen-actions">
        <button type="button" class="specimen-btn" @click="reset">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" />
          </svg>
          重置
        </button>
        <button type="button" class="specimen-btn" @click="randomize">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
          </svg>
          随机
        </button>
        <button type="button" class="specimen-btn specimen-btn-primary" @click="exportTheme">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path v-if="!exported" d="M12 3v12M7 10l5 5 5-5M4 21h16" />
            <path v-else d="M4 12.5 9.5 18 20 6.5" />
          </svg>
          {{ exported ? '已复制' : '导出主题' }}
        </button>
      </div>

      <p class="specimen-readout" aria-live="polite">
        {{ state.accent }} · r{{ state.radius }} · {{ state.size }} · {{ state.fontSize }}px
        <template v-if="state.compact"> · compact</template>
        <template v-if="state.ghost"> · ghost</template>
        <template v-if="state.dark"> · dark</template>
      </p>
    </div>
  </section>
</template>

<style scoped>
.specimen {
  border: 1px solid var(--color-divider);
  border-radius: 14px;
  background: var(--color-surface);
  box-shadow: 0 20px 60px var(--color-shadow);
  overflow: hidden;
}
.specimen-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  border-bottom: 1px dashed var(--color-divider);
}
.specimen-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  color: var(--color-success);
}
.specimen-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-success);
}
.specimen-preview {
  --spec-pad: 22px;
  padding: var(--spec-pad);
  background-color: var(--color-background-secondary);
  background-image: radial-gradient(var(--bm-grid-line-strong) 1px, transparent 1px);
  background-size: 16px 16px;
  transition: background-color 0.3s ease, padding 0.3s ease;
}
.specimen-preview.is-compact {
  --spec-pad: 12px;
}
.specimen-preview.is-dark {
  background-color: #161512;
  background-image: radial-gradient(rgba(240, 237, 227, 0.08) 1px, transparent 1px);
}
.specimen-stage {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.is-compact .specimen-stage {
  gap: 8px;
}
.specimen-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.specimen-row-grow {
  flex-wrap: nowrap;
}
.specimen-row-grow > :first-child {
  flex: 1;
  min-width: 0;
}
.specimen-row-grow > :last-child {
  flex: 1;
  min-width: 0;
}
.specimen-rate-label {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-foreground-tertiary);
}
.is-dark .specimen-rate-label {
  color: #979280;
}
.specimen-alert {
  margin-top: 2px;
}

.specimen-controls {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px 18px;
  padding: 18px;
  border-top: 1px solid var(--color-divider);
  background: var(--color-surface);
}
.specimen-control {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}
.specimen-control-wide {
  grid-column: 1 / -1;
}
.specimen-label {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-foreground-secondary);
}
.specimen-label em {
  font-style: normal;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  color: var(--color-foreground-tertiary);
}
.specimen-swatches {
  display: flex;
  align-items: center;
  gap: 8px;
}
.specimen-swatch {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  border: 2px solid transparent;
  background: var(--sw);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
}
.specimen-swatch:hover {
  transform: scale(1.12);
}
.specimen-swatch.active {
  box-shadow: 0 0 0 2px var(--color-surface), 0 0 0 4px var(--sw);
}
.specimen-colorpick {
  position: relative;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  border: 1.5px dashed var(--color-input-border);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--color-foreground-tertiary);
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.2s ease, color 0.2s ease;
}
.specimen-colorpick:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.specimen-colorpick svg {
  width: 12px;
  height: 12px;
  pointer-events: none;
}
.specimen-colorpick input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}
.specimen-control input[type='range'] {
  width: 100%;
  height: 22px;
  accent-color: var(--color-primary);
  cursor: pointer;
}
.specimen-segment {
  display: inline-flex;
  border: 1px solid var(--color-divider);
  border-radius: 8px;
  overflow: hidden;
  width: fit-content;
}
.specimen-segment button {
  padding: 5px 14px;
  border: none;
  background: transparent;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--color-foreground-secondary);
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}
.specimen-segment button + button {
  border-left: 1px solid var(--color-divider);
}
.specimen-segment button.active {
  background: var(--color-primary);
  color: #fff;
}
.specimen-toggle {
  width: 42px;
  height: 24px;
  border-radius: 24px;
  border: 1px solid var(--color-divider);
  background: var(--color-fill);
  cursor: pointer;
  position: relative;
  transition: background-color 0.25s ease, border-color 0.25s ease;
}
.specimen-toggle i {
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
.specimen-toggle.on {
  background: var(--color-primary);
  border-color: var(--color-primary);
}
.specimen-toggle.on i {
  transform: translateX(18px);
  background: #fff;
}
.specimen-actions {
  grid-column: 1 / -1;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.specimen-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
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
.specimen-btn svg {
  width: 14px;
  height: 14px;
}
.specimen-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-hover);
}
.specimen-btn:active {
  transform: scale(0.96);
}
.specimen-btn-primary {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}
.specimen-btn-primary:hover {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
  color: #fff;
}
.specimen-readout {
  grid-column: 1 / -1;
  margin: 0;
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.06em;
  color: var(--color-foreground-tertiary);
  border-top: 1px dashed var(--color-divider);
  padding-top: 12px;
}

@media (max-width: 560px) {
  .specimen-controls {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>