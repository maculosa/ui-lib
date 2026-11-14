<script setup lang="tsx">
import { computed, ref } from 'vue'
import { ProLayout } from '@banmao/procomponent'
import { NConfigProvider, NSpace, NSwitch, darkTheme } from 'naive-ui'
import { Icon } from '@iconify/vue'

const layoutTheme = {
  common: { textColor1: '#fafafa', textColor2: '#d4d4d8', textColor3: '#a1a1aa' },
}

const menus = Array.from({ length: 10 }, (_, i) => ({
  label: `业务模块 ${i + 1}`,
  key: `/module-${i + 1}`,
  icon: () => <Icon icon="hugeicons:folder-01" />,
}))

const responsive = ref(true)
const menuConfig = computed(() => ({ responsive: responsive.value }))
</script>

<template>
  <NSpace align="center" class="mb-3" :size="6">
    <span class="text-xs opacity-70">menu.responsive</span>
    <NSwitch v-model:value="responsive" size="small" />
    <span class="text-xs opacity-70">{{ responsive ? '放不下的收进「更多」' : '关闭后直接溢出' }}</span>
  </NSpace>

  <NConfigProvider abstract :theme="darkTheme" :theme-overrides="layoutTheme">
    <ProLayout
      layout="top"
      title="横排菜单收纳"
      :menus="menus"
      :menu="menuConfig"
      :style="{ height: '340px' }"
    >
      <p class="text-sm opacity-70">
        layout="top" 下菜单横排在顶栏。开启 menu.responsive 后，NMenu 会按可用宽度把放不下的项收进末尾的「更多」子菜单。
      </p>
      <p class="mt-2 text-sm opacity-70">
        该属性只作用于横排菜单，侧栏菜单不受影响。
      </p>
    </ProLayout>
  </NConfigProvider>
</template>