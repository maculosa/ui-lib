<script setup lang="tsx">
import { ProTable } from '@banmao/procomponent'
import { useList } from '@banmao/hooks'
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

function fakeDataList(data: Record<string, any>) {
  console.log('request data: ', data)
  fetch('/api/fake/data', {
    method: 'POST',
    body: JSON.stringify(data),
  })
  return new Promise<any>(resolve => {
    setTimeout(() => {
      resolve({
        status: 200,
        data: {
          list: [
            { id: 1, name: '张三', age: 16, gender: 'male', city: 110000, address: '北京市海淀区' },
          ],
        },
      })
    })
  })
}

const searchModel = ref({})

const { dataSource, loading, pagination, loadData, handlePageChange } = useList(fakeDataList, {
  filterOption: searchModel,
})

const columns = ref([
  {
    title: '姓名',
    key: 'name',
    minWidth: 100,
    valueType: 'text',
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
    title: '生日',
    key: 'birthday',
    minWidth: 100,
    valueType: 'date',
    formItemProps: {
      type: 'monthrange',
    },
  },
  {
    title: '城市',
    key: 'city',
    valueType: 'cascader',
    width: 200,
    request: fetchCityList,
  },
  {
    title: '地址',
    key: 'address',
    minWidth: 200,
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
    render(_row: any) {
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
    },
  },
])

const rowKey = computed(() => {
  return (row: any) => row.id
})

async function handleQuery(params: any) {
  console.info('查询', params)
  searchModel.value = params
  loadData()
}

const tableRef = ref<InstanceType<typeof ProTable> | null>(null)
const searchHeight = ref<number>(0)

watchEffect(() => {
  const { height } = useElementSize(tableRef.value?.searchRef)
  searchHeight.value = height.value
})

const handleExportData = (params: any) => {
  console.info('导出', params)
}
</script>

<template>
  <ProTable
    ref="tableRef"
    title="默认搜索条件"
    :columns="columns"
    :data="dataSource"
    :pagination
    :row-key
    :loading="loading"
    :on-query="handleQuery"
    :params="{}"
    :search="{
      searchText: '查询',
      gridCols: 2,
    }"
    :toolbar="{
      export: true,
    }"
    :scroll-x="600"
    :max-height="800"
    @update:page-size="handlePageChange"
    @load-data="loadData"
    @export-data="handleExportData"
  />
</template>
