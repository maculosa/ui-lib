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
- 🔍 **Smart search**: supports advanced search, form validation and dynamic column configuration
- 🛠️ **Powerful toolbar**: built-in create, delete, export, print and other common actions
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
desc="Reset search: clicking the reset button clears the search form and triggers a query."
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

<div class="table-responsive">

## API

### Props

| Prop             | Description                                                                            | Type                                    | Default                    | Version |
| ---------------- | -------------------------------------------------------------------------------------- | --------------------------------------- | -------------------------- | ------- |
| simple           | Whether to enable simple mode, which only shows the basic table                        | `boolean`                               | `false`                    |         |
| title            | Table title, displayed at the top of the table                                         | `string`                                | 数据列表                   |         |
| columns          | Array of table column configuration descriptors                                        | [ProTableColumn[]](#columns)            | -                          |         |
| dataSource       | Table data source                                                                      | `any[]`                                 | -                          |         |
| loading          | Whether to show the loading animation                                                  | `boolean`                               | `false`                    |         |
| search           | Search configuration; set to `false` to hide the search bar                            | [SearchConfig](#searchConfig)           | `false`                    |         |
| toolbarConfig    | Toolbar configuration                                                                  | [ToolbarConfig](#toolbarConfig)         | `{ createMode: 'button' }` |         |
| params           | Extra query parameters, merged with the search form parameters                         | `object`                                | -                          |         |
| onQuery          | Query callback, triggered when the search or pagination changes                        | `(params: Record<string, any>) => void` | -                          |         |
| height           | Table height; a scrollbar appears when the table content exceeds it                    | `string`                                | -                          |         |
| autoFlex         | Flexible table height, calculated automatically from the height of the table container | `boolean`                               | false                      | 0.7.28  |
| columnStorageKey | Cache key for column settings; make sure it is unique, router.name is recommended      | `string`                                | -                          | v0.7.28 |

### SearchConfig

| Prop               | Description                                             | Type                           | Default  |
| ------------------ | ------------------------------------------------------- | ------------------------------ | -------- |
| gridCols           | Number of columns in the search form                    | `number`                       | 3        |
| defaultValue       | Default values of the search form                       | `Record<string, any>`          | -        |
| formRules          | Validation rules of the search form                     | [FormRules](#formRules)        | -        |
| formModel          | Form model of the search form, used for two-way binding | `Record<string, any>`          | -        |
| labelWidth         | Label width of the search form                          | `string`                       | auto     |
| labelAlign         | Label alignment of the search form                      | `left` \| `right`              | `left`   |
| labelPlacement     | Label placement of the search form                      | `left` \| `right`              | `left`   |
| size               | Size of the search form                                 | `large` \| `middle` \| `small` | `middle` |
| showAdvancedButton | Whether to show the advanced search button              | `boolean`                      | `true`   |
| showResetButton    | Whether to show the reset button                        | `boolean`                      | `true`   |
| resetText          | Text of the reset button                                | `string`                       | 重置     |
| submitText         | Text of the submit button                               | `string`                       | 提交     |
| searchText         | Text of the search button                               | `string`                       | 搜索     |
| sort               | Sort direction                                          | `asc` \| `desc`                | -        |

### ToolbarConfig

| Prop               | Description                                | Type                            | Default         |
| ------------------ | ------------------------------------------ | ------------------------------- | --------------- |
| create             | Whether to show the create button          | `boolean`                       | `true`          |
| createLabel        | Text of the create button                  | `string`                        | 新增            |
| createMode         | Trigger mode of the create button          | `button` \| `modal` \| `drawer` | `button`        |
| delete             | Whether to show the delete button          | `boolean`                       | `false`         |
| deleteLabel        | Text of the delete button                  | `string`                        | 删除            |
| export             | Whether to show the export button          | `boolean`                       | `false`         |
| exportLabel        | Text of the export button                  | `string`                        | 导出            |
| print              | Whether to show the print button           | `boolean`                       | `false`         |
| printLabel         | Text of the print button                   | `string`                        | 打印            |
| import             | Whether to show the import button          | `boolean`                       | `false`         |
| importLabel        | Text of the import button                  | `string`                        | 导入            |
| reload             | Whether to show the reload button          | `boolean`                       | `false`         |
| reloadLabel        | Text of the reload button                  | `string`                        | 刷新            |
| density            | Whether to show the density toggle button  | `boolean`                       | `false`         |
| densityLabel       | Text of the density toggle button          | `string`                        | 密度            |
| columnSetting      | Whether to show the column settings button | `boolean`                       | `false`         |
| columnSettingLabel | Text of the column settings button         | `string`                        | 列设置          |

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

| Event      | Description                                                  | Callback parameters                      | Version |
| ---------- | ------------------------------------------------------------ | ---------------------------------------- | ------- |
| loadData   | Data loading event, used to customize the data loading logic | `(page: number) => void`                 |         |
| create     | Create button click event                                    | `() => void`                             |         |
| exportData | Export button click event                                    | `(params?: Record<string, any>) => void` | 0.7.24  |
| submit     | Search form submit event                                     | `(params: Record<string, any>) => void`  |         |
| reset      | Search form reset event                                      | `(params?: Record<string, any>) => void` | 0.7.24  |

### Slots

| Name             | Description                                                                                      | Parameters                                           |
| ---------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| default          | Default slot, used to customize the table content                                                | -                                                    |
| summary          | Table summary row slot, used to customize the summary content at the bottom of the table         | `{ columns: ProTableColumn[], dataSource: any[] }`   |
| selection-action | Selected row action bar slot, used to customize the action buttons shown after rows are selected | `{ selectedRowKeys: string[], selectedRows: any[] }` |
| toolbar          | Toolbar slot, used to customize the toolbar content                                              | -                                                    |

</div>
