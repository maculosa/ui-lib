<script setup lang="ts">
import { StepsForm } from '@banmao/procomponent'
import { useMessage } from 'naive-ui'
import { ref } from 'vue'

const message = useMessage()
const formRef = ref()
const loading = ref(false)
const submitted = ref('')

const steps = [
  {
    title: '账号',
    columns: [
      {
        title: '账号',
        key: 'account',
        valueType: 'text',
        rule: [{ required: true, message: '请输入账号', trigger: 'blur' }],
      },
    ],
  },
  {
    title: '确认',
    columns: [
      { title: '昵称', key: 'nickname', valueType: 'text' },
      { title: '备注', key: 'remark', valueType: 'textarea' },
    ],
  },
]

async function handleSubmit(values: Record<string, any>) {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  loading.value = false
  submitted.value = JSON.stringify(values, null, 2)
  message.success('保存成功')
  formRef.value?.close()
}
</script>

<template>
  <div>
    <StepsForm
      ref="formRef"
      title="异步提交"
      :steps="steps"
      :width="600"
      :close-on-submit="false"
      :confirm-loading="loading"
      label-placement="left"
      @submit="handleSubmit"
    />

    <pre class="mt-4 rounded-lg bg-black/5 p-3 text-xs leading-5">{{ submitted || '模拟 800ms 请求后关闭并展示提交值' }}</pre>
  </div>
</template>
