<script setup lang="ts">
import type { CascaderOption } from 'naive-ui'
import { ProForm } from '@banmao/procomponent'
import { ref } from 'vue'

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
    title: '地区',
    key: 'regions',
    valueType: 'cascader',
    defaultValue: ['l-0', 'l-0-0', 'l-0-0-0', 'l-0-0-0-0'],
    formItemProps: {
      checkStrategy: 'child',
      remote: true,
      placeholder: '这是一个异步请求单个层级，点击请求下一级的级联选择器示例',
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
    title: '地区1',
    key: 'regions1',
    valueType: 'cascader',
    formItemProps: {
        placeholder: '这是一个异步请求全部选项的级联选择器使用示例',
    },
    request: async (_areaCode?: string) => {
      return new Promise<CascaderOption[]>((resolve) => {
        setTimeout(() => {
          resolve([
            {
              label: 'l-0',
              value: 'v-0',
              depth: 1,
              isLeaf: false,
              children: [
                {
                  label: 'l-0-0',
                  value: 'v-0-0',
                  depth: 2,
                  isLeaf: true,
                },
              ],
            },
            {
              label: 'l-1',
              value: 'v-1',
              depth: 2,
              isLeaf: true,
            },
          ])
        }, 300)
      })
    },
  },
])

function handleSubmit(e: any) {
  console.error(e)
}

const formModel = ref({})
const formRef = ref()
</script>

<template>
  <div>
    <ProForm
      ref="formRef"
      mode="search"
      :columns="columns"
      :model="formModel"
      label-placement="left"
      :label-width="120"
      grid-cols="2"
      @submit="handleSubmit"
    />
  </div>
</template>
