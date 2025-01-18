import { computed, defineComponent, onMounted, onUnmounted, ref, type CSSProperties } from "vue";

export default defineComponent({
    name: 'TourMask',
    props: {
        pos: {
            type: Object,
            default: () => ({
                top: 0,
                left: 0,
                width: 0,
                height: 0
            })
        },
        show: {
            type: Boolean,
            default: true
        }
    },
    setup(props) {

        const width = ref(0)
        const height = ref(0)

        onMounted(() => {
            width.value = document.body.offsetWidth;
            height.value = document.body.offsetHeight;

            window.addEventListener('resize', () => {
                width.value = document.body.offsetWidth;
                height.value = document.body.offsetHeight;
            })
        })

        onUnmounted(() => {
            window.removeEventListener('resize', () => { })
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
