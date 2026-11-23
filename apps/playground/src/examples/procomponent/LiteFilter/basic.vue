<script setup lang="ts">
import { LiteFilter, type LiteFilterColumn } from '@banmao/procomponent'
import { ref } from 'vue'

const columns: LiteFilterColumn[] = [
  { key: 'keyword', title: '关键词', valueType: 'text', placeholder: '订单号 / 客户' },
  {
    key: 'status',
    title: '状态',
    valueType: 'select',
    options: [
      { label: '启用', value: 'active' },
      { label: '停用', value: 'disabled' },
    ],
  },
  { key: 'owner', title: '负责人', valueType: 'text' },
  { key: 'createdAt', title: '创建日期', valueType: 'date' },
  { key: 'amount', title: '金额', valueType: 'digit' },
]

const result = ref('')

function show(values: Record<string, any>) {
  result.value = JSON.stringify(values, null, 2)
}
</script>

<template>
  <div>
    <p class="mb-3 text-xs opacity-60">
      默认无卡片、无字段标签、无查询按钮：条件用占位符说明，小尺寸控件与 12px 间距；字段按类型取默认宽度、放不下自动换行，超出折叠行数的部分收进「展开」。改变任意条件后等 300ms 自动查询。
    </p>
    <LiteFilter
      :columns="columns"
      :default-value="{ status: 'active' }"
      @search="show"
      @reset="show"
    />
    <pre class="mt-4 rounded-lg bg-black/5 p-3 text-xs leading-5">{{ result || '改变任意条件后在这里展示查询条件' }}</pre>
  </div>
</template>
