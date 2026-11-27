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
    // 未声明 quick-jumper，快速跳页输入框不会渲染
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

    <NAlert type="info" title="displayOrder 决定显示项" :bordered="false">
      <code>displayOrder</code> 未包含 <code>size-picker</code> / <code>quick-jumper</code> 时，对应控件不会渲染——本例只声明了
      <code>pages</code> 与 <code>size-picker</code>，所以上方「快速跳页」为 <code>false</code>，分页器里也没有跳页输入框。
      <code>pages</code> 没有对应的开关，页码列表始终渲染；完全不传 <code>displayOrder</code> 时，两个控件都会显示。
      该行为自 <code>@banmao/hooks@0.0.8</code> 起生效，0.0.7 及更早版本实现为 <code>includes(...) || true</code>，两项控件恒显示。
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
