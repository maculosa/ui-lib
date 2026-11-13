import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes, handleHotUpdate } from 'vue-router/auto-routes'
import { setupLayouts } from 'virtual:generated-layouts'
import { logger } from '@/utils/log'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (!to.hash) return { top: 0 }
    // markdown-it-anchor 的 id 经过 encodeURIComponent，而 to.hash 已被解码
    const el = document.getElementById(encodeURIComponent(to.hash.slice(1)))
    if (!el) return { top: 0 }
    el.scrollIntoView()
    return false
  },
  routes: [
    {
      path: '/examples/blocks/login',
      component: () => import('@/layouts/blank.vue'),
      children: [
        {
          path: 'simple-login',
          component: () => import('@/examples/blocks/login/simple-login.vue'),
        },
        {
          path: 'simple-bg-login',
          component: () => import('@/examples/blocks/login/simple-bg-login.vue'),
        },
        {
          path: 'card-login',
          component: () => import('@/examples/blocks/login/card-login.vue'),
        },
        {
          path: 'slot-login',
          component: () => import('@/examples/blocks/login/slot-login.vue'),
        },
        {
          path: 'two-column-login',
          component: () => import('@/examples/blocks/login/two-column-login.vue'),
        },
      ],
    },
    {
      path: '/examples',
      name: 'examples',
      component: () => import('@/pages/examples/index.vue'),
    },
    ...setupLayouts(routes),
  ],
})

// 全局错误处理
router.onError(error => {
  logger.error('路由错误:', error)
  router.push('/error')
})

// This will update routes at runtime without reloading the page
if (import.meta.hot) {
  handleHotUpdate(router)
}

export function setupRouter(app: App) {
  app.use(router)
}
