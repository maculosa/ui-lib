---
name: ProTable
desc: ProTable 是基于 Naive UI DataTable 的高级表格组件，用一份 columns 同时驱动表格、搜索栏与新增表单，内置工具栏、列设置、密度切换与高度自适应。
---

<route lang="yaml">
  meta:
    layout: default
</route>

# ProTable

ProTable 是基于 Naive UI `NDataTable` 封装的高级表格组件。它把「搜索栏 + 工具栏 + 表格 + 分页」组合成一个开箱即用的业务表格，并用**同一份 `columns` 配置**同时驱动表格列、搜索表单项和新增表单项，避免同一套字段在三处重复定义。

当前文档对应 `@banmao/procomponent@0.8.0`。

## 特性

- **一份配置三处复用**：`columns` 通过 `hideInTable` / `hideInSearch` / `hideInForm` 控制在表格、搜索栏、新增表单中的可见性
- **内置搜索栏**：按 `valueType` 自动渲染控件，支持远程枚举、栅格布局、折叠展开、防抖查询
- **内置工具栏**：新增（按钮 / 弹窗 / 抽屉三种模式）、删除、导出、打印、导入、刷新、密度切换、列设置
- **表格级 request**：传入 `request` 后由 ProTable 托管数据、分页与 loading，搜索 / 翻页 / 排序 / 筛选自动重新请求
- **列设置持久化**：拖拽排序 + 勾选显隐，按 `columnStorageKey` 写入 `localStorage`
- **高度自适应**：`autoFlex` 填充 Flex 容器，或用 `height` / `max-height` 固定高度
- **固定列自动横向滚动**：存在固定列且未显式配置 `scroll-x` 时自动估算总宽度
- **实例方法**：`reload` / `setColumns` / `setSearch` / `setTableData` 等，支持外部控制表格
- **完整透传 NDataTable**：`data`、`pagination`、`row-key`、`remote`、`striped` 等原生属性与分页事件可直接使用

## 何时使用

- 后台管理系统的列表页：需要查询条件、分页、批量操作、列设置
- 字段较多、且查询条件与表格列高度重合的场景
- 需要统一表格视觉与交互规范的业务页面

不需要搜索栏和工具栏、只展示数据时，使用 `simple` 模式即可退化为原生 `NDataTable`。

## 快速上手

### 安装

```script-tabs
@banmao/procomponent
```

### 按需引入

```vue
<script setup>
import { ProTable } from '@banmao/procomponent'
</script>
```

### 全局注册

```ts
import { createApp } from 'vue'
import { ProTablePlugin } from '@banmao/procomponent'
import App from './App.vue'

createApp(App).use(ProTablePlugin).mount('#app')
```

> ProTable 内部使用 `useMessage` 做失败提示，请确保应用外层包裹了 `NMessageProvider`（或直接使用 `NaiveProvider`）。

### 基本使用

ProTable 的数据属性沿用 Naive UI 的 **`data`**，列字段使用 **`key`**（不是 `dataSource` / `dataIndex`）。

```vue
<template>
  <ProTable
    title="用户列表"
    :columns="columns"
    :data="dataSource"
    :loading="loading"
    :on-query="handleQuery"
  />
</template>

<script setup>
import { ref } from 'vue'
import { ProTable } from '@banmao/procomponent'

const loading = ref(false)
const dataSource = ref([])

// 每一列都要写 valueType，否则该字段不会出现在搜索栏中
const columns = [
  { title: '姓名', key: 'name', valueType: 'text' },
  { title: '年龄', key: 'age', valueType: 'digit' },
  {
    title: '性别',
    key: 'gender',
    valueType: 'select',
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
    ],
    render: row => (row.gender === 'male' ? '男' : '女'),
  },
  { title: '邮箱', key: 'email', valueType: 'text', hideInSearch: true },
]

// 点击搜索 / 重置时触发，参数为搜索表单的当前值
async function handleQuery(params) {
  loading.value = true
  try {
    dataSource.value = await fetchUsers(params)
  }
  finally {
    loading.value = false
  }
}
</script>
```

### 带分页的完整用法

ProTable **不托管分页状态**，`pagination` 由业务侧维护，翻页通过 `@update:page` / `@update:page-size` 回传。服务端分页需要额外加 `remote`。

```vue
<template>
  <ProTable
    title="用户列表"
    column-storage-key="user-list"
    :columns="columns"
    :data="dataSource"
    :loading="loading"
    :pagination="pagination"
    :row-key="row => row.id"
    :on-query="handleQuery"
    :search="{ gridCols: 3, searchText: '查询' }"
    :toolbar="{ create: true, export: true }"
    remote
    @update:page="handlePageChange"
    @update:page-size="handlePageSizeChange"
    @create="handleCreate"
    @export-data="handleExport"
  />
</template>

<script setup>
import { ref } from 'vue'
import { ProTable } from '@banmao/procomponent'

const dataSource = ref([])
const loading = ref(false)
const query = ref({})

const pagination = ref({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  showQuickJumper: true,
  pageSizes: [10, 20, 50],
  prefix: ({ itemCount }) => `共 ${itemCount} 条`,
})

async function loadData() {
  loading.value = true
  try {
    const res = await fetchUsers({
      pageNum: pagination.value.page,
      pageSize: pagination.value.pageSize,
      ...query.value,
    })
    dataSource.value = res.list
    pagination.value.itemCount = res.total
  }
  finally {
    loading.value = false
  }
}

async function handleQuery(params) {
  query.value = params
  pagination.value.page = 1
  await loadData()
}

function handlePageChange(page) {
  pagination.value.page = page
  loadData()
}

function handlePageSizeChange(pageSize) {
  pagination.value.pageSize = pageSize
  pagination.value.page = 1
  loadData()
}

function handleCreate() {
  // 打开业务侧的新增弹窗
}

function handleExport(params) {
  // params 为最近一次搜索条件
}

loadData()
</script>
```

## 核心概念

### 一份 columns 驱动三处

`columns` 会被拆成四组派生列：

