---
name: ModalForm
desc: ModalForm puts ProForm inside NModal. Configure fields with columns, and get a built-in trigger, controlled visibility, custom footer, close-on-submit and instance methods; pair closeOnSubmit with confirmLoading for async submits.
---

<route lang="yaml">
meta:
  layout: default
</route>

# ModalForm

ModalForm wraps [ProForm](/en/procomponent/ProForm) in `NModal` with the card preset, so create / edit forms live inside a modal. Fields are still configured through `columns`; the modal owns opening, the trigger, footer buttons and closing after submit.

This page describes the behavior of the current source in this repository.

## Features

- **Configured fields**: `columns` goes straight to ProForm, `valueType` chooses the control
- **Built-in trigger**: `trigger` slot > default slot > built-in "打开" button; `showTrigger=false` for fully controlled usage
- **Two visibility modes**: uncontrolled (`defaultShow` + instance methods) and controlled (`v-model:show`)
- **Close on submit**: `submit` fires after validation passes; `closeOnSubmit` decides whether to close
- **Customizable footer**: built-in reset / cancel / confirm, `hideFooter`, or fully replace it with the `footer` slot
- **Async submits**: `closeOnSubmit=false` + `confirmLoading`, then close from your request handler
- **Two-way data**: `v-model:model`; `defaultValue` is both the initial value and the reset target
- **NForm pass-through**: `label-placement`, `rules`, `grid-cols`, etc. written on ModalForm reach ProForm
- **Instance methods**: `open`, `close`, `submit`, `reset`, `setFieldValue`, `form`
- **Exported types**: `ModalFormProps`, `ModalFormEmits`, `ModalFormExpose`, `ModalFormFooterScope`, `ModalFormColumn`

## When to use

- Create / edit dialogs in admin consoles where fields fit a configuration
- Visibility needs to be driven by external buttons or business flow
- The footer needs custom actions (save and continue, save draft, etc.)
- Submits go through an async API and the dialog should stay open until it finishes

## Quick start

### Install

```script-tabs
@banmao/procomponent
```

### Import on demand

```vue
<script setup>
import { ModalForm } from '@banmao/procomponent'
</script>
```

### Global registration

```ts
import { createApp } from 'vue'
import { ModalFormPlugin } from '@banmao/procomponent'
import App from './App.vue'

createApp(App).use(ModalFormPlugin).mount('#app')
```

### Basic usage

```vue
<script setup>
import { ModalForm } from '@banmao/procomponent'

const columns = [
  { title: 'Name', key: 'name', valueType: 'text' },
  { title: 'Age', key: 'age', valueType: 'digit' },
]

function handleSubmit(values) {
  console.log(values)
}
</script>

<template>
  <ModalForm title="New user" :columns="columns" @submit="handleSubmit" />
</template>
```

Without any slot, the component renders a built-in "打开" button as the trigger.

## Core concepts

### Visibility

ModalForm supports two modes:

| Mode | Usage | Behavior |
| --- | --- | --- |
| Uncontrolled | omit `show` | Internal state; trigger clicks and instance `open()` / `close()` work |
| Controlled | `v-model:show` | The component only emits `update:show`; the parent owns visibility |

- `defaultShow` only sets the initial value in uncontrolled mode, default `false`
- In controlled mode the parent must respond to `update:show` (for example with `v-model:show`), otherwise the modal will not actually close
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
  <ModalForm v-model:show="show" :show-trigger="false" :columns="columns" />
</template>
```

### Trigger and slots

Trigger priority:

1. `trigger` slot
2. default slot (legacy)
3. built-in "打开" button

The trigger is wrapped in a clickable container, and a click opens the modal. The default slot is only a legacy fallback for the trigger; prefer the `trigger` slot in new code.

### Relationship with ProForm

- `columns` first drops `type: 'index' | 'selection'` and `key: 'actions'` columns, then hands the rest to ProForm
- Any prop not listed on this page is **forwarded to ProForm**: `label-placement`, `label-width`, `rules`, `grid-cols`, `size`, `show-feedback` and other NForm / ProForm props can be written directly on ModalForm
- `model` supports `v-model:model`; internal changes are written back through `update:model`
- `defaultValue` follows ProForm semantics: it wins over `model` on mount and is also the reset target
- Use the `form` slot to replace the form entirely; the built-in confirm / reset can no longer find a ProForm instance, so handle them in a `footer` slot

### Submit, close and async

Clicking confirm calls ProForm's `submit()`:

1. ProForm validates all fields
2. On success ModalForm emits `submit(values)`
3. With `closeOnSubmit` `true` (default), the modal closes right after the event

Validation failures only log to the console; no `submit` event fires and the modal stays open.

Vue event listeners are synchronous, and the component **does not await a Promise returned by your `@submit` handler**. For async submits, turn off auto-close:

```vue
<ModalForm
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
- Cancel, the close button and the mask only close the modal; they never emit `submit`
- Reset calls ProForm's `reset()`, returning to `defaultValue`, and **does not close** the modal

### Footer and header

The built-in footer is reset / cancel / confirm. Use these props to adjust or hide it:

- `submitText` / `resetText` / `cancelText`
- `hideFooter`
- `footer` slot (scope: `close`, `reset`, `submit`, `confirmLoading`)

The `header` slot replaces the `title` text, while `header-extra` appends content to the right side of the header. Both render inside the title area of NModal's card preset.

### Instance methods

