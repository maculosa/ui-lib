<script setup lang="tsx">
import { ModalForm, ProTable } from '@banmao/procomponent'
import { NButton, NSpace } from 'naive-ui'
import { computed, h, ref } from 'vue'

const columns = ref([
  {
    title: '姓名',
    key: 'name',
    minWidth: 100,
    valueType: 'text',
    tooltip: '这是姓名',
    rules: [{ required: true, message: '请输入姓名' }],
  },
  {
    title: '年龄',
    key: 'age',
    minWidth: 100,
    valueType: 'digit',
    hideInForm: true,
    formItemProps: { min: 1 },
    rules: [{ required: true, message: '请输入年龄' }],
  },
  {
    title: '性别',
    key: 'gender',
    minWidth: 100,
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
    minWidth: 200,
    hideInSearch: true,
    valueType: 'text',
    formItemProps: {
      type: 'textarea',
    },
    copyable: true,
  },
  {
    title: '操作',
    key: 'actions',
    width: 100,
    fixed: 'right',
    render(row) {
      return h(
        NSpace,
        {
          wrap: false,
        },
        () => [
          h(
            ModalForm,
            {
              columns: columns.value,
              defaultValue: row,
              title: '编辑',
            },
            {
              default: () =>
                h(
                  NButton,
                  {
                    size: 'small',
                    type: 'primary',
                    text: true,
                  },
                  { default: () => '编辑' },
                ),
            },
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'error',
              text: true,
              onClick: () => {
                console.error('删除', row)
              },
            },
            { default: () => '删除' },
          ),
        ],
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
    address: 'asdasdasdasdasd',
  },
  { id: 2, name: '李四', age: 20 },
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

function handleCreate() {
  console.error('新增')
}
</script>

<template>
  <ProTable title="创建弹窗表单" :columns="columns" :data="dataSource" :pagination :row-key :loading="loading" :search-config="{
    defaultValue: {
      age: 16,
    },
  }" :toolbar-config="{
    create: true,
    createLabel: 'Create',
    createMode: 'modal',
  }" @update:page-size="handleChangePageSize" @load-data="fetchTableData" @create="handleCreate" />
</template>
