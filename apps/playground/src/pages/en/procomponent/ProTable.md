---
name: ProTable
desc: ProTable is an advanced table component built on Table. It provides common table features such as search, filtering and pagination, helping developers build data table interfaces quickly.
---

<route lang="yaml">
  meta:
    layout: default
</route>

# ProTable

ProTable is a powerful advanced table component extended from the base Table component. It offers a rich set of table features, including search, filtering, pagination, sorting and export, helping developers build complex data table interfaces quickly.

## Features

- 🎨 **Works out of the box**: many common table features are built in, no need to develop them again
- 📋 **Flexible configuration**: a rich set of options to meet the needs of different scenarios
- 🔍 **Smart search**: supports advanced search, form validation and dynamic column configuration; the search grid adapts its column count to the container width
- 🛠️ **Powerful toolbar**: built-in create, delete, export, print, sorting, filtering, fullscreen, density and column settings
- 📱 **Responsive design**: adapts to different screen sizes for a good mobile experience
- 🎯 **Type safe**: complete TypeScript type support to improve development efficiency

## Quick start

### Installation

```script-tabs
@banmao/procomponent
```

### Basic usage

```vue
<template>
  <ProTable
    :columns="columns"
    :dataSource="dataSource"
    :loading="loading"
    :search="true"
    @onQuery="handleQuery"
  />
</template>

<script setup>
import { ref } from 'vue'
import { ProTable } from '@banmao/procomponent'

const loading = ref(false)
const dataSource = ref([])

const columns = [
  { title: 'Name', dataIndex: 'name' },
  { title: 'Age', dataIndex: 'age' },
  { title: 'Gender', dataIndex: 'gender' },
  { title: 'Email', dataIndex: 'email' },
]

const handleQuery = params => {
  loading.value = true
  // Simulate an async request
  setTimeout(() => {
    dataSource.value = [
      { id: 1, name: 'Zhang San', age: 25, gender: 'Male', email: 'zhangsan@example.com' },
      { id: 2, name: 'Li Si', age: 30, gender: 'Female', email: 'lisi@example.com' },
    ]
    loading.value = false
  }, 1000)
}
</script>
```

## Examples

Below are some common ProTable examples, showing how the different features and configurations are used:

> When using the search bar, default values in the query parameters should be set to `null` instead of an empty string `''` or `undefined`.

<Demo title="Simple mode"
desc="Simple mode only displays data without any extra features, suitable for quickly showing basic table data."
:raw="SimpleDemoRaw">

<SimpleDemo />

</Demo>

<Demo
title="Basic mode"
desc="Basic mode includes the core table features such as pagination and sorting, suitable for most regular data display scenarios."
:raw="BaseRaw">

<Base />

</Demo>

<Demo
title="No search bar mode"
desc="Hides the search bar and only shows the table data, suitable for scenarios that do not need search."
:raw="NoSearchbarRaw">

<NoSearchbar />

</Demo>

<Demo
title="Fixed height mode"
desc="Sets a fixed height; a scrollbar appears when the data exceeds that height, suitable for scenarios with a large amount of data."
:raw="FixedHeightRaw">

<FixedHeight />

</Demo>

<Demo
title="Column tooltip mode"
desc="Uses tooltips in table columns to show details on hover, suitable for long content or content that needs extra explanation."
:raw="UseTooltipInColumnsRaw">

<UseTooltipInColumns />

</Demo>

<Demo
title="Search grid mode"
desc="The search form uses a grid layout with a customizable number of columns, suitable for scenarios with many search conditions."
:raw="SearchGridRaw">

<SearchGrid />

</Demo>

<Demo
title="Form create mode"
desc="Integrates a create form that is shown when the create button is clicked, suitable for simple creation scenarios."
:raw="CreateDemoRaw">

<CreateDemo />

</Demo>

