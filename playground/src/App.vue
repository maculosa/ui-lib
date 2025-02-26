<script setup lang="ts">
import { NaiveProvider } from '@banmao/procomponent'
import { NConfigProvider, darkTheme } from 'naive-ui'
import { useDark, usePreferredDark } from '@vueuse/core'
import { provide, ref, watch } from 'vue'

//  是否跟随系统主题
const isAutoTheme = ref(true)
// 自动跟随系统主题
const preferredDark = usePreferredDark()
// 手动切换主题
const isDark = useDark({
  // 存储到 localStorage 避免重复请求
  storageKey: 'color-scheme',
  // 自动跟随系统主题
  onChanged(dark: boolean) {
    // 设置 meta theme-color
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.setAttribute('content', dark ? '#121212' : '#ffffff')
    }
  }
})

// 监听系统主题变化
watch(preferredDark, (val) => {
  if (isAutoTheme.value) {
    isDark.value = val
  }
})

// 切换主题模式
function toggleThemeMode() {
  isAutoTheme.value = !isAutoTheme.value
  if (isAutoTheme.value) {
    // 切换到自动模式时，立即应用系统主题
    isDark.value = preferredDark.value
  }
}

//  手动切换主题
function toggleTheme() {
  if (!isAutoTheme.value) {
    isDark.value = !isDark.value
  }
}

// 提供给全局使用
provide('isDark', isDark)
provide('isAutoTheme', isAutoTheme)
provide('toggleTheme', toggleTheme)
provide('toggleThemeMode', toggleThemeMode)

</script>

<template>
  <n-config-provider :theme="isDark ? darkTheme : null">
    <naive-provider>
      <router-view />
    </naive-provider>
  </n-config-provider>
</template>