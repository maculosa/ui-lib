import { isNumber } from "lodash-es";
import type { InjectionKey } from "vue";
import type { TourContext } from "../types/tour"



export const tourKey: InjectionKey<TourContext> = Symbol('tour-step')

export const tourStepEmits = {
    close: () => true
}

export type TourStepEmits = typeof tourStepEmits

export const tourEmits = {
    close: (current: number) => isNumber(current),
    finish: () => true,
    change: (current: number) => isNumber(current)
}