```vue
<script setup>
import { ref } from 'vue'

const modalRef = ref()

function handleOpen() {
  modalRef.value?.open()
}
</script>

<template>
  <ModalForm ref="modalRef" :columns="columns" />
</template>
```

| Method | Description |
| --- | --- |
| `open()` | Open the modal |
| `close()` | Close the modal |
| `submit()` | Validate and submit through ProForm |
| `reset()` | Reset the form without closing |
| `setFieldValue(key, value)` | Write a field value directly, without validation |
| `form` | The inner ProForm instance; `undefined` when using the `form` slot |

## Examples

### Basic modal

<Demo title="Built-in trigger and submit"
desc="Without a trigger slot, a built-in button opens the modal; submitting closes it and prints the values below."
:raw="BasicRaw">

<Basic />

</Demo>

### Custom trigger

<Demo title="trigger slot"
desc="Replaces the built-in button; clicking the slot content still opens the modal."
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

<Demo title="header / footer slots"
desc="The header slot replaces the title area; the footer slot receives close / reset / submit and builds its own actions."
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
| title | Modal title | `string` | `'标题'` |
| width | Modal width; numbers are px, strings are CSS widths | `number \| string` | `500` |
| columns | Field configuration, same shape as ProForm columns | `ModalFormColumn[]` | `[]` |
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
| closeOnEsc | Close on Esc | `boolean` | `true` |
| blockScroll | Lock page scrolling while open | `boolean` | `false` |
| autoFocus | Focus automatically when opened | `boolean` | `true` |
| trapFocus | Trap focus inside the modal | `boolean` | `true` |
| displayDirective | Destroy content on close (`if`) or keep it (`show`) | `'if' \| 'show'` | `'if'` |
| zIndex | Modal z-index | `number` | - |
| draggable | Allow dragging the modal | `boolean \| object` | `false` |

> Unlisted props are forwarded to ProForm (and its inner NForm), such as `label-placement`, `rules` and `grid-cols`. The modal preset is fixed to card; `preset`, `size` and other NModal props are not exposed.

### Events

| Event | Description | Payload |
| --- | --- | --- |
| submit | Fires after validation passes | `(values: Record<string, any>) => void` |
| reset | Fires after reset via button or instance method | - |
| update:show | Visibility changed, for `v-model:show` | `(show: boolean) => void` |
| update:model | Internal form values changed, for `v-model:model` | `(model: Record<string, any>) => void` |
| open | Modal opened | - |
| close | Modal closed | - |

### Slots

| Slot | Description | Scope |
| --- | --- | --- |
| trigger | Trigger content; takes precedence over the default slot | - |
| default | Legacy trigger fallback | - |
| form | Replace the built-in ProForm | - |
| footer | Replace the built-in footer | `{ close, reset, submit, confirmLoading }` |
| header | Replaces the title area (takes precedence over `title`) | - |
| header-extra | Additional content on the header's right | - |

### Expose

| Name | Description |
| --- | --- |
| `open()` | Open the modal |
| `close()` | Close the modal |
| `submit()` | Validate and submit, same as clicking confirm |
| `reset()` | Reset the form without closing |
| `setFieldValue(key, value)` | Write a field value directly |
| `form` | The inner ProForm instance |

### Exported types

```ts
import type {
  ModalFormColumn,
  ModalFormEmits,
  ModalFormExpose,
  ModalFormFooterScope,
  ModalFormProps,
} from '@banmao/procomponent'
```

## FAQ

**The modal closes before my async submit finishes.**
`submit` is a synchronous event and does not await a Promise. Set `:close-on-submit="false"` and close yourself when the request resolves (change `v-model:show` or call `close()`).

**Changing `show` in controlled mode does nothing.**
`v-model:show` needs the parent to write the value back. Using `:show` without listening to `update:show` keeps the modal in its current state.

**Reopening loses what I typed.**
`displayDirective` defaults to `'if'`, so closing destroys the content and reopening reinitializes ProForm from `model` / `defaultValue`. Set it to `'show'` to keep unsubmitted input, at the cost of not reinitializing.

**`defaultValue` and `model` are both passed; which wins?**
`defaultValue` wins on mount, same as ProForm. After mount, changes to existing keys in `model` still sync into the form.

**Clicking confirm does not emit `submit`.**
Check validation first. ProForm only logs errors on failure; it emits nothing and the modal stays open.

**Action columns in `columns` do not render.**
Columns with `type: 'index' | 'selection'` and `key: 'actions'` are filtered out; the modal form only renders field columns.

**`hideInForm` has no effect.**
ProForm does not implement `hideInForm`, and ModalForm does not add it. Remove the column from `columns` instead.

**Why do `class` / `style` affect the form?**
Unlisted props are forwarded to ProForm, so `class` / `style` land on the NForm root, not the modal container.

**Confirm / reset stop working with the `form` slot.**
The built-in buttons rely on the inner ProForm instance. After replacing the form, handle submission in the `footer` slot.

**Does `confirmLoading` block closing?**
No. It only loads and disables the confirm button; cancel, mask and Esc still work.

## Behavior conventions

- The trigger only opens; closing happens through cancel, the close button, the mask, Esc, `close()`, or a controlled `show`
- Submit only happens after validation passes; `closeOnSubmit` defaults to `true` and closes synchronously right after the `submit` event
- `submit` does not await async return values; disable auto-close for async flows
- Reset does not close the modal and does not re-request remote options (ProForm behavior)
- With `displayDirective='if'` each open remounts ProForm; with `'show'` the content stays mounted
- Unlisted props go to ProForm; control the modal itself through `width` and the explicit modal props above