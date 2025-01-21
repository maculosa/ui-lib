import type { WatermarkProps } from './types'
import type { PropType } from 'vue'
import { defineComponent, onMounted, onUnmounted, ref, toRef, watchEffect } from 'vue'
// import { useMutationObserver } from '@vueuse/core'
import { useWatermarkBg } from './hooks/useWatermarkBg'
import './index.scss'

export default defineComponent({
  name: 'ProWatermark',
  props: {
    // ...withDefaults(defineProps<WatermarkProps>(), {
    //   text: 'watermark',
    //   color: '#000',
    //   fontSize: 16,
    //   gap: 50,
    //   rotate: -30,
    // }),
    text: {
      type: String as PropType<WatermarkProps['text']>,
      default: 'watermark',
    },
    color: {
      type: String as PropType<WatermarkProps['color']>,
      default: '#000',
    },
    fontSize: {
      type: Number as PropType<WatermarkProps['fontSize']>,
      default: 16,
    },
    gap: {
      type: Number as PropType<WatermarkProps['gap']>,
      default: 50,
    },
    rotate: {
      type: Number as PropType<WatermarkProps['rotate']>,
      default: -30,
    },
    fullscreen: {
      type: Boolean as PropType<WatermarkProps['fullscreen']>,
      default: false,
    },
  },
  setup(props, { slots }) {
    const fullscreen = toRef(props, 'fullscreen')
    const bg = useWatermarkBg(props)
    const containerRef = ref<HTMLDivElement | null>(null)

    let div: HTMLElement | null = null

    function resetWatermark(fullscreen: boolean = false) {
      if (!containerRef.value)
        return

      if (div)
        div.remove()

      const { base64, size } = bg.value
      div = document.createElement('div')
      div.style.position = fullscreen ? 'fixed' : 'absolute'
      div.style.backgroundImage = `url(${base64})`
      div.style.backgroundSize = `${size}px ${size}px`
      div.style.backgroundRepeat = 'repeat'
      div.style.zIndex = '9999'
      div.style.pointerEvents = 'none'
      div.style.inset = '0'
      if (fullscreen) {
        div.style.top = '0'
        div.style.left = '0'
        div.style.right = '0'
        div.style.bottom = '0'
      }

      containerRef.value.appendChild(div)
    }

    const ob = new MutationObserver((entries: any[]) => {
      for (const entry of entries) {
        // 处理删除
        for (const node of entry.removedNodes) {
          if (node === div)
            resetWatermark(fullscreen.value)
        }
        // 处理修改
        if (entry.target === div)
          resetWatermark(fullscreen.value)
      }
    })

    onMounted(() => {
      resetWatermark(fullscreen.value)
      if (!containerRef.value)
        return
      ob.observe(containerRef.value, {
        attributes: true,
        childList: true,
        subtree: true,
      })
    })

    watchEffect(() => {
      resetWatermark(fullscreen.value)
    })

    onUnmounted(() => {
      ob.disconnect()
    })

    return () => (
      <div ref={containerRef} class="watermark-container">
        { slots.default?.()}
      </div>
    )
  },
})
