<script setup lang="tsx">
import { computed, ref } from 'vue'
import { ProLayout } from '@banmao/procomponent'
import type { ProLayoutInstance } from '@banmao/procomponent'
import type { MenuOption } from 'naive-ui'
import { NButton, NConfigProvider, NInput, NSpace, darkTheme } from 'naive-ui'
import { Icon } from '@iconify/vue'

const layoutTheme = {
  common: { textColor1: '#fafafa', textColor2: '#d4d4d8', textColor3: '#a1a1aa' },
}

const renderIcon = (icon: string) => () => <Icon icon={icon} />

const allMenus: MenuOption[] = [
  { label: '首页', key: '/home', icon: renderIcon('hugeicons:home-01') },
  { label: '表格', key: '/table', icon: renderIcon('hugeicons:table-01') },
  { label: '图表', key: '/chart', icon: renderIcon('hugeicons:chart-01') },
  { label: '文件管理', key: '/file', icon: renderIcon('hugeicons:file-01') },
  { label: '系统设置', key: '/system', icon: renderIcon('hugeicons:settings-02') },
]

const keyword = ref('')
const requestCount = ref(0)
const lastParams = ref('{}')
const loadingLog = ref<string[]>([])
const layoutRef = ref<ProLayoutInstance | null>(null)

const menuConfig = computed(() => ({
  params: { keyword: keyword.value },
  request: async (params: Record<string, any>) => {
    requestCount.value += 1
    lastParams.value = JSON.stringify(params)
    await new Promise(resolve => setTimeout(resolve, 800))
    const kw = String(params.keyword ?? '').trim()
    return kw ? allMenus.filter(item => String(item.label).includes(kw)) : allMenus
  },
  onLoadingChange: (loading: boolean) => {
    loadingLog.value = [`onLoadingChange → ${loading}`, ...loadingLog.value].slice(0, 4)
  },
}))
</script>

<template>
  <NSpace align="center" class="mb-3" :size="8">
    <NInput
      v-model:value="keyword"
      size="small"
      placeholder="输入关键词，如「表格」"
      class="w-52"
      clearable
    />
    <NButton size="small" @click="layoutRef?.reloadMenus()">
      expose: reloadMenus()
    </NButton>
    <span class="text-xs opacity-70">请求次数 {{ requestCount }}</span>
  </NSpace>

  <NConfigProvider abstract :theme="darkTheme" :theme-overrides="layoutTheme">
    <ProLayout
      ref="layoutRef"
      title="菜单查询参数"
      :menu="menuConfig"
      :style="{ height: '420px' }"
    >
      <p class="text-sm opacity-70">
        menu.params 变化（含就地修改）会重新调用 request，参数原样传给请求函数；也可以调用 expose 的 reloadMenus() 主动重新拉取。
      </p>
      <p class="mt-2 font-mono text-xs opacity-70">
        最近一次 params：{{ lastParams }}
      </p>
      <ul class="mt-3 space-y-1 font-mono text-xs opacity-70">
        <li v-for="(log, i) in loadingLog" :key="i">
          {{ log }}
        </li>
      </ul>
    </ProLayout>
  </NConfigProvider>
</template>