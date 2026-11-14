<script setup lang="tsx">
import { ref } from 'vue'
import { ProLayout } from '@banmao/procomponent'
import { NButton, NConfigProvider, NSpace, darkTheme } from 'naive-ui'
import { Icon } from '@iconify/vue'

const layoutTheme = {
  common: { textColor1: '#fafafa', textColor2: '#d4d4d8', textColor3: '#a1a1aa' },
}

const renderIcon = (icon: string) => () => <Icon icon={icon} />

const menus = [
  { label: '首页', key: '/home', icon: renderIcon('hugeicons:home-01') },
  { label: '表格', key: '/table', icon: renderIcon('hugeicons:table-01') },
  { label: '图表', key: '/chart', icon: renderIcon('hugeicons:chart-01') },
  { label: '文件管理', key: '/file', icon: renderIcon('hugeicons:file-01') },
]

const collapsed = ref(false)
const logs = ref<string[]>([])
const layoutRef = ref<InstanceType<typeof ProLayout> | null>(null)

function handleCollapseChange(value: boolean) {
  collapsed.value = value
  logs.value = [`collapseChange → ${value}`, ...logs.value].slice(0, 3)
}
</script>

<template>
  <NSpace align="center" class="mb-3" :size="8">
    <NButton size="small" @click="collapsed = !collapsed">
      外部切换折叠
    </NButton>
    <NButton size="small" @click="layoutRef?.setCollapsed(true)">
      expose: 折叠
    </NButton>
    <NButton size="small" @click="layoutRef?.setCollapsed(false)">
      expose: 展开
    </NButton>
    <NButton size="small" @click="layoutRef?.toggleCollapsed()">
      expose: 翻转
    </NButton>
    <span class="text-xs opacity-70">collapsed = {{ collapsed }}</span>
  </NSpace>

  <!-- 只把 ProLayout 包进暗色 Provider，外部控件仍跟随站点主题 -->
  <NConfigProvider abstract :theme="darkTheme" :theme-overrides="layoutTheme">
    <ProLayout
      ref="layoutRef"
      title="折叠控制"
      :menus="menus"
      :collapsed="collapsed"
      :style="{ height: '340px' }"
      @collapse-change="handleCollapseChange"
    >
      <p class="text-sm opacity-70">
        折叠按钮、collapsed 属性与 expose 的 setCollapsed / toggleCollapsed 都会抛出 collapseChange，外部据此回写即可保持同步。
      </p>
      <ul class="mt-3 space-y-1 font-mono text-xs">
        <li v-for="(log, i) in logs" :key="i">
          {{ log }}
        </li>
      </ul>
    </ProLayout>
  </NConfigProvider>
</template>