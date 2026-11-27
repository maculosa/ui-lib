<script setup lang="ts">
import { ProTable } from '@banmao/procomponent'
import type { ProTableInstance } from '@banmao/procomponent'
import { useList, useTableHeight } from '@banmao/hooks'
import { NAlert, NSpace } from 'naive-ui'
import { ref } from 'vue'

interface Row {
  id: number
  name: string
  dept: string
  city: string
}

const rows: Row[] = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  name: `员工 ${i + 1}`,
  dept: ['研发', '市场', '财务'][i % 3],
  city: ['北京', '上海', '深圳', '杭州'][i % 4],
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

const { dataSource, loading, pagination, handlePageChange } = useList(listRequest)

const columns = ref([
  { title: '工号', key: 'id', width: 90, hideInSearch: true },
  { title: '姓名', key: 'name', width: 140 },
  {
    title: '部门',
    key: 'dept',
    width: 120,
    valueType: 'select',
    options: [
      { label: '研发', value: '研发' },
      { label: '市场', value: '市场' },
      { label: '财务', value: '财务' },
    ],
  },
  { title: '城市', key: 'city', width: 120 },
])

const tableRef = ref<ProTableInstance | null>(null)

// options 在初始化时读取一次：height 为搜索栏之外还要扣除的高度，minHeight 为结果下限
const { height } = useTableHeight(tableRef, { height: 320, minHeight: 260 })
</script>

<template>
  <NSpace vertical :size="12">
    <NAlert type="info" :bordered="false" title="当前计算结果">
      表格高度 <b>{{ height }}px</b> = 窗口高度 − ProTable 搜索栏高度 − 320（不足 260 时取 260）。缩放浏览器窗口即可看到取值跟随变化。
    </NAlert>

    <ProTable
      ref="tableRef"
      title="表格高度自适应"
      :columns="columns"
      :data="dataSource"
      :loading="loading"
      :pagination="pagination"
      :height="height"
      :scroll-x="620"
      :search="{ searchText: '查询' }"
      @update:page="handlePageChange"
    />
  </NSpace>
</template>
