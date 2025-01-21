import { defineComponent, inject, toRefs } from "vue"
import { NSpace, NButton } from 'naive-ui'
import type { TourContext } from "./types/tour"
import { tourKey } from "./helpers"
import { tourStepProps } from "./types/step"

import './styles/step.scss'

export default defineComponent({
    name: 'TourStep',
    props: tourStepProps,
    emits: ['close'],
    setup(props, { emit }) {

        const { title, description } = toRefs(props)

        const tourContext = inject<TourContext>(tourKey, {} as TourContext)

        const { current, total, onClose: tourOnClose, onFinish: tourOnFinish, onChange } = tourContext
        
        const onClose = () => {
            tourOnClose()
            emit('close')
        }

        const onFinish = () => {
            onClose()
            tourOnFinish()
        }

        const onPrev = () => {
            current.value -= 1

            onChange()
        }

        const onNext = () => {
            if (current.value >= total.value - 1) {
                onFinish()
            } else {
                current.value += 1
            }

            onChange()
        }

        return () => (
            <div class="tour-step">
                <div class="tour-content_header">
                    <div class="tour-content_header-title">{title.value}</div>
                    <div class="tour-content_header-close">
                        <button onClick={onClose}>X</button>
                    </div>
                </div>
                <div class="tour-content_body">
                    <span>{description.value}</span>
                </div>
                <div class="tour-content_footer">
                    <span>
                        {current.value + 1} / {total}
                    </span>
                    <NSpace justify="end">
                        {current.value > 0 && (
                            <NButton
                                type="primary"
                                size="small"
                                onClick={onPrev}
                            >
                                上一步
                            </NButton>
                        )}
                        {current.value <= total.value - 1 && (
                            <NButton
                                type="primary"
                                size="small"
                                onClick={onNext}
                            >
                                {current.value === total.value - 1 ? '结束' : '下一步'}
                            </NButton>
                        )}

                    </NSpace>
                </div>
            </div>
        )
    }
})
