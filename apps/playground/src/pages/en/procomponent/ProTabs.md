---
name: ProTabs
desc: ProTabs is a config-driven tabs component with card / line shapes, three sizes, optional cached panels, router integration, editor-grade add / drag / rename, virtual scrolling, async panels, context menus and cross-container dragging, plus full keyboard and ARIA support.
---

<route lang="yaml">
meta:
  layout: default
</route>

# ProTabs

ProTabs is a **configurable tabs component**: describe the tabs with `options`, hold the selection in `active`, get `update:active` on selection and `close` on closing. Beyond the tab bar it can optionally render content panels (with `keepAlive` / `lazy`), integrate with the router, and provide a built-in add button, drag-to-reorder and double-click rename.

This page tracks the repository source.

> **Version note**: the published `0.7.31` package does not include `ProTabs` yet. The component and all its types are exported from the package entry in this repository and become available with the changeset shipped alongside this page.

## Features

- **Config-driven tabs**: an `options` array with `label` + `key`, plus disabled items
- **Two shapes**: `type="card"` (default) or `type="line"` with an underline
- **Three sizes**: `size="small" | "medium" | "large"` controls height, padding, font, icons and badges together
- **Controlled / uncontrolled / routed**: `v-model:active`, internal state or a `route`, resolved as `active > route > internal state`
- **Content panels**: render with the `panel` slot or `renderPanel`, cached through `keepAlive` / `lazy`
- **Complete keyboard and ARIA**: arrow-key cycling, Home / End, roving tabindex, `aria-controls` and a bidirectional `tabpanel` association
- **Badges**: numbers, dots and custom VNodes, with `badgeMax` overflow such as `99+`
- **Per-tab closing**: component-level `closable` overridden by tab-level `closable`, with a localizable close label
- **Editor interactions**: built-in add button, drag-to-reorder (mouse / touch / pen) and double-click rename
- **Scroll affordance**: arrow buttons on overflow (opt-out), with the active tab scrolled into view automatically
- **Virtual scrolling**: `virtual` forces it on or enables it at `virtualThreshold`; only the visible window renders
- **Async panels**: `panelLoader` with built-in loading / error / retry states, results cached per key
- **Context menu**: built-in close current / others / right / all, auto-disabled by availability and localizable
- **Cross-container dragging**: `dragGroup` + `transfer` move tabs between ProTabs instances
- **Route titles**: `routeTitle` creates a temporary tab for routes outside `options`
- **Instance API**: `activeKey`, `scrollTo`, `scrollActive`, `scrollBy`, `focus`, `getEl`, `reloadPanel`
- **Complete types**: `TabOption` / `ProTabsProps` / `ProTabsEmits` and friends exported from the package entry
- **Injectable styles**: `class` / `style` apply to the root; colors come from CSS variables so the host can re-theme them

## When to use

- The content area switches between sibling views and you want tabs and content managed together
- An admin **multi-tab** skeleton: pair it with [ProLayout](/en/procomponent/ProLayout) and let one `active` drive both the tabs and the menu highlight
- Tabs come from a backend API and need dynamic adding, removal, reordering or renaming
- Tabs need to stay in sync with the router, or show counts, dots or custom badges
- You need hundreds of tabs, context menus, or dragging tabs into other containers

## Quick start

### Installation

```script-tabs
@banmao/procomponent
```

### On-demand import

```vue
<script setup>
import { ProTabs } from '@banmao/procomponent'
import type { TabOption } from '@banmao/procomponent'
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

`options` is the tab array and `v-model:active` holds the selected `key`. Without a `panel` slot or `renderPanel` the component renders the tab bar only and you own the content area:

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
</template>
```

Omitting `active` makes it uncontrolled, starting at `defaultActive` or `options[0].key`:

```vue
<ProTabs :options="options" default-active="detail" @update:active="key => console.log(key)" />
```

### With content panels

Providing a `panel` slot makes the component render a panel container below the bar and manage caching through `keepAlive` / `lazy`:

```vue
<template>
  <ProTabs v-model:active="active" :options="options" keep-alive lazy>
    <template #panel="{ option }">
      <component :is="views[option.key]" :key="option.key" />
    </template>
  </ProTabs>
</template>
```

## Core concepts

### Structure

