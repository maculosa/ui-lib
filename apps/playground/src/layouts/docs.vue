<script setup lang="ts">
import Layout from '@/components/layout/layout/index.vue'
import Header from './header/index.vue'
</script>

<template>
  <Layout>
    <Header />
    <div class="docs-shell">
      <main class="docs-container medium-content">
        <router-view />
      </main>
    </div>
  </Layout>
</template>

<style scoped>
.docs-shell {
  padding-top: var(--layout-header-height);
}

.docs-container {
  box-sizing: border-box;
  max-width: 880px;
  margin: 0 auto;
  padding: 48px 28px 96px;
}

@media (max-width: 720px) {
  .docs-container {
    padding: 32px 18px 72px;
  }
}
</style>