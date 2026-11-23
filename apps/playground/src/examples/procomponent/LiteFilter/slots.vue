<script setup lang="ts">
import { LiteFilter, type LiteFilterColumn } from '@banmao/procomponent'
import { useMessage } from 'naive-ui'
import { ref } from 'vue'

const message = useMessage()
const result = ref('')

const columns: LiteFilterColumn[] = [
  { key: 'keyword', title: '关键词', valueType: 'text', width: 240 },
  {
    key: 'priority',
    title: '优先级',
    valueType: 'radio',
    options: [
      { label: '高', value: 'high' },
      { label: '中', value: 'medium' },
      { label: '低', value: 'low' },
    ],
  },
  {
    key: 'status',
    title: '状态',
    valueType: 'select',
    options: [
      { label: '启用', value: 'active' },
      { label: '停用', value: 'disabled' },
    ],
    tooltip: '仅影响列表默认展示范围',
  },
]

function exportConditions() {
  message.info('导出当前查询条件（actions 插槽）')
}

function show(values: Record<string, any>) {
  result.value = JSON.stringify(values, null, 2)
}
</script>

<template>
  <div>
    <LiteFilter :columns="columns" @search="show" @reset="show">
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
      <template #actions>
        <NButton text type="primary" @click="exportConditions">
          导出条件
        </NButton>
      </template>
    </LiteFilter>
    <pre class="mt-4 rounded-lg bg-black/5 p-3 text-xs leading-5">{{ result || '输入关键词或选择条件后自动查询' }}</pre>
  </div>
</template>
