---
name: Actions
desc: Actions is an action-button group for table rows and toolbars — declare operations in items, show as many as showNum and container width allow, collapse the rest into a Popover menu, with permission filtering, confirmation, icons and sizes built in.
---

<route lang="yaml">
meta:
  layout: default
</route>

# Actions

Actions is an **action-button group**: declare operations in `items`, render some of them inline based on `showNum` and the container width, and collapse the rest into a "more" Popover menu. Permission filtering, confirmation, icons, sizes and responsive shrinking are built in; business logic still lives in `items[].onClick`.

## Features

- **Config-driven actions**: an `items` array where each entry has `label`, `key`, `variant`, `disabled`, `permission`, `icon`, `confirm` and `onClick`
- **Visible count cap**: `showNum` limits inline buttons and the rest move into the "more" menu; defaults to 2 without `responsive` and is unlimited with it
- **Optional responsive layout**: `responsive` shrinks the inline set to the container width; `showNum` becomes an upper bound and the final count is the smaller of the cap and what fits
- **Permission filtering**: `permissions` array or `hasPermission` callback, with the callback taking precedence; items without `permission` always render
- **Confirmation**: `confirm` / `confirmContent` use a shared dialog, with identical behavior for inline and overflow items
- **Root events**: `click(item, event?)` and `cancel(item)` for tracking, logging or interception
- **Appearance**: `size` controls button size, `item.icon` / `moreIcon` accept Iconify names, and `variant` controls color
- **Keyboard support**: the default overflow menu supports arrow keys, Home / End, Esc and focus restoration
- **Custom overflow**: the `overflow` slot replaces the default menu entirely for grouping or custom layouts

## When to use

- Row actions such as "edit / detail / delete" in a table column
- A group of secondary toolbar actions with a capped inline count
- Cases where visibility varies with permissions or container width
- Destructive actions such as delete or archive that need confirmation

The component is **not a direct fit** for:

- Buttons with loading state, async disabling or arbitrary button content
- Per-item visual customization such as individual sizes or styles
- Built-in grouping of operations — use the `overflow` slot to render groups yourself

## Quick start

### Installation

```script-tabs
@banmao/procomponent
```

### On-demand import

```vue
<script setup>
import { Actions } from '@banmao/procomponent'
</script>
```

### Global registration

```ts
import { createApp } from 'vue'
import { ActionsPlugin } from '@banmao/procomponent'
import App from './App.vue'

createApp(App).use(ActionsPlugin).mount('#app')
```

### Basic usage

`items` is the operation list; clicking a button runs that entry's `onClick`. `variant` and `key` are required:

```vue
<script setup lang="ts">
import { Actions, type ActionButton } from '@banmao/procomponent'

const items: ActionButton[] = [
  {
    label: 'Edit',
    key: 'edit',
    variant: 'primary',
    onClick: (item, event) => console.log('edit', item.key, event?.type),
  },
  {
    label: 'Details',
    key: 'detail',
    variant: 'info',
    onClick: item => console.log('details', item.key),
  },
]
</script>

<template>
  <Actions :items="items" />
</template>
```

`showNum` defaults to `2`. With more than two operations, everything from the third entry onwards goes into the "more" menu; with exactly two, no "more" button appears. With `responsive` enabled, `showNum` becomes an upper bound and is unlimited when omitted, so only the container width limits the inline set.

## Core concepts

### Processing order

The component decides what to render in this order:

1. **Permission filtering**: remove operations the current user cannot access
2. **Count cap**: `cap = showNum ?? (responsive ? Infinity : 2)`
3. **Width measurement**: when `responsive` is on, calculate how many buttons fit
4. **Split**: use the smaller of the cap and the measurement; earlier items render inline and the rest go into the overflow menu

Filtering happens before counting, so hidden operations do not consume visible slots.

### Inline items and overflow

| Group | Condition | Rendering |
| --- | --- | --- |
| Inline | `allowedItems.slice(0, visibleCount)` | Text buttons (`NButton quaternary`), colored by `variant` |
| Overflow | `allowedItems.slice(visibleCount)` | "More" button + Popover vertical menu |

`showNum` defaults depend on `responsive`:

| `responsive` | `showNum` | Behavior |
| --- | --- | --- |
| `false` | omitted | Render 2 inline |
| `false` | `N` | Render `N` inline; `0` collapses everything |
| `true` | omitted | No count cap, shrink only by width |
| `true` | `N` | At most `N` inline; shrink further when width is tight |

