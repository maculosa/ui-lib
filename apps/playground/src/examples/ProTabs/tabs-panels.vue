<script setup lang="ts">
import { ref } from 'vue'
import { ProTabs } from '@banmao/procomponent'
import type { TabOption } from '@banmao/procomponent'
import { NInput, NRadioButton, NRadioGroup, NSpace } from 'naive-ui'

const options: TabOption[] = [
  { label: '概览', key: 'overview' },
  { label: '明细', key: 'detail' },
  { label: '操作日志', key: 'log' },
]

const active = ref('overview')
const mode = ref<'destroy' | 'keep'>('destroy')
const drafts = ref<Record<string, string>>({ overview: '', detail: '', log: '' })
</script>

<template>
  <NSpace align="center" class="mb-3" :size="8">
    <span class="text-xs opacity-70">keepAlive / lazy</span>
    <NRadioGroup v-model:value="mode" size="small">
      <NRadioButton value="destroy">false</NRadioButton>
      <NRadioButton value="keep">true + lazy</NRadioButton>
    </NRadioGroup>
  </NSpace>

  <ProTabs
    v-model:active="active"
    :options="options"
    :keep-alive="mode === 'keep'"
    lazy
  >
    <template #panel="{ option }">
      <div class="text-sm">
        <p class="mb-2 opacity-70">当前面板：{{ option.label }}</p>
        <NInput
          v-model:value="drafts[option.key]"
          placeholder="输入内容后切走再切回，观察是否保留"
        />
      </div>
    </template>
  </ProTabs>

  <p class="mt-3 text-xs opacity-70">
    keepAlive=false 时面板随选中切换卸载；keepAlive=true 时首次访问后保留 DOM 与输入状态。
  </p>
</template>
