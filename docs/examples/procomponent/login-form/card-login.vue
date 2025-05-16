<script setup lang="ts">
import Logo from './Logo.vue';
import { LoginForm } from '@banmao/procomponent';
defineOptions({
    name: 'LoginPage'
})

const handleSubmit = (data: Record<string, any>) => {
    console.log('login page: ', data);
};
</script>

<template>
    <LoginForm
        type="card"
        title="Welcome" description="Welcome to use ProComponents" mode="password" signUpUrl="/register"
        bgImageUrl="https://images.unsplash.com/photo-1746950862786-c13d07b85bff?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        :schema="[
            {
                label: '用户名',
                field: 'text',
                key: 'username',
                defaultValue: '',
                rule: {
                    required: true,
                    message: '请输入用户名',
                    trigger: 'blur'
                }
            },
            {
                label: '密码',
                field: 'password',
                key: 'password',
                defaultValue: '',
                rule: {
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }
            }
        ]" @finish="handleSubmit">
        <template #logo>
            <Logo />
        </template>
    </LoginForm>
</template>