| 派生列 | 用途 | 过滤规则 |
| --- | --- | --- |
| `tableColumns` | 表格实际渲染的列 | 排除 `hideInTable: true`，再经列设置面板勾选与排序 |
| `searchColumns` | 搜索栏表单项 | 排除 `type: 'selection'`、`type: 'index'`、`key` 为 `action` / `actions`、`hideInSearch: true`；按 `order` 排序 |
| `formColumns` | 新增弹窗/抽屉的表单项 | 排除 `hideInForm: true`、`type: 'selection'`、`type: 'index'`、`key: 'actions'` |
| `settingColumns` | 列设置面板的候选列 | 排除 `hideInTable: true` |

由此得到几条实践约定：

- **操作列固定用 `key: 'actions'`**，这样它不会污染搜索栏和新增表单
- **只想查询、不想展示的字段**（如日期区间）设 `hideInTable: true`
- **只想展示、不想查询的字段**设 `hideInSearch: true`
- **搜索栏排序**由 `order` 权重 + `search.sort` 决定，默认 `desc`，即权重大的靠前

```ts
const columns = [
  { type: 'selection' },
  { type: 'index' },
  { title: '姓名', key: 'name', valueType: 'text', order: 100 },
  // 仅作为查询条件，不在表格中显示
  { title: '创建时间', key: 'createTime', valueType: 'daterange', hideInTable: true, order: 90 },
  // 仅展示，不参与查询
  { title: '备注', key: 'remark', valueType: 'text', hideInSearch: true },
  { title: '操作', key: 'actions', width: 160, fixed: 'right', render: row => renderActions(row) },
]
```

### 数据加载模型

两种互斥的数据模式，二选一：

| 模式 | 触发条件 | 数据 / 分页 / loading 由谁维护 |
| --- | --- | --- |
| 受控模式（默认） | 不传 `request` | 业务侧，通过 `data` / `pagination` / `loading` 与事件自行维护 |
| 请求模式 | 传入 `request` | ProTable |

**受控模式**：ProTable 自身不请求数据。

| 入口 | 触发时机 | 说明 |
| --- | --- | --- |
| `onQuery` | 点击搜索按钮、点击重置按钮 | 参数为搜索表单当前值；内部有 **300ms 防抖**；未传时搜索会告警且不执行 |
| `@update:page` / `@update:page-size` | 翻页、改变每页条数 | 由 NDataTable 透传，业务侧自行重新请求 |
| `@load-data` | **仅点击工具栏刷新按钮** | 回调参数固定为 `1`，语义是「回到第一页重新加载」 |

`onQuery` 与刷新过程中抛出的异常会被捕获，并通过 `useMessage` 提示「搜索失败，请重试」/「刷新失败，请重试」。

**请求模式**：传入 `request` 后进入请求模式，ProTable 托管 `data`、分页与 loading，并在以下时机自动调用：

- 组件挂载
- 搜索提交、搜索重置
- 翻页、改变每页条数、排序、筛选
- `params` 变化（自动回到第一页）

```ts
type ProTableRequest = (
  params: { current: number, pageSize: number, [key: string]: any },
  sorter: { columnKey?: string | number, order?: 'ascend' | 'descend' } | null,
  filters: Record<string, any[] | null>,
) => Promise<{ data: any[], total?: number }>
```

- `params` 为 `params` 与 `searchModel` 合并后的查询条件，并附加 `current` / `pageSize`
- `total` 用于计算分页总条数；`sorter` 未排序时为 `null`
- 请求失败会通过 `useMessage` 提示「加载失败，请重试」；快速连续请求只保留最后一次响应
- 工具栏刷新在请求模式下直接调用 `request`，**不再触发** `loadData`
- `request` 与 `onQuery` 同时存在时，`request` 优先，`onQuery` 不会被调用

> 从 `@banmao/procomponent` 可直接导入 `ProTableRequest`、`ProTableRequestParams`、`ProTableRequestResult`、`ProTableSorter` 类型。

### 搜索栏

- **默认显示**，只有显式传 `:search="false"` 才会隐藏
- `search` 传对象时，其字段会覆盖到内部 ProForm 上，因此 ProForm 的 `gridCols`、`gridCollapsed`、`gridCollapsedRows`、`labelWidth` 等属性都可以直接写在这里
- 搜索栏固定 `showFeedback: false`，即不展示校验错误文案，但校验仍会拦截提交
- `showAdvancedButton` 为 `false` 时折叠按钮隐藏并强制展开；未配置时由内部 overflow 检测决定是否出现
- 按钮文案：搜索按钮优先取 `searchText`，其次 `submitText`，默认「搜索」；重置按钮用 `resetText`（默认「重置」）
- `showResetButton` 为 `false` 时隐藏重置按钮
- 搜索表单与 `searchModel` 双向同步：输入即触发 `update:searchModel`，提交、重置、`setSearch` 也会同步；外部修改 `searchModel` 会回写到表单
- 重置目标值取「组件创建时的 `params` / `searchModel` 快照 + `search.defaultValue`」，不会保留当前输入；因此重置事件携带的是回到默认值之后的表单值

### 工具栏

工具栏位于卡片右上角，从左到右依次是：`toolbar` 插槽内容 → 新增 → 删除 → 导出 → 打印 → 导入 → 刷新 / 密度 / 列设置按钮组。

- `create`、`delete`、`export`、`print`、`import` **默认隐藏**，需要显式开启
- `reload`、`density`、`columnSetting` **默认显示**，需要显式传 `false` 才会隐藏
- `createMode` 为 `modal` / `drawer` 时，新增按钮会被 `ModalForm` / `DrawerForm` 包裹，表单列取 `formColumns`，标题为 `${createLabel} ${title}`；点击按钮同时触发 `create` 事件
- 删除按钮在没有选中行时禁用，点击后抛出 `delete`，参数为当前选中行的 key 数组
- 打印按钮抛出 `print` 后调用浏览器 `window.print()`
- 导入按钮打开文件选择器，选择文件后抛出 `import`，参数为 `File`；`importAccept` 可限制文件类型
- 工具栏配置**全部响应式**，运行时修改 `toolbar` 会立即反映到界面
- 密度切换提供「默认 / 中等 / 紧凑」三档，对应表格 `size` 的 `large` / `medium` / `small`

