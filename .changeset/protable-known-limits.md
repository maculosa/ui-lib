---
"@banmao/procomponent": minor
---

- feat(ProTable): 新增表格级 `request` 请求模式

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