Things to know:

- `items[].key` **must be unique** within a group; it is used both as the render key and the action identity
- Only the filtered array participates in counting; `disabled` items still occupy a slot but never emit events
- `items`, `showNum`, `align`, `size`, `responsive`, `permissions` and `hasPermission` are all reactive
- Overflow entries keep the same `label`, `variant`, `disabled`, `icon`, `confirm` and `onClick`

### Responsive shrinking

With `responsive` enabled:

- A hidden measuring row renders inside the root, containing every allowed item plus a "more" trigger
- A `ResizeObserver` watches the root width and recalculation is batched with `requestAnimationFrame`
- The calculation reserves the width of the "more" trigger and the gap; when everything fits, no "more" button renders
- The component measures again after web fonts finish loading to avoid font-related width drift
- The container width comes from the root node's `clientWidth`

The root is a block-level `div`, so its width follows the parent. In an inline or shrink-to-fit parent the root may collapse to its content width and the component will always think everything fits — give the parent an explicit width or let it fill the remaining flex space.

### Permission filtering

| Configuration | Behavior |
| --- | --- |
| `permissions: string[]` | Hide items whose `permission` is not in the array |
| `hasPermission: (permission) => boolean` | Called for each item that declares `permission`; hide when it returns `false` |
| Both provided | **`hasPermission` wins**, `permissions` is ignored |
| Neither provided | No filtering |
| Item without `permission` | Always rendered |

```vue
<Actions :items="items" :has-permission="permission => acl.can(permission)" />
```

`hasPermission` is only called for items that declare `permission`; untagged items are kept as-is.

### Confirmation

When an item sets `confirm: true`, clicking does not run it immediately:

- Both inline buttons and overflow entries close the menu first, then open the shared dialog
- The title comes from `confirmTitle` (default "操作确认")
- The body comes from `confirmContent`; when omitted it is generated from the label
- `variant: 'error'` items use the error dialog type, everything else uses warning
- Clicking the positive button runs `item.onClick(item)` and then emits `click(item, undefined)`
- Clicking the negative button, pressing Esc or clicking the mask emits `cancel(item)` without running the action

The dialog is managed internally; no `NPopconfirm` wrapper is needed.

### Events

| Event | When | Payload |
| --- | --- | --- |
| `click` | After an action actually runs (after confirmation for confirmed items) | `(item, event?)`; `MouseEvent` for direct clicks, `undefined` after confirmation |
| `cancel` | The confirmation is rejected, Esc or mask close | `(item)` |

`item.onClick(item, event)` runs first, then the root emits `click`. Disabled items and unconfirmed actions emit nothing.

```vue
<Actions
  :items="items"
  @click="(item, event) => track('action', item.key, event)"
  @cancel="item => track('cancel', item.key)"
/>
```

### Button appearance

Inline buttons and overflow entries are Naive UI `quaternary` text buttons. Color comes from `variant` and size from `size`:

| `variant` | Effect |
| --- | --- |
| `primary` | Primary-colored text button |
| `success` | Success-colored text button |
| `info` | Info-colored text button |
| `warning` | Warning-colored text button |
| `error` | Error-colored text button (destructive actions) |

- `size` accepts `small` / `medium` / `large` and applies to inline buttons, the overflow trigger and menu entries
- `item.icon` renders a 16px icon before the label and must be an Iconify name such as `mdi:pencil`
- `moreIcon` replaces the trigger icon; when omitted the built-in `bm-icon/more-horizontal` is used
- `moreLabel` is the accessible name of the trigger (default "更多操作")

Icons are loaded by `@iconify/vue` by name, so the runtime must be able to fetch the icon data.

### Overflow menu and keyboard

The default overflow panel is a vertical list with `role="menu"`:

- Focus moves to the first enabled menu item when it opens
- `ArrowDown` / `ArrowUp` cycle, `Home` / `End` jump to the ends
- `Enter` / `Space` activates the focused item
- `Esc` closes the menu and returns focus to the "more" button
- Selecting an item closes the menu; confirmed items then open the dialog
- Disabled items are skipped by keyboard navigation

### Custom overflow panel

The `overflow` slot receives `{ items, close }` and replaces the default menu:

