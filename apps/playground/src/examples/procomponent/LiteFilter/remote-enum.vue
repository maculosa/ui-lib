<script setup lang="ts">
import { LiteFilter, type LiteFilterColumn } from '@banmao/procomponent'
import { useMessage } from 'naive-ui'
import { ref } from 'vue'

const message = useMessage()
const filterRef = ref()
const result = ref('')
const cityRequests = ref(0)

function requestCities() {
  cityRequests.value += 1
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

function requestDepartments() {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      resolve([
        { label: '研发中心', value: 'rd' },
        { label: '设计中心', value: 'design' },
      ])
    }, 700)
  })
}

const columns: LiteFilterColumn[] = [
  { key: 'keyword', title: '关键词', valueType: 'text' },
  { key: 'city', title: '城市', valueType: 'select', request: requestCities },
  { key: 'department', title: '部门', valueType: 'select', request: requestDepartments },
]

function refresh() {
  filterRef.value?.refreshOptions('city')
  message.info('已重新拉取城市枚举')
}

function show(values: Record<string, any>) {
  result.value = JSON.stringify(values, null, 2)
}
</script>

<template>
  <div>
    <div class="mb-3 flex items-center gap-3 text-xs opacity-70">
      <span>城市枚举请求次数：{{ cityRequests }}</span>
      <NButton size="small" @click="refresh">
        刷新枚举
      </NButton>
    </div>
    <LiteFilter
      ref="filterRef"
      :columns="columns"
      @search="show"
      @options-error="(key: string) => message.error(`字段 ${key} 的远程枚举加载失败`)"
    />
    <pre class="mt-4 rounded-lg bg-black/5 p-3 text-xs leading-5">{{ result || '选择远程枚举后自动查询' }}</pre>
  </div>
</template>
