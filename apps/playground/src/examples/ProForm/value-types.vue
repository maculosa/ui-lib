<script setup lang="ts">
import { ProForm } from '@banmao/procomponent'
import { ref } from 'vue'

// 选择 / 日期类字段显式给 null，避免留空时控件状态不一致
const formModel = ref({
  time: null,
  date: null,
  datetime: null,
  daterange: null,
  datetimerange: null,
  month: null,
  monthrange: null,
})

const columns = ref([
  { title: '文本', key: 'text', valueType: 'text' },
  { title: '多行文本', key: 'textarea', valueType: 'textarea' },
  { title: '数字', key: 'digit', valueType: 'digit' },
  {
    title: '下拉选择',
    key: 'select',
    valueType: 'select',
    options: [
      { label: '选项一', value: 1 },
      { label: '选项二', value: 2 },
    ],
  },
  {
    title: '单选',
    key: 'radio',
    valueType: 'radio',
    options: [
      { label: '是', value: 'yes' },
      { label: '否', value: 'no' },
    ],
  },
  {
    title: '多选',
    key: 'checkbox',
    valueType: 'checkbox',
    options: [
      { label: '前端', value: 'fe' },
      { label: '后端', value: 'be' },
      { label: '设计', value: 'design' },
    ],
  },
  {
    title: '级联',
    key: 'cascader',
    valueType: 'cascader',
    options: [
      {
        label: '浙江',
        value: 'zj',
        children: [
          { label: '杭州', value: 'hz' },
          { label: '宁波', value: 'nb' },
        ],
      },
      {
        label: '江苏',
        value: 'js',
        children: [{ label: '南京', value: 'nj' }],
      },
    ],
  },
  { title: '开关', key: 'switch', valueType: 'switch' },
  { title: '时间', key: 'time', valueType: 'time' },
  { title: '日期', key: 'date', valueType: 'date' },
  { title: '日期时间', key: 'datetime', valueType: 'datetime' },
  { title: '日期范围', key: 'daterange', valueType: 'daterange' },
  { title: '日期时间范围', key: 'datetimerange', valueType: 'datetimerange' },
  { title: '月份', key: 'month', valueType: 'month' },
  { title: '月份范围', key: 'monthrange', valueType: 'monthrange' },
  { title: '上传', key: 'upload', valueType: 'upload', grid: 2 },
])
</script>

<template>
  <ProForm :columns="columns" :model="formModel" label-placement="left" :label-width="110" :grid-cols="2" />
</template>
