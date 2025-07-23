import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes, handleHotUpdate } from 'vue-router/auto-routes'
import { setupLayouts } from 'virtual:generated-layouts'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/examples/blocks/login',
      component: () => import('@/layouts/blank.vue'),
      children: [
        {
          path: 'simple-login',
          component: () => import('@/examples/blocks/login/simple-login.vue')
        },
        {
          path: 'simple-bg-login',
          component: () => import('@/examples/blocks/login/simple-bg-login.vue')
        }
      ]
    },
    ...setupLayouts(routes),
  ]
})

// 全局错误处理
router.onError((error) => {
  console.error('路由错误:', error)
  router.push('/error')
})

// This will update routes at runtime without reloading the page
if (import.meta.hot) {
  handleHotUpdate(router)
}

export function setupRouter(app: App) {
  app.use(router)
}
