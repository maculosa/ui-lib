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
  { label: '首页', key: '/home', icon: renderIcon('hugeicons:home-01') },
  { label: '表格', key: '/table', icon: renderIcon('hugeicons:table-01') },
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
]

const menuValue = ref<string | number>('/home')
const expandedKeys = ref<(string | number)[]>(['/system'])
const logs = ref<string[]>([])

function pushLog(text: string) {
  logs.value = [text, ...logs.value].slice(0, 4)
}

function onMenuClick(key: string | number, item: MenuOption) {
  pushLog(`menuClick → ${key}（${item.label}）`)
}

function onExpandedKeysChange(keys: (string | number)[]) {
  expandedKeys.value = keys
  pushLog(`update:expandedKeys → [${keys.join(', ')}]`)
}

function selectRole() {
  menuValue.value = '/system/auth/role'
  expandedKeys.value = ['/system', '/system/auth']
}
</script>

<template>
  <NSpace align="center" class="mb-3" :size="8">
    <NButton size="small" @click="selectRole">
      外部选中「角色管理」
    </NButton>
    <NButton size="small" @click="menuValue = '/home'">
      外部选中「首页」
    </NButton>
    <span class="text-xs opacity-70">menuValue = {{ menuValue }}</span>
  </NSpace>

  <NConfigProvider abstract :theme="darkTheme" :theme-overrides="layoutTheme">
    <ProLayout
      v-model:menu-value="menuValue"
      title="受控菜单"
      :menus="menus"
      :expanded-keys="expandedKeys"
      :style="{ height: '420px' }"
      @menu-click="onMenuClick"
      @update:expanded-keys="onExpandedKeysChange"
    >
      <p class="text-sm opacity-70">
        menuValue 决定高亮项，expandedKeys 决定展开的父级；两者都由外部持有，点击菜单只会抛事件，不会自行改动。
      </p>
      <p class="mt-2 font-mono text-xs opacity-70">
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