```text
div  ← root: relative w-full flex, flex-col when panels exist; class / style apply here
├── div  ← bar row: relative flex w-full min-w-0
│   ├── div[data-pro-tabs-scroller]  ← flex-1 min-w-0 overflow-x-auto, scrollbar hidden
│   │   └── div[role="tablist"]  ← flex items-center min-w-full w-max + gap + min height
│   │       │                      card: --color-fill background + radius; line: --color-divider bottom border
│   │       │                      px-1 when inset is true, px-0 otherwise
│   │       │                      rendered by VueDraggable when draggable, still role="tablist"
│   │       ├── div[role="tab"] × options.length
│   │       │   ├── content    option.render > props.render > built-in (icon + label + badge)
│   │       │   │              replaced by input.pro-tabs-rename-input while renaming
│   │       │   ├── close btn  rendered when closable (tab-level wins), <button aria-label="{closeLabel} {label}">
│   │       │   └── underline  for an active line tab, absolute bottom-0 h-[2px]
│   │       ├── add button  rendered when addable
│   │       └── default slot content
│   └── left / right scroll buttons  absolute gradient masks when overflowing and scrollButtons is on
└── div  ← panel container: w-full + panelClass (mt-3 by default)
    └── div[role="tabpanel"][id][aria-labelledby] × mounted panels
```

`data-pro-tabs-scroller` is a stable query hook. The scroll buttons live **outside** the scroll container, so they never scroll with the content.

### Sizes

`size` controls the bar and tab dimensions together; the default is `medium`:

| Token | small | medium (default) | large |
| --- | --- | --- | --- |
| Bar min height | 32px | 40px | 48px |
| Card tab height | 28px | 32px | 36px |
| Line tab | fills the bar | fills the bar | fills the bar |
| Horizontal padding | 10px | 12px | 16px |
| Gap | 2px | 4px | 6px |
| Text | 13px | 14px | 15px |
| Icon | 14px | 16px | 18px |
| Close icon | 12px | 14px | 16px |
| Badge | 16px tall / 10px text | 18px tall / 11px text | 20px tall / 12px text |

Tabs are `shrink-0` and **never compressed**; the bar scrolls horizontally on overflow. The 2px radius (fully round with `rounded`) applies to card only.

### Selection model

The selection is `props.active || props.route || innerActive` — **an empty string opt-outs that layer**:

| Usage | Behaviour |
| --- | --- |
| `v-model:active="active"` | Controlled: the highlight always equals the external value; clicks emit `update:active` for you to write back |
| `:active="active"` without the event | The highlight **stays at the passed value**; clicks only emit the event |
| `:route="route.path"` | Route-driven: the highlight follows the route, and `active` can still override it |
| No `active` / `route` | Uncontrolled: the component owns the highlight and emits `update:active` on click |
| No `active` + `default-active` | Uncontrolled, initially selecting `defaultActive` |
| Neither | Uncontrolled, initially selecting `options[0].key`; `''` when `options` is empty |

`defaultActive` is read once at initialization. Clicking a tab **always** writes the internal state first and then emits `update:active`; when a `router` is present it also calls `router.push(key)`.

In uncontrolled mode (no `active`, no `route`), a fallback rule keeps the selection from dangling when `options` changes:

| Case | Result |
| --- | --- |
| The selected item is still in the new `options` | Unchanged |
| The selected item is gone and there was a selection | Falls back to the **last** remaining tab |
| There was no selection yet (async arrival, for example) | Falls back to the **first** item |
| The new `options` is empty | The selection becomes `''` |

Notes:

- The fallback **does not emit `update:active`**; only user clicks / keys do
- The watch is on the **reference** of `options`, so in-place `push` / `splice` does not trigger it — replace the array
- In controlled or routed mode the component does **no fallback**; the external owner decides

### Keyboard navigation

Every tab is `role="tab"` with a roving tabindex: the selected enabled tab is `tabindex=0`, the rest are `-1`, and disabled tabs are always `-1`.

| Key | Behaviour |
| --- | --- |
| `Tab` / `Shift+Tab` | Enter / leave the tab group (stops on the roving tab only) |
| `Enter` / `Space` | Select the focused tab |
| `→` / `←` | Cycle through **enabled** tabs and select, skipping disabled ones |
| `Home` / `End` | Jump to the first / last enabled tab |
| `Alt+→` / `Alt+←` | With `draggable`, move the tab one slot right / left; emits `reorder` only and keeps the selection |

Arrow movement also selects the target tab (emitting `update:active`, plus `push` when a `router` is set) and moves focus to it.

### ARIA and panel association

