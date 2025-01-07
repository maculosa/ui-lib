import type { App, Plugin } from 'vue'
import ProForm from './src/index'

export const ProFormPlugin: Plugin = {
  install(app: App) {
    app.component('ProForm', ProForm)
  },
}

export {
  ProForm,
}
