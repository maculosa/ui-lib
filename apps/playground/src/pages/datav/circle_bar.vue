<script setup lang="ts">
import { CircleBar } from '@banmao/datav'
import { computed } from 'vue'
import { t } from '@/locales'

const data = computed(() => [
  { name: t('datav.brandXiaomi'), value: 100 },
  { name: t('datav.brandHuawei'), value: 200 },
  { name: t('datav.brandApple'), value: 300 },
  { name: 'OPPO', value: 400 },
  { name: 'vivo', value: 500 },
])
</script>

<template>
  <div class="datav-sub">
    <header class="sub-head">
      <p class="bm-mono-label sub-kicker">DATAV · 3D SERIES</p>
      <h1 class="sub-title">{{ t('datav.circleBarTitle') }}</h1>
      <p class="sub-desc">
        {{ t('datav.circleBarDesc') }}
      </p>
    </header>

    <figure class="chart-card bm-corner-marks">
      <div class="chart-card-head">
        <span class="bm-mono-label">FIG.03 — CIRCLE BAR</span>
        <span class="bm-mono-label chart-readout">CANVAS · {{ data.length }} SERIES</span>
      </div>
      <div class="chart-paper">
        <CircleBar
          :title="{ text: '3D Circle Bar' }"
          :data="data"
          :legend="{ show: false }"
          :xAxis="{ type: 'category' }"
          :yAxis="{ type: 'value' }"
        />
      </div>
      <figcaption class="chart-note">
        {{ t('datav.circleBarNote') }}
      </figcaption>
    </figure>
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

.chart-card {
  position: relative;
  margin: 0;
  border: 1px solid var(--color-divider);
  border-radius: 14px;
  background: var(--color-surface);
  overflow: hidden;
}

.chart-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 16px;
  border-bottom: 1px dashed var(--color-divider);
  color: var(--color-foreground-secondary);
}

.chart-readout {
  color: var(--color-primary);
}

.chart-paper {
  height: 560px;
  background: #fbfaf6;
}

.chart-note {
  padding: 12px 16px;
  font-size: 12.5px;
  line-height: 1.7;
  color: var(--color-foreground-tertiary);
  border-top: 1px solid var(--color-divider);
}

@media (max-width: 640px) {
  .sub-title {
    font-size: 28px;
  }

  .chart-paper {
    height: 420px;
  }
}
</style>