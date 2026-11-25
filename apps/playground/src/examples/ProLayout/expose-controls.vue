<script setup lang="tsx">
import { ref } from 'vue'
import { ProLayout } from '@banmao/procomponent'
import type { ProLayoutInstance } from '@banmao/procomponent'
import type { MenuOption } from 'naive-ui'
import { NButton, NConfigProvider, NSpace, darkTheme } from 'naive-ui'
import { Icon } from '@iconify/vue'

const layoutTheme = {
  common: { textColor1: '#fafafa', textColor2: '#d4d4d8', textColor3: '#a1a1aa' },
}

const renderIcon = (icon: string) => () => <Icon icon={icon} />

const menus: MenuOption[] = [
  { label: '首页', key: '/home', icon: renderIcon('hugeicons:home-01') },
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
    ],
  },
  { label: '表格', key: '/table', icon: renderIcon('hugeicons:table-01') },
]

const layoutRef = ref<ProLayoutInstance | null>(null)
const menuValue = ref<string | number>('/home')
const expandedKeys = ref<(string | number)[]>([])
const logs = ref<string[]>([])

function pushLog(text: string) {
  logs.value = [text, ...logs.value].slice(0, 4)
}

function selectMenu(key: string | number) {
  layoutRef.value?.setMenuValue(key)
  pushLog(`setMenuValue('${key}')`)
}

function collapseSystem() {
  layoutRef.value?.setExpandedKeys(['/system'])
  pushLog('setExpandedKeys([\"/system\"])')
}

async function scrollToRole() {
  const found = await layoutRef.value?.scrollToMenu('/system/auth/role')
  pushLog(`scrollToMenu('/system/auth/role') → ${found}`)
}
</script>

<template>
  <NSpace align="center" class="mb-3" :size="8" wrap>
    <NButton size="small" @click="selectMenu('/system/auth/menu')">
      setMenuValue 选「菜单管理」
    </NButton>
    <NButton size="small" @click="collapseSystem">
      setExpandedKeys 只展开一级
    </NButton>
    <NButton size="small" @click="scrollToRole">
      scrollToMenu 到「角色管理」
    </NButton>
    <NButton size="small" @click="layoutRef?.toggleCollapsed()">
      toggleCollapsed
    </NButton>
  </NSpace>

  <NConfigProvider abstract :theme="darkTheme" :theme-overrides="layoutTheme">
    <ProLayout
      ref="layoutRef"
      v-model:menu-value="menuValue"
      v-model:expanded-keys="expandedKeys"
      title="实例方法"
      :menus="menus"
      :style="{ height: '420px' }"
    >
      <p class="text-sm opacity-70">
        四个按钮分别调用 setMenuValue、setExpandedKeys、scrollToMenu 与 toggleCollapsed；
        每个方法都会先更新内部状态，再抛对应的 update / collapseChange 事件。
      </p>
      <p class="mt-3 font-mono text-xs opacity-70">
        menuValue = {{ menuValue }}
      </p>
      <p class="mt-1 font-mono text-xs opacity-70">
        expandedKeys = [{{ expandedKeys.join(', ') }}]
      </p>
      <ul class="mt-3 space-y-1 font-mono text-xs opacity-70">
        <li v-for="(log, i) in logs" :key="i">
          {{ log }}
        </li>
      </ul>
    </ProLayout>
  </NConfigProvider>
</template>