- The tab container is `role="tablist"`; tabs are `role="tab"` with `aria-selected` and `aria-disabled`
- Tab ids are built from `useId()` and `option.id || option.key`, with characters outside `[a-zA-Z0-9_-]` replaced by `-`
- When panels exist, tabs carry `aria-controls="{uid}-panel-{id}"` and panels carry `role="tabpanel"`, an `id` and `aria-labelledby="{uid}-tab-{id}"`
- The panel container is `tabindex=0`; inactive panels are hidden with `hidden`
- The close button is labeled `aria-label="{closeLabel} {label}"`, e.g. `关闭 概览`; `closeLabel` is localizable
- Scroll buttons have `aria-label` / `title` from `scrollLeftLabel` / `scrollRightLabel`

For stable ids across SSR or tests, pass a tab-level `id` rather than relying on raw `key` characters.

### Content panels

The component considers panels present when any of these is true:

1. A `panel` slot is passed
2. A component-level `renderPanel` is passed
3. Any option has its own `renderPanel`

A single panel resolves as **option-level `renderPanel` > `panel` slot > component-level `renderPanel`**. Slot props are `{ option, active }`.

Caching semantics:

| Configuration | Mounted panels |
| --- | --- |
| `keepAlive=false` (default) | The active option only; unmounted when switched away |
| `keepAlive=true` + `lazy=false` | Every option; inactive ones hidden with `hidden` |
| `keepAlive=true` + `lazy=true` | Every visited option; mounted on first activation |

`lazy` only takes effect with `keepAlive`. The panel container gets `panelClass` (default `mt-3`) and spans `w-full`.

### Badges

Priority: tab-level `badge` > legacy `showBadge + dot`. Three shapes:

| Form | Result |
| --- | --- |
| `badge: 12` | Numeric badge; above `badgeMax` (default 99) it shows `99+` |
| `badge: 0` | Shows `0` (numeric zero is valid) |
| `badge: 'dot'` | An 8px solid dot with no text |
| `badge: option => VNode` | Fully custom; the function receives the `TabOption` |

`badgeMax` sets the component-level default and a tab-level `badgeMax` overrides it. With a custom `render` the built-in badge is not rendered — draw it yourself.

### Adding, removing and per-tab closing

The component **never mutates `options`**; all updates come from outside:

- `addable` renders the built-in add button (`addIcon`, `addLabel`) and only emits `add`
- `closable` renders close buttons and emits `close(key)`; the click uses `stopPropagation`, so closing never also selects
- Tab-level `closable` overrides the component-level one in both directions: set `closable: false` on a tab to pin it while the component is closable, or `closable: true` to enable just that tab when the component is not

```vue
<script setup>
import { ref } from 'vue'
import { ProTabs } from '@banmao/procomponent'

const tabs = ref([
  { label: 'Home', key: '/home', closable: false },
  { label: 'Orders', key: '/orders' },
])
const active = ref('/home')

function closeTab(key) {
  const index = tabs.value.findIndex(tab => tab.key === key)
  if (index === -1) return
  const next = tabs.value.filter(tab => tab.key !== key)
  tabs.value = next
  if (active.value !== key) return
  active.value = next[Math.min(index, next.length - 1)]?.key ?? ''
}
</script>

<template>
  <ProTabs v-model:active="active" :options="tabs" closable @close="closeTab" />
</template>
```

### Add / drag / rename

The three capabilities are independent and can be combined:

- **Add**: `addable` emits `add`; the outside appends the option and decides whether to select it
- **Drag**: `draggable` uses `vue-draggable-next` (Sortable core) and works with mouse, touch and pen; on drop it emits `reorder(keys, from, to)` where `keys` is the full post-drag key order
- **Rename**: `renamable` enters editing on double click; `Enter` or blur commits, `Esc` cancels; `rename(key, label)` is emitted only when the trimmed value is non-empty and differs

Close buttons, the rename input and disabled tabs are excluded from dragging (Sortable `filter`). Clicks within 120ms after a drop are ignored so finishing a drag does not also select.

The component never updates `options`; after `reorder` / `rename` you must write back, otherwise the UI snaps back:

```vue
<script setup>
function onReorder(keys) {
  const map = new Map(tabs.value.map(tab => [tab.key, tab]))
  tabs.value = keys.map(key => map.get(key)).filter(Boolean)
}

function onRename(key, label) {
  tabs.value = tabs.value.map(tab => (tab.key === key ? { ...tab, label } : tab))
}
</script>

<template>
  <ProTabs
    v-model:active="active"
    :options="tabs"
    addable
    draggable
    renamable
    @add="onAdd"
    @reorder="onReorder"
    @rename="onRename"
  />
</template>
```