### 高度与滚动

四种方式，按场景择一：

| 方式 | 适用场景 | 说明 |
| --- | --- | --- |
| 不配置 | 页面整体滚动 | 表格高度由数据行数决定 |
| `:height="400"` | 表格区域定高 | 单位为 px，内部自动开启 `flex-height` |
| `:max-height="600"` | 限制最大高度 | NDataTable 原生属性，超出后表体滚动 |
| `auto-flex` | 填满 Flex 剩余空间 | 要求祖先容器定高且为纵向 flex 布局 |

`autoFlex` 的典型容器写法：

```vue
<template>
  <!-- 外层必须定高，且是纵向 flex -->
  <div style="height: 100vh; display: flex; flex-direction: column;">
    <div>页面头部</div>
    <ProTable auto-flex :columns="columns" :data="dataSource" :on-query="handleQuery" />
  </div>
</template>
```

**固定列与横向滚动**：当可见列中存在 `fixed` 且未显式配置 `scroll-x` 时，ProTable 会按列宽估算总宽度并自动设置 `scroll-x`，避免固定列失效。估算规则为：已配置 `width` 直接采用；`selection` / `expand` 按 48px；分组列累加子列；其余按标题字符数估算（中文 16px、其他 8px，含 32px 内边距），下限 140px，并受 `minWidth` / `maxWidth` 约束。显式传入 `scroll-x` 时以传入值为准。

**表格样式**：`dataTableStyle` 会与 `height` 生成的 `style` 合并后传给表格，优先级为 `height` < `dataTableStyle`；使用 `autoFlex` 时 `flex: 1` / `min-height: 0` 最后生效，保证布局不被覆盖。传字符串时仅在不使用 `autoFlex` 时整体生效。

## 代码示例

> **默认值约定**：搜索栏默认值中，选择类、日期类字段请设为 `null`，文本类设为 `''`。这样重置后控件才能正确回到空态；用 `undefined`、或给日期控件传 `''`，都可能导致显示异常。

### 基础展示

<Demo title="简单模式"
desc="传入 simple 后退化为原生 NDataTable，不渲染搜索栏、工具栏与卡片容器，适合纯数据展示。"
:raw="SimpleDemoRaw">

<SimpleDemo />

</Demo>

<Demo
title="基础模式"
desc="搜索栏 + 工具栏 + 分页 + 多选 + 序号列的完整组合，覆盖大多数列表页场景。"
:raw="BaseRaw">

<Base />

</Demo>

<Demo
title="无搜索栏模式"
desc="显式传入 search=false 隐藏搜索栏，仅保留工具栏与表格。"
:raw="NoSearchbarRaw">

<NoSearchbar />

</Demo>

<Demo
title="列提示模式"
desc="列配置 tooltip 后，表头文字右侧出现信息图标，hover 显示说明；搜索栏 label 同步生效。"
:raw="UseTooltipInColumnsRaw">

<UseTooltipInColumns />

</Demo>

### 搜索栏

<Demo
title="搜索网格模式"
desc="通过 search.gridCols 控制搜索栏每行字段数，条件较多时配合自动折叠展开。"
:raw="SearchGridRaw">

<SearchGrid />

</Demo>

<Demo
title="查询表格模式"
desc="以查询为核心的表格：onQuery 接收搜索表单值，业务侧据此请求接口并回填 data。"
:raw="QueryTableRaw">

<QueryTable />

</Demo>

<Demo
title="重置搜索模式"
desc="配合 @banmao/hooks 的 useList 管理数据与分页；点击重置会带默认值重新触发 onQuery。"
:raw="ResetSearchRaw">

<ResetSearch />

</Demo>

<Demo
title="搜索引用模式"
desc="通过 ref 拿到 searchRef（搜索栏卡片 DOM）与 searchFormRef（表单实例），用于外部测量或控制。"
:raw="SearchRefDemoRaw">

<SearchRefDemo />

</Demo>

<Demo
title="外部交互赋值表格搜索框"
desc="统计卡片下钻：外部事件改写查询条件后主动调用查询，实现卡片与表格联动。"
:raw="StatisticToSearchRaw" >
<StatisticToSearch />
</Demo>

<Demo
title="选择组模式"
desc="搜索栏内的下拉选择与页面外部控件共享同一份查询条件，适合标签化、可组合的筛选。"
:raw="SelectGroupDemoRaw">

<SelectGroupDemo />

</Demo>

### 数据请求

<Demo
title="表格级 request"
desc="传入 request 后，搜索、翻页、排序、筛选都由 ProTable 自动发起请求；返回 { data, total } 即可，无需再维护 data 与 pagination。"
:raw="RequestModeRaw">

<RequestMode />

</Demo>

<Demo
title="搜索模型双向绑定"
desc="通过 v-model:searchModel 读写查询条件：外部按钮可直接改条件，@submit 在每次提交时携带表单值。"
:raw="SearchModelRaw">

<SearchModel />

</Demo>

### 工具栏与新增

<Demo
title="表单创建模式"
desc="createMode 为 button 时，点击新增只抛出 create 事件，由业务侧自行打开表单。"
:raw="CreateDemoRaw">

<CreateDemo />

</Demo>

<Demo
title="弹窗创建模式"
desc="createMode 为 modal 时，新增按钮由 ModalForm 包裹，表单列自动取 columns 中未隐藏于表单的字段。"
:raw="CreateModalDemoRaw">

<CreateModalDemo />

</Demo>

<Demo
title="工具栏插槽模式"
desc="toolbar 插槽内容渲染在工具栏最左侧，用于补充导入等自定义操作。"
:raw="ToolbarSlotDemoRaw">

<ToolbarSlotDemo />

</Demo>

<Demo
title="删除与导入"
desc="开启 toolbar.delete / import 后按钮自动出现：删除按钮无选中行时禁用，抛出的 delete 携带选中 key；导入选择文件后抛出 File。"
:raw="ToolbarActionsRaw">

