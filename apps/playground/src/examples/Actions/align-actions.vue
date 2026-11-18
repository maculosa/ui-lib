<script setup lang="ts">
import { Actions } from '@banmao/procomponent'

const items = [
  { label: '编辑', key: 'edit', variant: 'primary' as const },
  { label: '详情', key: 'detail', variant: 'info' as const },
  { label: '删除', key: 'delete', variant: 'error' as const },
]
</script>

<template>
  <div class="space-y-3">
    <div
      v-for="align in (['left', 'center', 'right'] as const)"
      :key="align"
      class="rounded border border-dashed border-current/20 px-3 py-2"
    >
      <div class="mb-1 font-mono text-xs opacity-60">align = {{ align }}</div>
      <Actions :items="items" :align="align" :show-num="2" />
    </div>
  </div>
</template>
