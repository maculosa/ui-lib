<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Chart } from '@banmao/datav'
import { t } from '@/locales'
import {
  NColorPicker,
  NForm,
  NFormItemGi,
  NGrid,
  NInput,
  NSpin,
  NSlider,
  NSwitch,
  NRadioGroup,
  NRadioButton,
} from 'naive-ui'

interface DataItem {
  name: string
  value: number
  phone: number
}

const data = ref<DataItem[]>([])
const loading = ref<boolean>(false)

const originData = [
  { name: 'Mon', value: 1548, phone: 234 },
  { name: 'Tue', value: 2125, phone: 345 },
  { name: 'Wed', value: 1520, phone: 124 },
  { name: 'Thu', value: 3498, phone: 123 },
  { name: 'Fri', value: 3200, phone: 123 },
  { name: 'Sat', value: 3181, phone: 123 },
  { name: 'Sun', value: 2789, phone: 123 },
].sort((a, b) => a.value - b.value)

function fetchData(): Promise<DataItem[]> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(originData)
    }, 300)
  })
}

onMounted(async () => {
  try {
    loading.value = true
    data.value = await fetchData()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})

type FormType = {
  title: string
  barWidth: number
  vertical: boolean
  type: 'bar' | 'line' | 'scatter'
  color: string[]
  colors: Array<[string, string]>
  isGradient: boolean
}

const formData = ref<FormType>({
  title: t('datav.defaultChartTitle'),
  barWidth: 14,
  vertical: false,
  type: 'bar',
  color: ['#f04e23', '#2f6bff'],
  colors: [
    ['#f04e23', '#e8a013'],
    ['#2f6bff', '#22d3ee'],
  ],
  isGradient: true,
})
</script>

<template>
  <div class="datav-sub">
    <header class="sub-head">
      <p class="bm-mono-label sub-kicker">DATAV · BAR / LINE / SCATTER</p>
      <h1 class="sub-title">{{ t('datav.barLineTitle') }}</h1>
      <p class="sub-desc">
        {{ t('datav.barLineDesc') }}
      </p>
    </header>

    <div class="lab-body">
      <section class="panel bm-corner-marks">
        <div class="panel-head">
          <span class="bm-mono-label">CONTROL DECK</span>
          <span class="bm-mono-label panel-live"><i class="bm-blink" />LIVE</span>
        </div>

        <n-form label-placement="top" class="panel-form">
          <n-grid cols="1 s:2" responsive="screen" :x-gap="14" :y-gap="4">
            <n-form-item-gi :label="t('datav.titleLabel')" :span="2">
              <n-input v-model:value="formData.title" :placeholder="t('datav.titleInputPlaceholder')" />
            </n-form-item-gi>

            <n-form-item-gi :label="t('datav.chartTypeLabel')" :span="2">
              <n-radio-group v-model:value="formData.type" size="small">
                <n-radio-button value="bar">{{ t('datav.typeBar') }}</n-radio-button>
                <n-radio-button value="line">{{ t('datav.typeLine') }}</n-radio-button>
                <n-radio-button value="scatter">{{ t('datav.typeScatter') }}</n-radio-button>
              </n-radio-group>
            </n-form-item-gi>

            <n-form-item-gi v-if="formData.type === 'bar'" :label="t('datav.horizontalLabel')">
              <n-switch v-model:value="formData.vertical" size="small" />
            </n-form-item-gi>

            <n-form-item-gi v-if="formData.type === 'bar'" :label="t('datav.barWidthShortLabel')">
              <n-slider v-model:value="formData.barWidth" :min="6" :max="48" :step="1" />
            </n-form-item-gi>

            <n-form-item-gi :label="t('datav.gradientLabel')" :span="2">
              <n-switch v-model:value="formData.isGradient" size="small" />
            </n-form-item-gi>

            <n-form-item-gi v-if="!formData.isGradient" :label="t('datav.seriesColorLabel')" :span="2">
              <div class="color-row">
                <n-color-picker
                  v-model:value="formData.color[0]"
                  size="small"
                  :show-alpha="false"
                  :modes="['hex']"
                />
                <n-color-picker
                  v-model:value="formData.color[1]"
                  size="small"
                  :show-alpha="false"
                  :modes="['hex']"
                />
              </div>
            </n-form-item-gi>

            <n-form-item-gi v-else :label="t('datav.gradientColorLabel')" :span="2">
              <div class="gradient-stack">
                <div v-for="(_, index) in formData.colors" :key="index" class="color-row">
                  <n-color-picker
                    v-model:value="formData.colors[index][0]"
                    size="small"
                    :show-alpha="false"
                    :modes="['hex']"
                  />
                  <n-color-picker
                    v-model:value="formData.colors[index][1]"
                    size="small"
                    :show-alpha="false"
                    :modes="['hex']"
                  />
                </div>
              </div>
            </n-form-item-gi>
          </n-grid>
        </n-form>
      </section>

      <section class="stage">
        <div class="stage-head">
          <span class="bm-mono-label">FIG.01 — CHART STAGE</span>
          <span class="bm-mono-label stage-readout">
            {{ formData.type.toUpperCase() }} · {{ data.length }} PTS ·
            {{ formData.isGradient ? 'GRADIENT' : 'SOLID' }}
          </span>
        </div>
        <n-spin :show="loading">
          <div class="chart-paper">
            <Chart
              :title="{ text: formData.title }"
              :legend="{ mapData: { value: t('datav.seriesSales'), phone: t('datav.seriesVisits') } }"
              triggerType="axis"
              :barWidth="formData.barWidth"
              :xAxis="{ type: formData.vertical && formData.type === 'bar' ? 'value' : 'category' }"
              :yAxis="{ type: formData.vertical && formData.type === 'bar' ? 'category' : 'value' }"
              :seriesType="[
                {
                  type: formData.type,
                  color: formData.isGradient ? formData.colors[0] : formData.color[0],
                },
                {
                  type: formData.type,
                  color: formData.isGradient ? formData.colors[1] : formData.color[1],
                },
              ]"
              :data="data"
            />
          </div>
        </n-spin>
        <p class="stage-note">
          {{ t('datav.barLineStageNote') }}
        </p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.datav-sub {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.sub-kicker {
  color: var(--color-primary);
}

.sub-title {
  margin: 10px 0 12px;
  font-family: var(--font-serif);
  font-size: 34px;
  font-weight: 400;
  letter-spacing: 0.01em;
  color: var(--color-foreground);
}

.sub-desc {
  max-width: 640px;
  margin: 0;
  font-size: 14px;
  line-height: 1.85;
  color: var(--color-foreground-secondary);
}

.lab-body {
  display: grid;
  grid-template-columns: 300px minmax(0, 1fr);
  gap: 22px;
  align-items: start;
}

.panel {
  position: sticky;
  top: calc(var(--layout-header-height) + 24px);
  border: 1px solid var(--color-divider);
  border-radius: 14px;
  background: var(--color-surface);
  padding: 18px;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  margin-bottom: 14px;
  border-bottom: 1px dashed var(--color-divider);
  color: var(--color-foreground-secondary);
}

.panel-live {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--color-primary);
}

.panel-live i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-primary);
}

.panel-form :deep(.n-form-item-label) {
  font-size: 12px;
  color: var(--color-foreground-secondary);
}

.color-row {
  display: flex;
  gap: 10px;
  width: 100%;
}

.gradient-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.stage {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}

.stage-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--color-foreground-secondary);
}

.stage-readout {
  color: var(--color-primary);
}

.chart-paper {
  height: 440px;
  border: 1px solid #dfdacc;
  border-radius: 14px;
  background: #fbfaf6;
  overflow: hidden;
}

.stage-note {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.7;
  color: var(--color-foreground-tertiary);
}

@media (max-width: 1100px) {
  .lab-body {
    grid-template-columns: 1fr;
  }

  .panel {
    position: static;
  }
}

@media (max-width: 640px) {
  .sub-title {
    font-size: 28px;
  }

  .chart-paper {
    height: 340px;
  }
}
</style>