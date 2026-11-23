<script setup lang="ts">
import { StepsForm } from '@banmao/procomponent'
import { NButton, NSpace, NTag, useMessage } from 'naive-ui'

const message = useMessage()

const steps = [
  {
    title: '收货信息',
    columns: [
      {
        title: '收货人',
        key: 'receiver',
        valueType: 'text',
        rule: [{ required: true, message: '请输入收货人', trigger: 'blur' }],
      },
      {
        title: '电话',
        key: 'phone',
        valueType: 'text',
        rule: [{ required: true, message: '请输入电话', trigger: 'blur' }],
      },
    ],
  },
  {
    title: '发票信息',
    columns: [
      { title: '抬头', key: 'invoiceTitle', valueType: 'text' },
      { title: '税号', key: 'taxNo', valueType: 'text' },
    ],
  },
]

function handleSubmit(values: Record<string, any>) {
  message.success(`已提交：${values.receiver}`)
}
</script>

<template>
  <StepsForm
    title="自定义 footer"
    :steps="steps"
    :width="600"
    label-placement="left"
    @submit="handleSubmit"
  >
    <template #trigger>
      <NButton type="primary" ghost>打开分步表单</NButton>
    </template>

    <template #footer="{ close, prev, next, submit, current, stepCount, isFirst, isLast }">
      <NSpace justify="space-between" align="center" style="width: 100%">
        <NTag size="small" type="info">第 {{ current + 1 }} / {{ stepCount }} 步</NTag>
        <NSpace>
          <NButton v-if="!isFirst" @click="prev">上一步</NButton>
          <NButton @click="close">取消</NButton>
          <NButton type="primary" @click="isLast ? submit() : next()">
            {{ isLast ? '提交订单' : '继续' }}
          </NButton>
        </NSpace>
      </NSpace>
    </template>
  </StepsForm>
</template>
