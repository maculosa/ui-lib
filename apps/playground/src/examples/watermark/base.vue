<template>
  <div>
    是否全屏：
    <NSwitch v-model:value="fullscreen" :onUpdate:value="setFullscreen">全屏</NSwitch>
  </div>

  <NDivider />

  <Watermark text="banmao" color="rgba(0, 0, 0, 0.05)" :fullscreen="fullscreen">
    <ProTable title="Base Table" :columns :search="false" :data="dataSource" />
  </Watermark>
</template>

<script setup lang="tsx">
import { ProTable, Watermark } from '@banmao/procomponent'
import { NButton, NDivider, NSwitch } from 'naive-ui'
import { ref } from 'vue'

const fullscreen = ref(false)

const setFullscreen = (value: boolean) => {
  fullscreen.value = value
}

interface RowType {
  name: string
  age: number
  gender: 'male' | 'female'
  email: string
  phone: string
  city: string
  country: string
  company: string
}

const columns = ref([
  { type: 'index' },
  {
    title: '姓名',
    key: 'name',
    width: 100,
  },
  {
    title: '年龄',
    key: 'age',
    width: 80,
  },
  {
    title: '性别',
    key: 'gender',
    width: 80,
  },
  {
    title: '邮箱',
    key: 'email',
    width: 150,
  },
  {
    title: '电话',
    key: 'phone',
    width: 110,
  },
  {
    title: '城市',
    key: 'city',
    width: 100,
  },
  {
    title: '国家',
    key: 'country',
    width: 64,
  },
  {
    title: '公司',
    key: 'company',
    copyable: {
      ellipsis: false,
      lineClamp: 2,
    },
    width: 200,
  },
  {
    title: '操作',
    key: 'actions',
    fixed: 'right',
    render(row: RowType) {
      return (
        <NButton
          type="success"
          ghost
          size="small"
          onClick={() => {
            console.log('edit', row)
          }}
        >
          编辑
        </NButton>
      )
    },
  },
])

const dataSource = ref([
  {
    name: '张三',
    age: 18,
    gender: 'male',
    email: '123@qq.com',
    phone: '123456789',
    city: '北京',
    country: '中国',
    company: '公司',
  },
  {
    name: '王五',
    age: 20,
    gender: 'female',
    email: '123@qq.com',
    phone: '123456789',
    city: '上海',
    country: '中国',
    company: 'Google Corp. LTC Company. Distributed by Apple Inc.',
  },
])
</script>
