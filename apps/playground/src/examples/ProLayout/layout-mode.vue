<script setup lang="tsx">
import { ref } from 'vue'
import { ProLayout } from '@banmao/procomponent'
import { NConfigProvider, NRadioButton, NRadioGroup, darkTheme } from 'naive-ui'
import { Icon } from '@iconify/vue'

// 顶栏与侧栏固定深色，菜单需要切到暗色主题才有足够对比度
const layoutTheme = {
  common: { textColor1: '#fafafa', textColor2: '#d4d4d8', textColor3: '#a1a1aa' },
}

const renderIcon = (icon: string) => () => <Icon icon={icon} />

const layout = ref<'side' | 'top' | 'mix'>('side')

const menus = [
  { label: '首页', key: '/home', icon: renderIcon('hugeicons:home-01') },
  {
    label: '业务中心',
    key: '/biz',
    icon: renderIcon('hugeicons:table-01'),
    children: [
      { label: '订单管理', key: '/biz/order' },
      { label: '库存管理', key: '/biz/stock' },
    ],
  },
  {
    label: '系统管理',
    key: '/system',
    icon: renderIcon('hugeicons:settings-02'),
    children: [
      { label: '用户管理', key: '/system/user' },
      { label: '角色管理', key: '/system/role' },
    ],
  },
]
</script>

<template>
  <NRadioGroup v-model:value="layout" size="small" class="mb-3">
    <NRadioButton value="side">
      side
    </NRadioButton>
    <NRadioButton value="top">
      top
    </NRadioButton>
    <NRadioButton value="mix">
      mix
    </NRadioButton>
  </NRadioGroup>
  <NConfigProvider abstract :theme="darkTheme" :theme-overrides="layoutTheme">
    <ProLayout
      :layout="layout"
      title="Banmao Admin"
      :menus="menus"
      :style="{ height: '420px' }"
    >
      <h3 class="text-base font-semibold">
        当前布局：{{ layout }}
      </h3>
      <p class="mt-2 text-sm opacity-70">
        side 为左侧菜单；top 把菜单横排在顶栏、不再渲染侧栏；mix 顶栏只放一级菜单，
        侧栏展示当前一级菜单的子菜单。切到 mix 后点击顶栏「业务中心 / 系统管理」观察侧栏联动。
      </p>
    </ProLayout>
  </NConfigProvider>
</template>