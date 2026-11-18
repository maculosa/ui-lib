<script setup lang="tsx">
import { ref } from 'vue'
import { ProLayout } from '@banmao/procomponent'
import type { MenuOption } from 'naive-ui'
import { NButton, NConfigProvider, NSpace, NSwitch, darkTheme } from 'naive-ui'
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
]

const autoExpandSelected = ref(true)
const menuValue = ref<string | number>('/home')
const expandedKeys = ref<(string | number)[]>([])

function selectMenu(key: string | number) {
  menuValue.value = key
}
</script>

<template>
  <NSpace align="center" class="mb-3" :size="8" wrap>
    <span class="text-xs opacity-70">autoExpandSelected</span>
    <NSwitch v-model:value="autoExpandSelected" size="small" />
    <NButton size="small" @click="selectMenu('/system/user')">
      选中「用户管理」
    </NButton>
    <NButton size="small" @click="selectMenu('/system/auth/role')">
      选中「角色管理」
    </NButton>
  </NSpace>

  <NConfigProvider abstract :theme="darkTheme" :theme-overrides="layoutTheme">
    <ProLayout
      v-model:menu-value="menuValue"
      v-model:expanded-keys="expandedKeys"
      :auto-expand-selected="autoExpandSelected"
      title="自动展开"
      :menus="menus"
      :style="{ height: '420px' }"
    >
      <p class="text-sm opacity-70">
        开启时，menuValue 变化会自动把祖先 key 补进 expandedKeys，并抛出 update:expandedKeys；
        手动收起父级后不会反复撑开，直到下一次选中变化。
      </p>
      <p class="mt-2 text-sm opacity-70">
        关闭后恢复旧行为：只改高亮，展开状态完全由 expandedKeys 决定。
      </p>
      <p class="mt-3 font-mono text-xs opacity-70">
        menuValue = {{ menuValue }}
      </p>
      <p class="mt-1 font-mono text-xs opacity-70">
        expandedKeys = [{{ expandedKeys.join(', ') }}]
      </p>
    </ProLayout>
  </NConfigProvider>
</template>
