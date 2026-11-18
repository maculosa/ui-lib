<script setup lang="ts">
import { ref } from 'vue'
import { Actions, type ActionButton } from '@banmao/procomponent'
import { NCheckbox, NCheckboxGroup, NSpace } from 'naive-ui'

const granted = ref(['order:edit', 'order:export'])
const lastAction = ref('尚未操作')

const items: ActionButton[] = [
  {
    label: '编辑',
    key: 'edit',
    variant: 'primary',
    permission: 'order:edit',
    onClick: item => {
      lastAction.value = item.label
    },
  },
  {
    label: '导出',
    key: 'export',
    variant: 'success',
    permission: 'order:export',
    onClick: item => {
      lastAction.value = item.label
    },
  },
  {
    label: '删除',
    key: 'delete',
    variant: 'error',
    permission: 'order:delete',
    onClick: item => {
      lastAction.value = item.label
    },
  },
  {
    label: '帮助',
    key: 'help',
    variant: 'info',
    onClick: item => {
      lastAction.value = item.label
    },
  },
]
</script>

<template>
  <NSpace class="mb-3" :size="12" wrap>
    <span class="text-xs opacity-70">permissions</span>
    <NCheckboxGroup v-model:value="granted">
      <NSpace :size="12">
        <NCheckbox value="order:edit">order:edit</NCheckbox>
        <NCheckbox value="order:export">order:export</NCheckbox>
        <NCheckbox value="order:delete">order:delete</NCheckbox>
      </NSpace>
    </NCheckboxGroup>
  </NSpace>

  <Actions :items="items" :permissions="granted" :show-num="4" />
  <div class="mt-3 space-y-1 font-mono text-xs opacity-70">
    <div>lastAction = {{ lastAction }}</div>
    <div>没有 permission 的「帮助」始终可见</div>
  </div>
</template>
