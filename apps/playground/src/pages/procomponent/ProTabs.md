---
name: ProTabs
desc: ProTabs 是配置驱动的选项卡组件，提供 card / line 两种形态、三种尺寸、可选的页签缓存面板、路由联动、编辑器级新增/拖拽/重命名、虚拟滚动、异步面板、右键菜单与跨容器拖拽，并具备完整的键盘及 ARIA 支持。
---

<route lang="yaml">
meta:
  layout: default
</route>

# ProTabs

ProTabs 是**可配置的选项卡组件**：用 `options` 描述页签，用 `active` 持有选中项，点击抛 `update:active`，关闭抛 `close`。在页签条之外，它还可以选择性地渲染内容面板（支持 `keepAlive` / `lazy`）、对接路由、内置新增按钮、拖拽排序与双击重命名。

本页描述仓库当前源码的行为。

> **版本提示**：`0.7.31` 的发布包中尚未包含 `ProTabs`。本仓库已从包入口导出组件与全部类型，配合本页的 changeset 会在下一个 minor 版本可用。

## 特性

- **配置式页签**：`options` 数组驱动，`label` + `key` 即可，支持禁用项
- **两种形态**：`type="card"` 卡片式（默认）/ `type="line"` 下划线式
- **三种尺寸**：`size="small" | "medium" | "large"`，统一控制高度、内边距、字号、图标与徽标
- **受控 / 非受控 / 路由**：`v-model:active`、内部状态、`route` 三种选中来源，优先级 `active > route > 内部状态`
- **内容面板**：`panel` 插槽或 `renderPanel` 渲染面板，配合 `keepAlive` / `lazy` 控制缓存
- **完整键盘与 ARIA**：方向键循环、Home / End、roving tabindex、`aria-controls` 与 `tabpanel` 双向关联
- **徽标**：数字、红点、自定义 VNode，支持 `badgeMax` 溢出显示 `99+`
- **按页签关闭**：组件级 `closable` + 页签级 `closable` 覆盖，关闭按钮名称可本地化
- **编辑器交互**：内置新增按钮、拖拽排序（鼠标 / 触摸 / 触控笔）、双击重命名
- **滚动提示**：溢出时出现左右箭头（可关闭），选中项自动滚入可视区域
- **虚拟滚动**：`virtual` 支持强制开启或按 `virtualThreshold` 自动开启，只渲染可视窗口
- **异步面板**：`panelLoader` 配合内置 loading / error / retry 三态，结果按 key 缓存
- **右键菜单**：内置关闭当前 / 其他 / 右侧 / 全部，按可用性置灰，文案可本地化
- **跨容器拖拽**：`dragGroup` + `transfer` 支持把页签拖到另一个 ProTabs
- **路由标题**：`routeTitle` 为不在 `options` 中的路由生成临时页签
- **实例方法**：`activeKey`、`scrollTo`、`scrollActive`、`scrollBy`、`focus`、`getEl`、`reloadPanel`
- **类型完整**：`TabOption` / `ProTabsProps` / `ProTabsEmits` 等从包入口导出
- **样式可注入**：`class` / `style` 作用于根节点，配色走 CSS 变量，宿主可换肤

## 何时使用

- 内容区需要在几个平级视图之间切换，且需要页签与内容一起管理
- 中后台的**多标签页**骨架：配合 [ProLayout](/procomponent/ProLayout) 用一份 `active` 同时驱动页签与菜单高亮
- 页签来自后端接口、需要动态增删、拖拽排序或重命名的场景
- 页签需要与路由同步，或需要展示计数、红点、自定义徽标
- 页签数量达到数百条，或需要右键菜单、跨容器拖拽等编辑器能力

## 快速上手

### 安装

```script-tabs
@banmao/procomponent
```

### 按需引入

```vue
<script setup>
import { ProTabs } from '@banmao/procomponent'
import type { TabOption } from '@banmao/procomponent'
</script>
```

### 全局注册

```ts
import { createApp } from 'vue'
import { ProTabsPlugin } from '@banmao/procomponent'
import App from './App.vue'

createApp(App).use(ProTabsPlugin).mount('#app')
```

### 基本使用

`options` 是页签数组，`v-model:active` 持有选中的 `key`。不传 `panel` 插槽或 `renderPanel` 时，组件只渲染页签条，内容区自行处理：

```vue
<script setup>
import { ref } from 'vue'
import { ProTabs } from '@banmao/procomponent'

const options = [
  { label: '概览', key: 'overview' },
  { label: '明细', key: 'detail' },
  { label: '操作日志', key: 'log' },
]
const active = ref('overview')
</script>

<template>
  <ProTabs v-model:active="active" :options="options" />
</template>
```

