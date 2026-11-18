<script setup lang="tsx">
import { ref } from 'vue'
import { ProLayout } from '@banmao/procomponent'
import type { MenuOption } from 'naive-ui'
import {
  NButton,
  NConfigProvider,
  NMenu,
  NRadioButton,
  NRadioGroup,
  NSpace,
  darkTheme,
} from 'naive-ui'
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
      { label: '角色管理', key: '/system/auth/role' },
      { label: '菜单管理', key: '/system/auth/menu' },
    ],
  },
]

const layoutRef = ref<InstanceType<typeof ProLayout> | null>(null)
const containerWidth = ref(360)
const menuValue = ref<string | number>('/home')
const expandedKeys = ref<(string | number)[]>(['/system'])

function handleDrawerSelect(key: string | number, close: () => void) {
  menuValue.value = key
  close()
}
</script>

<template>
  <NSpace align="center" class="mb-3" :size="8" wrap>
    <span class="text-xs opacity-70">容器宽度</span>
    <NRadioGroup v-model:value="containerWidth" size="small">
      <NRadioButton :value="360">360px</NRadioButton>
      <NRadioButton :value="900">900px</NRadioButton>
    </NRadioGroup>
    <NButton size="small" @click="layoutRef?.openDrawer()">
      openDrawer
    </NButton>
    <NButton size="small" @click="layoutRef?.closeDrawer()">
      closeDrawer
    </NButton>
    <NButton size="small" @click="layoutRef?.toggleDrawer()">
      toggleDrawer
    </NButton>
  </NSpace>

  <NConfigProvider abstract :theme="darkTheme" :theme-overrides="layoutTheme">
    <ProLayout
      ref="layoutRef"
      v-model:menu-value="menuValue"
      v-model:expanded-keys="expandedKeys"
      breakpoint-mode="container"
      :mobile-breakpoint="420"
      drawer-placement="right"
      :drawer-width="300"
      title="抽屉定制"
      :menus="menus"
      :style="{ height: '420px', width: `${containerWidth}px` }"
    >
      <p class="text-sm opacity-70">
        breakpointMode="container" 按 ProLayout 根节点宽度判定窄屏，而不是视口宽度；
        把上面的容器切到 360px 即可在文档卡片内看到汉堡按钮。
      </p>
      <p class="mt-2 text-sm opacity-70">
        抽屉从右侧弹出、宽 300px，内容由 drawer 插槽接管，插槽参数是
        <code>{ menus, close }</code>。
      </p>

      <template #drawer="{ menus: drawerMenus, close }">
        <div class="drawer-custom flex h-full flex-col gap-3 bg-zinc-900 p-4 text-white">
          <div>
            <p class="text-sm font-semibold">
              自定义抽屉
            </p>
            <p class="mt-1 text-xs opacity-60">
              右侧 300px · 插槽完全接管内容
            </p>
          </div>
          <NMenu
            :options="drawerMenus"
            :value="menuValue"
            :expanded-keys="expandedKeys"
            @update:value="key => handleDrawerSelect(key, close)"
            @update:expanded-keys="keys => (expandedKeys = keys)"
          />
          <NButton class="mt-auto" size="small" @click="close">
            关闭抽屉
          </NButton>
        </div>
      </template>
    </ProLayout>
  </NConfigProvider>
</template>
