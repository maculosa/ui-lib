<script setup lang="ts">
import { computed, ref } from 'vue'
import { ProTabs } from '@banmao/procomponent'

const options = [
  { label: '概览', key: 'overview' },
  { label: '明细', key: 'detail' },
  { label: '操作日志', key: 'log' },
  { label: '已归档', key: 'archived', disabled: true },
]

const pages: Record<string, string> = {
  overview: '概览页：汇总指标与趋势。',
  detail: '明细页：逐条数据列表。',
  log: '操作日志页：审计记录。',
  archived: '归档页（禁用，点不动）。',
}

const active = ref('overview')
const content = computed(() => pages[active.value] ?? '')
</script>

<template>
  <ProTabs v-model:active="active" :options="options" />
  <div class="mt-3 text-sm opacity-70">
    {{ content }}
  </div>
  <div class="mt-2 font-mono text-xs opacity-70">
    active = {{ active }}
  </div>
</template>