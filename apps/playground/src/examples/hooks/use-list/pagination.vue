<script setup lang="ts">
import { useList } from '@banmao/hooks'
import { NAlert, NDataTable, NDescriptions, NDescriptionsItem } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'

interface Row {
  id: number
  name: string
  dept: string
}

const rows: Row[] = Array.from({ length: 68 }, (_, i) => ({
  id: i + 1,
  name: `员工 ${i + 1}`,
  dept: ['研发', '市场', '财务'][i % 3],
}))

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

const { dataSource, loading, pagination, handlePageChange, handlePageSizeChange } = useList(listRequest, {
  pagination: {
    // 期望只渲染页码与每页条数；当前 displayOrder 不参与计算，见下方说明
    displayOrder: ['pages', 'size-picker'],
    pageSizes: [5, 10, 20],
    pageSize: 5,
  },
})

const columns: DataTableColumns<Row> = [
  { title: '工号', key: 'id', width: 90 },
  { title: '姓名', key: 'name', width: 140 },
  { title: '部门', key: 'dept', width: 120 },
]
</script>

<template>
  <div class="wrap">
    <NDescriptions label-placement="left" size="small" bordered :column="4" class="state">
      <NDescriptionsItem label="当前页">{{ pagination.page }}</NDescriptionsItem>
      <NDescriptionsItem label="每页条数">{{ pagination.pageSize }}</NDescriptionsItem>
      <NDescriptionsItem label="可选条数">{{ JSON.stringify(pagination.pageSizes) }}</NDescriptionsItem>
      <NDescriptionsItem label="快速跳页">{{ pagination.showQuickJumper }}</NDescriptionsItem>
    </NDescriptions>

    <NAlert type="warning" title="displayOrder 当前不生效" :bordered="false">
      <code>pageSize</code> 与 <code>pageSizes</code> 会按配置生效，但钩子内部把
      <code>showSizePicker</code> / <code>showQuickJumper</code> 写成了
      <code>displayOrder.includes(...) || true</code>，短路后恒为 <code>true</code>。因此上面声明了
      <code>displayOrder: ['pages', 'size-picker']</code>，快速跳页输入框仍然渲染。需要隐藏时只能在拿到的
      <code>pagination</code> 上再覆写：<code>pagination.value.showQuickJumper = false</code>。
    </NAlert>

    <NDataTable
      remote
      size="small"
      :columns="columns"
      :data="dataSource"
      :loading="loading"
      :pagination="pagination"
      :row-key="(row: Row) => row.id"
      :max-height="360"
      @update:page="handlePageChange"
      @update:page-size="handlePageSizeChange"
    />
  </div>
</template>

<style scoped>
.wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.state {
  font-size: 13px;
}
</style>
