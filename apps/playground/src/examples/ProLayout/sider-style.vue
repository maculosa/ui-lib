<script setup lang="tsx">
import { computed, ref } from 'vue'
import { ProLayout } from '@banmao/procomponent'
import { NConfigProvider, NInputNumber, NSpace, NSwitch, darkTheme, lightTheme } from 'naive-ui'
import { Icon } from '@iconify/vue'

const layoutTheme = {
  common: { textColor1: '#fafafa', textColor2: '#d4d4d8', textColor3: '#a1a1aa' },
}

const renderIcon = (icon: string) => () => <Icon icon={icon} />

const menus = [
  { label: '首页', key: '/home', icon: renderIcon('hugeicons:home-01') },
  { label: '表格', key: '/table', icon: renderIcon('hugeicons:table-01') },
  { label: '图表', key: '/chart', icon: renderIcon('hugeicons:chart-01') },
]

const lightSider = ref(false)
const siderWidth = ref(256)
const noPadding = ref(false)

const siderClass = computed(() => (lightSider.value ? 'bg-white border-r border-zinc-200' : ''))
const contentClass = computed(() => (noPadding.value ? 'p-0' : ''))
</script>

<template>
  <NSpace align="center" class="mb-3" :size="16">
    <NSpace align="center" :size="6">
      <span class="text-xs opacity-70">浅色侧栏</span>
      <NSwitch v-model:value="lightSider" size="small" />
    </NSpace>
    <NSpace align="center" :size="6">
      <span class="text-xs opacity-70">siderWidth</span>
      <NInputNumber v-model:value="siderWidth" size="small" :min="160" :max="360" :step="16" class="w-28" />
    </NSpace>
    <NSpace align="center" :size="6">
      <span class="text-xs opacity-70">内容区去内边距</span>
      <NSwitch v-model:value="noPadding" size="small" />
    </NSpace>
  </NSpace>

  <NConfigProvider
    abstract
    :theme="lightSider ? lightTheme : darkTheme"
    :theme-overrides="lightSider ? undefined : layoutTheme"
  >
    <ProLayout
      title="侧栏与内容区定制"
      :menus="menus"
      :sider-class="siderClass"
      :sider-width="siderWidth"
      :content-class="contentClass"
      :style="{ height: '400px' }"
    >
      <div class="h-full border border-dashed border-zinc-400/40 p-3 text-sm opacity-70">
        <p>siderClass 经 tailwind-merge 合并，可覆盖内置的 bg-zinc-800。</p>
        <p class="mt-2">侧栏宽度走行内样式，只能用 siderWidth 改，siderClass 里的 w-* 不会生效。</p>
        <p class="mt-2">contentClass 覆盖内容区的 p-4，当前：{{ noPadding ? 'p-0' : 'p-4（默认）' }}。</p>
        <p class="mt-2">浅色侧栏要同时把菜单主题切成 lightTheme，否则浅色文字落在白底上不可读。</p>
      </div>
    </ProLayout>
  </NConfigProvider>
</template>