import type { App, Plugin } from 'vue'
import ProLayout from './src'

export const ProLayoutPlugin: Plugin = {
    install(app: App) {
        app.component('ProLayout', ProLayout)
    }
}

export {
    ProLayout,
}
