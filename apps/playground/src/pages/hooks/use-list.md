---
name: useList
desc: useList 托管列表页的请求、加载态、分页、筛选条件与远端导出，返回值可直接铺给 NDataTable 或 ProTable。
---

<route lang="yaml">
meta:
  layout: default
</route>

# useList

`useList` 把列表页最常见的状态机收敛成一个调用：发起分页请求、维护 `loading`、把响应整理成表格数据与分页对象、翻页与改页大小自动重取，并可选地挂一个远端导出。

## 何时使用

- 表格需要分页 + 加载态 + 数据源三件套，且希望在父组件掌握请求时机
- 筛选条件由外部表单维护，改动后需要带条件重新请求
- 后端响应结构与 `{ status, data: { list, total } }` 不一致，需要适配
- 列表页还需要「按当前筛选条件导出文件」

## 代码示例

### 基础用法

<Demo
title="分页列表"
desc="最简形态：请求函数返回 { status, data: { list, pageNum, pageSize, total } }，翻页与改页大小分别接 handlePageChange / handlePageSizeChange。"
:raw="BasicRaw">

<Basic />

</Demo>

### 筛选条件

<Demo
title="带筛选条件的列表"
desc="filterOption 传入一个 ref，每次请求都会读取其最新值并并入请求参数；重置时把条件恢复默认再调用 loadData(1)。"
:raw="FilterRaw">

<Filter />

</Demo>

### 分页配置

<Demo
title="pageSize、pageSizes 与 displayOrder"
desc="options.pagination 的 pageSize 与 pageSizes 直接生效；displayOrder 决定 showSizePicker / showQuickJumper，未声明的控件不渲染（本例省略 quick-jumper，状态条显示为 false）。该行为自 0.0.8 起生效。"
:raw="PaginationRaw">

<Pagination />

</Demo>

### 适配后端响应

<Demo
title="自定义响应码与字段"
desc="code 指定业务成功码，callback 把原始 payload 整理成 { list, pageNum, pageSize, total }，两者配合即可适配既有接口而无需改造后端。"
:raw="CustomResponseRaw">

<CustomResponse />

</Demo>

### 导出

<Demo
title="按筛选条件导出"
desc="配置 exportRequestFn 后调用 handleExcelData()，会把当前 filterOption 透传给导出接口，返回的 data 交给 useExportFile 落地下载。"
:raw="ExportRaw">

<Export />

</Demo>

## API

### 类型签名

```ts
function useList<T extends (...args: any) => Promise<any>>(
  listRequestFn: T,
  options?: {
    filterOption?: Ref<any>
    callback?: (data: any) => { list: any[]; total: number; pageSize: number; pageNum: number }
    exportRequestFn?: (...args: any) => Promise<{ data: BlobPart; fileName?: string }>
    immediate?: boolean
    code?: number
    pagination?: {
      displayOrder?: ('pages' | 'size-picker' | 'quick-jumper')[]
      pageSizes?: number[]
      pageSize?: number
    }
  },
): {
  dataSource: Ref<any[]>
  loading: Ref<boolean>
  pagination: Ref<Pagination>
  loadData: (page?: number, filterParams?: any) => Promise<void>
  handlePageChange: (page: number) => void
  handlePageSizeChange: (pageSize: number) => void
  handleSortChange: (sorter: DataTableSortState) => void
  handleExcelData: () => Promise<void>
}
```

### listRequestFn

请求函数，调用时收到的参数为 `{ pageNum, pageSize, ...filterOption.value, ...filterParams }`。`filterParams` 展开在最后，同名键会覆盖 `pageNum` / `pageSize`，因此只用于补充筛选字段；翻页与改每页条数分别由 `handlePageChange` / `handlePageSizeChange` 先更新 `pagination` 再调用 `loadData`。

需要返回 Promise，且解析结果满足：

```ts
{ status: number, data: { list: any[], pageNum: number, pageSize: number, total: number } }
```

