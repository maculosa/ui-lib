<script setup lang="ts">
import { NForm, NFormItem, NInput, NButton, type FormInst } from 'naive-ui'
import { reactive, ref } from 'vue'

const formData = reactive({
    email: '',
    password: ''
})

const loginFormRef = ref<FormInst | null>(null)
const handleLogin = () => {
    loginFormRef.value?.validate((errors) => {
        if (!errors) {
            console.log('submit!')
        }
    })
}
</script>

<template>
    <NForm ref="loginFormRef" :model="formData" >
        <NFormItem label="邮箱" path="email">
            <NInput v-model:value="formData.email" placeholder="eho@banmao.cc" />
        </NFormItem>
        <NFormItem label="密码" prop="password">
            <NInput v-model:value="formData.password" placeholder="请输入密码" type="password" />
        </NFormItem>
        <NFormItem>
            <NButton block type="primary" @click="handleLogin">登录</NButton>
        </NFormItem>
    </NForm>
</template>