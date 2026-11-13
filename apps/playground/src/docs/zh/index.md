---
name: 中文指南
desc: 斑马组件工坊中文指南 —— 包矩阵、环境要求、安装、快速开始、组件一览与本地开发说明。
---

<route lang="yaml">
meta:
  layout: docs
</route>

# 中文指南

斑马组件工坊是一套面向 **Vue 3 + Naive UI** 的中后台组件体系，以 pnpm monorepo 的形式维护。它把「表格 + 查询 + 表单 + 描述列表」这类反复出现的业务场景收敛成配置式组件，让你用一份 `columns` 描述代替大量重复的模板代码。

本页是整套体系的入口指南：先了解有哪些包、怎么装、怎么跑起第一个例子，再按需跳转到具体组件文档。

## 项目概览

仓库由 5 个包组成，职责互不重叠：

| 包名 | 版本 | 说明 | 获取方式 |
| --- | --- | --- | --- |
| `@banmao/procomponent` | 0.7.30 | 核心高级组件库，基于 Naive UI 封装 | npm 安装 |
| `@banmao/hooks` | 0.0.6 | 列表、异步数据、表格高度、文件导出等组合式函数 | npm 安装 |
| `@banmao/blocks` | 0.0.1 | 页面级区块，当前提供 `Login` | npm 安装 |
| `@banmao/datav` | 0.0.5 | 基于 ECharts 的图表组件 | 私有包，仅工作区内可用 |
| `@banmao/draw` | 0.0.4 | 基于 AntV X6 的画布编排能力（`NoxDraw`） | 私有包，仅工作区内可用 |

> `@banmao/datav` 与 `@banmao/draw` 的 `package.json` 中标记了 `private: true`，Changesets 发布流程会跳过它们。因此不要为这两个包书写 `npm install` 命令，它们只能在 monorepo 内通过 `workspace:^` 引用。

## 环境要求

| 依赖 | 版本要求 | 来源 |
| --- | --- | --- |
| Node.js | `v20.18.0` | 仓库根目录 `.nvmrc` |
| pnpm | `9.14.2` | 根 `package.json` 的 `packageManager` |
| Vue | `^3.5.14` | `@banmao/procomponent` 的 peerDependencies |
| Naive UI | `^2.41.0` | `@banmao/procomponent` 的 peerDependencies |

`vue` 与 `naive-ui` 是 **peer 依赖**，需要由你的项目自行安装，组件库不会重复打包它们。

## 安装

```script-tabs
@banmao/procomponent naive-ui
```

按需追加其他可发布的包：

```bash
pnpm add @banmao/hooks
pnpm add @banmao/blocks
```

安装前请注意两个约束：

- **仅提供 ESM 产物。** `@banmao/procomponent` 的 `exports` 只声明了 `"."` 入口，且只有 `types` 与 `import` 条件，没有 `require`。CommonJS 项目无法直接 `require()`，也不支持 `@banmao/procomponent/dist/xxx` 这类深路径子导入。
- **样式自动注入，无需手动引入。** 构建时通过 `vite-plugin-lib-inject-css` 把 `import './index.css'` 注入到了产物入口，因此 `import { ProTable } from '@banmao/procomponent'` 会同时带上样式，不要再额外 import CSS 文件。

## 快速开始

### 1. 挂载全局 Provider

`NaiveProvider` 把 Naive UI 的六个 Provider 一次性嵌套好，顺序为 `NConfigProvider` → `NLoadingBarProvider` → `NMessageProvider` → `NNotificationProvider` → `NDialogProvider` → `NModalProvider`。

在应用根组件包裹它，`useMessage()`、`useDialog()`、`useNotification()`、`useLoadingBar()` 才能在后续任意子组件中正常工作：

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

`NaiveProvider` 会把自身 props 透传给内部的 `NConfigProvider`，所以主题、语言等配置直接写在它上面即可：

```vue
<template>
  <NaiveProvider :theme="darkTheme" :theme-overrides="themeOverrides">
    <RouterView />
  </NaiveProvider>
</template>
```

### 2. 引入并使用组件

所有组件都支持按需引入。下面是一个本地数据表格，`simple` 表示关闭查询栏等增强区域：

```vue
<script setup lang="ts">
import { ProTable } from '@banmao/procomponent'
import { ref } from 'vue'

const columns = ref([
  { type: 'index' },
  { title: '姓名', key: 'name', width: 100 },
  { title: '年龄', key: 'age', width: 80 },
  { title: '城市', key: 'city', width: 100 },
])

const dataSource = ref([
  { name: '张三', age: 18, city: '北京' },
  { name: '王五', age: 20, city: '上海' },
])
</script>

<template>
  <ProTable title="用户列表" :columns="columns" :data="dataSource" simple />
</template>
```

### 3. 插件式全局注册

如果偏好全局注册，每个组件都额外导出了对应的插件，命名为 `组件名 + Plugin`：

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

> `LoginForm` 是唯一没有导出插件的组件，只能按需引入使用。

### 4. 一个完整的表单

`ProForm` 用 `columns` 描述字段，`valueType` 决定渲染成哪种控件，校验规则既可以集中在 `rules`，也可以写在列的 `rule` 上：

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
  { title: '用户名', key: 'username', valueType: 'text' },
  {
    title: '性别',
    key: 'gender',
    valueType: 'select',
    options: [
      { label: '男', value: '男' },
      { label: '女', value: '女' },
    ],
  },
  { title: '年龄', key: 'age', valueType: 'digit' },
])

