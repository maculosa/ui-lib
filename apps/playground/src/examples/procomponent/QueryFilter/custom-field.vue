<script setup lang="ts">
import { QueryFilter, type QueryFilterColumn } from '@banmao/procomponent'
import { ref } from 'vue'

const columns: QueryFilterColumn[] = [
  { key: 'keyword', title: '关键词', valueType: 'text' },
  { key: 'budget', title: '预算区间', valueType: 'text' },
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

const result = ref('')

function budgetRange(value: unknown) {
  return Array.isArray(value) ? value : [1000, 6000]
}

function show(values: Record<string, any>) {
  result.value = JSON.stringify(values, null, 2)
}
</script>

<template>
  <div>
    <QueryFilter
      :columns="columns"
      :grid-cols="3"
      :default-value="{ budget: [1000, 6000] }"
      @search="show"
      @reset="show"
    >
      <template #field-keyword="{ value, setValue }">
        <div class="flex w-full items-center gap-2">
          <NTag type="info" size="small" :bordered="false">
            自定义
          </NTag>
          <NInput
            :value="value"
            clearable
            placeholder="带前缀的自定义输入框"
            @update:value="setValue"
          />
        </div>
      </template>

      <template #field-budget="{ value, setValue }">
        <div class="flex w-full items-center gap-3">
          <NSlider
            class="flex-1"
            range
            :max="10000"
            :step="500"
            :value="budgetRange(value)"
            @update:value="setValue"
          />
          <span class="w-28 shrink-0 text-right font-mono text-xs opacity-70">
            {{ budgetRange(value).join(' - ') }}
          </span>
        </div>
      </template>
    </QueryFilter>

    <pre class="mt-4 rounded-lg bg-black/5 p-3 text-xs leading-5">{{ result || '拖动滑块或输入后点击查询' }}</pre>
  </div>
</template>
