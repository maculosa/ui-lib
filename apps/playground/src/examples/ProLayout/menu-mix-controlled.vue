<script setup lang="tsx">
import { ref } from 'vue'
import { ProLayout } from '@banmao/procomponent'
import type { MenuOption } from 'naive-ui'
import { NButton, NConfigProvider, NSpace, darkTheme } from 'naive-ui'
import { Icon } from '@iconify/vue'

const layoutTheme = {
  common: { textColor1: '#fafafa', textColor2: '#d4d4d8', textColor3: '#a1a1aa' },
}

const renderIcon = (icon: string) => () => <Icon icon={icon} />

const menus: MenuOption[] = [
  {
    label: '工作台',
    key: '/work',
    icon: renderIcon('hugeicons:home-01'),
    children: [
      { label: '首页', key: '/work/home' },
      { label: '待办', key: '/work/todo' },
    ],
  },
  {
    label: '业务中心',
    key: '/biz',
    icon: renderIcon('hugeicons:table-01'),
    children: [
      { label: '表格', key: '/biz/table' },
      { label: '图表', key: '/biz/chart' },
    ],
  },
  {
    label: '系统管理',
    key: '/sys',
    icon: renderIcon('hugeicons:settings-02'),
    children: [
      { label: '用户管理', key: '/sys/user' },
      { label: '角色管理', key: '/sys/role' },
    ],
  },
]

const menuValue = ref<string | number>('/work/home')
const logs = ref<string[]>([])

function pushLog(text: string) {
  logs.value = [text, ...logs.value].slice(0, 4)
}

function onTopMenuClick(key: string | number, item: MenuOption) {
  pushLog(`topMenuClick → ${key}（${item.label}，children ${item.children?.length ?? 0} 项）`)
}

function onMenuClick(key: string | number) {
  pushLog(`menuClick → ${key}`)
}
</script>

<template>
  <NSpace align="center" class="mb-3" :size="8">
    <NButton size="small" @click="menuValue = '/biz/chart'">
      模拟路由跳到 /biz/chart
    </NButton>
    <NButton size="small" @click="menuValue = '/sys/role'">
      模拟路由跳到 /sys/role
    </NButton>
    <span class="text-xs opacity-70">menuValue = {{ menuValue }}</span>
  </NSpace>

  <NConfigProvider abstract :theme="darkTheme" :theme-overrides="layoutTheme">
    <ProLayout
      v-model:menu-value="menuValue"
      layout="mix"
      title="mix 受控菜单"
      :menus="menus"
      :style="{ height: '420px' }"
      @menu-click="onMenuClick"
      @top-menu-click="onTopMenuClick"
    >
      <p class="text-sm opacity-70">
        单一 value 源：顶栏点击只切换一级项并抛 topMenuClick，不写 menuValue；侧栏点击才写 menuValue。
      </p>
      <p class="mt-2 text-sm opacity-70">
        外部改 menuValue（如路由变化）会反推所属一级项，顶栏与侧栏一起切过去。
      </p>
      <ul class="mt-3 space-y-1 font-mono text-xs opacity-70">
        <li v-for="(log, i) in logs" :key="i">
          {{ log }}
        </li>
      </ul>
    </ProLayout>
  </NConfigProvider>
</template>