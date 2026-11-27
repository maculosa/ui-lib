<script setup lang="ts">
import { useList } from '@banmao/hooks'
import { NButton, NDataTable, NInput, NSelect, NSpace, NTag } from 'naive-ui'
import { ref, h } from 'vue'
import type { DataTableColumns } from 'naive-ui'

interface Row {
  id: number
  name: string
  dept: string
  onDuty: boolean
}

const deptOptions = [
  { label: '研发', value: '研发' },
  { label: '市场', value: '市场' },
  { label: '财务', value: '财务' },
]

const rows: Row[] = Array.from({ length: 37 }, (_, i) => ({
  id: i + 1,
  name: `员工 ${i + 1}`,
  dept: deptOptions[i % 3].value,
  onDuty: i % 4 !== 0,
}))

function listRequest(params: { pageNum: number; pageSize: number; name?: string; dept?: string | null }) {
  const { pageNum, pageSize, name = '', dept } = params
  const filtered = rows.filter(
    row => (!name || row.name.includes(name)) && (!dept || row.dept === dept),
  )
  return new Promise<any>(resolve =>
    setTimeout(
      () =>
        resolve({
          status: 200,
          data: {
            list: filtered.slice((pageNum - 1) * pageSize, pageNum * pageSize),
            pageNum,
            pageSize,
            total: filtered.length,
          },
        }),
      300,
    ),
  )
}

// filterOption 是一个 ref，useList 每次请求都会读取它的最新值
const filterOption = ref<{ name: string; dept: string | null }>({ name: '', dept: null })
const lastParams = ref<Record<string, any>>({})

function request(params: any) {
  lastParams.value = params
  return listRequest(params)
}

const { dataSource, loading, pagination, loadData, handlePageChange } = useList(request, {
  filterOption,
})

// 重置：把筛选条件恢复默认值后重新从第一页加载
function handleReset() {
  filterOption.value = { name: '', dept: null }
  loadData(1)
}

const columns: DataTableColumns<Row> = [
  { title: '工号', key: 'id', width: 90 },
  { title: '姓名', key: 'name', width: 140 },
  { title: '部门', key: 'dept', width: 120 },
  {
    title: '在职',
    key: 'onDuty',
    width: 100,
    render: row => h(NTag, { size: 'small', type: row.onDuty ? 'success' : 'default' }, () => (row.onDuty ? '在职' : '请假')),
  },
]
</script>

<template>
  <NSpace vertical :size="12">
    <NSpace align="center" :wrap="false">
      <NInput
        v-model:value="filterOption.name"
        size="small"
        clearable
        placeholder="搜索姓名"
        style="width: 160px"
        @keyup.enter="loadData(1)"
      />
      <NSelect
        v-model:value="filterOption.dept"
        size="small"
        clearable
        :options="deptOptions"
        placeholder="部门"
        style="width: 140px"
      />
      <NButton size="small" type="primary" :loading="loading" @click="loadData(1)">查询</NButton>
      <NButton size="small" @click="handleReset">重置</NButton>
    </NSpace>

    <NDataTable
      remote
      size="small"
      :columns="columns"
      :data="dataSource"
      :loading="loading"
      :pagination="pagination"
      :row-key="(row: Row) => row.id"
      :max-height="320"
      @update:page="handlePageChange"
    />

    <p class="params">最近一次请求参数：{{ JSON.stringify(lastParams) }}</p>
  </NSpace>
</template>

<style scoped>
.params {
  margin: 0;
  font-size: 12px;
  font-family: var(--font-mono, ui-monospace, monospace);
  color: var(--color-foreground-tertiary);
  word-break: break-all;
}
</style>
