<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const props = defineProps<{
  src: string
  alt?: string
}>()

const imgRef = ref<HTMLElement | null>(null)
const isLoaded = ref(false)
const isInView = ref(false)

onMounted(() => {
  if (!imgRef.value) return

  const { stop } = useIntersectionObserver(
    imgRef,
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        isInView.value = true
        const target = imgRef.value as unknown as { src: string }
        target.src = props.src
        stop()
      }
    },
    { threshold: 0.1 }
  )
})
</script>

<template>
  <img
    ref="imgRef"
    :alt="alt"
    class="eco-image opacity-0 transition-opacity duration-300"
    :class="{ 'opacity-100': isLoaded }"
    @load="isLoaded = true"
  />
</template>