```vue
<Actions :items="items" :show-num="1">
  <template #overflow="{ items, close }: { items: ActionButton[]; close: () => void }">
    <div class="w-[180px]">
      <div class="px-2 py-1 text-xs opacity-60">Common</div>
      <NButton
        v-for="item in items.filter(entry => entry.variant !== 'error')"
        :key="item.key"
        quaternary
        block
        @click="item.onClick?.(item); close()"
      >
        {{ item.label }}
      </NButton>
    </div>
  </template>
</Actions>
```

A custom panel takes over **all** rendering and behavior: the component no longer handles `disabled`, confirmation, `click` / `cancel` events, keyboard navigation or focus restoration. `close()` only closes the Popover.

### Alignment

`align` applies to the flex container of the whole group:

| Value | Effect |
| --- | --- |
| `left` | Left-aligned (default) |
| `center` | Centered |
| `right` | Right-aligned |

## Examples

### Basic

<Demo title="Basic usage"
desc="With two operations no 'more' button appears; clicking runs the item's onClick and passes both the item and the MouseEvent."
:raw="BasicActionsRaw">

<BasicActions />

</Demo>

### Overflow and disabled

<Demo title="Overflow beyond showNum"
desc="Change show-num to see inline buttons and menu entries change; 0 collapses everything and 5 renders them all. Disabled menu entries cannot be clicked and error entries render in red."
:raw="OverflowActionsRaw">

<OverflowActions />

</Demo>

### Confirmation and root events

<Demo title="confirm with @click / @cancel"
desc="Archive sits inline and Delete sits in the overflow menu; both ask for confirmation. Confirming runs the action and emits click, while cancelling emits cancel."
:raw="ConfirmActionsRaw">

<ConfirmActions />

</Demo>

### Permission filtering

<Demo title="permissions array"
desc="Toggle permission codes to show or hide operations; Help has no permission and is always visible."
:raw="PermissionActionsRaw">

<PermissionActions />

</Demo>

### Responsive shrinking

<Demo title="Shrink to the container width"
desc="Drag the slider to resize the container. With responsive on, show-num is an upper bound and the inline count follows the width; no 'more' button appears when everything fits."
:raw="ResponsiveActionsRaw">

<ResponsiveActions />

</Demo>

### Size and icons

<Demo title="size, item.icon and moreIcon"
desc="Switch button sizes and the 'more' icon; item.icon renders an Iconify icon before the label."
:raw="IconSizeActionsRaw">

<IconSizeActions />

</Demo>

### Custom overflow panel

<Demo title="Grouping with the overflow slot"
desc="Group common and destructive actions with the slot; a custom panel is responsible for calling item.onClick and close."
:raw="CustomOverflowActionsRaw">

<CustomOverflowActions />

</Demo>

### Alignment

<Demo title="left / center / right"
desc="align controls the horizontal position of the group inside its container; each dashed box marks the container."
:raw="AlignActionsRaw">

<AlignActions />

</Demo>

## Advanced

### Table action column

Capture the current row in `onClick`, and opt into permissions and responsiveness as needed:

```tsx
import { Actions } from '@banmao/procomponent'

{
  title: 'Actions',
  key: 'actions',
  width: 200,
  fixed: 'right',
  render: row => (
    <Actions
      items={[
        { label: 'Edit', key: 'edit', variant: 'primary', permission: 'order:edit', onClick: () => handleEdit(row) },
        { label: 'Details', key: 'detail', variant: 'info', onClick: () => handleDetail(row) },
        { label: 'Delete', key: 'delete', variant: 'error', permission: 'order:delete', confirm: true, onClick: () => handleDelete(row) },
      ]}
      permissions={userPermissions}
    />
  ),
}
```

See [ProTable](/en/procomponent/ProTable) for the full example. Reserve the column width for the inline buttons: with the default `showNum` of 2, two buttons plus "more" need roughly 160px; a responsive setup can use a wider column.

### Permissions plus confirmation

Permission filtering and confirmation compose: unauthorized items disappear, while authorized destructive actions still ask first.

```tsx
<Actions
  items={[
    { label: 'Export', key: 'export', variant: 'primary', permission: 'data:export', onClick: exportData },
    { label: 'Delete', key: 'delete', variant: 'error', permission: 'data:delete', confirm: true, confirmContent: 'This cannot be undone', onClick: removeData },
  ]}
  hasPermission={permission => acl.can(permission)}
  @click={item => track('action', item.key)}
/>
```

## API

