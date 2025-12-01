<script setup lang="ts">
import Logo from '@/components/layout/logo/index.vue'
import Nav from '@/components/layout/nav/index.vue'
import SwitchTheme from '@/components/SwitchTheme.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const isShowNav = ref(false)

function toggleNav() {
  isShowNav.value = !isShowNav.value
}

const router = useRouter()

function handleNavClick(item: { title: string; to: string; disabled?: boolean }) {
  if (item.disabled) {
    return
  }
  router.push(item.to)
  toggleNav()
}

const navItems = ref([
  { title: 'Home', to: '/' },
  { title: 'Docs', to: '/docs' },
  { title: 'Components', to: '/procomponent' },
  { title: 'Blocks', to: '/blocks', disabled: true },
  { title: 'Data V', to: '/datav' },
])



</script>
<template>
    <header class="layout-header">
      <div class="flex items-center justify-between w-full p-4 backdrop-blur-lg">
        <Logo />
        <div class="flex items-center gap-4 max-lg:hidden">
          <Nav />
          <SwitchTheme />
        </div>
        <div class="cursor-pointer hover:bg-zinc-500 p-2 rounded-md hidden max-lg:block" @click="toggleNav">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </div>
      </div>
      <Transition name="fade" mode="out-in">
        <div class="absolute top-16 left-0 z-999 shadow-zinc-900 w-full bg-transparent backdrop-blur-lg shadow-[0_2px_8px_rgba(0,0,0,0.08)] p-4 rounded-md shadow-md hidden max-lg:block"
          v-show="isShowNav"
        >
          <ul class="flex flex-col gap-4">
            <li v-for="item in navItems" :key="item.title" class="hover:bg-zinc-600 p-2 rounded-md" @click="handleNavClick(item)">
              <span>{{ item.title }}</span>
            </li>
          </ul>
        </div>
      </Transition>
    </header>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>