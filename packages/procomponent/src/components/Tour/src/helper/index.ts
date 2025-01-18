import type { InjectionKey, Ref } from "vue";

export interface TourContext {
    current: Ref<number>
    total: Ref<number>
    onClose(): void
    onFinish(): void
    onChange(): void
}

export const tourKey: InjectionKey<TourContext> = Symbol('tour-step')

export const tourStepEmits = {
    close: () => true
}

export type TourStepEmits = typeof tourStepEmits

function isNumber(value: number) {
    return Number.isNaN(value) === false
}

export const tourEmits = {
    close: (current: number) => isNumber(current),
    finish: () => true,
    change: (current: number) => isNumber(current)
}
