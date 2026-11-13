<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { mirroredPaths } from '@/config'
import { locale, t, toLocalePath } from '@/locales'

defineOptions({ name: 'SwitchLocale' })

const route = useRoute()
const router = useRouter()

function switchLocale() {
  const target = locale.value === 'zh' ? 'en' : 'zh'
  const canonical = toLocalePath(route.path, 'zh')
  locale.value = target
  // Vue 页面同址双语，只有 markdown 镜像页需要换路径
  if (!mirroredPaths.has(canonical)) return
  const next = toLocalePath(route.path, target)
  if (next !== route.path) router.push({ path: next, hash: route.hash })
}
</script>

<template>
  <button
    type="button"
    class="bm-locale-btn"
    :aria-label="t('common.langSwitch')"
    :title="t('common.langSwitch')"
    @click="switchLocale"
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M3.2 9.5h17.6M3.2 14.5h17.6" />
      <path d="M12 3c2.4 2.4 3.6 5.4 3.6 9s-1.2 6.6-3.6 9c-2.4-2.4-3.6-5.4-3.6-9S9.6 5.4 12 3Z" />
    </svg>
    <span class="bm-locale-text">{{ locale === 'zh' ? 'EN' : '中' }}</span>
  </button>
</template>

<style scoped>
.bm-locale-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 36px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid var(--color-divider);
  background: var(--color-surface);
  color: var(--color-foreground-secondary);
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
}
.bm-locale-btn:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background: var(--color-hover);
}
.bm-locale-btn:active {
  transform: scale(0.94);
}
.bm-locale-btn svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
.bm-locale-text {
  font-family: var(--font-mono);
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.04em;
}
</style>