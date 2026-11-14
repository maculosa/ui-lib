<script setup lang="tsx">
import { ref } from 'vue'
import { ProLayout } from '@banmao/procomponent'
import { NConfigProvider, NSpace, NSwitch, darkTheme } from 'naive-ui'
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

const useCustomFooter = ref(true)
</script>

<template>
  <NSpace align="center" class="mb-3" :size="6">
    <span class="text-xs opacity-70">footer 插槽</span>
    <NSwitch v-model:value="useCustomFooter" size="small" />
    <span class="text-xs opacity-70">{{ useCustomFooter ? '自定义内容' : '默认文案 Footer' }}</span>
  </NSpace>

  <NConfigProvider abstract :theme="darkTheme" :theme-overrides="layoutTheme">
    <ProLayout title="页脚" :menus="menus" footer :style="{ height: '380px' }">
      <p class="text-sm opacity-70">
        footer 是布尔开关，开启后在布局底部渲染一条 64px 高的页脚。
      </p>
      <p class="mt-2 text-sm opacity-70">
        不提供 footer 插槽时文案为默认的 Footer；提供插槽后整个页脚内容由插槽接管。
      </p>

      <template v-if="useCustomFooter" #footer>
        <div class="flex w-full items-center justify-between text-xs opacity-70">
          <span>© 2026 Banmao · 内部管理系统</span>
          <span>Banmao UI</span>
        </div>
      </template>
    </ProLayout>
  </NConfigProvider>
</template>