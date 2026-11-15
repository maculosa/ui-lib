<script setup lang="tsx">
import { ref } from 'vue'
import type { VNode } from 'vue'
import { ProTabs } from '@banmao/procomponent'

interface TabOption {
  label: string
  key: string
  render?: (option: TabOption) => VNode
}

const active = ref('running')

const statusOptions: TabOption[] = [
  {
    label: '运行中',
    key: 'running',
    render: option => (
      <span class="flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-[#3e9b4f]" />
        {option.label}
      </span>
    ),
  },
  { label: '已停止', key: 'stopped' },
  { label: '异常', key: 'error' },
]

const keyOptions: TabOption[] = [
  { label: '概览', key: 'overview' },
  { label: '明细', key: 'detail' },
]

const renderKey = (option: TabOption) => (
  <span class="font-mono text-xs">/{option.key}</span>
)
</script>

<template>
  <p class="mb-2 text-xs opacity-70">页签级 render：只替换「运行中」的内容区，选中态与点击仍由 ProTabs 负责</p>
  <ProTabs v-model:active="active" :options="statusOptions" />

  <p class="mt-4 mb-2 text-xs opacity-70">组件级 render：对所有页签生效，页签级 render 优先级更高</p>
  <ProTabs :options="keyOptions" default-active="overview" :render="renderKey" type="line" />
</template>