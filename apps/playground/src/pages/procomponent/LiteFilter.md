---
name: LiteFilter
desc: LiteFilter 是独立的轻量筛选条：默认无卡片、无标签、无查询按钮，字段值变化后防抖自动查询；占位符 + 小尺寸 + 12px 间距，字段按内容宽度 flex 换行（不使用栅格），支持高级筛选弹层、折叠限高、远程枚举与插槽。
---

<route lang="yaml">
meta:
  layout: default
</route>

# LiteFilter

LiteFilter 是**独立的轻量筛选条**：不依赖 [QueryFilter](/procomponent/QueryFilter) 的渲染，默认去掉卡片、字段标签与查询按钮，用占位符说明条件，控件与间距都按工具栏密度收紧，选完条件即按防抖自动查询。字段**不使用栅格**——主行是 flex 换行容器，每个字段按 `valueType` 取默认宽度，放不下自动换到下一行。字段较多时，次要条件可以收进「高级筛选」弹层，主行只保留最常用的几个。

它与 QueryFilter 的分工：

| 组件 | 定位 | 适合场景 |
| --- | --- | --- |
| QueryFilter | 完整筛选表单 | 列表页顶部查询区，字段多、需要栅格对齐与带标签布局、受控值、实例方法与完整状态管理 |
| LiteFilter | 轻量行内筛选 | 紧凑工具栏，字段按内容宽度紧凑排布、常用条件 + 高级弹层、只做快速过滤 |

本页描述仓库当前源码的行为。

## 特性

- **紧凑默认**：无卡片、无标签、无查询按钮、`small` 控件、12px 间距；占位符自动带字段标题
- **自动查询**：字段值变化（含重置）后按 `searchDebounce` 防抖抛 `search`，无需点按钮
- **内容宽度**：主行是 flex 换行容器，字段按 `valueType` 取默认宽度，`width` / `formItemProps.style.width` 可覆盖
- **配置式字段**：`LiteFilterColumn` 支持全部 15 种 `valueType`
- **高级筛选弹层**：列上配置 `advanced: true` 收进 `NPopover`，主行保持清爽
- **标签开关**：`showLabel` 恢复字段标签；带 `tooltip` 的列始终保留小标签
- **查询 / 重置**：`search` / `reset` 事件，`loading`、`beforeSearch`、`searchOnReset`
- **折叠限高**：`defaultCollapsed` / `collapsedRows` 决定折叠时可见行数，支持 `v-model:collapsed`
- **远程枚举**：`request` 拉取选项，同一请求只执行一次，可手动 `refreshOptions`
- **插槽**：`field-<key>` 接管单个字段（含高级列），`actions` 在默认按钮后追加操作
- **类型导出**：`LiteFilterColumn`、`LiteFilterProps`、`LiteFilterEmits`、`LiteFilterExpose`、`LiteFilterValueType` 等

## 何时使用

- 表格上方只需要一到两行的紧凑筛选工具栏
- 常用条件少，但仍有若干次要条件需要偶尔使用
- 不希望引入卡片容器与栅格对齐，由页面自己控制外层布局
- 只需要值在查询 / 重置时抛出，不需要受控值与完整实例 API

需要 `v-model:modelValue`、`field-change`、`getValues` / `setValues`、栅格等宽列或完整表单布局时，请使用 [QueryFilter](/procomponent/QueryFilter)。

## 快速上手

### 安装

```script-tabs
@banmao/procomponent
```

### 按需引入

```vue
<script setup>
import { LiteFilter } from '@banmao/procomponent'
</script>
```

### 全局注册

```ts
import { createApp } from 'vue'
import { LiteFilterPlugin } from '@banmao/procomponent'
import App from './App.vue'

createApp(App).use(LiteFilterPlugin).mount('#app')
```

### 基本使用

