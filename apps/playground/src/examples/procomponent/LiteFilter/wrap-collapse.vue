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
  { key: 'createdAt', title: '创建日期', valueType: 'date' },
  { key: 'period', title: '日期范围', valueType: 'dateRange' },
  { key: 'remark', title: '备注', valueType: 'text', width: 260 },
]

const gap = ref(12)
const collapsed = ref(true)
const showLabel = ref(false)
const card = ref(false)
const result = ref('')

function show(values: Record<string, any>) {
  result.value = JSON.stringify(values, null, 2)
}
</script>

<template>
  <div>
    <div class="mb-3 flex flex-wrap items-center gap-2 text-xs">
      <NButtonGroup size="small">
        <NButton :type="gap === 8 ? 'primary' : 'default'" @click="gap = 8">
          8px
        </NButton>
        <NButton :type="gap === 12 ? 'primary' : 'default'" @click="gap = 12">
          12px
        </NButton>
        <NButton :type="gap === 20 ? 'primary' : 'default'" @click="gap = 20">
          20px
        </NButton>
      </NButtonGroup>
      <NButton size="small" @click="collapsed = !collapsed">
        {{ collapsed ? '展开表单' : '折叠表单' }}
      </NButton>
      <NButton size="small" @click="showLabel = !showLabel">
        {{ showLabel ? '隐藏标签' : '显示标签' }}
      </NButton>
      <NButton size="small" @click="card = !card">
        {{ card ? '去掉卡片' : '恢复卡片' }}
      </NButton>
      <span class="opacity-60">备注列 width=260，其余按类型取默认宽度</span>
    </div>
    <LiteFilter
      v-model:collapsed="collapsed"
      :columns="columns"
      :gap="gap"
      :show-label="showLabel"
      :card="card"
      @search="show"
      @reset="show"
    />
    <pre class="mt-4 rounded-lg bg-black/5 p-3 text-xs leading-5">{{ result || '拖动窗口宽度观察字段换行与折叠限高' }}</pre>
  </div>
</template>
