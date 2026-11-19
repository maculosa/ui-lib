<script setup lang="tsx">
import { ref } from 'vue'
import { ProTabs } from '@banmao/procomponent'
import type { TabOption } from '@banmao/procomponent'

const options: TabOption[] = [
  { label: '未读', key: 'unread', badge: 12 },
  { label: '告警', key: 'alarm', badge: 'dot' },
  { label: '待办', key: 'todo', badge: 120 },
  { label: '标记', key: 'custom', badge: 5, badgeMax: 3 },
  {
    label: '自定义',
    key: 'node',
    badge: () => (
      <span class="rounded px-1 text-[10px] leading-4 bg-[var(--color-accent)] text-white">NEW</span>
    ),
  },
]

const active = ref('unread')
</script>

<template>
  <ProTabs v-model:active="active" :options="options" :badge-max="99" />

  <p class="mt-3 text-xs opacity-70">
    badge 支持数字、「dot」与函数（返回 VNode）；数字超出 badgeMax 显示 99+，页签级 badgeMax 可单独覆盖。
  </p>
</template>
