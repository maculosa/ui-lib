import { defineComponent } from 'vue'
import type { CSSProperties } from 'vue'

export default defineComponent((props, { slots }) => {

    const { lines } = defineProps({
        lines: {
            type: Number,
            default: 1
        },
        ellipsis: {
            type: Boolean,
            default: true
        }
    })

    const textRef = ref<HTMLDivElement>()

    const style = computed<CSSProperties>(() => ({
        display: '-webkit-box',
        overflow: 'hidden',
        '-webkit-box-orient': 'vertical',
        '-webkit-line-clamp': props.lines,
        WordBreak: 'break-all'
    }))

    const updateClamp = () => {
        if (!textRef.value) return

        const element = textRef.value
        const lineHeight = parseInt(getComputedStyle(element).lineHeight)
        const maxHeight = lineHeight * lines

        if (element.scrollHeight > maxHeight) {
            element.style.height = `${maxHeight}px`
        }
    }

    onMounted(() => {
        updateClamp()
    })

    watch(() => props.lines, () => {
        updateClamp()
    })

    return () => (
        <div ref={textRef} class="text-clamp" style={style.value}>
            {slots.default?.()}
        </div>
    )
}, {
    name: 'TextClamp'
})