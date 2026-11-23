---
"@banmao/procomponent": minor
---

- feat(LiteFilter): 改为独立紧凑筛选条，内部不再使用栅格布局

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