<ToolbarActions />

</Demo>

<Demo
title="操作按钮模式"
desc="操作列使用 Actions 组件，超出 showNum 的按钮自动收进下拉菜单。"
:raw="ActionsDemoRaw">

<ActionsDemo />

</Demo>

### 高度

<Demo
title="固定高度模式"
desc="用 max-height / min-height 锁定表格高度，数据超出时表体滚动、表头保持可见。"
:raw="FixedHeightRaw">

<FixedHeight />

</Demo>

### 实例方法

<Demo
title="通过 ref 控制表格"
desc="调用 setColumns 动态增删列、setColumnsState 应用列显隐、setSearch 设置查询条件，以及 setLoading 模拟外部加载。"
:raw="InstanceMethodsRaw">

<InstanceMethods />

</Demo>

## 进阶用法

### 请求模式（request）

传入表格级 `request` 后，ProTable 会自行维护数据、分页与 loading，业务侧只需返回 `{ data, total }`：

```vue
<script setup>
import { ProTable } from '@banmao/procomponent'
import { ref } from 'vue'

const searchParams = ref({})

async function fetchUsers(params, sorter, filters) {
  // params: { ...searchParams, current, pageSize }
  const { list, total } = await api.getUsers({
    page: params.current,
    pageSize: params.pageSize,
    name: params.name,
    sortKey: sorter?.columnKey,
    sortOrder: sorter?.order,
    ...filters,
  })
  return { data: list, total }
}
</script>

<template>
  <!-- searchParams 变化时自动回到第一页重新请求 -->
  <ProTable :columns="columns" :request="fetchUsers" :params="searchParams" :row-key="row => row.id" />
</template>
```

请求模式下的要点：

- 搜索提交与重置都会回到第一页并重新请求；`onQuery` 不再被调用
- 翻页 / 改变每页条数 / 排序 / 筛选的 `onUpdate*` 回调仍会先调用，再自动请求，可用于埋点或同步外部状态
- 分页状态内部维护，传入的 `pagination` 用于初始化页码与附加配置（如 `showSizePicker`）
- 快速切换条件时旧响应会被丢弃，不会覆盖新数据

### 远程枚举

给列配置 `request`，ProForm 会在挂载时**无参调用** `request()` 并把结果作为选项，同一 `key` 不会重复请求；只有 `request` 函数引用变化时才会重新拉取。

```ts
const columns = [
  {
    title: '城市',
    key: 'city',
    valueType: 'cascader',
    // 返回 SelectOption[]；级联数据可带 children
    request: () => fetchCityList(),
  },
  {
    title: '状态',
    key: 'status',
    valueType: 'select',
    // 静态选项直接用 options，无需 request
    options: [
      { label: '启用', value: 1 },
      { label: '停用', value: 0 },
    ],
  },
]
```

同时配置 `options` 与远程结果时，**`options` 优先**。若列上带有 `defaultValue`，会按默认路径逐级拉取子节点后再展开。

### 自定义表单项

`valueType: 'custom'` 配合 `formRender` 可以完全接管控件渲染：

```ts
{
  title: '标签',
  key: 'tags',
  valueType: 'custom',
  // key: 字段名；model: 表单数据 ref；props: 列上的 formItemProps
  formRender: (key, model, props) => h(NSelect, {
    value: model.value[key],
    'onUpdate:value': v => (model.value[key] = v),
    multiple: true,
    tag: true,
    ...props,
  }),
}
```

### 表单校验与控件属性

- **校验规则写在列的 `rule` 上**（单数），会传给 `NFormItemGi`
- **`formItemProps` 是透传给底层控件的属性**，不是 FormItem 属性。例如 `{ min: 1 }` 作用于 `NInputNumber`，`{ type: 'textarea' }` 作用于 `NInput`，`{ multiple: true }` 作用于 `NSelect`
- 控件默认带 `clearable: true` 和自动生成的 placeholder（`请输入${title}` / `请选择${title}`），可被 `formItemProps` 覆盖

```ts
{
  title: '年龄',
  key: 'age',
  valueType: 'digit',
  rule: [{ required: true, type: 'number', message: '请输入年龄', trigger: ['blur', 'change'] }],
  formItemProps: { min: 0, max: 150, placeholder: '请输入年龄' },
}
```

### 列设置与持久化

列设置面板支持拖拽排序、勾选显隐、全选与重置。配置 `columnStorageKey` 后，偏好会写入 `localStorage`：

```text
pro-table:column-setting:<columnStorageKey>
```

存储内容为 `{ order: string[], hidden: string[] }`。要点：

- **key 必须全局唯一**，推荐直接用路由 name，例如 `column-storage-key="user-list"`
- 未配置时会退化为每个实例随机生成的 key，**刷新后偏好丢失**，开发环境会打印告警
- 面板中的「重置」会删除该 key 的存储，并回到 `columns` 的原始顺序与 `hideInTable` 配置
- 列的标识取 `key`，缺失时回退到 `type`，再回退到位置索引；**建议每列都写 `key`**，否则增删列会导致偏好错位
- 后续新增的列（存储中没有记录）按 `hideInTable` 决定显隐，并排在末尾

### 外部控制搜索表单

ProTable 通过 `expose` 暴露 `searchFormRef`，其上有 `submit` / `reset` / `setFieldValue` 三个方法：

```vue
<script setup>
import { ref } from 'vue'
import { ProTable } from '@banmao/procomponent'

const tableRef = ref(null)

function searchThisMonth() {
  const form = tableRef.value?.searchFormRef
  form?.setFieldValue('createTime', ['2026-11-01', '2026-11-30'])
  form?.submit() // 走校验 + 防抖，最终触发 onQuery
}

function clearSearch() {
  tableRef.value?.searchFormRef?.reset()
}
</script>

<template>
  <NButton @click="searchThisMonth">本月</NButton>
  <NButton @click="clearSearch">清空</NButton>
  <ProTable ref="tableRef" :columns="columns" :data="dataSource" :on-query="handleQuery" />
</template>
```

