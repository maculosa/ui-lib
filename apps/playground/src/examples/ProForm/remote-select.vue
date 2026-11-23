<script setup lang="ts">
import type { SelectOption } from 'naive-ui'
import { ProForm } from '@banmao/procomponent'
import { NButton } from 'naive-ui'
import { ref } from 'vue'

const formModel = ref({})
const loadedAt = ref('')

function makeCityRequest(round: number) {
  return () => new Promise<SelectOption[]>((resolve) => {
    setTimeout(() => {
      loadedAt.value = `第 ${round} 次请求完成`
      resolve([
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
        { label: '广州', value: 'guangzhou' },
      ])
    }, 500)
  })
}

const columns = ref([
  {
    title: '城市',
    key: 'city',
    valueType: 'select',
    request: makeCityRequest(1),
    formItemProps: { placeholder: '选项由 request 异步加载' },
  },
  {
    title: '部门',
    key: 'dept',
    valueType: 'select',
    options: [
      { label: '研发部', value: 'rd' },
      { label: '设计部', value: 'design' },
      { label: '运营部', value: 'ops' },
    ],
  },
])

let round = 1

// 替换 request 引用后，同一 key 会重新请求
function reloadCities() {
  round += 1
  columns.value = columns.value.map(column =>
    column.key === 'city' ? { ...column, request: makeCityRequest(round) } : column,
  )
}
</script>

<template>
  <div>
    <ProForm v-model:model="formModel" :columns="columns" label-placement="left" :label-width="88" :grid-cols="2" />

    <div class="mt-4 flex items-center gap-3 text-xs">
      <NButton size="small" @click="reloadCities">替换 request 重新请求</NButton>
      <span class="opacity-70">{{ loadedAt }}</span>
    </div>

    <pre class="mt-3 rounded-lg bg-black/5 p-3 text-xs leading-5">{{ JSON.stringify(formModel, null, 2) }}</pre>
  </div>
</template>
