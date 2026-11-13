<script setup lang="ts">
import { computed } from 'vue'
import { t } from '@/locales'
import { openSearch } from '@/hooks/useSearch'

withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })

const isApple = computed(() => /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent))
const shortcut = computed(() => (isApple.value ? '⌘K' : 'Ctrl K'))
</script>

<template>
  <button
    type="button"
    class="bm-search-trigger"
    :class="{ compact }"
    :aria-label="t('common.searchOpen')"
    :title="`${t('common.searchOpen')} (${shortcut})`"
    @click="openSearch"
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-3.8-3.8" />
    </svg>
    <span v-if="!compact" class="bm-search-trigger-text">{{ t('common.searchHint') }}</span>
    <kbd v-if="!compact" class="bm-search-trigger-kbd">{{ shortcut }}</kbd>
  </button>
</template>

<style scoped>
.bm-search-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid var(--color-divider);
  background: var(--color-surface);
  color: var(--color-foreground-tertiary);
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}
.bm-search-trigger:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background: var(--color-hover);
}
.bm-search-trigger svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
.bm-search-trigger-text {
  font-size: 13px;
}
.bm-search-trigger-kbd {
  padding: 2px 6px;
  border: 1px solid var(--color-divider);
  border-radius: 5px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.04em;
}
.bm-search-trigger.compact {
  width: 36px;
  padding: 0;
  justify-content: center;
}
</style>