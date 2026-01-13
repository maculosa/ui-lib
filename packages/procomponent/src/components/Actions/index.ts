import type { App, Plugin } from 'vue'
import Actions from './src'

export const ActionsPlugin: Plugin = {
  install(app: App) {
    app.component('Actions', Actions)
  },
}

export {
    Actions,
}
