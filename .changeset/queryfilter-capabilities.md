---
"@banmao/procomponent": minor
---

- feat(QueryFilter): 查询过滤组件完整增强与文档

  - 字段：修正 checkbox / switch / 日期绑定，新增 `dateRange`、`radio`、`checkboxGroup`，按类型初始化空值
  - 值模型：新增 `v-model:modelValue`、`update:modelValue`、`field-change`，与 `defaultValue` 兼容
  - 查询：新增 `loading`、`beforeSearch`、`searchOnReset`，查询期间按钮 loading 并禁用
  - 远程枚举：同一请求只执行一次、并发去重、逐列 loading、`options-error` 与 `refreshOptions`
  - 布局：`v-model:collapsed` 受控折叠、`gridCols` 支持响应式字符串、`column.grid`、`card=false`
  - 文案与控件：`searchText` / `resetText` / `expandText` / `collapseText`、`column.placeholder`、`column.disabled`
  - 插槽：新增 `actions` 与 `field-<key>`
  - 实例：暴露 `getValues` / `setValues` / `setFieldValue` / `getFieldValue` / `search` / `reset` / `toggleCollapsed` / `refreshOptions` / `collapsed` / `optionsLoading` / `form`
  - 类型：包入口导出 `QueryFilterColumn`、`QueryFilterProps`、`QueryFilterEmits`、`QueryFilterExpose`、`QueryFilterValueType`、`QueryFilterFieldScope`、`QueryFilterActionsScope`
  - 文档：新增 playground 中英文 QueryFilter 文档、7 个示例、单测，并将目录状态改为可用
