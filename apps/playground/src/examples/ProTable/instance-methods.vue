<script setup lang="ts">
import { ProTable } from '@banmao/procomponent'
import type { ProTableInstance } from '@banmao/procomponent'
import { NButton, NSpace, useMessage } from 'naive-ui'
import { computed, nextTick, ref } from 'vue'

const message = useMessage()
const tableRef = ref<ProTableInstance | null>(null)

const columns = [
  { title: '姓名', key: 'name', valueType: 'text', minWidth: 120 },
  { title: '年龄', key: 'age', valueType: 'digit', width: 110 },
  { title: '部门', key: 'department', valueType: 'text', minWidth: 140 },
  { title: '邮箱', key: 'email', valueType: 'text', minWidth: 200, hideInSearch: true },
]

const allRows = [
  { id: 1, name: '张伟', age: 28, department: '研发部', email: 'zhangwei@example.com' },
  { id: 2, name: '王芳', age: 31, department: '设计部', email: 'wangfang@example.com' },
  { id: 3, name: '李娜', age: 26, department: '市场部', email: 'lina@example.com' },
  { id: 4, name: '刘洋', age: 35, department: '运营部', email: 'liuyang@example.com' },
]

/** 通过 setColumns 维护的当前列，不依赖父级 columns 的变化 */
const currentColumns = ref<any[]>([...columns])
const hasEmail = ref(true)
const query = ref<Record<string, any>>({})

const dataSource = computed(() => {
  return allRows.filter((row) => {
    if (query.value.name && !row.name.includes(query.value.name)) return false
    return true
  })
})

async function handleQuery(params: Record<string, any>) {
  query.value = params
}

function toggleEmailColumn() {
  hasEmail.value = !hasEmail.value
  currentColumns.value = hasEmail.value
    ? [...currentColumns.value, columns[3]]
    : currentColumns.value.filter(column => column.key !== 'email')
  tableRef.value?.setColumns(currentColumns.value)
}

function hideAgeColumn() {
  tableRef.value?.setColumnsState({
    order: currentColumns.value.map(column => String(column.key)),
    hidden: ['age'],
  })
  message.info('已隐藏「年龄」列')
}

function resetColumns() {
  tableRef.value?.setColumnsState(null)
}

async function searchByName() {
  tableRef.value?.setSearch({ name: '张' })
  await nextTick()
  tableRef.value?.searchFormRef?.submit()
}

function simulateReload() {
  tableRef.value?.setLoading(true)
  setTimeout(() => {
    tableRef.value?.setLoading(false)
    message.success('模拟刷新完成')
  }, 500)
}
</script>

<template>
  <NSpace vertical>
    <NSpace>
      <NButton size="small" @click="toggleEmailColumn">
        {{ hasEmail ? '移除邮箱列' : '增加邮箱列' }}
      </NButton>
      <NButton size="small" @click="hideAgeColumn">
        隐藏年龄列
      </NButton>
      <NButton size="small" @click="resetColumns">
        重置列设置
      </NButton>
      <NButton size="small" @click="searchByName">
        搜索「张」
      </NButton>
      <NButton size="small" @click="simulateReload">
        模拟刷新
      </NButton>
    </NSpace>
    <ProTable
      ref="tableRef"
      :columns="columns"
      :data="dataSource"
      :on-query="handleQuery"
    />
  </NSpace>
</template>
