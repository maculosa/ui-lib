<script setup>
import { Icon } from '@iconify/vue'
const isDark = inject('isDark')
const toggleTheme = inject('toggleTheme')
</script>

<template>
  <n-button @click="toggleTheme" circle>
    <template #icon>
      <Icon :icon="isDark ? 'carbon:sun' : 'carbon:moon'" />
    </template>
  </n-button>
</template>