### Router integration

The component does not depend on `vue-router`; it accepts two structural pieces:

- `route: string` — a non-empty value becomes a selection source (between `active` and internal state)
- `router: { push(to: string): unknown }` — called with `push(key)` when a tab is clicked

A `vue-router` instance satisfies `ProTabsRouter` structurally, so pass it directly:

```vue
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ProTabs } from '@banmao/procomponent'

const route = useRoute()
const router = useRouter()
const tabs = ref([
  { label: 'Home', key: '/home' },
  { label: 'Orders', key: '/orders' },
])
</script>

<template>
  <ProTabs :options="tabs" :route="route.path" :router="router" />
</template>
```

Clicks still emit `update:active`, but the highlight ultimately follows the route, so a failed navigation does not move it. To temporarily override the route selection (a tab for a route that is not registered, for example), pass `active` — it has the highest priority.

### Scrolling and instance API

When the bar overflows, gradient masks and round arrow buttons appear on either side; each click scrolls about 80% of the visible width, and the active tab scrolls into view when it changes. Turn the arrows off with `scrollButtons=false` and localize their names with `scrollLeftLabel` / `scrollRightLabel`.

Call instance methods through a template ref:

| Member | Description |
| --- | --- |
| `activeKey` | The current key (read-only) |
| `scrollTo(target, behavior?)` | Scroll a tab into view by key or index, `smooth` by default |
| `scrollActive(behavior?)` | Scroll the active tab into view |
| `scrollBy(delta)` | Scroll horizontally by a delta; negative goes left |
| `focus()` | Focus the current roving tab |
| `getEl()` | Return the horizontal scroll container `HTMLElement` |

```vue
<script setup>
import { ref } from 'vue'
import type { ProTabsInstance } from '@banmao/procomponent'

const tabsRef = ref<ProTabsInstance>()
</script>

<template>
  <ProTabs ref="tabsRef" :options="tabs" />
  <button @click="tabsRef?.scrollTo('tab-12')">Jump to 12</button>
</template>
```

### Custom rendering

The tab content resolves as **option-level `render` > component-level `render` > built-in rendering**:

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

- The return value replaces the **whole content area** (icon, label and badge are no longer rendered)
- Selection, clicks, keyboard, the close button and the underline stay with the component
- Returning an empty value falls through to the next level
- A component-level `render` applies to every tab, which suits uniform shapes such as "show the key"
- While renaming, the content area is temporarily replaced by an input; after commit the `label` in `options` remains the source of truth

### Colors and theming

ProTabs does **not follow the Naive UI theme**. All colors come from CSS variables with fallbacks:

| CSS variable | Fallback | Used for |
| --- | --- | --- |
| `--color-accent` | `#f04e23` | Active text, badge, dot, underline, rename border |
| `--color-foreground-secondary` | `#57534a` | Inactive text, scroll arrows |
| `--color-foreground` | `#1c1a15` | Hover text of inactive `line` tabs |
| `--color-selected` | `rgba(240,78,35,0.09)` | Background of the active `card` tab |
| `--color-hover` | `rgba(240,78,35,0.05)` | Hover background of inactive `card` tabs |
| `--color-fill` | `#ece8de` | `card` bar background, left / right scroll masks |
| `--color-divider` | `#dfdacc` | `line` bottom border, scroll button border |
| `--color-background` | `#fff` | Starting color of the `line` scroll mask |
| `--color-surface` | `#faf8f3` | Scroll button background |

```css
.dark {
  --color-accent: #ff6a3d;
  --color-fill: #2c2820;
  --color-divider: #322e25;
  --color-surface: #2c2820;
  --color-background: #1c1a15;
  --color-foreground-secondary: #b5b1a2;
}
```

`class` is merged into the root with `tailwind-merge` and `style` is the root inline style. Override internal styles with the variables:

```vue
<ProTabs :options="options" class="my-2" :style="{ '--color-fill': '#2c2820' }" />
```

## Examples

### Basics

<Demo title="Basic usage"
desc="The minimal options + v-model:active setup rendering the bar only; disabled items cannot be selected by click or keyboard."
:raw="BasicTabsRaw">

<BasicTabs />

</Demo>

