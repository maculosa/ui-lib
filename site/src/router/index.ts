import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes, handleHotUpdate } from 'vue-router/auto-routes'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
  // routes: [
  //   {
  //     path: '/',
  //     component: () => import('@/layouts/basicLayout.vue'),
  //     children: [
  //       {
  //         path: '/',
  //         name: 'datav',
  //         component: () => import('@/pages/datav/index.vue')
  //       },
  //       {
  //         path: '/ui',
  //         name: 'ui',
  //         component: () => import('@/pages/ui/index.vue')
  //       }
  //     ]
  //   },
  // ]
})

// This will update routes at runtime without reloading the page
if (import.meta.hot) {
  handleHotUpdate(router)
}

export default function setupRouter(app: App) {
  app.use(router)
}
