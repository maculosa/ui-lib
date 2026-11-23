---
name: DrawerForm
desc: DrawerForm puts ProForm inside NDrawer. Configure fields with columns, and get a built-in trigger, controlled visibility, custom footer, close-on-submit and instance methods; placement, width and edge-resizing are configurable.
---

<route lang="yaml">
meta:
  layout: default
</route>

# DrawerForm

DrawerForm wraps [ProForm](/en/procomponent/ProForm) in `NDrawer` + `NDrawerContent`, so create / edit forms live in a sliding panel. Fields are still configured through `columns`; the drawer owns opening, the trigger, footer buttons and closing after submit. When a form has many fields and the page context should stay visible, a drawer beats a modal.

This page describes the behavior of the current source in this repository.

## Features

- **Configured fields**: `columns` goes straight to ProForm, `valueType` chooses the control
- **Built-in trigger**: `trigger` slot > default slot > built-in "打开" button; `showTrigger=false` for fully controlled usage
- **Two visibility modes**: uncontrolled (`defaultShow` + instance methods) and controlled (`v-model:show`)
- **Placement**: `placement` supports `left` / `right` / `top` / `bottom`; horizontal drawers use `width`, vertical ones use `height`
- **Edge resizing**: `resizable` enables dragging the drawer edge
- **Close on submit**: `submit` fires after validation passes; `closeOnSubmit` decides whether to close
- **Customizable footer**: built-in reset / cancel / confirm, `hideFooter`, or fully replace it with the `footer` slot
- **Async submits**: `closeOnSubmit=false` + `confirmLoading`, then close from your request handler
- **Two-way data**: `v-model:model`; `defaultValue` is both the initial value and the reset target
- **NForm pass-through**: `label-placement`, `rules`, `grid-cols`, etc. written on DrawerForm reach ProForm
- **Instance methods**: `open`, `close`, `submit`, `reset`, `setFieldValue`, `form`
- **Exported types**: `DrawerFormProps`, `DrawerFormEmits`, `DrawerFormExpose`, `DrawerFormFooterScope`, `DrawerFormColumn`

## When to use

- Create / edit drawers in admin consoles with larger, taller forms
- The list page should stay visible while editing
- Visibility needs to be driven by external buttons or business flow
- The footer needs custom actions (save and continue, save draft, etc.)
- Submits go through an async API and the drawer should stay open until it finishes

## Quick start

### Install

```script-tabs
@banmao/procomponent
```

### Import on demand

```vue
<script setup>
import { DrawerForm } from '@banmao/procomponent'
</script>
```

### Global registration

```ts
import { createApp } from 'vue'
import { DrawerFormPlugin } from '@banmao/procomponent'
import App from './App.vue'

createApp(App).use(DrawerFormPlugin).mount('#app')
```

### Basic usage

```vue
<script setup>
import { DrawerForm } from '@banmao/procomponent'

const columns = [
  { title: 'Name', key: 'name', valueType: 'text' },
  { title: 'Age', key: 'age', valueType: 'digit' },
]

function handleSubmit(values) {
  console.log(values)
}
</script>

<template>
  <DrawerForm title="New user" :columns="columns" @submit="handleSubmit" />
</template>
```

Without any slot, the component renders a built-in "打开" button as the trigger.

## Core concepts

### Visibility

DrawerForm supports two modes:

| Mode | Usage | Behavior |
| --- | --- | --- |
| Uncontrolled | omit `show` | Internal state; trigger clicks and instance `open()` / `close()` work |
| Controlled | `v-model:show` | The component only emits `update:show`; the parent owns visibility |

- `defaultShow` only sets the initial value in uncontrolled mode, default `false`
- In controlled mode the parent must respond to `update:show` (for example with `v-model:show`), otherwise the drawer will not actually close
- Changes initiated by the component emit `update:show`; any visibility change, whoever triggers it, emits `open` / `close`
- `displayDirective` defaults to `'if'`: closing destroys the content, so reopening remounts ProForm and initializes it from `model` / `defaultValue`
- Set `displayDirective="show"` to keep the content mounted (useful for preserving unsubmitted input); reopening then will **not** reinitialize the form

