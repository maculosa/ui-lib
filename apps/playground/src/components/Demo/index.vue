<script setup lang="ts">
import { ref } from 'vue'
import { NCollapseTransition, useMessage } from 'naive-ui'
import { useClipboard } from '@vueuse/core'
import CodePreview from '@/components/CodePreview/index.vue'

export interface DemoProps {
  title?: string
  desc?: string
  url?: string
  raw?: string
}

const props = defineProps<DemoProps>()
const message = useMessage()
const visible = ref(false)
const copied = ref(false)
const { copy } = useClipboard()
let copyTimer = 0

async function copyRaw() {
  if (!props.raw) return
  try {
    await copy(props.raw)
    copied.value = true
    message.success('示例代码已复制')
    window.clearTimeout(copyTimer)
    copyTimer = window.setTimeout(() => (copied.value = false), 1800)
  } catch {
    message.error('复制失败，请手动选择代码复制')
  }
}

function openInNewTab() {
  if (props.url) window.open(props.url, '_blank', 'noopener')
}
</script>

<template>
  <section class="bm-demo">
    <header class="bm-demo-head">
      <div class="bm-demo-meta">
        <h4 :id="title" class="bm-demo-title">{{ title }}</h4>
        <p v-if="desc" class="bm-demo-desc">{{ desc }}</p>
      </div>
      <div class="bm-demo-actions">
        <button
          v-if="url"
          type="button"
          class="bm-demo-btn"
          title="在新窗口打开"
          aria-label="在新窗口打开"
          @click="openInNewTab"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
          </svg>
        </button>
        <button
          v-if="raw"
          type="button"
          class="bm-demo-btn"
          :title="copied ? '已复制' : '复制代码'"
          aria-label="复制代码"
          @click="copyRaw"
        >
          <svg v-if="!copied" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4.5 12.5l5 5 10-11" />
          </svg>
        </button>
        <button
          v-if="raw"
          type="button"
          class="bm-demo-btn bm-demo-code-btn"
          :class="{ 'is-active': visible }"
          :aria-expanded="visible"
          @click="visible = !visible"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 6l-6 6 6 6M16 6l6 6-6 6" />
          </svg>
          <span>{{ visible ? '收起代码' : '代码' }}</span>
        </button>
      </div>
    </header>

    <div v-if="!url" class="bm-demo-preview bm-dot-grid">
      <slot />
    </div>

    <div v-else class="bm-demo-frame">
      <div class="bm-demo-frame-bar">
        <span class="bm-demo-dots" aria-hidden="true"><i /><i /><i /></span>
        <span class="bm-demo-frame-url">{{ url }}</span>
      </div>
      <iframe :src="url" :title="title || '示例预览'" loading="lazy" />
    </div>

    <NCollapseTransition :show="visible">
      <div v-if="raw" class="bm-demo-code">
        <CodePreview :code="raw" />
      </div>
    </NCollapseTransition>
  </section>
</template>

<style scoped>
.bm-demo {
  margin: 28px 0;
  border: 1px solid var(--color-divider);
  border-radius: 14px;
  background: var(--color-surface);
  overflow: hidden;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.bm-demo:hover {
  border-color: color-mix(in srgb, var(--color-primary) 32%, var(--color-divider));
  box-shadow: 0 12px 40px var(--color-shadow);
}

.bm-demo-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px dashed var(--color-divider);
}

.bm-demo-title {
  margin: 0;
  font-size: 15.5px;
  font-weight: 600;
  line-height: 1.5;
  color: var(--color-foreground);
  scroll-margin-top: 90px;
}

.bm-demo-desc {
  margin: 4px 0 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--color-foreground-tertiary);
}

.bm-demo-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.bm-demo-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 32px;
  min-width: 32px;
  padding: 0 8px;
  border: 1px solid var(--color-divider);
  border-radius: 8px;
  background: transparent;
  color: var(--color-foreground-secondary);
  font-size: 12.5px;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}
.bm-demo-btn:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 8%, transparent);
}
.bm-demo-btn.is-active {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
}
.bm-demo-btn svg {
  width: 15px;
  height: 15px;
}
.bm-demo-code-btn {
  padding: 0 12px;
  font-family: var(--font-mono);
}

.bm-demo-preview {
  padding: 24px;
  background-color: var(--color-background-secondary);
}

.bm-demo-frame-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: var(--color-fill);
  border-bottom: 1px solid var(--color-divider);
}
.bm-demo-dots {
  display: inline-flex;
  gap: 5px;
}
.bm-demo-dots i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.bm-demo-dots i:nth-child(1) {
  background: var(--color-primary);
}
.bm-demo-dots i:nth-child(2) {
  background: var(--color-amber);
}
.bm-demo-dots i:nth-child(3) {
  background: var(--color-acid);
}
.bm-demo-frame-url {
  flex: 1;
  min-width: 0;
  padding: 3px 12px;
  border: 1px solid var(--color-divider);
  border-radius: 999px;
  background: var(--color-surface);
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--color-foreground-tertiary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bm-demo-frame iframe {
  display: block;
  width: 100%;
  height: 600px;
  border: 0;
  background: #fff;
}

.bm-demo-code {
  border-top: 1px solid var(--color-divider);
}
.bm-demo-code :deep(.code-preview) {
  border: none;
  border-radius: 0;
}

@media (max-width: 640px) {
  .bm-demo-head {
    flex-direction: column;
    gap: 12px;
  }
  .bm-demo-preview {
    padding: 16px;
  }
  .bm-demo-frame iframe {
    height: 480px;
  }
}
</style>
