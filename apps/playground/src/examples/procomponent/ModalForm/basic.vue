<script setup lang="ts">
import { ModalForm } from '@banmao/procomponent'
import { useMessage } from 'naive-ui'
import { ref } from 'vue'

const message = useMessage()
const submitted = ref('')

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
  { title: '年龄', key: 'age', valueType: 'digit', formItemProps: { min: 0 } },
  { title: '备注', key: 'remark', valueType: 'textarea', grid: 2 },
]

function handleSubmit(values: Record<string, any>) {
  submitted.value = JSON.stringify(values, null, 2)
  message.success('提交成功')
}
</script>

<template>
  <div>
    <ModalForm
      title="新增用户"
      :columns="columns"
      :grid-cols="2"
      label-placement="left"
      :label-width="88"
      @submit="handleSubmit"
    />

    <pre class="mt-4 rounded-lg bg-black/5 p-3 text-xs leading-5">{{ submitted || '提交后在这里展示表单值' }}</pre>
  </div>
</template>