<script setup lang="ts">
import Layout from '@/components/layout/layout/index.vue'
import Header from './header/index.vue'
import Sidebar from '@/components/layout/sidebar/index.vue'
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
      <main class="layout-main flex-1 medium-content">
        <router-view />
      </main>
      <div class="w-84 flex relative">
        <aside v-if="showTOC" class="fixed top-[80px] toc-container 
          bg-white/10 backdrop-blur-1 shadow hover:shadow-xl rounded-lg
        ">
          <TOC />
        </aside>
      </div>
    </section>
  </Layout>
</template>

<style>
:root {
  --layout-header-height: 60px;
}

.layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100svh;
  /* height: 100%; */
}

.layout-main {
  box-sizing: border-box;
  /* max-width: 1280px; */
  min-width: 460px;
  /* margin: 0 auto; */
  /* overflow-y: auto; */
  padding-bottom: 32px;
  /* padding-left: 320px; */
  /* @apply bg-white/10 shadow rounded-2; */
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
  /* @apply bg-white/10 backdrop-blur-1 shadow rounded-2 hover:shadow-xl; */
}

@media screen and (max-width: 1200px) {
  .toc-container {
    display: none;
  }
}
</style>