```vue
<script setup lang="ts">
import { LiteFilter, type LiteFilterColumn } from '@banmao/procomponent'

const columns: LiteFilterColumn[] = [
  { key: 'keyword', title: '关键词', valueType: 'text' },
  {
    key: 'status',
    title: '状态',
    valueType: 'select',
    options: [
      { label: '启用', value: 'active' },
      { label: '停用', value: 'disabled' },
    ],
  },
  { key: 'createdAt', title: '创建日期', valueType: 'date' },
]

function handleSearch(values: Record<string, any>) {
  console.log(values)
}
</script>

<template>
  <LiteFilter :columns="columns" @search="handleSearch" />
</template>
```

## 紧凑默认

| 项 | 默认值 | 说明 |
| --- | --- | --- |
| `card` | `false` | 不渲染卡片，直接嵌入页面 |
| `showLabel` | `false` | 不渲染字段标签，使用占位符 |
| `formConfig.size` | `'small'` | 输入框、下拉与按钮统一 28px |
| `gap` | `12` | flex 行间距 |
| `defaultCollapsed` | `true` | 初始折叠，只显示 `collapsedRows` 行 |
| `collapsedRows` | `1` | 折叠后可见行数 |

占位符规则：文本类为「请输入 + 标题」，选择类为「请选择 + 标题」，日期 / 时间为固定文案；列上的 `placeholder` 优先。

需要标签时传 `showLabel`；带 `tooltip` 的列即使关闭标签也会保留「标题 + ⓘ」小标签，保证提示可达。想整体回到常规密度，可传 `formConfig: { size: 'medium' }` 与 `gap: 16`。

### 字段宽度

主行是 `display: flex; flex-wrap: wrap; gap: <gap>` 容器，字段宽度按类型给定：

| `valueType` | 默认宽度 |
| --- | --- |
| `text` / `autoComplete` | `180px` |
| `dynamicTags` | `220px` |
| `select` / `cascader` / `treeSelect` | `160px` |
| `date` | `150px` |
| `dateRange` | `260px` |
| `time` / `digit` | `140px` |
| `colorPicker` | `120px` |
| `switch` / `checkbox` / `checkboxGroup` / `radio` | 按内容自适应 |

宽度优先级：`formItemProps.style.width` > `column.width` > 类型默认。操作区是行内最后一个 flex 项，**紧跟最后一个字段**（不再靠右推挤），放不下时自动换行。

## 高级筛选

列上配置 `advanced: true` 后，该列不再进入主行，而是收进「高级筛选」弹层：

```vue
<script setup lang="ts">
const columns: LiteFilterColumn[] = [
  { key: 'keyword', title: '关键词', valueType: 'text' },
  { key: 'owner', title: '负责人', valueType: 'text', advanced: true },
  { key: 'createdAt', title: '创建日期', valueType: 'date', advanced: true },
]
</script>

<template>
  <LiteFilter :columns="columns" advanced-text="更多条件" />
</template>
```

- **触发按钮**：主行操作区出现「高级筛选」文本按钮，文案由 `advancedText` 控制
- **弹层内容**：高级列带标签、纵向单列排列（弹层宽 280px），底部只提供「重置」且只清空弹层内的字段
- **值模型**：主行与弹层共用同一份值，`search` / `reset` 都包含全部字段
- **插槽**：`field-<key>` 对高级列同样生效
- **关闭弹层**：`advancedPopover=false`，所有列回到主行按内容宽度排列

`hideInSearch` 优先于 `advanced`；高级列不参与主行折叠限高。

## 列配置

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| `key` | 字段标识，同时作为取值 key | `string` |
| `title` | 字段标题；无标签时用于占位符 | `string` |
| `valueType` | 控件类型，见下方字段类型表 | `LiteFilterValueType` |
| `options` | 静态选项 | `any[]` |
| `request` | 远程枚举请求函数 | `() => Promise<any[]>` |
| `requestOnce` | 远程枚举是否只请求一次，默认 `true` | `boolean` |
| `hideInSearch` | 不渲染；默认值仍保留在取值结果里 | `boolean` |
| `advanced` | 收进高级筛选弹层 | `boolean` |
| `order` | 排序权重，数值小的在前 | `number` |
| `tooltip` | 标题后的提示图标；会让该列保留小标签 | `string` |
| `width` | 字段宽度，覆盖类型默认宽度 | `number \| string` |
| `formItemProps` | 透传给控件的属性；`style.width` 优先级最高 | `Record<string, any>` |
| `placeholder` | 覆盖默认占位符 | `string` |
| `disabled` | 禁用控件 | `boolean` |

