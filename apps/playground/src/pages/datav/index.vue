<route lang="yaml">
meta:
  layout: default
</route>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Chart } from '@banmao/datav'
import { NColorPicker, NInput, NSlider, useMessage } from 'naive-ui'
import { t } from '@/locales'

interface DataItem {
  name: string
  value: number
  phone: number
}

const message = useMessage()

const seedData: DataItem[] = [
  { name: 'Mon', value: 1548, phone: 234 },
  { name: 'Tue', value: 2125, phone: 345 },
  { name: 'Wed', value: 1520, phone: 124 },
  { name: 'Thu', value: 3498, phone: 423 },
  { name: 'Fri', value: 3200, phone: 389 },
  { name: 'Sat', value: 3181, phone: 460 },
  { name: 'Sun', value: 2789, phone: 310 },
]

function initialState() {
  return {
    title: t('datav.defaultChartTitle'),
    type: 'bar' as 'bar' | 'line' | 'scatter',
    vertical: false,
    barWidth: 14,
    gradient: true,
    legend: true,
    solidA: '#f04e23',
    solidB: '#2f6bff',
    gradA1: '#f04e23',
    gradA2: '#e8a013',
    gradB1: '#2f6bff',
    gradB2: '#22d3ee',
  }
}

const state = ref(initialState())
const data = ref<DataItem[]>(seedData.map(item => ({ ...item })))
const stageRef = ref<HTMLElement | null>(null)

const seriesType = computed(() => [
  {
    type: state.value.type,
    color: state.value.gradient
      ? [state.value.gradA1, state.value.gradA2]
      : state.value.solidA,
  },
  {
    type: state.value.type,
    color: state.value.gradient
      ? [state.value.gradB1, state.value.gradB2]
      : state.value.solidB,
  },
])

const verticalActive = computed(() => state.value.type === 'bar' && state.value.vertical)

const xAxis = computed(() => ({ type: verticalActive.value ? 'value' : 'category' }))
const yAxis = computed(() => ({ type: verticalActive.value ? 'category' : 'value' }))

const legend = computed(() => ({
  show: state.value.legend,
  mapData: { value: t('datav.seriesSales'), phone: t('datav.seriesVisits') },
  top: 8,
  right: 12,
}))

const chartTitle = computed(() => ({
  text: state.value.title,
  left: 12,
  top: 8,
  textStyle: { fontSize: 14, color: '#1c1a15', fontWeight: 600 },
}))

function reset() {
  state.value = initialState()
  data.value = seedData.map(item => ({ ...item }))
  message.success(t('datav.resetSuccess'))
}

function randomize() {
  data.value = data.value.map(item => ({
    ...item,
    value: Math.round(800 + Math.random() * 3200),
    phone: Math.round(100 + Math.random() * 500),
  }))
}

function exportPng() {
  const source = stageRef.value?.querySelector('canvas')
  if (!source) {
    message.warning(t('datav.exportNotReady'))
    return
  }
  const canvas = document.createElement('canvas')
  canvas.width = source.width
  canvas.height = source.height
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.fillStyle = '#fbfaf6'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(source, 0, 0)
  const link = document.createElement('a')
  link.href = canvas.toDataURL('image/png')
  link.download = `${state.value.title || 'chart'}.png`
  link.click()
  message.success(t('datav.exportSuccess'))
}

const gallery = computed(() => [
  { name: t('datav.galleryChartName'), desc: t('datav.galleryChartDesc'), url: '/datav/bar_line' },
  { name: t('datav.galleryPieName'), desc: t('datav.galleryPieDesc'), url: '/datav/pie' },
  { name: t('datav.galleryCircleBarName'), desc: t('datav.galleryCircleBarDesc'), url: '/datav/circle_bar' },
  { name: t('datav.galleryCubeBarName'), desc: t('datav.galleryCubeBarDesc'), url: '/datav/cube_bar' },
])
</script>

