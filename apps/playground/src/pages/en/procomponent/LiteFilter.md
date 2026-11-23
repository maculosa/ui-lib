---
name: LiteFilter
desc: "LiteFilter is a standalone compact filter bar: no card, no labels and no search button by default, so changing any condition fires a debounced search automatically. Placeholders with small controls and a 12px flex gap, content-sized fields that wrap instead of a grid, plus an advanced filter popover, height-clamped collapsing, remote enums and slots."
---

<route lang="yaml">
meta:
  layout: default
</route>

# LiteFilter

LiteFilter is a **standalone compact filter bar**. It does not depend on [QueryFilter](/en/procomponent/QueryFilter) for rendering: the card, the field labels and the search button are all removed by default, placeholders describe the conditions, controls and spacing are tuned for toolbar density, and picking a condition triggers a debounced search automatically. Fields **do not use a grid**: the main row is a flex wrapping container, each field takes a width derived from its `valueType`, and the row wraps when there is no space left. When there are many conditions, secondary fields can move into an "Advanced filter" popover while the main row keeps only the most common ones.

How it relates to QueryFilter:

| Component | Positioning | Best for |
| --- | --- | --- |
| QueryFilter | Full filter form | List-page filter areas with many fields, aligned grid columns, labelled layout, controlled values, instance methods and full state management |
| LiteFilter | Lightweight inline filter | Compact toolbars where fields pack by content width, common conditions plus an advanced popover, and only quick filtering |

This page describes the behavior of the current source in this repository.

## Features

- **Compact defaults**: no card, no labels, no search button, `small` controls, 12px gap; placeholders include the field title
- **Auto search**: any value change (including reset) emits `search` after `searchDebounce` milliseconds, so selecting a condition is enough
- **Content-sized fields**: the main row is a flex wrapping container, each field width comes from its `valueType` and can be overridden by `width` / `formItemProps.style.width`
- **Config-driven fields**: `LiteFilterColumn` supports all 15 `valueType` values
- **Advanced popover**: set `advanced: true` on a column to move it into an `NPopover` while the main row stays clean
- **Label switch**: `showLabel` restores labels; columns with `tooltip` always keep a compact label
- **Search / reset**: `search` / `reset` events with `loading`, `beforeSearch` and `searchOnReset`
- **Height-clamped collapsing**: `defaultCollapsed` / `collapsedRows` decide how many rows stay visible, with controlled `v-model:collapsed`
- **Remote enums**: fetch options with `request`; the same request runs once, and `refreshOptions` refreshes manually
- **Slots**: `field-<key>` takes over a single column (including advanced ones), `actions` appends business buttons after the built-in ones
- **Type exports**: `LiteFilterColumn`, `LiteFilterProps`, `LiteFilterEmits`, `LiteFilterExpose`, `LiteFilterValueType`, and more

## When to use

- A table toolbar that should fit in one or two compact rows
- A few common conditions plus some secondary conditions used occasionally
- You do not want a card container or grid alignment, and the page owns the outer layout
- You only need values emitted on search / reset, not controlled values or the full instance API

Use [QueryFilter](/en/procomponent/QueryFilter) when you need `v-model:modelValue`, `field-change`, `getValues` / `setValues`, equal-width grid columns or a fully labelled form layout.

## Quick start

### Install

```script-tabs
@banmao/procomponent
```

### Import on demand

```vue
<script setup>
import { LiteFilter } from '@banmao/procomponent'
</script>
```

### Global registration

```ts
import { createApp } from 'vue'
import { LiteFilterPlugin } from '@banmao/procomponent'
import App from './App.vue'

createApp(App).use(LiteFilterPlugin).mount('#app')
```

### Basic usage

```vue
<script setup lang="ts">
import { LiteFilter, type LiteFilterColumn } from '@banmao/procomponent'

const columns: LiteFilterColumn[] = [
  { key: 'keyword', title: '关键词', valueType: 'text' },
  {
    key: 'status',
    title: '状态',
    valueType: 'select',
    options: [
      { label: '启用', value: 'active' },
      { label: '停用', value: 'disabled' },
    ],
  },
  { key: 'createdAt', title: '创建日期', valueType: 'date' },
]

function handleSearch(values: Record<string, any>) {
  console.log(values)
}
</script>

<template>
  <LiteFilter :columns="columns" @search="handleSearch" />
</template>
```

## Compact defaults

