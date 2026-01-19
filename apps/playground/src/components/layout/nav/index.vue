<template>
  <nav class="nav flex justify-end items-center gap-8">
    <router-link
      v-for="item in navItems"
      :key="item.url"
      :to="item.url"
      class="text-foreground no-underline cursor-pointer transition-all duration-300 hover:shadow-[0px_0px_2px_rgba(51,51,51,0.2)]"
      :class="{ 'text-primary font-medium': isActive(item.url) }"
    >
      {{ item.name }}
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import config from '@/config'

const route = useRoute()

const navItems = config.navItems

function isActive(path: string) {
  if (path === '/') {
    return route.path === '/'
  } else {
    return route.path.includes(path)
  }
}
</script>
