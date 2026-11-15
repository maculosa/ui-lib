---
"@banmao/procomponent": minor
---

- feat(ProLayout): 新增移动端抽屉，通过 `mobileBreakpoint` 开启

  - `mobileBreakpoint`（px）按**视口宽度**判断：`(max-width: Npx)` 命中即为窄屏；不传时用永不匹配的查询，默认关闭，行为与 `0.7.31` 完全一致
  - 窄屏下不渲染侧栏与 `layout="top" / "mix"` 的横排菜单，折叠按钮一并隐藏，顶栏最左侧改为抽屉按钮
  - 抽屉固定 `placement="left"`、宽度取 `siderWidth`（不取 `menu.collapsedWidth`），内容始终是完整多级 `menus`，忽略折叠态
  - 抽屉内点击叶子项会更新选中态并关闭抽屉；点击父级项只展开/收起，不关闭、不改选中态
  - 遮罩与 `Esc` 可关闭；视口回到断点以上时自动关闭并恢复侧栏；关闭时不渲染（`display-directive="if"`），重新打开不保留内部展开态
  - 抽屉没有插槽，`header-extra` / `footer` 仍照常渲染；`NDrawer` 虽 teleport 到 body，仍能继承应用主题

- feat(ProTabs): 从空壳补齐为可用组件并对外导出

  - 页签条支持 `card` / `line` 两种形态，`inset` 与 `rounded`（仅 `card`）调整外观；只渲染页签条，内容区由使用方决定
  - `active` + `update:active` 支持 `v-model:active`；`defaultActive` 只在初始化时读取一次，未传时取 `options[0]`
  - 非受控下选中项消失时回退到最后一个仍存在的页签；从未选中过（如 `options` 异步到达）则回退到第一项；内部回退不抛 `update:active`，受控时不做回退
  - `dot` 配合 `showBadge` 渲染数字徽标（`0` 也渲染），`icon` 支持页签级与组件级，页签级优先
  - `closable` 在页签内渲染关闭按钮并抛 `close(key)`，组件本身不会从 `options` 中移除页签，也不抛 `update:active`
  - `render` 支持页签级与组件级自定义，页签级优先；补齐 `role="tablist" / role="tab"`、`aria-selected`、`aria-disabled` 与 Enter/Space 操作

- breaking(ProLayout): 移除 `MenuConfig.locale`

  - 该字段在 `0.7.31` 中从未被消费，组件库也没有接入 i18n，保留只会误导；TypeScript 项目里写过 `locale` 的地方需要删除
