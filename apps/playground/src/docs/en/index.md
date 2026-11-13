---
name: English Guide
desc: English guide to the Banmao component atelier — package matrix, requirements, installation, quick start, component index and local development.
---

<route lang="yaml">
meta:
  layout: docs
</route>

# English Guide

Banmao is a component system for **Vue 3 + Naive UI**, built for admin and back-office applications and maintained as a pnpm monorepo. It collapses the recurring "table + query + form + descriptions" scenarios into configuration-driven components, so a single `columns` definition replaces a large amount of repeated template code.

This page is the entry point: what packages exist, how to install them, how to run your first example, and where to go next.

> Component reference pages are currently written in Chinese. This guide covers setup and concepts in English; the reference pages linked below still use Chinese labels.

## Overview

The repository contains five packages with non-overlapping responsibilities:

| Package | Version | Description | Availability |
| --- | --- | --- | --- |
| `@banmao/procomponent` | 0.7.30 | Core advanced components built on Naive UI | Install from npm |
| `@banmao/hooks` | 0.0.6 | Composables for lists, async data, table height and file export | Install from npm |
| `@banmao/blocks` | 0.0.1 | Page-level blocks, currently `Login` | Install from npm |
| `@banmao/datav` | 0.0.5 | ECharts-based chart components | Private, workspace only |
| `@banmao/draw` | 0.0.4 | AntV X6 canvas orchestration (`NoxDraw`) | Private, workspace only |

> `@banmao/datav` and `@banmao/draw` are marked `private: true` in their `package.json`, so the Changesets release flow skips them. Do not write `npm install` commands for these two — they can only be referenced inside the monorepo via `workspace:^`.

## Requirements

| Dependency | Required version | Source |
| --- | --- | --- |
| Node.js | `v20.18.0` | `.nvmrc` at the repository root |
| pnpm | `9.14.2` | `packageManager` in the root `package.json` |
| Vue | `^3.5.14` | `peerDependencies` of `@banmao/procomponent` |
| Naive UI | `^2.41.0` | `peerDependencies` of `@banmao/procomponent` |

`vue` and `naive-ui` are **peer dependencies**: your project installs them, and the library does not bundle its own copies.

## Installation

```script-tabs
@banmao/procomponent naive-ui
```

Add the other publishable packages as needed:

```bash
pnpm add @banmao/hooks
pnpm add @banmao/blocks
```

Two constraints to be aware of before you start:

- **ESM only.** The `exports` field of `@banmao/procomponent` declares just the `"."` entry, with only the `types` and `import` conditions — there is no `require` condition. CommonJS projects cannot `require()` it, and deep subpath imports such as `@banmao/procomponent/dist/xxx` are not supported.
- **Styles are injected automatically.** The build uses `vite-plugin-lib-inject-css` to inject `import './index.css'` into the bundle entry, so importing a component already brings its styles. Do not add a separate CSS import.

## Quick Start

### 1. Mount the global provider

`NaiveProvider` nests all six Naive UI providers for you, in this order: `NConfigProvider` → `NLoadingBarProvider` → `NMessageProvider` → `NNotificationProvider` → `NDialogProvider` → `NModalProvider`.

Wrap your application root with it so that `useMessage()`, `useDialog()`, `useNotification()` and `useLoadingBar()` work in any descendant component:

```vue
<script setup lang="ts">
import { NaiveProvider } from '@banmao/procomponent'
</script>

<template>
  <NaiveProvider>
    <RouterView />
  </NaiveProvider>
</template>
```

`NaiveProvider` forwards its props to the inner `NConfigProvider`, so theme and locale configuration can be declared directly on it:

```vue
<template>
  <NaiveProvider :theme="darkTheme" :theme-overrides="themeOverrides">
    <RouterView />
  </NaiveProvider>
</template>
```

### 2. Import and use a component

Every component supports on-demand import. Here is a table backed by local data; `simple` turns off the query bar and other enhanced regions:

```vue
<script setup lang="ts">
import { ProTable } from '@banmao/procomponent'
import { ref } from 'vue'

const columns = ref([
  { type: 'index' },
  { title: 'Name', key: 'name', width: 100 },
  { title: 'Age', key: 'age', width: 80 },
  { title: 'City', key: 'city', width: 100 },
])

const dataSource = ref([
  { name: 'Alice', age: 18, city: 'Beijing' },
  { name: 'Bob', age: 20, city: 'Shanghai' },
])
</script>

<template>
  <ProTable title="Users" :columns="columns" :data="dataSource" simple />
</template>
```

### 3. Register components as plugins

If you prefer global registration, each component also exports a plugin named `ComponentName + Plugin`:

```ts
import { createApp } from 'vue'
import {
  NaiveProviderPlugin,
  ProFormPlugin,
  ProTablePlugin,
} from '@banmao/procomponent'
import App from './App.vue'

createApp(App)
  .use(NaiveProviderPlugin)
  .use(ProFormPlugin)
  .use(ProTablePlugin)
  .mount('#app')
```

> `LoginForm` is the only component without a plugin export — import it directly instead.

### 4. A complete form

`ProForm` describes fields through `columns`, where `valueType` decides which control is rendered. Validation rules can be collected in `rules` or attached to a column via `rule`:

```vue
<script setup lang="ts">
import { ProForm } from '@banmao/procomponent'
import { ref } from 'vue'

const formModel = ref({
  username: null,
  gender: null,
  age: null,
})

const columns = ref([
  { title: 'Username', key: 'username', valueType: 'text' },
  {
    title: 'Gender',
    key: 'gender',
    valueType: 'select',
    options: [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' },
    ],
  },
  { title: 'Age', key: 'age', valueType: 'digit' },
])

const rules = ref({
  username: [{ required: true, message: 'Please enter a username', trigger: 'blur' }],
  gender: [{ required: true, message: 'Please select a gender', trigger: ['change', 'blur'] }],
})

function handleSubmit(model: Record<string, unknown>) {
  console.log(model)
}
</script>

<template>
  <ProForm
    :columns="columns"
    :model="formModel"
    :rules="rules"
    mode="search"
    :grid-cols="2"
    label-placement="left"
    :label-width="120"
    @submit="handleSubmit"
  />
</template>
```

## Components

Everything currently exported from the `@banmao/procomponent` entry is listed below. Names link to their reference pages; components without a link do not have a dedicated page yet — see the [component index](/procomponent) for examples.

### Layout

| Component | Description |
| --- | --- |
| [ProLayout](/procomponent/ProLayout) | Overall layout shell for admin applications |
| `Actions` | Action button group for table rows and toolbars |

### Data entry

| Component | Description |
| --- | --- |
| [ProForm](/procomponent/ProForm) | Configuration-driven form with grid layout, multiple `valueType`s and validation |
| `ModalForm` | Form rendered inside a modal |
| `DrawerForm` | Form rendered inside a drawer |
| `QueryFilter` | Collapsible query filter area |
| `LiteFilter` | Lightweight filter |
| `LoginForm` | Login form (direct import only) |

### Data display

| Component | Description |
| --- | --- |
| [ProTable](/procomponent/ProTable) | Advanced table with query binding, column settings and inline editing |
| [ProDescriptions](/procomponent/ProDescriptions) | Description list for detail views |
| [ProText](/procomponent/ProText) | Text utilities: ellipsis, copy, formatting |
| `ProList` | List component |

### General

| Component | Description |
| --- | --- |
| [NaiveProvider](/procomponent/naive-provider) | Global providers and theme configuration entry |
| [Watermark](/procomponent/watermark) | Watermark with text or image support |
| `LinkDiagram` | Link diagram orchestration built on `@banmao/draw` |

> Source directories for `ProTabs`, `TextClamp` and `Tour` exist, but they are **not exported from the entry** yet and cannot be imported from `@banmao/procomponent`. The same applies to sidebar entries marked as planned.

## Hooks

Composables exported by `@banmao/hooks`:

| Hook | Description |
| --- | --- |
| `useList` | List data with pagination and query state |
| `useAsyncData` | Wraps an async request function, tracking loading and result state |
| `useTableHeight` | Computes available table height from its container |
| `useExportFile` | Exports `BlobPart` data as a file |

```ts
import { useAsyncData, useTableHeight } from '@banmao/hooks'
```

> The exported function is `useExportFile`, while its module directory is named `useExportRemoteFile` — import by function name. `useDeviceInfo` is not exported from the entry at this time.

## Blocks and Charts

- **Blocks**: `@banmao/blocks` currently exports `Login`. See the [block gallery](/blocks) and the [Login reference](/blocks/login) for the available variants.
- **Charts**: `@banmao/datav` exports `Chart`, `Pie`, `CircleBar`, `CubeBar` and `Pie3D`, and requires the peer dependencies `echarts ^5.6.0` and `vue-echarts ^7.0.3`. See the [chart atelier](/datav) for live examples. This package is private and can only be referenced inside this workspace.

## Local Development

```bash
# Install workspace dependencies
pnpm install

# Start the component atelier site (port 5300 by default)
pnpm play
```

The site consumes each package's **built `dist` output** through `workspace:^`, not its source. After editing package source you must rebuild that package before the page updates:

```bash
pnpm build:lib      # @banmao/procomponent
pnpm build:hooks    # @banmao/hooks
pnpm build:blocks   # @banmao/blocks
pnpm build:datav    # @banmao/datav
pnpm build:draw     # @banmao/draw
```

The aggregate script builds every package in dependency order:

```bash
pnpm build
```

> `pnpm build` still contains a `build:ui` step, but the `packages/ui` workspace has been removed. That step prints `No projects matched the filters` and exits with code 0, so it **does not break the overall build** — it is simply a no-op. Seeing this message is expected and requires no action.

## FAQ

**Styles are not applied.**
Styles ship with the entry automatically, so a normal component import is enough. If they are missing, first confirm you are importing the built `dist` output. Do not try `import '@banmao/procomponent/dist/index.css'` — that subpath is not exposed by `exports`.

**`useMessage()` reports a missing provider.**
The call site must be inside the `NaiveProvider` subtree. Mount it on the application root rather than on an individual page.

**Can I use it in a CommonJS project?**
`@banmao/procomponent` ships ESM only, with no `require` entry. Use an ESM-capable toolchain instead.

**`@banmao/datav` / `@banmao/draw` cannot be installed.**
Both are `private: true` and are excluded from publishing, so they are workspace-only via `workspace:^`. Note also that `@banmao/procomponent` itself depends on `@banmao/draw: workspace:^`; when installing outside this repository, verify that this dependency can be resolved.

**I changed the source but the page did not update.**
The site consumes `dist`, so run the matching `pnpm build:*` first. During a rebuild `dist` is briefly emptied, which can cause transient 404s or HMR errors — do a full page reload once the build settles.

## Next Steps

- [ProComponent introduction](/procomponent/overview) — core features and design trade-offs
- [Component index](/procomponent) — browse all component examples
- [Chart atelier](/datav) — data visualization capabilities
- [Block gallery](/blocks) — reusable page-level blocks
