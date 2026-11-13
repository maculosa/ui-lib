<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMessage } from 'naive-ui'
import { useClipboard } from '@vueuse/core'
import 'highlight.js/lib/common'
import hljsVuePlugin from '@highlightjs/vue-plugin'
import { t } from '@/locales'

const highlightjs = hljsVuePlugin.component
const message = useMessage()

const { code, language = 'xml' } = defineProps<{
  code: string
  language?: string
}>()

const codeRaw = computed(() => code || '')
const langLabel = computed(() => (language === 'xml' ? 'vue' : language))

const { copy } = useClipboard()
const copied = ref(false)

async function copyCode() {
  await copy(codeRaw.value)
  copied.value = true
  message.success(t('common.codeCopied'))
  setTimeout(() => {
    copied.value = false
  }, 1800)
}
</script>

<template>
  <div class="code-preview">
    <div class="code-preview-bar">
      <span class="code-preview-lang">{{ langLabel }}</span>
      <button type="button" class="code-preview-copy" :title="copied ? t('common.copied') : t('common.copyCode')" @click="copyCode">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <template v-if="!copied">
            <rect x="9" y="9" width="12" height="12" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </template>
          <path v-else d="M4 12.5 9.5 18 20 6.5" />
        </svg>
        <span>{{ copied ? t('common.copied') : t('common.copy') }}</span>
      </button>
    </div>
    <div class="code-preview-body">
      <highlightjs :language="language" :code="codeRaw" class="code-preview-hljs" />
    </div>
  </div>
</template>

<style scoped>
.code-preview {
  background: var(--bm-code-bg);
  border-top: 1px solid var(--bm-code-divider);
}
.code-preview-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  border-bottom: 1px solid var(--bm-code-divider);
}
.code-preview-lang {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--bm-code-muted);
}
.code-preview-copy {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border: none;
  border-radius: 6px;
  background: transparent;
  font-family: var(--font-sans);
  font-size: 12px;
  color: #b5b1a2;
  cursor: pointer;
  transition: color 0.2s ease, background-color 0.2s ease;
}
.code-preview-copy:hover {
  color: #ff6a3d;
  background: rgba(240, 78, 35, 0.14);
}
.code-preview-copy svg {
  width: 14px;
  height: 14px;
}
.code-preview-body {
  overflow: auto;
  max-height: 420px;
}
.code-preview-body :deep(pre) {
  margin: 0;
  padding: 16px;
  background: transparent;
  border: none;
  border-radius: 0;
  box-shadow: none;
}
.code-preview-body :deep(code) {
  font-family: var(--font-mono);
  font-size: 12.5px;
  line-height: 1.7;
  background: transparent;
  padding: 0;
  color: var(--bm-code-fg);
}
.code-preview-body :deep(.hljs) {
  background: transparent;
  color: var(--bm-code-fg);
}
</style>