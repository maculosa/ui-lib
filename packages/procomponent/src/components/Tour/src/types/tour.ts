import type { PropType, ExtractPropTypes, Ref } from 'vue'

export interface TourStep {
    title?: string
    description?: string
    target: () => HTMLElement
}

export const tourProps = {
    steps: {
        type: Array as PropType<TourStep[]>,
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
}

export type TourProps = ExtractPropTypes<typeof tourProps>



export interface TourContext {
    current: Ref<number>
    total: Ref<number>
    onClose(): void
    onFinish(): void
    onChange(): void
}