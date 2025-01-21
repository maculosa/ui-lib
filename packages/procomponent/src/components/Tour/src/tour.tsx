import { computed, defineComponent, provide, ref, watch } from "vue"
import { useElementBounding } from "@vueuse/core"
import Step from "./step"
import TourMask from "./mask"
import { tourKey } from "./helpers"
import { isNumber } from "lodash-es"

import './styles/tour.scss'
import { tourProps } from "./types/tour"
import type { TourStep } from "./types/tour"

export default defineComponent({
    name: 'Tour',
    props: tourProps,
    emits: {
        change: (current: number) => isNumber(current),
        close: (current: number) => isNumber(current),
        finish: () => true
    },
    setup(props, { emit }) {

        const targetRef = ref<HTMLElement | null>(null)
        const { width, height, left, top } = useElementBounding(targetRef)

        const infoPos = computed(() => {
            if (props.steps.length <= 0 || current.value >= props.steps.length) return null
            const target = props.steps[current.value].target()
            if (!target) return null
            
            targetRef.value = target
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

        watch(() => props.steps, (val: TourStep[]) => {
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

            if (!props.open) return null

            return (
                <div class="tour">
                    <TourMask pos={infoPos.value} />
                    <div class="tour-content">
                        {props.steps.map((item, index) => (
                            <Step
                                key={item.title}
                                v-show={index === current.value}
                                title={item.title || ''}
                                description={item.description || ''}
                                style={mergeStyle.value}
                            />
                        ))}
                    </div>
                </div>
            )
        }
    }
})
