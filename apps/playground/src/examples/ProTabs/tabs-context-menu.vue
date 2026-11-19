<script setup lang="ts">
import { ref } from 'vue'
import { ProTabs } from '@banmao/procomponent'
import type { TabOption } from '@banmao/procomponent'

const options = ref<TabOption[]>([
  { label: '首页', key: 'home', closable: false },
  { label: '订单', key: 'orders' },
  { label: '库存', key: 'stock' },
  { label: '报表', key: 'reports' },
])
const active = ref('home')

function ensureActive(fallback = '') {
  if (options.value.some(option => option.key === active.value)) return
  active.value = fallback && options.value.some(option => option.key === fallback)
    ? fallback
    : (options.value[0]?.key ?? '')
}

function close(key: string) {
  const index = options.value.findIndex(option => option.key === key)
  if (index === -1) return
  options.value = options.value.filter(option => option.key !== key)
  if (active.value === key) {
    active.value = options.value[Math.min(index, options.value.length - 1)]?.key ?? ''
  }
}

function closeOthers(key: string) {
  options.value = options.value.filter(option => option.key === key || option.closable === false)
  ensureActive(key)
}

function closeRight(key: string) {
  const index = options.value.findIndex(option => option.key === key)
  if (index === -1) return
  options.value = options.value.filter((option, current) => current <= index || option.closable === false)
  ensureActive(key)
}

function closeAll() {
  options.value = options.value.filter(option => option.closable === false)
  ensureActive()
}
</script>

<template>
  <ProTabs
    v-model:active="active"
    :options="options"
    closable
    context-menu
    @close="close"
    @close-others="closeOthers"
    @close-right="closeRight"
    @close-all="closeAll"
  />

  <p class="mt-3 text-xs opacity-70">
    在任意页签上右键（或聚焦后按 Shift+F10）打开菜单。不可关闭的「首页」会保留，其余命令按可用性自动置灰。
  </p>
</template>