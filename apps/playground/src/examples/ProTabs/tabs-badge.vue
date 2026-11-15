<script setup lang="ts">
import { ref } from 'vue'
import { ProTabs } from '@banmao/procomponent'
import { NSpace, NSwitch } from 'naive-ui'

const options = [
  { label: '待办', key: 'todo', dot: 8, icon: 'hugeicons:task-done-01' },
  { label: '消息', key: 'message', dot: 23 },
  { label: '公告', key: 'notice', dot: 0 },
  { label: '设置', key: 'setting' },
]

const showBadge = ref(true)
const active = ref('todo')
</script>

<template>
  <NSpace align="center" class="mb-3" :size="8">
    <span class="text-xs opacity-70">showBadge</span>
    <NSwitch v-model:value="showBadge" size="small" />
    <span class="text-xs opacity-70">icon = hugeicons:home-01（未单独指定 icon 的页签用它）</span>
  </NSpace>

  <ProTabs
    v-model:active="active"
    :options="options"
    :show-badge="showBadge"
    icon="hugeicons:home-01"
  />
  <p class="mt-3 text-xs opacity-70">
    dot 为数字，showBadge 开启时渲染成徽标；dot = 0 也会渲染。页签级 icon 优先于组件级 icon。
  </p>
</template>