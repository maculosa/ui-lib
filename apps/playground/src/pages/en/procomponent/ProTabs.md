---
name: ProTabs
desc: ProTabs is a config-driven tab bar with card / line styles, controlled and uncontrolled selection, numeric badges, icons, closable tabs and custom rendering. It renders the tab bar only — the content area is up to you.
---

<route lang="yaml">
meta:
  layout: default
</route>

# ProTabs

ProTabs is a **tab bar** component: configure the tabs with `options`, hold the selection in `active`, get `update:active` on click and `close` on closing. It **renders the tab bar only** — no content area, no tab caching, no `vue-router` dependency. What goes into the content area, whether to use `keep-alive`, and how tabs map to routes are all up to you.

This document tracks the repository source.

> **Version note**: in `0.7.31` `ProTabs` was only an unfinished source directory, **not exported from the package entry**, so `import { ProTabs } from '@banmao/procomponent'` did not work; the default value of `render` also returned an invalid VNode. It becomes usable in the next release, and this page describes that release.

## Features

- **Config-driven tabs**: driven by an `options` array, `label` + `key` is enough, with disabled items
- **Two shapes**: `type="card"` (default) or `type="line"` for an underline style
- **Controlled and uncontrolled**: `v-model:active` keeps the selection outside; omit `active` and the component owns it, with `defaultActive` as the initial value
- **Numeric badges**: `showBadge` plus `dot` on an option; `dot: 0` renders too
- **Icons**: a component-level `icon` acts as the default, an option-level `icon` overrides it, rendered through `@iconify/vue`
- **Closable**: `closable` renders a close button and emits `close(key)`; removing the item is up to you
- **Custom rendering**: an option-level `render` beats the component-level `render` and replaces only the content area — clicks and selection stay with the component
- **Horizontal scrolling**: tabs scroll horizontally when they do not fit, the scrollbar is hidden and tabs are never compressed
- **Keyboard reachable**: every tab has `role="tab"` and a `tabindex`, Enter / Space activates, disabled items leave the tab order
- **Injectable styles**: `class` / `style` apply to the root node and `class` is merged with `tailwind-merge`; colors come from CSS variables so the host can re-theme them

## When to use

- The content area switches between a few sibling views and you want to own the switching logic
- An admin **multi-tab** skeleton: pair it with [ProLayout](/en/procomponent/ProLayout) and let one `active` drive both the tabs and the menu highlight
- Tabs come from a backend API and need to be added or removed dynamically
- Tabs need count badges, status dots or custom content

The current version is **not a good fit** for:

- An all-in-one "tabs + content panels" wrapper with tab caching (`keep-alive`) — use Naive UI's `NTabs` instead
- Editor-grade interactions such as drag-to-reorder, context menus or double-click renaming
- Arrow-key focus movement between tabs (only Tab and Enter / Space are supported today)

## Quick start

### Installation

```script-tabs
@banmao/procomponent
```

### On-demand import

```vue
<script setup>
import { ProTabs } from '@banmao/procomponent'
</script>
```

### Global registration

```ts
import { createApp } from 'vue'
import { ProTabsPlugin } from '@banmao/procomponent'
import App from './App.vue'

createApp(App).use(ProTabsPlugin).mount('#app')
```

### Basic usage

`options` is the tab array and `v-model:active` holds the selected `key`. **The component is only a tab bar**, so write the content area yourself:

```vue
<script setup>
import { ref } from 'vue'
import { ProTabs } from '@banmao/procomponent'

const options = [
  { label: 'Overview', key: 'overview' },
  { label: 'Details', key: 'detail' },
  { label: 'Audit log', key: 'log' },
]
const active = ref('overview')
</script>

<template>
  <ProTabs v-model:active="active" :options="options" />

  <div class="p-4">
    <p v-if="active === 'overview'">Overview content</p>
    <p v-else-if="active === 'detail'">Details content</p>
    <p v-else>Log content</p>
  </div>
</template>
```

Omitting `active` makes it uncontrolled: the component owns the highlight, starting at `defaultActive` or, when that is absent, at `options[0].key`:

```vue
<ProTabs :options="options" default-active="detail" @update:active="key => console.log(key)" />
```

