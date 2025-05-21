<script setup lang="ts">
import { RouterView } from 'vue-router'
import LimeNav from './components/LimeNav.vue'
import LimeHeader from './components/LimeHeader.vue'
</script>

<template>
  <LimeHeader>
    <LimeNav />
  </LimeHeader>

  <RouterView />
</template>

<style scoped>


</style>