### Shape

<Demo title="card / line with inset and rounded"
desc="type switches between the card and underline styles; inset adds horizontal padding to the bar and rounded makes the radius fully round — card only."
:raw="TabsTypeRaw">

<TabsType />

</Demo>

### Sizes

<Demo title="small / medium / large"
desc="size adjusts bar height, tab padding, font size, icon and badge dimensions together; all three sizes share one options array."
:raw="TabsSizeRaw">

<TabsSize />

</Demo>

### Content panels

<Demo title="Panels with keepAlive / lazy"
desc="The panel slot renders content; with keepAlive + lazy, visited panels keep their input state while unvisited ones are not mounted early."
:raw="TabsPanelsRaw">

<TabsPanels />

</Demo>

### Badges

<Demo title="Numeric, dot and custom badges"
desc="badge accepts a number, 'dot' or a VNode-returning function; numbers above badgeMax show 99+, and a tab-level badgeMax overrides it."
:raw="TabsBadgeAdvancedRaw">

<TabsBadgeAdvanced />

</Demo>

### Closing tabs

<Demo title="Closable tabs"
desc="Uncontrolled + closable: closing only emits close(key) and the item is removed externally; closing the selected tab falls back to the last remaining one."
:raw="TabsClosableRaw">

<TabsClosable />

</Demo>

### Add, drag and rename

<Demo title="Editor-style tabs"
desc="addable + draggable + renamable combined; the home tab is pinned with tab-level closable=false, and drag / rename results are written back externally."
:raw="TabsEditableRaw">

<TabsEditable />

</Demo>

### Scrolling and instance API

<Demo title="Overflow scrolling with scrollTo"
desc="Fourteen tabs overflow and show the arrow buttons; the template ref calls scrollTo / scrollActive / scrollBy to control the scroll position."
:raw="TabsScrollRaw">

<TabsScroll />

</Demo>

### Custom rendering

<Demo title="Option-level and component-level render"
desc="An option-level render replaces one tab's content area, while a component-level render applies to every tab at a lower priority."
:raw="TabsRenderRaw">

<TabsRender />

</Demo>

### Async data

<Demo title="Tabs arriving asynchronously"
desc="Uncontrolled without default-active: the bar keeps its minimum height while options is empty, and the first item is selected once the data arrives."
:raw="TabsAsyncRaw">

<TabsAsync />

</Demo>

### Router integration

<Demo title="route + router adapter"
desc="route drives the selection and clicks call router.push(key). The demo uses a local stand-in; real projects pass useRouter() directly."
:raw="TabsRouterRaw">

<TabsRouter />

</Demo>

### Virtual scrolling

<Demo title="200 tabs rendered by window"
desc="virtual='auto' turns on once the tab count reaches virtualThreshold; only the window plus virtualOverscan renders, with spacer widths preserving the scrollbar."
:raw="TabsVirtualRaw">

<TabsVirtual />

</Demo>

### Async panels

<Demo title="panelLoader with retry"
desc="The loader runs on first activation and uses the built-in loading / error / retry states. Results cache per key; the unstable source fails once and can be retried."
:raw="TabsAsyncPanelsRaw">

<TabsAsyncPanels />

</Demo>

### Context menu

<Demo title="Close current / others / right / all"
desc="context-menu opens the built-in menu; commands disable themselves by availability and position. The component only emits events and never mutates options."
:raw="TabsContextMenuRaw">

<TabsContextMenu />

</Demo>

### Cross-container dragging

<Demo title="dragGroup + transfer"
desc="Both containers share a drag-group. A cross-column drop makes the target emit transfer, and the demo moves the tab between arrays."
:raw="TabsCrossDragRaw">

<TabsCrossDrag />

</Demo>

### Route title auto-fill

<Demo title="routeTitle and a temporary tab"
desc="When route is outside options, routeTitle generates a non-closable temporary tab and route-enter lets the host persist it."
:raw="TabsRouteTitleRaw">

<TabsRouteTitle />

</Demo>

## Advanced usage

### Multi-tab pages with ProLayout

Drive the tabs and the menu highlight with one `active`:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { MenuOption } from 'naive-ui'
import { ProLayout, ProTabs } from '@banmao/procomponent'

const menus: MenuOption[] = [
  { label: 'Home', key: '/home' },
  { label: 'Table', key: '/table' },
]

const tabs = ref([{ label: 'Home', key: '/home', closable: false }])
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

