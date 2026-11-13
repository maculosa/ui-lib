<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Layout from '@/components/layout/layout/index.vue'
import Header from './header/index.vue'
import Sidebar from '@/components/layout/sidebar/index.vue'
import TOC from '@/components/TOC/index.vue'

const route = useRoute()
const sidebarOpen = ref(false)

watch(
  () => route.path,
  () => {
    sidebarOpen.value = false
  },
)
</script>

<template>
  <Layout>
    <Header />

    <div class="doc-shell">
      <div class="doc-mobile-bar">
        <button type="button" class="doc-menu-btn" @click="sidebarOpen = true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M4 6h16M4 12h10M4 18h14" />
          </svg>
          本页导航
        </button>
      </div>

      <Transition name="bm-fade">
        <div v-if="sidebarOpen" class="doc-overlay" @click="sidebarOpen = false" />
      </Transition>

      <div class="doc-grid">
        <Sidebar :open="sidebarOpen" @close="sidebarOpen = false" />

        <main class="doc-main medium-content">
          <router-view />
        </main>

        <aside class="doc-toc">
          <TOC />
        </aside>
      </div>
    </div>
  </Layout>
</template>

<style scoped>
.doc-shell {
  padding-top: var(--layout-header-height);
}

.doc-grid {
  max-width: 1440px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 264px minmax(0, 1fr) 224px;
  gap: 44px;
  padding: 36px 28px 96px;
  align-items: start;
}

.doc-main {
  min-width: 0;
  padding-bottom: 32px;
}

.doc-toc {
  position: sticky;
  top: calc(var(--layout-header-height) + 36px);
  max-height: calc(100svh - var(--layout-header-height) - 72px);
  overflow-y: auto;
}

.doc-mobile-bar {
  display: none;
}

.doc-overlay {
  position: fixed;
  inset: 0;
  z-index: 55;
  background: color-mix(in srgb, var(--color-foreground) 40%, transparent);
  backdrop-filter: blur(2px);
}

.bm-fade-enter-active,
.bm-fade-leave-active {
  transition: opacity 0.25s ease;
}
.bm-fade-enter-from,
.bm-fade-leave-to {
  opacity: 0;
}

@media (max-width: 1279px) {
  .doc-grid {
    grid-template-columns: 252px minmax(0, 1fr);
    gap: 36px;
  }
  .doc-toc {
    display: none;
  }
}

@media (max-width: 1023px) {
  .doc-grid {
    grid-template-columns: minmax(0, 1fr);
    padding: 20px 20px 72px;
  }
  .doc-mobile-bar {
    display: block;
    position: sticky;
    top: var(--layout-header-height);
    z-index: 30;
    padding: 10px 20px;
    background: color-mix(in srgb, var(--color-background) 82%, transparent);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--color-divider);
  }
  .doc-menu-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 14px;
    border: 1px solid var(--color-divider);
    border-radius: 999px;
    background: var(--color-surface);
    color: var(--color-foreground-secondary);
    font-size: 13px;
    cursor: pointer;
    transition: color 0.2s ease, border-color 0.2s ease;
  }
  .doc-menu-btn:hover {
    color: var(--color-primary);
    border-color: var(--color-primary);
  }
  .doc-menu-btn svg {
    width: 15px;
    height: 15px;
  }
}
</style>
