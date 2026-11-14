<script setup lang="tsx">
import { ProLayout } from '@banmao/procomponent'
import { NConfigProvider, darkTheme } from 'naive-ui'
import { Icon } from '@iconify/vue'

const layoutTheme = {
  common: { textColor1: '#fafafa', textColor2: '#d4d4d8', textColor3: '#a1a1aa' },
}

const menus = Array.from({ length: 24 }, (_, i) => ({
  label: `菜单项 ${i + 1}`,
  key: `/menu-${i + 1}`,
  icon: () => <Icon icon="hugeicons:file-01" />,
}))

const paragraphs = Array.from({ length: 20 }, (_, i) => `第 ${i + 1} 段内容：内容区默认不滚动，需要自行包一层滚动容器。`)
</script>

<template>
  <NConfigProvider abstract :theme="darkTheme" :theme-overrides="layoutTheme">
    <ProLayout title="滚动区域" :menus="menus" :style="{ height: '420px' }">
      <!-- 内容区自身不滚动，超出部分会被裁掉，必须自行包滚动容器 -->
      <div class="h-full overflow-auto">
        <p v-for="text in paragraphs" :key="text" class="mb-3 text-sm opacity-70">
          {{ text }}
        </p>
      </div>
    </ProLayout>
  </NConfigProvider>
</template>