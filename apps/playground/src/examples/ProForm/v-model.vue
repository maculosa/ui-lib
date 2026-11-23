<script setup lang="ts">
import { ProForm } from '@banmao/procomponent'
import { NButton, NSpace } from 'naive-ui'
import { ref } from 'vue'

const formModel = ref({
  name: '张三',
  city: 'beijing',
})

const columns = ref([
  { title: '姓名', key: 'name', valueType: 'text' },
  {
    title: '城市',
    key: 'city',
    valueType: 'select',
    options: [
      { label: '北京', value: 'beijing' },
      { label: '上海', value: 'shanghai' },
      { label: '杭州', value: 'hangzhou' },
    ],
  },
])

function renameOutside() {
  formModel.value.name = '李四'
}

function changeCityOutside() {
  formModel.value.city = 'hangzhou'
}
</script>

<template>
  <div>
    <ProForm v-model:model="formModel" :columns="columns" label-placement="left" :label-width="88" />

    <NSpace class="mt-4">
      <NButton size="small" @click="renameOutside">外部改姓名</NButton>
      <NButton size="small" @click="changeCityOutside">外部改城市</NButton>
    </NSpace>

    <pre class="mt-3 rounded-lg bg-black/5 p-3 text-xs leading-5">{{ JSON.stringify(formModel, null, 2) }}</pre>
  </div>
</template>
