---
"@banmao/procomponent": minor
---

- feat(Actions): 溢出菜单改用 `NPopover` 纵向操作列表

  - 默认面板带 `role="menu"` / `role="menuitem"`，打开后聚焦第一个可用项
  - 支持 `ArrowUp` / `ArrowDown` 循环、`Home` / `End` 跳转、`Esc` 关闭并回收焦点
  - 新增 `overflow` 插槽（作用域 `{ items, close }`），可完全替换默认面板并自行分组
  - 视觉从 `NDropdown` 下拉列表变为带内边距的浮层菜单；`showNum` 默认值与非响应式行为保持不变

- feat(Actions): 支持权限过滤

  - 新增 `permissions: string[]` 与 `hasPermission: (permission) => boolean`
  - `hasPermission` 优先于 `permissions`；两者都未传时不过滤
  - 仅过滤声明了 `permission` 的操作，未声明权限的项始终展示

- feat(Actions): 支持二次确认

  - `items[].confirm` 为 `true` 时，平铺按钮与溢出项都会先弹出 `NModal preset="dialog"`
  - 正文取 `items[].confirmContent`，未传时按 `label` 生成；`error` 类型使用错误态弹窗
  - 确认后执行 `onClick` 并抛出 `click`；取消、`Esc` 或遮罩关闭抛出 `cancel`
  - 新增 `confirmTitle` 属性，默认「操作确认」

- feat(Actions): 新增根级事件与回调参数

  - 新增 `click(item, event?)`：操作执行后触发，直接点击时携带 `MouseEvent`，确认后为 `undefined`
  - 新增 `cancel(item)`：二次确认被取消时触发
  - `items[].onClick` 现在接收 `(item, event?)`

- feat(Actions): 新增尺寸与图标配置

  - 新增 `size: 'small' | 'medium' | 'large'`，同时作用于平铺按钮、溢出触发器与菜单项
  - `items[].icon` 使用 Iconify 名称渲染按钮左侧图标
  - 新增 `moreIcon` 自定义「更多」图标，未传时保留内置 `bm-icon/more-horizontal`
  - 新增 `moreLabel` 作为「更多」触发器的无障碍名称

- feat(Actions): 新增可选响应式收缩

  - 新增 `responsive`，默认 `false`，不开启时行为与 `0.7.31` 一致
  - 开启后通过隐藏测量行与 `ResizeObserver` 按容器宽度计算可见数量，并预留「更多」触发器宽度
  - `showNum` 在响应式下变为上限；未传时不设上限，只受宽度约束
  - 全部放得下时不渲染「更多」按钮，字体加载完成后会重新测量

- feat(Actions): 导出类型

  - 从包入口导出 `ActionButton`、`ActionButtonProps`、`ActionsProps`、`ActionsEmits`、`ActionVariant`、`ActionSize`、`ActionAlign`

- fix(Actions): 修复 `align="left"` 实际渲染为居中

  - 根节点原先固定带 `justify-center`，与 `justify-start` 同时存在时由构建后 CSS 的规则顺序决定，`center` 覆盖了 `start`
  - 现在只按 `align` 输出一个对齐类：`left` → `justify-start`、`center` → `justify-center`、`right` → `justify-end`

- fix(Actions): 修复 `items` / `showNum` / `align` 变化后界面不更新

  - `setup` 中解构 props 得到的是非响应式快照，`visibleItems` / `collapseItems` 不会随父组件传值变化重算
  - 改为在计算属性与渲染函数中直接读取 `props.items` / `props.showNum` / `props.align`，动态切换展示数量与对齐方式即时生效

- 注意：此前 `ActionButton.confirm` 已有类型但从未生效；升级后声明了 `confirm: true` 的操作会开始弹出确认框