| Item | Default | Description |
| --- | --- | --- |
| `card` | `false` | No card; embeds directly into the page |
| `showLabel` | `false` | No field labels; placeholders carry the meaning |
| `formConfig.size` | `'small'` | Inputs, selects and buttons are all 28px tall |
| `gap` | `12` | Flex row gap |
| `defaultCollapsed` | `true` | Starts collapsed, showing `collapsedRows` rows |
| `collapsedRows` | `1` | Rows visible while collapsed |

Placeholder rules: text fields use "请输入 + title", selects use "请选择 + title", and date / time fields use fixed texts. A column's `placeholder` always wins.

Pass `showLabel` to bring labels back. Columns with `tooltip` keep a compact "title + ⓘ" label even when labels are off, so hints stay reachable. To return to a regular density, pass `formConfig: { size: 'medium' }` and `gap: 16`.

### Field widths

The main row is a `display: flex; flex-wrap: wrap; gap: <gap>` container. Widths per type:

| `valueType` | Default width |
| --- | --- |
| `text` / `autoComplete` | `180px` |
| `dynamicTags` | `220px` |
| `select` / `cascader` / `treeSelect` | `160px` |
| `date` | `150px` |
| `dateRange` | `260px` |
| `time` / `digit` | `140px` |
| `colorPicker` | `120px` |
| `switch` / `checkbox` / `checkboxGroup` / `radio` | content-sized |

Width precedence: `formItemProps.style.width` > `column.width` > the type default. The action area is the last flex item and **sits right after the last field** (it is no longer pushed to the right edge), wrapping together with the rest.

## Advanced filter

Set `advanced: true` on a column and it leaves the main row for the "高级筛选" popover:

```vue
<script setup lang="ts">
const columns: LiteFilterColumn[] = [
  { key: 'keyword', title: '关键词', valueType: 'text' },
  { key: 'owner', title: '负责人', valueType: 'text', advanced: true },
  { key: 'createdAt', title: '创建日期', valueType: 'date', advanced: true },
]
</script>

<template>
  <LiteFilter :columns="columns" advanced-text="More filters" />
</template>
```

- **Trigger**: a text button labelled by `advancedText` appears in the action area
- **Content**: advanced columns render with labels in a single vertical column (the popover is 280px wide); at the bottom there is only a reset button, and it clears just the popover fields
- **Values**: the main row and the popover share one value model; `search` / `reset` include every field
- **Slots**: `field-<key>` also works for advanced columns
- **Disable**: with `advancedPopover=false`, all columns render in the main row again

`hideInSearch` takes precedence over `advanced`. Advanced columns do not take part in the main row collapsing.

## Column configuration

| Field | Description | Type |
| --- | --- | --- |
| `key` | Field identifier, also the value key | `string` |
| `title` | Field title; used in placeholders when labels are off | `string` |
| `valueType` | Control type, see the table below | `LiteFilterValueType` |
| `options` | Static options | `any[]` |
| `request` | Remote enum request | `() => Promise<any[]>` |
| `requestOnce` | Whether to request only once, defaults to `true` | `boolean` |
| `hideInSearch` | Not rendered; default values still appear in results | `boolean` |
| `advanced` | Move into the advanced popover | `boolean` |
| `order` | Sort weight, smaller first | `number` |
| `tooltip` | Hint icon after the title; keeps a compact label on this column | `string` |
| `width` | Field width, overrides the type default | `number \| string` |
| `formItemProps` | Props forwarded to the control; `style.width` wins | `Record<string, any>` |
| `placeholder` | Overrides the default placeholder | `string` |
| `disabled` | Disables the control | `boolean` |

### Field types

| `valueType` | Control | Empty value | Notes |
| --- | --- | --- | --- |
| `text` | `NInput` | `''` | Text input |
| `select` | `NSelect` | `null` | Use `formItemProps.multiple` for multi-select |
| `date` | `NDatePicker` | `null` | Defaults to `valueFormat="yyyy-MM-dd"` |
| `dateRange` | `NDatePicker` (range) | `null` | Or set `formItemProps.type='daterange'` on a `date` column |
| `time` | `NTimePicker` | `null` | - |
| `cascader` | `NCascader` | `null` | Cascading options |
| `autoComplete` | `NAutoComplete` | `''` | - |
| `colorPicker` | `NColorPicker` | `null` | - |
| `checkbox` | `NCheckbox` | `false` | Single boolean |
| `checkboxGroup` | `NCheckboxGroup` | `[]` | Array of values |
| `radio` | `NRadioGroup` | `null` | Options from `options` / `request` |
| `switch` | `NSwitch` | `false` | Single boolean |
| `dynamicTags` | `NDynamicTags` | `[]` | String array |
| `digit` | `NInputNumber` | `null` | Use `formItemProps.min/max` for ranges |
| `treeSelect` | `NTreeSelect` | `null` | Tree options |

