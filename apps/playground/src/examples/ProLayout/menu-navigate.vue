<script setup lang="tsx">
import { computed, ref } from 'vue'
import { ProLayout } from '@banmao/procomponent'
import { NConfigProvider, darkTheme } from 'naive-ui'
import { Icon } from '@iconify/vue'

const layoutTheme = {
  common: { textColor1: '#fafafa', textColor2: '#d4d4d8', textColor3: '#a1a1aa' },
}

const active = ref<string | number>('/home')

const pages: Record<string, { title: string, desc: string }> = {
  '/home': { title: '首页', desc: '这里是首页概览。' },
  '/list': { title: '列表', desc: '这里是列表页。' },
  '/table': { title: '表格', desc: '这里是表格页。' },
}

const page = computed(() => pages[String(active.value)])

const menus = [
  { key: '/home', label: '首页', icon: () => <Icon icon="hugeicons:home-01" /> },
  { key: '/list', label: '列表', icon: () => <Icon icon="hugeicons:left-to-right-list-dash" /> },
  { key: '/table', label: '表格', icon: () => <Icon icon="hugeicons:table-01" /> },
]
</script>

<template>
  <NConfigProvider abstract :theme="darkTheme" :theme-overrides="layoutTheme">
    <ProLayout
      v-model:menu-value="active"
      title="菜单联动"
      :menus="menus"
      :style="{ height: '340px' }"
    >
      <template #header-extra>
        <span class="ml-6 text-sm text-white/60">当前页面：{{ page.title }}</span>
      </template>

      <h3 class="text-base font-semibold">
        {{ page.title }}
      </h3>
      <p class="mt-2 text-sm opacity-70">
        {{ page.desc }}
      </p>
      <p class="mt-4 font-mono text-xs opacity-50">
        active = {{ active }}
      </p>
      <p class="mt-2 text-xs opacity-50">
        选中态由 menuValue 持有，点击菜单经 update:menuValue 回写，内容区随之切换。
      </p>
    </ProLayout>
  </NConfigProvider>
</template>