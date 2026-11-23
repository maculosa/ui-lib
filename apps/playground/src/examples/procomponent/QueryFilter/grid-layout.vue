<script setup lang="ts">
import { QueryFilter, type QueryFilterColumn } from '@banmao/procomponent'
import { ref } from 'vue'

const columns: QueryFilterColumn[] = [
  { key: 'keyword', title: '关键词', valueType: 'text', order: 1 },
  {
    key: 'status',
    title: '状态',
    valueType: 'select',
    order: 2,
    options: [
      { label: '启用', value: 'active' },
      { label: '停用', value: 'disabled' },
    ],
  },
  { key: 'owner', title: '负责人', valueType: 'text', order: 3 },
  { key: 'createdAt', title: '创建日期', valueType: 'date', order: 4 },
  { key: 'remark', title: '备注', valueType: 'text', grid: 2, order: 5 },
  { key: 'internalCode', title: '内部编码', valueType: 'text', hideInSearch: true },
]

const gridCols = ref<number | string>('1 s:2 m:3 l:4')
const result = ref('')

function show(values: Record<string, any>) {
  result.value = JSON.stringify(values, null, 2)
}
</script>

<template>
  <div>
    <div class="mb-3 flex flex-wrap items-center gap-2 text-xs">
      <span class="opacity-60">grid-cols：</span>
      <NButtonGroup size="small">
        <NButton :type="gridCols === 2 ? 'primary' : 'default'" @click="gridCols = 2">
          2 列
        </NButton>
        <NButton :type="gridCols === 3 ? 'primary' : 'default'" @click="gridCols = 3">
          3 列
        </NButton>
        <NButton :type="gridCols === '1 s:2 m:3 l:4' ? 'primary' : 'default'" @click="gridCols = '1 s:2 m:3 l:4'">
          响应式
        </NButton>
      </NButtonGroup>
      <span class="opacity-60">备注列 grid=2 会跨两列；内部编码 hideInSearch 不渲染。</span>
    </div>

    <QueryFilter
      :columns="columns"
      :grid-cols="gridCols"
      :card="false"
      :form-config="{ gridCollapsed: true, gridCollapsedRows: 1, labelPlacement: 'top' }"
      @search="show"
      @reset="show"
    />

    <pre class="mt-4 rounded-lg bg-black/5 p-3 text-xs leading-5">{{ result || '切换列数观察栅格与折叠行为' }}</pre>
  </div>
</template>
