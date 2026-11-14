<script setup lang="tsx">
import { ProLayout } from '@banmao/procomponent'
import { NConfigProvider, darkTheme } from 'naive-ui'
import { Icon } from '@iconify/vue'

// 顶栏与侧栏固定深色，菜单需要切到暗色主题才有足够对比度
const layoutTheme = {
  common: { textColor1: '#fafafa', textColor2: '#d4d4d8', textColor3: '#a1a1aa' },
}

const renderIcon = (icon: string) => () => <Icon icon={icon} />

const menus = [
  { label: '首页', key: '/home', icon: renderIcon('hugeicons:home-01') },
  { label: '表格', key: '/table', icon: renderIcon('hugeicons:table-01') },
  { label: '图表', key: '/chart', icon: renderIcon('hugeicons:chart-01') },
]

const titleRender = (title: string) => (
  <div class="flex items-baseline gap-2">
    <span class="text-white text-lg font-bold">{title}</span>
    <span class="text-xs text-zinc-300">控制台</span>
  </div>
)
</script>

<template>
  <NConfigProvider abstract :theme="darkTheme" :theme-overrides="layoutTheme">
    <ProLayout
      title="Banmao Admin"
      logo="/favicon.svg"
      :title-render="titleRender"
      header-class="bg-orange-600"
      :menus="menus"
      :style="{ height: '420px' }"
    >
      <h3 class="text-base font-semibold">
        顶栏定制
      </h3>
      <p class="mt-2 text-sm opacity-70">
        logo 渲染在标题左侧；titleRender 接管整个标题节点；headerClass 经 tailwind-merge 合并，
        这里的 bg-orange-600 覆盖了组件内置的 bg-zinc-800。
      </p>
    </ProLayout>
  </NConfigProvider>
</template>

<style scoped>
/* 文档站的 .markdown-body img 排版规则优先级高于组件的 h-8，这里还原 logo 尺寸 */
:deep(header img) {
  height: 32px;
  width: auto;
  margin: 0 8px 0 0;
  border: 0;
  border-radius: 0;
}
</style>