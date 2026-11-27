---
name: ProTable
desc: ProTable is an advanced table built on Naive UI DataTable. A single columns config drives the table, the search form and the create form, with a built-in toolbar, column settings, density switching and flexible height.
---

<route lang="yaml">
meta:
  layout: default
</route>

# ProTable

ProTable wraps Naive UI `NDataTable` into an advanced table component. It combines "search bar + toolbar + table + pagination" into an out-of-the-box business table, and uses **a single `columns` config** to drive table columns, search form items and create form items, so the same fields are not defined in three places.

This documentation corresponds to `@banmao/procomponent@0.8.3`.

## Features

- **One config, three places**: `columns` controls visibility in the table, search bar and create form through `hideInTable` / `hideInSearch` / `hideInForm`
- **Built-in search bar**: renders controls by `valueType`, with remote enums, grid layout, column count adapted to the container width, collapse/expand and debounced search
- **Built-in toolbar**: create (button / modal / drawer), delete, export, print, import, sort, filter, fullscreen, reload, density and column settings
- **Table-level request**: pass `request` and ProTable owns data, pagination and loading; searching, paging, sorting and filtering re-request automatically
- **Works with useList in controlled mode**: `useList` from `@banmao/hooks` owns loading, pagination and query params, and plugs in through `data` / `pagination` and pagination events
- **Column settings persistence**: drag sorting, visibility toggles and left/right pinning stored in `localStorage` under `columnStorageKey`
- **Flexible height**: `autoFlex` fills a flex container, or use `height` / `max-height`
- **Fixed columns grouped automatically**: pinned columns are emitted at both ends of the table; when fixed columns exist and `scroll-x` is not set, the total width is estimated automatically
- **Instance API**: `reload` / `setColumns` / `setSearch` / `setTableData` and more for external control
- **Full NDataTable passthrough**: native props and pagination events such as `data`, `pagination`, `row-key`, `remote` and `striped` work as usual

## When to use

- Admin list pages that need query conditions, pagination, batch actions and column settings
- Scenarios with many fields where search conditions and table columns overlap heavily
- Business pages that should share a unified table look and interaction standard

When you only need to display data without the search bar and toolbar, use the `simple` mode and ProTable degrades to a plain `NDataTable`.

## Quick start

### Installation

```script-tabs
@banmao/procomponent
```

### On-demand import

```vue
<script setup>
import { ProTable } from '@banmao/procomponent'
</script>
```

### Global registration

```ts
import { createApp } from 'vue'
import { ProTablePlugin } from '@banmao/procomponent'
import App from './App.vue'

createApp(App).use(ProTablePlugin).mount('#app')
```

> ProTable uses `useMessage` for failure hints. Make sure the app is wrapped in `NMessageProvider` (or use `NaiveProvider`).

### Basic usage

ProTable keeps Naive UI's **`data`** prop, and columns use **`key`** (not `dataSource` / `dataIndex`).

```vue
<template>
  <ProTable
    title="User list"
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

// Every column needs valueType, otherwise it will not appear in the search bar
const columns = [
  { title: 'Name', key: 'name', valueType: 'text' },
  { title: 'Age', key: 'age', valueType: 'digit' },
  {
    title: 'Gender',
    key: 'gender',
    valueType: 'select',
    options: [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' },
    ],
    render: row => (row.gender === 'male' ? 'Male' : 'Female'),
  },
  { title: 'Email', key: 'email', valueType: 'text', hideInSearch: true },
]

// Fired on search / reset; receives the current search form values
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

### Full example with pagination

ProTable **does not own pagination state**; `pagination` is maintained by your code and paging is reported through `@update:page` / `@update:page-size`. Server-side pagination requires an explicit `remote`.

```vue
<template>
  <ProTable
    title="User list"
    column-storage-key="user-list"
    :columns="columns"
    :data="dataSource"
    :loading="loading"
    :pagination="pagination"
    :row-key="row => row.id"
    :on-query="handleQuery"
    :search="{ gridCols: 3, searchText: 'Search' }"
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
  prefix: ({ itemCount }) => `${itemCount} items`,
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
  // open your own create dialog
}

function handleExport(params) {
  // params holds the latest search conditions
}

