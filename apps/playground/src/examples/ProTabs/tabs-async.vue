<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ProTabs } from '@banmao/procomponent'
import { NButton, NSpace } from 'naive-ui'

const tabs = ref<{ label: string; key: string }[]>([])
const loading = ref(false)
const logs = ref<string[]>([])

function pushLog(text: string) {
  logs.value = [text, ...logs.value].slice(0, 3)
}

function load() {
  loading.value = true
  tabs.value = []
  window.setTimeout(() => {
    tabs.value = [
      { label: '概览', key: 'overview' },
      { label: '明细', key: 'detail' },
      { label: '操作日志', key: 'log' },
    ]
    loading.value = false
    pushLog('options 到达 → 内部选中 overview（不抛事件）')
  }, 600)
}

onMounted(load)
</script>

<template>
  <NSpace align="center" class="mb-3" :size="8">
    <NButton size="small" :loading="loading" @click="load">重新加载</NButton>
    <span class="text-xs opacity-70">非受控、未传 default-active，options 异步到达</span>
  </NSpace>

  <ProTabs :options="tabs" @update:active="(key: string) => pushLog(`update:active → ${key}`)" />

  <ul class="mt-3 space-y-1 font-mono text-xs opacity-70">
    <li v-for="(log, i) in logs" :key="i">{{ log }}</li>
  </ul>
  <p class="mt-2 text-xs opacity-70">
    数据到达后自动选中第一项；这种内部回退不抛 update:active，只有用户点击才抛。
  </p>
</template>