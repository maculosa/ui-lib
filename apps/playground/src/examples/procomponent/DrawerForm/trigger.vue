<script setup lang="ts">
import { DrawerForm } from '@banmao/procomponent'
import { NButton, useMessage } from 'naive-ui'

const message = useMessage()

const columns = [
  { title: '工单号', key: 'ticketNo', valueType: 'text' },
  { title: '处理人', key: 'owner', valueType: 'text' },
]

function handleSubmit(values: Record<string, any>) {
  message.success(`已保存工单 ${values.ticketNo}`)
}
</script>

<template>
  <DrawerForm title="编辑工单" placement="left" :columns="columns" @submit="handleSubmit">
    <template #trigger>
      <NButton type="primary" ghost>编辑工单</NButton>
    </template>
  </DrawerForm>
</template>
