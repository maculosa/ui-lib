<script setup lang="ts">
import { DrawerForm } from '@banmao/procomponent'
import { NButton, NSpace, NTag, useMessage } from 'naive-ui'

const message = useMessage()

const columns = [
  {
    title: '姓名',
    key: 'name',
    valueType: 'text',
    rule: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  },
  {
    title: '备注',
    key: 'remark',
    valueType: 'textarea',
  },
]

function handleSubmit(values: Record<string, any>) {
  message.success(`已保存：${values.name}`)
}
</script>

<template>
  <DrawerForm
    title="自定义头部与底部"
    :columns="columns"
    label-placement="left"
    @submit="handleSubmit"
  >
    <template #trigger>
      <NButton type="primary" ghost>打开自定义抽屉</NButton>
    </template>

    <template #header>
      <NSpace align="center" :size="8">
        <strong>自定义头部</strong>
        <NTag type="info" size="small">header 插槽</NTag>
      </NSpace>
    </template>

    <template #header-extra>
      <NTag type="warning" size="small">header-extra</NTag>
    </template>

    <template #footer="{ close, reset, submit }">
      <NSpace justify="space-between" align="center" style="width: 100%">
        <NButton text type="primary" @click="reset">恢复默认</NButton>
        <NSpace>
          <NButton @click="close">暂不保存</NButton>
          <NButton type="primary" @click="submit">保存</NButton>
        </NSpace>
      </NSpace>
    </template>
  </DrawerForm>
</template>
