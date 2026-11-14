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
  { label: '列表', key: '/list', icon: renderIcon('hugeicons:left-to-right-list-dash') },
  { label: '表格', key: '/table', icon: renderIcon('hugeicons:table-01') },
  { label: '图表', key: '/chart', icon: renderIcon('hugeicons:chart-01') },
  {
    label: '系统管理',
    key: '/system',
    icon: renderIcon('hugeicons:settings-02'),
    children: [
      { label: '用户管理', key: '/system/user' },
      { label: '角色管理', key: '/system/role' },
      { label: '菜单管理', key: '/system/menu' },
    ],
  },
]
</script>

<template>
  <NConfigProvider abstract :theme="darkTheme" :theme-overrides="layoutTheme">
    <ProLayout title="Banmao Admin" :menus="menus" :style="{ height: '420px' }">
      <h3 class="text-base font-semibold">
        内容区域
      </h3>
      <p class="mt-2 text-sm opacity-70">
        默认插槽的内容渲染在右侧内容区，左侧菜单由 menus 配置生成。
      </p>
    </ProLayout>
  </NConfigProvider>
</template>