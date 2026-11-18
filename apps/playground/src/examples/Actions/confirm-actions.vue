<script setup lang="ts">
import { ref } from 'vue'
import { Actions, type ActionButton } from '@banmao/procomponent'

const lastAction = ref('尚未操作')
const eventLog = ref('—')

const items: ActionButton[] = [
  {
    label: '提交',
    key: 'submit',
    variant: 'primary',
    onClick: item => {
      lastAction.value = item.label
    },
  },
  {
    label: '归档',
    key: 'archive',
    variant: 'warning',
    confirm: true,
    onClick: item => {
      lastAction.value = item.label
    },
  },
  {
    label: '删除',
    key: 'delete',
    variant: 'error',
    confirm: true,
    confirmContent: '删除后数据不可恢复，确定继续？',
    onClick: item => {
      lastAction.value = item.label
    },
  },
]

function handleClick(item: ActionButton, event?: MouseEvent) {
  eventLog.value = `click: ${item.key}${event ? ` (${event.type})` : ''}`
}

function handleCancel(item: ActionButton) {
  eventLog.value = `cancel: ${item.key}`
}
</script>

<template>
  <Actions
    :items="items"
    :show-num="2"
    @click="handleClick"
    @cancel="handleCancel"
  />
  <div class="mt-3 space-y-1 font-mono text-xs opacity-70">
    <div>lastAction = {{ lastAction }}</div>
    <div>eventLog = {{ eventLog }}</div>
  </div>
</template>
