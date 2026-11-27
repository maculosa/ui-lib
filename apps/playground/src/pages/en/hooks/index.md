---
name: Hooks
desc: "@banmao/hooks collects the composables that mid-back-office pages reuse: list requests with pagination and export, async data state, table height calculation and file download."
---

<route lang="yaml">
meta:
  layout: default
</route>

# @banmao/hooks

`@banmao/hooks` extracts the state orchestration that repeats across admin pages into composables: the list page's "request + loading + pagination + filtering + export", async data's "loading / error / retry", table viewport height, and turning a remote blob into a download. Nothing here is bound to a specific component — the returned refs feed `NDataTable`, `ProTable` or your own template directly.

## When to use it

- A list page needs pagination, loading state, query params and export collapsed into one state source
- You want to own the request timing outside `ProTable`'s managed request mode (controlled mode)
- The table height must be the viewport minus the search bar
- You need to persist whatever the export endpoint returns as a file

## Exports

| Hook | Signature | Returns | Purpose |
| --- | --- | --- | --- |
| `useList` | `(listRequestFn, options?)` | `dataSource` / `loading` / `pagination` / `loadData` / `handlePageChange` / `handlePageSizeChange` / `handleSortChange` / `handleExcelData` | Full list state machine: data, pagination, filters, export |
| `useAsyncData` | `(requestFn, options?)` | `data` / `loading` / `error` / `fetchData` | Loading state for a single async request |
| `useTableHeight` | `(tableRef, options?)` | `height` | Table height derived from viewport and search bar |
| `useExportFile` | `(data, fileName?)` | `void` | Turns a `BlobPart` into a browser download |

## Install and import

```bash
pnpm add @banmao/hooks
```

```ts
import { useAsyncData, useExportFile, useList, useTableHeight } from '@banmao/hooks'
```

`vue` is the only external, so the host application must share a single `vue >= 3.5.13` instance. `naive-ui` and `dayjs` are already bundled into the build output, so they need no separate install — but `useList`'s export toast still expects an `NMessageProvider` in the component tree, which this site provides globally through `NaiveProvider`.

## Quick start

```vue
<script setup lang="ts">
import { useList } from '@banmao/hooks'

// The request function receives { pageNum, pageSize, ...filters }
// and must return { status, data: { list, pageNum, pageSize, total } }
const { dataSource, loading, pagination, handlePageChange, handlePageSizeChange } = useList(getUserPage, {
  filterOption: searchModel,
})
</script>

<template>
  <n-data-table
    remote
    :columns="columns"
    :data="dataSource"
    :loading="loading"
    :pagination="pagination"
    @update:page="handlePageChange"
    @update:page-size="handlePageSizeChange"
  />
</template>
```

`pagination` uses the same keys Naive UI expects (`page` / `pageSize` / `itemCount` / `pageSizes` / `showSizePicker` / `showQuickJumper` / `prefix`), so it can be passed straight through.

## Per-hook docs

- [useList](/en/hooks/use-list)
- [useAsyncData](/en/hooks/use-async-data)
- [useTableHeight](/en/hooks/use-table-height)
- [useExportFile](/en/hooks/use-export-file)

## Pairing with ProTable

`ProTable` already manages its own requests. Reach for `useList` only in controlled scenarios — the parent owns the query params, or several views share one dataset: pass `dataSource` to `:data`, forward `pagination`, and call `loadData` after updating filters in `onQuery`. See the [ProTable controlled pagination](/en/procomponent/ProTable) example.

## Known limits

- `options.requestError` / `requestSuccess` exist in the type but the implementation never reads them; failures are logged with `console.error` and re-thrown.
- `useList`'s `handleSortChange` sorts the current page locally and does not re-request.
- `useList`'s `options.pagination.displayOrder` only maps onto `showSizePicker` / `showQuickJumper` from `0.0.8` on; 0.0.7 and earlier computed `includes(...) || true`, so both controls always rendered. `pages` in `displayOrder` still has no matching switch. A custom `pagination` also replaces the whole default object, so omitted fields fall back to `undefined` / `[]` instead of the defaults.
- `useTableHeight` reads `tableRef.value.searchRef`, so the ref must point at a `ProTable` instance; `options` are read once at init and later changes do not recompute.
- `useExportFile` builds its fallback name from a misspelled dayjs format (`yyyy` / `dd`), producing names like `yyyy-11-Fr 09:11:19.xlsx`; assemble the timestamp yourself and pass it as `fileName`.
- `useDeviceInfo` exists in the source tree but is not exported from the entry, so it cannot be imported from `@banmao/hooks` yet.