<Demo
title="Modal create mode"
desc="Integrates modal creation; a modal is shown when the create button is clicked, suitable for scenarios that need a more complex create form."
:raw="CreateModalDemoRaw">

<CreateModalDemo />

</Demo>

<Demo
title="Query table mode"
desc="A table mode focused on querying, suitable for scenarios that need complex query conditions."
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
desc="Uses the search ref feature so the search form can be controlled through a ref, suitable for scenarios that need external control over search."
:raw="SearchRefDemoRaw">

<SearchRefDemo />

</Demo>

<Demo
title="Toolbar slot mode"
desc="Uses the toolbar slot to customize the toolbar content, suitable for scenarios that need custom action buttons."
:raw="ToolbarSlotDemoRaw">

<ToolbarSlotDemo />

</Demo>

<Demo
title="Delete and import"
desc="Enable toolbar.delete / toolbar.import to render the buttons: delete is disabled without selection and emits the selected keys; import emits the chosen File."
:raw="ToolbarActionsRaw">

<ToolbarActions />

</Demo>

<Demo
title="Action buttons mode"
desc="Adds action buttons such as edit and delete to table rows; clicking a button triggers the corresponding event."
:raw="ActionsDemoRaw">

<ActionsDemo />

</Demo>

<Demo
title="Set the table search box from external interactions"
desc="Assigns values to the table search box from external buttons or events and triggers a query, suitable for scenarios such as drilling down from statistic cards."
:raw="StatisticToSearchRaw" >
<StatisticToSearch />
</Demo>

<Demo
title="Select group mode"
desc="Uses a Select Group to carry multi-select filter conditions, suitable for tag-based, composable query scenarios."
:raw="SelectGroupDemoRaw">

<SelectGroupDemo />

</Demo>

### Toolbar sorting & filtering

<Demo
title="Sorting and filtering"
desc="Enable them with toolbar.sort / toolbar.filter. In controlled mode the toolbar sorting and filtering only affect the loaded data: sorting works on visible columns, while filter conditions are added on demand with controls matched to each field type."
:raw="ToolbarSortFilterRaw">

<ToolbarSortFilter />

</Demo>

<Demo
title="Fullscreen"
desc="Click the fullscreen icon to enlarge the search bar, toolbar and table to fill the browser viewport; click again or press Esc to restore."
:raw="ToolbarFullscreenRaw">

<ToolbarFullscreen />

</Demo>

### Data request

<Demo
title="Table-level request"
desc="With request, searching, paging, sorting and filtering all trigger requests automatically; return { data, total } and ProTable maintains data and pagination."
:raw="RequestModeRaw">

<RequestMode />

</Demo>

<Demo
title="Search model binding"
desc="v-model:searchModel reads and writes the search values; external buttons can set conditions, and @submit carries the form values."
:raw="SearchModelRaw">

<SearchModel />

</Demo>

### Instance methods

<Demo
title="Control the table through a ref"
desc="Call setColumns to add or remove columns, setColumnsState to apply visibility, setSearch to set conditions and setLoading to simulate external loading."
:raw="InstanceMethodsRaw">

<InstanceMethods />

</Demo>

<div class="table-responsive">

## API

### Props

