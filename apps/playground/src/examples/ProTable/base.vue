<script setup lang="tsx">
import { ProTable } from '@banmao/procomponent'
import { NButton, NSpace } from 'naive-ui'
import { computed, ref, watchEffect } from 'vue'
import { useElementSize } from '@vueuse/core'

async function fetchCityList() {
  return new Promise<any[]>(resolve => {
    setTimeout(() => {
      resolve([
        { label: '北京', value: 110000 },
        { label: '上海', value: 310000 },
        {
          label: '山东',
          value: 370000,
          children: [
            { label: '济南', value: 370100 },
            { label: '青岛', value: 370200 },
            { label: '临沂', value: 371300 },
          ],
        },
      ])
    }, 3000)
  })
}

const columns = ref([
  { type: 'selection' },
  { type: 'index' },
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
    render(row: any) {
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
    title: '城市',
    key: 'city',
    valueType: 'cascader',
    width: 200,
    request: fetchCityList,
    // async () => {
    //   return new Promise(resolve => {
    //     setTimeout(() => {
    //       resolve([
    //         { label: '北京', value: 110000 },
    //         { label: '上海', value: 310000 },
    //         {
    //           label: '山东', value: 370000,
    //           children: [
    //             { label: '济南', value: 370100 },
    //             { label: '青岛', value: 370200 },
    //             { label: '临沂', value: 371300 },
    //           ]
    //         },
    //       ])
    //     }, 300)
    //   })
    // }
  },
  {
    title: '地址',
    key: 'address',
    minWidth: 400,
    hideInSearch: true,
    hideInForm: true,
    valueType: 'text',
    formItemProps: {
      type: 'textarea',
    },
    copyable: true,
  },
  {
    title: '操作',
    key: 'actions',
    width: 120,
    fixed: 'right',
    render() {
      return (
        <NSpace justify="center">
          <NButton size="tiny" ghost type="primary">
            编辑
          </NButton>
          <NButton size="tiny" ghost type="error">
            删除
          </NButton>
        </NSpace>
      )
      // return h(
      //   NSpace,
      //   {
      //     wrap: false
      //   },
      //   () => [
      //     h(
      //       ModalForm,
      //       {
      //         columns: columns.value,
      //         model: row,
      //         title: '编辑'
      //       },
      //       {
      //         default: () =>
      //           h(
      //             NButton,
      //             {
      //               size: 'small',
      //               type: 'primary',
      //               text: true
      //             },
      //             { default: () => '编辑' }
      //           )
      //       }
      //     ),
      //     h(
      //       NButton,
      //       {
      //         size: 'small',
      //         type: 'error',
      //         text: true,
      //         onClick: () => {
      //           console.log('删除', row)
      //         }
      //       },
      //       { default: () => '删除' }
      //     )
      //   ]
      // )
    },
  },
])

const dataSource = ref([
  {
    id: 1,
    name: '张三',
    age: 18,
    city: 371302,
    gender: 'male',
    address: 'asdasdasdasdasd',
  },
  { id: 2, name: '李四', age: 20 },
  { id: 3, name: '王五', age: 22 },
  { id: 4, name: '赵六', age: 24 },
])

const pagination = ref({
  page: 1,
  pageSize: 10,
  itemCount: dataSource.value.length,
  showQuickJumper: true,
  showSizePicker: true,
  pageSizes: [10, 20, 30, 40],
  prefix: ({ itemCount }: { itemCount: number }) => `共 ${itemCount} 条数据`,
})

const loading = ref(false)

function fetchTableData() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 300)
}

function handleChangePageSize(pageSize: number) {
  pagination.value.pageSize = pageSize
  fetchTableData()
}

// function handleEdit(row) {
//   console.log('编辑', row)
// }

// function handleDelete(row) {
//   console.log('删除', row)
// }

const rowKey = computed(() => {
  return (row: any) => row.id
})

const queryParams = ref({
  name: '张三',
  age: 18,
})

async function handleQuery(params: any) {
  console.error('查询', params)
  fetchTableData()
}

const tableRef = ref<InstanceType<typeof ProTable> | null>(null)
const searchHeight = ref<number>(0)
const searchRef = computed(() => tableRef.value?.searchRef)

const { height } = useElementSize(searchRef)

const tableHeight = ref(300)
watchEffect(() => {
  if (height.value > 0) {
    searchHeight.value = height.value
  }
  if (height.value === 124) {
    tableHeight.value = 300
  } else {
    tableHeight.value = 300 + 50
  }
})

const handleExportData = () => {
  console.log('导出数据')
}
</script>

<template>
  <ProTable
    ref="tableRef"
    title="数据表格"
    :columns="columns"
    :data="dataSource"
    :pagination
    :row-key
    :loading="loading"
    :params="queryParams"
    :on-query="handleQuery"
    :search="{
      searchText: '查询',
      gridCols: 2,
    }"
    :toolbarConfig="{
      create: true,
      export: true,
    }"
    :scroll-x="800"
    @update:page-size="handleChangePageSize"
    @load-data="fetchTableData"
    @export-data="handleExportData"
  />
</template>