<template>
  <div class="workshop">
    <header class="workshop-head">
      <p class="bm-mono-label workshop-kicker">DATA V · CHART WORKSHOP</p>
      <h1 class="workshop-title">{{ t('datav.workshopTitle') }}</h1>
      <p class="workshop-desc">
        {{ t('datav.workshopDesc') }}
      </p>
    </header>

    <div class="workshop-body">
      <!-- 常驻控制台 -->
      <aside class="panel bm-corner-marks">
        <div class="panel-head">
          <p class="bm-mono-label">{{ t('datav.controlDeck') }}</p>
          <span class="panel-live bm-mono-label"><i class="bm-blink" />LIVE</span>
        </div>

        <div class="panel-field">
          <label class="panel-label" for="chart-title">{{ t('datav.chartTitleLabel') }}</label>
          <NInput id="chart-title" v-model:value="state.title" size="small" :placeholder="t('datav.titlePlaceholder')" />
        </div>

        <div class="panel-field">
          <span class="panel-label">{{ t('datav.chartTypeLabel') }}</span>
          <div class="segment" role="radiogroup" :aria-label="t('datav.chartTypeLabel')">
            <button
              v-for="kind in (['bar', 'line', 'scatter'] as const)"
              :key="kind"
              type="button"
              role="radio"
              :aria-checked="state.type === kind"
              :class="{ 'is-active': state.type === kind }"
              @click="state.type = kind"
            >
              {{ kind === 'bar' ? t('datav.typeBar') : kind === 'line' ? t('datav.typeLine') : t('datav.typeScatter') }}
            </button>
          </div>
        </div>

        <div v-if="state.type === 'bar'" class="panel-field panel-row">
          <span class="panel-label">{{ t('datav.verticalLabel') }}</span>
          <button
            type="button"
            class="toggle"
            role="switch"
            :aria-checked="state.vertical"
            :class="{ 'is-on': state.vertical }"
            @click="state.vertical = !state.vertical"
          >
            <i />
          </button>
        </div>

        <div v-if="state.type === 'bar'" class="panel-field">
          <label class="panel-label" for="chart-bar-width">
            {{ t('datav.barWidthLabel') }} <em class="panel-value">{{ state.barWidth }}px</em>
          </label>
          <NSlider id="chart-bar-width" v-model:value="state.barWidth" :min="6" :max="48" :step="1" />
        </div>

        <div class="panel-field panel-row">
          <span class="panel-label">{{ t('datav.gradientLabel') }}</span>
          <button
            type="button"
            class="toggle"
            role="switch"
            :aria-checked="state.gradient"
            :class="{ 'is-on': state.gradient }"
            @click="state.gradient = !state.gradient"
          >
            <i />
          </button>
        </div>

        <div class="panel-field panel-row">
          <span class="panel-label">{{ t('datav.legendLabel') }}</span>
          <button
            type="button"
            class="toggle"
            role="switch"
            :aria-checked="state.legend"
            :class="{ 'is-on': state.legend }"
            @click="state.legend = !state.legend"
          >
            <i />
          </button>
        </div>

        <div class="panel-field">
          <span class="panel-label">{{ t('datav.seriesALabel', { name: t('datav.seriesSales') }) }}</span>
          <div v-if="state.gradient" class="color-pair">
            <NColorPicker v-model:value="state.gradA1" size="small" :show-alpha="false" :modes="['hex']" />
            <NColorPicker v-model:value="state.gradA2" size="small" :show-alpha="false" :modes="['hex']" />
          </div>
          <NColorPicker v-else v-model:value="state.solidA" size="small" :show-alpha="false" :modes="['hex']" />
        </div>

        <div class="panel-field">
          <span class="panel-label">{{ t('datav.seriesBLabel', { name: t('datav.seriesVisits') }) }}</span>
          <div v-if="state.gradient" class="color-pair">
            <NColorPicker v-model:value="state.gradB1" size="small" :show-alpha="false" :modes="['hex']" />
            <NColorPicker v-model:value="state.gradB2" size="small" :show-alpha="false" :modes="['hex']" />
          </div>
          <NColorPicker v-else v-model:value="state.solidB" size="small" :show-alpha="false" :modes="['hex']" />
        </div>

        <div class="panel-actions">
          <button type="button" class="panel-btn" @click="reset">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" />
            </svg>
            {{ t('datav.reset') }}
          </button>
          <button type="button" class="panel-btn" @click="randomize">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="4" />
              <circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" />
              <circle cx="15.5" cy="15.5" r="1.2" fill="currentColor" />
              <circle cx="15.5" cy="8.5" r="1.2" fill="currentColor" />
              <circle cx="8.5" cy="15.5" r="1.2" fill="currentColor" />
            </svg>
            {{ t('datav.randomize') }}
          </button>
          <button type="button" class="panel-btn is-primary" @click="exportPng">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 3v12M7 10l5 5 5-5M4 21h16" />
            </svg>
            {{ t('datav.exportPng') }}
          </button>
        </div>
      </aside>

      <!-- 图表舞台 -->
      <div class="stage">
        <div class="stage-bar">
          <span class="bm-mono-label">FIG.01 — REALTIME PREVIEW</span>
          <span class="bm-mono-label stage-readout">
            {{ state.type.toUpperCase() }} · {{ data.length }} PTS · {{ state.gradient ? 'GRADIENT' : 'SOLID' }}
          </span>
        </div>
        <div ref="stageRef" class="chart-paper">
          <Chart
            :title="chartTitle"
            :legend="legend"
            trigger-type="axis"
            :bar-width="state.barWidth"
            :x-axis="xAxis"
            :y-axis="yAxis"
            :series-type="seriesType"
            :data="data"
          />
        </div>
        <p class="stage-note bm-mono-label">{{ t('datav.stageNote') }}</p>
      </div>
    </div>

    <!-- 更多图表 -->
    <section class="more">
      <p class="bm-mono-label more-kicker">{{ t('datav.moreCharts') }}</p>
      <div class="more-grid">
        <RouterLink v-for="item in gallery" :key="item.url" :to="item.url" class="more-card">
          <div>
            <h2 class="more-name">{{ item.name }}</h2>
            <p class="more-desc">{{ item.desc }}</p>
          </div>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.workshop-head {
  margin-bottom: 30px;
}
.workshop-kicker {
  color: var(--color-primary);
}
.workshop-title {
  margin: 12px 0 0;
  font-family: var(--font-serif);
  font-weight: 400;
  font-size: clamp(30px, 4vw, 42px);
  line-height: 1.2;
  color: var(--color-foreground);
}
.workshop-desc {
  margin: 14px 0 0;
  max-width: 640px;
  font-size: 14.5px;
  line-height: 1.85;
  color: var(--color-foreground-secondary);
}

