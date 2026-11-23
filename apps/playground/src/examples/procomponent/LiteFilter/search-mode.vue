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
]

const showSearchButton = ref(false)
const searchDebounce = ref(300)
const result = ref('')

function show(values: Record<string, any>) {
  result.value = JSON.stringify(values, null, 2)
}
</script>

<template>
  <div>
    <p class="mb-3 text-xs opacity-60">
      默认没有查询按钮：任意条件变化后等 {{ searchDebounce }}ms 自动抛
      <code>search</code>，连续输入只算一次。打开「显示查询按钮」即回到手动模式。
    </p>
    <div class="mb-3 flex flex-wrap items-center gap-4 text-xs">
      <NSwitch v-model:value="showSearchButton" size="small" />
      <span>显示查询按钮（关闭自动查询）</span>
      <NRadioGroup v-model:value="searchDebounce" size="small">
        <NRadioButton v-for="ms in [0, 300, 800]" :key="ms" :value="ms">
          {{ ms }}ms
        </NRadioButton>
      </NRadioGroup>
    </div>
    <LiteFilter
      :columns="columns"
      :show-search-button="showSearchButton"
      :search-debounce="searchDebounce"
      @search="show"
      @reset="show"
    />
    <pre class="mt-4 rounded-lg bg-black/5 p-3 text-xs leading-5">{{ result || '改变任意条件后在这里展示查询结果' }}</pre>
  </div>
</template>
