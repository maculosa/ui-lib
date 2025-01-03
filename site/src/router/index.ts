import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/basicLayout.vue'),
      children: [
        {
          path: '/',
          name: 'datav',
          component: () => import('@/pages/datav/index.vue')
        },
        {
          path: '/ui',
          name: 'ui',
          component: () => import('@/pages/ui/index.vue')
        }
      ]
    },
  ]
})

export default function setupRouter(app: App) {
  app.use(router)
}
