<script setup lang="tsx">
import { ProLayout } from '@banmao/procomponent'
import { NButton, NConfigProvider, lightTheme } from 'naive-ui'
import { Icon } from '@iconify/vue'

const renderIcon = (icon: string) => () => <Icon icon={icon} />

const menus = [
  { label: '首页', key: '/home', icon: renderIcon('hugeicons:home-01') },
  { label: '表格', key: '/table', icon: renderIcon('hugeicons:table-01') },
  { label: '图表', key: '/chart', icon: renderIcon('hugeicons:chart-01') },
]
</script>

<template>
  <NConfigProvider abstract :theme="lightTheme">
    <ProLayout
      layout="top"
      title="Banmao Admin"
      header-class="bg-white text-zinc-900 border-b border-zinc-200 shadow-none"
      :menus="menus"
      :style="{ height: '240px' }"
    >
      <template #header-extra>
        <NButton size="small" class="ml-auto">
          退出
        </NButton>
      </template>

      <p class="text-sm opacity-70">
        顶栏根节点默认 text-white，标题与折叠 / 抽屉按钮都继承 currentColor。
        headerClass 写成 bg-white text-zinc-900 后，标题自动变成深色，不需要 titleRender。
      </p>
    </ProLayout>
  </NConfigProvider>
</template>
