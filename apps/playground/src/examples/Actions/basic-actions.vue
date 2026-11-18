<script setup lang="ts">
import { ref } from 'vue'
import { Actions, type ActionButton } from '@banmao/procomponent'

const lastAction = ref('尚未点击')

const items: ActionButton[] = [
  {
    label: '编辑',
    key: 'edit',
    variant: 'primary',
    onClick: (item, event) => {
      lastAction.value = `${item.label}（${event?.type ?? '无事件'}）`
    },
  },
  {
    label: '详情',
    key: 'detail',
    variant: 'info',
    onClick: (item, event) => {
      lastAction.value = `${item.label}（${event?.type ?? '无事件'}）`
    },
  },
]
</script>

<template>
  <Actions :items="items" />
  <div class="mt-3 font-mono text-xs opacity-70">
    lastAction = {{ lastAction }}
  </div>
</template>
