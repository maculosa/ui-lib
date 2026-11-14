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

const position = ref<'top' | 'bottom'>('bottom')

const menus = [
  { label: '首页', key: '/home', icon: renderIcon('hugeicons:home-01') },
  { label: '表格', key: '/table', icon: renderIcon('hugeicons:table-01') },
  { label: '图表', key: '/chart', icon: renderIcon('hugeicons:chart-01') },
]
</script>

<template>
  <NRadioGroup v-model:value="position" size="small" class="mb-3">
    <NRadioButton value="bottom">
      bottom
    </NRadioButton>
    <NRadioButton value="top">
      top
    </NRadioButton>
  </NRadioGroup>
  <NConfigProvider abstract :theme="darkTheme" :theme-overrides="layoutTheme">
    <ProLayout
      :collapsed-trigger-position="position"
      title="Banmao Admin"
      :menus="menus"
      :style="{ height: '420px' }"
    >
      <h3 class="text-base font-semibold">
        折叠按钮位置：{{ position }}
      </h3>
      <p class="mt-2 text-sm opacity-70">
        bottom 只在侧栏底部渲染折叠按钮，top 只在顶栏渲染。同一时刻只存在一个按钮。
      </p>
    </ProLayout>
  </NConfigProvider>
</template>