---
"@banmao/procomponent": patch
---

- feat(ProTable): 未配置 `columnStorageKey` 时默认使用当前路由名作为列设置 key

  - 通过组件实例代理读取 `$route.name`（兼容 vue-router 全局属性），不新增对 vue-router 的依赖
  - 非 vue-router 环境或匿名路由仍退回随机 key，行为与之前一致
  - 同一路由下多个未配置 key 的表格会共用偏好，开发环境会告警，建议显式传入唯一的 `columnStorageKey`
