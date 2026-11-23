<script setup lang="ts">
import { ModalForm } from '@banmao/procomponent'
import { NButton, useMessage } from 'naive-ui'

const message = useMessage()

const columns = [
  {
    title: '项目名称',
    key: 'name',
    valueType: 'text',
    rule: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  },
  {
    title: '负责人',
    key: 'owner',
    valueType: 'text',
  },
  {
    title: '描述',
    key: 'desc',
    valueType: 'textarea',
  },
]

function handleSubmit(values: Record<string, any>) {
  message.success(`已创建：${values.name}`)
}
</script>

<template>
  <ModalForm
    title="新建项目"
    :columns="columns"
    label-placement="left"
    :label-width="88"
    @submit="handleSubmit"
  >
    <template #trigger>
      <NButton type="primary" ghost>新建项目</NButton>
    </template>
  </ModalForm>
</template>