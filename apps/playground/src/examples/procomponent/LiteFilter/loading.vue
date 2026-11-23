<script setup lang="ts">
import { LiteFilter, type LiteFilterColumn } from '@banmao/procomponent'
import { useMessage } from 'naive-ui'
import { ref } from 'vue'

const message = useMessage()
const loading = ref(false)
const result = ref('')

const columns: LiteFilterColumn[] = [
  { key: 'keyword', title: '关键词', valueType: 'text' },
  {
    key: 'status',
    title: '状态',
    valueType: 'select',
    options: [
      { label: '启用', value: 'active' },
      { label: '停用', value: 'disabled' },
    ],
  },
]

async function beforeSearch(values: Record<string, any>) {
  if (values.keyword && values.keyword.length < 2) {
    message.warning('关键词至少输入 2 个字符')
    return false
  }
  return true
}

async function handleSearch(values: Record<string, any>) {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 600))
  result.value = JSON.stringify(values, null, 2)
  loading.value = false
  message.success('查询完成')
}
</script>

<template>
  <div>
    <LiteFilter
      :columns="columns"
      :loading="loading"
      :before-search="beforeSearch"
      @search="handleSearch"
    />
    <pre class="mt-4 rounded-lg bg-black/5 p-3 text-xs leading-5">{{ result || '关键词输入 1 个字符，自动查询会被 beforeSearch 拦截' }}</pre>
  </div>
</template>
