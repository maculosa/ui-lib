---
name: ProLayout
desc: ProLayout is the page skeleton for admin apps — a dark header, a collapsible side menu and a content area, with side / top / mix layouts, header and sidebar customization, a custom footer, built-in content scrolling, controlled menu selection and menu events, remote menu requests, a loading state and an optional mobile drawer menu.
---

<route lang="yaml">
meta:
  layout: default
</route>

# ProLayout

ProLayout is the **layout skeleton** for admin pages: a header bar + menu + content area, with an optional footer. The menu is generated from the `menus` config (passed straight through to Naive UI `NMenu` as `options`). It supports the `side` / `top` / `mix` layouts and the collapsed state can be controlled from outside. The header can be customized with `logo`, `titleRender`, `headerClass` and the `header-extra` slot; the sidebar and content area with `siderClass`, `siderWidth`, `contentClass` and `contentScroll`; the footer content comes from the `footer` slot; menu selection and expansion can be controlled with `menuValue` and `expandedKeys`; and menus can be fetched from the backend through `menu.request`. Pass `mobileBreakpoint` and narrow viewports drop the sidebar and the horizontal menu in favour of a left drawer opened from a header button.

This document tracks the repository source.

> **Version note**: the following are **not implemented** in the published `0.7.31` and need the next release: `logo`, `titleRender`, `headerClass`, `collapsedTriggerPosition`, `layout`, `menu`, the `footer` slot, `siderClass`, `siderWidth`, `contentClass`, `contentScroll`, `menu.params`, `menu.responsive` and the `expose` methods, `menuValue`, `expandedKeys`, `menuClick`, `topMenuClick`, `update:expandedKeys`, and `mobileBreakpoint` (the mobile drawer). The `locale` field of `MenuConfig` has also been **removed** — it was never consumed in `0.7.31`, the library has no i18n yet, and keeping it only misleads; delete it wherever your TypeScript code sets it. Everything else behaves the same as `0.7.31`.

## Features

- **Three layout modes**: `layout="side"` for a left menu, `"top"` for a horizontal header menu, `"mix"` for top-level items in the header plus second-level items in the sidebar
- **Three-part skeleton out of the box**: header (64px) + sidebar (expanded `siderWidth`, 256px by default; configurable collapsed width) + content area, with an optional footer (64px)
- **Config-driven menu**: `menus` is passed through to `NMenu` as `options`, so icons, nested submenus, groups, dividers and disabled items all work
- **Controlled menu**: `menuValue` holds the selected key and `expandedKeys` holds the expanded parents; `menuClick` / `topMenuClick` / `update:expandedKeys` report interactions, so you can bind `route.path` directly for router-aware highlighting
- **Remote menus**: `menu.request` fetches menus on mount, `menu.params` changes re-fetch automatically, with a built-in loading state and an `onLoadingChange` callback
- **Collapsible sidebar**: `collapsedTriggerPosition` decides whether the trigger sits in the header or at the bottom of the sidebar, with a 300ms width transition
- **Externally controlled collapse**: the `collapsed` prop plus the `collapseChange` event, or the `expose` methods
- **Mobile drawer**: pass `mobileBreakpoint` and narrow viewports hide the sidebar and the horizontal menu, show a hamburger button in the header, and open a left drawer holding the full nested menu; off by default, so omitting it behaves exactly like the previous version
- **Customizable header**: `logo` image, `titleRender` custom title, `headerClass` to override header styles, and the `header-extra` slot
- **Customizable sidebar and content area**: `siderClass` for the sidebar color, `siderWidth` for the expanded width, `contentClass` to override the content padding, `contentScroll` for built-in scrolling
- **Custom footer**: the `footer` switch plus the `footer` slot, spanning the full layout width
- **Horizontal menu overflow**: `menu.responsive` collapses items that do not fit into a "more" submenu under `top` / `mix`
- **Independent menu scrolling**: the sidebar wraps `NScrollbar`, so long menus scroll on their own
- **Injectable styles**: `class` / `style` apply to the root node; `class`, `headerClass`, `siderClass` and `contentClass` are merged with `tailwind-merge`, so they can override the built-in classes

## When to use

- The **overall page skeleton** of an admin system: one header + one navigation menu + one content container
- Projects that need to switch between side / top / mixed navigation
- Menus that come from a backend API and need a loading state or re-fetching by query conditions
- Projects that need the menu highlight to follow the router, or menu clicks to drive the content area
- Projects where one skeleton has to serve both desktop and narrow viewports (tablet / phone)
- Projects that need a collapsible navigation prototype quickly

The current version is **not a good fit** for the following — compose `NLayout` / `NMenu` / `NDrawer` yourself instead:

