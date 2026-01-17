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
    <LoginForm title="Welcome" description="Welcome to use ProComponents" mode="password" signUpUrl="/register"
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