Dates use formatted strings by default. Change `formItemProps.valueFormat`, or set it to `null` for timestamps. `dateRange` uses "开始日期 / 结束日期" placeholders by default; `column.placeholder` overrides both ends.

## Value model

LiteFilter keeps a single internal value:

- `defaultValue` is the **initial value and reset target**; changing it at runtime merges into the current values and, following the auto-search rule, emits one more `search`
- `search(values)` and `reset(values)` always emit the **complete values**
- There is no `v-model` and no `field-change`; use QueryFilter if you need to read or write values at arbitrary times

## Auto search and reset

LiteFilter has **no search button by default**: whenever any field value changes (including clicking reset or updating `defaultValue`), it waits `searchDebounce` milliseconds and then emits `search(values)` once. Typing repeatedly counts as one condition change — the timer restarts on every change.

| Option | Description | Default |
| --- | --- | --- |
| `searchDebounce` | Debounce window before the automatic search, in milliseconds; `0` means no extra wait | `300` |
| `showSearchButton` | Shows the "查询" button; turning it on returns to manual search and stops the automatic one | `false` |
| `showResetButton` | Whether to show the reset button (right after the last field) | `true` |
| `searchOnReset` | In manual mode, whether reset also triggers a search; in auto mode the reset itself already triggers one | `false` |

- **Interception**: automatic and manual searches share `beforeSearch`; returning `false` or `Promise<false>` keeps `search` from being emitted
- **Merging**: changes inside one debounce window collapse into a single search; a trigger arriving while the async hook runs is ignored
- **Reset**: the main row reset restores every field to its `defaultValue` and emits `reset(values)`; the popover reset clears only the advanced fields
- **loading**: while `true` the reset button is disabled, and the search button (when shown) enters loading and is disabled
- **Both at once**: `showSearchButton` and auto search are mutually exclusive; if you need an extra trigger, call `search()` from the `actions` slot

### Remote enums

- The same `key` + the same `request` function runs once (`requestOnce` defaults to `true`)
- Concurrent requests are deduplicated; `select` / `cascader` / `treeSelect` show loading meanwhile
- Success emits `options-loaded(key, options)`; failure emits `options-error(key, error)` and rendering continues
- Call `refreshOptions(key?)` on the instance to reload; `requestOnce: false` reloads whenever the column config changes

Static `options` take precedence over remote enums.

### Collapsing

| Option | Description | Default |
| --- | --- | --- |
| `defaultCollapsed` | Initially collapsed; `collapsed` wins in controlled mode | `true` |
| `collapsedRows` | Rows visible while collapsed | `1` |
| `collapsed` | Controlled collapse (`v-model:collapsed`) | `undefined` |
| `showAdvancedButton` | Whether to show the expand / collapse button | `true` |
| `expandText` / `collapseText` | Expand / collapse texts | `'展开'` / `'折叠'` |
| `gap` | Flex row gap | `12` |

Collapsing clamps the container height and hides the overflow: the limit is `collapsedRows × row height + (collapsedRows - 1) × gap`, where the row height is `34px` for `small`, `40px` for `medium` and `46px` for `large`. The expand / collapse button only appears when the **measured** content height exceeds that limit (a `ResizeObserver` re-measures when the container resizes). Advanced columns are not part of the main row content.

### Custom fields

The `field-<key>` slot takes over any column, including advanced ones, with a scope of `column`, `value` and `setValue`:

```vue
<LiteFilter :columns="columns">
  <template #field-budget="{ value, setValue }">
    <NSlider range :value="value ?? [0, 100]" @update:value="setValue" />
  </template>
</LiteFilter>
```

Let the slot content fill the field width (the width still comes from `width`) and always call `setValue` so the value model stays in sync.

### actions slot

The `actions` slot renders after the built-in buttons with this scope:

| Field | Description |
| --- | --- |
| `search()` | Trigger a search |
| `reset()` | Trigger a reset |
| `toggleCollapsed()` | Toggle the collapse state |
| `collapsed` | Whether the form is collapsed |
| `loading` | Whether a search is in progress |

