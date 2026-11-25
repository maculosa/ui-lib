# @banmao/procomponent

## 0.8.0

### Minor Changes

- 655340d: - feat(Actions): 溢出菜单改用 `NPopover` 纵向操作列表
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

- 2ec349d: - feat(DrawerForm): 重写抽屉表单并对齐 ModalForm 能力
  - 显隐：新增 `show` / `defaultShow`，支持受控与非受控；暴露 `open` / `close`，抛 `update:show` / `open` / `close`
  - 插槽：新增 `trigger`、`form`、`footer`、`header`、`header-extra`，默认插槽保留为 trigger 兼容回退
  - footer：新增 `hideFooter`、`confirmLoading`、`submitText` / `resetText` / `cancelText`，`footer` 插槽提供 `close` / `reset` / `submit` / `confirmLoading`
  - 提交：新增 `closeOnSubmit`，校验通过后按需自动关闭；暴露 `submit` / `reset` / `setFieldValue` / `form`
  - 数据：`model` 支持 `v-model:model`
  - 抽屉：新增 `placement`、`width`、`height`、`resizable`、`showMask`、`maskClosable`、`closeOnEsc`、`blockScroll`、`autoFocus`、`trapFocus`、`displayDirective`、`zIndex`
  - 类型：包入口导出 `DrawerFormProps`、`DrawerFormEmits`、`DrawerFormExpose`、`DrawerFormFooterScope`、`DrawerFormColumn`
  - 文档：新增 playground 中英文 DrawerForm 文档与 5 个示例，侧边栏与目录同步可用

- 修复并完善一些问题
- d8e0b33: - feat(LiteFilter): 改为独立紧凑筛选条，内部不再使用栅格布局
  - 结构：独立实现列渲染与值模型，默认 `card=false`、`showLabel=false`（占位符说明条件）、`formConfig.size='small'`、`gap=12`；`tooltip` 列保留小标签
  - 布局：主行改为 `flex` 换行容器（不再渲染 `NGrid` / `NFormItemGi`），字段宽度按 `valueType` 取默认（text 180、select/cascader/treeSelect 160、date 150、dateRange 260、digit/time 140、dynamicTags 220、colorPicker 120，开关与勾选类按内容），优先级 `formItemProps.style.width` > `column.width` > 类型默认；操作区为行尾 flex 项，紧跟最后一个字段并随内容换行
  - 折叠：改为容器限高 + `overflow:hidden`，限高 = `collapsedRows × 行高 + (collapsedRows-1) × gap`（行高 small 34 / medium 40 / large 46）；展开 / 折叠按钮改为按实测内容高度（`ResizeObserver`）判断
  - 高级筛选：列配置新增 `advanced`，可收进「高级筛选」`NPopover`（`advancedPopover` / `advancedText`，弹层内字段纵向带标签排列），主行与弹层共用值模型；弹层底部只保留重置，且只清空高级字段
  - 移除：`gridCols`、列上的 `grid`、`advancedCols` 与 `formConfig.gridCollapsed` / `gridCollapsedRows`；改用 `defaultCollapsed` / `collapsedRows` 与列上的 `width`
  - 能力：查询 / 重置、`loading`、`beforeSearch`、`searchOnReset`、远程枚举（请求一次 + `refreshOptions`）、受控折叠、`field-<key>` 与 `actions` 插槽、文案配置
  - 兼容：保留 `columns` / `defaultValue` / `formConfig` / `card` / `gap`；列类型改为独立的 `LiteFilterColumn`（字段与 `QueryFilterColumn` 兼容，新增 `advanced`、`width`）；旧默认插槽仍在操作区渲染一次
  - 实例：仍只暴露 `refreshOptions`，不提供 `v-model` 与完整实例 API
  - 类型：包入口导出 `LiteFilterColumn`、`LiteFilterFormConfig`（等于 naive `FormProps`）、`LiteFilterValueType` 等
  - 测试：`tests/litefilter.test.ts` 覆盖 flex 行与间距、类型宽度与 `width` 覆盖、折叠限高与展开、弹层纵向排列等 17 个用例
  - 文档：中英文 LiteFilter 文档改为 flex 内容宽度与折叠限高说明，示例 `grid-collapse.vue` 更名为 `wrap-collapse.vue`（共 6 个示例）
  - feat(LiteFilter): 选完即查——默认不渲染查询按钮，重置按钮紧跟表单项
    - 自动查询：任意字段值变化（含主行 / 弹层重置、`defaultValue` 合并）后等待 `searchDebounce`（默认 300ms）抛一次 `search`；防抖窗口内的连续变化合并为一次，最后一次变化后计时
    - 新增 `showSearchButton`（默认 `false`）：显示查询按钮即回到手动查询并停止自动触发，`searchText` 仅在此时生效；`beforeSearch` 对两种模式同样拦截，异步钩子期间的重复触发被忽略；组件卸载时清理未触发的定时器
    - 布局：操作区去掉 `margin-left: auto` 并改为起始对齐，重置按钮紧跟最后一个字段；`showResetButton` 行为不变
    - 重置：主行重置恢复全部字段的 `defaultValue`，弹层重置只恢复高级字段；自动模式下重置引起的值变化同样补发一次查询，手动模式仍由 `searchOnReset` 决定
    - 兼容：默认行为变化——升级后 `search` 会在条件变化时自动触发；需要「确认后再查」的页面显式传 `showSearchButton`，或继续用 `actions` 插槽的 `search()` 自行放按钮
    - 测试：新增 7 个用例（默认无查询按钮与重置位置、`showSearchButton` 回到手动、防抖合并、`searchDebounce` 时长、`beforeSearch` 拦截自动查询、重置补发、弹层只留重置且只清自身字段），共 24 个用例全部通过
    - 文档：中英文文档新增「自动查询与重置」章节并同步 Props / Events / FAQ / 行为约定，示例新增 `search-mode.vue`（共 7 个示例）

