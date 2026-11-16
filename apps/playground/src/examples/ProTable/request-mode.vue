<script setup lang="ts">
import { ProTable } from '@banmao/procomponent'
import type { ProTableRequest } from '@banmao/procomponent'
import type { ProTableColumn } from 'naive-ui'

interface User {
  id: number
  name: string
  age: number
  department: string
  status: number
}

const departments = ['研发部', '设计部', '市场部', '运营部']
const statusOptions = [
  { label: '启用', value: 1 },
  { label: '停用', value: 0 },
]

const allUsers: User[] = Array.from({ length: 47 }, (_, index) => ({
  id: index + 1,
  name: `用户 ${String(index + 1).padStart(2, '0')}`,
  age: 22 + (index % 18),
  department: departments[index % departments.length],
  status: index % 4 === 0 ? 0 : 1,
}))

const columns: ProTableColumn<User>[] = [
  { type: 'selection' },
  { type: 'index' },
  { title: '姓名', key: 'name', valueType: 'text', minWidth: 120 },
  { title: '年龄', key: 'age', valueType: 'digit', width: 110, hideInSearch: true, sorter: true },
  {
    title: '部门',
    key: 'department',
    valueType: 'select',
    options: departments.map(department => ({ label: department, value: department })),
    width: 140,
  },
  {
    title: '状态',
    key: 'status',
    valueType: 'select',
    options: statusOptions,
    width: 120,
    filter: true,
    filterOptions: statusOptions,
    render: row => statusOptions.find(option => option.value === row.status)?.label,
  },
]

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const request: ProTableRequest<User> = async (params, sorter, filters) => {
  await delay(400)

  const { current, pageSize, name, department } = params
  let rows = allUsers.filter((row) => {
    if (name && !row.name.includes(String(name))) return false
    if (department && row.department !== department) return false
    const status = filters.status
    if (status?.length && !status.includes(row.status)) return false
    return true
  })

  if (sorter?.columnKey === 'age' && sorter.order) {
    rows = [...rows].sort((a, b) => (sorter.order === 'ascend' ? a.age - b.age : b.age - a.age))
  }

  return {
    data: rows.slice((current - 1) * pageSize, current * pageSize),
    total: rows.length,
  }
}
</script>

<template>
  <ProTable
    :columns="columns"
    :request="request"
    :row-key="row => row.id"
    :pagination="{ pageSize: 10, showSizePicker: true, pageSizes: [10, 20, 30] }"
  />
</template>
