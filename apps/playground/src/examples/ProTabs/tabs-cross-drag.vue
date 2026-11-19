<script setup lang="ts">
import { ref } from 'vue'
import { ProTabs } from '@banmao/procomponent'
import type { ProTabsTransferPayload, TabOption } from '@banmao/procomponent'

const left = ref<TabOption[]>([
  { label: '待处理', key: 'todo' },
  { label: '进行中', key: 'doing' },
  { label: '待验收', key: 'review' },
])
const right = ref<TabOption[]>([
  { label: '已完成', key: 'done' },
  { label: '已归档', key: 'archived' },
])
const leftActive = ref('todo')
const rightActive = ref('done')

function move(payload: ProTabsTransferPayload, target: 'left' | 'right') {
  const sourceList = target === 'right' ? left : right
  const targetList = target === 'right' ? right : left
  const sourceActive = target === 'right' ? leftActive : rightActive
  const targetActive = target === 'right' ? rightActive : leftActive
  const item = sourceList.value.find(option => option.key === payload.key)
  if (!item) return

  sourceList.value = sourceList.value.filter(option => option.key !== payload.key)
  const next = [...targetList.value]
  next.splice(Math.max(0, Math.min(payload.index, next.length)), 0, item)
  targetList.value = next

  if (sourceActive.value === payload.key) sourceActive.value = sourceList.value[0]?.key ?? ''
  if (!targetActive.value) targetActive.value = item.key
}
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <div class="min-w-0">
      <p class="mb-2 text-xs font-medium opacity-70">左列</p>
      <ProTabs
        v-model:active="leftActive"
        :options="left"
        draggable
        drag-group="ticket-board"
        @transfer="payload => move(payload, 'right')"
      />
    </div>
    <div class="min-w-0">
      <p class="mb-2 text-xs font-medium opacity-70">右列</p>
      <ProTabs
        v-model:active="rightActive"
        :options="right"
        draggable
        drag-group="ticket-board"
        @transfer="payload => move(payload, 'left')"
      />
    </div>
  </div>

  <p class="mt-3 text-xs opacity-70">
    两个容器共用 drag-group，跨列拖拽时目标容器抛 transfer；示例在事件里把页签从来源数组搬到目标数组。
  </p>
</template>