### 字段类型

| `valueType` | 控件 | 默认空值 | 说明 |
| --- | --- | --- | --- |
| `text` | `NInput` | `''` | 文本输入 |
| `select` | `NSelect` | `null` | 多选通过 `formItemProps.multiple` |
| `date` | `NDatePicker` | `null` | 默认 `valueFormat="yyyy-MM-dd"` |
| `dateRange` | `NDatePicker`（range） | `null` | 也可在 `date` 列用 `formItemProps.type='daterange'` |
| `time` | `NTimePicker` | `null` | - |
| `cascader` | `NCascader` | `null` | 选项为级联结构 |
| `autoComplete` | `NAutoComplete` | `''` | - |
| `colorPicker` | `NColorPicker` | `null` | - |
| `checkbox` | `NCheckbox` | `false` | 单个布尔值 |
| `checkboxGroup` | `NCheckboxGroup` | `[]` | 多选数组 |
| `radio` | `NRadioGroup` | `null` | 选项来自 `options` / `request` |
| `switch` | `NSwitch` | `false` | 单个布尔值 |
| `dynamicTags` | `NDynamicTags` | `[]` | 字符串数组 |
| `digit` | `NInputNumber` | `null` | 数字范围用 `formItemProps.min/max` |
| `treeSelect` | `NTreeSelect` | `null` | 选项为树结构 |

日期默认值使用格式化字符串。修改 `formItemProps.valueFormat` 可改变格式；设为 `null` 则得到时间戳。`dateRange` 的占位符默认是「开始日期 / 结束日期」，传入 `column.placeholder` 会同时覆盖两端。

## 值模型

LiteFilter 只维护内部值：

- `defaultValue` 是**初始值与重置目标**；运行中修改会合并进当前值，并按自动查询规则抛一次 `search`
- `search(values)` 与 `reset(values)` 抛出的对象始终是**完整值**
- 没有 `v-model`，也没有 `field-change`；需要任意时刻读写值请使用 QueryFilter

## 自动查询与重置

LiteFilter 默认**没有查询按钮**：任意字段的值发生变化（包括点击重置、`defaultValue` 更新）后，等待 `searchDebounce` 毫秒再抛一次 `search(values)`。连续输入只算一次条件，最后一次变化后计时。

| 配置 | 说明 | 默认值 |
| --- | --- | --- |
| `searchDebounce` | 自动查询的防抖时长（毫秒），传 `0` 表示不额外等待 | `300` |
| `showSearchButton` | 显示「查询」按钮；开启后回到手动查询，不再自动触发 | `false` |
| `showResetButton` | 是否显示重置按钮（紧跟最后一个字段） | `true` |
| `searchOnReset` | 手动模式下重置后是否补发一次查询；自动模式重置本身就会触发查询 | `false` |

- **拦截**：自动与手动查询共用 `beforeSearch`，返回 `false` 或 `Promise<false>` 时不抛 `search`
- **合并**：防抖窗口内的多次变化只触发一次查询；`beforeSearch` 异步执行期间再次触发会被忽略
- **重置**：主行重置恢复全部字段的 `defaultValue` 并抛 `reset(values)`；弹层内的重置只清空高级字段
- **loading**：`loading` 为 `true` 时重置按钮禁用，查询按钮（若显示）进入 loading 并禁用
- **既要自动又要按钮**：用 `actions` 插槽的 `search()` 自行放置按钮（`showSearchButton` 与自动查询互斥）

### 远程枚举

