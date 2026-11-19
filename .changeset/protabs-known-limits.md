---
"@banmao/procomponent": minor
---

- feat(ProTabs): 按文档「已知限制」补齐能力

  - 内容面板：新增 `panel` 插槽、组件级 / 选项级 `renderPanel`，支持 `keepAlive` 与 `lazy`
  - 路由联动：新增 `route` 选中来源与结构化的 `router.push(key)` 适配，优先级 `active > route > 内部状态`
  - 键盘与 ARIA：方向键循环、`Home` / `End`、roving tabindex，页签带 `aria-controls` 并与 `role="tabpanel"` 双向关联
  - 徽标：新增 `badge`（数字 / `'dot'` / 自定义 VNode）与 `badgeMax`，兼容旧版 `showBadge + dot`
  - 关闭：新增页签级 `closable` 覆盖与可本地化的 `closeLabel`
  - 编辑：新增 `addable` 内置新增按钮、`draggable` 拖拽排序与 `renamable` 双击重命名，并抛 `add` / `reorder` / `rename`
  - 尺寸：新增 `size` 三档，统一控制高度、内边距、字号、图标与徽标
  - 滚动：溢出时显示左右箭头（`scrollButtons` 可关闭），选中项自动滚入视野
  - 虚拟滚动：新增 `virtual`（`true` / `'auto'`）、`virtualThreshold`、`virtualOverscan`，窗口化渲染并保留键盘、滚动定位与 `aria-setsize` / `aria-posinset`
  - 异步面板：新增选项级 / 组件级 `panelLoader` 与内置 loading / error / retry 三态，结果按 key 缓存，暴露 `reloadPanel`，抛 `panel-loaded` / `panel-error`
  - 路由标题：新增 `routeTitle`，路由不在 `options` 中时生成不可关闭的临时页签并抛 `route-enter`
  - 右键菜单：新增 `contextMenu` 与 `contextMenuLabels`，内置关闭当前 / 其他 / 右侧 / 全部，抛 `close-others` / `close-right` / `close-all`
  - 跨容器拖拽：新增 `dragGroup`，跨组落位抛 `transfer`，与源容器的 `reorder` 互斥
  - 实例方法：暴露 `activeKey`、`scrollTo`、`scrollActive`、`scrollBy`、`focus`、`getEl`、`reloadPanel`
  - 类型：从包入口导出 `TabOption`、`ProTabsProps`、`ProTabsEmits`、`ProTabsInstance`、`ProTabsRouter`、`ProTabsSize`、`TabBadge`、`ProTabsDragGroup`、`ProTabsTransferPayload`、`PanelLoader`、`ContextMenuCommand`、`ProTabsContextMenuLabels`、`VirtualWindow`