- 2ec349d: - feat(ModalForm): 补齐弹窗表单能力与文档
  - 显隐：新增 `show` / `defaultShow`，支持受控与非受控；暴露 `open` / `close`，抛 `update:show` / `open` / `close`
  - 插槽：新增 `trigger`、`form`、`footer`、`header`、`header-extra`，默认插槽保留为 trigger 兼容回退
  - footer：新增 `hideFooter`、`confirmLoading`、`submitText` / `resetText` / `cancelText`，`footer` 插槽提供 `close` / `reset` / `submit` / `confirmLoading`
  - 提交：新增 `closeOnSubmit`，校验通过后按需自动关闭，提交失败不再静默吞掉
  - 数据：`model` 支持 `v-model:model`，新增 `defaultValue`
  - 透传：新增 `closable`、`maskClosable`、`closeOnEsc`、`blockScroll`、`autoFocus`、`trapFocus`、`displayDirective`、`zIndex`、`draggable`
  - 实例：暴露 `open` / `close` / `submit` / `reset` / `setFieldValue` / `form`
  - 类型：包入口导出 `ModalFormProps`、`ModalFormEmits`、`ModalFormExpose`、`ModalFormFooterScope`、`ModalFormColumn`
  - 文档：新增 playground 中英文 ModalForm 文档与 5 个示例

- 7df8054: - feat(ProLayout): 菜单选中态与展开态支持外部受控
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

- 08f487f: - feat(ProLayout): 补齐六个此前未消费的 props
  - `layout`：新增 `side` / `top` / `mix` 三种布局模式，共用同一份 `menus`；`mix` 下顶栏只渲染一级菜单并联动侧栏二级菜单，当前一级项没有 `children` 时不渲染侧栏
  - `logo`：顶栏标题左侧渲染 `h-8 w-auto` 的 logo 图片
  - `titleRender`：自定义标题渲染函数，返回值替换整个标题节点
  - `headerClass`：经 `tailwind-merge` 合并到 `header`，可覆盖内置的 `bg-zinc-800` 等类名
  - `collapsedTriggerPosition`：`top` / `bottom` 决定折叠按钮位置，默认 `bottom`
  - `menu`：新增 `MenuConfig`，支持 `collapsed`（初始折叠态）、`collapsedWidth`（同时作用于侧栏与 `NMenu`）、`collapsedIconSize`、`loading`、`request`（挂载时拉取远程菜单，第二个参数为 `menus`，失败时 `console.error` 并回退 `menus`）与 `onLoadingChange`（仅反映内部请求态）
  - fix(ProLayout): 折叠按钮默认只渲染一个（行为变更）
    - `0.7.31` 中顶栏与侧栏底部两个折叠按钮始终同时渲染，现在按 `collapsedTriggerPosition` 只渲染一个；需要顶栏按钮请显式传 `collapsed-trigger-position="top"`，`layout="top"` 下两者都不渲染
    - `collapsed` 默认值由 `false` 改为 `undefined`，未显式传入时初始折叠态取 `menu.collapsed`；显式传入时始终以根 `collapsed` 为准

