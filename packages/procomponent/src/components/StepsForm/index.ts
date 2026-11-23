import type { App, Plugin } from 'vue'
import StepsForm from './src'

export const StepsFormPlugin: Plugin = {
  install(app: App) {
    app.component('StepsForm', StepsForm)
  },
}

export {
  StepsForm,
}

export type {
  StepsFormColumn,
  StepsFormEmits,
  StepsFormExpose,
  StepsFormFooterScope,
  StepsFormProps,
  StepsFormStep,
  StepsFormStepScope,
} from './src/types'
