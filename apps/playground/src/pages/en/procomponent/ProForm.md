---
name: ProForm
desc: ProForm is a configuration-driven form built on NForm. Describe fields with columns, let valueType pick the control, and get grid layout, search / login action areas, field- and form-level validation, remote options, default values, reset and instance methods.
---

<route lang="yaml">
meta:
  layout: default
</route>

# ProForm

ProForm is a **configuration-driven form**. Describe fields with a `columns` array, let `valueType` choose the control, and hold the data with `v-model:model`. On top of NForm it adds grid layout, search / login action areas, remote options, default-value reset and instance methods, which suits CRUD and query forms in admin consoles.

This page describes the behavior of the current source in this repository.

## Features

- **Configured fields**: driven by `columns`; `key` + `title` + `valueType` is enough
- **16 built-in controls**: text, textarea, number, select, radio, checkbox, cascader, switch, time, date, datetime and both range pickers, month and month range, upload
- **Custom controls**: `valueType: 'custom'` + `formRender` take over rendering entirely
- **Grid layout**: `gridCols` sets the column count, column-level `grid` maps to the grid `span`
- **Three action areas**: `normal` / `search` / `login`; `modal` / `drawer` render no buttons and are meant for container components
- **Validation**: form-level `rules` pass through to NForm, column-level `rule` attaches to the matching NFormItem
- **Remote options**: column-level `request` loads options asynchronously, cached per `key`, with `options` taking precedence
- **Two-way data**: `v-model:model` writes internal changes back to the external model
- **Defaults and reset**: `defaultValue` is both the initial value and the reset target
- **Instance methods**: `submit()`, `reset()`, `validate()`, `getValues()`, `setFieldValue(key, value)`
- **NForm pass-through**: `labelWidth`, `labelPlacement`, `size`, `disabled`, `showFeedback`, etc. go straight through

## When to use

- You want to build CRUD forms quickly, where field differences are configured, not templated
- The query area needs a consistent search / reset / expand-collapse layout
- Field options come from an API and should be cached per field to avoid duplicate requests
- Several forms share one set of field definitions and validation rules

## Quick start

### Install

```script-tabs
@banmao/procomponent
```

### Import on demand

```vue
<script setup>
import { ProForm } from '@banmao/procomponent'
</script>
```

### Global registration

```ts
import { createApp } from 'vue'
import { ProFormPlugin } from '@banmao/procomponent'
import App from './App.vue'

createApp(App).use(ProFormPlugin).mount('#app')
```

### Basic usage

`columns` describes the fields, `v-model:model` holds the data, and `@submit` fires after validation passes:

```vue
<script setup>
import { ref } from 'vue'
import { ProForm } from '@banmao/procomponent'

const formModel = ref({})
const columns = [
  { title: 'Username', key: 'username', valueType: 'text' },
  {
    title: 'Role',
    key: 'role',
    valueType: 'select',
    options: [
      { label: 'Admin', value: 'admin' },
      { label: 'Editor', value: 'editor' },
    ],
  },
  { title: 'Age', key: 'age', valueType: 'digit' },
  { title: 'Join date', key: 'joinDate', valueType: 'date' },
]

function handleSubmit(values) {
  console.log(values)
}
</script>

<template>
  <ProForm
    v-model:model="formModel"
    :columns="columns"
    :grid-cols="2"
    label-placement="left"
    :label-width="96"
    @submit="handleSubmit"
  />
</template>
```

## Core concepts

### Data shape

The component keeps an internal `formData`, initialized from `columns` on mount and rebuilt from the current `columns` on reset. Initial values are:

| valueType | Control | Initial value |
| --- | --- | --- |
| `text` | NInput | `''` |
| `textarea` | NInput (textarea) | `''` |
| `digit` | NInputNumber | `null` |
| `select` | NSelect | `null` |
| `radio` | NRadioGroup | `''` |
| `checkbox` | NCheckboxGroup | `[]` |
| `cascader` | NCascader | `null` |
| `switch` | NSwitch | `false` |
| `time` | NTimePicker | `null` |
| `date` / `datetime` / `daterange` / `datetimerange` | NDatePicker | `null` |
| `month` / `monthrange` | NDatePicker | `''` |
| `upload` | NUpload | `null` |
| `custom` | Decided by `formRender` | `''` |

`month` / `monthrange` currently fall into the text branch and start as `''`; prefer passing `null` explicitly in `model` so the date picker never receives an empty string.

