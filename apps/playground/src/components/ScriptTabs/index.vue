<script setup lang="ts">
import { computed, ref } from 'vue'
import { useClipboard } from '@vueuse/core'
import { useMessage } from 'naive-ui'
import { t } from '@/locales'

const props = defineProps<{ pkg: string }>()

const managers = [
  { name: 'pnpm', cmd: (p: string) => `pnpm add ${p}` },
  { name: 'npm', cmd: (p: string) => `npm install ${p}` },
  { name: 'yarn', cmd: (p: string) => `yarn add ${p}` },
  { name: 'bun', cmd: (p: string) => `bun add ${p}` },
]

const active = ref('pnpm')
const command = computed(() => managers.find(m => m.name === active.value)!.cmd(props.pkg))

const { copy } = useClipboard()
const message = useMessage()
const copied = ref(false)

async function copyCommand() {
  await copy(command.value)
  copied.value = true
  message.success(t('common.installCopied'))
  setTimeout(() => {
    copied.value = false
  }, 1800)
}
</script>

<template>
  <div class="script-tabs">
    <div class="script-tabs-bar" role="tablist" :aria-label="t('common.pkgManager')">
      <button
        v-for="m in managers"
        :key="m.name"
        type="button"
        role="tab"
        :aria-selected="active === m.name"
        class="script-tab"
        :class="{ active: active === m.name }"
        @click="active = m.name"
      >
        {{ m.name }}
      </button>
      <button type="button" class="script-copy" :title="copied ? t('common.copied') : t('common.copyCommand')" @click="copyCommand">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <template v-if="!copied">
            <rect x="9" y="9" width="12" height="12" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </template>
          <path v-else d="M4 12.5 9.5 18 20 6.5" />
        </svg>
      </button>
    </div>
    <div class="script-cmd">
      <span class="script-prompt">$</span>
      <code>{{ command }}</code>
    </div>
  </div>
</template>

<style scoped>
.script-tabs {
  border-radius: 12px;
  overflow: hidden;
  background: var(--bm-code-bg);
  border: 1px solid var(--bm-code-divider);
}
.script-tabs-bar {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 8px 10px;
  border-bottom: 1px solid var(--bm-code-divider);
}
.script-tab {
  padding: 5px 14px;
  border: none;
  border-radius: 6px;
  background: transparent;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--bm-code-muted);
  cursor: pointer;
  transition: color 0.2s ease, background-color 0.2s ease;
}
.script-tab:hover {
  color: #e8e4d8;
}
.script-tab.active {
  color: #fbfaf6;
  background: rgba(240, 78, 35, 0.22);
}
.script-copy {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--bm-code-muted);
  cursor: pointer;
  transition: color 0.2s ease, background-color 0.2s ease;
}
.script-copy:hover {
  color: #ff6a3d;
  background: rgba(240, 78, 35, 0.14);
}
.script-copy svg {
  width: 15px;
  height: 15px;
}
.script-cmd {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 18px;
  font-family: var(--font-mono);
  font-size: 13.5px;
  color: #e8e4d8;
  overflow-x: auto;
}
.script-prompt {
  color: #ff6a3d;
  user-select: none;
}
.script-cmd code {
  font-family: inherit;
  white-space: nowrap;
}
</style>