- Putting anything other than the menu inside the mobile drawer (the drawer only renders `menus` and has no slot)
- Built-in multi-tab pages and tab state management (pair it with `ProTabs` yourself, see [Multi-tab pages](#multi-tab-pages))

## Quick start

### Installation

```script-tabs
@banmao/procomponent
```

### On-demand import

```vue
<script setup>
import { ProLayout } from '@banmao/procomponent'
</script>
```

### Global registration

```ts
import { createApp } from 'vue'
import { ProLayoutPlugin } from '@banmao/procomponent'
import App from './App.vue'

createApp(App).use(ProLayoutPlugin).mount('#app')
```

### Basic usage

`title` is the header title, `menus` is the menu config, and the default slot is the content area. **The root node has no default height** — set one with `style` or `class`. The content area does not scroll by default, so long pages need the wrapper below, or `content-scroll` instead (see [Content scrolling](#content-scrolling)).

```vue
<template>
  <ProLayout title="Banmao Admin" :menus="menus" :style="{ height: '100vh' }">
    <!-- The content area does not scroll on its own; long pages need this wrapper -->
    <div class="h-full overflow-auto">
      <router-view />
    </div>
  </ProLayout>
</template>

<script setup>
import { ProLayout } from '@banmao/procomponent'

const menus = [
  { label: 'Home', key: '/home' },
  { label: 'Table', key: '/table' },
  {
    label: 'System',
    key: '/system',
    children: [
      { label: 'Users', key: '/system/user' },
      { label: 'Roles', key: '/system/role' },
    ],
  },
]
</script>
```

### Menu colors

The header and sidebar backgrounds are fixed to `bg-zinc-800` (`#27272a`), but the inner `NMenu` follows the **global Naive UI theme**. Under a light theme the menu text uses `textColor2` (a dark color), which gives only about **1.9:1** contrast on the dark sidebar — practically unreadable.

The fix is to wrap ProLayout in a dark `NConfigProvider`:

```vue
<script setup>
import { NConfigProvider, darkTheme } from 'naive-ui'
import { ProLayout } from '@banmao/procomponent'

// Override the text colors so they do not inherit the outer light theme's textColor
const layoutTheme = {
  common: { textColor1: '#fafafa', textColor2: '#d4d4d8', textColor3: '#a1a1aa' },
}
</script>

<template>
  <!-- abstract keeps the Provider from adding DOM, so height: 100% still works -->
  <NConfigProvider abstract :theme="darkTheme" :theme-overrides="layoutTheme">
    <ProLayout title="Banmao Admin" :menus="menus" :style="{ height: '100vh' }">
      <div class="h-full overflow-auto">
        <router-view />
      </div>
    </ProLayout>
  </NConfigProvider>
</template>
```

With that in place the menu text contrast is about **10:1**, which meets WCAG AA. Every demo on this page uses this pattern. If you must keep the global light theme, see [Advanced usage - Changing only the menu colors](#changing-only-the-menu-colors).

## Core concepts

### Layout structure

```text
div  ← root: w-full flex flex-col + class prop; the style prop applies here
├── header  ← p-4 h-16 flex items-center bg-zinc-800 + headerClass (fixed 64px)
│   ├── drawer trigger rendered first on narrow viewports, opens the drawer on click
│   ├── logo           rendered as <img class="h-8 w-auto mr-2"> when logo has a value
│   ├── title          titleRender wins, otherwise plain text-white text-lg font-bold
│   ├── horizontal menu rendered when not narrow and layout is top / mix, flex-1 min-w-0 mx-4, menu.responsive controls overflow
│   ├── header-extra   slot (rendered on narrow viewports too)
│   └── collapse trigger rendered when not narrow, collapsedTriggerPosition="top" and layout is not top
├── main    ← flex flex-1 min-h-0 overflow-hidden
│   ├── aside   ← rendered when not narrow; bg-zinc-800 + siderClass, siderWidth expanded / menu.collapsedWidth collapsed, 300ms transition
│   │   ├── NScrollbar → NMenu (side: menus; mix: children of the active top-level item)
│   │   └── collapse trigger ← rendered for collapsedTriggerPosition="bottom", pinned with mt-auto
│   └── section ← flex-1 p-4 + contentClass, the default slot renders here
│                 with contentScroll it gains flex flex-col min-h-0 and wraps an inner NScrollbar
├── footer  ← rendered when footer is true, p-4 h-16, content from the footer slot, defaulting to Footer
└── NDrawer ← rendered on narrow viewports, placement="left", width from siderWidth, inner bg-zinc-800 + siderClass
              → NScrollbar → NMenu (the full menus, unaffected by layout and collapsed)
              NDrawer teleports to body, so it is not inside the root node's DOM subtree
```

Dimensions and defaults:

| Part | Default | Notes |
| --- | --- | --- |
| Header height | 64px | `h-16`, can be overridden with `headerClass` |
| Sidebar width (expanded) | 256px | `siderWidth`; inline style, so classes cannot override it |
| Sidebar width (collapsed) | 64px | `menu.collapsedWidth`, applies to both the sidebar and `NMenu` |
| Drawer width (narrow) | 256px | Taken from `siderWidth`, **not** from `menu.collapsedWidth` |
| Collapsed icon size | 22px | `menu.collapsedIconSize` |
| Menu item height | 42px | `NMenu` theme default, override with `Menu.itemHeight` |
| Content padding | 16px | `p-4`, can be overridden with `contentClass` |
| Footer height | 64px | `h-16`, not configurable |

### Layout modes

`layout` decides where the menu goes. All three modes share the same `menus`:

| Mode | Header | Sidebar | Collapse trigger |
| --- | --- | --- | --- |
| `side` (default) | logo + title + header-extra | Full `menus`, collapsible | Per `collapsedTriggerPosition` |
| `top` | logo + title + full horizontal `menus` + header-extra | Not rendered | Not rendered (no sidebar to collapse) |
| `mix` | logo + title + horizontal top-level menu + header-extra | `children` of the active top-level item | Per `collapsedTriggerPosition` |

How `mix` links the two menus:

- The header renders only top-level items, with `children` stripped; `type: 'group'` keeps its group title, and items inside the group are stripped to top level as well
- An internal "active top-level item" state starts at the **first top-level item that has children**, falling back to the first item when none do; items inside a group count as top-level candidates, while the group title itself is not clickable and never selected
- Clicking a top-level item in the header swaps the sidebar content; when the active item has no `children`, **the sidebar is not rendered at all** and the content area takes the full width
- The "active top-level item" of the horizontal header menu is kept internally; when `menuValue` is passed in, the component **derives** the top-level item that owns it and switches both menus together
- Clicking a top-level item only swaps the sidebar and emits `topMenuClick` — it **never writes** `menuValue`; only sidebar clicks write `menuValue`. See [Menu and selection state](#menu-and-selection-state)

> The horizontal menu in `top` / `mix` does not enable `responsive` by default, so too many items overflow instead of collapsing into a "more" menu. Pass `menu.responsive = true` to enable it — see [MenuConfig](#menuconfig).

> On narrow viewports all three layouts converge on "header + content area + drawer", and `layout` no longer affects where the menu goes — see [Mobile drawer](#mobile-drawer).

### Height model

The root is `w-full flex flex-col` and **has no height of its own**; `main` uses `flex-1 min-h-0` to take the remaining space. So:

| Setting | Effect |
| --- | --- |
| No height set | Height is driven by content, sidebar menu scrolling stops working, the footer sits right below the content |
| `:style="{ height: '100vh' }"` | Full-screen skeleton, the most common choice |
| `:style="{ height: '600px' }"` | Fixed-height skeleton, good for embedding in docs or a page region |
| Fixed-height parent + `:style="{ height: '100%' }"` | Fills the parent; no `height: auto` wrapper anywhere in the parent chain |
| `class="h-screen"` | Equivalent to `100vh`, expressed as a Tailwind class |

> When using `height: 100%`, remember that any wrapper `div` with `height: auto` (including a non-`abstract` `NConfigProvider`) breaks the percentage height.

### Content scrolling

`main` is `overflow-hidden`, and the content `section` only has `flex-1 p-4` by default — **it does not scroll**. Content taller than the layout is simply clipped: it neither scrolls nor stays visible. Two ways to fix that:

**Enable `content-scroll`**, so the component wraps an inner `NScrollbar` (the `section` also gains `flex flex-col min-h-0`):

```vue
<ProLayout :menus="menus" content-scroll :style="{ height: '100vh' }">
  <!-- Long content goes straight here, no extra wrapper needed -->
</ProLayout>
```

**Or provide your own scrolling container**, leaving `content-scroll` at its default `false`:

```vue
<ProLayout :menus="menus" :style="{ height: '100vh' }">
  <div class="h-full overflow-auto">
    <!-- Long content goes here -->
  </div>
</ProLayout>
```

Do not stack the two: `content-scroll` already provides a scroll container, so adding another `h-full overflow-auto` gives you double scrollbars. When the content area holds a `ProTable` with `auto-flex`, you usually do not need `content-scroll` either — the table manages its own height and scrolling.

The sidebar menu always wraps `NScrollbar`, so overflowing items scroll automatically with no extra work.

### Menu and selection state

`menus` is used directly as `NMenu`'s `options`, so the whole `NMenu` option shape is available (see [MenuOption](#menuoption)). Both selection and expansion can be controlled:

| Prop / event | Purpose |
| --- | --- |
| `menuValue` | Key of the selected menu item; supports `v-model:menu-value` |
| `update:menuValue` | Emits the new key when a menu item is clicked |
| `expandedKeys` | Array of expanded parent keys; supports `v-model:expanded-keys` |
| `update:expandedKeys` | Emits the new array when a submenu opens or closes; also the only expansion event |
| `menuClick` | Emits `(key, item)` when a menu item is clicked — the `side` sidebar, the `top` horizontal menu and the `mix` sidebar all use it |
| `topMenuClick` | `mix` only: emits `(key, item)` when a top-level header item is clicked; `item` keeps its full `children` |

**Without `menuValue` the menu is uncontrolled**: `NMenu` keeps the highlight itself, clicks still highlight automatically, and `menuClick` / `update:menuValue` are still emitted — the outside just does not own that state. `expandedKeys` works the same way: leave it out and `NMenu` opens and closes submenus on its own.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ProLayout } from '@banmao/procomponent'

const menuValue = ref('/home')
const expandedKeys = ref<string[]>(['/system'])
</script>

<template>
  <ProLayout
    v-model:menu-value="menuValue"
    v-model:expanded-keys="expandedKeys"
    :menus="menus"
    :style="{ height: '100vh' }"
    @menu-click="(key, item) => console.log(key, item)"
  />
</template>
```

Two things to keep in mind once controlled:

- **A highlight inside a collapsed submenu is invisible**: `menuValue` only decides the highlight, it never expands parents. When the router lands on a deep page, put the ancestor keys into `expandedKeys` as well
- **`props.onClick` still does not work**: `NMenu` only reads menu-level `nodeProps`, so an option's `props` never reach the DOM. Use `menuClick` for extra click behavior, or write `label` as a render function

`mix` uses a **single source of value**:

- The selection of top-level header items is kept internally; clicking one only switches the level and emits `topMenuClick`, and **never writes** `menuValue` — otherwise a header click would overwrite the selection with a top-level key and the sidebar highlight would be lost
- Only sidebar clicks write `menuValue` (and emit `menuClick`)
- When `menuValue` changes from outside (a route change, for example), the component searches `menus` recursively for the top-level item that owns it and switches to it; if no owner is found, the active top-level item stays as it is
- When a top-level item has no `children` of its own, clicking it only emits `topMenuClick`; to treat it as a selected page, write `menuValue` yourself in that handler

### Collapsed state

The collapsed state is a semi-controlled model — internal state plus external sync:

- Internal `currentCollapsed` starts at `props.collapsed ?? props.menu?.collapsed ?? false`
- `watch(props.collapsed)`: external changes sync into the internal state; `undefined` does not overwrite it
- Clicking the trigger flips the internal state and emits `collapseChange`, but **does not** write back to `collapsed`

So it **does not support `v-model:collapsed`**. The correct pattern is one-way binding plus writing back from the event:

```vue
<ProLayout
  :collapsed="collapsed"
  :menus="menus"
  @collapse-change="value => (collapsed = value)"
/>
```

`menu.collapsed` is only an **initial value**: when the root `collapsed` is passed explicitly it wins, and later changes to `menu.collapsed` no longer sync into the internal state.

You can also call the exposed `setCollapsed(value)` / `toggleCollapsed()`. They take the same path as clicking the trigger and emit `collapseChange` too — see [Expose](#expose).

The trigger position comes from `collapsedTriggerPosition`, and **only one trigger is rendered at a time**:

| Value | Trigger position |
| --- | --- |
| `'bottom'` (default) | Bottom of the sidebar |
| `'top'` | Right of the header title |

`layout="top"` has no sidebar, so neither value renders a trigger.

> **Behavior change**: in `0.7.31` the header and sidebar-bottom triggers were always rendered together. Now only the sidebar-bottom one is kept by default. Pass `collapsed-trigger-position="top"` explicitly if you want the header trigger.

### Mobile drawer

Pass `mobileBreakpoint` (in px) to enable narrow-viewport adaptation. **It defaults to `undefined`, i.e. off**: without it the component uses a media query that never matches, so the DOM and the behaviour are identical to the previous version and upgrading causes no regression.

```vue
<ProLayout :menus="menus" :mobile-breakpoint="768" :style="{ height: '100vh' }">
  <div class="h-full overflow-auto">
    <router-view />
  </div>
</ProLayout>
```

The test is based on **viewport width** (`matchMedia('(max-width: Npx)')`, inclusive), not container width:

| Viewport width | Shape |
| --- | --- |
| `> mobileBreakpoint` | Desktop shape: sidebar / horizontal menu per `layout` |
| `≤ mobileBreakpoint` | Narrow shape: neither the sidebar nor the horizontal menu renders, and a hamburger button appears at the far left of the header |

What exactly changes on narrow viewports:

- **The drawer always holds the full `menus`**: all three `layout` values are treated alike, and `mix` also gets the complete nested menu instead of the active top-level item's children — there is no header top-level menu to click on a narrow viewport, so trimming would make everything below the second level unreachable
- **The collapsed state is ignored**: the `NMenu` inside the drawer always renders at expanded width, `collapsed` / `menu.collapsed` / `menu.collapsedWidth` take no part, and neither collapse trigger renders; the collapsed state is restored as-is once the viewport widens again
- **Width and colors reuse the sidebar config**: the drawer width comes from `siderWidth` (**not** `menu.collapsedWidth`), and the inner background is the same `bg-zinc-800` + `siderClass`, so the [Light sidebar](#light-sidebar) recipe works on narrow viewports too
- **`header-extra` and `footer` still render**, and the content `section` takes the full row width
- **Selecting closes it**: clicking a leaf item emits `update:menuValue` / `menuClick` first and then closes the drawer; clicking a parent only expands the submenu (emitting `update:expandedKeys`) and keeps the drawer open
- **Clicking the mask or pressing Esc also closes it** (default `NDrawer` behaviour), and the drawer closes automatically when the viewport widens past the breakpoint
- The drawer content uses `NDrawer`'s default `display-directive="if"`, so it is **not rendered while closed** and never exists twice alongside the sidebar menu

Although the drawer teleports to `body`, it stays inside the Vue component tree, so an outer `NConfigProvider abstract :theme="darkTheme"` still injects its theme and the menu text does not fall back to light colors.

> The drawer has **no slot** and can only hold the menu. For user info, a search box and similar content, compose `NDrawer` yourself or put them in `header-extra`.

> The media query is viewport-level, so `mobileBreakpoint` only makes sense for a full-page layout. Embedding ProLayout in a narrow container (a documentation demo card, for example) does **not** trigger the narrow shape; to demo it, narrow the browser window or temporarily set the breakpoint above the current viewport width.

### Remote menus and loading state

`menu.request` is called when the component mounts, with the signature `(params, defaultMenuData) => Promise<MenuOption[]>`:

- `params` comes from `menu.params`, or `{}` when it is absent
- `defaultMenuData` is the array passed via the `menus` prop, or `[]` when it is absent
- The return value **replaces the menu entirely**; on failure it logs `console.error` and falls back to `menus`

There are four re-fetch triggers: mount, a change to the `menus` array reference, a change to `menu.params` (deep-watched, so in-place edits count), and calling the exposed `reloadMenus()`. Changing only the `menu.request` function does not re-fetch.

When `params` changes rapidly several requests can be in flight; only the **last** one is allowed to land, so a stale response cannot overwrite newer menus.

The loading state is the union of two sources: `menu.loading` being `true`, or a `request` in flight. While loading, the menu area renders `NSpin`, and the sidebar width and overall layout stay unchanged.

`menu.onLoadingChange` fires once on each flip of the **internal request state** (`true` → `false`); it is not triggered by changes to the `menu.loading` prop.

## Examples

> Except for "Sidebar color, width and content padding", which switches to `lightTheme`, every demo is wrapped in `NConfigProvider abstract :theme="darkTheme"` — see [Menu colors](#menu-colors) for why. Keep that wrapper when you copy the code, otherwise the menu text is unreadable under a light theme. The demos are shared with the Chinese page, so the labels inside them are in Chinese.

### Basics

<Demo title="Base layout"
desc="The minimal skeleton built from title + menus + the default slot: header title, a sidebar with icons and submenus, and the content area on the right."
:raw="BaseLayoutRaw">

<BaseLayout />

</Demo>

<Demo title="Collapse control"
desc="An external button writes collapsed and the internal trigger writes back through collapseChange; you can also call the exposed setCollapsed / toggleCollapsed (not v-model)."
:raw="CollapsedControlRaw">

<CollapsedControl />

</Demo>

<Demo title="Custom class and style"
desc="class is appended to the root for rounded clipping, and style uses height: 100% to fill a fixed-height parent."
:raw="CustomStyleRaw">

<CustomStyle />

</Demo>

### Layout modes

<Demo title="side / top / mix layouts"
desc="The same menus under all three layouts. In mix mode, clicking a top-level header item swaps the sidebar; with no children the sidebar is not rendered."
:raw="LayoutModeRaw">

<LayoutMode />

</Demo>

<Demo title="Collapse trigger position"
desc="collapsedTriggerPosition decides whether the single trigger renders at the bottom of the sidebar or in the header; the default is bottom."
:raw="TriggerPositionRaw">

<TriggerPosition />

</Demo>

<Demo title="Horizontal menu overflow"
desc="With layout=top and many items, menu.responsive lets NMenu collapse whatever does not fit into a trailing more submenu, based on the available width."
:raw="MenuResponsiveRaw">

<MenuResponsive />

</Demo>

### Header and footer

<Demo title="logo, custom title and header color"
desc="logo renders left of the title, titleRender takes over the whole title node, and headerClass overrides the built-in bg-zinc-800 through tailwind-merge."
:raw="HeaderCustomRaw">

<HeaderCustom />

</Demo>

<Demo title="Header extra slot"
desc="header-extra renders right of the title and left of the collapse trigger; flex-1 pushes the user area to the right."
:raw="HeaderExtraRaw">

<HeaderExtra />

</Demo>

<Demo title="Footer and the footer slot"
desc="footer is a boolean switch; when on, a 64px footer appears at the bottom. Without a slot the text is Footer; with the footer slot the content is yours and spans the full layout width."
:raw="FooterLayoutRaw">

<FooterLayout />

</Demo>

### Sidebar and content area

<Demo title="Sidebar color, width and content padding"
desc="siderClass overrides bg-zinc-800 through tailwind-merge for a light sidebar (the menu theme must switch too), siderWidth changes the expanded width, and contentClass overrides the content p-4."
:raw="SiderStyleRaw">

<SiderStyle />

</Demo>

### Menu

<Demo title="Menu options"
desc="Groups (type: 'group'), dividers (type: 'divider'), nested children, disabled items and extra content."
:raw="MenuOptionsRaw">

<MenuOptions />

</Demo>

<Demo title="Menu and content linkage"
desc="v-model:menu-value owns the selection; clicking a menu item writes back through update:menuValue and the content area follows — no onClick inside label needed."
:raw="MenuNavigateRaw">

<MenuNavigate />

</Demo>

<Demo title="Controlled selection and expansion"
desc="menuValue decides the highlight and expandedKeys decides which parents are open, both owned outside; external buttons can select a deep item directly, while menuClick and update:expandedKeys log the interactions."
:raw="MenuControlledRaw">

<MenuControlled />

</Demo>

<Demo title="Controlled mix and top-level derivation"
desc="A single source of value: header clicks only switch the top level and emit topMenuClick, sidebar clicks write menuValue; changing menuValue from outside derives the owning top-level item and switches both menus."
:raw="MenuMixControlledRaw">

<MenuMixControlled />

</Demo>

<Demo title="menu config"
desc="menu.collapsed sets the initial collapsed state, collapsedWidth controls both the sidebar and the NMenu collapsed width, collapsedIconSize controls the icon size, and loading shows the loading state."
:raw="MenuConfigRaw">

<MenuConfig />

</Demo>

<Demo title="Remote menu request"
desc="menu.request runs on mount and receives the local menus as its second argument; the loading state shows while it runs, and onLoadingChange logs true → false."
:raw="MenuRequestRaw">

<MenuRequest />

</Demo>

<Demo title="Menu query params and manual reload"
desc="Changes to menu.params (including in-place edits) re-run request and are passed through as its first argument; you can also call the exposed reloadMenus() to fetch again."
:raw="MenuParamsRaw">

<MenuParams />

</Demo>

### Scrolling

<Demo title="Built-in content scrolling"
desc="With content-scroll on, the inner NScrollbar handles content scrolling and no hand-written h-full overflow-auto is needed; with it off, the overflow is clipped."
:raw="ContentScrollRaw">

<ContentScroll />

</Demo>

<Demo title="Long menu and long content"
desc="The sidebar menu scrolls automatically through the built-in NScrollbar; without content-scroll the content area needs its own h-full overflow-auto wrapper, otherwise the overflow is clipped."
:raw="ScrollAreaRaw">

<ScrollArea />

</Demo>

### Mobile

<Demo title="Mobile drawer menu"
desc="mobileBreakpoint switches shape by viewport width: on narrow viewports neither the aside nor the horizontal menu renders, a header hamburger opens the left drawer, the drawer always holds the full nested menus, and clicking a leaf closes it. The breakpoint is viewport-level, so use “simulate narrow” to raise it above the current viewport."
:raw="MobileDrawerRaw">

<MobileDrawer />

</Demo>

### Multi-tab composition

<Demo title="ProLayout + ProTabs multi-tab pages"
desc="menuClick opens a tab and active drives both the tabs and the menu highlight (a single value source); the close event is handled by removing the item from options externally. Closing the active tab falls back to a neighbour, and closing them all shows an empty state."
:raw="MultiTabsRaw">

<MultiTabs />

</Demo>

## Advanced usage

### Linking menus to the router

ProLayout does not depend on `vue-router`: bind `route.path` to `menuValue` and call `router.push` in `menuClick`, and the two stay in sync — highlights survive refreshes and direct visits to child routes.

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ProLayout } from '@banmao/procomponent'

const route = useRoute()
const router = useRouter()

// Menu keys are route paths, so the selection follows the router
const menuValue = computed(() => route.path)

// Deep routes need their ancestors expanded, otherwise the highlight hides inside a collapsed submenu
const expandedKeys = computed(() => {
  const segments = route.path.split('/').filter(Boolean)
  return segments.slice(0, -1).map((_, i) => `/${segments.slice(0, i + 1).join('/')}`)
})

function handleMenuClick(key: string | number) {
  router.push(String(key))
}
</script>

<template>
  <ProLayout
    :menus="menus"
    :menu-value="menuValue"
    :expanded-keys="expandedKeys"
    :style="{ height: '100vh' }"
    content-scroll
    @menu-click="handleMenuClick"
  >
    <router-view />
  </ProLayout>
</template>
```

This uses `:menu-value` rather than `v-model`: the router is the single source of the selection, menu clicks only navigate, and the route change flows back into the highlight — so two copies of the state never overwrite each other.

Under `mix`, top-level header items usually do not map to real routes: clicking one only emits `topMenuClick` (to swap the sidebar), while sidebar clicks go through `menuClick` to navigate. If a top-level item is itself a page, call `router.push` yourself inside `topMenuClick`.

> You can still render `RouterLink` inside `label`, but then you have to maintain the selection from `route.path` yourself — binding `menuValue` is simpler.

### Multi-tab pages

ProLayout has no built-in tabs, but pairing it with [ProTabs](/en/procomponent/ProTabs) gives you the "click a menu item to open a tab, switch tabs to swap content" skeleton. The key is to **keep a single `active`**: it is both the active ProTabs key and ProLayout's `menuValue`, so the menu highlight follows the current tab naturally and no two pieces of state overwrite each other.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { MenuOption } from 'naive-ui'
import { ProLayout, ProTabs } from '@banmao/procomponent'

const menus: MenuOption[] = [
  { label: 'Home', key: '/home' },
  { label: 'Table', key: '/table' },
  { label: 'Users', key: '/user' },
]

const tabs = ref([{ label: 'Home', key: '/home' }])
const active = ref('/home')

// Menu click: open a new tab if there is none, otherwise switch to it
function openTab(key: string | number, item: MenuOption) {
  const tabKey = String(key)
  if (!tabs.value.some(tab => tab.key === tabKey)) {
    tabs.value = [...tabs.value, { label: String(item.label ?? tabKey), key: tabKey }]
  }
  active.value = tabKey
}

// Closing a tab: ProTabs only emits the event, removing the item is up to you
function closeTab(key: string) {
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

A few things to note:

- **Use `:menu-value`, not `v-model:menu-value`**: `active` is the single source, menu clicks only open a tab and write `active`, so there is no need to listen for `update:menuValue` as well
- **`content-class="p-0"`**: the tab bar should sit flush against the content area edges, and the default `p-4` would leave whitespace all around it; padding is then controlled by the tab bar wrapper and the content container separately
- **`h-full flex flex-col min-h-0` is required**: the tab bar takes a fixed height and the content area needs `flex-1 min-h-0 overflow-auto` to scroll correctly
- **ProTabs renders only the tab bar**; the content area is entirely yours. `closable` only emits `close(key)` and does **not** remove the item from `options` itself
- With a router, keep `active` as a `ref`: call `router.push` in `openTab` and in ProTabs' `update:active`, then use `watch(route)` to sync `active` and the tab list back (so refreshes and deep links get their tab). Do not turn it into a read-only `computed` — `v-model:active` needs to be writable

### Remote menu data

Prefer `menu.request`, which comes with a loading state:

```vue
<script setup lang="ts">
import type { MenuOption } from 'naive-ui'
import { ProLayout } from '@banmao/procomponent'

const menu = {
  request: async (_params: unknown, defaultMenuData: MenuOption[]) => {
    const list = await fetchUserMenus()
    return list.map(item => ({
      key: item.path,
      label: item.name,
      children: item.children?.map(child => ({ key: child.path, label: child.name })),
    }))
  },
  onLoadingChange: (loading: boolean) => console.log('menu loading:', loading),
}
</script>

<template>
  <ProLayout :menu="menu" :menus="fallbackMenus" :style="{ height: '100vh' }">
    <div class="h-full overflow-auto">
      <router-view />
    </div>
  </ProLayout>
</template>
```

Here `menus` acts as `defaultMenuData` (the local data handed to the request function). On success the menu is replaced entirely by the return value; on failure it falls back to `menus`.

You can also fetch the data yourself and assign it to `menus`. It is passed through reactively, so **replacing the whole array updates the menu immediately**:

```ts
import { ref, onMounted } from 'vue'
import type { MenuOption } from 'naive-ui'

const menus = ref<MenuOption[]>([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const list = await fetchUserMenus()
    menus.value = list.map(item => ({
      key: item.path,
      label: item.name,
      children: item.children?.map(child => ({ key: child.path, label: child.name })),
    }))
  } finally {
    loading.value = false
  }
})
```

Bind `:menu="{ loading }"` with this pattern to reuse the component's built-in menu loading state.

### Custom footer

Enable `footer` and provide the `footer` slot to take over the content; the footer spans the full layout width (including below the sidebar):

```vue
<template>
  <ProLayout :menus="menus" footer :style="{ height: '100vh' }">
    <div class="h-full overflow-auto">
      <router-view />
    </div>

    <template #footer>
      <div class="flex w-full items-center justify-between text-xs opacity-60">
        <span>© 2026 Banmao · Internal admin</span>
        <span>Help center</span>
      </div>
    </template>
  </ProLayout>
</template>
```

The footer height is fixed at 64px (`h-16`) and there is no `footerClass`. For a different height, turn `footer` off and lay out a column inside the content area instead:

```vue
<template>
  <ProLayout :menus="menus" :style="{ height: '100vh' }">
    <div class="h-full flex flex-col">
      <div class="flex-1 overflow-auto">
        <router-view />
      </div>
      <footer class="h-12 flex items-center justify-center text-xs opacity-60">
        © 2026 Banmao · Internal admin
      </footer>
    </div>
  </ProLayout>
</template>
```

With that approach the footer only spans the content area, and the sidebar runs all the way down.

### Changing only the menu colors

When you must keep the global light theme, override just the `Menu` theme variables and leave `common` alone:

```ts
const themeOverrides = {
  Menu: {
    itemTextColor: '#d4d4d8',
    itemTextColorHover: '#ffffff',
    itemIconColor: '#d4d4d8',
    itemIconColorHover: '#ffffff',
    itemIconColorCollapsed: '#d4d4d8',
    arrowColor: '#d4d4d8',
    arrowColorHover: '#ffffff',
    groupTextColor: '#a1a1aa',
    itemColorHover: 'rgba(255, 255, 255, 0.06)',
  },
}
```

```vue
<NConfigProvider abstract :theme-overrides="themeOverrides">
  <ProLayout :menus="menus" />
</NConfigProvider>
```

The selected state and the active submenu state still use `primaryColor`, which stays readable on the dark sidebar. The submenu panel that pops out when collapsed belongs to `Dropdown`/`Tooltip` and stays light under a light theme; if you need to cover that too, use `darkTheme` directly.

### Light sidebar

`siderClass` is merged with `tailwind-merge`, so it can override the built-in `bg-zinc-800`. But the sidebar color and the menu theme are two separate things: after turning the sidebar white you must also switch `NMenu` to a light theme, otherwise light text on a white background is unreadable.

```vue
<script setup>
import { NConfigProvider, lightTheme } from 'naive-ui'
import { ProLayout } from '@banmao/procomponent'
</script>

<template>
  <NConfigProvider abstract :theme="lightTheme">
    <ProLayout
      :menus="menus"
      sider-class="bg-white border-r border-zinc-200"
      :sider-width="240"
      :style="{ height: '100vh' }"
    >
      <div class="h-full overflow-auto">
        <router-view />
      </div>
    </ProLayout>
  </NConfigProvider>
</template>
```

The header stays dark (its title is `text-white`). To lighten it as well, add `header-class="bg-white border-b border-zinc-200"` and use `titleRender` for a dark title — the built-in title hard-codes `text-white`, so `titleRender` is the most direct route.

> The sidebar width is an inline style, so `w-60` inside `sider-class` has no effect. Use the `sider-width` prop.

### Combining with ProTable

When the content area holds a `ProTable`, use `auto-flex` so the table fills the remaining height. Note that the middle `h-full flex flex-col` layer cannot be omitted — `auto-flex` requires a fixed-height ancestor that is a vertical flex container. Do not enable `content-scroll` in this setup; the table manages its own height and scrolling:

```vue
<template>
  <ProLayout :menus="menus" :style="{ height: '100vh' }">
    <div class="h-full flex flex-col">
      <ProTable
        auto-flex
        :columns="columns"
        :data="dataSource"
        :on-query="handleQuery"
      />
    </div>
  </ProLayout>
</template>
```

<div class="table-responsive">

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| title | Header title; passed to `titleRender` when present, otherwise rendered as plain text. An empty string renders no title node | `string` | `'Admin Pro'` |
| logo | Header logo image URL, rendered as an `h-8 w-auto` `<img>` left of the title | `string` | - |
| titleRender | Custom title render function; its return value replaces the whole title node | `(title: string) => VNodeChild` | - |
| menus | Menu config, passed straight through to `NMenu` as `options` and reactive; acts as `defaultMenuData` when `menu.request` is set | `MenuOption[]` | - |
| menuValue | Key of the selected menu item, controlled; when omitted the inner `NMenu` owns the selection. Supports `v-model:menu-value` | `string \| number` | `undefined` |
| expandedKeys | Array of expanded parent keys, controlled; when omitted the inner `NMenu` owns the expansion. Supports `v-model:expanded-keys` | `(string \| number)[]` | `undefined` |
| menu | Menu behavior config, see [MenuConfig](#menuconfig) | `MenuConfig` | - |
| layout | Layout mode, see [Layout modes](#layout-modes) | `'side' \| 'top' \| 'mix'` | `'side'` |
| mobileBreakpoint | Narrow-viewport breakpoint in px, tested against the **viewport width**; at `≤` this value the sidebar and horizontal menu are replaced by a drawer. Omit it to keep the feature off, see [Mobile drawer](#mobile-drawer) | `number` | `undefined` |
| collapsed | Sidebar collapsed state; changes sync into the internal state, internal flips do not write back. When omitted, the initial value comes from `menu.collapsed` | `boolean` | `undefined` |
| collapsedTriggerPosition | Trigger position; only one is rendered at a time, and none under `layout="top"` | `'top' \| 'bottom'` | `'bottom'` |
| class | Class appended to the root node, merged with `tailwind-merge`; **strings only** | `string` | - |
| headerClass | Class appended to the `header`, merged with `tailwind-merge`, so it can override built-ins such as `bg-zinc-800` | `string` | - |
| siderClass | Class appended to the `aside`, merged with `tailwind-merge`, so it can override the sidebar color; the width is an inline style, so `w-*` has no effect | `string` | - |
| siderWidth | Expanded sidebar width in px; when collapsed the width still comes from `menu.collapsedWidth` | `number` | `256` |
| contentClass | Class appended to the content `section`, merged with `tailwind-merge`, so it can override `p-4` | `string` | - |
| contentScroll | Whether the content area scrolls internally; when on, the `section` gains `flex flex-col min-h-0` and wraps an inner `NScrollbar` | `boolean` | `false` |
| style | Inline style on the root node, usually used to set the height | `Record<string, string \| number>` | - |
| footer | Whether to render the footer; its content comes from the `footer` slot and defaults to `Footer` | `boolean` | `false` |

All of the above are consumed. The `MenuConfig` type is not exported from the package entry — declare a structurally identical type yourself when you need annotations.

### Events

| Event | Description | Callback parameters |
| --- | --- | --- |
| collapseChange | Fired after clicking the header or sidebar-bottom trigger; the argument is the flipped state | `(collapsed: boolean) => void` |
| update:menuValue | Fired when a menu item is clicked; pairs with `menuValue` for `v-model:menu-value` | `(key: string \| number) => void` |
| update:expandedKeys | Fired when a submenu opens or closes; pairs with `expandedKeys` for `v-model:expanded-keys`, and is the only expansion event | `(keys: (string \| number)[]) => void` |
| menuClick | Fired when a menu item is clicked (the `side` sidebar, the `top` horizontal menu, the `mix` sidebar); `item` is the original `MenuOption` | `(key: string \| number, item: MenuOption) => void` |
| topMenuClick | `mix` only: fired when a top-level header item is clicked; it **does not write** `menuValue`, and `item` keeps its full `children` | `(key: string \| number, item: MenuOption) => void` |

`@collapse-change`, `@menu-click`, `@top-menu-click` and their camelCase forms all work in templates.

> There is **no** `update:collapsed`, so `v-model:collapsed` is not supported — use `:collapsed` plus `@collapse-change`. Menu selection and expansion do support `v-model:menu-value` / `v-model:expanded-keys`.

> Clicking a parent item that has children only opens or closes it: that emits `update:expandedKeys`, not `menuClick` or `update:menuValue`.

### Slots

| Name | Description | Slot parameters |
| --- | --- | --- |
| default | The content area on the right, rendered inside `section.flex-1.p-4`; with `contentScroll` on it renders inside the inner `NScrollbar` | None |
| header-extra | The region right of the header title (right of the horizontal menu under `top` / `mix`) and left of the collapse trigger | None |
| footer | Footer content, rendered only when `footer` is `true`; defaults to `Footer` when the slot is absent | None |

None of the three slots **receives parameters**. There are no `menu` / `title` / `logo` slots (use the `titleRender` and `logo` props instead), and the narrow-viewport drawer has no slot either — it can only hold the menu.

> `header-extra` shares a `flex items-center` container with the title and the collapse trigger. To push content to the right, use `flex-1` or `ml-auto` inside the slot.

### MenuOption

The element type of `menus` is naive-ui's `MenuOption`. Common fields:

| Field | Description | Type |
| --- | --- | --- |
| key | Unique item identifier; using the route path is recommended | `string \| number` |
| label | Item text; write it as a render function to customize the content and bind events | `string \| () => VNodeChild` |
| icon | Item icon render function | `() => VNodeChild` |
| children | Submenu, supports multiple levels of nesting | `MenuOption[]` |
| disabled | Disables the item (including its children) | `boolean` |
| extra | Extra content right of the text, such as a count | `string \| () => VNodeChild` |
| type | `'group'` for a group title, `'divider'` for a divider; omit for a normal item | `'group' \| 'divider'` |
| show | Whether to show the item | `boolean` |

```tsx
import { Icon } from '@iconify/vue'

const menus = [
  {
    type: 'group',
    key: 'business',
    label: 'Business',
    children: [
      { key: '/home', label: 'Home', icon: () => <Icon icon="hugeicons:home-01" /> },
      { key: '/file', label: 'Files', extra: '12' },
    ],
  },
  { type: 'divider', key: 'd1' },
  { key: '/repo', label: 'Repositories', disabled: true },
]
```

> `type: 'render'` is ignored by `NMenu`; an option's `props` (such as `props.onClick`) never reach the DOM. Use the `menuClick` event for menu clicks, and only write finer custom interactions into `label`. Icon colors come from the theme — there is no need to add `text-white` on `Icon`.

### MenuConfig

The type of the `menu` prop. **Every field is optional** — pass only what you need:

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| collapsed | `boolean` | `false` | Initial collapsed state; the root `collapsed` wins when passed explicitly, and no longer syncs afterwards |
| collapsedWidth | `number` | `64` | Collapsed width, applied to both the sidebar and `NMenu` |
| collapsedIconSize | `number` | `22` | Icon size when collapsed, passed through to `NMenu` |
| loading | `boolean` | `false` | Menu loading state, OR-ed with the internal request state |
| params | `Record<string, any>` | `{}` | First argument passed to `request`; changes (including in-place edits) re-fetch |
| responsive | `boolean` | `false` | Whether the horizontal menu collapses items that do not fit into "more"; only affects the header menu under `top` / `mix` |
| request | `(params, defaultMenuData) => Promise<MenuOption[]>` | - | Called on mount; `params` comes from `menu.params` and `defaultMenuData` is `menus` |
| onLoadingChange | `(loading: boolean) => void` | - | Called when the internal request state flips; changes to `menu.loading` do not trigger it |

```ts
const menu = {
  collapsed: true,
  collapsedWidth: 80,
  collapsedIconSize: 24,
  loading: false,
  params: { keyword: '' },
  responsive: true,
  request: async (params, defaultMenuData) => fetchMenus(params, defaultMenuData),
  onLoadingChange: loading => console.log(loading),
}
```

### Expose

A `ref` gives you three methods:

| Method | Signature | Description |
| --- | --- | --- |
| reloadMenus | `() => Promise<void>` | Runs `menu.request` again immediately; a no-op when no `request` is configured |
| setCollapsed | `(value: boolean) => void` | Writes the collapsed state and emits `collapseChange` |
| toggleCollapsed | `() => void` | Flips the collapsed state and emits `collapseChange` |

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ProLayout } from '@banmao/procomponent'

const layoutRef = ref<InstanceType<typeof ProLayout> | null>(null)

function reload() {
  layoutRef.value?.reloadMenus()
}
</script>

<template>
  <ProLayout ref="layoutRef" :menus="menus" :menu="menu" />
</template>
```

Both collapse methods take the same path as clicking the trigger, so you still need to write `collapsed` back from `collapseChange` to stay in sync. There are no methods for menu selection or expansion — write `menuValue` / `expandedKeys` directly; no scroll-to-item method is exposed either.

</div>

## FAQ

**Menu text is hard to read?**
The header and sidebar are fixed dark, while `NMenu` follows the global theme. Under a light theme, wrap it in `NConfigProvider abstract :theme="darkTheme"` — see [Menu colors](#menu-colors).

**Content is cut off / not fully visible?**
The content area does not scroll by default and `main` is `overflow-hidden`. Enable `content-scroll` to let the built-in `NScrollbar` handle it, or wrap the default slot in `h-full overflow-auto` yourself — do not stack the two, or you get double scrollbars.

**The layout height collapses / the footer sticks to the content?**
The root node has no default height. Use `:style="{ height: '100vh' }"`, or a fixed-height parent plus `height: 100%`, and make sure no wrapper in the parent chain has `height: auto`.

**`v-model:collapsed` does not work?**
There is no `update:collapsed` event. Use `:collapsed` plus `@collapse-change` and write the value back yourself.

**No callback when clicking a menu item?**
Use `@menu-click`, whose arguments are `(key, item)`; `mix` top-level header items go through `@top-menu-click`. An option's `props.onClick` does not work, and expanding / collapsing a submenu emits `@update:expanded-keys`.

**The menu highlight is lost after a refresh?**
Bind `route.path` to `menu-value` and use route paths as menu keys — the highlight then follows the router, including refreshes and direct hits on nested routes. For deep routes, also write the ancestor keys into `expanded-keys`; see [Linking menus to the router](#linking-menus-to-the-router).

**Clicking a menu does not highlight it once `menu-value` is passed?**
In controlled mode the component never changes the selection on its own. Use `v-model:menu-value`, or assign the value yourself inside `@update:menu-value`. Passing only `:menu-value` without listening to the event freezes the highlight on the key you passed in.

**The selected item sits in a submenu and I cannot see the highlight?**
`menuValue` only decides the highlight; it does not expand parents automatically. Write the ancestor keys into `expandedKeys` (in router scenarios, derive them segment by segment from the path).

**Why does `menuValue` stay unchanged when I click the header under `mix`?**
That is the single value source by design: a header click only switches the top-level item and emits `topMenuClick`, while only a sidebar click writes `menuValue`. Otherwise clicking the header would overwrite the selection with a top-level key and the sidebar highlight would be lost. When a top-level item is itself a page, write the value or navigate inside `topMenuClick`.

**The header collapse trigger disappeared?**
`collapsedTriggerPosition` defaults to `'bottom'`, so only the sidebar-bottom trigger renders. Pass `collapsed-trigger-position="top"` for the header one; under `layout="top"` neither renders.

**The sidebar is missing with `layout="mix"`?**
When the active top-level item has no `children`, the sidebar is not rendered at all. Click a top-level header item that has children to see it.

**The drawer does not show up on a narrow viewport?**
First make sure you passed `mobile-breakpoint` — without it the feature is off entirely. Then remember the breakpoint is tested against the **viewport width**, not the container width: putting ProLayout in a 400px-wide card while the browser viewport is 1440px still gives the desktop shape. To demo it, narrow the window or set the breakpoint above the current viewport width — see [Mobile drawer](#mobile-drawer).

**Why isn't the drawer showing the current `mix` second-level menu?**
By design: there is no header top-level menu to click on a narrow viewport, so trimming to the active item would make every other branch unreachable. The drawer renders the full `menus` under all three `layout` values.

**The collapse trigger disappeared and `collapsed` has no effect on a narrow viewport?**
Narrow viewports render no sidebar, so neither collapse trigger renders and the drawer menu always shows at expanded width. The collapsed state itself is kept and restored once the viewport widens.

**Why doesn't clicking a parent item in the drawer close it?**
A parent only expands / collapses its submenu (emitting `update:expandedKeys`); only a leaf writes the selection and closes the drawer. Clicking the mask and pressing Esc also close it.

**How do I change the drawer width and colors?**
The width comes from `siderWidth` (not `menu.collapsedWidth`) and the colors from `siderClass` — the same config as the sidebar.

**When does `menu.request` run?**
Once on mount, then again whenever the `menus` array reference changes or `menu.params` changes (deep-watched, so in-place edits count). You can also call the exposed `reloadMenus()`. The first argument is `menu.params` (default `{}`) and the second is `menus`. Changing only the `menu.request` function does not re-fetch.

**Menu text is unreadable after switching to a light sidebar?**
`siderClass` only changes the sidebar background; the menu text still follows the `NConfigProvider` theme. A light sidebar needs `lightTheme` as well — see [Light sidebar](#light-sidebar).

**`w-60` inside `siderClass` has no effect?**
The sidebar width is an inline style, which outranks classes. Use the `sider-width` prop.

**Too many horizontal menu items overflow?**
Pass `:menu="{ responsive: true }"` and `NMenu` will collapse whatever does not fit into a trailing "more" submenu. It only affects the horizontal header menu under `top` / `mix`.

**How do I change the footer text?**
Enable `footer` and provide the `footer` slot — see [Custom footer](#custom-footer). The footer height is fixed at 64px and there is no `footerClass`.

**`headerClass` did not change the background color?**
Classes are merged with `tailwind-merge`, so later classes win — `header-class="bg-orange-600"` does override the built-in `bg-zinc-800`. But the CSS must actually exist: with build-time-scanned Tailwind, class names have to appear literally in the source; concatenated class names are never generated.

**Why doesn't a `menu.loading` change trigger `onLoadingChange`?**
That callback only reflects the internal request state. An externally supplied `menu.loading` feeds rendering directly and never goes through the callback.

## Known limitations

Footer content, sidebar color, sidebar width, content padding and scrolling, horizontal menu overflow, menu query params, instance methods, menu selection state, menu events and the mobile drawer are all implemented now. Multi-tab pages are not built in, but you can compose them with `ProTabs` (see [Multi-tab pages](#multi-tab-pages)). The following capabilities are still missing — plan around them:

| Member / capability | Notes |
| --- | --- |
| Auto-expanding to the selection | `menuValue` only decides the highlight and never expands ancestors; compute `expandedKeys` yourself for deep routes |
| Footer height | Fixed at 64px with no `footerClass`; for another height turn `footer` off and lay it out yourself |
| Header title color | The built-in title hard-codes `text-white`; use `titleRender` when lightening the header |
| Drawer customization | The breakpoint is viewport-only (no container queries); the drawer always slides in from the left, has no slot, takes its width from `siderWidth` only, and exposes no method to open or close it |
| `expose` scope | Only `reloadMenus` / `setCollapsed` / `toggleCollapsed`; write `menuValue` / `expandedKeys` for selection and expansion, and no scroll-to-item method |