- 同一个 `key` + 同一个 `request` 函数只请求一次（`requestOnce` 默认 `true`）
- 并发请求会被去重；请求期间 `select` / `cascader` / `treeSelect` 显示 loading
- 成功抛出 `options-loaded(key, options)`，失败抛出 `options-error(key, error)` 并继续渲染
- 需要重新拉取时调用实例 `refreshOptions(key?)`；`requestOnce: false` 则每次列配置变化都会重新请求

静态 `options` 优先于远程枚举。

### 折叠

| 配置 | 说明 | 默认值 |
| --- | --- | --- |
| `defaultCollapsed` | 初始是否折叠；受控模式下被 `collapsed` 覆盖 | `true` |
| `collapsedRows` | 折叠后可见行数 | `1` |
| `collapsed` | 受控折叠（`v-model:collapsed`） | `undefined` |
| `showAdvancedButton` | 是否显示折叠 / 展开按钮 | `true` |
| `expandText` / `collapseText` | 展开 / 折叠文案 | `'展开'` / `'折叠'` |
| `gap` | flex 行间距 | `12` |

折叠实现为容器限高 + `overflow: hidden`：限高 = `collapsedRows × 行高 + (collapsedRows - 1) × gap`，行高按控件尺寸取 `small 34px` / `medium 40px` / `large 46px`。展开 / 折叠按钮在**实测内容高度超过限高**时才出现（容器尺寸变化会用 `ResizeObserver` 重新测量），高级列不计入主行内容。

### 自定义字段

`field-<key>` 插槽可以接管任意列（包括高级列）的控件，作用域包含 `column`、`value`、`setValue`：

```vue
<LiteFilter :columns="columns">
  <template #field-budget="{ value, setValue }">
    <NSlider range :value="value ?? [0, 100]" @update:value="setValue" />
  </template>
</LiteFilter>
```

插槽内容撑满字段宽度即可（字段宽度仍由 `width` 决定），并必须调用 `setValue` 写回，组件才能同步值模型。

### actions 插槽

`actions` 插槽渲染在默认按钮之后，作用域提供：

| 字段 | 说明 |
| --- | --- |
| `search()` | 触发查询 |
| `reset()` | 触发重置 |
| `toggleCollapsed()` | 切换折叠 |
| `collapsed` | 当前是否折叠 |
| `loading` | 当前是否处于查询 loading |

### 容器

默认只渲染 `NForm`。`card=true` 时外层包一张 `NCard`（`size="small"`、hoverable）。

## 示例

### 基础用法

<Demo title="紧凑工具栏"
desc="默认无卡片、无字段标签；占位符说明条件，small 控件与 12px 间距，字段按内容宽度排布，超出折叠行数的部分收进「展开」。"
:raw="BasicRaw">

<Basic />

</Demo>

### 自动查询与手动查询

<Demo title="searchDebounce / showSearchButton"
desc="默认不渲染查询按钮，条件变化防抖后自动查询、连续输入合并为一次；打开开关显示查询按钮即回到手动模式。"
:raw="SearchModeRaw">

<SearchMode />

</Demo>

### 高级筛选弹层

<Demo title="advanced 列 + NPopover"
desc="关键词与状态留在主行，负责人 / 日期 / 金额收进弹层；弹层内改条件同样自动查询，底部重置只清空弹层字段。"
:raw="AdvancedFilterRaw">

<AdvancedFilter />

</Demo>

### 远程枚举

<Demo title="request 拉取选项"
desc="城市与部门来自异步接口；同一请求只执行一次，可通过暴露的 refreshOptions 手动刷新。"
:raw="RemoteEnumRaw">

<RemoteEnum />

</Demo>

### 间距、宽度与折叠

<Demo title="gap / width / v-model:collapsed"
desc="切换 8 / 12 / 20px 间距；备注列用 width=260 加宽；外部按钮受控折叠、切换标签与恢复卡片，缩窄容器可观察自动换行。"
:raw="WrapCollapseRaw">

<WrapCollapse />

</Demo>

### 自定义字段与附加操作

