<script setup lang="tsx">
import { ModalForm, ProTable } from '@banmao/procomponent'
import { NButton, NSpace, useMessage } from 'naive-ui'
import { computed, ref } from 'vue'

const columns = ref([
  { type: 'index' },
  {
    title: '姓名',
    key: 'name',
    valueType: 'text',
    tooltip: '这是姓名',
    order: 2,
    sortOrder: false,
    sorter: 'default',
    filter: true,
    filterOptions: [
      { label: 'London', value: 'London' },
    ],
    rules: [{ required: true, message: '请输入姓名' }],
  },
  {
    title: '年龄',
    key: 'age',
    valueType: 'digit',
    hideInForm: true,
    order: 1,
    width: 120,
    sortOrder: false,
    sorter(rowA, rowB) {
      return rowA.age - rowB.age
    },
    formItemProps: { min: 1 },
    rules: [{ required: true, message: '请输入年龄' }],
  },
  {
    title: '性别',
    key: 'gender',
    hideInSearch: true,
    valueType: 'select',
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
      { label: '保密', value: 'secret' },
    ],
    render(row) {
      switch (row.gender) {
        case 'male':
          return '男'
        case 'female':
          return '女'
        case 'secret':
          return '保密'
        default:
          return '未知'
      }
    },
  },
  {
    title: '地址',
    key: 'address',
    hideInSearch: true,
    valueType: 'text',
    tooltip: '这是地址',
    filter: true,
    filterOptions: [
      { label: 'London', value: 'London' },
      { label: 'New York', value: 'New York' },
    ],
    formItemProps: {
      type: 'textarea',
    },
    copyable: true,
  },
  {
    title: '操作',
    key: 'actions',
    fixed: 'right',
    render(row: any) {
      return (
        <NSpace wrap={false}>
          <ModalForm
            title="编辑"
            columns={columns.value}
            model={row}
          >
            <NButton size="tiny" type="primary" text>编辑</NButton>
          </ModalForm>
          <NButton size="tiny" type="error" text>删除</NButton>
        </NSpace>
      )
    },
  },
])

const dataSource = ref([
  {
    id: 1,
    name: '张三',
    age: 18,
    gender: 'male',
    address: 'London',
  },
  { id: 2, name: '李四', age: 20, address: 'New York' },
])

const pagination = ref({
  page: 1,
  pageSize: 10,
  itemCount: dataSource.value.length,
  showQuickJumper: true,
  showSizePicker: true,
  pageSizes: [10, 20, 30, 40],
  prefix: ({ itemCount }) => `共 ${itemCount} 条数据`,
})

const loading = ref(false)

function fetchTableData() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 3000)
}

function handleChangePageSize(pageSize) {
  pagination.value.pageSize = pageSize
  fetchTableData()
}

const rowKey = computed(() => {
  return (row: any) => row.id
})

const message = useMessage()
function handleImport() {
  message.success('This is an Import Function')
}

</script>

<template>
  <ProTable
    ref="tableRef"
    title="数据表格" :columns="columns" :data="dataSource" :pagination :row-key :loading="loading"
    :search="false" @update:page-size="handleChangePageSize" @load-data="fetchTableData"
  >
    <template #toolbar>
      <n-button type="primary" @click="handleImport"> 导入 </n-button>
    </template>
  </ProTable>
</template>