不传 `active` 就是非受控，初始值取 `defaultActive`，没传则取 `options[0].key`：

```vue
<ProTabs :options="options" default-active="detail" @update:active="key => console.log(key)" />
```

### 带内容面板

提供 `panel` 插槽后，组件会在页签条下方渲染面板容器，并按 `keepAlive` / `lazy` 管理缓存：

```vue
<template>
  <ProTabs v-model:active="active" :options="options" keep-alive lazy>
    <template #panel="{ option }">
      <component :is="views[option.key]" :key="option.key" />
    </template>
  </ProTabs>
</template>
```

## 核心概念

### 结构

```text
div  ← 根节点：relative w-full flex；有面板时 flex-col；class / style 作用于这里
├── div  ← 页签行：relative flex w-full min-w-0
│   ├── div[data-pro-tabs-scroller]  ← flex-1 min-w-0 overflow-x-auto，滚动条隐藏
│   │   └── div[role="tablist"]  ← flex items-center min-w-full w-max + gap + 最小高度
│   │       │                      card：--color-fill 背景 + 圆角；line：底边框 --color-divider
│   │       │                      inset 为 true 时 px-1，否则 px-0
│   │       │                      draggable 时这层由 VueDraggable 渲染，仍带 role="tablist"
│   │       ├── div[role="tab"] × options.length
│   │       │   ├── 内容区    option.render > props.render > 内置（图标 + label + 徽标）
│   │       │   │             重命名中替换为 input.pro-tabs-rename-input
│   │       │   ├── 关闭按钮  closable（页签级优先）时渲染，<button aria-label="{closeLabel} {label}">
│   │       │   └── 下划线    line 且选中时渲染，absolute bottom-0 h-[2px]
│   │       ├── 新增按钮 addable 时渲染
│   │       └── default 插槽内容
│   └── 左 / 右滚动按钮  absolute 渐变遮罩，溢出且 scrollButtons 时出现
└── div  ← 面板容器：w-full + panelClass（默认 mt-3）
    └── div[role="tabpanel"][id][aria-labelledby] × 已挂载面板
```

`data-pro-tabs-scroller` 是稳定的查询标记；滚动按钮在滚动容器**外面**，因此不会跟着内容滚动。

### 尺寸

`size` 统一控制页签条与页签内部尺寸，默认 `medium`：

| 令牌 | small | medium（默认） | large |
| --- | --- | --- | --- |
| 页签条最小高度 | 32px | 40px | 48px |
| card 页签高度 | 28px | 32px | 36px |
| line 页签 | 撑满页签条 | 撑满页签条 | 撑满页签条 |
| 水平内边距 | 10px | 12px | 16px |
| 页签间距 | 2px | 4px | 6px |
| 文字 | 13px | 14px | 15px |
| 图标 | 14px | 16px | 18px |
| 关闭图标 | 12px | 14px | 16px |
| 徽标 | 16px 高 / 10px 字 | 18px 高 / 11px 字 | 20px 高 / 12px 字 |

页签是 `shrink-0`，**不会被压缩**；总宽超出容器时页签条横向滚动。圆角 2px（`rounded` 为 true 时全圆）只作用于 card。

### 选中态模型

选中项由 `props.active || props.route || innerActive` 决定，**空字符串表示该层不参与**：

| 写法 | 行为 |
| --- | --- |
| `v-model:active="active"` | 受控：高亮始终等于外部值，点击抛 `update:active` 由外部回写 |
| `:active="active"` 不接事件 | 高亮**停在传入值**，点击只抛事件不改高亮 |
| `:route="route.path"` | 路由驱动：高亮跟随路由；仍可用 `active` 临时覆盖 |
| 不传 `active` / `route` | 非受控：组件内部维护高亮，点击自动切换并抛 `update:active` |
| 不传 `active` + `default-active` | 非受控，初始选中 `defaultActive` |
| 都不传 | 非受控，初始选中 `options[0].key`；`options` 为空时为 `''` |

`defaultActive` 只在初始化时读一次。点击页签时组件**总是**先写内部状态，再抛 `update:active`；配置了 `router` 时还会调用 `router.push(key)`。

非受控模式（没有 `active` 也没有 `route`）下，`options` 变化时有一条回退规则：

| 情况 | 结果 |
| --- | --- |
| 当前选中项仍在新 `options` 里 | 保持不变 |
| 选中项消失且原来有选中项 | 落到**最后一个**仍存在的页签 |
| 原来没有选中项（例如异步到达） | 落到**第一项** |
| 新 `options` 为空数组 | 选中态变为 `''` |

注意：

- 回退**不抛 `update:active`**，只有用户点击 / 键盘操作才抛
- 监听的是 `options` 的**引用变化**，就地 `push` / `splice` 不触发，请整体替换数组
- 受控或路由模式下组件**不做任何回退**，选中归属由外部负责

