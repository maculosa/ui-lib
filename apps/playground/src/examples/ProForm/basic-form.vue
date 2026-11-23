<script setup lang="ts">
import { ProForm } from '@banmao/procomponent'
import { ref } from 'vue'

const formModel = ref({})
const submitted = ref('')

const columns = ref([
  {
    title: '用户名',
    key: 'username',
    valueType: 'text',
    rule: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  },
  {
    title: '角色',
    key: 'role',
    valueType: 'select',
    options: [
      { label: '管理员', value: 'admin' },
      { label: '编辑', value: 'editor' },
      { label: '访客', value: 'viewer' },
    ],
    rule: [{ required: true, message: '请选择角色', trigger: 'change' }],
  },
  {
    title: '年龄',
    key: 'age',
    valueType: 'digit',
    formItemProps: { min: 0, max: 120 },
  },
  {
    title: '入职日期',
    key: 'joinDate',
    valueType: 'date',
  },
  {
    title: '邮箱',
    key: 'email',
    valueType: 'text',
    rule: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  },
  {
    title: '备注',
    key: 'remark',
    valueType: 'textarea',
    grid: 2,
  },
])

function handleSubmit(values: Record<string, unknown>) {
  submitted.value = JSON.stringify(values, null, 2)
}

function handleReset() {
  submitted.value = ''
}
</script>

<template>
  <div>
    <ProForm
      v-model:model="formModel"
      :columns="columns"
      label-placement="left"
      :label-width="96"
      :grid-cols="2"
      @submit="handleSubmit"
      @reset="handleReset"
    />
    <pre
      v-if="submitted"
      class="mt-4 rounded-lg bg-black/5 p-3 text-xs leading-5"
    >{{ submitted }}</pre>
  </div>
</template>
