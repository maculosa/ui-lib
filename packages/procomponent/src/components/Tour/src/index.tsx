import { computed, defineComponent, provide, ref, watch, type PropType } from "vue"

import { useElementBounding } from "@vueuse/core"
import Step from "./step"
import TourMask from "./mask"
import { tourKey } from "./helper"
import { isNumber } from "lodash-es"

import './styles/tour.scss'

interface StepOption {
    title?: string
    description?: string
    target: () => HTMLElement
}

export default defineComponent({
    name: 'Tour',
    props: {
        steps: {
            type: Array as PropType<StepOption[]>,
            default: () => []
        },
        open: {
            type: Boolean,
            default: false
        },
        defaultActive: {
            type: Number,
            default: 0
        },
        onChange: {
            type: Function,
            default: () => { }
        },
        onFinish: {
            type: Function,
            default: () => { }
        },
        onClose: {
            type: Function,
            default: () => { }
        }
    },
    emits: {
        change: (current: number) => isNumber(current),
        close: (current: number) => isNumber(current),
        finish: () => true
    },
    setup(props, { emit }) {

        const infoPos = computed(() => {
            if (props.steps.length < 0) return
            const { width, height, left, top } = useElementBounding(props.steps[current.value].target())
            return {
                left: left.value,
                top: top.value,
                width: width.value,
                height: height.value
            }
        })

        const mergeStyle = computed(() => {
            if (!infoPos.value) return

            let left: string | undefined = 'unset'
            let top: string | undefined = 'unset'
            let bottom: string | undefined = 'unset'

            if (infoPos.value.width + infoPos.value.left > window.innerWidth) {
                left = window.innerWidth - infoPos.value.width - 20 + 'px'
            } else {
                left = infoPos.value.left + 'px'
            }

            if (infoPos.value.height + infoPos.value.top > window.innerHeight) {
                bottom = infoPos.value.height + 'px'
            } else {
                top = infoPos.value.top + infoPos.value.height + 20 + 'px'
            }

            const resStyle = {
                left,
                top,
                bottom
            }

            return resStyle
        })

        const current = ref(0)
        const total = ref(0)

        watch(() => props.steps, (val: StepOption[]) => {
            total.value = val.length
        }, {
            immediate: true
        })

        provide(tourKey, {
            current,
            total,
            onClose() {
                current.value = 0
                emit('close', current.value)
            },
            onFinish() {
                current.value = 0
                emit('finish')
            },
            onChange() {
                emit('change', current.value)
            }
        })

        return () => {

            if (props.open) {
                return <div class="tour">
                    <TourMask pos={infoPos} />
                    <div class="tour-content">
                        {props.steps.map(item => <Step key={item.title}
                            v-show="index === current"
                            title={item.title || ''}
                            description={item.description || ''}
                            style={mergeStyle}
                        ></Step>)}
                    </div>
                </div>
            }
            return null
        }
    }
})
