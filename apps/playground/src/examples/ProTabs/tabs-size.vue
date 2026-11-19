<script setup lang="ts">
import { ref } from 'vue'
import { ProTabs } from '@banmao/procomponent'
import type { ProTabsSize } from '@banmao/procomponent'

const options = [
  { label: '概览', key: 'overview' },
  { label: '明细', key: 'detail' },
  { label: '操作日志', key: 'log' },
  { label: '已归档', key: 'archived', disabled: true },
]

const sizes: ProTabsSize[] = ['small', 'medium', 'large']
const active = ref<Record<string, string>>({
  small: 'overview',
  medium: 'overview',
  large: 'overview',
})
</script>

<template>
  <div v-for="size in sizes" :key="size" class="mb-5">
    <p class="mb-2 font-mono text-xs opacity-70">size = "{{ size }}"</p>
    <ProTabs v-model:active="active[size]" :options="options" :size="size" />
  </div>
</template>