.workshop-body {
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

/* --- 控制台 --- */
.panel {
  position: sticky;
  top: calc(var(--layout-header-height) + 24px);
  padding: 22px 20px;
  border: 1px solid var(--color-divider);
  border-radius: 14px;
  background: var(--color-surface);
}
.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 1px dashed var(--color-divider);
}
.panel-live {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--color-primary);
}
.panel-live i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-primary);
}

.panel-field {
  margin-bottom: 16px;
}
.panel-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.panel-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 7px;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--color-foreground-secondary);
}
.panel-row .panel-label {
  margin-bottom: 0;
}
.panel-value {
  font-style: normal;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-primary);
}

.segment {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3px;
  padding: 3px;
  border: 1px solid var(--color-divider);
  border-radius: 9px;
  background: var(--color-background-secondary);
}
.segment button {
  padding: 6px 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  font-size: 12.5px;
  color: var(--color-foreground-secondary);
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}
.segment button:hover {
  color: var(--color-foreground);
}
.segment button.is-active {
  background: var(--color-primary);
  color: #fff;
  font-weight: 600;
}

.toggle {
  position: relative;
  width: 38px;
  height: 21px;
  flex-shrink: 0;
  border: 1px solid var(--color-divider);
  border-radius: 999px;
  background: var(--color-fill);
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}
.toggle i {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: var(--color-surface);
  box-shadow: 0 1px 3px var(--color-shadow);
  transition: transform 0.2s cubic-bezier(0.19, 1, 0.22, 1);
}
.toggle.is-on {
  background: var(--color-primary);
  border-color: var(--color-primary);
}
.toggle.is-on i {
  transform: translateX(17px);
  background: #fff;
}

.color-pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.panel-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px dashed var(--color-divider);
}
.panel-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 10px;
  border: 1px solid var(--color-divider);
  border-radius: 9px;
  background: transparent;
  font-size: 12.5px;
  color: var(--color-foreground-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}
.panel-btn svg {
  width: 14px;
  height: 14px;
}
.panel-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 7%, transparent);
}
.panel-btn.is-primary {
  grid-column: 1 / -1;
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
  font-weight: 600;
}
.panel-btn.is-primary:hover {
  background: var(--color-primary-hover);
  color: #fff;
}

/* --- 舞台 --- */
.stage {
  min-width: 0;
}
.stage-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
  color: var(--color-foreground-tertiary);
}
.stage-readout {
  color: var(--color-primary);
}
.chart-paper {
  height: 460px;
  padding: 10px;
  border: 1px solid #dfdacc;
  border-radius: 14px;
  background: #fbfaf6;
  box-shadow: 0 16px 48px var(--color-shadow);
}
.stage-note {
  margin: 12px 4px 0;
  color: var(--color-foreground-tertiary);
}

/* --- 更多图表 --- */
.more {
  margin-top: 48px;
}
.more-kicker {
  margin-bottom: 14px;
  color: var(--color-foreground-tertiary);
}
.more-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}
.more-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 18px;
  border: 1px solid var(--color-divider);
  border-radius: 12px;
  background: var(--color-surface);
  text-decoration: none;
  transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s cubic-bezier(0.19, 1, 0.22, 1);
}
.more-card:hover {
  border-color: color-mix(in srgb, var(--color-primary) 45%, var(--color-divider));
  box-shadow: 0 12px 32px var(--color-shadow);
  transform: translateY(-2px);
}
.more-name {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-foreground);
}
.more-desc {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--color-foreground-tertiary);
}
.more-card svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: var(--color-primary);
  transition: transform 0.25s ease;
}
.more-card:hover svg {
  transform: translateX(3px);
}

@media (max-width: 1100px) {
  .workshop-body {
    grid-template-columns: 1fr;
  }
  .panel {
    position: static;
  }
  .more-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 640px) {
  .chart-paper {
    height: 340px;
  }
  .more-grid {
    grid-template-columns: 1fr;
  }
}
</style>