See [ProLayout - Multi-tab pages](/en/procomponent/ProLayout#multi-tab-pages) for the full explanation.

### Route-driven selection

When the route is the single source of truth, use `route` + `router` instead of `v-model:active`:

```vue
<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
</script>

<template>
  <ProTabs :options="tabs" :route="route.path" :router="router" @close="closeTab" />
</template>
```

For page-level caching, keep using `<keep-alive>` around `<router-view>`; the component's `keepAlive` only affects the panels it renders itself.

### Pinning tools to the right

Both the `default` slot and the add button live inside the scroll container and scroll with the tabs. For a pinned tool area, put ProTabs in a `flex-1 min-w-0` container next to it:

```vue
<template>
  <div class="flex items-center gap-2">
    <div class="flex-1 min-w-0">
      <ProTabs v-model:active="active" :options="tabs" />
    </div>
    <div class="shrink-0"><!-- Pinned tools --></div>
  </div>
</template>
```

The outer `flex-1 min-w-0` is required, otherwise the bar will not shrink and horizontal scrolling stops working.

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| options | Tab array, see [TabOption](#taboption); the watch is on the reference | `TabOption[]` | `[]` |
| active | Selected `key`, controlled, highest priority; an empty string opts out | `string` | `''` |
| defaultActive | Initial selected `key` in uncontrolled mode, read once | `string` | `''` |
| route | Route path; a non-empty value is a selection source (`active > route > internal`) | `string` | `''` |
| router | Router adapter; `push(key)` is called on tab click | `{ push(to: string): unknown }` | - |
| type | Shape: `card` or `line` | `'card' \| 'line'` | `'card'` |
| size | Size tier, see [Sizes](#sizes) | `'small' \| 'medium' \| 'large'` | `'medium'` |
| showBadge | Whether to render the legacy numeric badge, also requiring `dot` | `boolean` | `false` |
| badgeMax | Numeric badge overflow threshold, showing `${max}+` above it | `number` | `99` |
| icon | Component-level default icon (`@iconify/vue`); a tab-level icon wins | `string` | `''` |
| closable | Whether to render close buttons; tab-level `closable` overrides it | `boolean` | `false` |
| closeLabel | Accessibility name prefix for close buttons | `string` | `'关闭'` |
| inset | Whether the bar gets horizontal padding | `boolean` | `false` |
| rounded | Whether the radius is fully round, **card only** | `boolean` | `false` |
| addable | Whether to render the built-in add button | `boolean` | `false` |
| addLabel | Add button text and accessibility name | `string` | `'新增页签'` |
| addIcon | Add button icon (Iconify name) | `string` | `'hugeicons:add-01'` |
| draggable | Whether drag-to-reorder is enabled | `boolean` | `false` |
| renamable | Whether double-click rename is enabled | `boolean` | `false` |
| scrollButtons | Whether to show the scroll buttons on overflow | `boolean` | `true` |
| scrollLeftLabel | Accessibility name of the left scroll button | `string` | `'向左滚动'` |
| scrollRightLabel | Accessibility name of the right scroll button | `string` | `'向右滚动'` |
| keepAlive | Whether to keep mounted panels after switching away | `boolean` | `false` |
| lazy | With `keepAlive`, mount a panel on first activation | `boolean` | `false` |
| panelClass | Extra classes for the panel container | `string` | `'mt-3'` |
| panelLoader | Async panel loader; tab-level wins, ignored when a static render source exists | `(option: TabOption) => Promise<VNode \| VNode[]>` | - |
| panelLoadingText | Loading state text | `string` | `'加载中…'` |
| panelErrorText | Error state text | `string` | `'加载失败'` |
| panelRetryText | Retry button text | `string` | `'重试'` |
| virtual | Virtual scrolling: `true` forces it, `'auto'` enables it at the threshold; dragging is disabled when on | `boolean \| 'auto'` | `false` |
| virtualThreshold | Minimum tab count for `'auto'` | `number` | `100` |
| virtualOverscan | Extra tabs rendered on each side of the visible window | `number` | `3` |
| contextMenu | Whether to enable the built-in context menu | `boolean` | `false` |
| contextMenuLabels | Context menu labels | `{ close?; closeOthers?; closeRight?; closeAll? }` | `{}` |
| dragGroup | Drag group; a string equals `{ name, pull: true, put: true }` | `string \| { name; pull?; put? }` | - |
| routeTitle | Title for a temporary tab when `route` is outside `options` | `string \| ((route: string) => string)` | - |
| render | Component-level tab content renderer, lower priority than a tab-level `render` | `(option: TabOption) => VNode` | - |
| renderPanel | Component-level panel renderer, lowest priority | `(option: TabOption) => VNode` | - |
| class | Classes merged into the root with `tailwind-merge` | `string` | `''` |
| style | Root inline style, usable for CSS variables | `Record<string, any>` | `{}` |

### Events

| Event | Description | Callback |
| --- | --- | --- |
| update:active | Emitted on click, `Enter` / `Space` or arrow-key selection; the internal fallback does **not** emit it | `(key: string) => void` |
| close | Emitted when a close button is clicked; does not mutate `options` and does not select | `(key: string) => void` |
| add | Emitted when the built-in add button is clicked; does not mutate `options` | `() => void` |
| reorder | Emitted after a drag or `Alt+arrow`; does not mutate `options` | `(keys: string[], from: number, to: number) => void` |
| rename | Emitted when a rename commits a changed value; does not mutate `options` | `(key: string, label: string) => void` |
| close-others | Context menu "close others"; does not mutate `options` | `(key: string) => void` |
| close-right | Context menu "close to the right"; does not mutate `options` | `(key: string) => void` |
| close-all | Context menu "close all"; does not mutate `options` | `() => void` |
| transfer | Emitted by the target container on a cross-container drop; the host moves `options` | `(payload: { key; from; to; index }) => void` |
| route-enter | Emitted when `routeTitle` creates a temporary tab; use it to persist the tab | `(route: string, title: string) => void` |
| panel-loaded | `panelLoader` resolved | `(key: string) => void` |
| panel-error | `panelLoader` rejected | `(key: string, error: unknown) => void` |

Write `@update:active`, `@close`, `@add`, `@reorder`, `@rename`, `@close-others`, `@close-right`, `@close-all`, `@transfer`, `@route-enter`, `@panel-loaded` and `@panel-error` in templates. There are no aliases such as `change` or `tab-click`.

### Expose

| Member | Description |
| --- | --- |
| `activeKey` | The current key (read-only) |
| `scrollTo(target, behavior?)` | Scroll a tab into view by key / index, `smooth` by default |
| `scrollActive(behavior?)` | Scroll the active tab into view |
| `scrollBy(delta)` | Scroll horizontally by a delta |
| `focus()` | Focus the current roving tab |
| `getEl()` | Return the horizontal scroll container |
| `reloadPanel(key)` | Re-run the `panelLoader` for a tab |

### Slots

| Name | Description | Slot props |
| --- | --- | --- |
| default | After all tabs and the add button, inside the same `tablist`, scrolling horizontally with the bar | None |
| panel | Content panel; supplying it makes the component render the panel container | `{ option: TabOption, active: boolean }` |
| panel-loading | Override the built-in loading state | `{ option: TabOption }` |
| panel-error | Override the built-in error state | `{ option: TabOption, error: Error, retry: () => void }` |

### TabOption

| Field | Description | Type | Required |
| --- | --- | --- | --- |
| key | Unique tab identifier; using the route path is recommended | `string` | Yes |
| label | Tab text; truncated in the built-in rendering and used in the close label | `string` | Yes |
| disabled | Disabled: click, keyboard and drag all ignore it, `tabindex=-1` | `boolean` | No |
| dot | Legacy numeric badge, requires `showBadge`; ignored when `badge` exists | `number` | No |
| badge | Badge: a number, `'dot'` or a VNode-returning function | `number \| 'dot' \| ((option) => VNode)` | No |
| badgeMax | Numeric threshold for this tab, overriding the component-level `badgeMax` | `number` | No |
| icon | This tab's icon; an empty string falls back to the component-level `icon` | `string` | No |
| closable | Whether to render a close button for this tab, overriding `closable` | `boolean` | No |
| id | Stable identifier for ARIA ids; falls back to `key` | `string` | No |
| render | This tab's content renderer, highest priority | `(option: TabOption) => VNode` | No |
| renderPanel | This tab's panel renderer, highest priority | `(option: TabOption) => VNode` | No |
| panelLoader | This tab's async panel loader, ignored when a static render source exists | `(option: TabOption) => Promise<VNode \| VNode[]>` | No |

```ts
const options = [
  { label: 'Overview', key: 'overview', icon: 'hugeicons:home-01', badge: 8 },
  { label: 'Alarms', key: 'alarm', badge: 'dot' },
  { label: 'Archived', key: 'archived', disabled: true, closable: false },
]
```

> `key` must be a `string` (`ProLayout`'s `MenuOption.key` also allows `number`; convert with `String(key)` when mixing).

### Type exports

```ts
import type {
  ContextMenuCommand,
  PanelLoader,
  ProTabsContextMenuLabels,
  ProTabsDragGroup,
  ProTabsProps,
  ProTabsEmits,
  ProTabsInstance,
  ProTabsSize,
  ProTabsRouter,
  ProTabsTransferPayload,
  TabOption,
  TabBadge,
  VirtualWindow,
} from '@banmao/procomponent'
```

## FAQ

**I click a tab but the highlight does not move?**
Passing `:active` makes it controlled and the component never changes the selection itself; passing `:route` makes the highlight follow the route. Use `v-model:active`, or make sure the navigation actually succeeds.

**Changing `default-active` does nothing?**
It is read once at initialization; afterwards write `active` or let the component own the selection.

**Closing a tab has no effect?**
`closable` only emits `close(key)` — remove the item yourself and decide what gets selected when the active one is closed.

**The order snaps back after dragging?**
The component never mutates `options`; reorder by the emitted `keys` and replace the array.

**The text does not change after renaming?**
Likewise, `rename(key, label)` only emits; update the corresponding `label` outside.

**The add button does nothing?**
`addable` only emits `add`; append the option yourself — the component does not own `options`.

**Panels are not rendered?**
Provide one of: a `panel` slot, a component-level `renderPanel` or an option-level `renderPanel`. `keepAlive` alone does not create panels.

**`lazy` has no effect?**
`lazy` only applies with `keepAlive=true`; with `keepAlive=false` panels unmount on switch anyway.

**Input state is lost after switching back?**
The default is `keepAlive=false`. Turn on `keepAlive`, plus `lazy` if desired, to retain DOM state.

**The scroll arrows never appear?**
They require `scrollWidth > clientWidth`; `scrollButtons=false` disables them completely. Container size changes are tracked with `ResizeObserver`.

**Why does an arrow key skip an item?**
Arrow keys move through **enabled** tabs only; disabled items are excluded from the cycle.

**The close button is read in English?**
Older versions used a fixed `close {label}`; the current version uses `closeLabel` (default Chinese `关闭`) and can be localized.

**The badge does not show?**
The legacy form needs `show-badge` + `dot`; the new form uses `badge` directly. `badge: 0` shows 0 and `'dot'` shows a dot. With a custom `render` the built-in badge is not rendered.

**`rounded` has no effect on `line`?**
`rounded` applies to card only.

**The bar is still light on a dark page?**
Colors come from CSS variables that the library never defines. Provide `--color-fill`, `--color-surface` and friends from the host — see [Colors and theming](#colors-and-theming).

**Dragging does nothing with virtual scrolling on?**
Virtual scrolling and dragging are mutually exclusive; `draggable` is ignored while `virtual` is active, with a one-time dev warning.

**The context menu does not appear?**
Set `context-menu`. It opens on tabs only; you can also focus a tab and press `Shift+F10`.

**The tab did not move after a cross-container drop?**
`transfer` only emits — it never mutates any `options`. In the target's `@transfer`, remove the key from the source array and insert it into the target. Both containers may share one `drag-group`; `from === to` is expected in that case.

**`panelLoader` never runs?**
Any static render source (tab `renderPanel`, the `panel` slot, component `renderPanel`) makes `panelLoader` ignored. With `keepAlive + lazy`, only visited panels load.

**`routeTitle` creates no tab?**
It requires both `route` and `routeTitle`, and only applies when `route` is not in `options`. Once `route-enter` writes the route into `options`, the temporary tab is replaced by the real one.

## Behavior contracts

- The component never owns `options`: closing, reordering, renaming, adding and cross-container moves are all written back by the host.
- Virtual scrolling disables dragging; disable virtualization if hundreds of tabs must stay draggable.
- Panel precedence: tab `renderPanel` → `panel` slot → component `renderPanel` → tab `panelLoader` → component `panelLoader`.
- A temporary `routeTitle` tab is not closable, not draggable, and excluded from close others / right / all.
- The context menu only emits intent; it never mutates `options`, and every close command skips non-closable tabs.
- Cross-container dragging follows `pull` / `put`. The target emits `transfer`; the source no longer emits `reorder`.
