<script setup lang="ts">
import { inject } from 'vue'
import { Icon } from '@iconify/vue'

defineOptions({
  name: 'SwitchTheme'
})

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
