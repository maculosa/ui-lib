<script setup lang="ts">
import { useList } from '@banmao/hooks'
import { NAlert, NDataTable, NSpace } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'

interface Row {
  id: number
  name: string
  amount: number
}

const rows: Row[] = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  name: `订单 ${i + 1}`,
  amount: 89 + i * 11,
}))

// 后端返回的不是 { status, data: { list, total } }，而是 { status: 0, data: { records, current, size, total } }
function listRequest(params: { pageNum: number; pageSize: number }) {
  const { pageNum, pageSize } = params
  return new Promise<any>(resolve =>
    setTimeout(
      () =>
        resolve({
          status: 0,
          data: {
            records: rows.slice((pageNum - 1) * pageSize, pageNum * pageSize),
            current: pageNum,
            size: pageSize,
            total: rows.length,
          },
        }),
      300,
    ),
  )
}

const { dataSource, loading, pagination, handlePageChange, handlePageSizeChange } = useList(listRequest, {
  // 业务成功码，默认 200
  code: 0,
  // callback 负责把响应整理成 { list, pageNum, pageSize, total }
  callback: (payload: any) => ({
    list: payload.records,
    pageNum: payload.current,
    pageSize: payload.size,
    total: payload.total,
  }),
})

const columns: DataTableColumns<Row> = [
  { title: '编号', key: 'id', width: 100 },
  { title: '名称', key: 'name', width: 140 },
  { title: '金额', key: 'amount', width: 120 },
]
</script>

<template>
  <NSpace vertical :size="12">
    <NAlert type="info" title="code + callback 适配非标准响应" :bordered="false">
      <code>code</code> 与响应的 <code>status</code> 字段比对；<code>callback</code> 需把
      <code>data</code> 整理为 <code>{ list, pageNum, pageSize, total }</code> 才能被
      <code>useList</code> 消费。
    </NAlert>

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
      @update:page-size="handlePageSizeChange"
    />
  </NSpace>
</template>
