import type { App } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes, handleHotUpdate } from 'vue-router/auto-routes'
import type { RouteRecordInfo, ParamValue } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
// import routes from 'pages-generated'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

function addRedirects() {
  router.addRoute({
    path: '/new-about',
    redirect: '/about?from=hoho',
  })
}

// 全局错误处理
router.onError((error) => {
  console.error('路由错误:', error)
  router.push('/error')
})

// This will update routes at runtime without reloading the page
if (import.meta.hot) {
  handleHotUpdate(router)
} else {
  addRedirects()
}

declare module 'vue-router/auto-routes' {
  export interface RouteNamedMap {
    'custom-dynamic-name': RouteRecordInfo<
      'custom-dynamic-name',
      '/added-during-runtime/[...path]',
      { path: ParamValue<true> },
      { path: ParamValue<false> }
    >
  }
}

export function setupRouter(app: App) {
  app.use(router)
}
