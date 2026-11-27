<script setup lang="ts">
import { useList } from '@banmao/hooks'
import { NButton, NDataTable, NInput, NSpace, NTag } from 'naive-ui'
import { h, ref } from 'vue'
import type { DataTableColumns } from 'naive-ui'

interface Row {
  id: number
  name: string
  dept: string
}

const rows: Row[] = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  name: `员工 ${i + 1}`,
  dept: ['研发', '市场', '财务'][i % 3],
}))

function listRequest(params: { pageNum: number; pageSize: number; keyword?: string }) {
  const { pageNum, pageSize, keyword = '' } = params
  const filtered = rows.filter(row => !keyword || row.name.includes(keyword))
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

// 导出请求：把当前筛选条件透传给后端，返回 { data: BlobPart, fileName?: string }
async function exportRequestFn(params: { keyword?: string } = {}) {
  const keyword = params.keyword ?? ''
  const filtered = rows.filter(row => !keyword || row.name.includes(keyword))
  const csv = [
    ['工号', '姓名', '部门'].join(','),
    ...filtered.map(row => [row.id, row.name, row.dept].join(',')),
  ].join('\n')

  exported.value += 1
  lastExport.value = { keyword, count: filtered.length }

  // 加 BOM，避免 Excel 打开 UTF-8 中文乱码
  return { data: new window.Blob(['\ufeff', csv]), fileName: `员工名册-${filtered.length}条.xls` }
}

const exported = ref(0)
const lastExport = ref<{ keyword: string; count: number } | null>(null)
const filterOption = ref({ keyword: '' })

const { dataSource, loading, pagination, handlePageChange, handleExcelData } = useList(listRequest, {
  filterOption,
  exportRequestFn,
})

const columns: DataTableColumns<Row> = [
  { title: '工号', key: 'id', width: 90 },
  { title: '姓名', key: 'name', width: 140 },
  {
    title: '部门',
    key: 'dept',
    width: 120,
    render: row => h(NTag, { size: 'small', bordered: false }, () => row.dept),
  },
]
</script>

<template>
  <NSpace vertical :size="12">
    <NSpace align="center">
      <NInput
        v-model:value="filterOption.keyword"
        size="small"
        clearable
        placeholder="姓名关键字"
        style="width: 180px"
      />
      <NButton size="small" @click="handleExcelData()">导出当前筛选结果</NButton>
      <span class="hint">已导出 {{ exported }} 次</span>
      <NTag v-if="lastExport" size="small" :bordered="false">
        关键字「{{ lastExport.keyword || '空' }}」共 {{ lastExport.count }} 行
      </NTag>
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
  </NSpace>
</template>

<style scoped>
.hint {
  font-size: 13px;
  color: var(--color-foreground-tertiary);
}
</style>