### 实例方法与动态列

除了 `searchFormRef`，ProTable 实例还提供一组控制表格的方法：

```ts
const tableRef = ref(null)

// 替换列配置，表格、搜索栏与列设置面板同步更新
tableRef.value?.setColumns(nextColumns)

// 应用列顺序与显隐（等价于操作列设置面板，仅内存生效）
tableRef.value?.setColumnsState({ order: ['name', 'age'], hidden: ['age'] })
tableRef.value?.setColumnsState(null) // 恢复 columns 的原始顺序与 hideInTable

// 增量设置查询条件（会抛出 update:searchModel）
tableRef.value?.setSearch({ name: '张三' })

// 直接替换数据 / 控制 loading（受控模式下使用）
tableRef.value?.setTableData(rows)
tableRef.value?.setLoading(true)

// 刷新：request 模式重新请求当前页，否则抛出 loadData(1)
tableRef.value?.reload()
```

`columns` 支持在运行时整体替换（包括通过 `setColumns`），表格列、搜索栏与列设置都会随之重建，无需再用 `key` 重建组件。

### 配合 useList

`@banmao/hooks` 的 `useList` 封装了 loading、分页、导出与翻页回调，与 ProTable 是推荐组合：

```vue
<script setup>
import { ref } from 'vue'
import { ProTable } from '@banmao/procomponent'
import { useList } from '@banmao/hooks'

const searchModel = ref({})

const { dataSource, loading, pagination, loadData, handlePageChange, handlePageSizeChange }
  = useList(fetchUserPage, { filterOption: searchModel })

async function handleQuery(params) {
  searchModel.value = params
  await loadData(1)
}
</script>

<template>
  <ProTable
    :columns="columns"
    :data="dataSource"
    :loading="loading"
    :pagination="pagination"
    :row-key="row => row.id"
    :on-query="handleQuery"
    remote
    @update:page="handlePageChange"
    @update:page-size="handlePageSizeChange"
    @load-data="loadData"
  />
</template>
```

`useList` 期望接口返回 `{ status: 200, data: { list, total, pageNum, pageSize } }`；结构不同时用 `callback` 做转换。

### 行选择与批量操作

`selection-action` 插槽渲染在表格上方，**不带插槽参数**，选中项需要业务侧通过 `@update:checked-row-keys` 自行维护：

```vue
<script setup>
import { ref } from 'vue'
import { ProTable } from '@banmao/procomponent'

const checkedKeys = ref([])

function batchDelete() {
  // 使用 checkedKeys.value 调用批量删除接口
}
</script>

<template>
  <ProTable
    :columns="columns"
    :data="dataSource"
    :row-key="row => row.id"
    :checked-row-keys="checkedKeys"
    @update:checked-row-keys="keys => (checkedKeys = keys)"
  >
    <template #selection-action>
      <NAlert v-if="checkedKeys.length" type="info" :bordered="false">
        已选 {{ checkedKeys.length }} 项
        <NButton text type="error" @click="batchDelete">批量删除</NButton>
      </NAlert>
    </template>
  </ProTable>
</template>
```

别忘了在 `columns` 中加入 `{ type: 'selection' }`。

### 统计区域

`summary` 插槽渲染在搜索栏卡片与表格卡片之间，同样不带插槽参数：

```vue
<template>
  <ProTable :columns="columns" :data="dataSource">
    <template #summary>
      <NCard>合计金额：{{ totalAmount }} 元</NCard>
    </template>
  </ProTable>
</template>
```

需要 NDataTable 原生的表尾合计行时，请使用**表格级** `summary` 属性（函数，直接透传），并可用 `summary-placement` 控制其位置。

### 行操作列

```tsx
import { Actions } from '@banmao/procomponent'

const columns = [
  {
    title: '操作',
    key: 'actions',
    width: 160,
    fixed: 'right',
    render: row => (
      <Actions
        showNum={2}
        items={[
          { label: '编辑', key: 'edit', variant: 'primary', onClick: () => handleEdit(row) },
          { label: '详情', key: 'detail', variant: 'info', onClick: () => handleDetail(row) },
          { label: '删除', key: 'delete', variant: 'error', onClick: () => handleDelete(row) },
        ]}
      />
    ),
  },
]
```

`Actions` 的 `showNum` 默认为 2，超出的操作收进下拉菜单；`align` 控制对齐，默认 `left`。

### 单元格增强

- **空值占位**：ProTable 内置 `renderCell`，`null` / `undefined` / `''` 统一渲染为 `-`；`0`、`false` 等有效值正常显示
- **序号列**：`{ type: 'index' }` 默认宽 56px、标题「序号」、居中对齐，渲染为圆形徽标，可被列配置覆盖
- **可复制**：`copyable: true` 使用默认配置（不省略、单行）；需要多行截断时传对象 `copyable: { ellipsis: true, lineClamp: 2 }`。该渲染由内部 `ProText` 完成，会**覆盖列上自定义的 `render`**

<div class="table-responsive">

## API

### Props

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| simple | 简单模式，仅渲染 NDataTable，不含搜索栏、工具栏与卡片 | `boolean` | `false` | |
| title | 卡片标题，同时用于新增弹窗标题拼接 | `string` | `'数据列表'` | |
| columns | 列配置，同时驱动表格、搜索栏与新增表单；运行时整体替换会同步更新 | `ProTableColumn[]` | `[]` | |
| request | 表格级请求函数，传入后托管数据、分页与 loading | `ProTableRequest` | - | 0.8.0 |
| loading | 表格加载态，同时驱动搜索按钮 loading 与刷新图标动画 | `boolean` | `false` | |
| search | 搜索栏配置，`false` 时隐藏搜索栏 | `false \| SearchConfig` | `undefined`（显示） | |
| searchModel | 搜索模型，支持 `v-model:searchModel` 双向绑定 | `Record<string, any>` | `{}` | 0.8.0 |
| toolbar | 工具栏配置，**推荐使用** | `ToolbarConfig` | `{ createMode: 'button' }` | |
| toolbarConfig | 工具栏配置，已废弃，后续版本移除；与 `toolbar` 同时存在时被 `toolbar` 覆盖 | `ToolbarConfig` | `{ createMode: 'button' }` | |
| params | 请求模式的额外参数，变化时自动重新加载并回到第一页；同时作为搜索表单初值（`searchModel` 优先） | `Record<string, any>` | - | 0.8.0 |
| onQuery | 受控模式查询回调，搜索与重置时触发，内部 300ms 防抖；请求模式下不调用 | `(params: Record<string, any>) => Promise<void>` | - | |
| dataTableStyle | 表格 `style`，与 `height` 生成的样式合并 | `string \| Record<string, any>` | - | 0.8.0 |
| height | 表格高度（px），设置后自动开启 `flex-height` | `number` | - | |
| autoFlex | 填充 Flex 容器剩余高度，要求祖先定高且纵向 flex | `boolean` | `false` | 0.7.28 |
| columnStorageKey | 列设置持久化 key，需全局唯一，推荐用路由 name | `string` | `''` | 0.7.28 |