### Container

Only the `NForm` is rendered by default. With `card=true`, it is wrapped in an `NCard` (`size="small"`, hoverable).

## Examples

### Basic usage

<Demo title="Compact toolbar"
desc="No card and no labels by default; placeholders describe conditions, with small controls and a 12px gap. Fields pack by content width and everything past the collapsed rows hides behind 展开."
:raw="BasicRaw">

<Basic />

</Demo>

### Auto search and manual search

<Demo title="searchDebounce / showSearchButton"
desc="No search button by default: conditions emit search after the debounce window and rapid typing collapses into one request. Switching on the search button returns to manual mode."
:raw="SearchModeRaw">

<SearchMode />

</Demo>

### Advanced filter popover

<Demo title="advanced columns + NPopover"
desc="Keyword and status stay in the main row while owner / date / amount move into the popover; changing a popover condition also searches automatically, and its reset clears only the popover fields."
:raw="AdvancedFilterRaw">

<AdvancedFilter />

</Demo>

### Remote enums

<Demo title="Options from request"
desc="City and department come from async APIs; the same request runs once, and the exposed refreshOptions can reload options manually."
:raw="RemoteEnumRaw">

<RemoteEnum />

</Demo>

### Gap, width and collapsing

<Demo title="gap / width / v-model:collapsed"
desc="Switch between 8, 12 and 20px gaps; the remark column is widened with width=260; external buttons control collapsing, labels and the card, and narrowing the container shows the wrapping."
:raw="WrapCollapseRaw">

<WrapCollapse />

</Demo>

### Custom fields and extra actions

<Demo title="field-<key> and actions slots"
desc="The keyword column becomes a tagged input with width=240 and the action area gains an export button; the status tooltip keeps a compact label."
:raw="SlotsRaw">

<Slots />

</Demo>

### Loading and search interception

<Demo title="loading / beforeSearch"
desc="beforeSearch intercepts the automatic search while the keyword is shorter than 2 characters; during a search the reset button is disabled."
:raw="LoadingRaw">

<Loading />

</Demo>

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| columns | Column configuration | `LiteFilterColumn[]` | `[]` |
| defaultValue | Initial values and reset target | `Record<string, any>` | `{}` |
| formConfig | Props forwarded to NForm | `LiteFilterFormConfig` | `{}` |
| card | Whether to render a card container | `boolean` | `false` |
| defaultCollapsed | Initial collapse state (uncontrolled) | `boolean` | `true` |
| collapsedRows | Rows visible while collapsed | `number` | `1` |
| collapsed | Controlled collapse (`v-model:collapsed`) | `boolean` | `undefined` |
| loading | Search loading and button disabling | `boolean` | `false` |
| beforeSearch | Pre-search hook; return `false` to block | `(values) => boolean \| Promise<boolean>` | `undefined` |
| searchText | Search button text (only rendered with `showSearchButton`) | `string` | `'查询'` |
| resetText | Reset button text | `string` | `'重置'` |
| expandText | Expand button text | `string` | `'展开'` |
| collapseText | Collapse button text | `string` | `'折叠'` |
| showResetButton | Whether to show the reset button | `boolean` | `true` |
| showSearchButton | Whether to show the search button; `true` also disables auto search | `boolean` | `false` |
| searchDebounce | Debounce window for the automatic search, in milliseconds | `number` | `300` |
| showAdvancedButton | Whether to show the expand / collapse button | `boolean` | `true` |
| searchOnReset | Whether to search after reset in manual mode | `boolean` | `false` |
| showLabel | Whether to show field labels | `boolean` | `false` |
| advancedPopover | Whether `advanced` columns move into a popover | `boolean` | `true` |
| advancedText | Advanced filter button text | `string` | `'高级筛选'` |
| gap | Flex row gap | `number` | `12` |

### Events

| Event | Description | Callback |
| --- | --- | --- |
| search | Search triggered (after the debounce window, or by clicking the search button) | `(values: Record<string, any>) => void` |
| reset | Reset completed | `(values: Record<string, any>) => void` |
| update:collapsed | Collapse state changed, for `v-model:collapsed` | `(collapsed: boolean) => void` |
| options-loaded | Remote enum resolved | `(key: string, options: any[]) => void` |
| options-error | Remote enum failed | `(key: string, error: unknown) => void` |

### Slots

