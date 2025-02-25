<template>
  <div class="demo-warp">
    <div class="demo-header">
      <div class="demo-header-left">
        <span class="demo-title">{{ title }}</span>
        <span v-if="desc" class="demo-desc">{{ desc }}</span>
      </div>
      <div class="demo-header-right">
        <n-tooltip trigger="hover">
          <template #trigger>
            <Icon icon="carbon:code" width="20" height="20" class="outline-none p-1 rounded-1 text-[#9ca3af] hover:text-[#3b82f6] hover:bg-[#3b82f6]/10 active:text-[#3b82f6] cursor-pointer transition-all transition-delay-200 ease" :class="{ 'active': visible }"
              @click="toggle()" />
          </template>
          查看代码
        </n-tooltip>
      </div>
    </div>

    <div class="demo-content">
      <slot />
    </div>

    <n-collapse-transition>
      <CodePreview v-show="visible" :code="raw" />
    </n-collapse-transition>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { useToggle } from '@vueuse/core'
import { NTooltip, NCollapseTransition } from 'naive-ui'
import { Icon } from '@iconify/vue'


export interface DemoProps {
  title: string
  desc?: string,
  url?: string,
  raw?: string
}

const props = defineProps<DemoProps>()
const { title, desc, raw } = toRefs(props)
const [visible, toggle] = useToggle(false)
</script>

<style scoped lang="scss">
.demo-warp {
  margin: 16px 0;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
}

.demo-header {
  padding: 12px 24px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;

  &-left {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
}

.demo-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.demo-desc {
  font-size: 14px;
  color: #6b7280;
}

.demo-content {
  padding: 24px;
  background: #f7f5f5;
}

</style>
