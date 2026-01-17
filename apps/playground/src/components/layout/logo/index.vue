<template>
  <div class="flex items-center gap-2 cursor-pointer">
    <div class="w-10 h-10 rounded-[8px] bg-blue-500 dark:bg-blue-500/80"></div>
    <div class="text-[20px] font-bold text-[#333] dark:text-zinc-300">{{ logoText }}</div>
  </div>
</template>
<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const logoText = ref('Data V')

watchEffect(() => {
  if (route.path === '/ui') {
    logoText.value = 'UI'
  } else {
    logoText.value = 'Data V'
  }
})
</script>
