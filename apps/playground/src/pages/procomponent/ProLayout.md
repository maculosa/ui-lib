---
name: ProLayout
desc: ProLayout 是中后台页面骨架组件，提供深色顶栏、可折叠侧边菜单与内容区，支持 side / top / mix 三种布局、顶栏与侧栏定制、自定义页脚、内容区内置滚动、受控菜单选中态与自动展开、远程菜单请求与加载态、可定制的移动端抽屉菜单与实例方法。
---

<route lang="yaml">
meta:
  layout: default
</route>

# ProLayout

ProLayout 是中后台页面的**布局骨架**组件：顶部标题栏 + 菜单 + 内容区，可选页脚。菜单由 `menus` 配置生成（直接透传 Naive UI `NMenu` 的 `options`），支持 `side` / `top` / `mix` 三种布局，折叠状态可外部控制。顶栏可通过 `logo`、`titleRender`、`headerClass` 与 `header-extra` 插槽定制，侧栏与内容区可通过 `siderClass`、`siderWidth`、`contentClass`、`contentScroll` 定制，页脚内容走 `footer` 插槽并可用 `footerClass` / `footerStyle` 调整样式，菜单选中态与展开态可通过 `menuValue`、`expandedKeys` 受控，`autoExpandSelected` 默认把选中项的祖先自动展开。菜单可通过 `menu.request` 从后端拉取。传入 `mobileBreakpoint` 后，窄屏自动收起侧栏与横排菜单，改由顶栏按钮唤出抽屉；断点可按视口或容器宽度判定，抽屉的弹出方向、尺寸、插槽与开关方法均可配置。

当前文档对应仓库源码。

> **版本提示**：以下能力在已发布的 `0.7.31` 中**尚未实现**，需等待下一个发布版本：`logo`、`titleRender`、`headerClass`、`collapsedTriggerPosition`、`layout`、`menu`，`footer` 插槽、`footerClass`、`footerStyle`、`siderClass`、`siderWidth`、`contentClass`、`contentScroll`、`menu.params`、`menu.responsive` 与 `expose` 方法，`menuValue`、`expandedKeys`、`autoExpandSelected`、`menuClick`、`topMenuClick`、`update:expandedKeys`，`mobileBreakpoint`、`breakpointMode`、`drawerPlacement`、`drawerWidth`、`drawer` 插槽，以及 `openDrawer` / `closeDrawer` / `toggleDrawer` / `setMenuValue` / `setExpandedKeys` / `scrollToMenu`。同时 `MenuConfig` 的 `locale` 字段已**移除**——它在 `0.7.31` 中从未被消费，组件库尚未接入 i18n，保留只会误导；TypeScript 项目里写过 `locale` 的地方需要删掉。其余行为与 `0.7.31` 一致。

## 特性

- **三种布局模式**：`layout="side"` 左侧菜单 / `"top"` 顶部横排菜单 / `"mix"` 顶部一级 + 侧边二级
- **开箱即用的三段骨架**：顶栏（64px）+ 侧栏（展开 `siderWidth`，默认 256px；折叠宽度可配）+ 内容区，可选页脚（64px）
- **配置式菜单**：`menus` 透传 `NMenu` 的 `options`，支持图标、多级子菜单、分组、分割线、禁用项
- **受控菜单**：`menuValue` 持有选中项、`expandedKeys` 持有展开的父级，`menuClick` / `topMenuClick` / `update:expandedKeys` 抛出交互，可直接绑 `route.path` 做路由高亮
- **自动展开选中项**：`autoExpandSelected` 默认开启，初始值与后续 `menuValue` 变化都会把祖先补进展开集合，无需为深层路由手写 `expandedKeys`
- **远程菜单**：`menu.request` 挂载时拉取菜单，`menu.params` 变化自动重新请求，自带加载态与 `onLoadingChange` 回调
- **可折叠侧栏**：`collapsedTriggerPosition` 决定折叠按钮在顶栏还是侧栏底部，带 300ms 宽度过渡动画
- **折叠状态可外部控制**：`collapsed` 属性 + `collapseChange` 事件，也可调用 `expose` 的方法
- **移动端抽屉**：传 `mobileBreakpoint` 后窄屏自动隐藏侧栏与横排菜单，顶栏出现汉堡按钮；断点可选视口或容器宽度，抽屉支持弹出方向、尺寸与自定义插槽，也可通过 `expose` 开关
- **顶栏可定制**：`logo` 图片、`titleRender` 自定义标题、`headerClass` 覆盖顶栏样式（标题与操作图标继承顶栏文字色）、`header-extra` 插槽
- **侧栏与内容区可定制**：`siderClass` 改侧栏配色、`siderWidth` 改展开宽度、`contentClass` 覆盖内容区内边距、`contentScroll` 开启内置滚动
- **页脚可自定义**：`footer` 开关 + `footer` 插槽，`footerClass` / `footerStyle` 调整高度与样式，插槽内容横跨整个布局宽度
- **实例方法**：除折叠与重载菜单外，还可设置选中项、设置展开项、滚动到指定菜单，以及开关移动端抽屉
- **横排菜单收纳**：`menu.responsive` 让 `top` / `mix` 的横排菜单把放不下的项收进「更多」
- **菜单区独立滚动**：侧栏内置 `NScrollbar`，菜单项超出高度时自行滚动
- **样式可注入**：`class` / `style` 作用于根节点；`class`、`headerClass`、`siderClass`、`contentClass` 经 `tailwind-merge` 合并，可覆盖内置类名

## 何时使用

- 中后台系统的**整体页面骨架**：一个顶栏 + 一份导航菜单 + 一个内容容器
- 需要在侧边 / 顶部 / 混合三种导航形态之间切换的项目
- 菜单来自后端接口、需要加载态或按查询条件重新拉取的场景
- 需要菜单高亮跟随路由、或用菜单点击事件驱动内容区的项目
- 同一套骨架要兼顾桌面与窄屏（平板 / 手机）的项目
- 需要快速搭出可折叠导航原型的项目

以下场景当前版本**不适合**，请自行组合 `NLayout` / `NMenu` / `NDrawer`：