> 受控模式下 `params` **不会**自动合并进 `onQuery` 的参数，也**不会**在其变化后自动重新查询——它只在搜索表单挂载时读取一次。请求模式下 `params` 会与 `searchModel` 合并进 `request`，并在变化时自动重新请求。

### 透传的 NDataTable 属性

ProTable 的 props 合并了 naive-ui 的 `dataTableProps`，除上表自有属性外，其余原生属性与事件均可直接使用，例如：

| 属性 / 事件 | 说明 |
| --- | --- |
| `data` | 表格数据源（**不是 `dataSource`**）；请求模式下由 ProTable 托管，传入值仅作为初始值 |
| `pagination` | 分页配置；受控模式状态由业务侧维护，请求模式由 ProTable 托管 |
| `row-key` | 行唯一标识，多选、展开、树形数据必需 |
| `remote` | 服务端分页/排序/筛选；请求模式下自动为 `true` |
| `max-height` / `min-height` | 表体最大/最小高度 |
| `scroll-x` | 横向滚动宽度；存在固定列且未配置时自动估算 |
| `striped` / `bordered` / `bottom-bordered` / `single-line` | 表格外观 |
| `checked-row-keys` / `expanded-row-keys` | 受控选中项 / 展开项 |
| `summary` / `summary-placement` | 表尾合计行及其位置 |
| `@update:page` / `@update:page-size` | 翻页 / 改变每页条数 |
| `@update:checked-row-keys` | 选中项变化 |
| `@update:sorter` / `@update:filters` | 排序 / 筛选变化 |

请求模式下，上述 `onUpdate*` 回调会先被调用，随后 ProTable 自动发起请求。

以下属性由 ProTable 内部接管，**外部传入会被覆盖**：

| 属性 | 内部行为 |
| --- | --- |
| `columns` | 使用派生后的 `tableColumns` |
| `size` | 由密度按钮控制，初始 `large` |
| `render-cell` | 固定为空值占位渲染（空值显示 `-`） |
| `flex-height` | 由 `autoFlex` / `height` 推导 |
| `remote` | 请求模式固定 `true` |
| `style` | `height` 会覆盖为 `{ height: 'Npx' }`，再与 `dataTableStyle` 合并；`autoFlex` 最后追加 `flex: 1` 与 `min-height: 0` |

### SearchConfig

`search` 传对象时，字段会覆盖到内部 ProForm，因此除下表外还可使用 ProForm 的 `gridCollapsedRows`、`responsive` 等属性。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| gridCols | 搜索栏每行字段数 | `number` | `3` |
| gridCollapsed | 是否折叠搜索栏 | `boolean` | `false` |
| defaultValue | 搜索栏默认值，同时作为重置目标值，优先级高于初始的 `params` / `searchModel` | `Record<string, any>` | - |
| formRules | 表单校验规则（NForm 原生属性） | `Record<string, any>` | - |
| formModel | 表单模型（NForm 原生属性） | `Record<string, any>` | - |
| labelWidth | label 宽度 | `string \| number` | 跟随 NForm |
| labelAlign | label 对齐方式 | `'left' \| 'right'` | `'left'` |
| labelPlacement | label 位置 | `'left' \| 'top'` | `'left'` |
| size | 表单尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| searchText | 搜索按钮文案，优先级高于 `submitText` | `string` | `'搜索'` |
| submitText | 搜索按钮文案（`searchText` 未配置时生效） | `string` | - |
| showResetButton | 是否显示重置按钮 | `boolean` | `true` |
| showAdvancedButton | 是否显示折叠/展开按钮；`false` 时强制展开 | `boolean` | `true` |
| resetText | 重置按钮文案 | `string` | `'重置'` |
| sort | 搜索项按 `order` 的排序方向 | `'asc' \| 'desc'` | `'desc'` |

### ToolbarConfig

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| create | 是否显示新增按钮 | `boolean` | `false` |
| createLabel | 新增按钮文案，同时用于弹窗/抽屉标题 | `string` | `'新增'` |
| createMode | 新增按钮模式 | `'button' \| 'modal' \| 'drawer'` | `'button'` |
| delete | 是否显示删除按钮；无选中行时禁用 | `boolean` | `false` |
| deleteLabel | 删除按钮文案 | `string` | `'删除'` |
| export | 是否显示导出按钮 | `boolean` | `false` |
| exportLabel | 导出按钮文案 | `string` | `'导出Excel'` |
| print | 是否显示打印按钮，点击后调用浏览器打印 | `boolean` | `false` |
| printLabel | 打印按钮文案 | `string` | `'打印'` |
| import | 是否显示导入按钮，选择文件后抛出 `import` | `boolean` | `false` |
| importLabel | 导入按钮文案 | `string` | `'导入'` |
| importAccept | 导入文件选择器的 `accept` 属性 | `string` | - |
| reload | 是否显示刷新按钮（图标按钮，文案为 tooltip） | `boolean` | `true` |
| reloadLabel | 刷新按钮 tooltip 文案 | `string` | `'刷新'` |
| density | 是否显示密度切换按钮 | `boolean` | `true` |
| columnSetting | 是否显示列设置按钮 | `boolean` | `true` |
| columnSettingLabel | 列设置按钮文案，不传则只显示图标 | `string` | - |

