import type { App, Plugin } from 'vue'
import TextClamp from './src/text-clamp'

export const TextClampPlugin: Plugin = {
  install(app: App) {
    app.component('TextClamp', TextClamp)
  },
}

export { TextClamp }
