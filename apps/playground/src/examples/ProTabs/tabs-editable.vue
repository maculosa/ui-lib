<script setup lang="ts">
import { ref } from 'vue'
import { ProTabs } from '@banmao/procomponent'
import type { TabOption } from '@banmao/procomponent'

let seq = 3
const tabs = ref<TabOption[]>([
  { label: '首页', key: 'home', closable: false },
  { label: '页签 1', key: 'tab-1' },
  { label: '页签 2', key: 'tab-2' },
  { label: '页签 3', key: 'tab-3' },
])
const active = ref('home')
const logs = ref<string[]>([])

function pushLog(text: string) {
  logs.value = [text, ...logs.value].slice(0, 4)
}

function onAdd() {
  seq += 1
  const key = `tab-${seq}`
  tabs.value = [...tabs.value, { label: `页签 ${seq}`, key }]
  active.value = key
  pushLog(`add → ${key}`)
}

function onClose(key: string) {
  const index = tabs.value.findIndex(tab => tab.key === key)
  tabs.value = tabs.value.filter(tab => tab.key !== key)
  if (active.value === key) {
    active.value = tabs.value[Math.min(index, tabs.value.length - 1)]?.key ?? ''
  }
  pushLog(`close → ${key}`)
}

function onReorder(keys: string[]) {
  const map = new Map(tabs.value.map(tab => [tab.key, tab]))
  tabs.value = keys.map(key => map.get(key)!).filter(Boolean)
  pushLog(`reorder → ${keys.join(' / ')}`)
}

function onRename(key: string, label: string) {
  tabs.value = tabs.value.map(tab => (tab.key === key ? { ...tab, label } : tab))
  pushLog(`rename → ${key}: ${label}`)
}
</script>

<template>
  <ProTabs
    v-model:active="active"
    :options="tabs"
    closable
    addable
    draggable
    renamable
    inset
    @add="onAdd"
    @close="onClose"
    @reorder="(keys: string[]) => onReorder(keys)"
    @rename="onRename"
  />

  <p class="mt-3 text-xs opacity-70">
    拖拽页签调整顺序，双击页签名重命名（Enter 提交 / Esc 取消）；「首页」通过页签级 closable=false 固定。
  </p>
  <ul class="mt-2 space-y-1 font-mono text-xs opacity-70">
    <li v-for="(log, i) in logs" :key="i">{{ log }}</li>
  </ul>
</template>
