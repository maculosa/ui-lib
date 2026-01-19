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
  <Layout class="flex flex-col w-full min-h-screen">
    <Header />

    <section class="flex-1 flex gap-4 mt-20">
      <div class="w-84 flex relative">
        <Sidebar />
      </div>
      <main class="layout-main flex-1">
        <router-view />
      </main>
      <div v-if="showTOC" class="w-84 flex relative">
        <aside class="fixed top-[80px] z-40 p-4 w-80">
          <TOC />
        </aside>
      </div>
    </section>
  </Layout>
</template>

<style scoped>
.layout-main {
  padding: 0 32px;
  box-sizing: border-box;
  min-width: 460px;
  margin-right: 32px;
  padding-top: 92px;
  padding-bottom: 32px;
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
</style>
