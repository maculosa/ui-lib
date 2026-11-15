---
name: ProTabs
desc: ProTabs 是配置驱动的选项卡条组件，提供 card / line 两种形态、受控与非受控选中态、数字徽标、图标、可关闭页签与自定义渲染，只负责页签条本身，内容区由使用方决定。
---

<route lang="yaml">
meta:
  layout: default
</route>

# ProTabs

ProTabs 是**选项卡条**组件：用 `options` 配置页签，用 `active` 持有选中项，点击抛 `update:active`，关闭抛 `close`。它**只渲染页签条**，不渲染内容区、不做页签缓存、不依赖 `vue-router`——内容区放什么、要不要 `keep-alive`、页签怎么和路由对应，全部由使用方决定。

当前文档对应仓库源码。

> **版本提示**：`0.7.31` 中 `ProTabs` 只有一个未完成的源码目录，**没有从包入口导出**，无法 `import { ProTabs } from '@banmao/procomponent'`；`render` 的默认值还会返回一个非法 VNode。下一个发布版本才可用，本页描述的是该版本的行为。

## 特性

- **配置式页签**：`options` 数组驱动，`label` + `key` 即可，支持禁用项
- **两种形态**：`type="card"` 卡片式（默认）/ `type="line"` 下划线式
- **受控与非受控**：`v-model:active` 外部持有选中态；不传 `active` 时由组件内部维护，`defaultActive` 指定初始值
- **数字徽标**：`showBadge` + 选项上的 `dot`，`dot: 0` 也会渲染
- **图标**：组件级 `icon` 作为默认图标，选项级 `icon` 覆盖它，走 `@iconify/vue`
- **可关闭**：`closable` 渲染关闭按钮并抛 `close(key)`，移除动作由外部完成
- **自定义渲染**：选项级 `render` 优先于组件级 `render`，只替换内容区，点击与选中态仍由组件负责
- **横向滚动**：页签放不下时横向滚动，滚动条隐藏，页签本身不被压缩
- **键盘可达**：每个页签 `role="tab"` + `tabindex`，Enter / Space 激活，禁用项移出 Tab 序列
- **样式可注入**：`class` / `style` 作用于根节点，`class` 经 `tailwind-merge` 合并；配色走 CSS 变量，宿主可换肤

## 何时使用

- 内容区需要在几个平级视图之间切换，且切换逻辑由你自己掌握
- 中后台的**多标签页**骨架：配合 [ProLayout](/procomponent/ProLayout) 用一份 `active` 同时驱动页签与菜单高亮
- 页签来自后端接口、需要动态增删的场景
- 需要在页签上展示计数徽标、状态点或自定义内容

以下场景当前版本**不适合**：

- 需要「页签 + 内容面板」一体化封装与页签缓存（`keep-alive`）——请直接用 Naive UI 的 `NTabs`
- 需要页签拖拽排序、右键菜单、双击重命名等编辑器级交互
- 需要方向键在页签间移动焦点（当前只支持 Tab 与 Enter / Space）

## 快速上手

### 安装

```script-tabs
@banmao/procomponent
```

### 按需引入

```vue
<script setup>
import { ProTabs } from '@banmao/procomponent'
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

`options` 是页签数组，`v-model:active` 持有选中的 `key`。**组件只有页签条**，内容区要自己写：

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

  <div class="p-4">
    <p v-if="active === 'overview'">概览内容</p>
    <p v-else-if="active === 'detail'">明细内容</p>
    <p v-else>日志内容</p>
  </div>
</template>
```

不传 `active` 就是非受控，组件自己维护高亮，初始值取 `defaultActive`，没传则取 `options[0].key`：

```vue
<ProTabs :options="options" default-active="detail" @update:active="key => console.log(key)" />
```

## 核心概念

### 结构

