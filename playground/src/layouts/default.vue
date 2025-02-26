<script setup lang="ts">
import Layout from './layout/index.vue'
import Header from './header/index.vue'
import Sidebar from './sidebar/index.vue'
import TOC from '@/components/TOC/index.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const showTOC = computed(() => route.path.includes('/procomponent/'))
</script>

<template>
  <Layout class="layout">
    <Header />

    <section class="flex-1 flex gap-4 mt-20">
      <div class="w-84 flex relative">
        <Sidebar />
      </div>
      <main class="layout-main flex-1">
        <router-view />
      </main>
      <aside v-if="showTOC" class="toc-container dark:bg-transparent">
        <TOC />
      </aside>
    </section>
  </Layout>
</template>

<style>
:root {
    --layout-header-height: 60px;
    --layout-margin-top: calc(60px + 32px);
}

.layout {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100dvh;
    /* height: 100%; */
}

.layout-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: var(--layout-header-height);
    padding: 0 16px;
    padding-right: 32px;
    box-sizing: border-box;
    background: transparent;
    backdrop-filter: blur(5px);
    /* border-bottom: 1px solid #ddd; */
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 99;
}

.layout-main {
    padding: 0 32px;
    box-sizing: border-box;
    /* max-width: 1280px; */
    min-width: 460px;
    /* margin: 0 auto; */
    /* overflow-y: auto; */
    padding-top: var(--layout-margin-top);
    padding-bottom: 32px;
    /* padding-left: 320px; */
    @apply bg-white/10 shadow rounded-2 hover:shadow-xl;
}

@media screen and (max-width: 1000px) {
    .layout-main {
        max-width: 680px;
        padding-left: 0;
        margin: 0 auto;
    }
}

@media screen and (max-width: 640px) {
    .table-of-contents {
        display: none;
    }
}

.toc-container {
  padding: 16px;
  box-sizing: border-box;
  width: 320px;
  /* margin-top: var(--layout-margin-top); */
  @apply bg-white/10 backdrop-blur-1 shadow rounded-2 hover:shadow-xl;
}

@media screen and (max-width: 1200px) {
  .toc-container {
    display: none;
  }
}
</style>