<Demo title="field-<key> 与 actions 插槽"
desc="关键词列换成带标签的输入框并设 width=240，操作区追加导出按钮；status 列的 tooltip 会保留小标签。"
:raw="SlotsRaw">

<Slots />

</Demo>

### loading 与查询拦截

<Demo title="loading / beforeSearch"
desc="关键词少于 2 个字符时，自动查询会被 beforeSearch 拦截并给出提示；查询期间重置按钮禁用。"
:raw="LoadingRaw">

<Loading />

</Demo>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 列配置 | `LiteFilterColumn[]` | `[]` |
| defaultValue | 初始值与重置目标 | `Record<string, any>` | `{}` |
| formConfig | 透传给 NForm 的属性 | `LiteFilterFormConfig` | `{}` |
| card | 是否渲染卡片容器 | `boolean` | `false` |
| defaultCollapsed | 初始是否折叠（非受控） | `boolean` | `true` |
| collapsedRows | 折叠后可见行数 | `number` | `1` |
| collapsed | 受控折叠（`v-model:collapsed`） | `boolean` | `undefined` |
| loading | 查询 loading 与按钮禁用 | `boolean` | `false` |
| beforeSearch | 查询前钩子，返回 `false` 拦截 | `(values) => boolean \| Promise<boolean>` | `undefined` |
| searchText | 查询按钮文案（仅 `showSearchButton` 为 `true` 时出现） | `string` | `'查询'` |
| resetText | 重置按钮文案 | `string` | `'重置'` |
| expandText | 展开按钮文案 | `string` | `'展开'` |
| collapseText | 折叠按钮文案 | `string` | `'折叠'` |
| showResetButton | 是否显示重置按钮 | `boolean` | `true` |
| showSearchButton | 是否显示查询按钮；`true` 时关闭自动查询 | `boolean` | `false` |
| searchDebounce | 自动查询防抖时长（毫秒） | `number` | `300` |
| showAdvancedButton | 是否显示折叠 / 展开按钮 | `boolean` | `true` |
| searchOnReset | 手动模式下重置后是否自动查询 | `boolean` | `false` |
| showLabel | 是否显示字段标签 | `boolean` | `false` |
| advancedPopover | `advanced` 列是否收进弹层 | `boolean` | `true` |
| advancedText | 高级筛选按钮文案 | `string` | `'高级筛选'` |
| gap | flex 行间距 | `number` | `12` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| search | 查询触发（值变化防抖后，或点击「查询」按钮） | `(values: Record<string, any>) => void` |
| reset | 重置完成 | `(values: Record<string, any>) => void` |
| update:collapsed | 折叠状态变化，用于 `v-model:collapsed` | `(collapsed: boolean) => void` |
| options-loaded | 远程枚举成功 | `(key: string, options: any[]) => void` |
| options-error | 远程枚举失败 | `(key: string, error: unknown) => void` |

### Slots

| 插槽 | 说明 | 作用域 |
| --- | --- | --- |
| `field-<key>` | 接管指定列的控件（含高级列） | `{ column, value, setValue }` |
| actions | 在默认按钮后追加操作 | `{ search, reset, toggleCollapsed, collapsed, loading }` |
| default | 兼容旧版用法，内容在操作区渲染一次 | 同上 |

### Expose

| 名称 | 说明 |
| --- | --- |
| `refreshOptions(key?)` | 重新拉取远程枚举，不传 `key` 时刷新全部 |

### 类型导出

```ts
import type {
  LiteFilterActionsScope,
  LiteFilterColumn,
  LiteFilterEmits,
  LiteFilterExpose,
  LiteFilterFieldScope,
  LiteFilterFormConfig,
  LiteFilterProps,
  LiteFilterValueType,
} from '@banmao/procomponent'
```

## 常见问题

**为什么字段没有标签？**
LiteFilter 默认 `showLabel=false`，用占位符说明条件，让一行能放下更多字段。传 `showLabel` 可恢复标签；带 `tooltip` 的列始终保留小标签。

