import type { App, Plugin } from 'vue'
import Tour from './src/tour'

export const TourPlugin: Plugin = {
    install(app: App) {
        app.component('Tour', Tour)
    }
}

export {
    Tour
}
