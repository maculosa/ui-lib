<script setup lang="ts">
defineOptions({
  name: 'BHeader'
})
</script>

<template>
  <header class="w-full h-16 flex items-center justify-between px-4 shadow">
    <slot />
  </header>
</template>
