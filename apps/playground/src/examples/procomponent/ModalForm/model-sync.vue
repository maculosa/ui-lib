<script setup lang="ts">
import { ModalForm } from '@banmao/procomponent'
import { NButton, NSpace, useMessage } from 'naive-ui'
import { ref } from 'vue'

const message = useMessage()

const formModel = ref<Record<string, any>>({
  name: '张三',
  city: 'beijing',
  age: 28,
})

const columns = [
  {
    title: '姓名',
    key: 'name',
    valueType: 'text',
    rule: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  },
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
  { title: '年龄', key: 'age', valueType: 'digit' },
]

function fillLi() {
  formModel.value = { name: '李四', city: 'shanghai', age: 32 }
}

function clearModel() {
  formModel.value = { name: '', city: null, age: null }
}

function handleSubmit(values: Record<string, any>) {
  formModel.value = { ...values }
  message.success('已回写 model')
}
</script>

<template>
  <div>
    <NSpace class="mb-3">
      <NButton size="small" @click="fillLi">填充李四</NButton>
      <NButton size="small" @click="clearModel">清空 model</NButton>
    </NSpace>

    <ModalForm
      v-model:model="formModel"
      title="编辑用户"
      :columns="columns"
      label-placement="left"
      :label-width="72"
      @submit="handleSubmit"
    />

    <pre class="mt-4 rounded-lg bg-black/5 p-3 text-xs leading-5">{{ JSON.stringify(formModel, null, 2) }}</pre>
  </div>
</template>