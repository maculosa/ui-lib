import type { App, Plugin } from 'vue'
import Tour from './src/index'

// export * from './src/types'

export const TourPlugin: Plugin = {
    install(app: App) {
        app.component('Tour', Tour)
    }
}

export {
    Tour
}
