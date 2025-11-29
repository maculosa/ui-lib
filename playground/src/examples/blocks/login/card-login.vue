<script setup lang="ts">
import { Login } from '@banmao/blocks'
import type { LoginProps } from '@banmao/blocks';
import Logo from './logo.vue';

const loginProps: LoginProps = {
    layout: 'card',
    title: 'Login',
    subTitle: 'Login to your account',
    signUpUrl: '/signup',
    forgotUrl: '/forgot',
    bgImageUrl: 'https://images.unsplash.com/photo-1745613184657-3c8dcd5f079a?q=80&w=5340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    imagePosition: 'left',
    actions: [
        {
            name: 'Weixin',
            label: '微信登录',
            config: {
                appid: '123456',
                scope: 'snsapi_userinfo',
            }
        }
    ]
}

const handleLogin = (data: any) => {
    console.log(data)
}

const handleError = (errors: any) => {
    console.log(errors)
}

const handleCaptcha = () => {
    console.error('fetch captcha')
}

</script>

<template>
    <Login
        v-bind="loginProps"
        @finish="handleLogin"
        @error="handleError"
        @captcha="handleCaptcha"
    >
        <template #logo>
            <Logo />
        </template>
    </Login>
</template>
