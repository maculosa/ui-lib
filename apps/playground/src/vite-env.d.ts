/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />

declare module '~icons/bm-icon/*' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}

declare module 'virtual:generated-layouts' {
  export function setupLayouts(routes: RouteRecordRaw[]): RouteRecordRaw[]
}

declare module 'virtual:search-index' {
  export interface SearchRecord {
    id: number
    title: string
    heading: string
    description: string
    /** Vue 页面同址双语，构建期只记录词典 key，由搜索面板按当前语言解析。 */
    titleKeys?: string[]
    descriptionKeys?: string[]
    path: string
    hash: string
    locale: 'zh' | 'en'
    group: string
  }
  const records: SearchRecord[]
  export default records
}
