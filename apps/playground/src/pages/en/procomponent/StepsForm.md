---
name: StepsForm
desc: StepsForm combines NModal, NSteps and ProForm into a stepped dialog form. Configure each step with columns, validate the current step before advancing, and submit merged values from the last step; controlled visibility, custom footers and async submits are supported.
---

<route lang="yaml">
meta:
  layout: default
</route>

# StepsForm

StepsForm puts `NSteps` and `ProForm` inside `NModal` with the card preset, splitting a long form into steps that validate one at a time. Every step has its own `columns`; the next step is entered only after the current one passes validation, and the last step submits the merged values.

This page describes the behavior of the current source in this repository.

## Features

- **Step configuration**: a `steps` array where each entry has `title`, `description` and `columns`
- **Per-step validation**: advancing validates the current step; failures stay put and mark that step `error`
- **Free back navigation**: going back skips validation and keeps values through the merged `model`
- **Merged submit**: the last step emits `submit` with values from every step
- **Built-in trigger**: `trigger` slot > default slot > built-in "打开" button; `showTrigger=false` for fully controlled usage
- **Two visibility modes**: uncontrolled (`defaultShow` + instance methods) and controlled (`v-model:show`)
- **Customizable footer**: built-in prev / cancel / next (or submit), `hideFooter`, or fully replace it with the `footer` slot
- **Async submits**: `closeOnSubmit=false` + `confirmLoading`, then close from your request handler
- **Two-way data**: `v-model:model` merges fields from all steps; `defaultValue` is both the initial value and the reset target
- **Custom step content**: the `step` slot takes over the current step form with `values` and `setFieldValue`
- **Instance methods**: `open`, `close`, `next`, `prev`, `submit`, `reset`, `setStep`, `setFieldValue`, `current`, `forms`, `form`
- **Exported types**: `StepsFormProps`, `StepsFormEmits`, `StepsFormExpose`, `StepsFormFooterScope`, `StepsFormStepScope`, `StepsFormStep`, `StepsFormColumn`

## When to use

- Create / edit flows with many fields that fit 2-4 business steps
- You want "validate as you go" instead of one error burst at the end
- Visibility needs to be driven by external buttons or business flow
- The footer needs custom actions (save draft, skip, dynamic labels, etc.)
- Submits go through an async API and the dialog should stay open until it finishes

## Quick start

### Install

```script-tabs
@banmao/procomponent
```

### Import on demand

```vue
<script setup>
import { StepsForm } from '@banmao/procomponent'
</script>
```

### Global registration

```ts
import { createApp } from 'vue'
import { StepsFormPlugin } from '@banmao/procomponent'
import App from './App.vue'

createApp(App).use(StepsFormPlugin).mount('#app')
```

### Basic usage

```vue
<script setup>
import { StepsForm } from '@banmao/procomponent'

const steps = [
  {
    title: 'Basic info',
    columns: [
      {
        title: 'Name',
        key: 'name',
        valueType: 'text',
        rule: [{ required: true, message: 'Please enter a name', trigger: 'blur' }],
      },
    ],
  },
  {
    title: 'Contact',
    columns: [
      { title: 'Phone', key: 'phone', valueType: 'text' },
    ],
  },
]

function handleSubmit(values) {
  console.log(values)
}
</script>

<template>
  <StepsForm title="New user" :steps="steps" @submit="handleSubmit" />
</template>
```

Without slots, the component renders a built-in "打开" button as the trigger.

## Core concepts

### Step configuration

Each entry of `steps` describes one step:

| Field | Description | Type |
| --- | --- | --- |
| `title` | Step title | `string` |
| `description` | Step subtitle | `string` |
| `columns` | Field config for this step, same shape as ProForm columns | `StepsFormColumn[]` |

