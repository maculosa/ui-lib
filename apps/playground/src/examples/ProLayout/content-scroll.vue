<script setup lang="tsx">
import { ref } from 'vue'
import { ProLayout } from '@banmao/procomponent'
import { NConfigProvider, NSpace, NSwitch, darkTheme } from 'naive-ui'
import { Icon } from '@iconify/vue'

const layoutTheme = {
  common: { textColor1: '#fafafa', textColor2: '#d4d4d8', textColor3: '#a1a1aa' },
}

const menus = Array.from({ length: 6 }, (_, i) => ({
  label: `菜单项 ${i + 1}`,
  key: `/menu-${i + 1}`,
  icon: () => <Icon icon="hugeicons:file-01" />,
}))

const paragraphs = Array.from({ length: 20 }, (_, i) => `第 ${i + 1} 段内容：开启 contentScroll 后由组件内部的 NScrollbar 承载滚动。`)

const contentScroll = ref(true)
</script>

<template>
  <NSpace align="center" class="mb-3" :size="6">
    <span class="text-xs opacity-70">contentScroll</span>
    <NSwitch v-model:value="contentScroll" size="small" />
    <span class="text-xs opacity-70">{{ contentScroll ? '内置滚动' : '关闭后超出部分被裁掉' }}</span>
  </NSpace>

  <NConfigProvider abstract :theme="darkTheme" :theme-overrides="layoutTheme">
    <ProLayout
      title="内容区滚动"
      :menus="menus"
      :content-scroll="contentScroll"
      :style="{ height: '400px' }"
    >
      <!-- 开启 contentScroll 时不需要再手写 h-full overflow-auto -->
      <p v-for="text in paragraphs" :key="text" class="mb-3 text-sm opacity-70">
        {{ text }}
      </p>
    </ProLayout>
  </NConfigProvider>
</template>