`status === options.code` 且 `list` 为数组时写入 `dataSource`；否则会清空数据、把分页重置为 `pageSize: 10` / `itemCount: 0` / `page: 1` 并抛出 `list的数据类型错误`。响应结构不同时用 `callback` 转换。

请求成功后 `pagination` 的 `page` / `pageSize` / `itemCount` 会被响应里的 `pageNum` / `pageSize` / `total` 直接覆盖，而不是沿用本地值——所以上面的 `pageNum`、`pageSize`、`total` 必须回传，缺字段会让分页状态变成 `undefined`。

### options

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `filterOption` | `Ref<any>` | `ref()` | 筛选条件容器，每次请求并入参数 |
| `callback` | `(data: any) => CallbackResult` | `-` | 把原始 `data` 整理为 `{ list, pageNum, pageSize, total }` |
| `code` | `number` | `200` | 业务成功码，与响应的 `status` 比对 |
| `immediate` | `boolean` | `true` | 是否在 `onMounted` 时自动发起首次请求 |
| `exportRequestFn` | `(...args) => Promise<{ data, fileName? }>` | `-` | 导出请求，`handleExcelData` 会以 `filterOption.value` 调用它 |
| `pagination.displayOrder` | `('pages' \| 'size-picker' \| 'quick-jumper')[]` | `['pages', 'size-picker', 'quick-jumper']` | 控制 `showSizePicker` / `showQuickJumper`；未声明的项不渲染，`pages` 无对应开关（0.0.8 起生效） |
| `pagination.pageSizes` | `number[]` | `[10, 20, 50, 100]` | 每页条数候选项 |
| `pagination.pageSize` | `number` | `10` | 初始每页条数 |

### 返回值

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `dataSource` | `Ref<any[]>` | 当前页数据，可直接作为表格的 `data` |
| `loading` | `Ref<boolean>` | 请求进行中为 `true` |
| `pagination` | `Ref<object>` | 含 `page` / `pageSize` / `itemCount` / `pageSizes` / `showSizePicker` / `showQuickJumper` / `prefix`，可直接透传给分页组件 |
| `loadData` | `(page?, filterParams?) => Promise<void>` | 手动请求。不传 `page` 时沿用当前页；`filterParams` 会覆盖 `filterOption` 中的同名字段 |
| `handlePageChange` | `(page: number) => void` | 翻页，内部更新 `pagination.page` 并重新请求 |
| `handlePageSizeChange` | `(pageSize: number) => void` | 改每页条数，并回到第一页重新请求 |
| `handleSortChange` | `(sorter) => void` | 按 `columnKey` 与 `order` 对**当前页**数据本地排序 |
| `handleExcelData` | `() => Promise<void>` | 调用 `exportRequestFn` 并触发下载，成功后弹出 `成功导出` 提示 |

## 注意事项

- 需要远端分页时，给表格加 `remote`，否则 Naive UI 会对已分页的数据再次切片。
- 如果服务端自己处理分页，把请求函数和 `pagination` 一起交给 `ProTable` 的托管请求更省事；`useList` 更适合自行管理请求的场景。
- `pagination` 是可写的响应式对象，也可以拿到后再改 `pagination.value.showQuickJumper` / `showSizePicker`。自 0.0.8 起 `displayOrder` 会正确映射到这两个开关（0.0.7 及更早版本写成 `includes(...) || true`，两项恒显示）；`displayOrder` 中的 `pages` 没有对应开关，页码列表始终渲染。
- 传入自定义 `pagination` 会整体替换默认配置，而不是逐字段合并：省略 `pageSize` 时初始每页条数为 `undefined`，省略 `pageSizes` 时候选项为 `[]`。
- `useList` 在 `onMounted` 中发起首次请求，因此必须在组件 `setup` 内调用。
- `handleExcelData` 内部通过 Naive UI 的 `useMessage` 提示结果，组件树中需要有 `NMessageProvider`；未配置 `exportRequestFn` 调用时会抛出 `当前没有提供exportRequest函数`。
- 请求失败会向上抛出，调用方可在 `loadData()` 外层 `try/catch` 自行兜底，或改用 `ProTable` 的托管请求。
