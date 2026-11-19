<script setup lang="ts">
import { ref } from 'vue'
import { ProTabs } from '@banmao/procomponent'
import type { TabOption } from '@banmao/procomponent'

const options: TabOption[] = [
  { label: '订单列表', key: '/orders' },
  { label: '订单详情', key: '/orders/1' },
  { label: '售后工单', key: '/tickets' },
]

const route = ref('/orders')
// 演示用替身；真实项目直接传 vue-router 的 useRouter()
const router = {
  push: (to: string) => {
    route.value = to
  },
}
</script>

<template>
  <ProTabs :options="options" :route="route" :router="router" />

  <p class="mt-3 text-xs opacity-70">
    route 作为选中来源，点击页签时组件调用 router.push(key)。active 仍是最高优先级，可用于临时覆盖路由选中。
  </p>
  <p class="mt-1 font-mono text-xs opacity-70">route = {{ route }}</p>
</template>
