<script setup lang="ts">
import { NaiveProvider } from '@banmao/procomponent'
import { NConfigProvider, darkTheme } from 'naive-ui'
import { useDark } from '@vueuse/core'
import { provide } from 'vue'

// 手动切换主题
const isDark = useDark({
  storageKey: 'color-scheme',
  onChanged(dark: boolean) {
    // 设置 meta theme-color
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.setAttribute('content', dark ? '#121212' : '#ffffff')
      document.querySelector('html')?.setAttribute('class', dark ? 'dark' : '')
    }
  },
})

// 手动切换主题
function toggleTheme() {
  isDark.value = !isDark.value
}

// 提供给全局使用
provide('isDark', isDark)
provide('toggleTheme', toggleTheme)

const themeOverrides = {
  common: {
    primaryColor: '#1890ff',
  },
}
</script>

<template>
  <n-config-provider :theme="isDark ? darkTheme : null" :theme-overrides="themeOverrides">
    <naive-provider>
      <router-view />
    </naive-provider>
  </n-config-provider>
</template>