> 工具栏配置在运行时修改会立即生效，不需要重建组件。

### ProTableColumn

`ProTableColumn = TableColumn & ProTableBaseColumn`，即在 naive-ui 列配置基础上扩展以下字段。naive-ui 原生字段（`key`、`title`、`width`、`minWidth`、`maxWidth`、`fixed`、`align`、`render`、`sorter`、`filter`、`children`、`ellipsis` 等）全部可用。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| valueType | 搜索栏/表单控件类型，**不写则该字段不出现在搜索栏** | `ValueType` | - |
| hideInSearch | 不在搜索栏中展示 | `boolean` | `false` |
| hideInForm | 不在新增表单中展示 | `boolean` | `false` |
| hideInTable | 不在表格中展示（仍可作为查询条件） | `boolean` | `false` |
| copyable | 单元格内容可复制，传对象可配置省略与行数 | `boolean \| { ellipsis?: boolean, lineClamp?: number }` | `false` |
| tooltip | 表头与搜索栏 label 后的信息图标提示 | `string` | - |
| order | 搜索栏排序权重，配合 `search.sort` 使用 | `number` | - |
| request | 远程枚举请求，**无参调用** `request()`；函数引用变化时重新请求 | `() => Promise<SelectOption[]>` | - |
| defaultValue | 配合 `request` 的级联懒加载：按 id 数组逐级调用 `request(id)` 补全树 | `(string \| number)[]` | - |
| options | 静态选项，优先级高于 `request` 结果 | `SelectOption[]` | - |
| rule | 表单校验规则，传给 `NFormItemGi`（**不是 `rules`**） | `FormItemRule \| FormItemRule[]` | - |
| formItemProps | **透传给底层控件**的属性，如 `min`、`multiple`、`type` | `Record<string, any>` | - |
| formRender | `valueType: 'custom'` 时的自定义渲染 | `(key: string, model: Ref, formItemProps: any) => VNodeChild` | - |
| grid | 该表单项在搜索栅格中占据的列数 | `number` | `1` |

> `copyable` 的对象形式、以及 `options` / `defaultValue` / `rule` / `formItemProps` / `formRender` / `grid` 均为**运行时生效但未写入 `ProTableColumn` 类型声明**的字段，TypeScript 下需要自行断言（如 `as any`）。`request` 的声明签名 `(params, prop)` 与实际调用不符，实现中不会传参。

### ValueType

运行时实际支持的控件类型：

| 值 | 渲染控件 | 值类型 / 格式 |
| --- | --- | --- |
| `text` | NInput | `string` |
| `textarea` | NInput（textarea） | `string` |
| `digit` | NInputNumber | `number \| null` |
| `select` | NSelect | 选项 value |
| `radio` | NRadioGroup | 选项 value |
| `checkbox` | NCheckboxGroup | `any[]` |
| `switch` | NSwitch | `boolean` |
| `cascader` | NCascader | 选项 value |
| `date` | NDatePicker（date） | `string`，`yyyy-MM-dd` |
| `datetime` | NDatePicker（datetime） | `string`，`yyyy-MM-dd HH:mm:ss` |
| `daterange` | NDatePicker（daterange） | `[string, string]`，`yyyy-MM-dd` |
| `datetimerange` | NDatePicker（datetimerange） | `[string, string]`，`yyyy-MM-dd HH:mm:ss` |
| `month` | NDatePicker（month） | `string`，`yyyy-MM` |
| `monthrange` | NDatePicker（monthrange） | `[string, string]`，`yyyy-MM` |
| `time` | NTimePicker | 时间戳 |
| `upload` | NUpload | 由 `formItemProps` 决定 |
| `custom` | 由 `formRender` 决定 | 自定义 |

> 类型声明中的 `treeSelect`、`timerange` **暂无对应渲染分支**，配置后表单项为空。树形选择请用 `cascader`，时间区间请用 `datetimerange`，或通过 `custom` 自行实现。
>
> 日期类控件统一使用 `formatted-value` 绑定，因此提交给 `onQuery` 的是**格式化字符串**而非时间戳。

### Events

| 事件名 | 说明 | 回调参数 | 版本 |
| --- | --- | --- | --- |
| loadData | **仅受控模式点击工具栏刷新按钮时触发**，参数固定为 1；请求模式下不触发 | `(page: number) => void` | |
| create | 点击新增按钮时触发，三种 `createMode` 均会触发 | `() => void` | |
| exportData | 点击导出按钮时触发，参数为最近一次搜索条件（初始为 `params`） | `(params: Record<string, any>) => void` | 0.7.24 |
| submit | 搜索表单校验通过并提交时触发，参数为表单当前值 | `(values: Record<string, any>) => void` | 0.8.0 |
| update:searchModel | 搜索表单值变化、提交、重置或调用 `setSearch` 时触发，可用于 `v-model:searchModel` | `(values: Record<string, any>) => void` | 0.8.0 |
| reset | 点击搜索栏重置按钮后触发，携带重置后的表单值，此时已带默认值重新执行查询 | `(values?: Record<string, any>) => void` | 0.7.24 |
| delete | 点击工具栏删除按钮时触发，参数为当前选中行 key（无选中时按钮禁用） | `(rowKeys: (string \| number)[]) => void` | 0.8.0 |
| print | 点击工具栏打印按钮时触发，同时已调用 `window.print()` | `() => void` | 0.8.0 |
| import | 导入文件选择完成后触发 | `(file: File) => void` | 0.8.0 |

