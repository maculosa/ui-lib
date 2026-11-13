<script setup lang="ts">
import { inject, type Ref } from 'vue'

defineOptions({ name: 'SwitchTheme' })

const isDark = inject<Ref<boolean>>('isDark')
const toggleTheme = inject<() => void>('toggleTheme')
</script>

<template>
  <button
    type="button"
    class="bm-theme-btn"
    :aria-label="isDark ? '切换到亮色模式' : '切换到暗色模式'"
    :title="isDark ? '亮色模式' : '暗色模式'"
    @click="toggleTheme?.()"
  >
    <Transition name="bm-theme-icon" mode="out-in">
      <svg
        v-if="isDark"
        key="sun"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
      >
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3l1.7 1.7M17 17l1.7 1.7M18.7 5.3L17 7M7 17l-1.7 1.7" />
      </svg>
      <svg
        v-else
        key="moon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M20.2 14.5A8.5 8.5 0 0 1 9.5 3.8a8.5 8.5 0 1 0 10.7 10.7Z" />
      </svg>
    </Transition>
  </button>
</template>

<style scoped>
.bm-theme-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--color-divider);
  background: var(--color-surface);
  color: var(--color-foreground-secondary);
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
}
.bm-theme-btn:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background: var(--color-hover);
}
.bm-theme-btn:active {
  transform: scale(0.94);
}
.bm-theme-btn svg {
  width: 17px;
  height: 17px;
}
.bm-theme-icon-enter-active,
.bm-theme-icon-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.bm-theme-icon-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.6);
}
.bm-theme-icon-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.6);
}
</style>