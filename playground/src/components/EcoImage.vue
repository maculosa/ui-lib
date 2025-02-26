<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const props = defineProps<{
  src: string
  alt?: string
}>()

const imgRef = ref<HTMLImageElement>()
const isLoaded = ref(false)
const isInView = ref(false)

// 使用 Intersection Observer 实现懒加载
onMounted(() => {
  if (!imgRef.value) return
  
  const { stop } = useIntersectionObserver(
    imgRef,
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        isInView.value = true
        if (imgRef.value) {
          imgRef.value.src = props.src
        }
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
    class="eco-image"
    :class="{ loaded: isLoaded }"
    @load="isLoaded = true"
  />
</template>

<style scoped>
.eco-image {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.eco-image.loaded {
  opacity: 1;
}
</style>