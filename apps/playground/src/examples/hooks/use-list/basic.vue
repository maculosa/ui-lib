<script setup lang="ts">
import { useList } from '@banmao/hooks'
import { NButton, NDataTable, NSpace, NTag } from 'naive-ui'
import { h } from 'vue'
import type { DataTableColumns } from 'naive-ui'

interface Row {
  id: number
  name: string
  dept: string
  onDuty: boolean
  amount: number
}

const rows: Row[] = Array.from({ length: 46 }, (_, i) => ({
  id: i + 1,
  name: `员工 ${i + 1}`,
  dept: ['研发', '市场', '财务'][i % 3],
  onDuty: i % 4 !== 0,
  amount: 1200 + i * 37,
}))

// 约定：请求函数接收 { pageNum, pageSize, ...筛选参数 }，返回 { status, data: { list, pageNum, pageSize, total } }
function listRequest(params: { pageNum: number; pageSize: number }) {
  const { pageNum, pageSize } = params
  return new Promise<any>(resolve =>
    setTimeout(
      () =>
        resolve({
          status: 200,
          data: {
            list: rows.slice((pageNum - 1) * pageSize, pageNum * pageSize),
            pageNum,
            pageSize,
            total: rows.length,
          },
        }),
      300,
    ),
  )
}

const { dataSource, loading, pagination, loadData, handlePageChange, handlePageSizeChange, handleSortChange } =
  useList(listRequest)

const columns: DataTableColumns<Row> = [
  { title: '工号', key: 'id', width: 90 },
  { title: '姓名', key: 'name', width: 120 },
  { title: '部门', key: 'dept', width: 100 },
  {
    title: '在职',
    key: 'onDuty',
    width: 90,
    render: row =>
      h(NTag, { size: 'small', type: row.onDuty ? 'success' : 'default' }, () =>
        row.onDuty ? '在职' : '请假',
      ),
  },
  { title: '绩效', key: 'amount', width: 110, sorter: 'default' },
]
</script>

<template>
  <NSpace vertical :size="12">
    <NSpace align="center">
      <NButton size="small" :loading="loading" @click="loadData()">重新加载</NButton>
      <span class="hint">
        第 {{ pagination.page }} 页 / 每页 {{ pagination.pageSize }} 条 / 共
        {{ pagination.itemCount }} 条
      </span>
    </NSpace>

    <NDataTable
      remote
      size="small"
      :columns="columns"
      :data="dataSource"
      :loading="loading"
      :pagination="pagination"
      :row-key="(row: Row) => row.id"
      :scroll-x="620"
      @update:page="handlePageChange"
      @update:page-size="handlePageSizeChange"
      @update:sorter="handleSortChange"
    />
  </NSpace>
</template>

<style scoped>
.hint {
  font-size: 13px;
  color: var(--color-foreground-tertiary);
}
</style>