### 键盘导航

每个页签是 `role="tab"`，采用 roving tabindex：选中且可用的页签 `tabindex=0`，其余为 `-1`，禁用项始终 `-1`。

| 按键 | 行为 |
| --- | --- |
| `Tab` / `Shift+Tab` | 进入 / 离开页签组（只停在 roving 页签上） |
| `Enter` / `Space` | 选中当前聚焦页签 |
| `→` / `←` | 在**可用**页签间循环移动并选中，禁用项会被跳过 |
| `Home` / `End` | 跳到第一个 / 最后一个可用页签 |
| `Alt+→` / `Alt+←` | `draggable` 时把当前页签右移 / 左移一位，只抛 `reorder`，不移动选中态 |

方向键移动会同时选中目标页签（抛 `update:active`，有 `router` 时还会 `push`），并把焦点移过去。

### ARIA 与面板关联

- 根页签容器 `role="tablist"`，页签 `role="tab"` + `aria-selected` + `aria-disabled`
- 页签 id 由 `useId()` 与 `option.id || option.key` 生成，非 `[a-zA-Z0-9_-]` 字符会替换为 `-`
- 存在面板时，页签带 `aria-controls="{uid}-panel-{id}"`，面板带 `role="tabpanel"`、`id` 与 `aria-labelledby="{uid}-tab-{id}"`
- 面板容器 `tabindex=0`，未激活面板用 `hidden` 隐藏
- 关闭按钮 `aria-label="{closeLabel} {label}"`，默认 `关闭 概览`；`closeLabel` 可本地化
- 滚动按钮有 `aria-label` / `title`，由 `scrollLeftLabel` / `scrollRightLabel` 指定

需要跨服务端渲染或测试中稳定匹配 id 时，给选项传 `id`，不要依赖 `key` 的原始字符。

### 内容面板

只要满足以下任一条件，组件就认为「有面板」并开始渲染：

1. 传入 `panel` 插槽
2. 传入组件级 `renderPanel`
3. 任一选项上有 `renderPanel`

单个面板的解析顺序是 **选项级 `renderPanel` > `panel` 插槽 > 组件级 `renderPanel`**。插槽参数为 `{ option, active }`。

缓存语义：

| 配置 | 已挂载面板 |
| --- | --- |
| `keepAlive=false`（默认） | 只有当前选中项；切走即卸载 |
| `keepAlive=true` + `lazy=false` | 全部选项；未激活的用 `hidden` 隐藏 |
| `keepAlive=true` + `lazy=true` | 访问过的选项；首次激活时才挂载 |

`lazy` 只在 `keepAlive` 为 true 时生效。面板容器附加 `panelClass`（默认 `mt-3`），整体宽度 `w-full`。

### 徽标

优先级：选项级 `badge` > 旧版 `showBadge + dot`。三种形态：

| 写法 | 效果 |
| --- | --- |
| `badge: 12` | 数字徽标；超过 `badgeMax`（默认 99）显示 `99+` |
| `badge: 0` | 显示 `0`（数字 0 有效） |
| `badge: 'dot'` | 8px 纯红点，无文字 |
| `badge: option => VNode` | 完全自定义，函数收到该 `TabOption` |

数字徽标阈值可用组件级 `badgeMax` 设默认值，选项级 `badgeMax` 单独覆盖。用了 `render` 自定义内容区时不渲染内置徽标，需要自己画。

### 增删页签与按页签关闭

组件**从不修改 `options`**，所有增删都由外部完成：

- `addable` 渲染内置新增按钮（图标 `addIcon`、文案 `addLabel`），点击只抛 `add`
- `closable` 渲染关闭按钮并抛 `close(key)`，内部 `stopPropagation`，点关闭不会顺带选中
- 页签级 `closable` 覆盖组件级，两个方向都生效：组件关闭时给某个页签 `closable: false` 可固定它；组件不关闭时给某个页签 `closable: true` 可单独开启

