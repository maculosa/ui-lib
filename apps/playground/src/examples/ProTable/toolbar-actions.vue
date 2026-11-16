<script setup lang="ts">
import { ProTable } from '@banmao/procomponent'
import { useMessage } from 'naive-ui'
import { ref } from 'vue'

const message = useMessage()

const columns = [
  { type: 'selection' },
  { type: 'index' },
  { title: '姓名', key: 'name', valueType: 'text', minWidth: 120 },
  { title: '年龄', key: 'age', valueType: 'digit', width: 110 },
  { title: '部门', key: 'department', valueType: 'text', minWidth: 140 },
]

const dataSource = ref([
  { id: 1, name: '张伟', age: 28, department: '研发部' },
  { id: 2, name: '王芳', age: 31, department: '设计部' },
  { id: 3, name: '李娜', age: 26, department: '市场部' },
  { id: 4, name: '刘洋', age: 35, department: '运营部' },
])

function handleDelete(rowKeys: (string | number)[]) {
  dataSource.value = dataSource.value.filter(row => !rowKeys.includes(row.id))
  message.success(`已删除 ${rowKeys.length} 条`)
}

function handleImport(file: File) {
  message.info(`已选择文件：${file.name}`)
}
</script>

<template>
  <ProTable
    :columns="columns"
    :data="dataSource"
    :row-key="row => row.id"
    :toolbar="{ delete: true, import: true, importAccept: '.csv,.xlsx' }"
    @delete="handleDelete"
    @import="handleImport"
  />
</template>
