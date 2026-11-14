---
"@banmao/procomponent": minor
---

- feat(ProLayout): 新增侧栏与内容区定制能力，页脚支持插槽

  - `siderClass`：经 `tailwind-merge` 合并到 `aside`，可覆盖内置的 `bg-zinc-800`；改浅色侧栏时需同时把菜单主题切成 `lightTheme`，否则浅色文字落在白底上不可读
  - `siderWidth`：展开态侧栏宽度，默认 `256`（与 `0.7.31` 的 `w-64` 一致）；宽度走行内样式，`siderClass` 里的 `w-*` 不会生效，折叠态仍取 `menu.collapsedWidth`
  - `contentClass`：经 `tailwind-merge` 合并到内容区 `section`，可覆盖内置的 `p-4`
  - `contentScroll`：默认 `false`，开启后内容区由内部 `NScrollbar` 承载滚动，无需再自行包滚动容器；不要与手写滚动容器或 ProTable 的自动高度叠加
  - `footer` 插槽：`footer` 开启后优先渲染插槽内容，未提供时仍回退文案 `Footer`；页脚横跨整个布局宽度，高度固定 `64px`

- feat(ProLayout): `menu` 新增 `params` / `responsive`，并暴露实例方法

  - `menu.params`：原样作为 `request` 的第一个参数；深度监听，变化（含就地修改）即重新拉取菜单
  - `menu.request` 增加并发保护：连续触发时只让最后一次请求落地，避免旧响应覆盖新菜单
  - `menu.responsive`：透传给横排 `NMenu`，只作用于 `layout="top" / "mix"` 的顶栏菜单，放不下的项收进末尾的「更多」子菜单
  - `expose`：新增 `reloadMenus()`（主动重新拉取远程菜单）、`setCollapsed(value)`、`toggleCollapsed()`；后两者与折叠按钮一样抛出 `collapseChange`