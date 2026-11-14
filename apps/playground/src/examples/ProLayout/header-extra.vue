<script setup lang="tsx">
import { ProLayout } from '@banmao/procomponent'
import { NConfigProvider, NTag, darkTheme } from 'naive-ui'
import { Icon } from '@iconify/vue'

const layoutTheme = {
  common: { textColor1: '#fafafa', textColor2: '#d4d4d8', textColor3: '#a1a1aa' },
}

const renderIcon = (icon: string) => () => <Icon icon={icon} />

const menus = [
  { label: '首页', key: '/home', icon: renderIcon('hugeicons:home-01') },
  { label: '表格', key: '/table', icon: renderIcon('hugeicons:table-01') },
  { label: '参数管理', key: '/param', icon: renderIcon('hugeicons:settings-02') },
]
</script>

<template>
  <NConfigProvider abstract :theme="darkTheme" :theme-overrides="layoutTheme">
    <ProLayout title="Banmao Admin" :menus="menus" :style="{ height: '360px' }">
      <template #header-extra>
        <div class="ml-6 flex flex-1 items-center gap-2 text-sm text-white/60">
          <span>系统管理</span>
          <span>/</span>
          <span class="text-white">用户管理</span>
        </div>
        <div class="flex items-center gap-3">
          <NTag size="small" type="success" :bordered="false">
            生产环境
          </NTag>
          <Icon icon="hugeicons:settings-02" class="text-white/70" />
          <span class="text-sm text-white">管理员</span>
        </div>
      </template>

      <p class="text-sm opacity-70">
        header-extra 渲染在标题右侧、折叠按钮左侧，常用于面包屑、环境标识与用户信息。
      </p>
    </ProLayout>
  </NConfigProvider>
</template>