Date controls bind through `formatted-value`:

| valueType | Format |
| --- | --- |
| `date` / `daterange` | `yyyy-MM-dd`; range values are string arrays |
| `datetime` / `datetimerange` | `yyyy-MM-dd HH:mm:ss`; range values are string arrays |
| `month` / `monthrange` | `yyyy-MM`; range values are string arrays |

### Data flow: model and defaultValue

- `model` (`v-model:model`) shares data with the outside: on mount it is **merged as a whole** into the internal `formData` (including keys not in `columns`), and internal changes are written back through `update:model`
- The mount step does **not** emit `update:model`; every later field change does
- **When both `defaultValue` and `model` are present, `defaultValue` wins**: mounting overwrites the internal data with `defaultValue`
- After mounting, changing `model` only syncs **keys that already exist in `formData`**; new keys do not enter the form automatically
- `defaultValue` is also the **reset target**, see [Submit and reset](#submit-and-reset)

```ts
const formModel = ref({ name: 'Zhang San' })

// After mount: writes back into the form
formModel.value.name = 'Li Si'

// Does not reach the form: extra is not in columns
formModel.value.extra = 'x'
```

### columns

Each field is a column config object; the usual three keys are `key` / `title` / `valueType`:

```ts
const columns = [
  { title: 'Name', key: 'name', valueType: 'text' },
  { title: 'City', key: 'city', valueType: 'select', options: [] },
]
```

- `key` is the field name in `formData` and the lookup key for `rules` and `rule`; nested paths are not supported
- `title` is the label. VNodes render fine, but column `tooltip` only works when `title` is a string
- See [ProFormColumn](#proformcolumn) for the full list

### Remote options with request

Give a column a `request` to load options for `select` / `cascader` and friends:

```ts
{
  title: 'City',
  key: 'city',
  valueType: 'select',
  request: async () => {
    const res = await fetchCities()
    return res.map(item => ({ label: item.name, value: item.code }))
  },
}
```

- `request()` is called **without arguments** on mount and its result becomes the options
- Each `key` is requested once; a refetch happens only when the `request` function **reference changes**
- When both `options` and remote results exist, **`options` wins** (even an empty array blocks the remote result)
- There is no built-in error state; `catch` inside `request` yourself
- A column-level `defaultValue` is treated as a cascader "default path": `initTreeData` calls `request(item)` level by level to build `children`. Only configure it for cascaders
- Put the rest of the control config in `formItemProps`, e.g. `remote` / `onLoad` for a remote cascader

### Custom controls with formRender

With `valueType: 'custom'`, `formRender` renders the control:

```ts
{
  title: 'Rating',
  key: 'rating',
  valueType: 'custom',
  formRender: (key, formData, formItemProps) => h(NRate, {
    'value': formData.value[key],
    'onUpdate:value': (v) => (formData.value[key] = v),
  }),
}
```

- The first argument is the field `key`
- The second is the **internal `formData` Ref**; read and write through `.value`
- The third is the column's `formItemProps`, not NFormItem props

### Grid layout

The form renders inside NGrid. `gridCols` is the column count; column-level `grid` maps to the NGridItem `span`:

```ts
const columns = [
  { title: 'Name', key: 'name', valueType: 'text' },
  { title: 'Age', key: 'age', valueType: 'digit' },
  { title: 'Remark', key: 'remark', valueType: 'textarea', grid: 2 },
]
```

```vue
<ProForm :columns="columns" :grid-cols="2" />
```

- `gridCols` defaults to `1`
- `grid` accepts a number and also Naive UI's responsive `span` syntax
- Gaps are fixed at 16px
- NGrid is fixed to `item-responsive` + `responsive="screen"`; the `responsive` prop is declared but **not wired up**

### Validation

Rules can live in two places and be combined:

```ts
// Form level: matched by key
const rules = {
  name: [{ required: true, message: 'Please enter a name', trigger: 'blur' }],
}

// Column level: directly on the column
const columns = [
  {
    title: 'City',
    key: 'city',
    valueType: 'select',
    rule: [{ required: true, message: 'Please select a city', trigger: 'change' }],
  },
]
```

- `rules` passes straight through to NForm
- Column `rule` attaches to the matching NFormItem
- Validation runs as a whole only when the submit / search button is clicked
- **A failed validation only logs to the console and emits no event**; wrap the submit logic yourself if you need custom handling
- `showFeedback` (an NForm prop) controls whether error text is shown, but does not affect blocking

### Action area and mode

| mode | Action area | Notes |
| --- | --- | --- |
| `normal` | Centered "Reset + Submit" | Default; `submitText` / `resetText` apply |
| `search` | Bottom-right "Reset + Search + Expand/Collapse" | `searchText` / `loading` / `showResetButton` / `showAdvancedButton` apply |
| `login` | A single full-width button | Label is fixed to 「登录」 and cannot be changed |
| `modal` / `drawer` | No built-in buttons | For containers such as `ModalForm` / `DrawerForm` to render the footer |

Two collapse props in search mode:

- `gridCollapsed`: whether it starts collapsed, default `false`
- `gridCollapsedRows`: rows kept when collapsed, default `1`
- `showAdvancedButton: false` hides the expand/collapse button and forces expansion
- Whether the button appears is computed **once on mount** by comparing the field count (including the suffix item) with `gridCols`; later changes to `columns` / `gridCols` do not recompute it

### Submit and reset

Submit validates first and then emits `submit(values)`:

```ts
function handleSubmit(values) {
  // values is the internal formData object itself
}
```

Reset behaves differently per mode:

| mode | Reset target | `reset` payload |
| --- | --- | --- |
| `normal` / `login` | `defaultValue` if present; otherwise rebuild an empty structure from the current `columns` | none |
| `search` | Empty structure merged with `defaultValue` | current form values |

- `defaultValue` is shallow-copied when the component is created; nested objects still share references
- Reset also emits `update:model`, so the external `model` becomes the reset values
- Reset does **not** re-run remote `request`; already loaded options are reused

### Instance methods

Get the instance through a template ref:

```vue
<script setup>
import { ref } from 'vue'

const formRef = ref()

formRef.value?.submit()
formRef.value?.reset()
formRef.value?.setFieldValue('city', 'shanghai')
</script>
```

- `submit()`: validate and emit `submit`
- `reset()`: same as clicking the reset button
- `validate()`: validate without submitting; resolves `false` on failure instead of throwing
- `getValues()`: return a shallow copy of the current form values without validating or submitting
- `setFieldValue(key, value)`: write a field directly, without validation
- `setFieldValue` can write keys that are not in `columns`; the value is emitted through `update:model`, but reset rebuilds from `columns` / `defaultValue`, so undeclared keys can be dropped

## Examples

### Basic form

<Demo title="Basic form"
desc="normal mode: two-column grid, column-level validation, and a remark spanning both columns; the submitted values are shown below."
:raw="BasicFormRaw">

<BasicForm />

</Demo>

### All controls

<Demo title="16 built-in valueTypes"
desc="Text, textarea, number, select, radio, checkbox, cascader, switch, time, date and date ranges, month and month range, upload. Select and date fields get an explicit null in the model."
:raw="ValueTypesRaw">

<ValueTypes />

</Demo>

### Grid and tooltip

<Demo title="gridCols and column grid"
desc="Switch between 1 / 2 / 3 columns; the remark spans all 3 columns, and the name label carries a tooltip."
:raw="GridLayoutRaw">

<GridLayout />

</Demo>

### Linked fields

<Demo title="Select linkage + setFieldValue"
desc="Changing the company clears the product and regenerates its options; rules demonstrate cross-field validation."
:raw="UniLinkChangeRaw">

<UniLinkChange />

</Demo>

### Remote options

<Demo title="Loading options with request"
desc="City options load asynchronously; replacing the request reference refetches the same key, while static options stay independent."
:raw="RemoteSelectRaw">

<RemoteSelect />

</Demo>

### Remote cascader

<Demo title="Cascader loading level by level"
desc="The first cascader loads child nodes on demand through formItemProps.remote + onLoad; the second loads the whole tree with request."
:raw="RequestCascaderFormRaw">

<RequestCascaderForm />

</Demo>

### Search mode

<Demo title="Search action area"
desc="In search mode the buttons sit bottom-right with reset, search and expand/collapse; gridCollapsedRows controls how many rows remain when collapsed."
:raw="FilterResetRaw">

<FilterReset />

</Demo>

### Search defaults and reset

<Demo title="defaultValue and search reset"
desc="defaultValue provides the initial conditions; reset in search mode returns to an empty structure merged with defaultValue and emits the values."
:raw="FilterResetWithDefaultRaw">

<FilterResetWithDefault />

</Demo>

### Login mode

<Demo title="Login mode"
desc="login mode renders one full-width button whose label is fixed to 「登录」; validation works the same as a normal form."
:raw="BaseRaw">

<Base />

</Demo>

### Custom control

<Demo title="valueType: custom + formRender"
desc="NRate fully takes over the rating field; the second argument of formRender is a Ref to the internal formData."
:raw="CustomFieldRaw">

<CustomField />

</Demo>

### Two-way binding

<Demo title="v-model:model"
desc="The external model is shown live below; buttons change fields from the outside and the controls follow, while typing writes back into the model."
:raw="VModelRaw">

<VModel />

</Demo>

### Instance methods

<Demo title="submit / reset / setFieldValue"
desc="Call instance methods through a ref; defaultValue is the reset target and setFieldValue can write existing or new fields."
:raw="InstanceApiRaw">

<InstanceApi />

</Demo>

## Advanced

### Inside ModalForm / DrawerForm

The package also exports `ModalForm` and `DrawerForm`. They render ProForm with `mode="modal"` / `mode="drawer"` and own the open/close state and footer buttons:

```vue
<ModalForm
  title="Create user"
  :columns="columns"
  :model="formModel"
  @submit="handleSubmit"
/>
```

ProForm renders no buttons in these modes; when using `mode="modal"` / `mode="drawer"` on its own, provide a footer yourself. See [ModalForm](/en/procomponent/ModalForm) and [DrawerForm](/en/procomponent/DrawerForm) for their standalone docs.

### Relationship with the ProTable search bar

ProTable renders its search bar with ProForm. When `search` is an object, its fields override ProForm props, so `gridCols`, `gridCollapsed`, `gridCollapsedRows`, `labelWidth` and friends can be written there directly. ProTable additionally sets `showFeedback: false` and treats the reset target as "the snapshot at creation + `search.defaultValue`", so the two reset semantics differ slightly.

## API

### Props

Besides the table below, every [NForm](https://www.naiveui.com/en-US/os-theme/components/form) prop passes through (`labelWidth`, `labelPlacement`, `labelAlign`, `size`, `disabled`, `inline`, `showFeedback`, `showLabel`, `showRequireMark`, `validateMessages`, etc.).

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| columns | Field configs, see [ProFormColumn](#proformcolumn) | `ProFormColumn[]` | `[]` |
| model | Two-way bound form data (`v-model:model`) | `Record<string, any>` | `{}` |
| rules | Form-level rules, matched by field `key` | `Record<string, FormItemRule[]>` | - |
| gridCols | Grid column count | `number` | `1` |
| gridCollapsed | Whether search mode starts collapsed | `boolean` | `false` |
| gridCollapsedRows | Rows kept when collapsed | `number` | `1` |
| mode | Action area shape | `'normal' \| 'search' \| 'login' \| 'modal' \| 'drawer'` | `'normal'` |
| defaultValue | Initial value snapshot and reset target | `Record<string, any>` | `{}` |
| loading | Search button loading; search mode only | `boolean` | `false` |
| searchText | Search button label | `string` | `'搜索'` |
| submitText | Submit button label | `string` | `'提交'` |
| resetText | Reset button label | `string` | `'重置'` |
| showResetButton | Render the reset button; search mode only | `boolean` | `true` |
| showAdvancedButton | Render the expand/collapse button; `false` forces expansion; search mode only | `boolean` | `true` |
| responsive | Declared but not wired up; NGrid is fixed to `item-responsive` + `responsive="screen"` | `'self' \| 'screen'` | `'self'` |

### Events

| Event | Description | Payload |
| --- | --- | --- |
| submit | Fired after validation passes | `(values: Record<string, any>) => void` |
| reset | Fired after clicking reset (or calling the instance `reset()`) | `(values?: Record<string, any>) => void`; payload only in search mode |
| update:model | Fired when the internal form value changes; powers `v-model:model` | `(values: Record<string, any>) => void` |

A failed validation emits nothing; errors are only logged to the console.

### Expose

| Name | Description |
| --- | --- |
| `submit()` | Validate and submit, same as clicking submit / search |
| `reset()` | Reset the form, same as clicking reset |
| `setFieldValue(key, value)` | Write a field directly, without validation |

### ProFormColumn

| Field | Description | Type | Required |
| --- | --- | --- | --- |
| key | Field name, the key of `formData`; nested paths are not supported | `string` | Yes |
| title | Label; string or VNode | `string \| VNode` | No |
| valueType | Control type, see [Data shape](#data-shape); missing or unknown types render no control | `string` | Yes |
| options | Static options for `select` / `radio` / `checkbox` / `cascader`; wins over remote results | `SelectOption[]` | No |
| formItemProps | Props forwarded to the control; `placeholder` and `clearable` have defaults you can override | `Record<string, any>` | No |
| rule | Validation rules for this field | `FormItemRule \| FormItemRule[]` | No |
| grid | Grid `span`, used together with `gridCols` | `number \| string` | No |
| tooltip | Tooltip after the label; requires a string `title` | `string` | No |
| formTitle | Only used to build the default placeholder (generated in Chinese); does not change the label | `string` | No |
| request | Async options, called once without arguments on mount, cached per `key` | `(item?: string \| number) => Promise<SelectOption[]>` | No |
| defaultValue | Default path for a cascader, passed to `initTreeData` for level-by-level requests | `(string \| number)[]` | No |
| formRender | Control renderer for `valueType: 'custom'` | `(key: string, formData: Ref<Record<string, any>>, formItemProps?: Record<string, any>) => VNodeChild` | No |

> Common ProComponents fields such as `hideInForm`, `password`, `slider`, `rate` and `timerange` are **not implemented**. Use `formItemProps: { type: 'password' }` for passwords, and `valueType: 'custom'` for rating / slider.

### Type exports

The package entry currently exports only `ProForm` and `ProFormPlugin`; Props / Emits / column types are **not exported**. Declare your own column interface; for the instance type use `InstanceType<typeof ProForm>`.

## FAQ

**Clicking submit does nothing?**
Check the console first: a failed validation only calls `console.error`. Make sure required fields pass, and check that each rule's `trigger` matches the interaction.

**I changed `model` but the form did not update?**
After mounting, only keys already present in the internal `formData` are synced (a `model` passed at mount is merged as a whole). Add the field to `columns`, or use the instance `setFieldValue`.

**Both `model` and `defaultValue` are passed — which wins?**
`defaultValue` wins on mount and overwrites `model`; after mounting, `model` changes still sync into existing fields.

**The `reset` event has no payload?**
Reset in `normal` / `login` mode carries no arguments; only `search` mode emits the reset values.

**Search-mode reset does not return to `defaultValue`?**
Make sure `defaultValue` is a non-empty object. Search-mode reset returns to "empty structure + `defaultValue`", not the current `model`.

**No reset / collapse button in the search bar?**
Reset checks `show-reset-button`; collapse checks `show-advanced-button`. Both only apply in `search` mode.

**The collapse button appears even though the content is one row?**
Visibility is computed once on mount and counts the suffix button item as well, so it can appear earlier than expected.

**`request` does not refetch?**
Results are cached per `key`; only a new `request` function reference triggers a refetch. Replace the function instead of mutating state inside it.

**Both `options` and `request` are configured?**
`options` wins; even an empty array blocks the remote result.

**Uploaded files are missing from the submitted values?**
`upload` only renders NUpload and forwards `formItemProps`; the file list never writes back to `formData`. Manage files on the business side.

**Date controls display incorrectly?**
Use `null` as the initial value for `date` / `datetime` and the range pickers; `month` / `monthrange` currently start as `''`, so pass `null` explicitly in `model`.

**`grid` has no effect?**
`grid` is a grid `span` and must be used with `gridCols`; with `gridCols=1` any span is clamped to one column.

**Changing `responsive` does nothing?**
The prop is not wired up; the grid always responds to screen breakpoints.

**My custom control does not get the value?**
The second argument of `formRender` is the `formData` Ref; read and write with `formData.value[key]`. The third is the column's `formItemProps`, not NFormItem props.

**Why is `ProFormProps` not exported?**
The package entry does not export the related types; declare your own column interface or use `InstanceType<typeof ProForm>`.

## Behavior conventions

- The component does not own `columns`; they come from outside. Remote results and the option cache are internal.
- `formData` is built from `columns` only on mount and reset; adding or removing columns at runtime does not add or remove field values.
- `request` is cached per field `key`, and `options` always wins; remote failures have no built-in error state.
- Validation runs as a whole only on submit / search; failures emit nothing and only log an error.
- The `upload` file list is not part of the form data.
- `reset` in `normal` / `login` carries no payload while `search` carries values; both emit `update:model`.
- The `login` button label is fixed to 「登录」.
- `modal` / `drawer` mode renders no buttons; the container owns the footer.
- There are no slots; all field-level extension goes through `valueType: 'custom'` + `formRender`.
