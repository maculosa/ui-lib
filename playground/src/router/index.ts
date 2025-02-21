import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes, handleHotUpdate } from 'vue-router/auto-routes'

console.log({ routes })
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
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

export default function setupRouter(app: App) {
  app.use(router)
}
