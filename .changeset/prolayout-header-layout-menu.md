---
"@banmao/procomponent": minor
---

- feat(ProLayout): 补齐六个此前未消费的 props

  - `layout`：新增 `side` / `top` / `mix` 三种布局模式，共用同一份 `menus`；`mix` 下顶栏只渲染一级菜单并联动侧栏二级菜单，当前一级项没有 `children` 时不渲染侧栏
  - `logo`：顶栏标题左侧渲染 `h-8 w-auto` 的 logo 图片
  - `titleRender`：自定义标题渲染函数，返回值替换整个标题节点
  - `headerClass`：经 `tailwind-merge` 合并到 `header`，可覆盖内置的 `bg-zinc-800` 等类名
  - `collapsedTriggerPosition`：`top` / `bottom` 决定折叠按钮位置，默认 `bottom`
  - `menu`：新增 `MenuConfig`，支持 `collapsed`（初始折叠态）、`collapsedWidth`（同时作用于侧栏与 `NMenu`）、`collapsedIconSize`、`loading`、`request`（挂载时拉取远程菜单，第二个参数为 `menus`，失败时 `console.error` 并回退 `menus`）与 `onLoadingChange`（仅反映内部请求态）；`locale` 仍未消费，组件库尚未接入 i18n

- fix(ProLayout): 折叠按钮默认只渲染一个（行为变更）

  - `0.7.31` 中顶栏与侧栏底部两个折叠按钮始终同时渲染，现在按 `collapsedTriggerPosition` 只渲染一个；需要顶栏按钮请显式传 `collapsed-trigger-position="top"`，`layout="top"` 下两者都不渲染
  - `collapsed` 默认值由 `false` 改为 `undefined`，未显式传入时初始折叠态取 `menu.collapsed`；显式传入时始终以根 `collapsed` 为准