loadData()
</script>
```

## Core concepts

### One columns config, five derived sets

`columns` is split into five derived sets:

| Derived set | Purpose | Filtering rule |
| --- | --- | --- |
| `tableColumns` | Columns actually rendered in the table | Excludes `hideInTable: true`, then applies column-setting visibility and order |
| `searchColumns` | Search form items | Excludes `type: 'selection'`, `type: 'index'`, `key` of `action` / `actions` and `hideInSearch: true`; sorted by `order` |
| `formColumns` | Create modal / drawer form items | Excludes `hideInForm: true`, `type: 'selection'`, `type: 'index'` and `key: 'actions'` |
| `settingColumns` | Candidate columns in the column settings panel | Excludes `hideInTable: true` |
| `toolbarColumns` | Sort / filter candidates in the toolbar | Data columns of the visible set with a `key` and a string `title`; excludes `selection` / `index` / `expand` types and `action` / `actions` keys |

Conventions that follow from this:

- **Always use `key: 'actions'` for the action column** so it does not leak into the search bar, the create form or the toolbar sort / filter candidates
- **Query-only fields** (such as a date range) set `hideInTable: true`
- **Display-only fields** set `hideInSearch: true`
- **Search order** comes from the `order` weight and `search.sort`, default `desc` (higher weight first)
- **Toolbar sort / filter candidates follow column settings**: columns hidden in the panel are removed from the toolbar dropdowns

```ts
const columns = [
  { type: 'selection' },
  { type: 'index' },
  { title: 'Name', key: 'name', valueType: 'text', order: 100 },
  // Query only, not shown in the table
  { title: 'Created at', key: 'createTime', valueType: 'daterange', hideInTable: true, order: 90 },
  // Display only, not searchable
  { title: 'Remark', key: 'remark', valueType: 'text', hideInSearch: true },
  { title: 'Actions', key: 'actions', width: 160, fixed: 'right', render: row => renderActions(row) },
]
```

### Data loading model

Two mutually exclusive modes:

| Mode | Trigger | Who owns data / pagination / loading |
| --- | --- | --- |
| Controlled (default) | No `request` | Your code, through `data` / `pagination` / `loading` and events |
| Request | `request` is provided | ProTable |

> In controlled mode with server-side pagination, pass `remote` explicitly. ProTable forwards it to NDataTable so the already-paginated `data` is not sliced again. Request mode enables `remote` automatically.

**Controlled mode**: ProTable never fetches data itself.

| Entry | Fires when | Notes |
| --- | --- | --- |
| `onQuery` | Search or reset is clicked | Receives the current search values; debounced by **300ms**; a warning is logged and nothing runs when missing |
| `@update:page` / `@update:page-size` | Page or page size changes | Forwarded from NDataTable; your code re-requests |
| `@load-data` | **Toolbar reload button only** | The page argument is always `1`, meaning "reload from the first page" |

Errors thrown by `onQuery` and by reloads are caught and surfaced through `useMessage` with the built-in messages "搜索失败，请重试" (search failed) / "刷新失败，请重试" (reload failed).

**Request mode**: with `request`, ProTable owns `data`, pagination and loading, and calls the request on:

- mount
- search submit and reset
- page / page-size / sorter / filter changes
- `params` changes (which reset to page 1)

```ts
type ProTableRequest = (
  params: { current: number, pageSize: number, [key: string]: any },
  sorter: { columnKey?: string | number, order?: 'ascend' | 'descend' } | null,
  filters: Record<string, any[] | null>,
) => Promise<{ data: any[], total?: number }>
```

- `params` merges `params` and `searchModel`, plus `current` / `pageSize`
- `sorter` prefers the toolbar sort (`{ columnKey, order }`), then the header sorter; `null` when unsorted
- `filters` merges header filters and toolbar filters; toolbar filters win on the same field; empty values are dropped
- Failures are reported through `useMessage` with the built-in message "加载失败，请重试" (load failed); with rapid requests only the latest response is kept
- The toolbar reload calls `request` directly in request mode and **does not emit** `loadData`
- When both `request` and `onQuery` exist, `request` wins and `onQuery` is not called

> `ProTableRequest`, `ProTableRequestParams`, `ProTableRequestResult` and `ProTableSorter` are exported from `@banmao/procomponent`.

### Search bar

- **Shown by default**; only an explicit `:search="false"` hides it
- When `search` is an object its fields override the internal ProForm, so ProForm props such as `gridCols`, `gridCollapsed`, `gridCollapsedRows` and `labelWidth` can be written there directly
- **The column count adapts automatically**: without `search.gridCols`, the count is chosen from the measured width of the table container (1 on narrow screens, up to 6 on wide ones). A `ResizeObserver` recalculates it after sidebar collapse, window resize or fullscreen; an explicit `gridCols` always wins
- The search form always sets `showFeedback: false`: validation messages are not shown, but validation still blocks submission
- `showAdvancedButton: false` hides the toggle and forces expansion; when unset, an internal overflow check decides whether the toggle appears
- Button labels: the search button prefers `searchText`, then `submitText`, defaulting to "搜索"; the reset button uses `resetText` (default "重置")
- `showResetButton: false` hides the reset button
- The search form and `searchModel` stay in sync both ways: typing emits `update:searchModel`; submit, reset and `setSearch` also sync; external changes to `searchModel` are written back to the form
- The reset target is "the `params` / `searchModel` snapshot taken at creation + `search.defaultValue`", never the current input, so the reset event carries the restored values

### Toolbar

The toolbar sits at the top right of the card, left to right: `toolbar` slot content → create → delete → export → print → import → sort / filter / reload / density / fullscreen / column settings.

- `create`, `delete`, `export`, `print` and `import` are **hidden by default** and must be enabled explicitly
- `sort` and `filter` are **hidden by default** and must be enabled explicitly: `:toolbar="{ sort: true, filter: true }"`; they still stay hidden when no eligible columns exist
- `reload`, `density`, `fullscreen` and `columnSetting` are **shown by default**; pass `false` to hide them
- With `createMode: 'modal'` / `'drawer'`, the create button is wrapped by `ModalForm` / `DrawerForm`, the form uses `formColumns` and the title is `${createLabel} ${title}`; clicking the button also emits `create`
- The delete button is disabled without a selection; clicking it emits `delete` with the selected row keys
- The print button emits `print` and then calls `window.print()`
- The import button opens a file picker and emits `import` with the `File`; `importAccept` restricts the file types
- The toolbar config is **fully reactive**: changing `toolbar` at runtime updates the UI immediately
- Density offers "default / medium / compact", mapping to the table `size` of `large` / `medium` / `small`
- Fullscreen enlarges the whole ProTable (search bar + toolbar + table) to the browser viewport using **fixed CSS positioning, not the native Fullscreen API**; click again or press `Esc` to restore. It reuses the `autoFlex` height chain so the table body scrolls inside the viewport
- After sort / filter changes, controlled mode returns to page 1 and works on the current data; request mode calls `request` again

#### Toolbar sorting

The sort button is hidden by default; enable it with `toolbar.sort: true`. The popover has a "sort field" and a "sort direction" part:

- The first field is always "综合排序" (no sorting, original data order); the rest are the sortable columns
- Clicking a column applies ascending order immediately; the direction can be switched to descending, the selected item shows a check mark and **no selected background**
- Clicking the current column or the current direction again does not re-trigger a request; switching columns keeps the current direction
- Toolbar sorting and header arrows are independent: the button highlight and tooltip show "column + direction"

How sorting is applied:

| Mode | Behavior |
| --- | --- |
| Controlled (no `request`) | Sorts the current `data` before rendering: numbers by value, everything else by `localeCompare(numeric)`, empty values always last; the array is copied, the input data is not mutated |
| Request (with `request`) | Passed as the second `request` argument `sorter: { columnKey, order }` and the first page is requested again |

#### Toolbar filtering

The filter button is hidden by default; enable it with `toolbar.filter: true`. The popover starts **without any conditions**, only an "add filter" button:

- Each click adds a row of "field select + value control + remove"; fields already used by other rows are excluded and the add button disappears when all columns are used
- The value control follows the field type: `date` / `dateRange` / `datetime` use a date picker, `time` a time picker, fields with `options` a multi select, everything else a keyword input
- Conditions are drafts until "确定" is clicked; "重置" clears every condition immediately; switching the field clears that row's value
- Conditions without a field or with an empty value are dropped before submission, **empty values never reach the server**
- The header tooltip shows the number of active conditions, e.g. "筛选(2)"

How filtering is applied:

| Mode | Behavior |
| --- | --- |
| Controlled (no `request`) | Filters the current `data` locally: multi-select matches any value, text matches by contains (case-insensitive), `dateRange` compares by range |
| Request (with `request`) | Merged into the third `request` argument `filters`, combined with header filters; toolbar filters win on the same field; the first page is requested again |

### Height and scrolling

Four options, pick one:

| Option | Use case | Notes |
| --- | --- | --- |
| None | The page scrolls as a whole | Table height follows the number of rows |
| `:height="400"` | Fixed table area | In px; `flex-height` is enabled automatically |
| `:max-height="600"` | Cap the height | Native NDataTable prop; the body scrolls when exceeded |
| `auto-flex` | Fill the remaining flex space | Requires a fixed-height, column-direction flex ancestor |

Typical `autoFlex` container:

```vue
<template>
  <!-- The ancestor must have a fixed height and be a column flex container -->
  <div style="height: 100vh; display: flex; flex-direction: column;">
    <div>Page header</div>
    <ProTable auto-flex :columns="columns" :data="dataSource" :on-query="handleQuery" />
  </div>
