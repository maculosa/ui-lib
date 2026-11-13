<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWindowScroll } from '@vueuse/core'
import Logo from '@/components/layout/logo/index.vue'
import Nav from '@/components/layout/nav/index.vue'
import SwitchTheme from '@/components/SwitchTheme.vue'
import config from '@/config'

const route = useRoute()
const router = useRouter()
const { y } = useWindowScroll()
const scrolled = ref(false)
watch(y, val => {
  scrolled.value = val > 8
})

const isShowNav = ref(false)

watch(
  () => route.path,
  () => {
    isShowNav.value = false
  },
)

function handleNavClick(url: string) {
  router.push(url)
  isShowNav.value = false
}
</script>

<template>
  <header class="bm-header" :class="{ scrolled }">
    <div class="bm-header-inner">
      <Logo />

      <div class="bm-header-right">
        <div class="bm-header-desktop">
          <Nav />
          <span class="bm-header-divider" aria-hidden="true"></span>
          <SwitchTheme />
        </div>
        <div class="bm-header-mobile">
          <SwitchTheme />
          <button
            type="button"
            class="bm-menu-btn"
            :aria-label="isShowNav ? '关闭菜单' : '打开菜单'"
            :aria-expanded="isShowNav"
            @click="isShowNav = !isShowNav"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
              <path v-if="!isShowNav" d="M4 7h16M4 12h16M4 17h16" />
              <path v-else d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <Transition name="bm-drawer">
      <div v-if="isShowNav" class="bm-drawer">
        <nav class="bm-drawer-nav" aria-label="移动端导航">
          <button
            v-for="(item, index) in config.navItems"
            :key="item.url"
            type="button"
            class="bm-drawer-link"
            :class="{ active: route.path === item.url || (item.url !== '/' && route.path.startsWith(item.url)) }"
            @click="handleNavClick(item.url)"
          >
            <span class="bm-drawer-index">{{ String(index + 1).padStart(2, '0') }}</span>
            <span>{{ item.name }}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.bm-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: var(--layout-header-height);
  background: color-mix(in srgb, var(--color-background) 78%, transparent);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
}
.bm-header.scrolled {
  border-bottom-color: var(--color-divider);
  box-shadow: 0 4px 24px var(--color-shadow);
}
.bm-header-inner {
  max-width: 1440px;
  height: 100%;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.bm-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.bm-header-desktop {
  display: flex;
  align-items: center;
  gap: 14px;
}
.bm-header-divider {
  width: 1px;
  height: 20px;
  background: var(--color-divider);
}
.bm-header-mobile {
  display: none;
  align-items: center;
  gap: 8px;
}
.bm-menu-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--color-divider);
  background: var(--color-surface);
  color: var(--color-foreground-secondary);
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;
}
.bm-menu-btn:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
}
.bm-menu-btn svg {
  width: 18px;
  height: 18px;
}
.bm-drawer {
  position: absolute;
  top: var(--layout-header-height);
  left: 0;
  right: 0;
  background: color-mix(in srgb, var(--color-background) 94%, transparent);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--color-divider);
  box-shadow: 0 16px 40px var(--color-shadow);
}
.bm-drawer-nav {
  display: flex;
  flex-direction: column;
  padding: 12px 20px 18px;
  gap: 2px;
}
.bm-drawer-link {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 12px;
  border: none;
  border-radius: 8px;
  background: transparent;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-foreground-secondary);
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s ease, color 0.2s ease;
}
.bm-drawer-link svg {
  width: 15px;
  height: 15px;
  margin-left: auto;
  opacity: 0.4;
}
.bm-drawer-link:hover {
  background: var(--color-hover);
  color: var(--color-foreground);
}
.bm-drawer-link.active {
  background: var(--color-selected);
  color: var(--color-primary);
}
.bm-drawer-index {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--color-foreground-tertiary);
}
.bm-drawer-link.active .bm-drawer-index {
  color: var(--color-primary);
}
.bm-drawer-enter-active,
.bm-drawer-leave-active {
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.19, 1, 0.22, 1);
}
.bm-drawer-enter-from,
.bm-drawer-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 1023px) {
  .bm-header-desktop {
    display: none;
  }
  .bm-header-mobile {
    display: flex;
  }
}
</style>