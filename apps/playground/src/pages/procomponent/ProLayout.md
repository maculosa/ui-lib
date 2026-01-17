---
name: ProLayout
desc: ProLayout 是一个基于 Layout 的高级布局组件，提供了标题、内容区域等常用的布局功能，可以帮助开发者快速构建页面布局。
---

<route lang="yaml">
meta:
  layout: default
</route>

# ProLayout

ProLayout 是一个基于 Layout 的高级布局组件，提供了标题、内容区域等常用的布局功能，可以帮助开发者快速构建页面布局。

## 特性

- 提供标题区域，用于显示页面标题。
- 提供内容区域，用于展示页面主要内容。
- 支持自定义插槽，方便开发者在布局中插入自定义内容。

## 快速上手

### 安装

```bash
pnpm install @banmao/procomponent
```

### 基本用法

```vue
<template>
  <ProLayout title="Base Layout">sss</ProLayout>
</template>
```

## 示例

以下是 ProLayout 的一些常用示例，展示了不同功能和配置的使用方式：

> 当使用 ProLayout 时，建议将标题和内容区域的内容分别放在不同的插槽中，以保持代码的清晰和可维护性。

<Demo title="基础布局"
desc="基础布局包含标题和内容区域，适用于大多数页面布局场景。"
:raw="BaseLayoutRaw"
style="height: 600px;">

<BaseLayout />

</Demo>