## Core concepts

### Structure

```text
div  ← root: relative flex w-full + class prop; the style prop applies here
└── div[role="tablist"]  ← flex items-center gap-1 flex-1 min-w-0 min-h-[40px] overflow-x-auto
    │                      scrollbar hidden (scrollbar-width: none + ::-webkit-scrollbar)
    │                      card: --color-fill background + radius; line: --color-divider bottom border
    │                      px-1 when inset is true, px-0 otherwise
    ├── div[role="tab"] × options.length  ← shrink-0 px-3 text-sm, 32px tall for card, full 40px for line
    │   ├── content    option.render > props.render > built-in (icon + label + badge)
    │   ├── close btn  rendered when closable, <button aria-label="close {label}">
    │   └── underline  rendered for an active line tab, absolute bottom-0 h-[2px]
    └── default slot content (after all tabs)
```

Dimensions:

| Part | Value | Notes |
| --- | --- | --- |
| Tab bar min height | 40px | `min-h-[40px]`, not configurable |
| Card tab height | 32px | `h-8`, vertically centered inside the 40px bar |
| Line tab height | 40px | `self-stretch`, fills the bar |
| Tab horizontal padding | 12px | `px-3`, not configurable |
| Gap between tabs | 4px | `gap-1` |
| Icon size | 16px | `text-[16px]` |
| Badge | 18px tall, 18px min width | `text-[11px]`, circular, accent background with white text |
| Close icon size | 14px | `text-[14px]` |
| Underline thickness | 2px | Active `line` tabs only |
| Radius | 2px / full | `rounded-[2px]` by default, `rounded-full` when `rounded` is true, **card only** |

Tabs are `shrink-0` and are **never compressed**; when the total width exceeds the container the bar scrolls horizontally. The scrollbar is hidden and there are no arrow buttons, so add your own gradient mask if you need to hint that scrolling is possible.

### Selection model

The selection is `props.active || innerActive`, so **an empty string `''` means uncontrolled**:

| Usage | Behaviour |
| --- | --- |
| `v-model:active="active"` | Controlled: the highlight always equals the external value, clicks emit `update:active` for you to write back |
| `:active="active"` without the event | The highlight **stays at the passed value**; clicks only emit the event |
| No `active` | Uncontrolled: the component owns the highlight, clicks switch it and also emit `update:active` |
| No `active` + `default-active` | Uncontrolled, initially selecting `defaultActive` |
| Neither `active` nor `defaultActive` | Uncontrolled, initially selecting `options[0].key`; `''` (no highlight) when `options` is empty |

`defaultActive` is **read once at initialization**; changing it later does not move the selection.

Clicking a tab **always** writes the internal state first and then emits `update:active`. In controlled mode, not writing back means nothing switches — the same contract as `ProLayout`'s `menuValue`.

When `options` changes in uncontrolled mode there is a fallback rule so the selection never dangles:

| Case | Result |
| --- | --- |
| The selected item is still in the new `options` | Unchanged |
| The selected item is gone (closed, for example) and there was a selection | Falls back to the **last** remaining tab |
| There was no selection yet (`options` arriving asynchronously, for example) | Falls back to the **first** item |
| The new `options` is an empty array | The selection becomes `''`, no highlight |

Three things to note:

- This fallback **does not emit `update:active`**, so external listeners never see it; only user clicks emit the event
- The watch is on the **reference** of `options`, so in-place mutations like `tabs.value.push(...)` / `splice(...)` do not trigger the fallback — replace the array instead
- In controlled mode (`active` non-empty) the component does **no fallback at all**; who owns the highlight after the selected item is removed is entirely up to you

### Adding and removing tabs

`closable` only renders the close button and emits `close(key)` — it **never removes the item from `options`** itself, because `options` is an array you own and the component does not mutate it. Removing the tab, and deciding what gets selected afterwards, is up to you:

```vue
<script setup>
import { ref } from 'vue'
import { ProTabs } from '@banmao/procomponent'

const tabs = ref([{ label: 'Home', key: '/home' }])
const active = ref('/home')

function closeTab(key) {
  const index = tabs.value.findIndex(tab => tab.key === key)
  if (index === -1) return
  const next = tabs.value.filter(tab => tab.key !== key)
  tabs.value = next
  // Leave active alone unless the closed tab was the active one; then fall back to a neighbour, or empty
  if (active.value !== key) return
  active.value = next[Math.min(index, next.length - 1)]?.key ?? ''
}
</script>

<template>
  <ProTabs v-model:active="active" :options="tabs" closable @close="closeTab" />
</template>
```

The close button calls `stopPropagation`, so **clicking close does not also select that tab**. There is no built-in "add tab" button — put one in the `default` slot (see [Extending the right side of the tab bar](#extending-the-right-side-of-the-tab-bar)).

### Custom rendering

The content area is resolved as **option-level `render` > component-level `render` > built-in rendering**:

```tsx
const options = [
  {
    label: 'Running',
    key: 'running',
    render: option => (
      <span class="flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-[#3e9b4f]" />
        {option.label}
      </span>
    ),
  },
  { label: 'Stopped', key: 'stopped' },
]
```

Key points:

- `render` receives that tab's `TabOption` and its return value replaces the **whole content area** (icon, label and badge are no longer rendered)
- **Only the content area is replaced**: selection, clicks, keyboard activation, the close button and the `line` underline stay with the component, so you do not need to bind events yourself
- Returning an empty value such as `null` / `undefined` falls through to the next level; an empty option-level result falls back to the component-level `render`, and an empty component-level result falls back to the built-in rendering
- With `render` in play the `dot` badge is not rendered — draw it yourself if you need it
- A component-level `render` applies to every tab, which suits uniform shapes such as "show the key" or "icon + count"

### Colors and theming

ProTabs does **not follow the Naive UI theme**. All colors come from CSS variables with fallbacks: define the same variables in your host app to re-theme it, or leave them undefined and get the light fallback palette:

| CSS variable | Fallback | Used for |
| --- | --- | --- |
| `--color-accent` | `#f04e23` | Active text, badge background, `line` underline |
| `--color-foreground-secondary` | `#57534a` | Inactive text |
| `--color-foreground` | `#1c1a15` | Hover text of inactive `line` tabs |
| `--color-selected` | `rgba(240,78,35,0.09)` | Background of the active `card` tab |
| `--color-hover` | `rgba(240,78,35,0.05)` | Hover background of inactive `card` tabs |
| `--color-fill` | `#ece8de` | `card` tab bar background |
| `--color-divider` | `#dfdacc` | `line` tab bar bottom border |

```css
/* Define these in the host app; give the dark theme another set */
:root {
  --color-accent: #f04e23;
  --color-fill: #ece8de;
  --color-divider: #dfdacc;
  --color-foreground-secondary: #57534a;
}
.dark {
  --color-accent: #ff6a3d;
  --color-fill: #2c2820;
  --color-divider: #322e25;
  --color-foreground-secondary: #b5b1a2;
}
```

> The library's own stylesheet only does `@import 'tailwindcss'` and **defines none of these variables**, so the default rendering is the light fallback palette. On a dark page, provide the variables from the host or override them with `class` (see below).

`class` is merged into the root node with `tailwind-merge` and `style` is the root inline style. Internal styles such as the bar background are on a child node and cannot be reached with `class` — use the CSS variables:

```vue
<ProTabs :options="options" class="my-2" :style="{ '--color-fill': '#2c2820' }" />
```

## Examples

### Basics

<Demo title="Basic usage"
desc="The minimal options + v-model:active setup, with the content area rendered externally from active; disabled items cannot be selected by click or keyboard."
:raw="BasicTabsRaw">

<BasicTabs />

</Demo>

### Shape

<Demo title="card / line with inset and rounded"
desc="type switches between the card and underline styles; inset adds 4px of horizontal padding to the bar and rounded turns the radius fully round — rounded only affects card."
:raw="TabsTypeRaw">

<TabsType />

</Demo>

### Badges and icons

<Demo title="Numeric badges and icons"
desc="With showBadge on, the option's dot is rendered, including dot: 0; the component-level icon is the default and an option-level icon overrides it."
:raw="TabsBadgeRaw">

<TabsBadge />

</Demo>

### Closing tabs

<Demo title="Closable tabs"
desc="Uncontrolled + closable: closing only emits close(key) and the item is removed from options externally; closing the selected tab falls back to the last remaining one, and closing them all leaves the selection as an empty string."
:raw="TabsClosableRaw">

<TabsClosable />

</Demo>

### Custom rendering

<Demo title="Option-level and component-level render"
desc="The option-level render replaces only the “Running” content area, while the component-level render applies to every tab at a lower priority; both take over the content area only, leaving clicks and selection to ProTabs."
:raw="TabsRenderRaw">

<TabsRender />

</Demo>

### Async data

<Demo title="Tabs arriving asynchronously"
desc="Uncontrolled without default-active: the bar still occupies 40px while options is empty, and the first item is selected once the data arrives; that internal fallback does not emit update:active."
:raw="TabsAsyncRaw">

<TabsAsync />

</Demo>

## Advanced usage

### Multi-tab pages with ProLayout

The familiar admin pattern "click a menu item to open a tab, switch tabs to swap content" needs just one `active` driving both components, so the menu highlight follows the current tab:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { MenuOption } from 'naive-ui'
import { ProLayout, ProTabs } from '@banmao/procomponent'

const menus: MenuOption[] = [
  { label: 'Home', key: '/home' },
  { label: 'Table', key: '/table' },
]

const tabs = ref([{ label: 'Home', key: '/home' }])
const active = ref('/home')

function openTab(key: string | number, item: MenuOption) {
  const tabKey = String(key)
  if (!tabs.value.some(tab => tab.key === tabKey)) {
    tabs.value = [...tabs.value, { label: String(item.label ?? tabKey), key: tabKey }]
  }
  active.value = tabKey
}

function closeTab(key: string) {
  const index = tabs.value.findIndex(tab => tab.key === key)
  if (index === -1) return
  const next = tabs.value.filter(tab => tab.key !== key)
  tabs.value = next
  if (active.value !== key) return
  active.value = next[Math.min(index, next.length - 1)]?.key ?? ''
}
</script>

<template>
  <ProLayout
    :menus="menus"
    :menu-value="active"
    content-class="p-0"
    :style="{ height: '100vh' }"
    @menu-click="openTab"
  >
    <div class="h-full flex flex-col min-h-0">
      <div class="px-3 pt-3">
        <ProTabs v-model:active="active" :options="tabs" closable inset @close="closeTab" />
      </div>
      <div class="flex-1 min-h-0 overflow-auto p-4">
        <router-view />
      </div>
    </div>
  </ProLayout>
</template>
```

`content-class="p-0"` lets the tab bar sit flush against the content area edges, and `h-full flex flex-col min-h-0` keeps the content area scrolling correctly. See [ProLayout - Multi-tab pages](/en/procomponent/ProLayout#multi-tab-pages) for the full explanation.

### Linking to the router

ProTabs does not depend on `vue-router`. Bind `active` to the route path, navigate in `update:active`, and sync route changes back with a `watch`:

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ProTabs } from '@banmao/procomponent'

const route = useRoute()
const router = useRouter()

const tabs = ref([{ label: 'Home', key: '/home' }])
const active = ref(route.path)

// Add the tab for deep links and refreshes
watch(() => route.path, (path) => {
  if (!tabs.value.some(tab => tab.key === path)) {
    tabs.value = [...tabs.value, { label: String(route.meta.title ?? path), key: path }]
  }
  active.value = path
}, { immediate: true })

function handleChange(key: string) {
  router.push(key)
}
</script>

<template>
  <ProTabs :active="active" :options="tabs" closable @update:active="handleChange" />
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>
```

This uses `:active` + `@update:active` rather than `v-model`: the route is the single source of the selection, clicks only navigate, and the route change flows back into the highlight. Tab caching is left to `keep-alive`; ProTabs takes no part in it.

> `active` must be a writable `ref`. If you write it as `computed(() => route.path)`, you can only bind it one-way with `:active`, not with `v-model:active`.

### Extending the right side of the tab bar

The `default` slot sits after all tabs inside the same `tablist` container, which suits an "add tab" button or a right-hand tool area:

```vue
<template>
  <ProTabs v-model:active="active" :options="tabs" closable @close="closeTab">
    <button
      type="button"
      class="shrink-0 px-2 text-sm opacity-60 hover:opacity-100"
      @click="addTab"
    >
      + Add
    </button>
  </ProTabs>
</template>
```

Slot content scrolls horizontally together with the bar and is **not** pinned to the right. For a tool area that stays put, place ProTabs and the tools side by side in a flex container:

```vue
<template>
  <div class="flex items-center gap-2">
    <div class="flex-1 min-w-0">
      <ProTabs v-model:active="active" :options="tabs" />
    </div>
    <div class="shrink-0">
      <!-- Tool area pinned to the right -->
    </div>
  </div>
</template>
```

The outer `flex-1 min-w-0` is required, otherwise the bar will not shrink and horizontal scrolling stops working.

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| options | Tab array, see [TabOption](#taboption); the watch is on the reference, so in-place mutations do not trigger the fallback | `TabOption[]` | `[]` |
| active | The selected `key`, controlled; **an empty string means uncontrolled**. Supports `v-model:active` | `string` | `''` |
| defaultActive | Initial selected `key` in uncontrolled mode, read once at initialization; falls back to `options[0].key` | `string` | `''` |
| type | Shape: `card` or `line` for the underline style | `'card' \| 'line'` | `'card'` |
| showBadge | Whether to render numeric badges; the option also needs a `dot` | `boolean` | `false` |
| icon | Component-level default icon name (`@iconify/vue`); an option-level `icon` wins | `string` | `''` |
| closable | Whether to render close buttons; only emits `close` and never mutates `options` | `boolean` | `false` |
| inset | Whether the bar gets 4px of horizontal padding | `boolean` | `false` |
| rounded | Whether the radius is fully round, **card only** | `boolean` | `false` |
| render | Component-level custom rendering, lower priority than an option-level `render`, see [Custom rendering](#custom-rendering) | `(option: TabOption) => VNode` | - |
| class | Classes appended to the root node, merged with `tailwind-merge`, **strings only** | `string` | `''` |
| style | Root inline style, also usable for CSS variables | `Record<string, any>` | `{}` |

All of the above are consumed. The `TabOption` / `ProTabsProps` types are not exported from the package entry — declare an equivalent shape yourself when you need annotations.

### Events

| Event | Description | Callback |
| --- | --- | --- |
| update:active | Emitted when a non-disabled tab is clicked (or activated with Enter / Space); pairs with `active` for `v-model:active`. The component's internal selection fallback does **not** emit it | `(key: string) => void` |
| close | Emitted when a close button is clicked, with that tab's `key`; it does **not** select the tab and does not modify `options` | `(key: string) => void` |

Write `@update:active` and `@close` in templates. There are no alias events such as `add` / `change` / `tab-click`.

### Slots

| Name | Description | Slot props |
| --- | --- | --- |
| default | After all tabs, inside the same `tablist` container, scrolling horizontally with the bar | None |

This is the only slot and it **receives no parameters**. There is no content-area slot — ProTabs renders no content panels.

### TabOption

The element type of `options`:

| Field | Description | Type | Required |
| --- | --- | --- | --- |
| key | Unique tab identifier; using the route path is recommended | `string` | Yes |
| label | Tab text; truncated in the built-in rendering and used for the close button's `aria-label` | `string` | Yes |
| disabled | Disables the tab: neither clicks nor Enter / Space select it, and `tabindex` becomes -1 | `boolean` | No |
| dot | Numeric badge content, requires `showBadge`; `0` renders too | `number` | No |
| icon | This tab's icon name, overriding the component-level `icon`; an empty string falls back to it | `string` | No |
| render | This tab's content-area renderer, higher priority than the component-level `render` | `(option: TabOption) => VNode` | No |

```ts
const options = [
  { label: 'Overview', key: 'overview', icon: 'hugeicons:home-01', dot: 8 },
  { label: 'Details', key: 'detail', dot: 0 },
  { label: 'Archived', key: 'archived', disabled: true },
]
```

> `key` must be a `string` (unlike `ProLayout`'s `MenuOption.key`, which also allows `number`). Convert with `String(key)` when mixing the two. There is no per-tab `closable` field — closing is a component-level switch.

## FAQ

**I click a tab but the highlight does not move?**
Passing `:active` makes it controlled, so the component never changes the selection itself. Use `v-model:active`, or assign the value yourself in `@update:active`.

**Changing `default-active` does nothing?**
It is read once at initialization. To move the selection later, write `active` (controlled) or let the component own it (uncontrolled).

**Closing a tab has no effect?**
`closable` only emits `close(key)`. You own `options`, so you must remove the item in the handler — and decide what gets selected when the active one is closed. See [Adding and removing tabs](#adding-and-removing-tabs).

**Why is the last tab selected after I close the active one?**
That is the uncontrolled fallback rule: when the selected item disappears, the last remaining tab wins. In controlled mode there is no fallback and the choice is yours.

**My tabs load asynchronously — why is nothing highlighted at first?**
The selection is `''` while `options` is empty. Once the data arrives the component selects the first item automatically but **does not emit `update:active`**, so your external variable stays out of sync; use controlled mode if the outside needs to know.

**The fallback rule did not run after `tabs.value.push(...)`?**
The watch is on the array reference, so in-place mutations do not trigger it. Replace the array: `tabs.value = [...tabs.value, newTab]`.

**The badge does not show?**
Both `show-badge` and a `dot` on the option are required. `dot: 0` shows "0"; with `render` in play the badge is not rendered, so draw it yourself.

**The icon does not show?**
`icon` is an `@iconify/vue` icon name (such as `hugeicons:home-01`) and icon data is loaded from Iconify on demand, so offline environments need to provision it themselves. An empty option-level `icon` falls back to the component-level one.

**`rounded` has no effect on `line`?**
`rounded` only applies to `card`. The `line` shape is a bottom border plus an underline, with no rounded container.

**Too many tabs are squeezed together?**
Tabs are `shrink-0` and never compressed; the bar scrolls horizontally when they overflow (with the scrollbar hidden). To pin a tool area to the right, put ProTabs in a `flex-1 min-w-0` container next to it — see [Extending the right side of the tab bar](#extending-the-right-side-of-the-tab-bar).

**The tab bar is still light on a dark page?**
ProTabs does not follow the Naive UI theme. Colors come from CSS variables that the library never defines, so the light fallbacks are used. Provide `--color-fill` and friends from the host — see [Colors and theming](#colors-and-theming).

**`class` cannot change the bar background?**
`class` lands on the root node while the bar background is on a child. Use the CSS variables (you can put them in `style`).

**Why is there no content area?**
ProTabs is a tab bar only, with no content panels. Render the content yourself from `active`, and pair it with `keep-alive` if you need caching.

## Known limitations

ProTabs is deliberately "a configurable tab bar". The following are **out of scope** — plan around them:

| Capability | Notes |
| --- | --- |
| Content panels and caching | No content area and no `keep-alive`; use `NTabs` for an all-in-one wrapper |
| Router integration | No `vue-router` dependency; you maintain the mapping between tabs and routes |
| Arrow-key navigation | Only Tab focus and Enter / Space activation; no Left / Right switching and no Home / End |
| ARIA completeness | `role="tablist"` / `role="tab"` and `aria-selected` are present, but there is no `aria-controls` or `tabpanel` association, and the close button's `aria-label` is the fixed English `close {label}` |
| Badge shapes | Numbers only — no dot-only badge, no `max` overflow and no custom content (draw it with `render`) |
| Per-tab closing | `closable` is a component-level switch; `TabOption` has no `closable` field |
| Add / drag / rename | No built-in add button, drag-to-reorder or double-click rename; add can be done through the `default` slot |
| Size configuration | The 40px bar, 32px card tab, padding and gap are hard-coded; there is no `size` prop |
| Scroll affordance | The scrollbar is hidden and there are no arrow buttons, so overflow has no visual hint |
| `expose` | No instance methods are exposed; write `active` for the selection |
| Type exports | `TabOption` / `ProTabsProps` / `ProTabsEmits` are not exported from the package entry |