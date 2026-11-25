<script setup lang="ts">
import { ref } from 'vue'
import { ProTabs } from '@banmao/procomponent'
import { NButton, NSpace } from 'naive-ui'

let seq = 3
const tabs = ref([
  { label: '页签 1', key: 'tab-1' },
  { label: '页签 2', key: 'tab-2' },
  { label: '页签 3', key: 'tab-3' },
])
const active = ref('tab-1')
const logs = ref<string[]>([])

function pushLog(text: string) {
  logs.value = [text, ...logs.value].slice(0, 4)
}

function addTab() {
  seq += 1
  tabs.value = [...tabs.value, { label: `页签 ${seq}`, key: `tab-${seq}` }]
}

function closeTab(key: string) {
  tabs.value = tabs.value.filter(tab => tab.key !== key)
  pushLog(`close → ${key}`)
}
</script>

<template>
  <NSpace align="center" class="mb-3" :size="8">
    <NButton size="small" @click="addTab">新增页签</NButton>
    <span class="text-xs opacity-70">非受控：default-active="tab-1"，选中态由组件内部维护</span>
  </NSpace>

  <ProTabs
    :options="tabs"
    default-active="tab-1"
    closable
    inset
    @update:active="(key: string) => { active = key; pushLog(`update:active → ${key}`) }"
    @close="closeTab"
  />

  <p class="mt-3 font-mono text-xs opacity-70">active = {{ active }}</p>
  <ul class="mt-2 space-y-1 font-mono text-xs opacity-70">
    <li v-for="(log, i) in logs" :key="i">{{ log }}</li>
  </ul>
  <p class="mt-2 text-xs opacity-70">
    关闭当前选中的页签后，组件会自动落到最后一个仍存在的页签；全部关掉后 active 变为空字符串。
  </p>
</template>