- 655340d: - feat(ProLayout): 自动展开选中项并补齐实例方法
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

- 70de400: - feat(ProLayout): 新增移动端抽屉，通过 `mobileBreakpoint` 开启
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

- 08f487f: - feat(ProLayout): 新增侧栏与内容区定制能力，页脚支持插槽
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

- 86492c8: - feat(ProTable): 新增表格级 `request` 请求模式
  - 传入 `request` 后由 ProTable 托管 `data`、分页与 loading，在挂载、搜索/重置、翻页、改变每页条数、排序、筛选、`params` 变化时自动请求
  - `request(params, sorter, filters)` 返回 `{ data, total }`；`params` 为 `params` 与 `searchModel` 合并值并附加 `current` / `pageSize`
  - 快速连续请求只保留最后一次响应；请求失败通过 `useMessage` 提示
  - 未传 `request` 时保持原有受控模式行为；两者同时存在时 `request` 优先，`onQuery` 不再调用
  - 导出 `ProTableRequest` / `ProTableRequestParams` / `ProTableRequestResult` / `ProTableSorter` 类型
  - feat(ProTable): 新增 `searchModel` 双向绑定
    - 支持 `v-model:searchModel`，输入即同步；外部修改会回写到搜索表单
    - 新增 `submit` 事件，在搜索表单校验通过并提交时携带表单值
    - `reset` 事件可携带重置后的表单值（重置路径先抛出 `update:searchModel`）
    - 修复重置会「重置成当前输入值」的问题：重置目标改为组件创建时的 `params` / `searchModel` 快照加 `search.defaultValue`，ProForm 重置不再合并实时 `model`

  - feat(ProTable): 工具栏补齐删除 / 打印 / 导入
    - `toolbar.delete` 无选中行时禁用，点击抛出 `delete`，参数为选中行 key 数组
    - `toolbar.print` 抛出 `print` 并调用 `window.print()`
    - `toolbar.import` 打开文件选择器，选择后抛出 `import`；新增 `importAccept` 限制文件类型
    - 工具栏配置改为响应式，运行时修改 `toolbar` 立即生效（此前仅 `export` 生效）

  - feat(ProTable): 实现 `ProTableInstance` 方法集
    - `reload` / `setColumns` / `setSearch` / `setForm` / `setPagination` / `setTableData` / `setLoading` / `setSelectedRowKeys` / `setSelectedRows` / `setRowSelection` / `setColumnsState`
    - `setColumnsState` 同步列设置面板，仅内存生效不写 `localStorage`；传 `null` 恢复原始列
    - `setRowSelection` 仅记录状态（naive-ui 无表格级 `rowSelection`）；`setSelectedRowKeys` 不会反向驱动未受控的选中列

  - feat(ProTable): 支持动态列与表格样式
    - 运行时整体替换 `columns` 会同步更新表格列、搜索栏与列设置，无需再通过 `key` 重建组件
    - 新增 `dataTableStyle`，与 `height` 生成的样式合并后传给表格

  - feat(ProTable): 搜索栏配置生效
    - `search.showAdvancedButton` 为 `false` 时隐藏折叠按钮并强制展开
    - `search.showResetButton` 为 `false` 时隐藏重置按钮
    - 搜索按钮文案 `searchText` 优先，其次 `submitText`
    - 受控模式下 `params` 变化仍不会自动查询；请求模式下会与 `searchModel` 合并并重新请求

  - 注意：请求模式只向 `request` 传递单列排序（取 sorter 数组首项）；`toolbarConfig` 仍为废弃状态，请改用 `toolbar`

