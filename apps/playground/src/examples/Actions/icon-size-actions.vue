<script setup lang="ts">
import { ref } from 'vue'
import { Actions, type ActionButton, type ActionSize } from '@banmao/procomponent'
import { NRadioButton, NRadioGroup, NSpace, NSwitch } from 'naive-ui'

const size = ref<ActionSize>('medium')
const customMoreIcon = ref(true)
const lastAction = ref('尚未点击')

const items: ActionButton[] = [
  {
    label: '编辑',
    key: 'edit',
    variant: 'primary',
    icon: 'mdi:pencil',
    onClick: item => (lastAction.value = item.label),
  },
  {
    label: '预览',
    key: 'preview',
    variant: 'info',
    icon: 'mdi:eye-outline',
    onClick: item => (lastAction.value = item.label),
  },
  {
    label: '复制',
    key: 'copy',
    variant: 'success',
    icon: 'mdi:content-copy',
    onClick: item => (lastAction.value = item.label),
  },
  {
    label: '删除',
    key: 'delete',
    variant: 'error',
    icon: 'mdi:delete-outline',
    confirm: true,
    onClick: item => (lastAction.value = item.label),
  },
]
</script>

<template>
  <NSpace class="mb-3" :size="16" wrap>
    <NSpace align="center" :size="8">
      <span class="text-xs opacity-70">size</span>
      <NRadioGroup v-model:value="size" size="small">
        <NRadioButton value="small">small</NRadioButton>
        <NRadioButton value="medium">medium</NRadioButton>
        <NRadioButton value="large">large</NRadioButton>
      </NRadioGroup>
    </NSpace>

    <NSpace align="center" :size="8">
      <NSwitch v-model:value="customMoreIcon" size="small" />
      <span class="text-xs opacity-70">自定义 more-icon</span>
    </NSpace>
  </NSpace>

  <Actions
    :items="items"
    :size="size"
    :show-num="3"
    :more-icon="customMoreIcon ? 'mdi:dots-horizontal' : ''"
  />

  <div class="mt-3 space-y-1 font-mono text-xs opacity-70">
    <div>lastAction = {{ lastAction }}</div>
    <div>item.icon 与 more-icon 都是 Iconify 名称，需要能加载对应图标数据</div>
  </div>
</template>
