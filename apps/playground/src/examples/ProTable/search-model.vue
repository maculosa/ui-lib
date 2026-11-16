<script setup lang="ts">
import { ProTable } from '@banmao/procomponent'
import { NAlert, NButton, NSpace } from 'naive-ui'
import { computed, ref } from 'vue'

const columns = [
  { title: '姓名', key: 'name', valueType: 'text', minWidth: 120 },
  {
    title: '状态',
    key: 'status',
    valueType: 'select',
    options: [
      { label: '启用', value: 1 },
      { label: '停用', value: 0 },
    ],
    width: 120,
    render: (row: any) => (row.status === 1 ? '启用' : '停用'),
  },
]

const allRows = Array.from({ length: 6 }, (_, index) => ({
  id: index + 1,
  name: ['张伟', '王芳', '李娜', '刘洋', '陈静', '杨帆'][index],
  status: index % 3 === 0 ? 0 : 1,
}))

const searchModel = ref<Record<string, any>>({ name: '', status: null })
const query = ref<Record<string, any>>({})
const submitted = ref('')

const dataSource = computed(() => {
  return allRows.filter((row) => {
    if (query.value.name && !row.name.includes(query.value.name)) return false
    if (query.value.status !== null && query.value.status !== undefined && row.status !== query.value.status) return false
    return true
  })
})

function handleQuery(params: Record<string, any>) {
  query.value = params
}

function handleSubmit(values: Record<string, any>) {
  submitted.value = JSON.stringify(values)
}

function fillFromOutside() {
  searchModel.value = { name: '张', status: 0 }
}
</script>

<template>
  <NSpace vertical>
    <NSpace align="center">
      <NButton size="small" @click="fillFromOutside">
        外部填充条件
      </NButton>
      <NAlert v-if="submitted" type="info" :bordered="false" style="padding: 4px 12px">
        submit 收到：{{ submitted }}
      </NAlert>
    </NSpace>
    <ProTable
      v-model:search-model="searchModel"
      :columns="columns"
      :data="dataSource"
      :on-query="handleQuery"
      @submit="handleSubmit"
    />
  </NSpace>
</template>