- 需要组件内置的多标签页与页签状态管理（请自行配合 `ProTabs`，见[多标签页](#多标签页)）

## 快速上手

### 安装

```script-tabs
@banmao/procomponent
```

### 按需引入

```vue
<script setup>
import { ProLayout } from '@banmao/procomponent'
</script>
```

### 全局注册

```ts
import { createApp } from 'vue'
import { ProLayoutPlugin } from '@banmao/procomponent'
import App from './App.vue'

createApp(App).use(ProLayoutPlugin).mount('#app')
```

### 基本使用

`title` 是顶栏标题，`menus` 是菜单配置，默认插槽是内容区。**根节点没有默认高度**，请用 `style` 或 `class` 指定。内容区默认不滚动，长页面需要下面这层容器，或改用 `content-scroll`（见[内容区滚动](#内容区滚动)）。

```vue
<template>
  <ProLayout title="Banmao Admin" :menus="menus" :style="{ height: '100vh' }">
    <!-- 内容区自身不滚动，长页面需要这层容器 -->
    <div class="h-full overflow-auto">
      <router-view />
    </div>
  </ProLayout>
</template>

<script setup>
import { ProLayout } from '@banmao/procomponent'

const menus = [
  { label: '首页', key: '/home' },
  { label: '表格', key: '/table' },
  {
    label: '系统管理',
    key: '/system',
    children: [
      { label: '用户管理', key: '/system/user' },
      { label: '角色管理', key: '/system/role' },
    ],
  },
]
</script>
```

### 菜单配色

顶栏与侧栏的背景固定为 `bg-zinc-800`（`#27272a`），但内部 `NMenu` 跟随**全局 Naive UI 主题**。浅色主题下菜单文字取 `textColor2`（深色），叠在深色侧栏上对比度只有约 **1.9:1**，几乎不可读。

解决办法是把 ProLayout 包在一个暗色的 `NConfigProvider` 里：

```vue
<script setup>
import { NConfigProvider, darkTheme } from 'naive-ui'
import { ProLayout } from '@banmao/procomponent'

// 覆盖文字色，避免继承外层浅色主题的 textColor
const layoutTheme = {
  common: { textColor1: '#fafafa', textColor2: '#d4d4d8', textColor3: '#a1a1aa' },
}
</script>

<template>
  <!-- abstract 让 Provider 不产生额外 DOM，避免影响 height: 100% -->
  <NConfigProvider abstract :theme="darkTheme" :theme-overrides="layoutTheme">
    <ProLayout title="Banmao Admin" :menus="menus" :style="{ height: '100vh' }">
      <div class="h-full overflow-auto">
        <router-view />
      </div>
    </ProLayout>
  </NConfigProvider>
</template>
```

处理后菜单文字对比度约 **10:1**，满足 WCAG AA。本页所有示例都采用这一写法。若必须保留全局浅色主题，见[进阶用法 - 只改菜单配色](#只改菜单配色)。

## 核心概念

### 布局结构

```text
div  ← 根节点：w-full flex flex-col + class prop，style prop 作用于这里
├── header  ← p-4 h-16 flex items-center text-white bg-zinc-800 + headerClass（默认 64px，可由 headerClass 覆盖）
│   ├── 抽屉按钮        窄屏时渲染在最左侧，点击打开抽屉，颜色继承顶栏
│   ├── logo           logo 有值时渲染 <img class="h-8 w-auto mr-2">
│   ├── title          titleRender 优先，否则纯文本 text-lg font-bold，颜色继承顶栏
│   ├── 横向菜单        非窄屏且 layout 为 top / mix 时渲染，flex-1 min-w-0 mx-4，menu.responsive 控制收纳
│   ├── header-extra   插槽（窄屏同样渲染）
│   └── 折叠按钮        非窄屏、collapsedTriggerPosition="top" 且 layout 不为 top 时渲染
├── main    ← flex flex-1 min-h-0 overflow-hidden
│   ├── aside   ← 非窄屏时渲染；bg-zinc-800 + siderClass，展开 siderWidth / 折叠 menu.collapsedWidth，300ms 过渡
│   │   ├── NScrollbar → NMenu（side 为 menus；mix 为当前一级菜单的 children）
│   │   └── 折叠按钮   ← collapsedTriggerPosition="bottom" 时渲染，mt-auto 固定在底部
│   └── section ← flex-1 p-4 + contentClass，默认插槽渲染在这里
│                 contentScroll 为 true 时追加 flex flex-col min-h-0，并在内部包一层 NScrollbar
├── footer  ← footer 为 true 时渲染，p-4 h-16 + footerClass，footerStyle 作用于节点，内容为 footer 插槽
└── NDrawer ← 窄屏时渲染，placement 取 drawerPlacement，尺寸取 drawerWidth（回退 siderWidth）
              ├── 默认内容：bg-zinc-800 + siderClass → NScrollbar → NMenu（完整 menus）
              └── drawer 插槽：完全接管抽屉内容，参数为 { menus, close }
              NDrawer 自身 teleport 到 body，不在根节点的 DOM 子树内
```

尺寸与默认值一览：

| 部位 | 默认值 | 说明 |
| --- | --- | --- |
| 顶栏高度 | 64px | `h-16`，可用 `headerClass` 覆盖 |
| 侧栏宽度（展开） | 256px | `siderWidth`；行内样式，类名覆盖不了 |
| 侧栏宽度（折叠） | 64px | `menu.collapsedWidth`，同时作用于侧栏与 `NMenu` |
| 抽屉尺寸（窄屏） | 256px | `drawerWidth`，未传时回退 `siderWidth`；左右为宽，上下为高 |
| 折叠图标尺寸 | 22px | `menu.collapsedIconSize` |
| 菜单项高度 | 42px | `NMenu` 主题默认值，可通过 `Menu.itemHeight` 覆盖 |
| 内容区内边距 | 16px | `p-4`，可用 `contentClass` 覆盖 |
| 页脚高度 | 64px | `h-16`，可用 `footerClass` 覆盖 |

### 布局模式

`layout` 决定菜单的摆放位置，三种模式共用同一份 `menus`：

| 模式 | 顶栏 | 侧栏 | 折叠按钮 |
| --- | --- | --- | --- |
| `side`（默认） | logo + 标题 + header-extra | 完整 `menus`，可折叠 | 按 `collapsedTriggerPosition` |
| `top` | logo + 标题 + 横排完整 `menus` + header-extra | 不渲染 | 不渲染（无侧栏可折叠） |
| `mix` | logo + 标题 + 横排一级菜单 + header-extra | 当前一级菜单的 `children` | 按 `collapsedTriggerPosition` |

`mix` 模式的联动规则：

- 顶栏只渲染一级菜单，`children` 被剥离；`type: 'group'` 分组保留分组标题，组内项同样被剥离为一级
- 内部维护「当前一级菜单」状态，初始取**第一个带子菜单的一级项**，都没有子菜单时取第一项；分组内的项视为一级项参与候选，分组标题本身不可点击、不参与选中
- 点击顶栏一级菜单即切换侧栏内容；当前一级菜单没有 `children` 时**侧栏整体不渲染**，内容区占满宽度
- 顶栏横排菜单的「当前一级项」由组件内部维护；传入 `menuValue` 时会**反推**它所属的一级项，顶栏与侧栏一起切过去
- 点击顶栏一级项只切换侧栏并抛出 `topMenuClick`，**不会**写 `menuValue`；侧栏点击才写 `menuValue`，详见[菜单与选中态](#菜单与选中态)

> `top` / `mix` 的横排菜单默认不开启 `responsive`，菜单项过多时会溢出而不是收进「更多」。需要收纳请传 `menu.responsive = true`，见 [MenuConfig](#menuconfig)。

> 窄屏下三种布局统一收敛为「顶栏 + 内容区 + 抽屉」，`layout` 不再影响菜单摆放，见[移动端抽屉](#移动端抽屉)。

### 高度模型

根节点是 `w-full flex flex-col`，**自身没有高度**，`main` 用 `flex-1 min-h-0` 占据剩余空间。因此：

| 写法 | 效果 |
| --- | --- |
| 不设置高度 | 高度由内容撑开，侧栏菜单滚动失效，页脚紧贴内容 |
| `:style="{ height: '100vh' }"` | 整屏骨架，最常用 |
| `:style="{ height: '600px' }"` | 定高骨架，适合嵌入文档或局部区域 |
| 父容器定高 + `:style="{ height: '100%' }"` | 撑满父容器；父链上不能有 `height: auto` 的包裹元素 |
| `class="h-screen"` | 与 `100vh` 等价，用 Tailwind 类名表达 |

> 用 `height: 100%` 时请注意：任何一层 `height: auto` 的包裹 `div`（包括非 `abstract` 的 `NConfigProvider`）都会让百分比高度失效。

### 内容区滚动

`main` 是 `overflow-hidden`，内容区 `section` 默认只有 `flex-1 p-4`，**自身不滚动**。内容超出布局高度时会被直接裁掉，既不滚动也不可见。两种解法：

**开启 `content-scroll`**，由组件内部包一层 `NScrollbar`（`section` 同时追加 `flex flex-col min-h-0`）：

```vue
<ProLayout :menus="menus" content-scroll :style="{ height: '100vh' }">
  <!-- 长内容直接放这里，不需要额外包裹 -->
</ProLayout>
```

**或者自己包滚动容器**，`content-scroll` 保持默认的 `false`：

```vue
<ProLayout :menus="menus" :style="{ height: '100vh' }">
  <div class="h-full overflow-auto">
    <!-- 长内容放这里 -->
  </div>
</ProLayout>
```

两者不要叠加：`content-scroll` 已经提供滚动容器，再包一层 `h-full overflow-auto` 会出现双滚动条。内容区放 `ProTable` 并启用 `auto-flex` 时，通常也不需要 `content-scroll`，表格自己管理高度与滚动。

侧栏菜单始终内置 `NScrollbar`，菜单项超出时自动滚动，无需额外处理。

### 菜单与选中态

`menus` 直接作为 `NMenu` 的 `options`，因此 `NMenu` 的选项结构全部可用（见 [MenuOption](#menuoption)）。选中态与展开态都支持受控：

| 属性 / 事件 | 作用 |
| --- | --- |
| `menuValue` | 当前选中的菜单 key，支持 `v-model:menu-value` |
| `update:menuValue` | 点击菜单项时抛出新的 key |
| `expandedKeys` | 展开的父级 key 数组，支持 `v-model:expanded-keys` |
| `update:expandedKeys` | 展开 / 收起子菜单时抛出新的数组，也是唯一的展开事件 |
| `menuClick` | 点击菜单项时抛出 `(key, item)`；`side` 的侧栏、`top` 的横排菜单、`mix` 的侧栏都走这个事件 |
| `topMenuClick` | 仅 `mix`：点击顶栏一级项时抛出 `(key, item)`，`item` 带完整 `children` |

`menuValue` 与 `expandedKeys` 都采用「内部状态 + 外部同步」模型：不传时由组件内部维护，传入后外部变化会同步进来；点击菜单、手动展开或自动展开时，组件先更新内部状态，再抛出 `update:menuValue` / `update:expandedKeys`。因此 `v-model` 是推荐写法，只传单向值时组件也不会停在旧状态。

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

受控之后有三点要注意：

- **自动展开**：`autoExpandSelected` 默认 `true`。组件初始化时会为 `menuValue` 补入祖先，之后外部改 `menuValue` 也会自动展开并抛 `update:expandedKeys`。手动收起父级后不会被反复撑开，直到下一次选中变化；传 `false` 可恢复旧行为。需要手动控制时用 `setMenuValue` / `setExpandedKeys`，见 [Expose](#expose)
- **高亮项在收起的子菜单里时看不到**：关闭 `autoExpandSelected` 后，`menuValue` 只决定高亮；路由直达深层页面时仍需把祖先 key 一并写进 `expandedKeys`
- **`props.onClick` 仍然不生效**：`NMenu` 只读取菜单级的 `nodeProps`，选项上的 `props` 不会落到 DOM。需要额外点击行为时用 `menuClick`，或把 `label` 写成渲染函数

`mix` 模式是**单一 value 源**：

- 顶栏一级项的选中态由组件内部维护，点击只切一级并抛 `topMenuClick`，**不写** `menuValue`——否则点顶栏就会把选中态覆盖成一级 key，侧栏高亮丢失
- 侧栏点击才写 `menuValue`，同时抛 `menuClick`
- 外部改 `menuValue`（例如路由变化）时，组件在 `menus` 里递归查找它所属的一级项并切过去；找不到所属一级项时不改动当前一级项
- 一级项自身没有 `children` 时，点它只抛 `topMenuClick`；需要把它当作页面选中，请在该事件里自行写 `menuValue`

### 折叠状态

折叠状态是「内部状态 + 外部同步」的半受控模型：

- 内部 `currentCollapsed` 初始取 `props.collapsed ?? props.menu?.collapsed ?? false`
- `watch(props.collapsed)`：外部值变化时同步到内部，`undefined` 不覆盖
- 点击折叠按钮：翻转内部状态并抛出 `collapseChange`，**不会**回写 `collapsed`

所以它**不支持 `v-model:collapsed`**，正确写法是单向绑定 + 事件回写：

```vue
<ProLayout
  :collapsed="collapsed"
  :menus="menus"
  @collapse-change="value => (collapsed = value)"
/>
```

`menu.collapsed` 只作为**初始值**：根 `collapsed` 显式传入时以根为准，之后 `menu.collapsed` 的变化不会再同步到内部状态。

也可以调用 `expose` 的 `setCollapsed(value)` / `toggleCollapsed()`，它们与点击按钮走同一条路径，同样抛出 `collapseChange`，见 [Expose](#expose)。

折叠按钮由 `collapsedTriggerPosition` 决定，**同一时刻只渲染一个**：

| 值 | 按钮位置 |
| --- | --- |
| `'bottom'`（默认） | 侧栏底部 |
| `'top'` | 顶栏标题右侧 |

`layout="top"` 没有侧栏，两种取值都不渲染按钮。

> **行为变更**：`0.7.31` 中顶栏与侧栏底部两个按钮始终同时渲染，现在默认只保留侧栏底部那一个。需要顶栏按钮请显式传 `collapsed-trigger-position="top"`。

### 移动端抽屉

传 `mobileBreakpoint`（单位 px）即开启窄屏适配。**默认 `undefined`，不开启**：不传时组件内部用一条永不匹配的媒体查询，DOM 与行为和旧版完全一致，升级零回归。

```vue
<ProLayout
  :menus="menus"
  :mobile-breakpoint="768"
  breakpoint-mode="container"
  drawer-placement="right"
  :drawer-width="320"
  :style="{ height: '100vh' }"
>
  <div class="h-full overflow-auto">
    <router-view />
  </div>
</ProLayout>
```

断点判定方式由 `breakpointMode` 决定，`≤` 断点即进入窄屏：

| 模式 | 判定依据 | 适用场景 |
| --- | --- | --- |
| `viewport`（默认） | `matchMedia('(max-width: Npx)')`，按视口宽度 | 整页布局 |
| `container` | `ResizeObserver` 监听 ProLayout 根节点 `clientWidth` | 嵌在卡片、分栏或微前端容器里 |

窄屏下的具体行为：

- **抽屉里始终是完整 `menus`**：三种 `layout` 一视同仁，`mix` 也放完整多级菜单，不再按当前一级项裁剪——窄屏没有顶栏一级菜单可点，裁剪会让二级以下的项永远进不去
- **折叠态被忽略**：抽屉里的 `NMenu` 始终按展开宽度渲染，`collapsed` / `menu.collapsed` / `menu.collapsedWidth` 都不参与，顶栏与侧栏底部的折叠按钮也都不渲染；回到宽屏时折叠态原样恢复
- **尺寸与配色**：抽屉尺寸取 `drawerWidth`，未传时回退 `siderWidth`；`drawerPlacement` 支持 `left` / `right` / `top` / `bottom`，上下弹出时同一数值作为高度。默认内容背景是 `bg-zinc-800` + `siderClass`，[浅色侧栏](#浅色侧栏)的写法在窄屏一样生效
- **`drawer` 插槽接管内容**：插槽参数为 `{ menus, close }`，提供后不再渲染默认菜单容器；需要用户信息、搜索框或自定义菜单样式时直接写在这里
- **`header-extra` 与 `footer` 照常渲染**，内容区 `section` 占满整行宽度
- **选中即关闭**：默认抽屉里点击叶子项先抛 `update:menuValue` / `menuClick`，再关闭抽屉；点击父级项只展开子菜单（抛 `update:expandedKeys`），抽屉保持打开。使用 `drawer` 插槽时关闭时机由你决定，`close()` 即可
- **点遮罩 / 按 Esc 也能关闭**（`NDrawer` 默认行为），视口或容器回到宽屏时抽屉自动关闭
- 抽屉内容走 `NDrawer` 默认的 `display-directive="if"`，**关闭时不渲染**，不会与侧栏菜单同时存在两份

抽屉虽然 teleport 到 `body`，但仍在 Vue 组件树内，外层 `NConfigProvider abstract :theme="darkTheme"` 的主题照样注入，菜单文字不会退回浅色。

```vue
<template>
  <ProLayout ref="layoutRef" :menus="menus" :mobile-breakpoint="768">
    <template #drawer="{ menus, close }">
      <div class="flex h-full flex-col gap-3 bg-zinc-900 p-4 text-white">
        <NMenu :options="menus" />
        <NButton class="mt-auto" @click="close">关闭</NButton>
      </div>
    </template>
  </ProLayout>
</template>
```

窄屏形态下可以通过 `ref` 调用 `openDrawer()` / `closeDrawer()` / `toggleDrawer()`；宽屏时这三个方法是空操作，避免在桌面形态渲染不存在的抽屉。

> `container` 模式在根节点第一次测量到宽度前按桌面形态渲染；如果容器初始 `display: none`，展开后 `ResizeObserver` 会重新判定。

### 远程菜单与加载态

`menu.request` 在组件挂载时调用，签名为 `(params, defaultMenuData) => Promise<MenuOption[]>`：

- `params` 取 `menu.params`，未传时为 `{}`
- `defaultMenuData` 是 `menus` 属性传入的数组，未传时为 `[]`
- 返回值**整体替换**菜单；请求失败时 `console.error` 并回退到 `menus`

重新请求的触发时机有四个：挂载、`menus` 数组引用变化、`menu.params` 变化（深层监听，就地修改也算）、调用 `expose` 的 `reloadMenus()`。只改 `menu.request` 函数本身不会重新请求。

`params` 连续变化时会有多个请求同时在飞，组件只让**最后一次**请求的结果落地，避免旧响应覆盖新菜单。

加载态由两处合并：`menu.loading` 为 `true`，或 `request` 正在进行中。加载期间菜单区域渲染 `NSpin`，侧栏宽度与整体布局保持不变。

`menu.onLoadingChange` 只在**内部请求态**翻转时各调用一次（`true` → `false`），不会因 `menu.loading` 属性变化而触发。

## 代码示例

> 除「侧栏配色、宽度与内容区边距」会切换到 `lightTheme` 外，所有示例都用 `NConfigProvider abstract :theme="darkTheme"` 包裹，原因见[菜单配色](#菜单配色)。复制代码时请一并保留这层包裹，否则浅色主题下菜单文字不可读。

### 基础

<Demo title="基础布局"
desc="title + menus + 默认插槽构成的最小骨架：顶栏标题、带图标与子菜单的侧栏、右侧内容区。"
:raw="BaseLayoutRaw">

<BaseLayout />

</Demo>

<Demo title="折叠控制"
desc="外部按钮改写 collapsed，内部按钮通过 collapseChange 回写；也可调用 expose 的 setCollapsed / toggleCollapsed（非 v-model）。"
:raw="CollapsedControlRaw">

<CollapsedControl />

</Demo>

<Demo title="自定义 class 与 style"
desc="class 追加到根节点做圆角裁切，style 用 height: 100% 撑满定高父容器。"
:raw="CustomStyleRaw">

<CustomStyle />

</Demo>

### 布局模式

<Demo title="side / top / mix 三种布局"
desc="同一份 menus 在三种 layout 下的形态。mix 模式点击顶栏一级菜单，侧栏随之切换；无子菜单时侧栏不渲染。"
:raw="LayoutModeRaw">

<LayoutMode />

</Demo>

<Demo title="折叠按钮位置"
desc="collapsedTriggerPosition 决定唯一的折叠按钮渲染在侧栏底部还是顶栏，默认 bottom。"
:raw="TriggerPositionRaw">

<TriggerPosition />

</Demo>

<Demo title="横排菜单收纳"
desc="layout=top 下菜单项过多时，menu.responsive 让 NMenu 按可用宽度把放不下的项收进末尾的「更多」子菜单。"
:raw="MenuResponsiveRaw">

<MenuResponsive />

</Demo>

### 顶栏与页脚

<Demo title="logo、自定义标题与顶栏配色"
desc="logo 渲染在标题左侧，titleRender 接管整个标题节点，headerClass 经 tailwind-merge 覆盖内置的 bg-zinc-800。"
:raw="HeaderCustomRaw">

<HeaderCustom />

</Demo>

<Demo title="浅色顶栏继承标题颜色"
desc="顶栏默认 text-white，标题与操作图标都继承 currentColor；headerClass 写 bg-white text-zinc-900 后标题自动变深色，不需要 titleRender。"
:raw="HeaderLightRaw">

<HeaderLight />

</Demo>

<Demo title="顶栏扩展插槽"
desc="header-extra 渲染在标题右侧、折叠按钮左侧，用 flex-1 把用户区推到右边。"
:raw="HeaderExtraRaw">

<HeaderExtra />

</Demo>

<Demo title="页脚、footer 插槽与样式覆盖"
desc="footer 是布尔开关，开启后底部出现 64px 页脚；不提供插槽时文案为 Footer，提供 footer 插槽后由插槽内容接管。footerClass 可把 h-16 覆盖成 h-12，footerStyle 调整背景与文字色。"
:raw="FooterLayoutRaw">

<FooterLayout />

</Demo>

### 侧栏与内容区

<Demo title="侧栏配色、宽度与内容区边距"
desc="siderClass 经 tailwind-merge 覆盖 bg-zinc-800 做浅色侧栏（需同时切换菜单主题），siderWidth 改展开宽度，contentClass 覆盖内容区 p-4。"
:raw="SiderStyleRaw">

<SiderStyle />

</Demo>

### 菜单

<Demo title="菜单配置"
desc="分组（type: 'group'）、分割线（type: 'divider'）、多级 children、禁用项与 extra 附加内容。"
:raw="MenuOptionsRaw">

<MenuOptions />

</Demo>

<Demo title="菜单与内容联动"
desc="v-model:menu-value 持有选中项，点击菜单经 update:menuValue 回写，内容区随之切换，不再需要把 onClick 写进 label。"
:raw="MenuNavigateRaw">

<MenuNavigate />

</Demo>

<Demo title="受控选中态与展开态"
desc="menuValue 决定高亮、expandedKeys 决定展开的父级，两者都由外部持有；外部按钮可直接选中深层项，menuClick 与 update:expandedKeys 记录交互。"
:raw="MenuControlledRaw">

<MenuControlled />

</Demo>

<Demo title="自动展开选中项"
desc="autoExpandSelected 默认开启：初始 menuValue 与后续选中变化都会自动展开祖先，并抛出 update:expandedKeys；关闭后恢复只改高亮、由 expandedKeys 完全接管展开态。"
:raw="MenuAutoExpandRaw">

<MenuAutoExpand />

</Demo>

<Demo title="mix 受控与一级项反推"
desc="单一 value 源：顶栏点击只切一级并抛 topMenuClick，侧栏点击才写 menuValue；外部改 menuValue 会反推所属一级项，顶栏与侧栏一起切过去。"
:raw="MenuMixControlledRaw">

<MenuMixControlled />

</Demo>

<Demo title="menu 配置项"
desc="menu.collapsed 决定初始折叠态，collapsedWidth 同时控制侧栏与 NMenu 折叠宽度，collapsedIconSize 控制图标尺寸，loading 显示加载态。"
:raw="MenuConfigRaw">

<MenuConfig />

</Demo>

<Demo title="远程菜单请求"
desc="挂载时调用 menu.request，第二个参数收到 menus 的本地数据；请求期间显示加载态，onLoadingChange 记录 true → false。"
:raw="MenuRequestRaw">

<MenuRequest />

</Demo>

<Demo title="菜单查询参数与主动重载"
desc="menu.params 变化（含就地修改）自动重新请求，参数原样传给 request；也可以调用 expose 的 reloadMenus() 主动拉取。"
:raw="MenuParamsRaw">

<MenuParams />

</Demo>

<Demo title="实例方法控制选中、展开与滚动"
desc="通过 ref 调用 setMenuValue / setExpandedKeys / scrollToMenu / toggleCollapsed：方法先更新内部状态，再抛 update:menuValue、update:expandedKeys 或 collapseChange；scrollToMenu 返回是否找到目标。"
:raw="ExposeControlsRaw">

<ExposeControls />

</Demo>

### 滚动

<Demo title="内容区内置滚动"
desc="content-scroll 开启后由组件内部的 NScrollbar 承载内容滚动，不需要再手写 h-full overflow-auto；关闭则超出部分被裁掉。"
:raw="ContentScrollRaw">

<ContentScroll />

</Demo>

<Demo title="长菜单与长内容"
desc="侧栏菜单由内置 NScrollbar 自动滚动；不开启 content-scroll 时，内容区必须自行包 h-full overflow-auto，否则超出部分被裁掉。"
:raw="ScrollAreaRaw">

<ScrollArea />

</Demo>

### 移动端

<Demo title="移动端抽屉菜单"
desc="mobileBreakpoint 按视口宽度切换形态：窄屏下 aside 与横排菜单都不渲染，顶栏汉堡按钮唤出左侧抽屉，抽屉内始终是完整多级 menus，点叶子项即关闭。用「模拟窄屏」把断点抬到当前视口之上即可演示。"
:raw="MobileDrawerRaw">

<MobileDrawer />

</Demo>

<Demo title="抽屉定制：容器断点、方向、尺寸与插槽"
desc="breakpointMode=container 按根节点宽度判定窄屏，在文档卡片里把容器切到 360px 即可触发；drawerPlacement / drawerWidth 控制弹出方向与尺寸，drawer 插槽参数为 { menus, close }，按钮可调用 openDrawer / closeDrawer / toggleDrawer。"
:raw="DrawerCustomRaw">

<DrawerCustom />

</Demo>

### 多标签页组合

<Demo title="ProLayout + ProTabs 多标签页"
desc="menuClick 打开页签、active 同时驱动页签与菜单高亮（单一 value 源），close 事件由外部从 options 中移除；关掉当前页签时落到相邻页签，全部关闭后内容区显示空态。"
:raw="MultiTabsRaw">

<MultiTabs />

</Demo>

## 进阶用法

### 菜单联动路由

ProLayout 不依赖 `vue-router`：把 `route.path` 绑到 `menuValue`、在 `menuClick` 里 `router.push`，即可双向联动，刷新与直达子路由都能正确高亮。

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ProLayout } from '@banmao/procomponent'

const route = useRoute()
const router = useRouter()

// 菜单 key 直接用路由 path，选中态就跟随路由
const menuValue = computed(() => route.path)

// 深层路由要把祖先一并展开，否则高亮项藏在收起的子菜单里
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

这里用 `:menu-value` 而不是 `v-model`：选中态的唯一来源是路由，菜单点击只负责跳转，路由变化后再回流成高亮，避免两份状态互相覆盖。

`mix` 布局下顶栏一级项通常不对应真实路由，点击它只抛 `topMenuClick`（用于切侧栏），侧栏点击才走 `menuClick` 跳转；若一级项本身就是页面，请在 `topMenuClick` 里自行 `router.push`。

> 仍然可以把 `label` 写成 `RouterLink` 渲染函数，但那样选中态还得自己按 `route.path` 维护，不如直接绑 `menuValue`。

### 多标签页

ProLayout 没有内置页签，配合 [ProTabs](/procomponent/ProTabs) 就能搭出「点菜单开页签、切页签换内容」的多标签页骨架。关键是**只维护一份 `active`**：它同时是 ProTabs 的激活页签和 ProLayout 的 `menuValue`，菜单高亮自然跟随当前页签，不会有两份状态互相覆盖。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import type { MenuOption } from 'naive-ui'
import { ProLayout, ProTabs } from '@banmao/procomponent'

const menus: MenuOption[] = [
  { label: '首页', key: '/home' },
  { label: '表格', key: '/table' },
  { label: '用户管理', key: '/user' },
]

const tabs = ref([{ label: '首页', key: '/home' }])
const active = ref('/home')

// 点菜单：没有页签就新开一个，有就切过去
function openTab(key: string | number, item: MenuOption) {
  const tabKey = String(key)
  if (!tabs.value.some(tab => tab.key === tabKey)) {
    tabs.value = [...tabs.value, { label: String(item.label ?? tabKey), key: tabKey }]
  }
  active.value = tabKey
}

// 关页签：ProTabs 只抛事件，移除动作由外部完成
function closeTab(key: string) {
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

几个要点：

- **用 `:menu-value` 而不是 `v-model:menu-value`**：`active` 是唯一来源，菜单点击只负责开页签并写 `active`，不需要再接 `update:menuValue`
- **`content-class="p-0"`**：页签条要贴住内容区边缘，默认的 `p-4` 会让它四周留白；内边距改由页签条与内容容器各自控制
- **`h-full flex flex-col min-h-0` 不能省**：页签条占固定高度，内容区靠 `flex-1 min-h-0 overflow-auto` 才能正确滚动
- **ProTabs 只渲染页签条**，内容区完全由你决定；`closable` 只抛 `close(key)`，**不会**自己从 `options` 里删项
- 结合路由时 `active` 仍用 `ref`：在 `openTab` 与 ProTabs 的 `update:active` 里 `router.push`，再用 `watch(route)` 把 `active` 和页签列表同步回来（补齐刷新 / 直达路由的页签）。不要把它换成只读 `computed`，`v-model:active` 需要可写

### 远程菜单数据

优先用 `menu.request`，它自带加载态：

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

`menus` 在这里充当 `defaultMenuData`（传给请求函数的本地数据），请求成功后菜单被返回值整体替换；请求失败则回退到 `menus`。

也可以自行请求后赋值给 `menus`，它是响应式透传的，**整体替换数组会立即更新菜单**：

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

这种写法把 `:menu="{ loading }"` 绑上，即可复用组件内置的菜单加载态。

### 自定义页脚

开启 `footer` 后提供 `footer` 插槽即可接管内容，页脚横跨整个布局宽度（含侧栏下方）：

```vue
<template>
  <ProLayout :menus="menus" footer :style="{ height: '100vh' }">
    <div class="h-full overflow-auto">
      <router-view />
    </div>

    <template #footer>
      <div class="flex w-full items-center justify-between text-xs opacity-60">
        <span>© 2026 Banmao · 内部管理系统</span>
        <span>帮助中心</span>
      </div>
    </template>
  </ProLayout>
</template>
```

页脚默认高度 64px（`h-16`）。`footerClass` 经 `tailwind-merge` 合并，可以直接覆盖高度；`footerStyle` 接收行内样式：

```vue
<template>
  <ProLayout
    :menus="menus"
    footer
    footer-class="h-12 border-t border-zinc-700"
    :footer-style="{ background: '#18181b', color: '#d4d4d8' }"
    :style="{ height: '100vh' }"
  >
    <div class="h-full overflow-auto">
      <router-view />
    </div>

    <template #footer>
      <div class="flex w-full items-center justify-between text-xs">
        <span>© 2026 Banmao · 内部管理系统</span>
        <span>帮助中心</span>
      </div>
    </template>
  </ProLayout>
</template>
```

如果需要页脚只占内容区宽度（侧栏通到底），仍可关闭 `footer`、在默认插槽里自己排一列。

### 只改菜单配色

必须保留全局浅色主题时，可以只覆盖 `Menu` 的主题变量，不改 `common`：

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

选中态与子菜单激活态仍取 `primaryColor`，在深色侧栏上可读。折叠后弹出的子菜单面板属于 `Dropdown`/`Tooltip`，浅色主题下仍是浅色面板，需要一并覆盖时建议直接用 `darkTheme`。

### 浅色侧栏

`siderClass` 经 `tailwind-merge` 合并，可以盖掉内置的 `bg-zinc-800`。但侧栏配色和菜单主题是两件事：把侧栏改白之后，必须同时把 `NMenu` 切到浅色主题，否则浅色文字落在白底上不可读。

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

顶栏默认 `bg-zinc-800 text-white`，标题与折叠 / 抽屉按钮都继承顶栏文字色。改浅色顶栏时把颜色一并写在 `header-class` 里即可，不需要 `titleRender`：

```vue
<ProLayout
  :menus="menus"
  header-class="bg-white text-zinc-900 border-b border-zinc-200"
/>
```

> 侧栏宽度是行内样式，`sider-class` 里写 `w-60` 不会生效，请用 `sider-width`。

### 与 ProTable 组合

内容区放 `ProTable` 时，用 `auto-flex` 让表格填满剩余高度。注意中间那层 `h-full flex flex-col` 不能省——`auto-flex` 要求祖先定高且为纵向 flex。这种场景不要再开 `content-scroll`，表格自己管理高度与滚动：

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

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 顶栏标题；有 `titleRender` 时作为其入参，否则纯文本渲染，传空字符串不渲染标题节点 | `string` | `'Admin Pro'` |
| logo | 顶栏 logo 图片地址，渲染为 `h-8 w-auto` 的 `<img>`，位于标题左侧 | `string` | - |
| titleRender | 自定义标题渲染函数，返回值替换整个标题节点 | `(title: string) => VNodeChild` | - |
| menus | 菜单配置，直接透传 `NMenu` 的 `options`，响应式生效；有 `menu.request` 时作为 `defaultMenuData` | `MenuOption[]` | - |
| menuValue | 当前选中的菜单 key；内部先更新再抛事件，外部变化也会同步进来。支持 `v-model:menu-value` | `string \| number` | `undefined` |
| expandedKeys | 展开的父级 key 数组；内部先更新再抛事件，外部变化也会同步进来。支持 `v-model:expanded-keys` | `(string \| number)[]` | `undefined` |
| autoExpandSelected | `menuValue` 初始化或变化时自动补入祖先展开项，并抛 `update:expandedKeys`；手动收起后不会反复撑开 | `boolean` | `true` |
| menu | 菜单行为配置，见 [MenuConfig](#menuconfig) | `MenuConfig` | - |
| layout | 布局模式，见[布局模式](#布局模式) | `'side' \| 'top' \| 'mix'` | `'side'` |
| mobileBreakpoint | 窄屏断点（px），按 `breakpointMode` 判定，`≤` 该值时隐藏侧栏与横排菜单、改用抽屉；不传则不开启，见[移动端抽屉](#移动端抽屉) | `number` | `undefined` |
| breakpointMode | 断点判定依据：`viewport` 按视口宽度，`container` 按根节点宽度（`ResizeObserver`） | `'viewport' \| 'container'` | `'viewport'` |
| drawerPlacement | 窄屏抽屉的弹出方向 | `'left' \| 'right' \| 'top' \| 'bottom'` | `'left'` |
| drawerWidth | 窄屏抽屉尺寸（px）；左右为宽、上下为高，未传时回退 `siderWidth` | `number` | `undefined` |
| collapsed | 侧栏折叠状态；变化时同步内部状态，内部翻转不会回写。未传时初始值取 `menu.collapsed` | `boolean` | `undefined` |
| collapsedTriggerPosition | 折叠按钮位置，同一时刻只渲染一个；`layout="top"` 时不渲染 | `'top' \| 'bottom'` | `'bottom'` |
| class | 追加到根节点的类名，经 `tailwind-merge` 合并，**只接受字符串** | `string` | - |
| headerClass | 追加到 `header` 的类名，经 `tailwind-merge` 合并；标题与操作图标继承这里的文字色 | `string` | - |
| siderClass | 追加到 `aside` 的类名，经 `tailwind-merge` 合并，可覆盖侧栏配色；宽度是行内样式，`w-*` 不生效 | `string` | - |
| siderWidth | 侧栏展开宽度（px），折叠时仍取 `menu.collapsedWidth` | `number` | `256` |
| contentClass | 追加到内容区 `section` 的类名，经 `tailwind-merge` 合并，可覆盖 `p-4` | `string` | - |
| contentScroll | 内容区是否内置滚动；开启后 `section` 追加 `flex flex-col min-h-0` 并内包 `NScrollbar` | `boolean` | `false` |
| style | 根节点行内样式，常用于设置高度 | `Record<string, string \| number>` | - |
| footer | 是否渲染页脚，内容由 `footer` 插槽决定，缺省文案 `Footer` | `boolean` | `false` |
| footerClass | 追加到 `footer` 的类名，经 `tailwind-merge` 合并，可覆盖 `h-16` / `p-4` | `string` | - |
| footerStyle | 页脚行内样式 | `CSSProperties` | - |

以上属性均已消费。`MenuConfig` 类型未从包入口导出，需要标注类型时请自行声明同形结构。

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| collapseChange | 点击顶栏或侧栏底部的折叠按钮后触发，参数为翻转后的状态 | `(collapsed: boolean) => void` |
| update:menuValue | 点击菜单项或调用 `setMenuValue` 时触发，配合 `menuValue` 实现 `v-model:menu-value` | `(key: string \| number) => void` |
| update:expandedKeys | 展开 / 收起子菜单、自动展开选中项或调用 `setExpandedKeys` 时触发，配合 `expandedKeys` 实现 `v-model:expanded-keys` | `(keys: (string \| number)[]) => void` |
| menuClick | 点击菜单项时触发（`side` 的侧栏、`top` 的横排菜单、`mix` 的侧栏），`item` 是原始 `MenuOption` | `(key: string \| number, item: MenuOption) => void` |
| topMenuClick | 仅 `mix`：点击顶栏一级项时触发，**不写** `menuValue`，`item` 带完整 `children` | `(key: string \| number, item: MenuOption) => void` |

模板中写 `@collapse-change`、`@menu-click`、`@top-menu-click` 或对应驼峰均可。

> **没有** `update:collapsed`，因此不支持 `v-model:collapsed`，折叠请用 `:collapsed` + `@collapse-change`；菜单选中态与展开态则支持 `v-model:menu-value` / `v-model:expanded-keys`。

> 点击带子菜单的父级项只会展开 / 收起，抛 `update:expandedKeys`，不抛 `menuClick` 与 `update:menuValue`。

### Slots

| 名称 | 说明 | 插槽参数 |
| --- | --- | --- |
| default | 右侧内容区，渲染在 `section.flex-1.p-4` 内；`contentScroll` 开启时渲染在内部 `NScrollbar` 里 | 无 |
| header-extra | 顶栏标题（`top` / `mix` 下为横排菜单）右侧、折叠按钮左侧的区域 | 无 |
| footer | 页脚内容，仅在 `footer` 为 `true` 时渲染；不提供时文案为 `Footer` | 无 |
| drawer | 窄屏抽屉内容；提供后完全替换默认菜单容器 | `{ menus: MenuOption[], close: () => void }` |

`default` / `header-extra` / `footer` 不接收参数；`drawer` 接收 `{ menus, close }`。没有 `menu` / `title` / `logo` 插槽（标题与 logo 走 `titleRender`、`logo` 属性）。

> `header-extra` 与标题、折叠按钮同处一个 `flex items-center` 容器。想把内容推到右侧，请在插槽内使用 `flex-1` 或 `ml-auto`。

### MenuOption

`menus` 的元素类型即 naive-ui 的 `MenuOption`，常用字段：

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| key | 菜单项唯一标识，建议直接用路由 path | `string \| number` |
| label | 菜单文案；写成渲染函数可自定义内容并绑定事件 | `string \| () => VNodeChild` |
| icon | 菜单图标渲染函数 | `() => VNodeChild` |
| children | 子菜单，支持多级嵌套 | `MenuOption[]` |
| disabled | 禁用该项（含其子项） | `boolean` |
| extra | 文案右侧的附加内容，如计数 | `string \| () => VNodeChild` |
| type | `'group'` 分组标题、`'divider'` 分割线；不传为普通菜单项 | `'group' \| 'divider'` |
| show | 是否显示该项 | `boolean` |

```tsx
import { Icon } from '@iconify/vue'

const menus = [
  {
    type: 'group',
    key: 'business',
    label: '业务中心',
    children: [
      { key: '/home', label: '首页', icon: () => <Icon icon="hugeicons:home-01" /> },
      { key: '/file', label: '文件管理', extra: '12' },
    ],
  },
  { type: 'divider', key: 'd1' },
  { key: '/repo', label: '仓库管理', disabled: true },
]
```

> `type: 'render'` 会被 `NMenu` 忽略；选项上的 `props`（如 `props.onClick`）不会落到 DOM，菜单点击请用 `menuClick` 事件，更细的自定义交互才写进 `label`。图标颜色由主题控制，无需在 `Icon` 上写 `text-white`。

### MenuConfig

`menu` 属性的类型，**所有字段可选**，只传需要的字段即可：

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| collapsed | `boolean` | `false` | 折叠态初始值；根 `collapsed` 显式传入时以根为准，之后不再同步 |
| collapsedWidth | `number` | `64` | 折叠宽度，同时作用于侧栏与 `NMenu` |
| collapsedIconSize | `number` | `22` | 折叠后的图标尺寸，透传 `NMenu` |
| loading | `boolean` | `false` | 菜单加载态，与内部请求态取或 |
| params | `Record<string, any>` | `{}` | 传给 `request` 的第一个参数；变化（含就地修改）会重新请求 |
| responsive | `boolean` | `false` | 横排菜单是否把放不下的项收进「更多」，只作用于 `top` / `mix` 的顶栏菜单 |
| request | `(params, defaultMenuData) => Promise<MenuOption[]>` | - | 挂载时调用；`params` 取 `menu.params`，`defaultMenuData` 为 `menus` |
| onLoadingChange | `(loading: boolean) => void` | - | 内部请求态翻转时回调；`menu.loading` 变化不触发 |

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

通过 `ref` 可以拿到以下方法：

| 方法 | 签名 | 说明 |
| --- | --- | --- |
| reloadMenus | `() => Promise<void>` | 立即重新执行 `menu.request`；没有配置 `request` 时为空操作 |
| setCollapsed | `(value: boolean) => void` | 写入折叠状态并抛出 `collapseChange` |
| toggleCollapsed | `() => void` | 翻转折叠状态并抛出 `collapseChange` |
| setMenuValue | `(key: string \| number) => void` | 写入选中项并抛出 `update:menuValue`；`autoExpandSelected` 开启时同步展开祖先 |
| setExpandedKeys | `(keys: (string \| number)[]) => void` | 写入展开集合并抛出 `update:expandedKeys`，不做祖先补全 |
| scrollToMenu | `(key: string \| number) => Promise<boolean>` | 展开祖先并滚动到目标菜单项；窄屏会先打开抽屉。未找到目标时返回 `false` |
| openDrawer | `() => void` | 窄屏打开抽屉；宽屏为空操作 |
| closeDrawer | `() => void` | 关闭抽屉 |
| toggleDrawer | `() => void` | 窄屏翻转抽屉开关；宽屏为空操作 |

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ProLayout } from '@banmao/procomponent'

const layoutRef = ref<InstanceType<typeof ProLayout> | null>(null)

function jumpToRole() {
  layoutRef.value?.setMenuValue('/system/auth/role')
  layoutRef.value?.scrollToMenu('/system/auth/role')
}
</script>

<template>
  <ProLayout ref="layoutRef" :menus="menus" />
</template>
```

这些方法与用户交互走同一条路径：先更新内部状态，再抛事件。配合 `v-model` 时外部无需额外回写；只传单向值时组件也会保持内部同步。`scrollToMenu` 依赖默认菜单容器，使用 `drawer` 插槽替换内容后通常返回 `false`，需要自行滚动。

</div>

## 常见问题

**菜单文字看不清？**
顶栏与侧栏固定深色，而 `NMenu` 跟随全局主题。浅色主题下请用 `NConfigProvider abstract :theme="darkTheme"` 包裹，见[菜单配色](#菜单配色)。

**内容显示不全 / 被裁掉？**
内容区默认不滚动，`main` 是 `overflow-hidden`。开启 `content-scroll` 让组件内置的 `NScrollbar` 承载滚动，或自己在默认插槽里包一层 `h-full overflow-auto`——两者不要叠加，否则出现双滚动条。

**布局高度塌陷 / 页脚贴在内容下面？**
根节点没有默认高度。用 `:style="{ height: '100vh' }"` 或定高父容器 + `height: 100%`，并确认父链上没有 `height: auto` 的包裹元素。

**`v-model:collapsed` 不生效？**
没有 `update:collapsed` 事件。请用 `:collapsed` + `@collapse-change` 手动回写。

**点击菜单没有回调？**
用 `@menu-click`，参数是 `(key, item)`；`mix` 的顶栏一级项走 `@top-menu-click`。选项上的 `props.onClick` 不生效，展开 / 收起子菜单则抛 `@update:expanded-keys`。

**刷新后菜单高亮丢失？**
把 `route.path` 绑到 `menu-value`，菜单 key 用路由 path，高亮就会跟随路由（含刷新与直达子路由）。`autoExpandSelected` 默认会展开祖先，深层路由不再需要手写 `expanded-keys`，见[菜单联动路由](#菜单联动路由)。

**传了 `menu-value` 后点击菜单不高亮？**
组件采用内部先更新、再抛 `update:menuValue` 的模型。推荐直接 `v-model:menu-value`；只传 `:menu-value` 而不接事件时，点击会先更新内部高亮，但父子状态可能不一致。需要严格受控时请在 `@update:menu-value` 里回写。

**选中项在子菜单里，看不到高亮？**
`autoExpandSelected` 默认 `true`，初始值与后续 `menuValue` 变化都会自动展开祖先。关闭该属性后才需要把祖先 key 写进 `expandedKeys`（路由场景可按 path 逐级推导）。

**`mix` 下点顶栏为什么 `menuValue` 不变？**
这是单一 value 源的设计：顶栏点击只切一级项并抛 `topMenuClick`，侧栏点击才写 `menuValue`。否则点顶栏会把选中态覆盖成一级 key，侧栏高亮就丢了。一级项本身是页面时，请在 `topMenuClick` 里自行写值或跳转。

**顶栏的折叠按钮不见了？**
`collapsedTriggerPosition` 默认 `'bottom'`，只渲染侧栏底部那一个按钮。需要顶栏按钮请传 `collapsed-trigger-position="top"`；`layout="top"` 下两者都不渲染。

**`layout="mix"` 侧栏不显示？**
当前一级菜单没有 `children` 时侧栏整体不渲染。点击顶栏一个带子菜单的一级项即可看到侧栏。

**窄屏下抽屉没出现？**
先确认传了 `mobile-breakpoint`，不传就完全不开启。默认 `breakpointMode="viewport"` 按浏览器视口宽度判定：把 ProLayout 放进 400px 宽的卡片、而视口是 1440px，仍然是桌面形态。需要按容器宽度判定时传 `breakpoint-mode="container"`，组件会监听根节点宽度，见[移动端抽屉](#移动端抽屉)。

**抽屉里为什么不是 `mix` 的当前二级菜单？**
设计如此：窄屏没有顶栏一级菜单可点，若按当前一级项裁剪，其余分支就永远进不去。三种 `layout` 下抽屉一律渲染完整 `menus`。

**窄屏下折叠按钮不见了、`collapsed` 也没效果？**
窄屏不渲染侧栏，顶栏与侧栏底部的折叠按钮都不渲染，抽屉里的菜单始终按展开宽度显示。折叠态本身保留，回到宽屏即恢复。

**点抽屉里的父级菜单为什么不关闭？**
父级项只负责展开 / 收起子菜单（抛 `update:expandedKeys`），只有叶子项才写选中态并关闭抽屉。点遮罩与按 Esc 同样能关。

**抽屉的尺寸、方向和内容怎么改？**
尺寸用 `drawerWidth`（未传时回退 `siderWidth`，不是 `menu.collapsedWidth`），方向用 `drawerPlacement`，配色仍走 `siderClass`。需要放菜单之外的内容时使用 `drawer` 插槽，参数为 `{ menus, close }`；打开与关闭可调用 `openDrawer()` / `closeDrawer()` / `toggleDrawer()`。

**`menu.request` 什么时候执行？**
挂载时执行一次，之后 `menus` 数组引用变化、`menu.params` 变化（深层监听，就地修改也算）都会再次执行，也可以调用 `expose` 的 `reloadMenus()`。第一个参数是 `menu.params`（缺省 `{}`），第二个参数是 `menus`。只改 `menu.request` 函数不会重新请求。

**侧栏改成浅色后菜单文字看不清？**
`siderClass` 只改侧栏背景，菜单文字仍跟随 `NConfigProvider` 的主题。浅色侧栏要同时把主题切成 `lightTheme`，见[浅色侧栏](#浅色侧栏)。

**`siderClass` 里写 `w-60` 没生效？**
侧栏宽度是行内样式，优先级高于类名。请用 `sider-width` 属性。

**横排菜单项太多溢出了？**
传 `:menu="{ responsive: true }"`，`NMenu` 会按可用宽度把放不下的项收进末尾的「更多」子菜单。该属性只作用于 `top` / `mix` 的顶栏横排菜单。

**页脚文案和高度怎么改？**
开启 `footer` 后提供 `footer` 插槽即可，见[自定义页脚](#自定义页脚)。高度用 `footerClass` 覆盖，例如 `h-12`；背景、颜色等用 `footerStyle`。

**`headerClass` 改了背景色没生效？**
类名经 `tailwind-merge` 合并，后写的覆盖先写的，所以 `header-class="bg-orange-600"` 能盖掉内置的 `bg-zinc-800`。但对应的 CSS 必须真实存在——使用构建期扫描的 Tailwind 时，类名要以字面量出现在源码里，拼接出来的类名不会被生成。浅色顶栏记得同时写文字色，例如 `bg-white text-zinc-900`，标题与操作图标会继承。

**`menu.loading` 变化为什么没触发 `onLoadingChange`？**
该回调只反映内部请求态。外部传入的 `menu.loading` 直接参与渲染，不经过回调。

## 已知限制

此前的自动展开、页脚高度、顶栏标题配色、抽屉定制与 `expose` 范围均已补齐：`autoExpandSelected` 处理深层选中，`footerClass` / `footerStyle` 调整页脚，顶栏标题继承 `headerClass` 的文字色，抽屉支持容器断点、方向、尺寸、插槽与开关方法，实例方法覆盖选中、展开与滚动定位。

当前仍**没有内置多标签页**，需要页签状态管理时请配合 `ProTabs` 组合，见[多标签页](#多标签页)。