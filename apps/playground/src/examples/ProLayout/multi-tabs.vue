<script setup lang="tsx">
import { computed, ref } from 'vue'
import { ProLayout, ProTabs } from '@banmao/procomponent'
import type { MenuOption } from 'naive-ui'
import { NConfigProvider, NEmpty, darkTheme } from 'naive-ui'
import { Icon } from '@iconify/vue'

const layoutTheme = {
  common: { textColor1: '#fafafa', textColor2: '#d4d4d8', textColor3: '#a1a1aa' },
}

const renderIcon = (icon: string) => () => <Icon icon={icon} />

const menus: MenuOption[] = [
  { label: '首页', key: '/home', icon: renderIcon('hugeicons:home-01') },
  { label: '表格', key: '/table', icon: renderIcon('hugeicons:table-01') },
  { label: '图表', key: '/chart', icon: renderIcon('hugeicons:chart-01') },
  { label: '用户管理', key: '/user', icon: renderIcon('hugeicons:settings-02') },
]

const pages: Record<string, string> = {
  '/home': '首页概览：这里放指标卡与快捷入口。',
  '/table': '表格页：这里放 ProTable。',
  '/chart': '图表页：这里放 DataV 图表。',
  '/user': '用户管理页：这里放用户列表与权限配置。',
}

const tabs = ref([{ label: '首页', key: '/home' }])
const active = ref('/home')

const content = computed(() => pages[active.value] ?? '')

function openTab(key: string | number, item: MenuOption) {
  const tabKey = String(key)
  if (!tabs.value.some(tab => tab.key === tabKey)) {
    tabs.value = [...tabs.value, { label: String(item.label ?? tabKey), key: tabKey }]
  }
  active.value = tabKey
}

function closeTab(key: string) {
  const index = tabs.value.findIndex(tab => tab.key === key)
  if (index === -1) return
  const next = tabs.value.filter(tab => tab.key !== key)
  tabs.value = next
  if (active.value !== key) return
  active.value = next[Math.min(index, next.length - 1)]?.key ?? ''
}
</script>

<template>
  <NConfigProvider abstract :theme="darkTheme" :theme-overrides="layoutTheme">
    <ProLayout
      :menus="menus"
      :menu-value="active"
      title="多标签页"
      :style="{ height: '460px' }"
      content-class="p-0"
      @menu-click="openTab"
    >
      <div class="h-full flex flex-col min-h-0">
        <div class="px-3 pt-3">
          <ProTabs
            v-model:active="active"
            :options="tabs"
            closable
            inset
            @close="closeTab"
          />
        </div>
        <div class="flex-1 min-h-0 overflow-auto p-4">
          <NEmpty v-if="!active" description="所有页签都已关闭，点左侧菜单重新打开" />
          <template v-else>
            <h3 class="text-base font-semibold">{{ tabs.find(t => t.key === active)?.label }}</h3>
            <p class="mt-2 text-sm opacity-70">{{ content }}</p>
            <p class="mt-3 font-mono text-xs opacity-70">active = {{ active }}</p>
          </template>
        </div>
      </div>
    </ProLayout>
  </NConfigProvider>
</template>