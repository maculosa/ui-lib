<script setup lang="ts">
import { ref, inject } from 'vue'

const isDark = inject('isDark', ref(false))
</script>

<template>
  <div class="relative w-full min-h-screen overflow-hidden" :class="{ dark: isDark }">
    <div class="fluid-background">
      <div class="fluid-blob"></div>
      <div class="fluid-blob"></div>
      <div class="fluid-blob"></div>
      <div class="fluid-blob"></div>
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.fluid-background {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: -1;
  filter: blur(80px);
  opacity: 0.7;
  animation:
    float 20s ease-in-out infinite,
    gradient 15s ease infinite;
}

.fluid-blob {
  position: absolute;
  width: 1200px;
  height: 1000px;
  border-radius: 50%;
  mix-blend-mode: screen;
  animation: float 20s ease-in-out infinite;
  transition: all 0.5s ease;
  background: linear-gradient(
    45deg,
    rgba(255, 182, 193, 0.7),
    rgba(176, 255, 209, 0.6),
    rgba(176, 224, 255, 0.5),
    rgba(255, 218, 185, 0.6)
  );
  background-size: 400% 400%;
  animation:
    float 20s ease-in-out infinite,
    gradient 15s ease infinite;
}

.fluid-blob:nth-child(1) {
  animation-delay:
    0s,
    -2s;
  scale: 1.2;
  left: 60%;
  top: 20%;
}

.fluid-blob:nth-child(2) {
  animation-delay:
    -5s,
    -6s;
  scale: 1;
  left: 20%;
  top: 10%;
}

.fluid-blob:nth-child(3) {
  animation-delay:
    -10s,
    -4s;
  scale: 0.8;
  left: 40%;
  top: 50%;
}

.fluid-blob:nth-child(4) {
  animation-delay:
    -8s,
    -8s;
  scale: 0.9;
  left: 70%;
  top: 60%;
}

@keyframes gradient {
  0% {
    background-position: -10% 50%;
    transform: rotate(0deg);
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
    transform: rotate(360deg);
  }
}

/* 暗色模式 */
.dark .fluid-blob {
  background: linear-gradient(
    45deg,
    rgba(255, 182, 193, 0.3),
    rgba(176, 255, 209, 0.2),
    rgba(176, 224, 255, 0.2),
    rgba(255, 218, 185, 0.2)
  );
  background-size: 400% 400%;
}

.dark .fluid-background {
  opacity: 0.5;
  mix-blend-mode: screen;
}
</style>
