---
name: QueryFilter
desc: "QueryFilter is a declarative filter form: describe fields with columns and it renders controls, a collapsible grid, search / reset, remote enums, controlled values, field slots and an instance API."
---

<route lang="yaml">
meta:
  layout: default
</route>

# QueryFilter

QueryFilter is a **complete declarative filter form**: describe the conditions with `columns`, and the component renders the controls and handles the grid layout, collapse / expand, search and reset, remote enums and controlled values. Your code only needs to care about which conditions exist and which values to search with.

How it relates to [LiteFilter](/en/procomponent/LiteFilter):

| Component | Positioning | Best for |
| --- | --- | --- |
| QueryFilter | Full filter form | List-page filter areas with many fields, collapsing, remote enums or custom controls |
| LiteFilter | Lightweight inline filter | Compact toolbars with label-free placeholders and an advanced popover, for quick filtering only |

This page describes the behavior of the current source in this repository.

## Features

- **Config-driven fields**: `columns` drive everything; `valueType` picks the control; `dateRange`, `radio` and `checkboxGroup` are included
- **Full value model**: uncontrolled (`defaultValue`) and controlled (`v-model:modelValue`)
- **Search / reset**: `search` / `reset` events with `loading`, `beforeSearch` and `searchOnReset`
- **Collapsible grid**: `gridCols`, `gridCollapsed` / `gridCollapsedRows`, plus controlled `v-model:collapsed`
- **Remote enums**: fetch options with `request`; the same request runs once, with loading state and failure events
- **Custom fields**: `field-<key>` slots take over any column's control
- **Extra actions**: the `actions` slot appends business buttons after the built-in ones
- **Instance methods**: `getValues`, `setValues`, `setFieldValue`, `search`, `reset`, `toggleCollapsed`, `refreshOptions`
- **Optional container**: `card=false` renders no card wrapper
- **Type exports**: `QueryFilterColumn`, `QueryFilterProps`, `QueryFilterEmits`, `QueryFilterExpose`, `QueryFilterValueType` and more

## When to use

- Filter areas at the top of list / report pages
- Many fields where secondary conditions should collapse into extra rows
- Dropdown options that come from APIs and need loading, failure handling or manual refresh
- Condition values that must stay in sync with external state (URL, store, parent form)
- A column that needs a non-standard control (range slider, composite input, etc.)

## Quick start

### Install

```script-tabs
@banmao/procomponent
```

### Import on demand

```vue
<script setup>
import { QueryFilter } from '@banmao/procomponent'
</script>
```

### Global registration

```ts
import { createApp } from 'vue'
import { QueryFilterPlugin } from '@banmao/procomponent'
import App from './App.vue'

createApp(App).use(QueryFilterPlugin).mount('#app')
```

### Basic usage

```vue
<script setup lang="ts">
import { QueryFilter, type QueryFilterColumn } from '@banmao/procomponent'

const columns: QueryFilterColumn[] = [
  { key: 'keyword', title: 'Keyword', valueType: 'text' },
  {
    key: 'status',
    title: 'Status',
    valueType: 'select',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Disabled', value: 'disabled' },
    ],
  },
  { key: 'createdAt', title: 'Created', valueType: 'date' },
]

function handleSearch(values: Record<string, any>) {
  console.log(values)
}
</script>

<template>
  <QueryFilter :columns="columns" @search="handleSearch" />
</template>
```

## Core concepts

### Column config

Each entry of `columns` describes one condition:

| Field | Description | Type |
| --- | --- | --- |
| `key` | Field identifier and value key | `string` |
| `title` | Field label | `string` |
| `valueType` | Control type, see the table below | `QueryFilterValueType` |
| `options` | Static options for `select` / `radio` / `checkboxGroup` etc. | `any[]` |
| `request` | Remote enum request | `() => Promise<any[]>` |
| `requestOnce` | Fetch a remote enum only once, default `true` | `boolean` |
| `hideInSearch` | Do not render; default values are still kept in the result | `boolean` |
| `order` | Sort weight, smaller first; unordered columns follow, keeping original order | `number` |
| `tooltip` | Info icon and content after the label | `string` |
| `formItemProps` | Props **passed to the control**, e.g. `min`, `multiple`, `type`, `valueFormat` | `Record<string, any>` |
| `placeholder` | Override the default placeholder | `string` |
| `disabled` | Disable the control | `boolean` |
| `grid` | Grid columns to span | `number` |

`formItemProps` follows ProForm's convention: it applies to the **control**, not to NFormItem.

### Field types

