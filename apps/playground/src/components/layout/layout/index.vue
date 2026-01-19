<script setup lang="ts">
import { ref, inject } from 'vue'

const isDark = inject('isDark', ref(false))
</script>

<template>
  <div class="relative w-full min-h-screen overflow-hidden" :class="{ dark: isDark }">
    <div class="fixed inset-0 -z-10 blur-[80px] opacity-70 animate-[float_20s_ease-in-out_infinite,gradient_15s_ease_infinite]">
      <div
        class="fluid-blob absolute w-[1200px] h-[1000px] rounded-full mix-blend-screen animate-[float_20s_ease-in-out_infinite] transition-all duration-500 bg-gradient-to-br from-pink-300/70 from-10% via-emerald-300/60 via-50% via-sky-300/50 to-orange-200/60 to-90% bg-[length:400%_400%]"
        style="animation-delay: 0s, -2s; scale: 1.2; left: 60%; top: 20%"
      ></div>
      <div
        class="fluid-blob absolute w-[1200px] h-[1000px] rounded-full mix-blend-screen animate-[float_20s_ease-in-out_infinite] transition-all duration-500 bg-gradient-to-br from-pink-300/70 from-10% via-emerald-300/60 via-50% via-sky-300/50 to-orange-200/60 to-90% bg-[length:400%_400%]"
        style="animation-delay: -5s, -6s; scale: 1; left: 20%; top: 10%"
      ></div>
      <div
        class="fluid-blob absolute w-[1200px] h-[1000px] rounded-full mix-blend-screen animate-[float_20s_ease-in-out_infinite] transition-all duration-500 bg-gradient-to-br from-pink-300/70 from-10% via-emerald-300/60 via-50% via-sky-300/50 to-orange-200/60 to-90% bg-[length:400%_400%]"
        style="animation-delay: -10s, -4s; scale: 0.8; left: 40%; top: 50%"
      ></div>
      <div
        class="fluid-blob absolute w-[1200px] h-[1000px] rounded-full mix-blend-screen animate-[float_20s_ease-in-out_infinite] transition-all duration-500 bg-gradient-to-br from-pink-300/70 from-10% via-emerald-300/60 via-50% via-sky-300/50 to-orange-200/60 to-90% bg-[length:400%_400%]"
        style="animation-delay: -8s, -8s; scale: 0.9; left: 70%; top: 60%"
      ></div>
    </div>
    <div class="relative z-10">
      <slot />
    </div>
  </div>
</template>

<style scoped>
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
</style>
