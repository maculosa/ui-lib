<script setup lang="ts">
import { useRoute } from 'vue-router'
import config from '@/config'

const route = useRoute()
const navItems = config.navItems

function isActive(path: string) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <nav class="bm-nav" aria-label="主导航">
    <RouterLink
      v-for="item in navItems"
      :key="item.url"
      :to="item.url"
      class="bm-nav-link"
      :class="{ active: isActive(item.url) }"
    >
      {{ item.name }}
    </RouterLink>
  </nav>
</template>

<style scoped>
.bm-nav {
  display: flex;
  align-items: center;
  gap: 2px;
}
.bm-nav-link {
  position: relative;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-foreground-secondary);
  text-decoration: none;
  transition: color 0.2s ease, background-color 0.2s ease;
}
.bm-nav-link:hover {
  color: var(--color-foreground);
  background: var(--color-hover);
}
.bm-nav-link.active {
  color: var(--color-primary);
  background: var(--color-selected);
}
.bm-nav-link.active::after {
  content: '';
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 2px;
  height: 2px;
  border-radius: 2px;
  background: var(--color-primary);
  opacity: 0.85;
}
</style>