Fully controlled usage usually hides the built-in trigger:

```vue
<script setup>
import { ref } from 'vue'

const show = ref(false)
</script>

<template>
  <NButton @click="show = true">Open</NButton>
  <DrawerForm v-model:show="show" :show-trigger="false" :columns="columns" />
</template>
```

### Placement, width and resizing

- `placement` defaults to `'right'`, one of `'left' | 'top' | 'bottom'`
- `width` defaults to `500` and only applies to `left` / `right`; numbers are px, strings are CSS widths
- `height` has no default and only applies to `top` / `bottom`
- `resizable` defaults to `false`; enable it to drag the drawer edge
- The page scroll is locked by default (`blockScroll` is `true`, matching NDrawer)

```vue
<DrawerForm title="Edit" placement="left" :width="560" resizable :columns="columns" />
```

### Trigger and slots

Trigger priority:

1. `trigger` slot
2. default slot (legacy)
3. built-in "打开" button

The trigger is wrapped in a clickable container, and a click opens the drawer. The default slot is only a legacy fallback for the trigger; prefer the `trigger` slot in new code.

### Relationship with ProForm

- `columns` first drops `type: 'index' | 'selection'` and `key: 'actions'` columns, then hands the rest to ProForm
- Any prop not listed on this page is **forwarded to ProForm**: `label-placement`, `label-width`, `rules`, `grid-cols`, `size`, `show-feedback` and other NForm / ProForm props can be written directly on DrawerForm
- `model` supports `v-model:model`; internal changes are written back through `update:model`
- `defaultValue` follows ProForm semantics: it wins over `model` on mount and is also the reset target
- Use the `form` slot to replace the form entirely; the built-in confirm / reset can no longer find a ProForm instance, so handle them in a `footer` slot

### Submit, close and async

Clicking confirm calls ProForm's `submit()`:

1. ProForm validates all fields
2. On success DrawerForm emits `submit(values)`
3. With `closeOnSubmit` `true` (default), the drawer closes right after the event

Validation failures only log to the console; no `submit` event fires and the drawer stays open.

Vue event listeners are synchronous, and the component **does not await a Promise returned by your `@submit` handler**. For async submits, turn off auto-close:

```vue
<DrawerForm
  v-model:show="show"
  :close-on-submit="false"
  :confirm-loading="loading"
  @submit="handleSubmit"
/>

<script setup>
async function handleSubmit(values) {
  loading.value = true
  try {
    await save(values)
    show.value = false
  }
  finally {
    loading.value = false
  }
}
</script>
```

- `confirmLoading` only drives the confirm button's loading and disabled state; cancel and close still work
- Cancel, the close button and the mask only close the drawer; they never emit `submit`
- Reset calls ProForm's `reset()`, returning to `defaultValue`, and **does not close** the drawer

### Footer and header

The built-in footer is reset / cancel / confirm. Use these props to adjust or hide it:

- `submitText` / `resetText` / `cancelText`
- `hideFooter`
- `footer` slot (scope: `close`, `reset`, `submit`, `confirmLoading`)

The `header` slot replaces the `title` text. NDrawerContent has no `header-extra` slot, so DrawerForm appends `header-extra` content to the right side of the header; when only `header-extra` is provided, the title still comes from `title`.

### Instance methods

```vue
<script setup>
import { ref } from 'vue'

const drawerRef = ref()

function handleOpen() {
  drawerRef.value?.open()
}
</script>

<template>
  <DrawerForm ref="drawerRef" :columns="columns" />
</template>
```

