<script setup lang="ts">
import { useAsyncData } from '@banmao/hooks'
import { NAlert, NButton, NDescriptions, NDescriptionsItem, NSpace, NSpin } from 'naive-ui'
import { computed } from 'vue'

interface Stat {
  visitors: number
  orders: number
  amount: number
  updatedAt: string
}

function fetchStat(): Promise<Stat> {
  return new Promise(resolve =>
    setTimeout(
      () =>
        resolve({
          visitors: 1200 + Math.floor(Math.random() * 400),
          orders: 80 + Math.floor(Math.random() * 40),
          amount: 25800 + Math.floor(Math.random() * 5000),
          updatedAt: new Date().toLocaleTimeString(),
        }),
      800,
    ),
  )
}

// immediate 默认 true：调用即发起请求
const { data, loading, error, fetchData } = useAsyncData(fetchStat)

const errorMessage = computed(() =>
  error.value instanceof Error ? error.value.message : String(error.value ?? ''),
)
</script>

<template>
  <NSpace vertical :size="12">
    <NSpace align="center">
      <NButton size="small" :loading="loading" @click="fetchData">重新加载</NButton>
      <span class="hint">loading = {{ loading }}，error = {{ errorMessage || 'null' }}</span>
    </NSpace>

    <NSpin :show="loading && !data">
      <NAlert v-if="errorMessage" type="error" :title="errorMessage" />
      <NDescriptions
        v-else
        label-placement="left"
        size="small"
        bordered
        :column="2"
        :title="`数据更新于 ${data?.updatedAt ?? '—'}`"
      >
        <NDescriptionsItem label="访问量">{{ data?.visitors ?? '—' }}</NDescriptionsItem>
        <NDescriptionsItem label="订单数">{{ data?.orders ?? '—' }}</NDescriptionsItem>
        <NDescriptionsItem label="成交额">{{ data?.amount ?? '—' }}</NDescriptionsItem>
        <NDescriptionsItem label="加载中">{{ loading }}</NDescriptionsItem>
      </NDescriptions>
    </NSpin>
  </NSpace>
</template>

<style scoped>
.hint {
  font-size: 13px;
  color: var(--color-foreground-tertiary);
}
</style>
