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
            <Icon icon="carbon:code" width="20" height="20" class="demo-action-icon" :class="{ 'active': visible }"
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
      <div v-show="visible" class="demo-code">
        <div class="demo-code-header">
          <span>示例代码</span>
          <n-tooltip trigger="hover">
            <template #trigger>
              <Icon icon="carbon:copy" width="18" height="18" class="demo-action-icon" @click="copyCode" />
            </template>
            复制代码
          </n-tooltip>
        </div>
        <n-scrollbar style="max-height: 600px">
          <highlightjs language="xml" :code="codeRaw" class="demo-code-content" />
        </n-scrollbar>
      </div>
    </n-collapse-transition>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { useToggle, useClipboard } from '@vueuse/core'
import { NTooltip, NCollapseTransition, useMessage } from 'naive-ui'
import 'highlight.js/lib/common'
import 'highlight.js/styles/atom-one-dark.css'
import hljsVuePlugin from '@highlightjs/vue-plugin';
import { Icon } from '@iconify/vue'

const highlightjs = hljsVuePlugin.component
const message = useMessage()

export interface DemoProps {
  title: string
  desc?: string,
  url?: string,
  raw?: string
}

const props = defineProps<DemoProps>()
const { title, desc, raw } = toRefs(props)
const [visible, toggle] = useToggle(false)

const codeRaw = computed(() => raw.value || '')

const { copy } = useClipboard()
const copyCode = async () => {
  await copy(codeRaw.value)
  message.success('复制成功')
}


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

.demo-code {
  border-top: 1px dashed #e5e7eb;
  background: #282c34;

  &-header {
    padding: 8px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #e5e7eb;
    font-size: 14px;
    background: #21252b;
  }
  &-content {
    padding: 16px;
    margin: 0;
    overflow-x: auto;

    :deep(pre) {
      margin: 0;
      background: transparent;
    }
  }
}

.demo-action-icon {
  cursor: pointer;
  color: #9ca3af;
  transition: all 0.2s ease;
  padding: 4px;
  border-radius: 4px;

  &:hover {
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
  }

  &.active {
    color: #3b82f6;
  }
}

</style>