```text
div  ← 根节点：relative flex w-full + class prop，style prop 作用于这里
└── div[role="tablist"]  ← flex items-center gap-1 flex-1 min-w-0 min-h-[40px] overflow-x-auto
    │                      滚动条隐藏（scrollbar-width: none + ::-webkit-scrollbar）
    │                      card：背景 --color-fill + 圆角；line：底边框 --color-divider
    │                      inset 为 true 时 px-1，否则 px-0
    ├── div[role="tab"] × options.length  ← shrink-0 px-3 text-sm，card 高 32px，line 撑满 40px
    │   ├── 内容区    option.render > props.render > 内置（图标 + label + 徽标）
    │   ├── 关闭按钮  closable 时渲染，<button aria-label="close {label}">
    │   └── 下划线    line 且选中时渲染，absolute bottom-0 h-[2px]
    └── default 插槽内容（排在所有页签之后）
```

尺寸一览：

| 部位 | 值 | 说明 |
| --- | --- | --- |
| 页签条最小高度 | 40px | `min-h-[40px]`，不可配置 |
| card 页签高度 | 32px | `h-8`，在 40px 条内垂直居中 |
| line 页签高度 | 40px | `self-stretch`，撑满页签条 |
| 页签水平内边距 | 12px | `px-3`，不可配置 |
| 页签间距 | 4px | `gap-1` |
| 图标尺寸 | 16px | `text-[16px]` |
| 徽标 | 18px 高，最小宽 18px | `text-[11px]`，圆形，强调色底 + 白字 |
| 关闭图标尺寸 | 14px | `text-[14px]` |
| 下划线厚度 | 2px | 仅 `line` 选中态 |
| 圆角 | 2px / 全圆 | 默认 `rounded-[2px]`，`rounded` 为 true 时 `rounded-full`，**只作用于 card** |

页签是 `shrink-0`，**不会被压缩**；总宽超出容器时页签条横向滚动。滚动条被隐藏，也没有左右箭头按钮，需要提示用户可滚动时请自行加渐变遮罩。

### 选中态模型

选中项由 `props.active || innerActive` 决定，因此**空字符串 `''` 表示非受控**：

| 写法 | 行为 |
| --- | --- |
| `v-model:active="active"` | 受控：高亮始终等于外部值，点击抛 `update:active` 由外部回写 |
| `:active="active"` 不接事件 | 高亮**停在传入值**，点击只抛事件不改高亮 |
| 不传 `active` | 非受控：组件内部维护高亮，点击自动切换，同时抛 `update:active` |
| 不传 `active` + `default-active` | 非受控，初始选中 `defaultActive` |
| 不传 `active` 也不传 `defaultActive` | 非受控，初始选中 `options[0].key`；`options` 为空时为 `''`（无高亮） |

`defaultActive` **只在初始化时读一次**，之后改它不会改变选中态。

点击页签时组件**总是**先写内部状态再抛 `update:active`，受控模式下外部不回写就等于没切换——这点与 `ProLayout` 的 `menuValue` 一致。

非受控下 `options` 变化时有一条回退规则，避免选中态悬空：

| 情况 | 结果 |
| --- | --- |
| 当前选中项仍在新 `options` 里 | 保持不变 |
| 选中项消失（例如被关掉），且原来有选中项 | 落到**最后一个**仍存在的页签 |
| 原来没有选中项（例如 `options` 异步到达） | 落到**第一项** |
| 新 `options` 为空数组 | 选中态变为 `''`，无高亮 |

三点要注意：

- 这条回退**不抛 `update:active`**，外部监听不到；只有用户点击才抛事件
- 监听的是 `options` 的**引用变化**，`tabs.value.push(...)` / `splice(...)` 这类就地修改不会触发回退，请整体替换数组
- 受控模式（`active` 非空）下组件**不做任何回退**，选中项被删掉后的高亮归属完全由外部负责

### 增删页签

`closable` 只负责渲染关闭按钮并抛 `close(key)`，**不会自己从 `options` 里删项**——`options` 是外部传入的数组，组件不改它。删除、以及删掉当前页签后选中谁，都由外部决定：