</template>
```

**Fixed columns and horizontal scrolling**: when visible columns contain `fixed` and `scroll-x` is not set, ProTable estimates the total width and sets `scroll-x` so fixed columns keep working. The estimate uses the configured `width` when present; 48px for `selection` / `expand`; the sum of children for grouped columns; otherwise a title-based estimate (16px per CJK character, 8px for others, plus 32px padding), with a 140px minimum and `minWidth` / `maxWidth` clamping. An explicit `scroll-x` always wins.

**Table style**: `dataTableStyle` is merged with the style generated by `height` and passed to the table, with precedence `height` < `dataTableStyle`; with `autoFlex`, `flex: 1` / `min-height: 0` are applied last so the layout is not overridden. A string value only applies when `autoFlex` is off.

## Examples

> **Default values**: in search defaults, use `null` for select and date fields and `''` for text fields. Only then do controls return to the empty state after reset; `undefined`, or `''` for a date control, can break the display.

### Basic display

<Demo title="Simple mode"
desc="With simple, ProTable degrades to a plain NDataTable without the search bar, toolbar or card container — good for pure data display."
:raw="SimpleDemoRaw">

<SimpleDemo />

</Demo>

<Demo
title="Basic mode"
desc="Search bar + toolbar + pagination + multi-select + index column, covering most list page scenarios."
:raw="BaseRaw">

<Base />

</Demo>

<Demo
title="No search bar mode"
desc="Passing search=false hides the search bar and keeps the toolbar and table."
:raw="NoSearchbarRaw">

<NoSearchbar />

</Demo>

<Demo
title="Column tooltip mode"
desc="With a column tooltip, an info icon appears next to the header text and shows the hint on hover; the search label gets the same tooltip."
:raw="UseTooltipInColumnsRaw">

<UseTooltipInColumns />

</Demo>

### Search bar

<Demo
title="Search grid mode"
desc="Control the number of fields per row with search.gridCols; with many conditions the search bar collapses and expands automatically."
:raw="SearchGridRaw">

<SearchGrid />

</Demo>

<Demo
title="Query table mode"
desc="A query-centric table: onQuery receives the search form values and your code fetches and writes data."
:raw="QueryTableRaw">

<QueryTable />

</Demo>

<Demo
title="Reset search mode"
desc="Uses useList from @banmao/hooks for data and pagination; reset restores the default values and triggers onQuery again."
:raw="ResetSearchRaw">

<ResetSearch />

</Demo>

<Demo
title="Search ref mode"
desc="Get searchRef (the search card) and searchFormRef (the form instance) through a ref for external measuring or control."
:raw="SearchRefDemoRaw">

<SearchRefDemo />

</Demo>

<Demo
title="Set the search form from external interactions"
desc="Statistic card drill-down: an external event rewrites the conditions and runs the search, linking the card to the table."
:raw="StatisticToSearchRaw" >
<StatisticToSearch />
</Demo>

<Demo
title="Select group mode"
desc="A select group in the search bar shares the same conditions with external controls, suitable for tag-based, composable filters."
:raw="SelectGroupDemoRaw">

<SelectGroupDemo />

</Demo>

### Data request

<Demo
title="Table-level request"
desc="With request, searching, paging, sorting and filtering all trigger requests automatically; return { data, total } and ProTable owns data and pagination."
:raw="RequestModeRaw">

<RequestMode />

</Demo>

<Demo
title="Search model binding"
desc="v-model:searchModel reads and writes the conditions: external buttons can set conditions, and @submit carries the form values."
:raw="SearchModelRaw">

<SearchModel />

</Demo>

### Toolbar and create

<Demo
title="Form create mode"
desc="With createMode: button, the create button only emits create and your code opens the form."
:raw="CreateDemoRaw">

<CreateDemo />

</Demo>

<Demo
title="Modal create mode"
desc="With createMode: modal, the create button is wrapped by ModalForm and the form uses the columns not hidden from the form."
:raw="CreateModalDemoRaw">

<CreateModalDemo />

</Demo>

<Demo
title="Toolbar slot mode"
desc="The toolbar slot renders at the left of the toolbar, for example to add custom actions like import."
:raw="ToolbarSlotDemoRaw">

<ToolbarSlotDemo />

</Demo>

<Demo
title="Delete and import"
desc="Enable toolbar.delete / import to render the buttons: delete is disabled without selection and emits the selected keys; import emits the chosen File."
:raw="ToolbarActionsRaw">

<ToolbarActions />

</Demo>

<Demo
title="Action buttons mode"
desc="The action column uses the Actions component; buttons beyond showNum collapse into a dropdown."
:raw="ActionsDemoRaw">

<ActionsDemo />

</Demo>

### Toolbar sorting, filtering and fullscreen

<Demo
title="Sorting and filtering"
desc="Enable them with toolbar.sort / toolbar.filter. In controlled mode they only affect the loaded data: sorting works on visible columns, filtering adds conditions on demand with controls matched to each field type."
:raw="ToolbarSortFilterRaw">

<ToolbarSortFilter />

</Demo>

<Demo
title="Fullscreen"
desc="Click the fullscreen icon to enlarge the search bar, toolbar and table to fill the browser viewport; click again or press Esc to restore."
:raw="ToolbarFullscreenRaw">

<ToolbarFullscreen />

</Demo>

### Height

<Demo
title="Fixed height mode"
desc="Lock the table height with max-height / min-height; the body scrolls and the header stays visible when data overflows."
:raw="FixedHeightRaw">

<FixedHeight />

</Demo>

### Instance methods

<Demo
title="Control the table through a ref"
desc="Call setColumns to add or remove columns, setColumnsState to apply visibility, setSearch to set conditions and setLoading to simulate external loading."
:raw="InstanceMethodsRaw">

<InstanceMethods />

</Demo>

## Advanced usage

### Request mode

With a table-level `request`, ProTable owns data, pagination and loading; your code only returns `{ data, total }`:

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
  <!-- A change of searchParams resets to page 1 and re-requests -->
  <ProTable :columns="columns" :request="fetchUsers" :params="searchParams" :row-key="row => row.id" />
</template>
```

