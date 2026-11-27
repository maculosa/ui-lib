---
name: useList
desc: useList owns the list page state machine — request, loading, pagination, filter params and remote export — and returns refs that drop straight into NDataTable or ProTable.
---

<route lang="yaml">
meta:
  layout: default
</route>

# useList

`useList` collapses the recurring list-page state machine into one call: fire a paged request, keep `loading` in sync, shape the response into table data plus a pagination object, refetch on page or page-size changes, and optionally attach a remote export.

## When to use it

- The table needs the data / loading / pagination trio while the parent controls request timing
- Filter conditions live in an external form and every change must re-request with them
- The backend response does not match `{ status, data: { list, total } }`
- The page also needs "export with the current filters"

## Examples

### Basic

<Demo
title="Paged list"
desc="The simplest shape: the request returns { status, data: { list, pageNum, pageSize, total } }, and page / page-size changes go to handlePageChange / handlePageSizeChange."
:raw="BasicRaw">

<Basic />

</Demo>

### Filtering

<Demo
title="List with filter params"
desc="Pass filterOption as a ref: every request reads its latest value. Reset restores the defaults and calls loadData(1) to go back to the first page."
:raw="FilterRaw">

<Filter />

</Demo>

### Pagination config

<Demo
title="Pagination config"
desc="options.pagination sets the initial page size and the candidate sizes; displayOrder drives showSizePicker / showQuickJumper, so an undeclared control is not rendered (this demo omits quick-jumper, and the state strip reads false). Correct only from 0.0.8 onwards."
:raw="PaginationRaw">

<Pagination />

</Demo>

### Adapting a response

<Demo
title="Custom code and field names"
desc="code sets the business success code and callback reshapes the raw payload into { list, pageNum, pageSize, total }, so an existing endpoint works without backend changes."
:raw="CustomResponseRaw">

<CustomResponse />

</Demo>

### Export

<Demo
title="Export with current filters"
desc="Once exportRequestFn is configured, handleExcelData() forwards the current filterOption to the export endpoint and hands the returned data to useExportFile."
:raw="ExportRaw">

<Export />

</Demo>

## API

### Signature

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

Called with `{ pageNum, pageSize, ...filterOption.value, ...filterParams }`. Because `filterParams` spreads last, a key with the same name overrides `pageNum` / `pageSize` — use it for extra filter fields only. `handlePageChange` / `handlePageSizeChange` update `pagination` first, then call `loadData`.

It must return a Promise resolving to:

```ts
{ status: number, data: { list: any[], pageNum: number, pageSize: number, total: number } }
```

When `status === options.code` and `list` is an array, the data lands in `dataSource`. Otherwise the list is cleared, pagination jumps back to page one with `pageSize: 10`, and `list的数据类型错误` is thrown. Use `callback` when your payload uses different field names.

After a successful request, `pagination.page` / `pageSize` / `itemCount` are overwritten with the response's `pageNum` / `pageSize` / `total` rather than keeping the local values — so those three fields must be echoed back, and omitting them leaves the pagination state `undefined`.

### options

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `filterOption` | `Ref<any>` | `ref()` | Filter container merged into every request |
| `callback` | `(data: any) => CallbackResult` | `-` | Reshapes raw `data` into `{ list, pageNum, pageSize, total }` |
| `code` | `number` | `200` | Business success code compared against the response `status` |
| `immediate` | `boolean` | `true` | Whether the first request fires in `onMounted` |
| `exportRequestFn` | `(...args) => Promise<{ data, fileName? }>` | `-` | Export request; `handleExcelData` calls it with `filterOption.value` |
| `pagination.displayOrder` | `('pages' \| 'size-picker' \| 'quick-jumper')[]` | `['pages', 'size-picker', 'quick-jumper']` | Drives `showSizePicker` / `showQuickJumper` — an undeclared control is not rendered; `pages` has no switch (fixed in 0.0.8, see Notes) |
| `pagination.pageSizes` | `number[]` | `[10, 20, 50, 100]` | Page size candidates |
| `pagination.pageSize` | `number` | `10` | Initial page size |

### Return value

| Field | Type | Description |
| --- | --- | --- |
| `dataSource` | `Ref<any[]>` | Current page rows, ready to use as the table `data` |
| `loading` | `Ref<boolean>` | `true` while a request is in flight |
| `pagination` | `Ref<object>` | `page` / `pageSize` / `itemCount` / `pageSizes` / `showSizePicker` / `showQuickJumper` / `prefix` |
| `loadData` | `(page?, filterParams?) => Promise<void>` | Manual request. Keeps the current page when `page` is omitted; `filterParams` overrides same-named filter fields |
| `handlePageChange` | `(page: number) => void` | Updates `pagination.page` and refetches |
| `handlePageSizeChange` | `(pageSize: number) => void` | Updates the page size and refetches from page one |
| `handleSortChange` | `(sorter) => void` | Sorts the **current page** locally by `columnKey` and `order` |
| `handleExcelData` | `() => Promise<void>` | Calls `exportRequestFn`, downloads the file, then shows the `成功导出` toast |

## Notes

- Add `remote` to the table when the server paginates, otherwise Naive UI slices the already-paginated rows again.
- If the server paginates, prefer handing the request fn and pagination to ProTable's managed request mode; `useList` fits the cases where you drive the requests yourself.
- `pagination` is a writable reactive object. From 0.0.8 `displayOrder` maps correctly onto `showSizePicker` / `showQuickJumper`; in 0.0.7 and earlier the implementation read `includes(...) || true`, so both controls always showed and the only way to hide one was to overwrite it after the fact. `pages` inside `displayOrder` has no matching switch — the page list always renders.
- Passing a custom `pagination` replaces the default config object instead of merging per field: omit `pageSize` and the initial page size is `undefined`, omit `pageSizes` and the candidates are `[]`.
- The first request is fired inside `onMounted`, so `useList` must be called during `setup`.
- `handleExcelData` relies on Naive UI's `useMessage` for its toast, which needs an `NMessageProvider`; calling it without `exportRequestFn` throws `当前没有提供exportRequest函数`.
- Failures propagate to the caller — wrap `loadData()` in `try/catch`, or switch to `ProTable`'s managed request mode.
