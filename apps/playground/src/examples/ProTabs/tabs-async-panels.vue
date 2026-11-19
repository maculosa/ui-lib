<script setup lang="ts">
import { h, ref } from 'vue'
import { ProTabs } from '@banmao/procomponent'
import type { TabOption } from '@banmao/procomponent'

const attempts = new Map<string, number>()

function load(key: string, failFirst = false): Promise<ReturnType<typeof h>> {
  return new Promise((resolve, reject) => {
    const count = (attempts.get(key) ?? 0) + 1
    attempts.set(key, count)
    window.setTimeout(() => {
      if (failFirst && count === 1) {
        reject(new Error('网络超时'))
        return
      }
      resolve(h(
        'div',
        { class: 'rounded-[4px] bg-[var(--color-fill,#ece8de)] p-4 text-sm' },
        `${key} 面板加载完成，第 ${count} 次请求`,
      ))
    }, 700)
  })
}

const options: TabOption[] = [
  { label: '概览', key: 'overview', panelLoader: () => load('overview') },
  { label: '明细', key: 'detail', panelLoader: () => load('detail') },
  { label: '不稳定源', key: 'flaky', panelLoader: () => load('flaky', true) },
]
const active = ref('overview')
</script>

<template>
  <ProTabs v-model:active="active" :options="options" />

  <p class="mt-3 text-xs opacity-70">
    面板首次激活时执行 panelLoader，加载中与失败重试使用内置三态；结果按 key 缓存，切回不会重复请求。
    「不稳定源」首次会失败，可点击重试。
  </p>
</template>