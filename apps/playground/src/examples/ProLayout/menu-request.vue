<script setup lang="tsx">
import { ref } from 'vue'
import { ProLayout } from '@banmao/procomponent'
import type { MenuOption } from 'naive-ui'
import { NConfigProvider, darkTheme } from 'naive-ui'
import { Icon } from '@iconify/vue'

// 顶栏与侧栏固定深色，菜单需要切到暗色主题才有足够对比度
const layoutTheme = {
  common: { textColor1: '#fafafa', textColor2: '#d4d4d8', textColor3: '#a1a1aa' },
}

const renderIcon = (icon: string) => () => <Icon icon={icon} />

const defaultCount = ref(0)
const loadingLog = ref<string[]>([])

const localMenus: MenuOption[] = [
  { label: '本地首页', key: '/local-home', icon: renderIcon('hugeicons:home-01') },
  { label: '本地表格', key: '/local-table', icon: renderIcon('hugeicons:table-01') },
]

const remoteMenus: MenuOption[] = [
  { label: '远程首页', key: '/remote-home', icon: renderIcon('hugeicons:home-01') },
  { label: '远程表格', key: '/remote-table', icon: renderIcon('hugeicons:table-01') },
  { label: '远程图表', key: '/remote-chart', icon: renderIcon('hugeicons:chart-01') },
  {
    label: '远程系统',
    key: '/remote-system',
    icon: renderIcon('hugeicons:settings-02'),
    children: [
      { label: '用户管理', key: '/remote-system/user' },
      { label: '角色管理', key: '/remote-system/role' },
    ],
  },
]

const menuConfig = {
  request: async (_params: unknown, defaultMenuData: MenuOption[]) => {
    defaultCount.value = defaultMenuData.length
    await new Promise(resolve => setTimeout(resolve, 1500))
    return remoteMenus
  },
  onLoadingChange: (loading: boolean) => {
    loadingLog.value = [`onLoadingChange → ${loading}`, ...loadingLog.value].slice(0, 4)
  },
}
</script>

<template>
  <NConfigProvider abstract :theme="darkTheme" :theme-overrides="layoutTheme">
    <ProLayout
      :menu="menuConfig"
      title="Banmao Admin"
      :menus="localMenus"
      :style="{ height: '420px' }"
    >
      <h3 class="text-base font-semibold">
        远程菜单
      </h3>
      <p class="mt-2 text-sm opacity-70">
        挂载时调用 menu.request，第二个参数是 menus 传入的本地数据（本次收到 {{ defaultCount }} 项）。
        请求期间菜单区域显示加载态，返回后整体替换为远程菜单。
      </p>
      <ul class="mt-3 space-y-1 text-xs opacity-70">
        <li v-for="(item, index) in loadingLog" :key="index">
          {{ item }}
        </li>
      </ul>
    </ProLayout>
  </NConfigProvider>
</template>