| `valueType` | Control | Initial value | Notes |
| --- | --- | --- | --- |
| `text` | `NInput` | `''` | Text input |
| `select` | `NSelect` | `null` | Use `formItemProps.multiple` for multi-select |
| `date` | `NDatePicker` | `null` | `valueFormat="yyyy-MM-dd"` by default |
| `dateRange` | `NDatePicker` (range) | `null` | Or use `formItemProps.type='daterange'` on a `date` column |
| `time` | `NTimePicker` | `null` | - |
| `cascader` | `NCascader` | `null` | Options are cascading |
| `autoComplete` | `NAutoComplete` | `''` | - |
| `colorPicker` | `NColorPicker` | `null` | - |
| `checkbox` | `NCheckbox` | `false` | Single boolean |
| `checkboxGroup` | `NCheckboxGroup` | `[]` | Multi-select array |
| `radio` | `NRadioGroup` | `null` | Options from `options` / `request` |
| `switch` | `NSwitch` | `false` | Single boolean |
| `dynamicTags` | `NDynamicTags` | `[]` | String array |
| `digit` | `NInputNumber` | `null` | Use `formItemProps.min/max` for ranges |
| `treeSelect` | `NTreeSelect` | `null` | Options are a tree |

Dates use formatted strings by default. Change `formItemProps.valueFormat` to adjust the format; set it to `null` to get timestamps. `dateRange` uses "Start date / End date" placeholders; passing `column.placeholder` overrides both.

### Value model

Two modes:

| Mode | Usage | Notes |
| --- | --- | --- |
| Uncontrolled | Pass `defaultValue` only | Values live inside the component; changes emit `update:modelValue` and `field-change` |
| Controlled | `v-model:modelValue` | The external object is the complete model; missing keys are filled with type defaults |

Key points:

- `defaultValue` is the **initial value and reset target**. When `modelValue` is provided, it wins on mount and on later syncs
- `update:modelValue` always emits the **complete value**, not a single-field patch
- `field-change(key, value, values)` fires on every field change, useful for tracking or conditional logic
- Replacing `modelValue` from outside syncs the form to "defaults + new values"; keys missing from the new object go back to their type defaults
- In uncontrolled mode, changing `defaultValue` at runtime merges into the current values; in controlled mode `modelValue` wins

```vue
<QueryFilter v-model:model-value="conditions" :columns="columns" />
```

### Search and reset

- **Search**: click "Search" or call `search()`; emits `search(values)` after validation
- **Reset**: click "Reset" or call `reset()`; restores `defaultValue` and emits `reset(values)`
- **loading**: while `loading` is `true`, the search button is loading and disabled, and reset is disabled
- **beforeSearch**: hook before searching; return `false` or `Promise<false>` to block. The button shows loading while an async hook runs
- **searchOnReset**: when `true`, a reset triggers a search automatically

```vue
<script setup lang="ts">
async function beforeSearch(values: Record<string, any>) {
  if (values.keyword && values.keyword.length < 2) {
    message.warning('Enter at least 2 characters')
    return false
  }
  return true
}
</script>

<template>
  <QueryFilter :columns="columns" :before-search="beforeSearch" search-on-reset />
</template>
```

If `beforeSearch` throws, the error is logged to the console and the search is aborted; no `search` event is emitted.

### Remote enums

With a column `request`, options are fetched when the component mounts:

- The same `key` + the same `request` function runs once (`requestOnce` defaults to `true`)
- Concurrent requests are de-duplicated; `select` / `cascader` / `treeSelect` show loading while fetching
- Success emits `options-loaded(key, options)`; failure emits `options-error(key, error)` and rendering continues
- Call `refreshOptions(key?)` to re-fetch; set `requestOnce: false` to reload whenever the column config changes

```vue
<script setup lang="ts">
const filterRef = ref()

function requestCities() {
  return api.getCities()
}
</script>

<template>
  <QueryFilter ref="filterRef" :columns="columns" />
  <NButton @click="filterRef?.refreshOptions('city')">Refresh cities</NButton>
</template>
```

Static `options` take precedence over remote enums: if a column has both, `options` is used.

### Collapse and grid

| Option | Description | Default |
| --- | --- | --- |
| `gridCols` | Columns per row; number or responsive string (e.g. `'1 s:2 m:3 l:4'`) | `3` |
| `formConfig.gridCollapsed` | Initial collapsed state; overridden by `collapsed` when controlled | `true` |
| `formConfig.gridCollapsedRows` | Rows visible while collapsed | `1` |
| `collapsed` | Controlled collapse (`v-model:collapsed`) | `undefined` |
| `showAdvancedButton` | Whether to render the collapse / expand button | `true` |
| `expandText` / `collapseText` | Expand / collapse labels | `'Expand'` / `'Collapse'` |

