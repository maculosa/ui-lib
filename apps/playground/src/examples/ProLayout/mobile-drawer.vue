<script setup lang="tsx">
import { computed, ref } from 'vue'
import { ProLayout } from '@banmao/procomponent'
import type { MenuOption } from 'naive-ui'
import { NButton, NConfigProvider, NRadioButton, NRadioGroup, NSpace, darkTheme } from 'naive-ui'
import { Icon } from '@iconify/vue'

const layoutTheme = {
  common: { textColor1: '#fafafa', textColor2: '#d4d4d8', textColor3: '#a1a1aa' },
}

const renderIcon = (icon: string) => () => <Icon icon={icon} />

const menus: MenuOption[] = [
  { label: '首页', key: '/home', icon: renderIcon('hugeicons:home-01') },
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
      {
        label: '权限管理',
        key: '/sys/auth',
        children: [
          { label: '角色管理', key: '/sys/auth/role' },
          { label: '菜单管理', key: '/sys/auth/menu' },
        ],
      },
    ],
  },
]

const layout = ref<'side' | 'top' | 'mix'>('side')
const breakpoint = ref(768)
const menuValue = ref<string | number>('/home')
const expandedKeys = ref<(string | number)[]>(['/biz', '/sys'])

const current = computed(() => {
  const walk = (options: MenuOption[]): MenuOption | undefined => {
    for (const option of options) {
      if (option.key === menuValue.value) return option
      const hit = walk((option.children ?? []) as MenuOption[])
      if (hit) return hit
    }
  }
  return walk(menus)
})

function simulateNarrow() {
  breakpoint.value = window.innerWidth + 1
}
</script>

<template>
  <NSpace align="center" class="mb-3" :size="8" wrap>
    <NRadioGroup v-model:value="layout" size="small">
      <NRadioButton value="side">side</NRadioButton>
      <NRadioButton value="top">top</NRadioButton>
      <NRadioButton value="mix">mix</NRadioButton>
    </NRadioGroup>
    <NButton size="small" @click="simulateNarrow">
      模拟窄屏（断点 = 视口 + 1）
    </NButton>
    <NButton size="small" @click="breakpoint = 768">
      恢复 768
    </NButton>
    <span class="text-xs opacity-70">mobileBreakpoint = {{ breakpoint }}</span>
  </NSpace>

  <NConfigProvider abstract :theme="darkTheme" :theme-overrides="layoutTheme">
    <ProLayout
      v-model:menu-value="menuValue"
      v-model:expanded-keys="expandedKeys"
      :layout="layout"
      :menus="menus"
      :mobile-breakpoint="breakpoint"
      title="移动端抽屉"
      :style="{ height: '420px' }"
    >
      <p class="text-sm opacity-70">
        默认 breakpointMode="viewport"，按视口宽度判断。点「模拟窄屏」把断点抬到当前视口之上即可看到抽屉形态；
        需要按容器宽度判断时传 breakpointMode="container"，见「抽屉定制」示例。
      </p>
      <p class="mt-2 text-sm opacity-70">
        当前页面：{{ current?.label ?? menuValue }}（{{ menuValue }}）
      </p>
      <p class="mt-2 font-mono text-xs opacity-70">
        窄屏下 aside 与横排菜单都不渲染，折叠按钮消失，抽屉内始终是完整多级 menus。
      </p>
    </ProLayout>
  </NConfigProvider>
</template>