- cfe5c14: - feat(ProTabs): 按文档「已知限制」补齐能力
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

- d8e0b33: - feat(QueryFilter): 查询过滤组件完整增强与文档
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

- 2ec349d: - feat(StepsForm): 新增弹窗分步表单组件与文档
  - 结构：`NModal` + `NSteps` + 每步独立 `ProForm`，切换步骤时按当前步重新挂载
  - 流程：下一步先校验当前步并标记错误步，上一步免校验，最后一步提交各步合并值
  - 数据：`v-model:model` 合并各步字段，新增 `defaultValue` 作为初始值与重置目标
  - 提交：新增 `closeOnSubmit`、`confirmLoading`，配合异步提交；`next` / `submit` 返回 `Promise<boolean>`
  - 插槽：新增 `trigger`、`default`、`step`、`footer`、`header`、`header-extra`
  - 实例：暴露 `open` / `close` / `next` / `prev` / `submit` / `reset` / `setStep` / `setFieldValue` / `current` / `forms` / `form`
  - ProForm：新增 `validate()` 与 `getValues()` 实例方法
  - 类型：包入口导出 `StepsFormProps`、`StepsFormEmits`、`StepsFormExpose`、`StepsFormFooterScope`、`StepsFormStepScope`、`StepsFormStep`、`StepsFormColumn`
  - 文档：新增 playground 中英文 StepsForm 文档与 5 个示例

### Patch Changes

- 02fb416: - fix(ProTable): 修复新增列在列设置中被误隐藏的问题
  - 无 `key` 的列改用字符串 `title` 作为稳定标识（`type` 之后、位置索引之前）；此前用位置索引，中途插入新列会让旧持久化的隐藏项错位到新列上，表现为新列在列设置中未勾选、表格里不显示
  - 存储中没有记录的新列按其在 `columns` 中的声明位置插入，不再一律排到列设置列表末尾

- 02fb416: - feat(ProTable): 未配置 `columnStorageKey` 时默认使用当前路由名作为列设置 key
  - 通过组件实例代理读取 `$route.name`（兼容 vue-router 全局属性），不新增对 vue-router 的依赖
  - 非 vue-router 环境或匿名路由仍退回随机 key，行为与之前一致
  - 同一路由下多个未配置 key 的表格会共用偏好，开发环境会告警，建议显式传入唯一的 `columnStorageKey`

- d8e0b33: - refactor(QueryFilter/LiteFilter): 抽取共享字段渲染内核
  - 新增内部模块 `components/shared/field`，统一 valueType → 控件映射、占位符、初始值、搜索列排序与远程枚举加载
  - QueryFilter 与 LiteFilter 改为复用该内核，删除两份重复的渲染与加载实现
  - 公开类型、事件、插槽、实例方法与现有行为保持不变；ProForm 与 ProTable 搜索栏本期不涉及

## 0.7.31

### Patch Changes

- 修复表格塌陷，只剩下表头的问题

## 0.7.30

### Patch Changes

- fix: 修复列设置中会显示带有hideInTable:true 列的问题

## 0.7.29

### Patch Changes

- 修复 autoFlex 自适应高度与自动计算 scrollX

## 0.7.28

### Patch Changes

- 1. 新增列设置持久化存储功能
  2. 添加自动 Flex 布局高度适配功能

## 0.7.27

### Patch Changes

- fix: Add setFieldValue and model sync to ProForm

## 0.7.26

### Patch Changes

- fix(ProTable): 修复重置按钮点击导致的 bug

## 0.7.25

### Patch Changes

- fix(ProTable): 修复重置按钮点击导致 bug

## 0.7.24

### Patch Changes

- - fix(ProForm): 修复搜索模式下重置表单时未传递值的问题

    在搜索模式下重置表单时，现在会正确传递当前表单值作为 emit 参数。同时优化了默认值的处理逻辑，确保表单结构正确重建。

  - feat(ProTable): 添加搜索模型支持并优化导出参数
    - 新增 searchModel 属性支持双向绑定
    - 导出数据时传递搜索参数
    - 优化重置功能支持传入参数
    - 修复类型定义和组件引用