- Columns with `type: 'index' | 'selection'` or `key: 'actions'` are filtered out
- Every step owns a separate `ProForm` instance and remounts when the active step changes
- Attributes not declared here are **passed through to the current step's ProForm**: `label-placement`, `label-width`, `grid-cols`, `rules`, `size`, etc. can be written on StepsForm directly

### Visibility control

Same as ModalForm:

| Usage | Syntax | Notes |
| --- | --- | --- |
| Uncontrolled | omit `show` | Internal state; trigger clicks and instance `open()` / `close()` work |
| Controlled | `v-model:show` | The component only emits `update:show`; the parent owns visibility |

- `defaultShow` only seeds the uncontrolled mode, default `false`
- In controlled mode the parent must react to `update:show`, otherwise the dialog will not really close
- Whenever visibility changes, `open` / `close` are emitted

### Step flow

The built-in footer adapts to the current step:

| Step | Buttons |
| --- | --- |
| First | Cancel / Next |
| Middle | Prev / Cancel / Next |
| Last | Prev / Cancel / Submit |

- **Next**: validates the current step first. On success it advances and emits `step-change(current, previous)`; on failure it stays and shows the step as `error`
- **Prev**: goes back without validation; entered values come back through the merged `model`
- **Submit**: validates the current step only (previous steps were validated when advancing), then emits `submit`; with `closeOnSubmit` (default `true`) it closes afterwards
- Calling `next()` on the last step is equivalent to `submit()`
- The exposed `setStep(index)` jumps directly and **does not validate**; out-of-range indexes return `false`

NSteps status is managed by the component: finished steps are `finish`, the current one `process`, a failed one `error`, and upcoming ones `wait`.

### Validation

- Column-level `rule` and form-level NForm `rules` work as in ProForm
- On failure ProForm only logs errors and does not emit `submit`; StepsForm additionally marks the current step `error`
- StepsForm reads the result through ProForm's new `validate()` (`Promise<boolean>`), which is why it can validate without submitting
- With the `step` slot there is no built-in ProForm, so validation passes automatically; custom content must validate itself

### Data sync

- `v-model:model` holds the **merged values of all steps**: every `update:model` carries the full merged object
- `defaultValue` seeds the dialog on open (it wins over `model`), and is the target of `reset()`
- Closing and reopening keeps the active step and entered values (StepsForm state lives outside the modal content)
- `reset()` restores `defaultValue`, returns to step one and remounts the current step form, then emits `reset`

### Submit and async

Clicking "Submit" will:

1. Validate the current step
2. Emit `submit(values)` with the merged values
3. Close the dialog when `closeOnSubmit` is `true` (the default)

Vue event handlers are called synchronously and **the component does not await the Promise returned by `@submit`**. Disable auto-close for async submits:

```vue
<StepsForm
  ref="formRef"
  v-model:show="show"
  :close-on-submit="false"
  :confirm-loading="loading"
  :steps="steps"
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

- `confirmLoading` only affects the submit button's loading and disabled state; cancel and close stay available
- Cancel, the close icon and the mask only close the dialog and never emit `submit`

### Footer and header

The built-in footer is driven by the current step. These props adjust labels or hide it:

- `submitText` / `nextText` / `prevText` / `cancelText`
- `hideFooter`
- `footer` slot (scope: `close`, `prev`, `next`, `submit`, `current`, `stepCount`, `isFirst`, `isLast`, `confirmLoading`)

`next()` and `submit()` return `Promise<boolean>`, which custom buttons can use to chain behavior.

The `header` slot replaces `title`, and `header-extra` appends content on the right side of the header.

### Instance methods

```vue
<script setup>
import { ref } from 'vue'

const formRef = ref()

formRef.value?.open()
formRef.value?.next()
formRef.value?.prev()
formRef.value?.submit()
</script>

<template>
  <StepsForm ref="formRef" :steps="steps" />
