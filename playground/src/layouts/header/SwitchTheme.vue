<script setup>
const isDark = inject('isDark')
const isAutoTheme = inject('isAutoTheme')
const toggleTheme = inject('toggleTheme')
const toggleThemeMode = inject('toggleThemeMode')
</script>

<template>
    <n-switch v-model:value="isAutoTheme" />
    <n-button @click="toggleTheme" :disabled="isAutoTheme">
      {{ isDark ? '切换到亮色' : '切换到暗色' }}
    </n-button>
</template>