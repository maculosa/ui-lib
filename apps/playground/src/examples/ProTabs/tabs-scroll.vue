<script setup lang="ts">
import { ref } from 'vue'
import { ProTabs } from '@banmao/procomponent'
import type { ProTabsInstance, TabOption } from '@banmao/procomponent'
import { NButton, NSpace } from 'naive-ui'

const tabs = ref<TabOption[]>(
  Array.from({ length: 14 }, (_, i) => ({
    label: `页签 ${i + 1}`,
    key: `tab-${i + 1}`,
  })),
)
const active = ref('tab-1')
const tabsRef = ref<ProTabsInstance>()
</script>

<template>
  <NSpace align="center" class="mb-3" :size="8" wrap>
    <NButton size="small" @click="tabsRef?.scrollTo('tab-12')">scrollTo('tab-12')</NButton>
    <NButton size="small" @click="tabsRef?.scrollActive()">scrollActive()</NButton>
    <NButton size="small" @click="tabsRef?.scrollBy(-160)">scrollBy(-160)</NButton>
    <NButton size="small" @click="tabsRef?.scrollBy(160)">scrollBy(160)</NButton>
  </NSpace>

  <ProTabs ref="tabsRef" v-model:active="active" :options="tabs" />

  <p class="mt-3 text-xs opacity-70">
    页签栏溢出时两侧出现滚动提示按钮；选中项变化也会自动滚入可视区域。滚动条本身保持隐藏。
  </p>
</template>