```vue
<script setup>
import { ref } from 'vue'
import { ProTabs } from '@banmao/procomponent'

const tabs = ref([
  { label: '首页', key: '/home', closable: false },
  { label: '订单', key: '/orders' },
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

### 新增 / 拖拽 / 重命名

三个能力彼此独立，可任意组合：

- **新增**：`addable`，抛 `add`，外部追加选项并决定是否选中
- **拖拽**：`draggable`，基于 `vue-draggable-next`（Sortable 内核），鼠标、触摸、触控笔都可用；拖拽结束抛 `reorder(keys, from, to)`，`keys` 是拖拽后的完整 key 顺序
- **重命名**：`renamable`，双击页签进入编辑；`Enter` 或失焦提交，`Esc` 取消；只在「去除首尾空格后非空且与原文不同」时抛 `rename(key, label)`

拖拽时关闭按钮、重命名输入框与禁用页签不会触发拖动（Sortable `filter`）；拖拽结束后的 120ms 内点击会被忽略，避免「拖完即选中」。

组件不会自动更新 `options`，`reorder` / `rename` 后必须由外部写回，否则视觉会回到原状：

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

### 路由联动

组件不依赖 `vue-router`，而是接受两层结构：

- `route: string`：非空时作为选中来源（优先级介于 `active` 与内部状态之间）
- `router: { push(to: string): unknown }`：点击页签时调用 `router.push(key)`

`vue-router` 的实例结构上就满足 `ProTabsRouter`，可直接传入：

```vue
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ProTabs } from '@banmao/procomponent'

const route = useRoute()
const router = useRouter()
const tabs = ref([
  { label: '首页', key: '/home' },
  { label: '订单', key: '/orders' },
])
</script>

<template>
  <ProTabs :options="tabs" :route="route.path" :router="router" />
</template>
```

点击时组件仍会抛 `update:active`，但高亮最终跟随路由；如果路由跳转失败，高亮不会误切。需要临时覆盖路由选中（例如打开一个未注册路由的页签），传 `active` 即可，`active` 优先级最高。

### 滚动与实例方法

页签栏溢出时，两侧出现渐变遮罩 + 圆形箭头按钮，每次滚动约 80% 可视宽度；选中项变化时自动滚入视野。箭头可用 `scrollButtons=false` 关闭，按钮名称用 `scrollLeftLabel` / `scrollRightLabel` 本地化。

通过模板 ref 可调用实例方法：

| 方法 / 属性 | 说明 |
| --- | --- |
| `activeKey` | 当前选中的 key（只读） |
| `scrollTo(target, behavior?)` | 把指定页签滚入可视区域，`target` 可为 key 或索引，默认 `smooth` |
| `scrollActive(behavior?)` | 把当前选中页签滚入可视区域 |
| `scrollBy(delta)` | 相对当前位置横向滚动，负值向左 |
| `focus()` | 聚焦当前 roving 页签 |
| `getEl()` | 返回横向滚动容器 `HTMLElement` |

```vue
<script setup>
import { ref } from 'vue'
import type { ProTabsInstance } from '@banmao/procomponent'

const tabsRef = ref<ProTabsInstance>()
</script>

<template>
  <ProTabs ref="tabsRef" :options="tabs" />
  <button @click="tabsRef?.scrollTo('tab-12')">跳到 12</button>
</template>
```

### 自定义渲染

页签内容区优先级：**选项级 `render` > 组件级 `render` > 内置渲染**。

```tsx
const options = [
  {
    label: '运行中',
    key: 'running',
    render: option => (
      <span class="flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full bg-[#3e9b4f]" />
        {option.label}
      </span>
    ),
  },
  { label: '已停止', key: 'stopped' },
]
```

要点：

- 返回值替换**整个内容区**（图标、文案、徽标都不再渲染）
- 选中态、点击、键盘、关闭按钮与下划线仍由组件负责
- 返回空值会回退到下一级
- 组件级 `render` 对所有页签生效，适合统一改成「显示 key」这类形态
- 重命名进行中时内容区临时替换为输入框，提交后仍以 `options` 里的 `label` 为准

### 配色与主题

ProTabs **不跟随 Naive UI 主题**，配色全部走 CSS 变量 + 兜底值：

| CSS 变量 | 兜底值 | 作用 |
| --- | --- | --- |
| `--color-accent` | `#f04e23` | 选中文字、徽标、红点、下划线、重命名下边框 |
| `--color-foreground-secondary` | `#57534a` | 未选中文字、滚动箭头 |
| `--color-foreground` | `#1c1a15` | `line` 未选中项 hover 文字 |
| `--color-selected` | `rgba(240,78,35,0.09)` | `card` 选中项背景 |
| `--color-hover` | `rgba(240,78,35,0.05)` | `card` 未选中项 hover 背景 |
| `--color-fill` | `#ece8de` | `card` 页签条背景、左 / 右滚动遮罩 |
| `--color-divider` | `#dfdacc` | `line` 底边框、滚动按钮边框 |
| `--color-background` | `#fff` | `line` 形态的滚动遮罩起点 |
| `--color-surface` | `#faf8f3` | 滚动按钮底色 |

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

`class` 经 `tailwind-merge` 合并到根节点，`style` 是根节点行内样式。内部样式请用 CSS 变量覆盖：

```vue
<ProTabs :options="options" class="my-2" :style="{ '--color-fill': '#2c2820' }" />
```

## 代码示例