## 0.7.23

### Patch Changes

- fix(ProForm): 修复表单重置时未使用默认值的问题

  强制创建新表单结构时使用深拷贝避免引用共享问题，并在重置表单时正确处理默认值

## 0.7.22

### Patch Changes

- feat(docs/ProForm): 添加筛选重置示例并修复 grid-cols 绑定问题

  添加新的筛选重置示例组件 FilterReset.vue，并在文档中展示
  修复 RequestCascaderForm.vue 中 grid-cols 属性未绑定的问题

## 0.7.21

### Patch Changes

- perf(ProForm): 优化表单性能，减少不必要的渲染和请求
  - 使用 shallowRef 替代 reactive 减少响应式开销
  - 添加 columns 哈希缓存避免重复创建 formData
  - 记录已请求的 key 避免重复请求远程选项
  - 重构 renderFormItem 提高代码可读性

## 0.7.20

### Patch Changes

- feat(procomponent): 为 ProTable 搜索配置添加折叠功能

  在 SearchConfig 接口中新增 gridCollapsed 属性，用于控制搜索栏的折叠状态。
  该属性允许用户自定义搜索栏是否默认折叠，提升表格组件的灵活性和用户体验。

## 0.7.19

### Patch Changes

- style(ProTable/Toolbar): 调整工具栏按钮垂直居中

## 0.7.18

### Patch Changes

- fix(NaiveProvider): 添加 NDialogProvider 以优化组件嵌套结构

## 0.7.17

### Patch Changes

- feat(ProTable): 添加搜索栏列排序功能

## 0.7.16

### Patch Changes

- update to v0.7.16 release version
- a72f62f: - fix(procomponent): 修正表格列排序顺序错误
  - 将排序逻辑修改为按 order 降序排列
  - 修复了 order 未定义时的排序返回值问题
  - 确保列根据 order 属性正确排序展示

  - feat(naiveProvider): 添加 NConfigProvider 支持并定义组件 Props
    - 在 NaiveProvider 组件中引入并使用 NConfigProvider 包裹子组件
    - 将组件结构调整为支持 props 传递
    - 新增 types.ts 文件定义 NaiveProviderProps，继承 naive-ui 的 configProviderProps
    - 修改 setup 函数以便正确访问 props 和 slots
    - 修复 slots 默认内容变量名拼写错误

- 9bb022f: fix(table): 隐藏表格中姓名列以改善显示效果

## 0.7.16-alpha.1

### Patch Changes

- - fix(procomponent): 修正表格列排序顺序错误
    - 将排序逻辑修改为按 order 降序排列
    - 修复了 order 未定义时的排序返回值问题
    - 确保列根据 order 属性正确排序展示

  - feat(naiveProvider): 添加 NConfigProvider 支持并定义组件 Props
    - 在 NaiveProvider 组件中引入并使用 NConfigProvider 包裹子组件
    - 将组件结构调整为支持 props 传递
    - 新增 types.ts 文件定义 NaiveProviderProps，继承 naive-ui 的 configProviderProps
    - 修改 setup 函数以便正确访问 props 和 slots
    - 修复 slots 默认内容变量名拼写错误

## 0.7.16-alpha.0

### Patch Changes

- fix(table): 隐藏表格中姓名列以改善显示效果

## 0.7.15

### Patch Changes

- - fix(procomponents): 修复 NFormItemGi label 自定义显示
  - feat(procomponent): 【新增】ProForm 组件添加 reponsive 属性

## 0.7.14

### Patch Changes

- - feat(ProTable): 优化表格
  - fix: 修复在 tooltip 定义时，align 失效的问题
  - fix(Protable): 修复 ProTable 工具栏的新建按钮不显示的问题

## 0.7.13

### Patch Changes

- fixed to the some bugs with ProTable.

## 0.7.12

### Patch Changes

- 修复已知问题

# @banmao/procomponent

## 0.7.11

### Patch Changes

- optimize: 优化代码尺寸

## 0.7.10

### Patch Changes

- 修复列渲染失效的问题

## 0.7.9

### Patch Changes

