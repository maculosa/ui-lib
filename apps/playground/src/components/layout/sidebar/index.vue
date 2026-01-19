<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { sidebar, type SidebarItem } from '@/config'

const route = useRoute()

const activePath = computed(() => {
  return route.path
})

const prefixPath = computed(() => {
  return '/' + route.path.split('/')[1] + '/'
})

const sidebarItems = ref<SidebarItem[]>([])

watchEffect(() => {
  sidebarItems.value = sidebar[prefixPath.value]
})
</script>

<template>
  <aside
    class="sidebar fixed top-20 bottom-4 left-4 w-80 bg-transparent px-8 py-12 overflow-y-auto -translate-0 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-40 hover:shadow-[0px_6px_4px_0_rgba(0,0,0,0.3)] dark:text-white/80"
  >
    <div class="sidebar-groups p-0">
      <template v-for="(item, index) in sidebarItems" :key="index">
        <section v-if="item.children" class="sidebar-group mb-6">
          <p class="font-semibold text-zinc-600 dark:text-zinc-400 text-sm mb-2 leading-6">
            {{ item.name }}
          </p>
          <RouterLink
            v-for="(child, childIndex) in item.children"
            :key="childIndex"
            class="relative block my-2 py-2.5 px-4 text-sm leading-6 rounded-lg transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"
            :class="[
              activePath === child.url
                ? 'text-primary bg-blue-50 dark:bg-blue-900/20 translate-x-0'
                : 'text-zinc-800 dark:text-zinc-200 hover:translate-x-1'
            ]"
            :to="child.url"
          >
            <span class="transition-colors duration-300" :class="activePath === child.url ? 'text-primary' : ''">
              {{ child.name }}
            </span>
          </RouterLink>
        </section>
        <RouterLink
          v-else
          class="relative block my-2 py-2.5 px-4 text-sm leading-6 rounded-lg transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]"
          :class="[
            activePath === item.url
              ? 'text-primary bg-blue-50 dark:bg-blue-900/20 translate-x-0'
              : 'text-zinc-800 dark:text-zinc-200 hover:translate-x-1'
          ]"
          :to="item.url as string"
        >
          <span class="transition-colors duration-300" :class="activePath === item.url ? 'text-primary' : ''">
            {{ item.name }}
          </span>
        </RouterLink>
      </template>
    </div>
  </aside>
</template>