分页、排序、筛选、多选等事件由 NDataTable 透传，见[透传的 NDataTable 属性](#透传的-ndatatable-属性)。请求模式下 ProTable 在调用完传入的 `onUpdate*` 后会继续发起请求。

### Slots

| 名称 | 说明 | 插槽参数 |
| --- | --- | --- |
| toolbar | 工具栏最左侧的自定义内容 | 无 |
| summary | 搜索栏卡片与表格卡片之间的自定义区域 | 无 |
| selection-action | 表格上方的自定义区域，常用于批量操作提示 | 无 |

> 三个插槽均**不接收参数**。选中行、列配置等状态请通过 `@update:checked-row-keys` 等事件在业务侧维护。ProTable 不渲染 `default` 插槽。

### Expose（Ref API）

通过 `ref` 可访问以下成员：

| 成员 | 类型 | 说明 |
| --- | --- | --- |
| size | `Ref<'small' \| 'medium' \| 'large'>` | 当前表格密度，可读写 |
| searchFormRef | `ProFormInstance \| null` | 搜索表单实例，`search` 为 `false` 时为 `null` |
| searchRef | `NCard 实例 \| null` | 搜索栏卡片组件实例，`search` 为 `false` 时为 `null` |

实例方法：

| 方法 | 签名 | 说明 |
| --- | --- | --- |
| reload | `() => Promise<void> \| void` | 请求模式重新请求当前页；受控模式抛出 `loadData(1)` |
| setColumns | `(columns: ProTableColumn[]) => void` | 替换列配置，表格、搜索栏、列设置同步更新 |
| setSearch | `(values: Record<string, any>) => void` | 增量合并搜索模型并抛出 `update:searchModel`，不会自动发起查询 |
| setForm | `(values: Record<string, any>) => void` | `setSearch` 的别名 |
| setPagination | `(pagination: Record<string, any>) => void` | 更新分页（`page` / `pageSize` / `itemCount`），请求模式下随即重新请求 |
| setTableData | `(data: any[]) => void` | 直接替换表格数据 |
| setLoading | `(loading: boolean) => void` | 设置内部 loading，与 `loading` prop 取或 |
| setSelectedRowKeys | `(keys: (string \| number)[]) => void` | 同步内部选中 key（用于删除按钮禁用判断），不会反向驱动未受控的表格选中列；受控请传 `checked-row-keys` |
| setSelectedRows | `(rows: any[]) => void` | 记录选中行数据供业务读取 |
| setRowSelection | `(rowSelection: Record<string, any>) => void` | 仅记录 rowSelection 状态；naive-ui 无表格级 `rowSelection`，多选请用 `{ type: 'selection' }` 列 |
| setColumnsState | `(state: { order: string[], hidden: string[] } \| null) => void` | 应用列顺序与显隐，同步列设置面板；仅内存生效，不写 `localStorage`，传 `null` 恢复原始列 |

`searchFormRef` 上可用的方法：

| 方法 | 签名 | 说明 | 版本 |
| --- | --- | --- | --- |
| submit | `() => void` | 校验通过后触发查询（走防抖） | |
| reset | `() => void` | 重置为默认值 | |
| setFieldValue | `(key: string, value: any) => void` | 设置单个搜索字段的值 | 0.7.27 |

```ts
const tableRef = ref<InstanceType<typeof ProTable> | null>(null)

tableRef.value?.searchFormRef?.setFieldValue('name', '张三')
tableRef.value?.searchFormRef?.submit()

tableRef.value?.setColumns(nextColumns)
tableRef.value?.setColumnsState({ order: ['name', 'age'], hidden: ['age'] })
```

</div>

## 常见问题

**搜索栏没有显示字段？**
列上必须配置 `valueType`，未匹配到渲染分支时表单项为空。同时检查是否被 `hideInSearch`、`type: 'selection' / 'index'`、`key: 'actions'` 过滤掉。

**点击搜索没反应？**
受控模式下 `onQuery` 是搜索的必要条件，未传时控制台会打印 `ProTable: onQuery prop is required for search functionality`；请求模式下请检查是否传入 `request`。另外查询有 300ms 防抖，连续点击只会执行最后一次。

**request 模式拿不到翻页 / 排序回调？**
可以继续监听 `@update:page` / `@update:sorter` 等事件，ProTable 会先调用传入的 `onUpdate*`，再自动请求；但不要在这些回调里再手动请求，否则会重复调用。

**表格只有表头、内容塌陷？**
升级到 `0.8.0`。使用 `autoFlex` 时请确认祖先容器有确定高度且为纵向 flex；否则改用 `height` 或 `max-height`。

**固定列不生效 / 横向滚动异常？**
显式配置 `scroll-x` 为各列宽度之和，或给所有列配置 `width` 让自动估算更准确。

**列设置刷新后丢失？**
配置唯一且稳定的 `columnStorageKey`。未配置时使用随机 key，仅在当前实例生命周期内有效。

**传入的 size 不起作用？**
表格密度由工具栏密度按钮接管，初始为 `large`。如需固定密度，传 `:toolbar="{ density: false }"` 隐藏按钮，并通过 ref 修改 `size`。

**自定义 renderCell 不生效？**
该属性被内部空值占位渲染接管。请在列级使用 `render` 自定义单元格。

**copyable 列的 render 被忽略？**
可复制渲染优先级高于自定义 `render`，二者不能同时生效。需要自定义内容又要复制时，请在 `render` 中自行使用 `ProText`。

**重置后日期控件显示异常？**
默认值请给 `null` 而非 `''` 或 `undefined`，详见[代码示例](#代码示例)开头的默认值约定。

## 已知限制

当前版本（0.8.0）仍存在以下限制：

| 成员 | 说明 |
| --- | --- |
| `setRowSelection` | 仅记录状态；naive-ui 没有表格级 `rowSelection`，多选请在列上配置 `{ type: 'selection' }` |
| `setSelectedRowKeys` / `setSelectedRows` | 只同步内部状态（`setSelectedRowKeys` 影响删除按钮禁用判断），不会反向驱动未受控的表格选中列；需要受控请传 `checked-row-keys` |
| 多列排序 | 请求模式只向 `request` 传递第一列排序（`sorter` 取数组首项） |
| `toolbarConfig` | 已废弃，请改用 `toolbar` |
| 列级 `request` 签名 | 类型声明为 `(params, prop)`，运行时实际无参调用，`defaultValue` 才用于级联补全 |