- [ProTable] 新增 height 属性

## 0.7.8

### Patch Changes

- fix(ProTable): 修复表格 column.hideInForm 不生效的问题

## 0.7.7

### Patch Changes

- 1. feat: ProForm 添加搜索加载中动画
  2. feat(ProForm): 新增 searchText, submitText, resetText 属性

## 0.7.6

### Patch Changes

- 1. refactor: 添加废弃 prop 和 slot 的提示
  2. feat: 使用 search 属性替换 hideSearchbar 和 search-config
  3. fix: 修复 重置按钮无法重置为原始数据的问题
  4. fix: 修复 ProForm 初始值的问题
  5. fix: 修复 search 属性默认为 undefined, 新增 onQuery 属性方法, 搜索事件传递查询表单数据

## 0.7.5

### Patch Changes

- 修复 slots 警告

## 0.7.4

### Patch Changes

- 修复已知问题

## 0.7.3

### Patch Changes

- 1. [ProTable]: 优化默认不显示导出和添加按钮的功能

## 0.7.2

### Patch Changes

- fix: 修复 ProForm submit click preventdefault, compliant clipboardText

## 0.7.1

### Patch Changes

- update 0.7.1

## 0.7.0

### Minor Changes

- aa665d4: 重构 ProForm

### Patch Changes

- 修复已知问题
- ae82f76: 优化数字表单项默认显示 0 改为无默认值

## 0.7.0-beta.1

### Patch Changes

- 优化数字表单项默认显示 0 改为无默认值

## 0.7.0-beta.0

### Minor Changes

- 重构 ProForm

## 0.6.6

### Patch Changes

- queryfilter 组件

## 0.6.5

### Patch Changes

- 修复 QueryFilter 组件已知问题

## 0.6.4

### Patch Changes

- Protable 新增 statistics-card 插槽

## 0.6.3

### Patch Changes

- 修改 columnData 默认不显示表格列时,在列设置中也不显示

## 0.6.2

### Patch Changes

- 修复 Protable Column.type = index 搜索栏渲染问题

## 0.6.1

### Patch Changes

- - Protable:
    1. 内置导出和添加按钮
    2. 添加按钮支持 createButtonMode: button, modal, drawer 三种模式

## 0.6.0

### Minor Changes

- 新增 LinkDiagram 组件

## 0.5.0

### Minor Changes

- 添加 ProDescriptions, ProList

## 0.4.3

### Patch Changes

- feat: 新增 column.type = 'index' 来渲染序号

## 0.4.2

### Patch Changes

- fix: 修复 ModalForm,DrawerForm 组件无关闭的函数

## 0.4.1

### Patch Changes

- Watermark: 修复颜色不可控;新增旋转角度

## 0.4.0

### Minor Changes

- 新增水印功能

## 0.3.18

### Patch Changes

- fix(protable): 优化无值的单元格渲染"

## 0.3.17

### Patch Changes

- ProTable: 添加自定义渲染空单元格

## 0.3.16

### Patch Changes

- 新增表格列设置功能

## 0.3.15

### Patch Changes

- 添加 columnsetting

## 0.3.14

### Patch Changes

- fix(DrawerForm): 修复默认值无法回显的问题"

## 0.3.13

### Patch Changes

- feat(ProTable): 新增 hideSearchbar 属性, 用于隐藏搜索栏"

## 0.3.12

### Patch Changes

- 复制按钮问题

## 0.3.11

### Patch Changes

- 优化 ProText 组件

## 0.3.10

### Patch Changes

- 优化 ProText 组件的复制功能

## 0.3.9

### Patch Changes

- drawerForm 新增 default,trigger,footer 插槽

## 0.3.8

### Patch Changes

- fix(ProForm): 修改默认不显示表格中的 key=action,actions 和 type='selection'

## 0.3.7

### Patch Changes

- 1. ModalForm 添加 trigger button 插槽
  2. DrawerForm 添加 trigger button 插槽

## 0.3.6

### Patch Changes

- 新增 ProTable Component
- 新增 QueryFilter Component
- 新增 ProText Component
- 新增 ModalForm component
- 新增 DrawerForm Component
- 新增 ProForm Component
