<script setup lang="ts">
import { ref } from 'vue'
import { Actions, type ActionButton } from '@banmao/procomponent'
import { NSlider } from 'naive-ui'

const width = ref(360)
const lastAction = ref('尚未点击')

const items: ActionButton[] = [
  { label: '编辑', key: 'edit', variant: 'primary', onClick: item => (lastAction.value = item.label) },
  { label: '详情', key: 'detail', variant: 'info', onClick: item => (lastAction.value = item.label) },
  { label: '复制', key: 'copy', variant: 'success', onClick: item => (lastAction.value = item.label) },
  { label: '导出', key: 'export', variant: 'warning', onClick: item => (lastAction.value = item.label) },
  { label: '删除', key: 'delete', variant: 'error', onClick: item => (lastAction.value = item.label) },
]
</script>

<template>
  <div class="max-w-[640px]">
    <div class="mb-2 flex items-center gap-3">
      <span class="text-xs opacity-70">容器宽度</span>
      <NSlider v-model:value="width" :min="160" :max="640" :step="20" class="flex-1" />
      <span class="w-12 text-right font-mono text-xs opacity-70">{{ width }}px</span>
    </div>

    <div
      class="overflow-hidden rounded border border-dashed border-current/20 p-2"
      :style="{ width: `${width}px`, maxWidth: '100%' }"
    >
      <Actions :items="items" responsive :show-num="4" />
    </div>
  </div>

  <div class="mt-3 font-mono text-xs opacity-70">
    lastAction = {{ lastAction }}
  </div>
</template>
