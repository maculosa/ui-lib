<script setup lang="ts">
import type { SignUpLinkProps } from '../types';

defineOptions({
  name: 'SignUpLink',
})

const { url } = defineProps<SignUpLinkProps>()
</script>

<template>
  <div class="mt-4 text-center text-sm dark:text-gray-300">
    还没有账号？
    <a class="underline text-blue-500" :href="url">立即注册</a>
  </div>
</template>