</template>
```

| Method | Description |
| --- | --- |
| `open()` | Open the dialog |
| `close()` | Close the dialog |
| `next()` | Validate and advance; on the last step it equals `submit()`; returns `Promise<boolean>` |
| `prev()` | Go back one step without validation |
| `submit()` | Validate the current step and submit merged values; returns `Promise<boolean>` |
| `reset()` | Restore `defaultValue` and return to step one |
| `setStep(index)` | Jump directly without validation; out-of-range returns `false` |
| `setFieldValue(key, value)` | Write a field on the current step without validation |
| `current` | Zero-based index of the active step |
| `forms` | Mounted ProForm instances |
| `form` | ProForm instance of the current step; `undefined` with the `step` slot |

## Examples

### Basic stepped form

<Demo title="Three-step user form"
desc="Step one validates username and name; failures mark the step red. Continue to contact and notes, then submit to see merged values."
:raw="BasicRaw">

<Basic />

</Demo>

### Custom footer

<Demo title="footer slot"
desc="The footer scope exposes prev / next / submit plus step info to render a step tag and custom actions."
:raw="FooterRaw">

<Footer />

</Demo>

### Controlled visibility

<Demo title="v-model:show and instance methods"
desc="Disable the built-in trigger and drive visibility from external buttons; open, close and step changes are recorded."
:raw="ControlledRaw">

<Controlled />

</Demo>

### Async submit

<Demo title="closeOnSubmit=false + confirmLoading"
desc="Submitting simulates an 800ms request with a loading button, then closes through the instance close()."
:raw="AsyncSubmitRaw">

<AsyncSubmit />

</Demo>

### Custom step content

<Demo title="step slot"
desc="The step slot takes over every step's form and writes data with native NSelect / NInput plus setFieldValue."
:raw="CustomStepRaw">

<CustomStep />

</Demo>

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| show | Controlled visibility (`v-model:show`); internal state when omitted | `boolean` | `undefined` |
| defaultShow | Initial visibility in uncontrolled mode | `boolean` | `false` |
| title | Dialog title | `string` | `'分步表单'` |
| width | Dialog width; numbers become px, strings are CSS lengths | `number \| string` | `600` |
| steps | Step configuration | `StepsFormStep[]` | `[]` |
| model | Merged form values (`v-model:model`) | `Record<string, any>` | `{}` |
| defaultValue | Initial values for all steps, also the reset target | `Record<string, any>` | `{}` |
| showTrigger | Render the built-in trigger area | `boolean` | `true` |
| hideFooter | Hide the built-in footer | `boolean` | `false` |
| closeOnSubmit | Close after submitting | `boolean` | `true` |
| submitText | Submit button label | `string` | `'提交'` |
| nextText | Next button label | `string` | `'下一步'` |
| prevText | Previous button label | `string` | `'上一步'` |
| cancelText | Cancel button label | `string` | `'取消'` |
| confirmLoading | Submit button loading and disabled state for async submits | `boolean` | `false` |
| stepSize | NSteps size | `'small' \| 'medium'` | `'medium'` |
| closable | Show the close icon | `boolean` | `true` |
| maskClosable | Close on mask click | `boolean` | `true` |
| closeOnEsc | Close on Esc | `boolean` | `true` |
| blockScroll | Lock page scrolling while open | `boolean` | `false` |
| autoFocus | Auto focus on open | `boolean` | `true` |
| trapFocus | Trap focus inside the dialog | `boolean` | `true` |
| displayDirective | Destroy (`if`) or keep (`show`) content after close | `'if' \| 'show'` | `'if'` |
| zIndex | Dialog z-index | `number` | - |
| draggable | Allow dragging the dialog | `boolean \| object` | `false` |

> Attributes not listed are passed through to the current step's ProForm (and its NForm), such as `label-placement`, `rules` and `grid-cols`. The dialog is fixed to the card preset; NModal props like `preset` and `size` are not exposed.

### Events

| Event | Description | Payload |
| --- | --- | --- |
| submit | Emitted after the last step passes validation | `(values: Record<string, any>) => void` |
| step-change | Emitted after moving forward or back | `(current: number, previous: number) => void` |
| reset | Emitted by the instance `reset()` | - |
| update:show | Visibility changed, for `v-model:show` | `(show: boolean) => void` |
| update:model | Any step changed; payload is the merged values | `(model: Record<string, any>) => void` |
| open | Emitted after the dialog opens | - |
| close | Emitted after the dialog closes | - |

### Slots

| Slot | Description | Scope |
| --- | --- | --- |
| trigger | Trigger content; takes precedence over the default slot | - |
| default | Legacy trigger fallback | - |
| step | Replace the current step's form (used by every step) | `{ step, index, values, setFieldValue }` |
| footer | Replace the built-in footer | `{ close, prev, next, submit, current, stepCount, isFirst, isLast, confirmLoading }` |
| header | Replace the header content (wins over `title`) | - |
| header-extra | Append content on the right of the header | - |

### Expose

| Name | Description |
| --- | --- |
| `open()` | Open the dialog |
| `close()` | Close the dialog |
| `next()` | Validate and advance; on the last step equals `submit()` |
| `prev()` | Go back one step without validation |
| `submit()` | Validate the current step and submit merged values |
| `reset()` | Restore `defaultValue` and return to step one |
| `setStep(index)` | Jump directly without validation |
| `setFieldValue(key, value)` | Write a field on the current step |
| `current` | Active step index |
| `forms` | Mounted ProForm instances |
| `form` | ProForm instance of the current step |

### Exported types

```ts
import type {
  StepsFormColumn,
  StepsFormEmits,
  StepsFormExpose,
  StepsFormFooterScope,
  StepsFormProps,
  StepsFormStep,
  StepsFormStepScope,
} from '@banmao/procomponent'
```

## FAQ

**Clicking "Next" does nothing?**
The current step failed validation. StepsForm marks it `error` and ProForm logs the errors to the console; fix the fields and click again.

**The dialog closes before my async submit finishes?**
`submit` is a synchronous event and does not await the handler's Promise. Set `:close-on-submit="false"` and close through `v-model:show` or the instance `close()` when the request finishes.

**The active step and entered values survive closing and reopening?**
StepsForm keeps its state on the component level, outside the modal content, so `displayDirective='if'` does not reset it. To always start from step one with an empty form, call `reset()` after closing or control `defaultValue` yourself.

**Both `defaultValue` and `model` are passed — which wins?**
On open (mount) `defaultValue` wins, consistent with ProForm; later external changes to existing keys in `model` still sync into the current step.

**Can each step have its own defaults?**
`defaultValue` is one merged object applied by key; keys that do not belong to a step do not affect it.

**Why is there no validation with the `step` slot?**
There is no built-in ProForm instance to call `validate()`, so StepsForm lets it pass. Validate inside your custom content and guard before submitting.

**Does `setStep` validate?**
No. It is a programmatic jump; make sure the target step's data is valid yourself when jumping forward.

**Action columns from `columns` are missing?**
Columns with `type: 'index' | 'selection'` or `key: 'actions'` are filtered out; step forms render field columns only.

**Does `confirmLoading` block closing?**
No. It only makes the submit button loading and disabled; cancel, the mask and Esc still work.

## Behavior conventions

- The trigger only opens; closing comes from cancel, the close icon, the mask, Esc, the instance `close()` or controlled `show`
- Next validates the current step; failure stays with an `error` mark, success advances and emits `step-change`
- Prev only goes back, skips validation, and keeps entered values through the merged `model`
- Submit validates the current step only; `closeOnSubmit` defaults to `true` and closes synchronously after the `submit` event
- `submit` does not await async return values; disable auto-close for async flows
- `reset()` restores `defaultValue`, returns to step one and remounts the current step form
- The `step` slot creates no ProForm, so step validation passes automatically
- Undeclared attributes pass through to the current step's ProForm; style the dialog itself through `width` and explicit NModal-level props