```vue
<script setup>
import { ref } from 'vue'
import { ProTabs } from '@banmao/procomponent'

const tabs = ref([{ label: '首页', key: '/home' }])
const active = ref('/home')

function closeTab(key) {
  const index = tabs.value.findIndex(tab => tab.key === key)
  if (index === -1) return
  const next = tabs.value.filter(tab => tab.key !== key)
  tabs.value = next
  // 关的不是当前页签就不动 active；否则落到相邻页签，全关时置空
  if (active.value !== key) return
  active.value = next[Math.min(index, next.length - 1)]?.key ?? ''
}
</script>

<template>
  <ProTabs v-model:active="active" :options="tabs" closable @close="closeTab" />
</template>
```

关闭按钮内部 `stopPropagation`，所以**点关闭不会顺带选中该页签**。新增页签没有内置按钮，用 `default` 插槽自己放（见[页签条右侧扩展](#页签条右侧扩展)）。

### 自定义渲染

内容区的渲染优先级是 **选项级 `render` > 组件级 `render` > 内置渲染**：

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

- `render` 的入参是该页签的 `TabOption`，返回值替换**整个内容区**（图标、文案、徽标都不再渲染）
- **只替换内容区**：选中态、点击、键盘激活、关闭按钮与 `line` 下划线仍由组件负责，不需要自己绑事件
- 返回 `null` / `undefined` 等空值时回退到下一级；选项级返回空值会落到组件级 `render`，组件级也返回空值则用内置渲染
- 用了 `render` 就不会渲染 `dot` 徽标，需要徽标请自己画
- 组件级 `render` 对所有页签生效，适合统一改成「显示 key」「显示图标 + 计数」这类形态

### 配色与主题

ProTabs **不跟随 Naive UI 主题**，配色全部走 CSS 变量 + 兜底值。宿主应用定义了同名变量即可换肤，没定义就用兜底的浅色配色：

| CSS 变量 | 兜底值 | 作用 |
| --- | --- | --- |
| `--color-accent` | `#f04e23` | 选中文字、徽标底色、`line` 下划线 |
| `--color-foreground-secondary` | `#57534a` | 未选中文字 |
| `--color-foreground` | `#1c1a15` | `line` 未选中项的 hover 文字 |
| `--color-selected` | `rgba(240,78,35,0.09)` | `card` 选中项背景 |
| `--color-hover` | `rgba(240,78,35,0.05)` | `card` 未选中项 hover 背景 |
| `--color-fill` | `#ece8de` | `card` 页签条背景 |
| `--color-divider` | `#dfdacc` | `line` 页签条底边框 |

```css
/* 宿主应用里定义即可，暗色主题给另一组值 */
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

> 组件库自身的样式只 `@import 'tailwindcss'`，**没有定义这些变量**，所以默认渲染出来就是兜底的浅色配色。深色页面里请由宿主提供变量，或用 `class` 覆盖（见下）。

`class` 经 `tailwind-merge` 合并到根节点，`style` 是根节点行内样式。要改页签条背景这类内部样式，`class` 覆盖不到（它在子节点上），请用 CSS 变量：

```vue
<ProTabs :options="options" class="my-2" :style="{ '--color-fill': '#2c2820' }" />
```

## 代码示例

### 基础

<Demo title="基本使用"
desc="options + v-model:active 的最小用法，内容区由外部按 active 自行渲染；禁用项点击与键盘都无法选中。"
:raw="BasicTabsRaw">

<BasicTabs />

</Demo>

### 形态

<Demo title="card / line 与 inset、rounded"
desc="type 切换卡片式与下划线式；inset 给页签条加 4px 水平内边距，rounded 把圆角改成全圆，rounded 只作用于 card。"
:raw="TabsTypeRaw">

<TabsType />

</Demo>

### 徽标与图标

<Demo title="数字徽标与图标"
desc="showBadge 开启后渲染选项上的 dot，dot 为 0 也显示；组件级 icon 作为默认图标，选项级 icon 覆盖它。"
:raw="TabsBadgeRaw">

<TabsBadge />

</Demo>

### 关闭页签

<Demo title="可关闭页签"
desc="非受控 + closable：关闭只抛 close(key)，由外部从 options 中移除；关掉当前选中项后组件自动落到最后一个仍存在的页签，全部关掉后选中态为空字符串。"
:raw="TabsClosableRaw">

<TabsClosable />

</Demo>

### 自定义渲染

<Demo title="选项级与组件级 render"
desc="选项级 render 只替换「运行中」的内容区，组件级 render 对所有页签生效且优先级更低；两者都只接管内容区，点击与选中态仍由 ProTabs 负责。"
:raw="TabsRenderRaw">

<TabsRender />

</Demo>

### 异步数据

<Demo title="异步到达的页签"
desc="非受控且未传 default-active：options 为空时页签条仍占 40px，数据到达后自动选中第一项；这种内部回退不抛 update:active。"
:raw="TabsAsyncRaw">

<TabsAsync />

</Demo>

## 进阶用法

### 与 ProLayout 组合多标签页

中后台常见的「点菜单开页签、切页签换内容」，用一份 `active` 同时驱动两个组件即可，菜单高亮自然跟随当前页签：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { MenuOption } from 'naive-ui'
import { ProLayout, ProTabs } from '@banmao/procomponent'

const menus: MenuOption[] = [
  { label: '首页', key: '/home' },
  { label: '表格', key: '/table' },
]

const tabs = ref([{ label: '首页', key: '/home' }])
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

`content-class="p-0"` 让页签条贴住内容区边缘，`h-full flex flex-col min-h-0` 保证内容区正确滚动。完整说明见 [ProLayout - 多标签页](/procomponent/ProLayout#多标签页)。

### 联动路由

ProTabs 不依赖 `vue-router`。把 `active` 绑成路由 path、在 `update:active` 里跳转，再用 `watch` 把路由变化同步回来即可：

```vue
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ProTabs } from '@banmao/procomponent'

