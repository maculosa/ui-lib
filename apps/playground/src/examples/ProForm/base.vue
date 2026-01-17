<script setup lang="ts">
import { ProForm } from '@banmao/procomponent'
import { ref } from 'vue'

const formModel = ref({
  username: null,
  gender: null,
  password: null,
  age: null,
  birthday: null,
})

const login = (formModel: any) => {
  console.log(formModel)
}

const columns = ref([
  { title: '用户名', key: 'username', valueType: 'text' },
  {
    title: '性别',
    key: 'gender',
    valueType: 'select',
    options: [
      { label: '男', value: '男' },
      { label: '女', value: '女' },
    ],
  },
  { title: '年龄', key: 'age', valueType: 'digit' },
  { title: '生日', key: 'birthday', valueType: 'date' },
  {
    title: '密码',
    key: 'password',
    valueType: 'text',
    formItemProps: {
      type: 'password',
    },
  },
])

const rules = ref({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: ['change', 'blur'] }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
  birthday: [{ required: true, message: '请选择生日', trigger: 'change' }],
})
</script>

<template>
  <ProForm mode="login" :columns="columns" :model="formModel" :rules="rules" @submit="login" />
</template>