### 基础

<Demo title="基本使用"
desc="options + v-model:active 的最小用法，只渲染页签条；禁用项点击与键盘都无法选中。"
:raw="BasicTabsRaw">

<BasicTabs />

</Demo>

### 形态

<Demo title="card / line 与 inset、rounded"
desc="type 切换卡片式与下划线式；inset 给页签条加水平内边距，rounded 把圆角改成全圆，rounded 只作用于 card。"
:raw="TabsTypeRaw">

<TabsType />

</Demo>

### 尺寸

<Demo title="small / medium / large"
desc="size 同时调整页签条高度、页签内边距、字号、图标与徽标尺寸；三种尺寸使用同一份 options。"
:raw="TabsSizeRaw">

<TabsSize />

</Demo>

### 内容面板

<Demo title="面板与 keepAlive / lazy"
desc="panel 插槽渲染内容；切到 keepAlive + lazy 后，访问过的面板保留输入状态，未访问的不提前挂载。"
:raw="TabsPanelsRaw">

<TabsPanels />

</Demo>

### 徽标

<Demo title="数字、红点与自定义徽标"
desc="badge 支持数字、'dot' 与返回 VNode 的函数；数字超过 badgeMax 显示 99+，选项级 badgeMax 可单独覆盖。"
:raw="TabsBadgeAdvancedRaw">

<TabsBadgeAdvanced />

</Demo>

### 关闭页签

<Demo title="可关闭页签"
desc="非受控 + closable：关闭只抛 close(key)，由外部从 options 中移除；关掉当前选中项后组件自动落到最后一个仍存在的页签。"
:raw="TabsClosableRaw">

<TabsClosable />

</Demo>

### 新增、拖拽与重命名

<Demo title="编辑器式页签"
desc="addable + draggable + renamable 组合；首页通过页签级 closable=false 固定，拖拽与重命名结果由外部写回 options。"
:raw="TabsEditableRaw">

<TabsEditable />

</Demo>

### 滚动与实例方法

<Demo title="溢出滚动与 scrollTo"
desc="14 个页签溢出时出现左右箭头；通过 ref 调用 scrollTo / scrollActive / scrollBy 控制滚动位置。"
:raw="TabsScrollRaw">

<TabsScroll />

</Demo>

### 自定义渲染

<Demo title="选项级与组件级 render"
desc="选项级 render 只替换一个页签的内容区，组件级 render 对所有页签生效且优先级更低。"
:raw="TabsRenderRaw">

<TabsRender />

</Demo>

### 异步数据

<Demo title="异步到达的页签"
desc="非受控且未传 default-active：options 为空时页签条仍占最小高度，数据到达后自动选中第一项。"
:raw="TabsAsyncRaw">

<TabsAsync />

</Demo>

### 路由联动

<Demo title="route + router 适配"
desc="route 作为选中来源，点击时调用 router.push(key)。示例使用本地替身，真实项目直接传 useRouter()。"
:raw="TabsRouterRaw">

<TabsRouter />

</Demo>

### 虚拟滚动

<Demo title="200 个页签按窗口渲染"
desc="virtual='auto' 在页签数达到 virtualThreshold 时自动开启，只渲染可视窗口 ± virtualOverscan，预留占位宽度保持滚动条。"
:raw="TabsVirtualRaw">

<TabsVirtual />

</Demo>

### 异步面板

<Demo title="panelLoader 与重试"
desc="面板首次激活时执行 loader，内置加载中 / 失败 / 重试三态；结果按 key 缓存，「不稳定源」首次失败后可手动重试。"
:raw="TabsAsyncPanelsRaw">

<TabsAsyncPanels />

</Demo>

### 右键菜单

<Demo title="关闭当前 / 其他 / 右侧 / 全部"
desc="context-menu 打开内置菜单，四个命令按可关闭性与位置自动置灰；组件只抛事件，options 仍由外部维护。"
:raw="TabsContextMenuRaw">

<TabsContextMenu />

</Demo>

### 跨容器拖拽

<Demo title="dragGroup + transfer"
desc="两个容器共用 drag-group；跨列落位时目标容器抛 transfer，示例把页签从来源数组搬到目标数组。"
:raw="TabsCrossDragRaw">

<TabsCrossDrag />

</Demo>

### 路由标题自动填充

<Demo title="routeTitle 与临时页签"
desc="当前 route 不在 options 中时，按 routeTitle 生成一个不可关闭的临时页签，并抛 route-enter 供外部落库。"
:raw="TabsRouteTitleRaw">

<TabsRouteTitle />

</Demo>

## 进阶用法

### 与 ProLayout 组合多标签页

用一份 `active` 同时驱动页签与菜单高亮：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { MenuOption } from 'naive-ui'
import { ProLayout, ProTabs } from '@banmao/procomponent'