const route = useRoute()
const router = useRouter()

const tabs = ref([{ label: '首页', key: '/home' }])
const active = ref(route.path)

// 直达 / 刷新时补齐页签
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

这里用 `:active` + `@update:active` 而不是 `v-model`：选中态的唯一来源是路由，点击只负责跳转，路由变化后再回流成高亮。页签缓存交给 `keep-alive`，ProTabs 不参与。

> `active` 必须是可写的 `ref`。若写成 `computed(() => route.path)`，就只能用 `:active` 单向绑定，不能再用 `v-model:active`。

### 页签条右侧扩展

`default` 插槽排在所有页签之后、同一个 `tablist` 容器内，适合放「新增页签」按钮或右侧工具区：

```vue
<template>
  <ProTabs v-model:active="active" :options="tabs" closable @close="closeTab">
    <button
      type="button"
      class="shrink-0 px-2 text-sm opacity-60 hover:opacity-100"
      @click="addTab"
    >
      + 新增
    </button>
  </ProTabs>
</template>
```

插槽内容跟着页签条一起横向滚动，**不会**固定在右侧。需要固定右侧的工具区，请把 ProTabs 与工具区并排放进一个 flex 容器：

```vue
<template>
  <div class="flex items-center gap-2">
    <div class="flex-1 min-w-0">
      <ProTabs v-model:active="active" :options="tabs" />
    </div>
    <div class="shrink-0">
      <!-- 固定右侧的工具区 -->
    </div>
  </div>
</template>
```

