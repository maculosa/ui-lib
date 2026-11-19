<script setup lang="ts">
import { ref } from 'vue'
import { ProTabs } from '@banmao/procomponent'
import type { TabOption } from '@banmao/procomponent'

const tabs: TabOption[] = Array.from({ length: 200 }, (_, index) => ({
  label: `数据源 ${index + 1}`,
  key: `source-${index + 1}`,
}))
const active = ref('source-1')
</script>

<template>
  <ProTabs v-model:active="active" :options="tabs" virtual="auto" :virtual-threshold="100" />

  <p class="mt-3 text-xs opacity-70">
    200 个页签达到阈值后自动进入虚拟滚动，只渲染可视窗口与预渲染区域，横向滚动与方向键仍然可用。
  </p>
  <p class="mt-1 font-mono text-xs opacity-70">active = {{ active }}</p>
</template>