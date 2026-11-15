<script setup lang="ts">
import { ref } from 'vue'
import { ProTabs } from '@banmao/procomponent'
import { NRadioButton, NRadioGroup, NSpace, NSwitch } from 'naive-ui'

const options = [
  { label: '概览', key: 'overview' },
  { label: '明细', key: 'detail' },
  { label: '操作日志', key: 'log' },
]

const type = ref<'line' | 'card'>('card')
const inset = ref(false)
const rounded = ref(false)
const active = ref('overview')
</script>

<template>
  <NSpace align="center" class="mb-3" :size="12" wrap>
    <NRadioGroup v-model:value="type" size="small">
      <NRadioButton value="card">card</NRadioButton>
      <NRadioButton value="line">line</NRadioButton>
    </NRadioGroup>
    <span class="text-xs opacity-70">inset</span>
    <NSwitch v-model:value="inset" size="small" />
    <span class="text-xs opacity-70">rounded</span>
    <NSwitch v-model:value="rounded" size="small" />
  </NSpace>

  <ProTabs
    v-model:active="active"
    :options="options"
    :type="type"
    :inset="inset"
    :rounded="rounded"
  />
  <p class="mt-3 text-xs opacity-70">
    card 用填充底色区分选中项，line 用底部指示条；rounded 只对 card 生效，inset 给整条页签栏加 4px 内边距。
  </p>
</template>