外层 `flex-1 min-w-0` 不能省，否则页签条不会收缩，横向滚动失效。

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| options | 页签数组，见 [TabOption](#taboption)；监听引用变化，就地修改不触发回退 | `TabOption[]` | `[]` |
| active | 选中的 `key`，受控；**空字符串表示非受控**。支持 `v-model:active` | `string` | `''` |
| defaultActive | 非受控时的初始选中 `key`，只在初始化读一次；未传时取 `options[0].key` | `string` | `''` |
| type | 形态：`card` 卡片式 / `line` 下划线式 | `'card' \| 'line'` | `'card'` |
| showBadge | 是否渲染数字徽标，还需选项上有 `dot` | `boolean` | `false` |
| icon | 组件级默认图标名（`@iconify/vue`），选项级 `icon` 优先 | `string` | `''` |
| closable | 是否渲染关闭按钮；只抛 `close`，不修改 `options` | `boolean` | `false` |
| inset | 页签条是否加 4px 水平内边距 | `boolean` | `false` |
| rounded | 是否全圆角，**只作用于 `card`** | `boolean` | `false` |
| render | 组件级自定义渲染，优先级低于选项级 `render`，见[自定义渲染](#自定义渲染) | `(option: TabOption) => VNode` | - |
| class | 追加到根节点的类名，经 `tailwind-merge` 合并，**只接受字符串** | `string` | `''` |
| style | 根节点行内样式，可用来写 CSS 变量 | `Record<string, any>` | `{}` |

以上属性均已消费。`TabOption` / `ProTabsProps` 类型未从包入口导出，需要标注类型时请自行声明同形结构。

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:active | 点击（或 Enter / Space 激活）非禁用页签时触发，配合 `active` 实现 `v-model:active`；组件内部的选中态回退**不触发** | `(key: string) => void` |
| close | 点击关闭按钮时触发，参数是该页签的 `key`；**不会**自动选中该页签，也不会修改 `options` | `(key: string) => void` |

模板中写 `@update:active`、`@close`。没有 `add` / `change` / `tab-click` 等别名事件。

### Slots

| 名称 | 说明 | 插槽参数 |
| --- | --- | --- |
| default | 排在所有页签之后、同一个 `tablist` 容器内，随页签条一起横向滚动 | 无 |

只有这一个插槽，**不接收参数**。没有内容区插槽——ProTabs 不渲染内容面板。

### TabOption

`options` 的元素类型：

| 字段 | 说明 | 类型 | 必填 |
| --- | --- | --- | --- |
| key | 页签唯一标识，建议直接用路由 path | `string` | 是 |
| label | 页签文案；内置渲染下会 `truncate`，也用于关闭按钮的 `aria-label` | `string` | 是 |
| disabled | 禁用该页签：点击与 Enter / Space 都不选中，`tabindex` 为 -1 | `boolean` | 否 |
| dot | 数字徽标内容，需同时开启 `showBadge`；`0` 也会渲染 | `number` | 否 |
| icon | 该页签的图标名，覆盖组件级 `icon`；空字符串回退到组件级 | `string` | 否 |
| render | 该页签的内容区渲染函数，优先级高于组件级 `render` | `(option: TabOption) => VNode` | 否 |

```ts
const options = [
  { label: '概览', key: 'overview', icon: 'hugeicons:home-01', dot: 8 },
  { label: '明细', key: 'detail', dot: 0 },
  { label: '已归档', key: 'archived', disabled: true },
]
```

> `key` 必须是 `string`（与 `ProLayout` 的 `MenuOption.key` 不同，后者允许 `number`）。混用时请 `String(key)` 转换。没有 `closable` 字段，关闭是组件级开关，不能按页签单独控制。

## 常见问题

**点了页签但高亮不变？**
传了 `:active` 就是受控，组件不会自行改选中态。请用 `v-model:active`，或在 `@update:active` 里自己赋值。

**`default-active` 改了没反应？**
它只在初始化时读一次。之后要改选中态请写 `active`（受控）或让组件自己维护（非受控）。

**关掉页签后组件没反应？**
`closable` 只抛 `close(key)`，`options` 由你持有，必须自己在事件里移除。删掉当前选中项后还要决定选中谁，见[增删页签](#增删页签)。

**关掉当前页签后为什么选中了最后一个？**
这是非受控下的回退规则：选中项消失时落到最后一个仍存在的页签。受控模式下组件不做回退，归属由你决定。

**页签是异步加载的，为什么一开始没有高亮？**
`options` 为空时选中态是 `''`。数据到达后组件会自动选中第一项，但**不抛 `update:active`**，所以外部变量不会同步；需要外部也知道选中项时请改用受控模式。

**`tabs.value.push(...)` 之后回退规则没生效？**
监听的是数组引用变化，就地修改不触发。请整体替换：`tabs.value = [...tabs.value, newTab]`。

**徽标不显示？**
需要同时满足 `show-badge` 为 `true` 且选项上有 `dot`。`dot: 0` 会显示「0」；用了 `render` 则徽标不再渲染，要自己画。

**图标不显示？**
`icon` 是 `@iconify/vue` 的图标名（如 `hugeicons:home-01`），图标数据按需从 Iconify 加载，离线环境需要自行预置。选项级 `icon` 为空字符串时会回退到组件级 `icon`。

**`rounded` 在 `line` 下没效果？**
`rounded` 只作用于 `card`。`line` 形态是底边框 + 下划线，没有圆角容器。

**页签太多挤在一起？**
页签是 `shrink-0`，不会被压缩，超出宽度时页签条横向滚动（滚动条隐藏）。需要固定右侧的工具区，请把 ProTabs 放进 `flex-1 min-w-0` 容器再与工具区并排，见[页签条右侧扩展](#页签条右侧扩展)。

**深色页面里页签条还是浅色？**
ProTabs 不跟随 Naive UI 主题，配色走 CSS 变量，组件库没有定义这些变量，默认用浅色兜底值。请由宿主提供 `--color-fill` 等变量，见[配色与主题](#配色与主题)。

**`class` 改不了页签条背景？**
`class` 落在根节点，页签条背景在子节点上。请用 CSS 变量（可写在 `style` 里）。

**内容区怎么不渲染？**
ProTabs 只有页签条，没有内容面板。内容区请按 `active` 自行渲染，需要缓存请配合 `keep-alive`。

## 已知限制

ProTabs 定位是「可配置的页签条」，以下能力**不在组件内**，选型时请避开：

| 能力 | 说明 |
| --- | --- |
| 内容面板与缓存 | 不渲染内容区、不做 `keep-alive`；需要一体化封装请用 `NTabs` |
| 路由集成 | 不依赖 `vue-router`，页签与路由的对应关系自行维护 |
| 方向键导航 | 只支持 Tab 聚焦与 Enter / Space 激活，没有左右方向键切换，也没有 Home / End |
| ARIA 完整性 | 有 `role="tablist"` / `role="tab"` 与 `aria-selected`，但没有 `aria-controls` 与 `tabpanel` 关联；关闭按钮的 `aria-label` 是固定英文 `close {label}` |
| 徽标形态 | 只支持数字，不支持红点、`max` 溢出省略或自定义内容（可用 `render` 自行画） |
| 按页签控制关闭 | `closable` 是组件级开关，`TabOption` 上没有 `closable` 字段 |
| 新增 / 拖拽 / 重命名 | 没有内置新增按钮、拖拽排序与双击重命名，新增可用 `default` 插槽自行实现 |
| 尺寸配置 | 页签条 40px、card 页签 32px、内边距与间距都写死，没有 `size` 属性 |
| 滚动提示 | 滚动条隐藏且没有左右箭头按钮，溢出时没有视觉提示 |
| `expose` | 没有暴露任何实例方法，选中态请写 `active` |
| 类型导出 | `TabOption` / `ProTabsProps` / `ProTabsEmits` 未从包入口导出 |