const menus: MenuOption[] = [
  { label: '首页', key: '/home' },
  { label: '表格', key: '/table' },
]

const tabs = ref([{ label: '首页', key: '/home', closable: false }])
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

完整说明见 [ProLayout - 多标签页](/procomponent/ProLayout#多标签页)。

### 路由驱动的选中态

需要「路由是唯一真相」时，用 `route` + `router`，不要同时用 `v-model:active`：

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

如果页签需要缓存，页面级缓存仍建议交给 `<router-view>` 外层的 `<keep-alive>`；组件的 `keepAlive` 只作用于它自己渲染的面板。

### 页签条右侧固定工具区

`default` 插槽与新增按钮都在滚动容器内，会随页签一起滚动。需要固定右侧工具区时，把 ProTabs 放进 `flex-1 min-w-0` 容器并排：

```vue
<template>
  <div class="flex items-center gap-2">
    <div class="flex-1 min-w-0">
      <ProTabs v-model:active="active" :options="tabs" />
    </div>
    <div class="shrink-0"><!-- 固定工具区 --></div>
  </div>
</template>
```

外层 `flex-1 min-w-0` 不能省，否则页签条不会收缩，横向滚动失效。

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| options | 页签数组，见 [TabOption](#taboption)；监听引用变化 | `TabOption[]` | `[]` |
| active | 选中的 `key`，受控，优先级最高；空字符串表示不参与 | `string` | `''` |
| defaultActive | 非受控时的初始选中 `key`，只在初始化读一次 | `string` | `''` |
| route | 路由路径，非空时作为选中来源（`active > route > 内部状态`） | `string` | `''` |
| router | 路由适配器，点击页签时调用 `push(key)` | `{ push(to: string): unknown }` | - |
| type | 形态：`card` / `line` | `'card' \| 'line'` | `'card'` |
| size | 尺寸档位，见[尺寸](#尺寸) | `'small' \| 'medium' \| 'large'` | `'medium'` |
| showBadge | 是否渲染旧版数字徽标，还需选项上有 `dot` | `boolean` | `false` |
| badgeMax | 数字徽标溢出阈值，超过显示 `${max}+` | `number` | `99` |
| icon | 组件级默认图标名（`@iconify/vue`），选项级优先 | `string` | `''` |
| closable | 是否渲染关闭按钮；页签级 `closable` 覆盖它 | `boolean` | `false` |
| closeLabel | 关闭按钮无障碍名称前缀 | `string` | `'关闭'` |
| inset | 页签条是否加水平内边距 | `boolean` | `false` |
| rounded | 是否全圆角，**只作用于 card** | `boolean` | `false` |
| addable | 是否渲染内置新增按钮 | `boolean` | `false` |
| addLabel | 新增按钮文案与无障碍名称 | `string` | `'新增页签'` |
| addIcon | 新增按钮图标（Iconify 名称） | `string` | `'hugeicons:add-01'` |
| draggable | 是否允许拖拽排序 | `boolean` | `false` |
| renamable | 是否允许双击重命名 | `boolean` | `false` |
| scrollButtons | 溢出时是否显示左右滚动按钮 | `boolean` | `true` |
| scrollLeftLabel | 左滚动按钮无障碍名称 | `string` | `'向左滚动'` |
| scrollRightLabel | 右滚动按钮无障碍名称 | `string` | `'向右滚动'` |
| keepAlive | 切走后保留已挂载的面板 | `boolean` | `false` |
| lazy | `keepAlive` 时面板首次激活才挂载 | `boolean` | `false` |
| panelClass | 面板容器附加类名 | `string` | `'mt-3'` |
| panelLoader | 面板异步加载器，选项级优先；存在静态渲染来源时忽略 | `(option: TabOption) => Promise<VNode \| VNode[]>` | - |
| panelLoadingText | 面板加载中文案 | `string` | `'加载中…'` |
| panelErrorText | 面板加载失败文案 | `string` | `'加载失败'` |
| panelRetryText | 面板重试按钮文案 | `string` | `'重试'` |
| virtual | 虚拟滚动：`true` 强制开启，`'auto'` 达到阈值开启；开启后拖拽不生效 | `boolean \| 'auto'` | `false` |
| virtualThreshold | `'auto'` 模式下的最小页签数 | `number` | `100` |
| virtualOverscan | 可视窗口两侧额外渲染的页签数 | `number` | `3` |
| contextMenu | 是否启用内置右键菜单 | `boolean` | `false` |
| contextMenuLabels | 右键菜单文案 | `{ close?; closeOthers?; closeRight?; closeAll? }` | `{}` |
| dragGroup | 拖拽分组，字符串等价于 `{ name, pull: true, put: true }` | `string \| { name; pull?; put? }` | - |
| routeTitle | 当前 `route` 不在 `options` 中时，生成临时页签的标题 | `string \| ((route: string) => string)` | - |
| render | 组件级页签内容渲染，优先级低于选项级 `render` | `(option: TabOption) => VNode` | - |
| renderPanel | 组件级面板渲染，优先级最低 | `(option: TabOption) => VNode` | - |
| class | 追加到根节点的类名，经 `tailwind-merge` 合并 | `string` | `''` |
| style | 根节点行内样式，可写 CSS 变量 | `Record<string, any>` | `{}` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:active | 点击、`Enter` / `Space` 或方向键选中页签时触发；内部回退不触发 | `(key: string) => void` |
| close | 点击关闭按钮时触发；不修改 `options`，不会顺带选中 | `(key: string) => void` |
| add | 点击内置新增按钮时触发；不修改 `options` | `() => void` |
| reorder | 拖拽结束或 `Alt+方向键` 排序时触发；不修改 `options` | `(keys: string[], from: number, to: number) => void` |
| rename | 重命名提交且发生变化时触发；不修改 `options` | `(key: string, label: string) => void` |
| close-others | 右键菜单「关闭其他」；不修改 `options` | `(key: string) => void` |
| close-right | 右键菜单「关闭右侧」；不修改 `options` | `(key: string) => void` |
| close-all | 右键菜单「关闭全部」；不修改 `options` | `() => void` |
| transfer | 跨容器落位时由目标容器触发；外部负责搬运 `options` | `(payload: { key; from; to; index }) => void` |
| route-enter | `routeTitle` 生成临时页签时触发，可用于写入 `options` | `(route: string, title: string) => void` |
| panel-loaded | `panelLoader` 成功完成 | `(key: string) => void` |
| panel-error | `panelLoader` 抛错 | `(key: string, error: unknown) => void` |

模板中写 `@update:active`、`@close`、`@add`、`@reorder`、`@rename`、`@close-others`、`@close-right`、`@close-all`、`@transfer`、`@route-enter`、`@panel-loaded`、`@panel-error`。没有 `change` / `tab-click` 等别名事件。

### Expose

| 名称 | 说明 |
| --- | --- |
| `activeKey` | 当前选中的 key（只读） |
| `scrollTo(target, behavior?)` | 滚到指定 key / 索引，默认 `smooth` |
| `scrollActive(behavior?)` | 滚到当前选中页签 |
| `scrollBy(delta)` | 相对横向滚动 |
| `focus()` | 聚焦当前 roving 页签 |
| `getEl()` | 获取横向滚动容器 |
| `reloadPanel(key)` | 重新执行指定页签的 `panelLoader` |

### Slots

| 名称 | 说明 | 插槽参数 |
| --- | --- | --- |
| default | 排在所有页签与新增按钮之后、同一个 `tablist` 容器内，随页签横向滚动 | 无 |
| panel | 内容面板；只要提供该插槽就会渲染面板容器 | `{ option: TabOption, active: boolean }` |
| panel-loading | 覆盖内置加载态 | `{ option: TabOption }` |
| panel-error | 覆盖内置错误态 | `{ option: TabOption, error: Error, retry: () => void }` |

### TabOption

| 字段 | 说明 | 类型 | 必填 |
| --- | --- | --- | --- |
| key | 页签唯一标识，建议直接用路由 path | `string` | 是 |
| label | 页签文案；内置渲染下会截断，也用于关闭按钮名称 | `string` | 是 |
| disabled | 禁用：点击、键盘与拖拽都不生效，`tabindex=-1` | `boolean` | 否 |
| dot | 旧版数字徽标，需 `showBadge`；`badge` 存在时被忽略 | `number` | 否 |
| badge | 徽标：数字、`'dot'` 或返回 VNode 的函数 | `number \| 'dot' \| ((option) => VNode)` | 否 |
| badgeMax | 该页签的数字徽标阈值，覆盖组件级 `badgeMax` | `number` | 否 |
| icon | 该页签图标，空字符串回退到组件级 `icon` | `string` | 否 |
| closable | 是否渲染关闭按钮，覆盖组件级 `closable` | `boolean` | 否 |
| id | ARIA id 的稳定标识，不传时用 `key` | `string` | 否 |
| render | 该页签内容区渲染，优先级最高 | `(option: TabOption) => VNode` | 否 |
| renderPanel | 该页签面板渲染，优先级最高 | `(option: TabOption) => VNode` | 否 |
| panelLoader | 该页签面板异步加载器，存在静态渲染来源时忽略 | `(option: TabOption) => Promise<VNode \| VNode[]>` | 否 |

```ts
const options = [
  { label: '概览', key: 'overview', icon: 'hugeicons:home-01', badge: 8 },
  { label: '告警', key: 'alarm', badge: 'dot' },
  { label: '已归档', key: 'archived', disabled: true, closable: false },
]
```

> `key` 必须是 `string`（`ProLayout` 的 `MenuOption.key` 允许 `number`，混用时请 `String(key)`）。

### 类型导出

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

## 常见问题

**点了页签但高亮不变？**
传了 `:active` 就是受控，组件不会自行改选中态；传了 `:route` 时高亮跟随路由。请用 `v-model:active`，或确保路由真的跳转成功。

**`default-active` 改了没反应？**
它只在初始化时读一次；之后请写 `active` 或让组件自己维护。

**关掉页签后组件没反应？**
`closable` 只抛 `close(key)`，必须自己在事件里移除；删掉当前选中项后还要决定选中谁。

**拖拽后顺序又弹回去了？**
组件不改 `options`，请在 `reorder(keys)` 里按 `keys` 重排并整体替换数组。

**重命名后文字没变？**
同理，`rename(key, label)` 只抛事件；请在外部更新对应选项的 `label`。

**新增按钮点了没反应？**
`addable` 只抛 `add`，需要外部追加选项；组件不持有 `options` 的所有权。

**面板不渲染？**
需要提供 `panel` 插槽、组件级 `renderPanel` 或任一选项的 `renderPanel` 之一。只传 `keepAlive` 不会创建面板。

**`lazy` 没效果？**
`lazy` 只在 `keepAlive=true` 时生效；`keepAlive=false` 时面板本来就会随切换卸载。

**切回页签后输入内容丢了？**
默认 `keepAlive=false`。需要保留 DOM 状态请开 `keepAlive`，并按需加 `lazy`。

**滚动箭头不出现？**
只有 `scrollWidth > clientWidth` 时出现；`scrollButtons=false` 会完全关闭。容器宽度变化由 `ResizeObserver` 监听。

**方向键为什么跳过了某项？**
方向键只在**可用**页签间移动；禁用项不参与循环。

**关闭按钮读屏是英文？**
旧版本固定 `close {label}`；当前版本用 `closeLabel`（默认「关闭」），可按语言环境传入。

**徽标不显示？**
旧写法需要 `show-badge` + `dot`；新写法直接用 `badge`。`badge: 0` 会显示 0，`'dot'` 显示红点。用了 `render` 则内置徽标不再渲染。

**`rounded` 在 `line` 下没效果？**
`rounded` 只作用于 card。

**深色页面里页签条还是浅色？**
配色走 CSS 变量，组件库没有定义变量。请由宿主提供 `--color-fill`、`--color-surface` 等，见[配色与主题](#配色与主题)。

**虚拟滚动下拖拽没反应？**
虚拟滚动与拖拽互斥，开启 `virtual` 后 `draggable` 会被忽略，并在开发环境打印一次提示。

**右键菜单没出现？**
需要显式开启 `context-menu`；菜单只在页签上触发，聚焦页签后按 `Shift+F10` 也可以打开。

**跨容器拖拽后页签没动？**
`transfer` 只抛事件，不会修改任何 `options`。请在目标容器的 `@transfer` 里按 `key` 从来源数组移除并插入目标数组；两个容器可共用同一个 `drag-group`，此时 `from === to` 属正常。

**`panelLoader` 没有执行？**
只要存在任一静态渲染来源（选项 `renderPanel`、`panel` 插槽、组件 `renderPanel`），`panelLoader` 就会被忽略；另外 `keepAlive + lazy` 下只有访问过的面板才会加载。

**`routeTitle` 没生成临时页签？**
仅当同时传入 `route` 与 `routeTitle`，且 `route` 不在 `options` 中时生效。把 `route-enter` 里的路由写回 `options` 后，临时页签会被真实页签替换。

## 行为约定

- 组件不持有 `options` 的所有权：关闭、排序、重命名、新增、跨容器搬运都由外部写回数组。
- 虚拟滚动开启时拖拽自动失效；需要在数百页签下拖拽时，请关闭虚拟滚动或改用其他交互。
- 面板渲染优先级：选项 `renderPanel` → `panel` 插槽 → 组件 `renderPanel` → 选项 `panelLoader` → 组件 `panelLoader`。
- 由 `routeTitle` 生成的临时页签不可关闭、不可拖拽，也不参与关闭其他 / 右侧 / 全部。
- 右键菜单只负责按语义抛事件，不直接修改 `options`；不可关闭的页签会被所有关闭命令跳过。
- 跨容器拖拽以 `dragGroup` 的 `pull` / `put` 为准；目标容器抛 `transfer`，源容器不再抛 `reorder`。
