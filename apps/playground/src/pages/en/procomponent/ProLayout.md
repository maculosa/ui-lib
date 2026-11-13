---
name: ProLayout
desc: ProLayout is an advanced layout component built on Layout. It provides the common layout building blocks — a title area and a content area — so you can assemble page layouts quickly.
---

<route lang="yaml">
meta:
  layout: default
</route>

# ProLayout

ProLayout is an advanced layout component built on Layout. It provides the common layout building blocks — a title area and a content area — so you can assemble page layouts quickly.

## Features

- A title area for the page heading.
- A content area for the main page content.
- Custom slots, so you can insert your own content anywhere in the layout.

## Getting started

### Installation

```bash
pnpm install @banmao/procomponent
```

### Basic usage

```vue
<template>
  <ProLayout title="Base Layout">sss</ProLayout>
</template>
```

## Examples

Common ProLayout examples showing different features and configurations:

> When using ProLayout, put the title and the content in separate slots to keep the code clear and maintainable.

<Demo title="Base layout"
desc="The base layout has a title area and a content area, which fits most page layouts."
:raw="BaseLayoutRaw"
style="height: 600px;">

<BaseLayout />

</Demo>