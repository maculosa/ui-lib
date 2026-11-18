<script setup lang="ts">
import { ref } from 'vue'
import { Actions } from '@banmao/procomponent'
import { NRadioButton, NRadioGroup, NSpace } from 'naive-ui'

const lastAction = ref('尚未点击')
const showNum = ref(2)

const items = [
  {
    label: '编辑',
    key: 'edit',
    variant: 'primary' as const,
    onClick: () => {
      lastAction.value = '编辑'
    },
  },
  {
    label: '详情',
    key: 'detail',
    variant: 'info' as const,
    onClick: () => {
      lastAction.value = '详情'
    },
  },
  {
    label: '复制',
    key: 'copy',
    variant: 'success' as const,
    onClick: () => {
      lastAction.value = '复制'
    },
  },
  {
    label: '禁用项',
    key: 'disabled',
    variant: 'warning' as const,
    disabled: true,
    onClick: () => {
      lastAction.value = '禁用项不应被触发'
    },
  },
  {
    label: '删除',
    key: 'delete',
    variant: 'error' as const,
    onClick: () => {
      lastAction.value = '删除'
    },
  },
]
</script>

<template>
  <NSpace align="center" class="mb-3" :size="12" wrap>
    <span class="text-xs opacity-70">show-num</span>
    <NRadioGroup v-model:value="showNum" size="small">
      <NRadioButton :value="0">0</NRadioButton>
      <NRadioButton :value="2">2</NRadioButton>
      <NRadioButton :value="3">3</NRadioButton>
      <NRadioButton :value="5">5</NRadioButton>
    </NRadioGroup>
  </NSpace>

  <Actions :items="items" :show-num="showNum" />
  <div class="mt-3 font-mono text-xs opacity-70">
    lastAction = {{ lastAction }}
  </div>
</template>