The collapse button appears when `columns + 1 > columns per row × collapsed rows` (the action area occupies one grid cell) and `showAdvancedButton` is `true`. For a responsive `gridCols` string, the first number is used for the estimate.

All other `formConfig` properties are passed to the inner `NForm` (such as `labelPlacement`, `size`, `rules`); `gridCollapsed` and `gridCollapsedRows` are not forwarded.

### Custom fields

The `field-<key>` slot takes over one column's control. Its scope contains `column`, `value` and `setValue`:

```vue
<QueryFilter :columns="columns">
  <template #field-budget="{ value, setValue }">
    <NSlider range :value="value ?? [0, 100]" @update:value="setValue" />
  </template>
</QueryFilter>
```

The slot must call `setValue` to write values back, so the value model, `field-change` and `update:modelValue` stay in sync. Columns without a matching slot keep the built-in control.

### actions slot

The `actions` slot renders after the built-in "Reset / Search / Collapse" buttons. Its scope provides:

| Field | Description |
| --- | --- |
| `search()` | Trigger a search, same as clicking Search |
| `reset()` | Trigger a reset |
| `toggleCollapsed()` | Toggle collapse |
| `collapsed` | Current collapsed state |
| `loading` | Whether a search is in progress |

```vue
<QueryFilter :columns="columns">
  <template #actions="{ search }">
    <NButton text type="primary" @click="search">Export conditions</NButton>
  </template>
</QueryFilter>
```

### Container

The outer container is an `NCard` (hoverable) by default. With `card=false` only the form is rendered, suitable for existing cards, drawers or toolbars.

## Examples

### Basic filtering

<Demo title="Text / select / date"
desc="Six fields in a three-column grid, collapsed by default; search and reset output the current values below."
:raw="BasicRaw">

<Basic />

</Demo>

### Remote enums

<Demo title="Options via request"
desc="Cities and departments come from async APIs; each request runs once, and the top bar can refresh enums while showing the request count."
:raw="RemoteSelectRaw">

<RemoteSelect />

</Demo>

### All field types

<Demo title="15 valueType variants"
desc="Expand to see every control; searching outputs the value for each type so you can compare types with their initial values."
:raw="ValueTypesRaw">

<ValueTypes />

</Demo>

### Controlled values

<Demo title="v-model:modelValue and v-model:collapsed"
desc="External buttons fill or clear conditions and control collapse; field changes emit field-change, and searching shows a 500ms loading."
:raw="ControlledRaw">

<Controlled />

</Demo>

### Custom fields

<Demo title="field-<key> slots"
desc="The keyword column becomes a tagged input and the budget column becomes a range slider; both write back through setValue."
:raw="CustomFieldRaw">

<CustomField />

</Demo>

### Grid and collapse

<Demo title="gridCols / grid / hideInSearch"
desc="Switch between two, three and responsive columns; the remark column spans two, the hidden column is not rendered, and card=false removes the card."
:raw="GridLayoutRaw">

<GridLayout />

</Demo>

### Instance methods and beforeSearch

<Demo title="setValues / search / refreshOptions"
desc="External buttons call instance methods; beforeSearch blocks keywords shorter than two characters, and buttons show loading while searching."
:raw="InstanceApiRaw">

<InstanceApi />

</Demo>

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| columns | Column config | `QueryFilterColumn[]` | `[]` |
| defaultValue | Initial value and reset target | `Record<string, any>` | `{}` |
| modelValue | Controlled value (`v-model:modelValue`) | `Record<string, any>` | `undefined` |
| gridCols | Columns per row | `number \| string` | `3` |
| formConfig | NForm props plus collapse config | `FormConfig` | `{ gridCollapsed: true, gridCollapsedRows: 1 }` |
| card | Whether to render the card container | `boolean` | `true` |
| collapsed | Controlled collapse (`v-model:collapsed`) | `boolean` | `undefined` |
| loading | Search loading and button disabling | `boolean` | `false` |
| searchText | Search button label | `string` | `'查询'` |
| resetText | Reset button label | `string` | `'重置'` |
| expandText | Expand button label | `string` | `'展开'` |
| collapseText | Collapse button label | `string` | `'折叠'` |
| showResetButton | Whether to show the reset button | `boolean` | `true` |
| showAdvancedButton | Whether to show the collapse / expand button | `boolean` | `true` |
| searchOnReset | Trigger a search after reset | `boolean` | `false` |
| beforeSearch | Pre-search hook; return `false` to block | `(values) => boolean \| Promise<boolean>` | `undefined` |

