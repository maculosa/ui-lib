<script setup lang="tsx">
import { ProLayout } from '@banmao/procomponent'
import { NConfigProvider, darkTheme } from 'naive-ui'
import { Icon } from '@iconify/vue'

const layoutTheme = {
  common: { textColor1: '#fafafa', textColor2: '#d4d4d8', textColor3: '#a1a1aa' },
}

const renderIcon = (icon: string) => () => <Icon icon={icon} />

const menus = [
  {
    type: 'group',
    label: '业务中心',
    key: 'business',
    children: [
      { label: '首页', key: '/home', icon: renderIcon('hugeicons:home-01') },
      { label: '文件管理', key: '/file', icon: renderIcon('hugeicons:file-01'), extra: '12' },
    ],
  },
  { type: 'divider', key: 'd1' },
  {
    label: '系统管理',
    key: '/system',
    icon: renderIcon('hugeicons:settings-02'),
    children: [
      { label: '用户管理', key: '/system/user' },
      {
        label: '权限管理',
        key: '/system/auth',
        children: [
          { label: '角色管理', key: '/system/auth/role' },
          { label: '菜单管理', key: '/system/auth/menu' },
        ],
      },
      { label: '审计日志', key: '/system/log', disabled: true },
    ],
  },
  { label: '仓库管理', key: '/repo', icon: renderIcon('hugeicons:repository'), disabled: true },
]
</script>

<template>
  <NConfigProvider abstract :theme="darkTheme" :theme-overrides="layoutTheme">
    <ProLayout title="菜单配置" :menus="menus" :style="{ height: '420px' }">
      <p class="text-sm opacity-70">
        menus 直接透传给 NMenu 的 options，支持分组（type: 'group'）、分割线（type: 'divider'）、
        多级 children、禁用项与 extra 附加内容。
      </p>
    </ProLayout>
  </NConfigProvider>
</template>