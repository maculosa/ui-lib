<script setup lang="ts">
import { LiteFilter, type LiteFilterColumn } from '@banmao/procomponent'
import { ref } from 'vue'

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
  { key: 'owner', title: '负责人', valueType: 'text', advanced: true },
  { key: 'createdAt', title: '创建日期', valueType: 'date', advanced: true },
  { key: 'amount', title: '金额', valueType: 'digit', advanced: true, formItemProps: { min: 0 } },
]

const result = ref('')

function show(values: Record<string, any>) {
  result.value = JSON.stringify(values, null, 2)
}
</script>

<template>
  <div>
    <p class="mb-3 text-xs opacity-60">
      关键词与状态留在主行，负责人 / 日期 / 金额收进「高级筛选」弹层；弹层内改条件同样自动查询，底部重置只清空弹层字段。
    </p>
    <LiteFilter :columns="columns" @search="show" @reset="show" />
    <pre class="mt-4 rounded-lg bg-black/5 p-3 text-xs leading-5">{{ result || '改变任意条件（含弹层内）后在这里展示查询条件' }}</pre>
  </div>
</template>