| Slot | Description | Scope |
| --- | --- | --- |
| `field-<key>` | Takes over the control of a column (including advanced ones) | `{ column, value, setValue }` |
| actions | Appends actions after the built-in buttons | `{ search, reset, toggleCollapsed, collapsed, loading }` |
| default | Legacy compatibility; rendered once in the action area | Same as `actions` |

### Expose

| Name | Description |
| --- | --- |
| `refreshOptions(key?)` | Reload remote enums; omit `key` to refresh all |

### Type exports

```ts
import type {
  LiteFilterActionsScope,
  LiteFilterColumn,
  LiteFilterEmits,
  LiteFilterExpose,
  LiteFilterFieldScope,
  LiteFilterFormConfig,
  LiteFilterProps,
  LiteFilterValueType,
} from '@banmao/procomponent'
```

## FAQ

**Why are there no field labels?**
LiteFilter defaults to `showLabel=false` so placeholders can describe conditions and one row can fit more fields. Pass `showLabel` to restore labels; columns with `tooltip` always keep a compact label.

**How is it different from QueryFilter?**
LiteFilter is a standalone implementation, not a wrapper: the main row is flex with content-sized fields instead of equal grid columns, it is compact by default (no labels, small size, 12px gap, no search button — values search automatically) and adds an advanced popover. It does not provide `v-model:modelValue`, `field-change` or the full instance API.

**A field is too wide or too narrow.**
The per-type width is only a fallback. Use `column.width` for one field, or `formItemProps.style.width` to override it (highest precedence). `switch` / `checkbox` / `radio` fields stay content-sized and take no extra space.

**The advanced popover does not appear.**
It needs at least one column with `advanced: true`, `advancedPopover` set to `true` (the default), and that column must not use `hideInSearch`.

**Do popover conditions take part in search?**
Yes. The main row and the popover share one value model; `search` / `reset` cover every field, changing a popover condition runs the same debounced auto search, and the popover only keeps a reset button that clears its own fields.

**Why is there no search button?**
A lightweight filter bar is meant to "search as soon as you pick", so the default is a debounced `search` on value change and no button at all; the reset button simply follows the last field. Pass `showSearchButton` when you must confirm before querying (expensive cascades, validation first) — the component then returns to manual mode and stops searching automatically. If you still want an extra trigger, call `search()` from the `actions` slot.

**The collapse button is missing.**
It only appears when the measured content height is taller than the collapsed limit. If everything fits in the visible rows, `showAdvancedButton` is `false`, or the container has no layout size (for example the first SSR frame), the button stays hidden. Narrow the container or add fields to see it appear.

**How do I refresh remote enums?**
`requestOnce` defaults to `true`, so the same `key` + `request` function runs once. Call `refreshOptions(key)` through a component ref to force a refresh, or set `requestOnce: false` on that column.

**Can I read the current values at any time?**
LiteFilter does not expose `getValues`; values are emitted with `search` / `reset`. Use QueryFilter when you need to read or write values at arbitrary times.

## Behavior contract

- Column order: sorted by `order` ascending with unordered columns after, preserving their original order; `hideInSearch` columns are not rendered
- Layout: the main row is a flex wrapping container with `gap`; field widths come from the type default and can be overridden by `width` / `formItemProps.style.width`; the action area follows the last field and wraps with the rest; no `NGrid` is rendered inside the component
- Grouping: when `advancedPopover` is `true`, `advanced` columns move into the vertical popover and the rest stay in the main row
- Labels: hidden by default; rendered when `showLabel` is true or the column has a `tooltip`
- Empty values: initialized by field type; `defaultValue` overrides matching keys
- Search: by default any field value change waits for the `searchDebounce` window and then emits `search` (changes inside the window collapse into one request); with `showSearchButton=true` only the button emits. Both modes run `beforeSearch` first and skip the emit when it returns `false`; a trigger arriving while the async hook runs is ignored
- Reset: the main row restores every field to its `defaultValue` and emits `reset`; the popover reset restores only the advanced fields. In auto mode the value change triggers one more `search`; in manual mode `searchOnReset` decides whether a search follows
- Remote enums: requested once, deduplicated while in flight, failures do not block; static `options` take precedence
- Collapsing: while `collapsed` is true the container is height-clamped with `overflow: hidden`; both controlled and uncontrolled modes update the internal state immediately, and controlled mode also emits `update:collapsed`; the expand / collapse button is decided by comparing the measured content height with the limit
- Container: `card=false` renders only the NForm without any outer card styles