| Method | Description |
| --- | --- |
| `open()` | Open the drawer |
| `close()` | Close the drawer |
| `submit()` | Validate and submit through ProForm |
| `reset()` | Reset the form without closing |
| `setFieldValue(key, value)` | Write a field value directly, without validation |
| `form` | The inner ProForm instance; `undefined` when using the `form` slot |

## Examples

### Basic drawer

<Demo title="Built-in trigger, edge resizing and submit"
desc="Without a trigger slot, a built-in button opens the drawer; with resizable enabled you can drag the edge to resize. Submitting closes it and prints the values below."
:raw="BasicRaw">

<Basic />

</Demo>

### Custom trigger and placement

<Demo title="trigger slot + placement=left"
desc="Replaces the built-in button and puts the drawer on the left; clicking the slot content still opens the drawer."
:raw="TriggerRaw">

<Trigger />

</Demo>

### Controlled visibility and async submit

<Demo title="v-model:show + closeOnSubmit=false"
desc="Hides the built-in trigger and opens from an external button; the submit handler simulates an 800ms request before closing, while open / close events are logged."
:raw="ControlledRaw">

<Controlled />

</Demo>

### Custom header and footer

<Demo title="header / header-extra / footer slots"
desc="The header slot replaces the title area and header-extra sits on its right; the footer slot receives close / reset / submit and builds its own actions."
:raw="FooterRaw">

<Footer />

</Demo>

### Two-way model

<Demo title="v-model:model"
desc="External buttons change the model directly; reopening reinitializes the form from the latest model, and submitted values are written back."
:raw="ModelSyncRaw">

<ModelSync />

