<script setup lang="ts">
import { QueryFilter, type QueryFilterColumn } from '@banmao/procomponent'
import { useMessage } from 'naive-ui'
import { ref } from 'vue'

const message = useMessage()
const filterRef = ref()
const loading = ref(false)
const values = ref('')

function requestCities() {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      resolve([
        { label: '北京', value: 'beijing' },
        { label: '上海', value: 'shanghai' },
        { label: '深圳', value: 'shenzhen' },
      ])
    }, 500)
  })
}

const columns: QueryFilterColumn[] = [
  { key: 'keyword', title: '关键词', valueType: 'text' },
  { key: 'city', title: '城市', valueType: 'select', request: requestCities },
  {
    key: 'status',
    title: '状态',
    valueType: 'select',
    options: [
      { label: '启用', value: 'active' },
      { label: '停用', value: 'disabled' },
    ],
  },
  { key: 'owner', title: '负责人', valueType: 'text' },
  { key: 'createdAt', title: '创建日期', valueType: 'date' },
]

async function beforeSearch(current: Record<string, any>) {
  if (current.keyword && current.keyword.length < 2) {
    message.warning('关键词至少输入 2 个字符')
    return false
  }
  return true
}

async function search() {
  loading.value = true
  try {
    await filterRef.value?.search()
  }
  finally {
    loading.value = false
  }
}

function setPreset() {
  filterRef.value?.setValues({ keyword: '合同', status: 'active', owner: '李四' })
}

function setCity() {
  filterRef.value?.setFieldValue('city', 'shanghai')
}

function reset() {
  filterRef.value?.reset()
  values.value = ''
}

function refresh() {
  filterRef.value?.refreshOptions('city')
  message.info('已刷新城市枚举')
}
</script>

<template>
  <div>
    <div class="mb-3 flex flex-wrap items-center gap-2">
      <NButton size="small" @click="setPreset">
        setValues
      </NButton>
      <NButton size="small" @click="setCity">
        setFieldValue(city)
      </NButton>
      <NButton size="small" :loading="loading" @click="search">
        search()
      </NButton>
      <NButton size="small" @click="reset">
        reset()
      </NButton>
      <NButton size="small" @click="refresh">
        refreshOptions(city)
      </NButton>
    </div>

    <QueryFilter
      ref="filterRef"
      :columns="columns"
      :grid-cols="3"
      :loading="loading"
      :before-search="beforeSearch"
      @search="(current: Record<string, any>) => values = JSON.stringify(current, null, 2)"
    />

    <pre class="mt-4 rounded-lg bg-black/5 p-3 text-xs leading-5">{{ values || '通过按钮调用实例方法' }}</pre>
  </div>
</template>