**和 QueryFilter 有什么区别？**
LiteFilter 是独立实现，不是 QueryFilter 的封装：主行用 flex 按内容宽度排布而不是栅格等宽列，默认无标签、小尺寸、12px 间距、无查询按钮（值变化自动查询），并额外提供高级筛选弹层；不提供 `v-model:modelValue`、`field-change` 与完整实例 API。

**字段太宽或太窄？**
按类型给的默认宽度只是兜底，用 `column.width` 精确控制单个字段，用 `formItemProps.style.width` 覆盖（优先级最高）；`switch` / `checkbox` / `radio` 类默认按内容宽度，不占额外空间。

**高级筛选弹层不出现？**
需要同时满足：至少一列配置 `advanced: true`、`advancedPopover` 为 `true`（默认），且该列没有 `hideInSearch`。

**弹层里的条件会计入查询吗？**
会。主行与弹层共用同一份值，`search` / `reset` 都覆盖全部字段；弹层内的值变化同样会走防抖自动查询，底部只有一个只清空自身字段的重置按钮。

**为什么不显示查询按钮？**
轻量筛选条的定位是「选完即查」，默认由值变化防抖触发 `search`，所以不渲染查询按钮，重置按钮也紧跟最后一个字段。需要手动确认再查（例如字段联动成本高、要先做校验）时传 `showSearchButton`，组件会回到手动模式并停止自动查询；此时仍想额外放一个触发按钮，可以在 `actions` 插槽里调用作用域提供的 `search()`。

**折叠按钮不显示？**
折叠按钮只在实测内容高度超过折叠限高时出现。若字段一行就放得下、`showAdvancedButton=false`，或容器没有布局尺寸（例如 SSR 首帧），都不会显示；可以缩小容器宽度或增加字段验证换行后是否出现。

**远程枚举如何刷新？**
默认 `requestOnce: true`，同一个 `key` + 同一个 `request` 函数只请求一次。通过组件 ref 调用 `refreshOptions(key)` 强制刷新，或把该列设为 `requestOnce: false`。

**能拿到当前表单值吗？**
LiteFilter 不提供 `getValues`；值会在 `search` / `reset` 时随事件抛出。需要在任意时刻读取或写入值时请使用 QueryFilter。

## 行为约定

- 列顺序：先按 `order` 升序，未设置 `order` 的列保持原顺序排在后面；`hideInSearch` 列不渲染
- 布局：主行是 flex 换行容器（`gap` 控间距），字段宽度按类型默认并可被 `width` / `formItemProps.style.width` 覆盖，操作区紧跟最后一个字段且参与换行；组件内部不渲染 `NGrid`
- 分组：`advancedPopover` 为 `true` 时，`advanced` 列进入弹层纵向排列，其余列进入主行
- 标签：默认隐藏；`showLabel` 或 `tooltip` 为真时渲染
- 空值：按字段类型初始化；`defaultValue` 覆盖对应 key
- 查询：默认自动查询——任意字段值变化后等 `searchDebounce` 毫秒抛 `search`（窗口内的连续变化合并为一次）；`showSearchButton=true` 时改为点击按钮查询，不再自动抛。两种模式都先过 `beforeSearch`，返回 `false` 时拦截；`beforeSearch` 异步执行期间重复触发会被忽略
- 重置：主行重置恢复全部字段的 `defaultValue` 并抛 `reset`；弹层重置只恢复高级字段。自动模式下重置引起的值变化会再抛一次 `search`；手动模式下由 `searchOnReset` 决定是否补发查询
- 远程枚举：请求一次、并发去重、失败不阻塞；静态 `options` 优先
- 折叠：`collapsed` 为真时容器限高并 `overflow: hidden`；受控与非受控都立即更新内部状态，受控模式下额外抛 `update:collapsed`；展开 / 折叠按钮按实测内容高度与限高比较决定是否显示
- 容器：`card=false` 时只渲染 NForm，不附加任何外层卡片样式
