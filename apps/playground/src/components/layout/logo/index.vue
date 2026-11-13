<script setup lang="ts">
withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })
</script>

<template>
  <RouterLink to="/" class="bm-logo" aria-label="Banmao UI 首页">
    <svg class="bm-logo-mark" viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#f04e23" />
      <path
        d="M14 27 L17.5 12 L27 20.5 Q32 18 37 20.5 L46.5 12 L50 27 Q52 31.5 52 36 Q52 50.5 32 50.5 Q12 50.5 12 36 Q12 31.5 14 27 Z"
        fill="#fbfaf6"
      />
      <path
        d="M26 22.5 L27.6 27.5 M32 21.5 L32 27.5 M38 22.5 L36.4 27.5"
        stroke="#f04e23"
        stroke-width="2.6"
        stroke-linecap="round"
      />
      <circle cx="24" cy="34" r="3.1" fill="#1c1a15" />
      <circle cx="40" cy="34" r="3.1" fill="#1c1a15" />
      <path
        d="M28.5 41.5 Q32 44.5 35.5 41.5"
        stroke="#1c1a15"
        stroke-width="2.2"
        fill="none"
        stroke-linecap="round"
      />
    </svg>
    <span class="bm-logo-word">
      <span class="bm-logo-name">Banmao<em>UI</em></span>
      <span v-if="!compact" class="bm-logo-sub">组件工坊 · ATELIER</span>
    </span>
  </RouterLink>
</template>

<style scoped>
.bm-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
}
.bm-logo-mark {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  transition: transform 0.35s cubic-bezier(0.19, 1, 0.22, 1);
}
.bm-logo:hover .bm-logo-mark {
  transform: rotate(-6deg) scale(1.05);
}
.bm-logo-word {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}
.bm-logo-name {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--color-foreground);
}
.bm-logo-name em {
  font-style: normal;
  color: var(--color-primary);
  margin-left: 2px;
}
.bm-logo-sub {
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.16em;
  color: var(--color-foreground-tertiary);
  text-transform: uppercase;
}
</style>