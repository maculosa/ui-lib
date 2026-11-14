---
"@banmao/procomponent": minor
---

- feat(ProLayout): 菜单选中态与展开态支持外部受控

  - `menuValue` + `update:menuValue`：支持 `v-model:menu-value`，透传给侧栏 `NMenu` 与 `layout="top"` 的横排 `NMenu`；不传时仍是非受控，选中态由 `NMenu` 自行维护，与 `0.7.31` 一致
  - `expandedKeys` + `update:expandedKeys`：支持 `v-model:expanded-keys`，控制子菜单展开；只决定展开态，不会根据 `menuValue` 自动展开祖先，深层路由需自行计算
  - 点击带子菜单的父级项只抛 `update:expandedKeys`，不改选中态、不抛 `menuClick`
  - 菜单 key 用路由 path、`menuValue` 绑 `route.path` 即可让高亮跟随路由（含刷新与直达子路由），组件本身不依赖 vue-router

- feat(ProLayout): 新增菜单事件 `menuClick` / `topMenuClick`

  - `menuClick(key, item)`：`side` 的侧栏、`top` 的横排菜单、`mix` 的侧栏点击菜单项时抛出，`item` 是原始 `MenuOption`，不再需要把 `onClick` 写进 `label`
  - `topMenuClick(key, item)`：仅 `mix`，点击顶栏一级项时抛出，`item` 保留完整 `children`（不是剥离后的顶栏副本）

- feat(ProLayout): `mix` 改为单一 value 源

  - 顶栏点击只切换当前一级项并抛 `topMenuClick`，不写 `menuValue`，避免一级 key 覆盖侧栏选中态
  - 外部改 `menuValue` 时反推其所属一级项，顶栏与侧栏一起切过去；反推不到时回退到第一个带子菜单的一级项
  - 未传 `menuValue` 时 `mix` 的联动行为与 `0.7.31` 一致