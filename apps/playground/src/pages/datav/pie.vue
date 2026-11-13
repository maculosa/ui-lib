<script setup lang="ts">
import { Pie, Pie3D } from '@banmao/datav'
import { computed } from 'vue'
import { t } from '@/locales'

const data = computed(() => [
  { name: t('datav.brandXiaomi'), value: 100 },
  { name: t('datav.brandHuawei'), value: 200 },
  { name: t('datav.brandApple'), value: 300 },
  { name: 'OPPO', value: 400 },
  { name: 'vivo', value: 500 },
])

const variants = computed(() => [
  { key: 'pie', label: t('datav.pieVariantBasic'), note: 'PIE · INSIDE LABEL' },
  { key: 'doughnut', label: t('datav.pieVariantDoughnut'), note: 'DOUGHNUT · CENTER LABEL' },
  { key: 'corner', label: t('datav.pieVariantCorner'), note: 'DOUGHNUT · ROUNDED' },
  { key: 'half', label: t('datav.pieVariantHalf'), note: 'HALF DOUGHNUT' },
  { key: 'rose-doughnut', label: t('datav.pieVariantRoseDoughnut'), note: 'ROSE · PAD ANGLE' },
  { key: 'rose', label: t('datav.pieVariantRose'), note: 'ROSE PIE · OUTSIDE' },
  { key: '3d', label: t('datav.pieVariant3d'), note: 'PIE 3D · WEBGL' },
])
</script>

<template>
  <div class="datav-sub">
    <header class="sub-head">
      <p class="bm-mono-label sub-kicker">DATAV · PIE FAMILY</p>
      <h1 class="sub-title">{{ t('datav.pieTitle') }}</h1>
      <p class="sub-desc">
        {{ t('datav.pieDesc') }}
      </p>
    </header>

    <div class="pie-grid">
      <figure v-for="v in variants" :key="v.key" class="pie-card bm-corner-marks">
        <div class="chart-paper">
          <Pie
            v-if="v.key === 'pie'"
            :title="{ text: 'Pie' }"
            :data="data"
            :legend="{ show: false }"
            label
            label-position="inside"
          />
          <Pie
            v-else-if="v.key === 'doughnut'"
            :title="{ text: 'Doughnut Pie' }"
            :data="data"
            :legend="{ show: false }"
            type="doughnut"
            label-position="center"
          />
          <Pie
            v-else-if="v.key === 'corner'"
            :title="{ text: 'Rounded Doughnut' }"
            :data="data"
            :legend="{ show: false }"
            type="doughnut"
            corner
            label
          />
          <Pie
            v-else-if="v.key === 'half'"
            :title="{ text: 'Half Doughnut' }"
            :data="data"
            :legend="{ top: 'bottom' }"
            type="doughnut"
            corner
            half
            label
            label-position="inside"
          />
          <Pie
            v-else-if="v.key === 'rose-doughnut'"
            :title="{ text: 'Rose Doughnut' }"
            :data="data"
            :legend="{ top: 'bottom' }"
            type="doughnut"
            min-radius="5%"
            max-radius="50%"
            :pad-angle="1"
            rose
            corner
            label
            label-position="outside"
          />
          <Pie
            v-else-if="v.key === 'rose'"
            :title="{ text: 'Rose Pie' }"
            :data="data"
            :legend="{ top: 'bottom' }"
            type="pie"
            rose
            label
            label-position="outside"
          />
          <Pie3D
            v-else
            :title="{ text: 'Pie 3D' }"
            :data="data"
            :legend="{ top: 'bottom' }"
            type="pie"
            rose
            label
            label-position="outside"
          />
        </div>
        <figcaption class="pie-caption">
          <span class="pie-name">{{ v.label }}</span>
          <span class="bm-mono-label pie-note">{{ v.note }}</span>
        </figcaption>
      </figure>
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

.pie-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.pie-card {
  position: relative;
  margin: 0;
  border: 1px solid var(--color-divider);
  border-radius: 14px;
  background: var(--color-surface);
  overflow: hidden;
  transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
}

.pie-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 14px 34px -18px var(--color-shadow);
  transform: translateY(-2px);
}

.chart-paper {
  height: 300px;
  background: #fbfaf6;
  border-bottom: 1px solid #dfdacc;
}

.pie-caption {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 16px;
}

.pie-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-foreground);
}

.pie-note {
  color: var(--color-foreground-tertiary);
}

@media (max-width: 900px) {
  .pie-grid {
    grid-template-columns: 1fr;
  }

  .sub-title {
    font-size: 28px;
  }
}
</style>