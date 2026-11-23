<script setup lang="ts">
import { QueryFilter, type QueryFilterColumn } from '@banmao/procomponent'
import { useMessage } from 'naive-ui'
import { computed, ref } from 'vue'

const message = useMessage()

const columns: QueryFilterColumn[] = [
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
  { key: 'city', title: '城市', valueType: 'text' },
  { key: 'owner', title: '负责人', valueType: 'text' },
  { key: 'createdAt', title: '创建日期', valueType: 'date' },
]

const values = ref<Record<string, any>>({ status: 'active' })
const collapsed = ref(true)
const loading = ref(false)
const submitted = ref('')

const summary = computed(() => JSON.stringify(values.value, null, 2))

function applyPreset() {
  values.value = { status: 'disabled', city: '上海', owner: '张三' }
}

function clearAll() {
  values.value = {}
}

async function handleSearch(current: Record<string, any>) {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 500))
  submitted.value = JSON.stringify(current, null, 2)
  loading.value = false
  message.success('查询完成')
}

function exportConditions() {
  message.info('导出当前查询条件（actions 插槽）')
}
</script>

<template>
  <div>
    <div class="mb-3 flex flex-wrap items-center gap-2">
      <NButton size="small" @click="applyPreset">
        填充预设条件
      </NButton>
      <NButton size="small" @click="clearAll">
        清空条件
      </NButton>
      <NButton size="small" @click="collapsed = !collapsed">
        {{ collapsed ? '展开表单' : '折叠表单' }}
      </NButton>
      <span class="text-xs opacity-60">当前值：{{ summary }}</span>
    </div>

    <QueryFilter
      v-model:model-value="values"
      v-model:collapsed="collapsed"
      :columns="columns"
      :grid-cols="3"
      :loading="loading"
      @search="handleSearch"
      @field-change="(key: string) => message.info(`字段 ${key} 变化`)"
    >
      <template #actions>
        <NButton text type="primary" @click="exportConditions">
          导出条件
        </NButton>
      </template>
    </QueryFilter>

    <pre class="mt-4 rounded-lg bg-black/5 p-3 text-xs leading-5">{{ submitted || '查询后在这里展示提交值' }}</pre>
  </div>
</template>
