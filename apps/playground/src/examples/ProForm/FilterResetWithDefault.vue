<script setup lang="ts">
import type { CascaderOption } from 'naive-ui'
import { ProForm } from '@banmao/procomponent'
import { ref } from 'vue'

const columns = ref([
  {
    title: '姓名',
    key: 'name',
    valueType: 'text',
  },
  {
    title: '职业',
    key: 'job',
    valueType: 'select',
    options: [
      {
        label: '前端开发',
        value: 'frontend',
      },
      {
        label: '后端开发',
        value: 'backend',
      },
      {
        label: '产品经理',
        value: 'product-manager',
      },
    ],
  },
  {
    title: '地区',
    key: 'regions',
    valueType: 'cascader',
    formItemProps: {
      placeholder: '这是一个异步请求全部选项的级联选择器使用示例',
    },
    request: async (_areaCode?: string) => {
      return new Promise<CascaderOption[]>(resolve => {
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
              isLeaf: false,
              children: [
                {
                  label: 'l-1-0',
                  value: 'v-1-0',
                  depth: 3,
                  isLeaf: false,
                  children: [
                    {
                      label: 'l-1-0-0',
                      value: 'v-1-0-0',
                      depth: 4,
                      isLeaf: true,
                    },
                  ],
                },
                {
                  label: 'l-1-1',
                  value: 'v-1-1',
                  depth: 3,
                  isLeaf: true,
                },
              ],
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
      :default-value="{
        name: '张三',
        job: 'frontend',
        regions: 'v-1-0-0',
      }"
      :label-width="120"
      :grid-cols="2"
      @submit="handleSubmit"
    />
  </div>
</template>