Notes for request mode:

- Search submit and reset both return to page 1 and re-request; `onQuery` is no longer called
- Page / page-size / sort / filter `onUpdate*` callbacks are still called before the automatic request, useful for analytics or external state
- Pagination is owned internally; a passed `pagination` only initializes the page and extra options (such as `showSizePicker`)
- Rapid condition changes discard stale responses so they never overwrite newer data

### Remote enums

Give a column a `request` and ProForm calls `request()` **without arguments** on mount and uses the result as options; the same `key` is requested only once, and it re-fetches only when the function reference changes.

```ts
const columns = [
  {
    title: 'City',
    key: 'city',
    valueType: 'cascader',
    // Returns SelectOption[]; cascader data may carry children
    request: () => fetchCityList(),
  },
  {
    title: 'Status',
    key: 'status',
    valueType: 'select',
    // Static options go through options; no request needed
    options: [
      { label: 'Enabled', value: 1 },
      { label: 'Disabled', value: 0 },
    ],
  },
]
```

When both `options` and a remote result exist, **`options` wins**. A column `defaultValue` triggers cascading loading of child nodes along the default path before expanding.

### Custom form fields

`valueType: 'custom'` with `formRender` takes over the control rendering:

```ts
{
  title: 'Tags',
  key: 'tags',
  valueType: 'custom',
  // key: field name; model: the form data ref; props: formItemProps from the column
  formRender: (key, model, props) => h(NSelect, {
    value: model.value[key],
    'onUpdate:value': v => (model.value[key] = v),
    multiple: true,
    tag: true,
    ...props,
  }),
}
```

### Validation and control props

- **Validation rules live on the column `rule`** (singular) and are passed to `NFormItemGi`
- **`formItemProps` is passed to the underlying control**, not to the form item. For example `{ min: 1 }` applies to `NInputNumber`, `{ type: 'textarea' }` to `NInput` and `{ multiple: true }` to `NSelect`
- Controls get `clearable: true` and a generated placeholder (`请输入${title}` / `请选择${title}`) by default; both can be overridden through `formItemProps`

```ts
{
  title: 'Age',
  key: 'age',
  valueType: 'digit',
  rule: [{ required: true, type: 'number', message: 'Please enter the age', trigger: ['blur', 'change'] }],
  formItemProps: { min: 0, max: 150, placeholder: 'Please enter the age' },
}
```

### Column settings and persistence

The column settings panel supports drag sorting, visibility toggles, left/right pinning, select-all and reset. Each row has a drag handle, a checkbox and two "pin left / pin right" icon buttons; clicking the active direction again unpins the column.

Pinning rules:

