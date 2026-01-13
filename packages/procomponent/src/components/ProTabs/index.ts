import type { App, Plugin } from 'vue'
import ProTabs from './src'

export const ProTabsPlugin: Plugin = {
  install(app: App) {
    app.component('ProTabs', ProTabs)
  },
}

export {
  ProTabs,
}
