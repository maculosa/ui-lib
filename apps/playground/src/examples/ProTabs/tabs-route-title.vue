<script setup lang="ts">
import { ref } from 'vue'
import { ProTabs } from '@banmao/procomponent'
import type { TabOption } from '@banmao/procomponent'

const options: TabOption[] = [
  { label: '订单列表', key: '/orders' },
  { label: '售后工单', key: '/tickets' },
]
const route = ref('/orders/1')
const entered = ref('')

const router = {
  push: (to: string) => {
    route.value = to
  },
}

const routeTitle = (path: string) => {
  if (path.startsWith('/orders/')) return `订单 ${path.split('/').pop()}`
  return path
}

function onRouteEnter(path: string, title: string) {
  entered.value = `${path} · ${title}`
}
</script>

<template>
  <ProTabs
    :options="options"
    :route="route"
    :router="router"
    :route-title="routeTitle"
    @route-enter="onRouteEnter"
  />

  <p class="mt-3 text-xs opacity-70">
    当前 route 不在 options 中时自动追加一个不可关闭的临时页签，并抛 route-enter 供外部落库。
  </p>
  <p class="mt-1 font-mono text-xs opacity-70">route = {{ route }}</p>
  <p class="mt-1 font-mono text-xs opacity-70">route-enter = {{ entered || '（尚未触发）' }}</p>
</template>