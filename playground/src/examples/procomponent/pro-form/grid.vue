<script setup lang="ts">
import type {
  CascaderOption,
} from 'naive-ui'
import { ProForm } from '@banmao/procomponent'
import {
  NDivider,
  NRadioButton,
  NRadioGroup,
} from 'naive-ui'
import { ref } from 'vue'

const formModel = ref({})
const formRef = ref()

const gridCols = ref(1)
function getChildren(option: CascaderOption) {
  const children: CascaderOption[] = []

  for (let i = 0; i < (option as { depth: number }).depth; ++i) {
    children.push({
      label: `${option.label}-${i}`,
      value: `${option.label}-${i}`,
      depth: (option as { depth: number }).depth + 1,
      isLeaf: option.depth === 3,
    })
  }
  return children
}

const columns = ref([
  {
    title: '姓名',
    key: 'name',
    valueType: 'text',
    tooltip: '这是姓名',
  },
  {
    title: '年龄',
    key: 'age',
    valueType: 'digit',
    hideInForm: true,
    formItemProps: { min: 0 },
  },
  {
    title: '性别',
    key: 'gender',
    valueType: 'radio',
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
    ],
  },
  {
    title: '户籍',
    key: 'regions',
    valueType: 'cascader',
    defaultValue: ['l-0', 'l-0-0', 'l-0-0-0', 'l-0-0-0-0'],
    formItemProps: {
      checkStrategy: 'child',
      remote: true,
      onLoad: (option: CascaderOption) => {
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            option.children = getChildren(option)
            resolve()
          }, 300)
        })
      },
    },
    request: async (_areaCode?: string) => {
      return new Promise<CascaderOption[]>((resolve) => {
        setTimeout(() => {
          resolve([])
        }, 300)
      })
    },
    options: [
      {
        label: 'l-0',
        value: 'v-0',
        depth: 1,
        isLeaf: false,
      },
    ],
  },
  {
    title: '生日',
    key: 'birthday',
    valueType: 'date',
  },
  {
    title: '活动时间',
    key: 'activityDate',
    valueType: 'daterange',
  },
  {
    title: '备注',
    key: 'remark',
    valueType: 'textarea',
    grid: 3,
  },
])

function handleSubmit(e) {
  console.error(e)
}


</script>

<template>
  <div>
    <div style="margin-bottom: 16px;">
      <strong>gridCols: </strong>
      <NRadioGroup v-model:value="gridCols">
        <NRadioButton :value="1">
          1
        </NRadioButton>
        <NRadioButton :value="2">
          2
        </NRadioButton>
        <NRadioButton :value="3">
          3
        </NRadioButton>
      </NRadioGroup>
    </div>
    <NDivider title-placement="left">Preview</NDivider>
    <ProForm
      ref="formRef"
      :columns="columns"
      :model="formModel"
      :grid-cols="gridCols"
      label-placement="left"
      :label-width="72"
      @submit="handleSubmit"
    />
  </div>
</template>
