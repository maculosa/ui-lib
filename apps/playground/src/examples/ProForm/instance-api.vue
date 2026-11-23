<script setup lang="ts">
import { ProForm } from '@banmao/procomponent'
import { NButton, NSpace } from 'naive-ui'
import { ref } from 'vue'

const formRef = ref()
const formModel = ref({})
const log = ref('')

const columns = ref([
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
  { title: '备注', key: 'remark', valueType: 'textarea', grid: 2 },
])

function handleSubmit(values: Record<string, unknown>) {
  log.value = `submit: ${JSON.stringify(values)}`
}

function handleReset() {
  log.value = 'reset: 已回到 defaultValue'
}

function submitViaRef() {
  formRef.value?.submit()
}

function resetViaRef() {
  formRef.value?.reset()
}

function setCityViaRef() {
  formRef.value?.setFieldValue('city', 'shanghai')
}

function setUnknownViaRef() {
  formRef.value?.setFieldValue('extra', '未在 columns 中的字段')
}
</script>

<template>
  <div>
    <ProForm
      ref="formRef"
      v-model:model="formModel"
      :columns="columns"
      :default-value="{ name: '张三', city: 'beijing' }"
      label-placement="left"
      :label-width="88"
      :grid-cols="2"
      @submit="handleSubmit"
      @reset="handleReset"
    />

    <NSpace class="mt-4">
      <NButton size="small" type="primary" @click="submitViaRef">submit()</NButton>
      <NButton size="small" @click="resetViaRef">reset()</NButton>
      <NButton size="small" @click="setCityViaRef">setFieldValue 已有字段</NButton>
      <NButton size="small" @click="setUnknownViaRef">setFieldValue 新字段</NButton>
    </NSpace>

    <p v-if="log" class="mt-3 font-mono text-xs opacity-70">{{ log }}</p>
    <pre class="mt-3 rounded-lg bg-black/5 p-3 text-xs leading-5">{{ JSON.stringify(formModel, null, 2) }}</pre>
  </div>
</template>
