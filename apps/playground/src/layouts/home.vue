<script setup lang="ts">
import Layout from '@/components/layout/layout/index.vue'
import Header from './header/index.vue'
</script>

<template>
  <Layout>
    <Header />
    <main class="home-layout-main">
      <router-view />
    </main>
  </Layout>
</template>

<style scoped>
.home-layout-main {
  box-sizing: border-box;
  min-width: 320px;
  padding-top: var(--layout-header-height);
}
</style>