const rules = ref({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: ['change', 'blur'] }],
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

## 组件一览

`@banmao/procomponent` 入口当前导出的全部组件如下。点击名称可进入对应文档，未标注链接的组件文档仍在补充中，可先到[组件目录](/procomponent)查看示例。

### 布局

| 组件 | 说明 |
| --- | --- |
| [ProLayout](/procomponent/ProLayout) | 中后台整体布局骨架 |
| `Actions` | 操作按钮组，收敛表格行内与工具栏操作 |

### 数据录入

| 组件 | 说明 |
| --- | --- |
| [ProForm](/procomponent/ProForm) | 配置式表单，支持栅格、多种 `valueType` 与校验 |
| `ModalForm` | 弹窗形态的表单 |
| `DrawerForm` | 抽屉形态的表单 |
| `QueryFilter` | 查询过滤器，可折叠的搜索条件区 |
| `LiteFilter` | 轻量筛选器 |
| `LoginForm` | 登录表单（仅按需引入） |

### 数据展示

| 组件 | 说明 |
| --- | --- |
| [ProTable](/procomponent/ProTable) | 高级表格，支持查询联动、列设置、行内编辑 |
| [ProDescriptions](/procomponent/ProDescriptions) | 描述列表，用于详情页数据展示 |
| [ProText](/procomponent/ProText) | 文本处理，省略、复制、格式化 |
| `ProList` | 列表组件 |

### 通用

| 组件 | 说明 |
| --- | --- |
| [NaiveProvider](/procomponent/naive-provider) | 全局 Provider 与主题配置入口 |
| [Watermark](/procomponent/watermark) | 水印，支持文本与图片 |
| `LinkDiagram` | 基于 `@banmao/draw` 的链路图编排 |

> `ProTabs`、`TextClamp`、`Tour` 的源码目录虽然存在，但**尚未从入口导出**，当前无法从 `@banmao/procomponent` 引入。侧边栏中标记为「规划中」的条目同理。

## Hooks

`@banmao/hooks` 导出的组合式函数：

| Hook | 说明 |
| --- | --- |
| `useList` | 列表数据与分页、查询状态管理 |
| `useAsyncData` | 包装异步请求函数，托管加载与结果状态 |
| `useTableHeight` | 依据容器计算表格可用高度 |
| `useExportFile` | 将 `BlobPart` 数据导出为文件 |

```ts
import { useAsyncData, useTableHeight } from '@banmao/hooks'
```

> 导出函数名是 `useExportFile`，它所在的模块目录名为 `useExportRemoteFile`，按函数名引入即可。`useDeviceInfo` 目前未从入口导出。

## 区块与图表

- **区块**：`@banmao/blocks` 当前导出 `Login`，多种登录页形态可见[区块画廊](/blocks)与 [Login 文档](/blocks/login)。
- **图表**：`@banmao/datav` 导出 `Chart`、`Pie`、`CircleBar`、`CubeBar`、`Pie3D`，需要 peer 依赖 `echarts ^5.6.0` 与 `vue-echarts ^7.0.3`。效果见[图表工坊](/datav)。该包为私有包，仅能在本仓库工作区内引用。

## 本地开发

```bash
# 安装工作区依赖
pnpm install

# 启动组件工坊站点（默认端口 5300）
pnpm play
```

站点通过 `workspace:^` 消费各包的 **构建产物 `dist`**，而不是源码。因此修改包源码后需要重新构建对应包，页面才会更新：

```bash
pnpm build:lib      # @banmao/procomponent
pnpm build:hooks    # @banmao/hooks
pnpm build:blocks   # @banmao/blocks
pnpm build:datav    # @banmao/datav
pnpm build:draw     # @banmao/draw
```

也可以用聚合脚本按依赖顺序构建全部包：

```bash
pnpm build
```

> `pnpm build` 中仍保留着 `build:ui` 一步，但 `packages/ui` 工作区已被移除。该步会输出 `No projects matched the filters` 并以退出码 0 结束，**不会中断整体构建**，只是空跑一步。看到这条提示属于预期现象，无需处理。

## 常见问题

**样式没有生效？**
样式已随入口自动注入，正常引入组件即可。若失效，先确认引入的是构建后的 `dist` 产物；也不要尝试 `import '@banmao/procomponent/dist/index.css'`，`exports` 未开放该子路径。

**`useMessage()` 报找不到 Provider？**
调用位置必须在 `NaiveProvider` 的子树内。把它包在应用根组件上，而不是某个局部页面里。

**能在 CommonJS 项目里使用吗？**
`@banmao/procomponent` 只输出 ESM，没有 `require` 入口。请改用支持 ESM 的构建工具链。

**`@banmao/datav` / `@banmao/draw` 装不上？**
这两个包是 `private: true`，不参与发布，只能在 monorepo 内以 `workspace:^` 使用。另需注意 `@banmao/procomponent` 自身依赖 `@banmao/draw: workspace:^`，在仓库外安装时若该依赖无法解析，需要单独确认其可用性。

**改了源码但页面没变化？**
站点消费 `dist`，请先执行对应的 `pnpm build:*`。构建过程中 `dist` 会被短暂清空，此时可能出现瞬时 404 或 HMR 报错，构建结束后整页刷新即可。

## 下一步

- [ProComponent 介绍](/procomponent/overview) —— 了解核心特性与设计取舍
- [组件目录](/procomponent) —— 浏览全部组件示例
- [图表工坊](/datav) —— 查看数据可视化能力
- [区块画廊](/blocks) —— 复用页面级区块
