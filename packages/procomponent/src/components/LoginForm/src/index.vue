<script setup lang="ts">
import { ProForm } from '@/components/ProForm';
import type { LoginFormProps, LoginFormSlots } from './types';
import LoginCard from './components/LoginCard.vue';
import { cn } from '@/utils';
import SignUpLink from './components/SignUpLink.vue';
import PrivacyPolicy from './components/PrivacyPolicy.vue'
import LoginImage from './components/LoginImage.vue';

defineOptions({
  name: 'LoginForm',
})

const slots = defineSlots<LoginFormSlots>()

const { schema = [], title, type = 'simple', description, class: cls, signUpUrl, bgImageUrl, imageReverse = false } = defineProps<LoginFormProps>()

const emit = defineEmits(['finish'])

const handleSubmit = (data: Record<string, any>) => {
  emit('finish', data)
}

</script>

<template>
  <div v-if="type === 'column'" :class="cn(
      'grid min-h-svh lg:grid-cols-2'
    )">
    <div :class="cn(
      'flex flex-col gap-4 p-6 md:p-10',
      'bg-cover',
      {
        'lg:order-2': imageReverse
      }
    )">
      <div v-if="slots.logo" class="absolute top-4 left-4 z-10">
        <slot name="logo"></slot>
      </div>
      <div class="flex flex-1 items-center justify-center">
        <div class="w-full max-w-xs">
          <slot v-if="slots.default"></slot>
          <LoginCard v-else :title="title" :description="description" shadow rounded>
            <ProForm :schema :on-submit="handleSubmit" mode="login" />
            <SignUpLink v-if="signUpUrl" :url="signUpUrl" />
          </LoginCard>
        </div>
      </div>
    </div>
    <div :class="cn('relative bg-gray-200 hidden lg:block!',
      {
        'lg:order-1': imageReverse
      }
    )">
      <LoginImage :src="bgImageUrl || ''" />
    </div>
  </div>

  <div v-else :class="cn(
    'relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10',
    'bg-cover',
    cls
  )" :style="bgImageUrl && {
    backgroundImage: `url(${bgImageUrl})`,
  }">
    <div v-if="slots.logo" class="absolute top-4 left-4 z-10">
      <slot name="logo"></slot>
    </div>

    <div v-if="type === 'card'" class="absolute top-0 w-full h-full z-0 bg-gray-50/60 dark:bg-gray-900/60 backdrop-blur-[4px]"></div>

    <div v-if="type === 'card'" class="w-full max-w-sm md:max-w-3xl flex justify-center items-center">
      <div class="flex flex-col gap-6">
        <div
          class="grid p-0 md:grid-cols-2 rounded-md overflow-hidden bg-zinc-50/60 dark:bg-zinc-800/60 backdrop-blur-md">
          <slot v-if="slots.default"></slot>
          <LoginCard v-else class="bg-transparent" :title="title" :description="description">
            <ProForm :schema mode="login" :onSubmit="handleSubmit" />
            <SignUpLink v-if="signUpUrl" :url="signUpUrl" />
          </LoginCard>
          <div class="relative hidden bg-muted md:block!">
            <LoginImage :src="bgImageUrl || ''" />
          </div>
        </div>
        <PrivacyPolicy v-if="serviceUrl || privacyUrl" :service="serviceUrl" :privacy="privacyUrl" />
      </div>
    </div>
    <template v-else>
      <slot v-if="slots.default"></slot>
      <LoginCard v-else :title="title" :description="description" shadow rounded>
        <ProForm :schema :on-submit="handleSubmit" mode="login" />
        <SignUpLink v-if="signUpUrl" :url="signUpUrl" />
      </LoginCard>
    </template>
  </div>

  <!-- <div v-else="type === 'simple'" :class="cn(
    'relative flex h-screen w-full items-center justify-center',
    'bg-gradient-to-br from-zinc-800 from-[35%] to-white bg-cover',
    cls
  )" :style="bgImageUrl && {
    backgroundImage: `url(${bgImageUrl})`,
  }">
    <div v-if="slots.logo" class="absolute z-10 top-4 left-4">
      <slot name="logo"></slot>
    </div>

  </div> -->
</template>