| Prop | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| simple | Simple mode, only renders the bare table | `boolean` | `false` | |
| title | Table title, also used for the create form title | `string` | 数据列表 | |
| columns | Column configuration; replacing the array at runtime updates table and search form | [ProTableColumn[]](#columns) | `[]` | |
| request | Table-level request. When provided, ProTable owns data, pagination and loading | `ProTableRequest` | - | 0.8.0 |
| loading | Table loading state, also drives the search button and refresh icon | `boolean` | `false` | |
| search | Search configuration; set to `false` to hide the search bar | `false \| SearchConfig` | `undefined` (shown) | |
| searchModel | Search model, supports `v-model:searchModel` | `Record<string, any>` | `{}` | 0.8.0 |
| toolbar | Toolbar configuration (recommended) | [ToolbarConfig](#toolbarConfig) | `{ createMode: 'button' }` | |
| toolbarConfig | Deprecated toolbar configuration, overridden by `toolbar` | [ToolbarConfig](#toolbarConfig) | `{ createMode: 'button' }` | |
| params | Extra request parameters; changes trigger a reload and reset to page 1; also the initial search values (`searchModel` wins) | `Record<string, any>` | - | 0.8.0 |
| onQuery | Query callback for controlled mode, debounced 300ms; not called in request mode | `(params: Record<string, any>) => Promise<void>` | - | |
| dataTableStyle | Table `style`, merged with the style generated by `height` | `string \| Record<string, any>` | - | 0.8.0 |
| height | Table height in px; enables `flex-height` | `number` | - | |
| autoFlex | Fill the remaining height of a flex container | `boolean` | `false` | 0.7.28 |
| columnStorageKey | Persistence key for column settings; must be unique. Defaults to the current route name, or a random key outside a router | `string` | current route name | 0.7.28 |

`ProTableRequest` signature:

```ts
type ProTableRequest = (
  params: { current: number, pageSize: number, [key: string]: any },
  sorter: { columnKey?: string | number, order?: 'ascend' | 'descend' } | null,
  filters: Record<string, any[] | null>,
) => Promise<{ data: any[], total?: number }>
```

When `request` is provided, data, pagination and loading are managed by ProTable, and requests are sent on mount, search submit/reset, page / page-size / sorter / filter changes, and `params` changes (which reset to page 1).

Resetting restores the values captured when the component was created (`params` / `searchModel`) plus `search.defaultValue`; the current input is discarded, and the `reset` event carries these restored values.

In controlled mode, when pagination is handled by the server, pass `remote` explicitly: ProTable forwards it to NDataTable, which then takes the page count from `pagination.itemCount` instead of slicing the already-paginated `data` again. Request mode enables `remote` automatically.

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

### Toolbar sort, filter and fullscreen

- **Sort**: hidden by default, enable it with `toolbar.sort: true`. The popover lists all sortable columns plus a default "综合排序" entry that clears sorting. Clicking a column applies ascending order immediately; the direction list switches asc/desc. Selecting the current value again does not re-trigger a request.
- **Filter**: hidden by default, enable it with `toolbar.filter: true`. The popover starts empty and only shows an "add filter condition" button. Each row is `field select + value control + remove`. Value controls follow `valueType`: date / dateRange / datetime use a date picker, time uses a time picker, columns with `options` use a multi select, everything else uses a keyword input. Conditions are drafts until "确定" is clicked.
- **Data flow**: without `request`, sorting and filtering run locally on `data` (multi-select matches any value, text matches by contains, `dateRange` compares by range). With `request`, sorting is passed as the second argument and filters are merged into the third argument, then the first page is requested again.
- **Selectable columns**: only visible data columns with a string `title` are listed; `selection` / `index` / `expand` columns and `action` / `actions` keys are excluded.
- **Fullscreen**: implemented with fixed positioning (not the native Fullscreen API); it reuses the `autoFlex` height chain so the table body scrolls inside the viewport. Toggle it off or press `Esc` to restore.

### SearchConfig

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| gridCols | Number of columns in the search form; adapts to the container width when omitted | `number` | auto |
| gridCollapsed | Whether the search form is collapsed | `boolean` | `false` |
| defaultValue | Default values of the search form; also the reset target (wins over the initial `params` / `searchModel`) | `Record<string, any>` | - |
| formRules | Validation rules of the search form | `Record<string, any>` | - |
| formModel | Form model of the search form | `Record<string, any>` | - |
| labelWidth | Label width of the search form | `string \| number` | follows NForm |
| labelAlign | Label alignment | `left` \| `right` | `left` |
| labelPlacement | Label placement | `left` \| `top` | `left` |
| size | Size of the search form | `small` \| `medium` \| `large` | `medium` |
| searchText | Text of the search button (takes precedence over `submitText`) | `string` | 搜索 |
| submitText | Text of the search button when `searchText` is not set | `string` | - |
| showResetButton | Whether to show the reset button | `boolean` | `true` |
| showAdvancedButton | Whether to show the collapse toggle; `false` forces the form expanded | `boolean` | `true` |
| resetText | Text of the reset button | `string` | 重置 |
| sort | Sort direction of search fields by `order` | `asc` \| `desc` | `desc` |

### ToolbarConfig

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| create | Whether to show the create button | `boolean` | `false` |
| createLabel | Text of the create button, also used as the form title | `string` | 新增 |
| createMode | Trigger mode of the create button | `button` \| `modal` \| `drawer` | `button` |
| delete | Whether to show the delete button (disabled when nothing is selected) | `boolean` | `false` |
| deleteLabel | Text of the delete button | `string` | 删除 |
| export | Whether to show the export button | `boolean` | `false` |
| exportLabel | Text of the export button | `string` | 导出Excel |
| print | Whether to show the print button; calls `window.print()` on click | `boolean` | `false` |
| printLabel | Text of the print button | `string` | 打印 |
| import | Whether to show the import button; emits `import` with the selected `File` | `boolean` | `false` |
| importLabel | Text of the import button | `string` | 导入 |
| importAccept | `accept` attribute of the file input | `string` | - |
| reload | Whether to show the reload button (icon only, label as tooltip) | `boolean` | `true` |
| reloadLabel | Tooltip text of the reload button | `string` | 刷新 |
| density | Whether to show the density toggle button | `boolean` | `true` |
| columnSetting | Whether to show the column settings button | `boolean` | `true` |
| columnSettingLabel | Text of the column settings button; icon only when omitted | `string` | - |
| sort | Whether to show the sorting button; hidden by default, enable it explicitly | `boolean` | `false` |
| filter | Whether to show the filtering button; hidden by default, enable it explicitly | `boolean` | `false` |
| fullscreen | Whether to show the fullscreen button | `boolean` | `true` |

Toolbar configuration is fully reactive: changing it at runtime updates the UI immediately.

### Columns

| Prop          | Description                                                                | Type                                                     | Default |
| ------------- | -------------------------------------------------------------------------- | -------------------------------------------------------- | ------- |
| title         | Text displayed in the column header                                        | `string`                                                 | -       |
| valueType     | Form control type                                                          | [ValueType](#valueType)                                  | -       |
| hideInSearch  | Whether to hide this field in the search form                              | `boolean`                                                | `false` |
| hideInForm    | Whether to hide this field in the form                                     | `boolean`                                                | `false` |
| hideInTable   | Whether to hide this column in the table                                   | `boolean`                                                | `false` |
| copyable      | Whether the table cell content can be copied                               | `boolean`                                                | `false` |
| tooltip       | Column header hint, shown on hover                                         | `string`                                                 | -       |
| order         | Sort weight in the query form; fields with a higher weight come first      | `number`                                                 | -       |
| request       | Requests enum data from the server, used by selection components           | `(params: any, prop: string) => Promise<SelectOption[]>` | -       |
| formItemProps | Form item props, see [FormItemProps](/procomponent/ProForm/#FormItemProps) | `object`                                                 | -       |

### Column settings & persistence

The column settings panel supports drag sorting, visibility toggles, select-all and reset. With `columnStorageKey` configured, preferences are stored in `localStorage`:

```text
pro-table:column-setting:<columnStorageKey>
```

The stored shape is `{ order: string[], hidden: string[] }`. Notes:

- `columnStorageKey` must be globally unique; using the route name is recommended
- Without it, the current route name (`$route.name`) is used, so **preferences survive a refresh**; outside a router (or with unnamed routes) it falls back to a random key, and preferences are lost after refresh
- Multiple tables on the same route should each pass a unique `columnStorageKey`; otherwise they share one preference record and overwrite each other (a warning is logged in development)
- Reset removes the stored key and restores the original column order and `hideInTable` configuration
- A column is identified by `key`, then `type`, then a string `title`, and only then by positional index; **give every column a `key`**. Without one, the title keeps preferences stable when a new column is inserted
- Newly added columns (not present in storage) follow `hideInTable` and are inserted at their declared position in `columns` instead of being appended to the end

### ValueType

| Value type | Description          |
| ---------- | -------------------- |
| select     | Dropdown select      |
| text       | Text input           |
| cascader   | Cascader             |
| treeSelect | Tree select          |
| date       | Date picker          |
| datetime   | Date and time picker |
| time       | Time picker          |
| timerange  | Time range picker    |

### Events

| Event | Description | Callback parameters | Version |
| --- | --- | --- | --- |
| loadData | Fired only by the toolbar reload button in controlled mode (page is always `1`); not fired in request mode | `(page: number) => void` | |
| create | Create button click event | `() => void` | |
| exportData | Export button click event | `(params: Record<string, any>) => void` | 0.7.24 |
| submit | Search form submitted with valid values | `(values: Record<string, any>) => void` | 0.8.0 |
| update:searchModel | Search values changed, submitted, reset, or set through `setSearch`; powers `v-model:searchModel` | `(values: Record<string, any>) => void` | 0.8.0 |
| reset | Search form reset event; carries the reset values | `(values?: Record<string, any>) => void` | 0.7.24 |
| delete | Toolbar delete button clicked; receives the selected row keys | `(rowKeys: (string \| number)[]) => void` | 0.8.0 |
| print | Toolbar print button clicked; `window.print()` has already been called | `() => void` | 0.8.0 |
| import | A file has been selected for import | `(file: File) => void` | 0.8.0 |

Pagination, sorting, filtering and selection events are forwarded from NDataTable. In request mode ProTable calls the provided `onUpdate*` handlers first and then sends the request.

### Expose (Ref API)

| Member | Type | Description |
| --- | --- | --- |
| size | `Ref<'small' \| 'medium' \| 'large'>` | Current table density |
| searchFormRef | `ProFormInstance \| null` | Search form instance (`null` when `search` is `false`) |
| searchRef | `NCard instance \| null` | Search card instance (`null` when `search` is `false`) |
| reload | `() => Promise<void> \| void` | Re-request the current page (request mode) or emit `loadData(1)` |
| setColumns | `(columns: ProTableColumn[]) => void` | Replace columns; table, search form and column setting stay in sync |
| setSearch | `(values: Record<string, any>) => void` | Merge search values and emit `update:searchModel` |
| setForm | `(values: Record<string, any>) => void` | Alias of `setSearch` |
| setPagination | `(pagination: Record<string, any>) => void` | Update pagination and re-request in request mode |
| setTableData | `(data: any[]) => void` | Replace table data |
| setLoading | `(loading: boolean) => void` | Set internal loading (OR-ed with the `loading` prop) |
| setSelectedRowKeys | `(keys: (string \| number)[]) => void` | Track selected keys internally; pass `checked-row-keys` for controlled selection |
| setSelectedRows | `(rows: any[]) => void` | Store the selected row objects |
| setRowSelection | `(rowSelection: Record<string, any>) => void` | Stores row-selection state only; use a `{ type: 'selection' }` column for selection |
| setColumnsState | `(state: { order: string[], hidden: string[] } \| null) => void` | Apply column order/visibility in memory (`null` restores the original columns) |

### Slots

| Name | Description |
| --- | --- |
| toolbar | Custom content at the left of the toolbar |
| summary | Custom content between the search card and the table card |
| selection-action | Custom content above the table, usually for batch actions |

Slots do not receive parameters.

</div>
