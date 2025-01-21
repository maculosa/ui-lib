import type { CSSProperties } from "vue";
import { computed, defineComponent, onMounted, onUnmounted, ref } from "vue";
import { tourMaskProps } from "./types/mask";

export default defineComponent({
    name: 'TourMask',
    props: tourMaskProps,
    setup(props) {
        const width = ref(0)
        const height = ref(0)

        const updateDimensions = () => {
            width.value = document.body.offsetWidth
            height.value = document.body.offsetHeight
        }

        onMounted(() => {
            updateDimensions()
            window.addEventListener('resize', updateDimensions)
        })

        onUnmounted(() => {
            window.removeEventListener('resize', updateDimensions)
        })

        const path = computed(() => {
            const infoPos = props.pos
            // 全屏遮罩
            const _path = `M${width.value},0 L0,0 L0,${height.value} L${width.value},${height.value} L${width.value},0 Z`
            const radius = 2
            return infoPos ?
                `${_path} M${infoPos.left - radius},${infoPos?.top - radius} h${infoPos?.width + radius * 2} a2,2 0 0 1 2,2 v${infoPos?.height - radius * 2} a2,2 0 0 1 -2,2 h${-infoPos?.width + radius * 2} a2,2 0 0 1 -2,-2 v${-infoPos?.height + radius * 2} a2,2 0 0 1 2,-2 z`
                : _path
        })

        const maskStyle = computed<CSSProperties>(() => {
            return {
                fill: props.show ? 'rgba(0,0,0,0.5)' : 'transparent',
                pointerEvents: 'none',
                cursor: 'auto'
            }
        })

        return () => (
            <div class="tour-mask">
                <svg style="width: 100%; height: 100%">
                    <path class="tour-hollow"
                        d={path.value}
                        style={maskStyle.value}
                    ></path>
                </svg>
            </div>
        )
    }
})
