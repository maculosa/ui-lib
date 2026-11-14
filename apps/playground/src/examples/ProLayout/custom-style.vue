<script setup lang="tsx">
import { ProLayout } from '@banmao/procomponent'
import { NConfigProvider, darkTheme } from 'naive-ui'
import { Icon } from '@iconify/vue'

const layoutTheme = {
  common: { textColor1: '#fafafa', textColor2: '#d4d4d8', textColor3: '#a1a1aa' },
}

const renderIcon = (icon: string) => () => <Icon icon={icon} />

const menus = [
  { label: '首页', key: '/home', icon: renderIcon('hugeicons:home-01') },
  { label: '表格', key: '/table', icon: renderIcon('hugeicons:table-01') },
  { label: '服务器管理', key: '/server', icon: renderIcon('hugeicons:server-stack-01') },
]
</script>

<template>
  <NConfigProvider abstract :theme="darkTheme" :theme-overrides="layoutTheme">
    <!-- 父容器定高，ProLayout 用 height: 100% 撑满 -->
    <div class="h-[400px]">
      <ProLayout
        title="嵌入页面"
        :menus="menus"
        class="rounded-xl overflow-hidden"
        :style="{ height: '100%' }"
      >
        <div class="h-full overflow-auto">
          <p class="text-sm opacity-70">
            class 追加到根节点，style 作用于根节点。根节点是 w-full 的纵向 flex，
            高度由外部决定：给定高父容器 + height: 100%，或直接用 style 写死像素高度。
          </p>
        </div>
      </ProLayout>
    </div>
  </NConfigProvider>
</template>