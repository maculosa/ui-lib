import type { App, Plugin } from 'vue'
import DrawerForm from './src'

export const DrawerFormPlugin: Plugin = {
  install(app: App) {
    app.component('DrawerForm', DrawerForm)
  },
}

export {
  DrawerForm,
}

export type {
  DrawerFormColumn,
  DrawerFormEmits,
  DrawerFormExpose,
  DrawerFormFooterScope,
  DrawerFormProps,
} from './src/types'
