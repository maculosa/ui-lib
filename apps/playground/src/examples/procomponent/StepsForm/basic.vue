<script setup lang="ts">
import { StepsForm } from '@banmao/procomponent'
import { useMessage } from 'naive-ui'
import { ref } from 'vue'

const message = useMessage()
const submitted = ref('')

const steps = [
  {
    title: '基本信息',
    description: '账号与姓名',
    columns: [
      {
        title: '用户名',
        key: 'username',
        valueType: 'text',
        rule: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
      },
      {
        title: '姓名',
        key: 'name',
        valueType: 'text',
        rule: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
      },
      {
        title: '部门',
        key: 'dept',
        valueType: 'select',
        options: [
          { label: '研发部', value: 'rd' },
          { label: '设计部', value: 'design' },
          { label: '运营部', value: 'ops' },
        ],
      },
    ],
  },
  {
    title: '联系方式',
    description: '手机与邮箱',
    columns: [
      {
        title: '手机号',
        key: 'phone',
        valueType: 'text',
        rule: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
      },
      { title: '邮箱', key: 'email', valueType: 'text' },
    ],
  },
  {
    title: '补充说明',
    columns: [
      { title: '备注', key: 'remark', valueType: 'textarea' },
      { title: '启用账号', key: 'enabled', valueType: 'switch' },
    ],
  },
]

function handleSubmit(values: Record<string, any>) {
  submitted.value = JSON.stringify(values, null, 2)
  message.success('提交成功')
}
</script>

<template>
  <div>
    <StepsForm
      title="分步新增用户"
      :steps="steps"
      :width="640"
      :grid-cols="2"
      label-placement="left"
      :label-width="88"
      @submit="handleSubmit"
    />

    <pre class="mt-4 rounded-lg bg-black/5 p-3 text-xs leading-5">{{ submitted || '提交后在这里展示各步合并后的值' }}</pre>
  </div>
</template>
