<script setup lang="ts"></script>

<template>
  <div class="bm-shell">
    <div class="bm-shell-bg bm-grid-paper" aria-hidden="true"></div>
    <div class="bm-shell-glow" aria-hidden="true"></div>
    <div class="bm-shell-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.bm-shell {
  position: relative;
  width: 100%;
  min-height: 100svh;
}
.bm-shell-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
.bm-shell-glow {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 520px;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(58% 46% at 50% 0%, color-mix(in srgb, var(--color-primary) 8%, transparent), transparent 72%);
}
.bm-shell-content {
  position: relative;
  z-index: 1;
}
</style>