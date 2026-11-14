<script setup lang="tsx">
import { computed, ref } from 'vue'
import { ProLayout } from '@banmao/procomponent'
import { NConfigProvider, NInputNumber, NSwitch, darkTheme } from 'naive-ui'
import { Icon } from '@iconify/vue'

// 顶栏与侧栏固定深色，菜单需要切到暗色主题才有足够对比度
const layoutTheme = {
  common: { textColor1: '#fafafa', textColor2: '#d4d4d8', textColor3: '#a1a1aa' },
}

const renderIcon = (icon: string) => () => <Icon icon={icon} />

const collapsedWidth = ref(88)
const collapsedIconSize = ref(26)
const loading = ref(false)

// collapsed 只作为初始值，所以这个示例一进来就是折叠态
const menuConfig = computed(() => ({
  collapsed: true,
  collapsedWidth: collapsedWidth.value,
  collapsedIconSize: collapsedIconSize.value,
  loading: loading.value,
}))

const menus = [
  { label: '首页', key: '/home', icon: renderIcon('hugeicons:home-01') },
  { label: '表格', key: '/table', icon: renderIcon('hugeicons:table-01') },
  { label: '图表', key: '/chart', icon: renderIcon('hugeicons:chart-01') },
  { label: '系统管理', key: '/system', icon: renderIcon('hugeicons:settings-02') },
]
</script>

<template>
  <div class="mb-3 flex flex-wrap items-center gap-4 text-sm">
    <label class="flex items-center gap-2">
      collapsedWidth
      <NInputNumber v-model:value="collapsedWidth" size="small" :min="48" :max="140" :step="8" class="w-28" />
    </label>
    <label class="flex items-center gap-2">
      collapsedIconSize
      <NInputNumber v-model:value="collapsedIconSize" size="small" :min="16" :max="32" class="w-24" />
    </label>
    <label class="flex items-center gap-2">
      loading
      <NSwitch v-model:value="loading" size="small" />
    </label>
  </div>
  <NConfigProvider abstract :theme="darkTheme" :theme-overrides="layoutTheme">
    <ProLayout
      :menu="menuConfig"
      title="Banmao Admin"
      :menus="menus"
      :style="{ height: '420px' }"
    >
      <h3 class="text-base font-semibold">
        menu 配置
      </h3>
      <p class="mt-2 text-sm opacity-70">
        collapsedWidth 同时决定侧栏宽度与 NMenu 的折叠宽度；collapsedIconSize 决定折叠后的图标尺寸；
        loading 为 true 时菜单区域显示加载态。点击侧栏底部按钮可展开。
      </p>
    </ProLayout>
  </NConfigProvider>
</template>