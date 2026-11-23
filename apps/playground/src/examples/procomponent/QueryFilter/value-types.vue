<script setup lang="ts">
import { QueryFilter, type QueryFilterColumn } from '@banmao/procomponent'
import { ref } from 'vue'

const columns: QueryFilterColumn[] = [
  { key: 'keyword', title: '关键词', valueType: 'text' },
  {
    key: 'priority',
    title: '优先级',
    valueType: 'radio',
    options: [
      { label: '高', value: 'high' },
      { label: '中', value: 'medium' },
      { label: '低', value: 'low' },
    ],
  },
  {
    key: 'status',
    title: '状态',
    valueType: 'select',
    options: [
      { label: '启用', value: 'active' },
      { label: '停用', value: 'disabled' },
    ],
  },
  {
    key: 'city',
    title: '城市',
    valueType: 'cascader',
    options: [
      {
        label: '浙江省',
        value: 'zj',
        children: [
          { label: '杭州', value: 'hangzhou' },
          { label: '宁波', value: 'ningbo' },
        ],
      },
      {
        label: '江苏省',
        value: 'js',
        children: [
          { label: '南京', value: 'nanjing' },
          { label: '苏州', value: 'suzhou' },
        ],
      },
    ],
  },
  {
    key: 'department',
    title: '部门',
    valueType: 'treeSelect',
    options: [
      {
        label: '研发中心',
        key: 'rd',
        children: [
          { label: '前端组', key: 'fe' },
          { label: '后端组', key: 'be' },
        ],
      },
      {
        label: '设计中心',
        key: 'design',
        children: [{ label: '品牌组', key: 'brand' }],
      },
    ],
  },
  {
    key: 'framework',
    title: '框架',
    valueType: 'autoComplete',
    options: ['Vue', 'React', 'Svelte', 'Solid'],
  },
  {
    key: 'tags',
    title: '标签',
    valueType: 'checkboxGroup',
    options: [
      { label: '重点', value: 'important' },
      { label: '跟进', value: 'follow' },
      { label: '归档', value: 'archived' },
    ],
  },
  { key: 'enabled', title: '启用', valueType: 'switch' },
  { key: 'hasRemark', title: '有备注', valueType: 'checkbox' },
  { key: 'budget', title: '预算', valueType: 'digit', formItemProps: { min: 0, max: 100000 } },
  { key: 'color', title: '标记颜色', valueType: 'colorPicker' },
  { key: 'createdAt', title: '创建日期', valueType: 'date' },
  { key: 'range', title: '日期范围', valueType: 'dateRange' },
  { key: 'deadline', title: '截止时间', valueType: 'time' },
  { key: 'keywords', title: '多个关键词', valueType: 'dynamicTags' },
]

const result = ref('')

function show(values: Record<string, any>) {
  result.value = JSON.stringify(values, null, 2)
}
</script>

<template>
  <div>
    <QueryFilter
      :columns="columns"
      :grid-cols="3"
      :form-config="{ gridCollapsed: false, gridCollapsedRows: 2 }"
      @search="show"
      @reset="show"
    />

    <pre class="mt-4 rounded-lg bg-black/5 p-3 text-xs leading-5">{{ result || '填写任意字段后点击查询，查看每种类型的值' }}</pre>
  </div>
</template>
