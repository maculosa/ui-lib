<script setup lang="ts">
import { Login } from '@banmao/blocks'
import type { LoginProps } from '@banmao/blocks';
import Logo from './logo.vue';

const loginProps: LoginProps = {
    layout: 'simple',
    title: 'Login',
    subTitle: 'Login to your account',
    signUpUrl: '/signup',
    forgotUrl: '/forgot',
}

const handleLogin = (data) => {
    console.log(data)
}

const handleError = (errors) => {
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
