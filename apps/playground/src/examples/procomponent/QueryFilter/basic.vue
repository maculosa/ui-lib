<script setup lang="ts">
import { QueryFilter, type QueryFilterColumn } from '@banmao/procomponent'
import { ref } from 'vue'

const columns: QueryFilterColumn[] = [
  { key: 'keyword', title: '关键词', valueType: 'text', placeholder: '姓名 / 手机号' },
  {
    key: 'status',
    title: '状态',
    valueType: 'select',
    options: [
      { label: '启用', value: 'active' },
      { label: '停用', value: 'disabled' },
    ],
  },
  {
    key: 'city',
    title: '城市',
    valueType: 'select',
    options: [
      { label: '北京', value: 'beijing' },
      { label: '上海', value: 'shanghai' },
      { label: '杭州', value: 'hangzhou' },
    ],
  },
  { key: 'createdAt', title: '创建日期', valueType: 'date' },
  { key: 'owner', title: '负责人', valueType: 'text' },
  { key: 'createdBy', title: '创建人', valueType: 'text' },
]

const result = ref('')

function show(values: Record<string, any>) {
  result.value = JSON.stringify(values, null, 2)
}
</script>

<template>
  <div>
    <QueryFilter
      :columns="columns"
      :grid-cols="3"
      :default-value="{ status: 'active' }"
      @search="show"
      @reset="show"
    />

    <pre class="mt-4 rounded-lg bg-black/5 p-3 text-xs leading-5">{{ result || '点击查询或重置后在这里展示条件' }}</pre>
  </div>
</template>
