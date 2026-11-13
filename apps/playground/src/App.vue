<script setup lang="ts">
import { NaiveProvider } from '@banmao/procomponent'
import { NConfigProvider, darkTheme } from 'naive-ui'
import { useDark } from '@vueuse/core'
import { computed, provide } from 'vue'

const isDark = useDark({
  storageKey: 'color-scheme',
  onChanged(dark: boolean) {
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.setAttribute('content', dark ? '#141310' : '#f4f1ea')
    }
    document.querySelector('html')?.setAttribute('class', dark ? 'dark' : '')
  },
})

function toggleTheme() {
  isDark.value = !isDark.value
}

provide('isDark', isDark)
provide('toggleTheme', toggleTheme)

const fontFamily =
  "'DM Sans', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans SC', system-ui, sans-serif"

const themeOverrides = computed(() => {
  const dark = isDark.value
  const primary = dark ? '#ff6a3d' : '#f04e23'
  const primaryHover = dark ? '#ff8159' : '#f26339'
  const primaryPressed = dark ? '#e55a2e' : '#d8431c'
  const info = dark ? '#6b93ff' : '#2f6bff'
  const success = dark ? '#5fbf6e' : '#3e9b4f'
  const warning = dark ? '#f0b429' : '#e8a013'
  const error = dark ? '#f0655a' : '#d64545'
  const divider = dark ? '#322e25' : '#dfdacc'
  const textColor1 = dark ? '#f0ede3' : '#1c1a15'
  const textColor2 = dark ? '#b5b1a2' : '#57534a'
  const textColor3 = dark ? '#979280' : '#6c675b'

  return {
    common: {
      primaryColor: primary,
      primaryColorHover: primaryHover,
      primaryColorPressed: primaryPressed,
      primaryColorSuppl: primary,
      infoColor: info,
      infoColorHover: info,
      infoColorPressed: info,
      infoColorSuppl: info,
      successColor: success,
      successColorHover: success,
      successColorPressed: success,
      successColorSuppl: success,
      warningColor: warning,
      warningColorHover: warning,
      warningColorPressed: warning,
      warningColorSuppl: warning,
      errorColor: error,
      errorColorHover: error,
      errorColorPressed: error,
      errorColorSuppl: error,
      borderRadius: '6px',
      borderRadiusSmall: '4px',
      fontFamily,
      fontSize: '14px',
      bodyColor: dark ? '#141310' : '#f4f1ea',
      cardColor: dark ? '#1c1a16' : '#fbfaf6',
      modalColor: dark ? '#1c1a16' : '#fbfaf6',
      popoverColor: dark ? '#242119' : '#fbfaf6',
      tableColor: dark ? '#1c1a16' : '#fbfaf6',
      tableHeaderColor: dark ? '#242119' : '#f4f1ea',
      inputColor: dark ? '#242119' : '#fbfaf6',
      inputColorDisabled: dark ? '#2c2820' : '#ece8de',
      borderColor: divider,
      dividerColor: divider,
      textColorBase: textColor1,
      textColor1,
      textColor2,
      textColor3,
      placeholderColor: textColor3,
      hoverColor: dark ? 'rgba(255, 106, 61, 0.08)' : 'rgba(240, 78, 35, 0.05)',
      pressedColor: dark ? 'rgba(255, 106, 61, 0.16)' : 'rgba(240, 78, 35, 0.1)',
    },
    Button: {
      fontWeight: '500',
      borderRadiusMedium: '6px',
    },
    Card: {
      borderRadius: '10px',
      borderColor: divider,
    },
    Tag: {
      borderRadius: '4px',
    },
    Tooltip: {
      borderRadius: '6px',
    },
  }
})
</script>

<template>
  <n-config-provider :theme="isDark ? darkTheme : null" :theme-overrides="themeOverrides">
    <naive-provider>
      <router-view />
    </naive-provider>
  </n-config-provider>
</template>