### Events

| Event | Description | Payload |
| --- | --- | --- |
| search | Search triggered | `(values: Record<string, any>) => void` |
| reset | Reset finished | `(values: Record<string, any>) => void` |
| update:modelValue | Value changed, for `v-model:modelValue` | `(values: Record<string, any>) => void` |
| update:collapsed | Collapse changed, for `v-model:collapsed` | `(collapsed: boolean) => void` |
| field-change | Any field changed | `(key: string, value: any, values: Record<string, any>) => void` |
| options-loaded | Remote enum resolved | `(key: string, options: any[]) => void` |
| options-error | Remote enum failed | `(key: string, error: unknown) => void` |

### Slots

| Slot | Description | Scope |
| --- | --- | --- |
| `field-<key>` | Take over a column's control | `{ column, value, setValue }` |
| actions | Extra actions after the built-in buttons | `{ search, reset, toggleCollapsed, collapsed, loading }` |

### Expose

| Name | Description |
| --- | --- |
| `getValues()` | Get the full value (deep clone) |
| `setValues(values, merge = true)` | Merge values; with `merge=false`, replace on top of `defaultValue` |
| `setFieldValue(key, value)` | Set one field |
| `getFieldValue(key)` | Read one field |
| `search()` | Trigger a search, returns `Promise<void>` |
| `reset()` | Restore `defaultValue` |
| `toggleCollapsed(force?)` | Toggle collapse; pass a boolean to force a state |
| `refreshOptions(key?)` | Re-fetch remote enums; all columns when `key` is omitted |
| `collapsed` | Current collapsed state |
| `optionsLoading` | Loading state per remote enum |
| `form` | Inner NForm instance |

### QueryFilterColumn

See [Column config](#column-config) and [Field types](#field-types).

### Type exports

```ts
import type {
  QueryFilterActionsScope,
  QueryFilterColumn,
  QueryFilterEmits,
  QueryFilterExpose,
  QueryFilterFieldScope,
  QueryFilterProps,
  QueryFilterValueType,
} from '@banmao/procomponent'
```

## FAQ

**Clicking Search does not emit `search`?**
Check whether `beforeSearch` returned `false` or is still running (the button shows loading). If `beforeSearch` throws, the search is aborted and the error is logged.

**Can reset trigger the list request automatically?**
Set `search-on-reset`; the component searches once after resetting. You can also handle it in `@reset`.

**Why does the remote enum not re-fetch?**
`requestOnce` defaults to `true`, so the same `key` + `request` runs once. Call `refreshOptions(key)`, or set `requestOnce: false` on the column.

**Why is the collapse button missing?**
It appears when `columns + 1 > columns per row × collapsed rows` and `showAdvancedButton` is `true`. For responsive `gridCols`, the first number is used; few fields simply need no collapsing.

**I changed `modelValue` but the form did not update?**
Controlled mode expects a new object reference; the component deep-compares before syncing. Also make sure `update:modelValue` is handled so `v-model` writes back.

**Why is a checkbox a boolean?**
`valueType: 'checkbox'` is a single boolean switch. Use `checkboxGroup` for multiple selections; its value is an array.

**What is the date value format?**
A `yyyy-MM-dd` string by default (an array of strings for `dateRange`). Change `formItemProps.valueFormat`, or set it to `null` for timestamps.

**Do hidden columns still appear in the search values?**
Yes. `hideInSearch` only controls rendering; the column still initializes its default value and keeps any `defaultValue`.

**Is `formItemProps` for FormItem or for the control?**
For the control, consistent with ProForm. Use `formConfig` for form-level options such as label width.

**Can I replace the whole field area?**
Use `field-<key>` for one column. There is no default slot replacing the entire form; use NForm directly if you need full control.

## Behavior contract

- Order: columns with `order` come first ascending; unordered columns keep original order afterwards; `hideInSearch` columns are not rendered
- Initial values: per field type; `defaultValue` and `modelValue` override matching keys
- Value sync: field change → `field-change` → `update:modelValue`; `update:modelValue` is always the complete value
- Search: after `beforeSearch` passes (or when absent), emit `search`; the button is loading during async hooks, and re-entrant calls are ignored
- Reset: restore `defaultValue` and emit `reset`; with `searchOnReset`, a search follows
- Remote enums: request once, de-duplicate concurrent calls, failures do not block rendering; static `options` win
- Collapse: both controlled and uncontrolled modes update internal state immediately; controlled mode also emits `update:collapsed`
- Container: with `card=false` only the NForm is rendered, with no outer card styles
