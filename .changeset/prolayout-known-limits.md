---
"@banmao/procomponent": minor
---

- feat(ProLayout): 自动展开选中项并补齐实例方法

  - `autoExpandSelected`：默认 `true`，初始化与 `menuValue` 外部变化时自动把祖先项写入展开集合，并抛出 `update:expandedKeys`；手动折叠不会被反复覆盖，传 `false` 恢复仅高亮的旧行为
  - `menuValue` / `expandedKeys` 改为「内部状态优先」：点击或方法调用先更新内部状态再抛出事件，单向绑定也不会冻结高亮
  - `expose` 新增 `setMenuValue(key)`、`setExpandedKeys(keys)`、`scrollToMenu(key): Promise<boolean>`；`scrollToMenu` 会先展开祖先，再滚动到对应菜单项，找不到节点时返回 `false`

- feat(ProLayout): 页脚样式与顶栏标题配色

  - `footerClass` / `footerStyle`：经 `tailwind-merge` 合并到页脚，`h-12` 可覆盖内置 `h-16`，默认 64px 不变
  - 内置标题与顶栏操作按钮不再硬编码白色，统一继承 `headerClass` 的文字色；`header-class="bg-white text-zinc-900"` 即可用于浅色顶栏，无需 `titleRender`

- feat(ProLayout): 抽屉定制

  - `breakpointMode`：新增 `'container'`，通过 `ResizeObserver` 测量根节点宽度，适配卡片、分栏与微前端容器；默认仍为视口模式
  - `drawerPlacement` / `drawerWidth`：控制抽屉方向（默认 `left`）与尺寸（默认回退 `siderWidth`），上下方向复用该值作为高度
  - `drawer` 插槽：作用域 `{ menus, close }`，提供后完全接管抽屉内容
  - `expose` 新增 `openDrawer()` / `closeDrawer()` / `toggleDrawer()`，桌面端调用为空操作