- The column `fixed` is the default, and panel actions take precedence; the saved record writes a fixed position for every column, with `null` meaning the column's configured `fixed` was explicitly cleared
- Output columns are regrouped as "left fixed → unpinned → right fixed" because naive-ui requires fixed columns at both ends of the column array; drag order is preserved inside a group and dragging never moves a column across groups
- How pinning interacts with horizontal scrolling is described in [Height and scrolling](#height-and-scrolling)

With `columnStorageKey` configured, preferences are stored in `localStorage`:

```text
pro-table:column-setting:<columnStorageKey>
```

Stored shape:

```json
{
  "order": ["name", "age", "email"],
  "hidden": ["email"],
  "declaredOrder": ["name", "age", "email", "remark"],
  "fixed": { "name": "left", "actions": "right", "email": null }
}
```

- `order`: the current column order in the panel; `hidden`: hidden columns
- `declaredOrder`: a snapshot of the `columns` declaration order at save time, used to tell "default order" from "user drag"
- `fixed`: column key → fixed position; a missing key falls back to the column `fixed`, and `null` means explicitly unpinned

Order rules on load:

- `order` equal to `declaredOrder` → the user never sorted manually, so the **latest declaration order** is used and reordering `columns` in code takes effect immediately
- They differ → the saved `order` is used; newly added columns (not in storage) follow `hideInTable` and are inserted at their declared position instead of being appended
- Legacy cache without `declaredOrder` (before 0.8.3) → migrated once as "never sorted manually" so declaration order changes take effect; state passed explicitly through `setColumnsState` is not migrated and its `order` is honored
- On first render, before async columns arrive, an empty state is never written to storage, so existing preferences are not overwritten

Other notes:

- **The key must be globally unique**; using the route name is recommended, e.g. `column-storage-key="user-list"`
- Without it, the current route name (`$route.name`) is used, so **preferences survive a refresh**; outside a router (or with unnamed routes) it falls back to a random key, and preferences are lost after refresh
- Multiple tables on the same route should each pass a unique `columnStorageKey`; otherwise they share one preference record and overwrite each other (a warning is logged in development)
- Reset removes the stored key and restores the `columns` order, `hideInTable` and the column `fixed` configuration
- A column is identified by `key`, then `type`, then a string `title`, and only then by positional index; **give every column a `key`**, otherwise renaming a title or moving a column can misalign the saved order, visibility and pinning

### Controlling the search form externally

ProTable exposes `searchFormRef` through `expose`; it provides `submit` / `reset` / `setFieldValue`:

```vue
<script setup>
import { ref } from 'vue'
import { ProTable } from '@banmao/procomponent'

const tableRef = ref(null)

function searchThisMonth() {
  const form = tableRef.value?.searchFormRef
  form?.setFieldValue('createTime', ['2026-11-01', '2026-11-30'])
  form?.submit() // validation + debounce, then onQuery
}

function clearSearch() {
  tableRef.value?.searchFormRef?.reset()
}
</script>

<template>
  <NButton @click="searchThisMonth">This month</NButton>
  <NButton @click="clearSearch">Clear</NButton>
  <ProTable ref="tableRef" :columns="columns" :data="dataSource" :on-query="handleQuery" />
</template>
```

### Instance methods and dynamic columns

Besides `searchFormRef`, the instance provides a set of table controls:

```ts
const tableRef = ref(null)

// Replace the column config; the table, search bar and column settings panel update together
tableRef.value?.setColumns(nextColumns)

// Apply column order and visibility (same as the panel, in memory only)
tableRef.value?.setColumnsState({ order: ['name', 'age'], hidden: ['age'] })
tableRef.value?.setColumnsState(null) // restore the original columns order and hideInTable

// Merge search conditions (emits update:searchModel)
tableRef.value?.setSearch({ name: 'Zhang San' })

// Replace data / control loading (controlled mode)
tableRef.value?.setTableData(rows)
tableRef.value?.setLoading(true)

// Reload: re-request the current page in request mode, otherwise emit loadData(1)
tableRef.value?.reload()
```

`columns` can be replaced wholesale at runtime (including through `setColumns`); the table columns, search bar and column settings rebuild accordingly, no `key` remount hack needed.

### With useList

Controlled mode is usually paired with `useList` from `@banmao/hooks`: the hook owns loading, pagination and query params, while ProTable only renders.

```vue
<script setup>
import { ref } from 'vue'
import { ProTable } from '@banmao/procomponent'
import { useList } from '@banmao/hooks'

const searchModel = ref({})

const { dataSource, loading, pagination, loadData, handlePageChange, handlePageSizeChange }
  = useList(fetchUserPage, { filterOption: searchModel })

// Search: store the conditions and go back to page 1
function handleQuery(params) {
  searchModel.value = params
  loadData(1)
}

// After a delete or any other mutation, reload the current page
function handleDelete(row) {
  // call the delete API...
  loadData()
}
</script>

<template>
  <ProTable
    remote
    :columns="columns"
    :data="dataSource"
    :loading="loading"
    :pagination="pagination"
    :row-key="row => row.id"
    :on-query="handleQuery"
    @update:page="handlePageChange"
    @update:page-size="handlePageSizeChange"
    @load-data="loadData"
  />
</template>
```

Conventions and notes:

- The list API should return `{ status: 200, data: { list, total, pageNum, pageSize } }`; use the `callback` option to adapt other shapes
- **Pass `remote`**: NDataTable then uses `pagination.itemCount` for the page count and does not slice the current page of `data` again
- `onQuery` receives the search form values: write them into `searchModel` (the `filterOption` ref), then call `loadData(1)`
- Wire `@update:page` / `@update:page-size` to `handlePageChange` / `handlePageSizeChange`; the hook updates `pagination` and re-requests
- The toolbar reload emits `@load-data`, which maps to `loadData`; `loadData()` without arguments reloads the current page
- Read the total from `pagination.itemCount`; page-size options, the quick jumper and the "共 N 条" prefix come from the hook's default pagination config
- After deletes or locale changes, call `loadData()` instead of mutating `dataSource` locally

### Row selection and batch actions

The `selection-action` slot renders above the table and receives **no slot props**; keep the selection in your own state through `@update:checked-row-keys`:

```vue
<script setup>
import { ref } from 'vue'
import { ProTable } from '@banmao/procomponent'

const checkedKeys = ref([])

function batchDelete() {
  // use checkedKeys.value to call the batch delete API
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
        {{ checkedKeys.length }} selected
        <NButton text type="error" @click="batchDelete">Delete selected</NButton>
      </NAlert>
    </template>
  </ProTable>
</template>
```

Do not forget to add `{ type: 'selection' }` to `columns`.

### Summary area

The `summary` slot renders between the search card and the table card and also receives **no slot props**:

```vue
<template>
  <ProTable :columns="columns" :data="dataSource">
    <template #summary>
      <NCard>Total amount: {{ totalAmount }}</NCard>
    </template>
  </ProTable>
</template>
```

For the native NDataTable footer summary row, use the **table-level** `summary` prop (a function, passed through) together with `summary-placement`.

### Row action column

```tsx
import { Actions } from '@banmao/procomponent'

const columns = [
  {
    title: 'Actions',
    key: 'actions',
    width: 160,
    fixed: 'right',
    render: row => (
      <Actions
        showNum={2}
        items={[
          { label: 'Edit', key: 'edit', variant: 'primary', onClick: () => handleEdit(row) },
          { label: 'Detail', key: 'detail', variant: 'info', onClick: () => handleDetail(row) },
          { label: 'Delete', key: 'delete', variant: 'error', onClick: () => handleDelete(row) },
        ]}
      />
    ),
  },
]
```

`Actions` uses `showNum` 2 by default and collapses extra actions into a dropdown; `align` controls alignment and defaults to `left`.

### Cell enhancements

- **Empty placeholder**: ProTable has a built-in `renderCell` that renders `null` / `undefined` / `''` as `-`; valid values such as `0` and `false` render normally
- **Index column**: `{ type: 'index' }` defaults to 56px wide, title "序号", centered, rendered as a round badge, and can be overridden by the column config
- **Copyable**: `copyable: true` uses the default config (no ellipsis, single line); for multi-line truncation pass an object `copyable: { ellipsis: true, lineClamp: 2 }`. It is rendered by the internal `ProText` and **overrides a custom column `render`**

<div class="table-responsive">

## API

### Props

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| simple | Simple mode: only NDataTable, no search bar, toolbar or card | `boolean` | `false` | |
| title | Card title, also used to build the create dialog title | `string` | `'数据列表'` | |
| columns | Column config driving the table, search bar and create form; replacing it at runtime updates everything | `ProTableColumn[]` | `[]` | |
| request | Table-level request; when provided ProTable owns data, pagination and loading | `ProTableRequest` | - | 0.8.0 |
| loading | Table loading state, also drives the search button loading and the reload icon animation | `boolean` | `false` | |
| search | Search config; `false` hides the search bar | `false \| SearchConfig` | `undefined` (shown) | |
| searchModel | Search model, supports `v-model:searchModel` | `Record<string, any>` | `{}` | 0.8.0 |
| toolbar | Toolbar config, **recommended** | `ToolbarConfig` | `{ createMode: 'button' }` | |
| toolbarConfig | Deprecated toolbar config, overridden by `toolbar` | `ToolbarConfig` | `{ createMode: 'button' }` | |
| params | Extra request params; changes reload and reset to page 1; also the initial search values (`searchModel` wins) | `Record<string, any>` | - | 0.8.0 |
| onQuery | Controlled-mode query callback fired on search and reset, debounced 300ms; not called in request mode | `(params: Record<string, any>) => Promise<void>` | - | |
| dataTableStyle | Table `style`, merged with the style generated by `height` | `string \| Record<string, any>` | - | 0.8.0 |
| height | Table height in px; enables `flex-height` | `number` | - | |
| autoFlex | Fill the remaining height of a flex container | `boolean` | `false` | 0.7.28 |
| columnStorageKey | Persistence key for column settings; must be unique. Defaults to the current route name, or a random key outside a router | `string` | current route name | 0.7.28 |

> In controlled mode `params` is **not** merged into `onQuery` and **does not** trigger a re-query when it changes: it is only read once when the search form mounts. In request mode `params` is merged with `searchModel` into `request` and changes re-request automatically.

### Passthrough NDataTable props

ProTable props merge naive-ui's `dataTableProps`; every native prop and event works directly, for example:

| Prop / event | Notes |
| --- | --- |
| `data` | Table data (**not `dataSource`**); owned by ProTable in request mode, the passed value is only the initial one |
| `pagination` | Pagination config; maintained by your code in controlled mode, owned by ProTable in request mode |
| `row-key` | Row identity, required for selection, expandable rows and tree data |
| `remote` | Server-side pagination / sorting / filtering; forced to `true` in request mode |
| `max-height` / `min-height` | Table body max / min height |
| `scroll-x` | Horizontal scroll width; estimated automatically when fixed columns exist and it is not set |
| `striped` / `bordered` / `bottom-bordered` / `single-line` | Table appearance |
| `checked-row-keys` / `expanded-row-keys` | Controlled selection / expansion |
| `summary` / `summary-placement` | Footer summary row and its position |
| `@update:page` / `@update:page-size` | Page / page-size changes |
| `@update:checked-row-keys` | Selection changes |
| `@update:sorter` / `@update:filters` | Sort / filter changes |

In request mode the `onUpdate*` callbacks are called first, then ProTable issues the request.

The following props are owned by ProTable and **overridden if passed**:

| Prop | Internal behavior |
| --- | --- |
| `columns` | Uses the derived `tableColumns` |
| `size` | Controlled by the density button, initially `large` |
| `render-cell` | Fixed to the empty placeholder renderer (empty values show `-`) |
| `flex-height` | Derived from `autoFlex` / `height` |
| `remote` | Forced to `true` in request mode |
| `style` | `height` becomes `{ height: 'Npx' }`, merged with `dataTableStyle`; `autoFlex` appends `flex: 1` and `min-height: 0` last |

### SearchConfig

When `search` is an object its fields override the internal ProForm, so ProForm props such as `gridCollapsedRows` and `responsive` are available in addition to the table below.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| gridCols | Fields per row; adapted to the table container width when omitted | `number` | auto |
| gridCollapsed | Whether the search bar is collapsed | `boolean` | `false` |
| defaultValue | Search defaults, also the reset target; wins over the initial `params` / `searchModel` | `Record<string, any>` | - |
| formRules | Form validation rules (native NForm prop) | `Record<string, any>` | - |
| formModel | Form model (native NForm prop) | `Record<string, any>` | - |
| labelWidth | Label width | `string \| number` | follows NForm |
| labelAlign | Label alignment | `'left' \| 'right'` | `'left'` |
| labelPlacement | Label placement | `'left' \| 'top'` | `'left'` |
| size | Form size | `'small' \| 'medium' \| 'large'` | `'medium'` |
| searchText | Search button label, takes precedence over `submitText` | `string` | `'搜索'` |
| submitText | Search button label when `searchText` is not set | `string` | - |
| showResetButton | Whether to show the reset button | `boolean` | `true` |
| showAdvancedButton | Whether to show the collapse toggle; `false` forces expansion | `boolean` | `true` |
| resetText | Reset button label | `string` | `'重置'` |
| sort | Sort direction of search fields by `order` | `'asc' \| 'desc'` | `'desc'` |

### ToolbarConfig

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| create | Whether to show the create button | `boolean` | `false` |
| createLabel | Create button label, also used for the dialog / drawer title | `string` | `'新增'` |
| createMode | Create button mode | `'button' \| 'modal' \| 'drawer'` | `'button'` |
| delete | Whether to show the delete button; disabled without selection | `boolean` | `false` |
| deleteLabel | Delete button label | `string` | `'删除'` |
| export | Whether to show the export button | `boolean` | `false` |
| exportLabel | Export button label | `string` | `'导出Excel'` |
| print | Whether to show the print button; calls the browser print dialog | `boolean` | `false` |
| printLabel | Print button label | `string` | `'打印'` |
| import | Whether to show the import button; emits `import` with the file | `boolean` | `false` |
| importLabel | Import button label | `string` | `'导入'` |
| importAccept | `accept` attribute of the file picker | `string` | - |
| reload | Whether to show the reload button (icon only, label as tooltip) | `boolean` | `true` |
| reloadLabel | Reload button tooltip text | `string` | `'刷新'` |
| density | Whether to show the density button | `boolean` | `true` |
| columnSetting | Whether to show the column settings button | `boolean` | `true` |
| columnSettingLabel | Column settings button label; icon only when omitted | `string` | - |
| sort | Whether to show the sort button; hidden by default and also hidden when no sortable columns exist | `boolean` | `false` |
| filter | Whether to show the filter button; hidden by default and also hidden when no filterable columns exist | `boolean` | `false` |
| fullscreen | Whether to show the fullscreen button | `boolean` | `true` |

> Toolbar config changes take effect immediately at runtime; no remount needed.

### ProTableColumn

`ProTableColumn = TableColumn & ProTableBaseColumn`, extending naive-ui column config with the fields below. All native fields (`key`, `title`, `width`, `minWidth`, `maxWidth`, `fixed`, `align`, `render`, `sorter`, `filter`, `children`, `ellipsis`, etc.) are available.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| valueType | Search form / form control type; **the field is omitted from the search bar without it** | `ValueType` | - |
| hideInSearch | Hide from the search bar | `boolean` | `false` |
| hideInForm | Hide from the create form | `boolean` | `false` |
| hideInTable | Hide from the table (still usable as a query condition) | `boolean` | `false` |
| copyable | Copyable cell content; an object configures ellipsis and line clamp | `boolean \| { ellipsis?: boolean, lineClamp?: number }` | `false` |
| tooltip | Hint on the header and the search label info icon | `string` | - |
| order | Search sort weight, used with `search.sort` | `number` | - |
| request | Remote enum request, called **without arguments** `request()`; re-fetches when the function reference changes | `() => Promise<SelectOption[]>` | - |
| defaultValue | Cascading lazy loading with `request`: calls `request(id)` level by level to complete the tree | `(string \| number)[]` | - |
| options | Static options; takes precedence over the `request` result | `SelectOption[]` | - |
| rule | Validation rule passed to `NFormItemGi` (**not `rules`**) | `FormItemRule \| FormItemRule[]` | - |
| formItemProps | Props **passed to the underlying control**, such as `min`, `multiple`, `type` | `Record<string, any>` | - |
| formRender | Custom rendering for `valueType: 'custom'` | `(key: string, model: Ref, formItemProps: any) => VNodeChild` | - |
| grid | Grid columns this item occupies in the search grid | `number` | `1` |

> `copyable` in object form, as well as `options` / `defaultValue` / `rule` / `formItemProps` / `formRender` / `grid`, **work at runtime but are not declared on `ProTableColumn`**; cast with `as any` in TypeScript. The declared signature of `request` is `(params, prop)` but it is actually called without arguments.

### ValueType

Control types that actually have render branches:

| Value | Control | Value type / format |
| --- | --- | --- |
| `text` | NInput | `string` |
| `textarea` | NInput (textarea) | `string` |
| `digit` | NInputNumber | `number \| null` |
| `select` | NSelect | option value |
| `radio` | NRadioGroup | option value |
| `checkbox` | NCheckboxGroup | `any[]` |
| `switch` | NSwitch | `boolean` |
| `cascader` | NCascader | option value |
| `date` | NDatePicker (date) | `string`, `yyyy-MM-dd` |
| `datetime` | NDatePicker (datetime) | `string`, `yyyy-MM-dd HH:mm:ss` |
| `daterange` | NDatePicker (daterange) | `[string, string]`, `yyyy-MM-dd` |
| `datetimerange` | NDatePicker (datetimerange) | `[string, string]`, `yyyy-MM-dd HH:mm:ss` |
| `month` | NDatePicker (month) | `string`, `yyyy-MM` |
| `monthrange` | NDatePicker (monthrange) | `[string, string]`, `yyyy-MM` |
| `time` | NTimePicker | timestamp |
| `upload` | NUpload | decided by `formItemProps` |
| `custom` | decided by `formRender` | custom |

> `treeSelect` and `timerange` exist in the type declaration but **have no render branch**, so the form item stays empty. Use `cascader` for tree selection, `datetimerange` for time ranges, or `custom` for your own control.
>
> Date controls bind through `formatted-value`, so `onQuery` receives **formatted strings**, not timestamps.

### Events

| Event | Description | Callback | Version |
| --- | --- | --- | --- |
| loadData | **Controlled mode toolbar reload only**; the argument is always 1; not fired in request mode | `(page: number) => void` | |
| create | Create button clicked, in all three `createMode` values | `() => void` | |
| exportData | Export button clicked; receives the latest search conditions (initially `params`) | `(params: Record<string, any>) => void` | 0.7.24 |
| submit | Search form submitted with valid values; receives the form values | `(values: Record<string, any>) => void` | 0.8.0 |
| update:searchModel | Search values changed, submitted, reset or set through `setSearch`; powers `v-model:searchModel` | `(values: Record<string, any>) => void` | 0.8.0 |
| reset | Reset button clicked; carries the restored values and the query has already re-run with them | `(values?: Record<string, any>) => void` | 0.7.24 |
| delete | Toolbar delete clicked; receives the selected keys (disabled without selection) | `(rowKeys: (string \| number)[]) => void` | 0.8.0 |
| print | Toolbar print clicked; `window.print()` has already been called | `() => void` | 0.8.0 |
| import | A file has been selected for import | `(file: File) => void` | 0.8.0 |

Pagination, sorting, filtering and selection events are forwarded from NDataTable, see [Passthrough NDataTable props](#passthrough-ndatatable-props). In request mode ProTable calls the provided `onUpdate*` handlers first and then issues the request.

### Slots

| Name | Description | Slot props |
| --- | --- | --- |
| toolbar | Custom content at the left of the toolbar | none |
| summary | Custom area between the search card and the table card | none |
| selection-action | Custom area above the table, usually batch action hints | none |

> None of the three slots **receives parameters**. Keep selection and column state in your own code through events such as `@update:checked-row-keys`. ProTable does not render a `default` slot.

### Expose (Ref API)

Members available through a `ref`:

| Member | Type | Description |
| --- | --- | --- |
| size | `Ref<'small' \| 'medium' \| 'large'>` | Current table density, read/write |
| searchFormRef | `ProFormInstance \| null` | Search form instance, `null` when `search` is `false` |
| searchRef | `NCard instance \| null` | Search card instance, `null` when `search` is `false` |

Instance methods:

| Method | Signature | Description |
| --- | --- | --- |
| reload | `() => Promise<void> \| void` | Re-request the current page in request mode; emit `loadData(1)` in controlled mode |
| setColumns | `(columns: ProTableColumn[]) => void` | Replace the column config; table, search bar and column settings stay in sync |
| setSearch | `(values: Record<string, any>) => void` | Merge search values and emit `update:searchModel`; does not query automatically |
| setForm | `(values: Record<string, any>) => void` | Alias of `setSearch` |
| setPagination | `(pagination: Record<string, any>) => void` | Update pagination (`page` / `pageSize` / `itemCount`); re-requests in request mode |
| setTableData | `(data: any[]) => void` | Replace the table data |
| setLoading | `(loading: boolean) => void` | Set internal loading, OR-ed with the `loading` prop |
| setSelectedRowKeys | `(keys: (string \| number)[]) => void` | Sync internal selected keys (used for the delete button); does not drive an uncontrolled table selection column — use `checked-row-keys` for that |
| setSelectedRows | `(rows: any[]) => void` | Record the selected rows for your code to read |
| setRowSelection | `(rowSelection: Record<string, any>) => void` | Record row-selection state only; naive-ui has no table-level `rowSelection`, use a `{ type: 'selection' }` column |
| setColumnsState | `(state: { order: string[], hidden: string[], declaredOrder?: string[], fixed?: Record<string, 'left' \| 'right' \| null> } \| null) => void` | Apply column order, visibility and pinning and sync the panel; in memory only, never writes `localStorage`; `null` restores the original columns |

Methods available on `searchFormRef`:

| Method | Signature | Description | Version |
| --- | --- | --- | --- |
| submit | `() => void` | Validate and trigger the query (through the debounce) | |
| reset | `() => void` | Reset to the default values | |
| setFieldValue | `(key: string, value: any) => void` | Set a single search field | 0.7.27 |

```ts
const tableRef = ref<InstanceType<typeof ProTable> | null>(null)

tableRef.value?.searchFormRef?.setFieldValue('name', 'Zhang San')
tableRef.value?.searchFormRef?.submit()

tableRef.value?.setColumns(nextColumns)
tableRef.value?.setColumnsState({
  order: ['name', 'age'],
  hidden: ['age'],
  fixed: { name: 'left' },
})
```

</div>

## FAQ

**No fields in the search bar?**
The column must have a `valueType`; without a matching render branch the form item stays empty. Also check whether the field was filtered out by `hideInSearch`, `type: 'selection' / 'index'` or `key: 'actions'`.

**Clicking search does nothing?**
In controlled mode `onQuery` is required; without it the console prints `ProTable: onQuery prop is required for search functionality`. In request mode check that `request` is passed. Searches are also debounced by 300ms, so rapid clicks only run the last one.

**No page / sort callbacks in request mode?**
You can still listen to `@update:page` / `@update:sorter` and similar events; ProTable calls your `onUpdate*` handlers and then requests automatically. Do not request again inside those handlers or you will send duplicate calls.

**With useList, only one page appears or page 2 is empty?**
Controlled mode with server-side pagination must pass `remote`, otherwise NDataTable computes the page count from `data.length` and slices the current page again. Request mode enables it automatically.

**Only the header renders and the body collapses?**
Upgrade to `0.8.0`. With `autoFlex`, make sure the ancestor has a definite height and is a column flex container; otherwise use `height` or `max-height`.

**Fixed columns do not work or horizontal scrolling looks wrong?**
Set `scroll-x` explicitly to the sum of column widths, or give every column a `width` so the automatic estimate is accurate.

**Column settings are lost after a refresh?**
Configure a unique and stable `columnStorageKey`. Without it the current route name is used; outside a router it falls back to a random key that only lives for the current instance.

**After upgrading to 0.8.3 the column order returned to the order declared in code?**
Since 0.8.3 a declaration order snapshot is saved with the preferences. Legacy cache has no `declaredOrder` and is treated as "never sorted manually" on first load so declaration order changes take effect once; drag to sort again and a new snapshot is written.

**Pinning does not take effect or is lost after a refresh?**
Pinned positions persist with the column settings, provided columns have a stable identity — give every column a `key`. Pinned columns are regrouped to both ends of the table; if `scroll-x` is set manually and is too small, the pinning effect is squeezed, so increase `scroll-x`.

**The `size` prop has no effect?**
Density is owned by the toolbar button, initially `large`. To fix the density, pass `:toolbar="{ density: false }"` to hide the button and change `size` through a ref.

**Custom renderCell does not work?**
That prop is owned by the internal empty placeholder renderer. Customize cells with a column-level `render`.

**The `render` of a copyable column is ignored?**
Copyable rendering takes precedence over a custom `render`; only one of them applies. If you need both, use `ProText` inside `render`.

**Date controls look wrong after reset?**
Use `null` rather than `''` or `undefined` for defaults; see the default values note under [Examples](#examples).

**No sort / filter button in the toolbar?**
Both buttons depend on eligible columns: a `key`, a string `title`, not a `selection` / `index` / `expand` type, and not the `action` / `actions` key. Also check that `toolbar.sort` / `toolbar.filter` were not explicitly set to `false`.

**The header arrows do not change after toolbar sorting?**
Toolbar sorting and NDataTable header sorting are two independent states: the header arrow only reflects `@update:sorter`, while toolbar sorting shows through the button highlight and tooltip. When both are enabled, controlled mode displays data in the order decided by the header sorter.

**A date range filter does not work?**
Controlled mode compares strings (`>= start && <= end`), so the data dates must be directly comparable (such as `yyyy-MM-dd`). For timestamps or custom formats use request mode and let the server handle it.

## Known limitations

Version 0.8.3 still has the following limitations:

| Item | Notes |
| --- | --- |
| `setRowSelection` | Records state only; naive-ui has no table-level `rowSelection`, use a `{ type: 'selection' }` column |
| `setSelectedRowKeys` / `setSelectedRows` | Only sync internal state (`setSelectedRowKeys` affects the delete button); they do not drive an uncontrolled table selection column — pass `checked-row-keys` for controlled selection |
| Multi-column sorting | Request mode only passes the first sorter to `request`; toolbar sorting takes precedence over header sorting |
| Toolbar sorting vs. header sorting | In controlled mode both apply: the header sorter sorts locally in NDataTable, toolbar sorting works on the passed `data`; when the same column is enabled in both, paging / sorting follows the header. Keep only one |
| `toolbarConfig` | Deprecated; use `toolbar` |
| Column-level `request` signature | Declared as `(params, prop)` but called without arguments at runtime; `defaultValue` is what performs cascading completion |
| Column pinning persistence | Pinned positions are saved by column key; without a `key` they fall back to the title or positional index, so renaming a title or inserting a column can misalign the preferences |
| Legacy order migration | A legacy preference without `declaredOrder` is migrated once as "never sorted manually"; afterwards it cannot be told apart from manual sorting |