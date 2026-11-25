<script setup lang="ts">
import { ref } from 'vue'
import { ProTable } from '@banmao/procomponent'

/**
 * 工具栏排序 / 筛选示例（受控模式）
 * 排序、筛选仅作用于当前已加载数据，不触发额外请求
 */

const columns = [
  { title: '姓名', key: 'name', valueType: 'text', minWidth: 120 },
  { title: '年龄', key: 'age', valueType: 'digit', minWidth: 90 },
  {
    title: '性别',
    key: 'gender',
    valueType: 'select',
    minWidth: 100,
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
    ],
    render: (row: any) => (row.gender === 'male' ? '男' : '女'),
  },
  {
    title: '状态',
    key: 'status',
    valueType: 'select',
    minWidth: 110,
    options: [
      { label: '在职', value: 'active' },
      { label: '离职', value: 'left' },
    ],
    render: (row: any) => (row.status === 'active' ? '在职' : '离职'),
  },
  { title: '入职日期', key: 'joinDate', valueType: 'date', minWidth: 140 },
]

const dataSource = ref([
  { id: 1, name: '张伟', age: 32, gender: 'male', status: 'active', joinDate: '2019-03-12' },
  { id: 2, name: '李娜', age: 28, gender: 'female', status: 'active', joinDate: '2021-07-01' },
  { id: 3, name: '王强', age: 41, gender: 'male', status: 'left', joinDate: '2015-11-23' },
  { id: 4, name: '刘敏', age: 35, gender: 'female', status: 'active', joinDate: '2018-05-09' },
  { id: 5, name: '陈杰', age: 26, gender: 'male', status: 'active', joinDate: '2023-02-15' },
  { id: 6, name: '赵蕾', age: 30, gender: 'female', status: 'left', joinDate: '2020-09-30' },
  { id: 7, name: '孙浩', age: 38, gender: 'male', status: 'active', joinDate: '2017-12-05' },
  { id: 8, name: '周婷', age: 24, gender: 'female', status: 'active', joinDate: '2024-04-18' },
])

const pagination = ref({
  page: 1,
  pageSize: 5,
  itemCount: dataSource.value.length,
  showSizePicker: true,
  pageSizes: [5, 10, 20],
  prefix: ({ itemCount }: { itemCount: number }) => `共 ${itemCount} 条`,
})
</script>

<template>
  <ProTable
    title="员工列表"
    :columns="columns"
    :data="dataSource"
    :pagination="pagination"
    :row-key="row => row.id"
    :toolbar="{ sort: true, filter: true }"
  />
  <p style="margin-top: 8px; color: #888; font-size: 13px">
    点击工具栏的排序图标可选择排序字段与升降序；筛选图标可逐条添加条件，日期字段使用日期选择器，选项字段使用多选。
  </p>
</template>