</Demo>

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| show | Controlled visibility (`v-model:show`); omit to use internal state | `boolean` | `undefined` |
| defaultShow | Initial visibility in uncontrolled mode | `boolean` | `false` |
| title | Drawer title | `string` | `''` |
| placement | Drawer placement | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` |
| width | Drawer width for `left` / `right`; numbers are px, strings are CSS widths | `number \| string` | `500` |
| height | Drawer height for `top` / `bottom`; numbers are px, strings are CSS heights | `number \| string` | - |
| resizable | Allow dragging the edge to resize | `boolean` | `false` |
| columns | Field configuration, same shape as ProForm columns | `DrawerFormColumn[]` | `[]` |
| model | Form data (`v-model:model`) | `Record<string, any>` | `{}` |
| defaultValue | Initial value and reset target | `Record<string, any>` | `{}` |
| showTrigger | Render the built-in trigger area | `boolean` | `true` |
| hideFooter | Hide the built-in footer | `boolean` | `false` |
| closeOnSubmit | Close automatically after submit | `boolean` | `true` |
| submitText | Confirm button text | `string` | `'确定'` |
| resetText | Reset button text | `string` | `'重置'` |
| cancelText | Cancel button text | `string` | `'取消'` |
| confirmLoading | Confirm button loading / disabled, for async submits | `boolean` | `false` |
| closable | Show the close button | `boolean` | `true` |
| maskClosable | Close when the mask is clicked | `boolean` | `true` |
| showMask | Show the mask; `'transparent'` keeps it clickable but invisible | `boolean \| 'transparent'` | `true` |
| closeOnEsc | Close on Esc | `boolean` | `true` |
| blockScroll | Lock page scrolling while open | `boolean` | `true` |
| autoFocus | Focus automatically when opened | `boolean` | `true` |
| trapFocus | Trap focus inside the drawer | `boolean` | `true` |
| displayDirective | Destroy content on close (`if`) or keep it (`show`) | `'if' \| 'show'` | `'if'` |
| zIndex | Drawer z-index | `number` | - |

> Unlisted props are forwarded to ProForm (and its inner NForm), such as `label-placement`, `rules` and `grid-cols`. Other NDrawer props (`to`, `nativeScrollbar`, `contentClass`, etc.) are not exposed one by one; use form props or the `form` slot when you need them.

### Events

| Event | Description | Payload |
| --- | --- | --- |
| submit | Fires after validation passes | `(values: Record<string, any>) => void` |
| reset | Fires after reset via button or instance method | - |
| update:show | Visibility changed, for `v-model:show` | `(show: boolean) => void` |
| update:model | Internal form values changed, for `v-model:model` | `(model: Record<string, any>) => void` |
| open | Drawer opened | - |
| close | Drawer closed | - |

### Slots

| Slot | Description | Scope |
| --- | --- | --- |
| trigger | Trigger content; takes precedence over the default slot | - |
| default | Legacy trigger fallback | - |
| form | Replace the built-in ProForm | - |
| footer | Replace the built-in footer | `{ close, reset, submit, confirmLoading }` |
| header | Replaces the title area (takes precedence over `title`) | - |
| header-extra | Additional content on the header's right (rendered with header) | - |

### Expose

| Name | Description |
| --- | --- |
| `open()` | Open the drawer |
| `close()` | Close the drawer |
| `submit()` | Validate and submit, same as clicking confirm |
| `reset()` | Reset the form without closing |
| `setFieldValue(key, value)` | Write a field value directly |
| `form` | The inner ProForm instance |

### Exported types

```ts
import type {
  DrawerFormColumn,
  DrawerFormEmits,
  DrawerFormExpose,
  DrawerFormFooterScope,
  DrawerFormProps,
} from '@banmao/procomponent'
```

## FAQ

**The drawer closes before my async submit finishes.**
`submit` is a synchronous event and does not await a Promise. Set `:close-on-submit="false"` and close yourself when the request resolves (change `v-model:show` or call `close()`).

**Changing `show` in controlled mode does nothing.**
`v-model:show` needs the parent to write the value back. Using `:show` without listening to `update:show` keeps the drawer in its current state.

**Reopening loses what I typed.**
`displayDirective` defaults to `'if'`, so closing destroys the content and reopening reinitializes ProForm from `model` / `defaultValue`. Set it to `'show'` to keep unsubmitted input, at the cost of not reinitializing.

**`defaultValue` and `model` are both passed; which wins?**
`defaultValue` wins on mount, same as ProForm. After mount, changes to existing keys in `model` still sync into the form.

**Clicking confirm does not emit `submit`.**
Check validation first. ProForm only logs errors on failure; it emits nothing and the drawer stays open.

**Changing `width` has no effect.**
`width` only applies when `placement` is `left` / `right`; use `height` for `top` / `bottom`.

**`resizable` does not drag.**
The size on the draggable axis must be set (horizontal `width`, vertical `height`), and you must drag from the drawer edge; touch behavior depends on the browser.

**Action columns in `columns` do not render.**
Columns with `type: 'index' | 'selection'` and `key: 'actions'` are filtered out; the drawer form only renders field columns.

**`hideInForm` has no effect.**
ProForm does not implement `hideInForm`, and DrawerForm does not add it. Remove the column from `columns` instead.

**Why do `class` / `style` affect the form?**
Unlisted props are forwarded to ProForm, so `class` / `style` land on the NForm root, not the drawer container.

**Confirm / reset stop working with the `form` slot.**
The built-in buttons rely on the inner ProForm instance. After replacing the form, handle submission in the `footer` slot.

**Does `confirmLoading` block closing?**
No. It only loads and disables the confirm button; cancel, mask and Esc still work.

## Behavior conventions

- The trigger only opens; closing happens through cancel, the close button, the mask, Esc, `close()`, or a controlled `show`
- Submit only happens after validation passes; `closeOnSubmit` defaults to `true` and closes synchronously right after the `submit` event
- `submit` does not await async return values; disable auto-close for async flows
- Reset does not close the drawer and does not re-request remote options (ProForm behavior)
- With `displayDirective='if'` each open remounts ProForm; with `'show'` the content stays mounted
- Unlisted props go to ProForm; control the drawer itself through `width` / `height` and the explicit drawer props above