### Props

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| items | Operation list, see [ActionButton](#actionbutton) | `ActionButton[]` | `[]` |
| showNum | Inline count cap; 2 by default without `responsive`, unlimited with it | `number` | `undefined` |
| align | Horizontal alignment of the group | `'left' \| 'center' \| 'right'` | `'left'` |
| size | Button size | `'small' \| 'medium' \| 'large'` | `'medium'` |
| responsive | Shrink the inline set to the container width | `boolean` | `false` |
| permissions | Allowed permission codes | `string[]` | `undefined` |
| hasPermission | Permission predicate; takes precedence over `permissions` | `(permission: string) => boolean` | `undefined` |
| moreIcon | Trigger icon (Iconify name) | `string` | `''` |
| moreLabel | Accessible name of the trigger | `string` | `'更多操作'` |
| confirmTitle | Confirmation dialog title | `string` | `'操作确认'` |

### Events

| Event | Description | Payload |
| --- | --- | --- |
| click | Emitted after an action runs | `(item: ActionButton, event?: MouseEvent)` |
| cancel | Emitted when confirmation is rejected | `(item: ActionButton)` |

### Slots

| Slot | Description | Scope |
| --- | --- | --- |
| overflow | Replaces the default overflow menu entirely | `{ items: ActionButton[]; close: () => void }` |

With a custom `overflow` slot the component no longer handles disabled state, confirmation, events or keyboard behavior inside the menu.

### ActionButton

The element type of `items`, exported from the package entry:

| Field | Description | Type | Required |
| --- | --- | --- | --- |
| label | Button / menu text | `string` | Yes |
| key | Unique identifier within the group | `string` | Yes |
| variant | Button type | `'primary' \| 'success' \| 'info' \| 'warning' \| 'error'` | Yes |
| disabled | Disables the item inline and in the menu | `boolean` | No |
| permission | Permission code used with `permissions` / `hasPermission` | `string` | No |
| icon | Leading icon (Iconify name) | `string` | No |
| confirm | Ask for confirmation before running | `boolean` | No |
| confirmContent | Confirmation body; generated from the label when omitted | `string` | No |
| onClick | Click callback; runs after confirmation for confirmed items | `(item: ActionButton, event?: MouseEvent) => void` | No |

```ts
import type {
  ActionAlign,
  ActionButton,
  ActionButtonProps,
  ActionSize,
  ActionsEmits,
  ActionsProps,
  ActionVariant,
} from '@banmao/procomponent'
```

## FAQ

**Why didn't `@click` fire?**
Check that the action actually ran: disabled items and unconfirmed `confirm` items emit nothing. Confirmed items receive `undefined` as `event` because the event comes from the dialog button, not the original click.

**Why is there no "more" button?**
Without `responsive` it only appears when `items.length > showNum`, and `showNum` defaults to 2. With `responsive` it also stays hidden when the container fits everything. In a shrink-to-fit parent the root width equals its content width, so the component believes everything fits.

**Why does `permission` have no effect?**
Filtering only happens when `permissions` or `hasPermission` is provided; with neither, everything is kept. When both are provided, `hasPermission` wins. Items without `permission` always render.

**Why did a confirmed item open a dialog instead of running?**
That is expected: `confirm: true` items run only after the positive button is clicked. Cancelling, pressing Esc or clicking the mask emits `cancel`.

**Do `cancel` and `click` both fire?**
No. Confirming emits only `click`; cancelling emits only `cancel`.

**Can I change button size or icons?**
Yes. `size` changes all buttons; `item.icon` changes a single item; `moreIcon` changes the trigger. Names must be Iconify names and the runtime must be able to load the icon data.

**Can I customize button content?**
Inline buttons support only `label` + `icon`. The overflow menu can be fully customized with the `overflow` slot, but it must handle clicks, confirmation, disabled state and closing itself.

**Why is overflow a Popover instead of a Dropdown?**
The current implementation uses a Popover with a `role="menu"` vertical list, which makes focus management, keyboard navigation and custom rendering consistent. Visually it is a padded floating menu instead of a dropdown list.

## Boundaries

| Topic | Note |
| --- | --- |
| Responsive measurement | Requires a measurable root width; shrink-to-fit parents prevent shrinking |
| Custom overflow | The `overflow` slot bypasses the default disabled, confirmation, event and keyboard logic |
| Icons | Iconify names require the corresponding icon data to be available |
| Button content | Inline buttons only support label and icon, not arbitrary slots |
| Loading state | No built-in loading; handle async operations in the caller |
