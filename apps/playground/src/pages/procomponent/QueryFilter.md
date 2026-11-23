---
name: QueryFilter
desc: QueryFilter 是声明式查询筛选表单：用 columns 配置字段，自动渲染控件、折叠栅格、查询 / 重置与远程枚举，支持受控值、字段插槽与实例方法。
---

<route lang="yaml">
meta:
  layout: default
</route>

# QueryFilter

QueryFilter 是**完整的声明式查询筛选表单**：用 `columns` 描述字段，组件按类型渲染控件，自动处理栅格布局、折叠 / 展开、查询与重置、远程枚举与受控值。业务只需要关心「有哪些查询条件」和「查询时取什么值」。

它与 [LiteFilter](/procomponent/LiteFilter) 的分工：

| 组件 | 定位 | 适合场景 |
| --- | --- | --- |
| QueryFilter | 完整筛选表单 | 列表页顶部查询区，字段多、需要折叠、远程枚举、自定义控件 |
| LiteFilter | 轻量行内筛选 | 紧凑工具栏、无标签占位符 + 高级弹层、只做快速过滤 |

本页描述仓库当前源码的行为。

## 特性

- **配置式字段**：`columns` 驱动，`valueType` 决定控件，新增 `dateRange`、`radio`、`checkboxGroup`
- **完整值模型**：非受控（`defaultValue`）与受控（`v-model:modelValue`）两种模式
- **查询 / 重置**：`search` / `reset` 事件，`loading`、`beforeSearch`、`searchOnReset`
- **折叠栅格**：`gridCols`、`gridCollapsed` / `gridCollapsedRows`，`v-model:collapsed` 受控折叠
- **远程枚举**：`request` 拉取选项，同一请求只执行一次，自带 loading 与失败事件
- **自定义字段**：`field-<key>` 插槽接管任意列控件
- **附加操作**：`actions` 插槽在默认按钮后追加业务按钮
- **实例方法**：`getValues`、`setValues`、`setFieldValue`、`search`、`reset`、`toggleCollapsed`、`refreshOptions`
- **容器可选**：`card=false` 不渲染卡片，便于嵌入自定义容器
- **类型导出**：`QueryFilterColumn`、`QueryFilterProps`、`QueryFilterEmits`、`QueryFilterExpose`、`QueryFilterValueType` 等

## 何时使用

- 列表页 / 报表页顶部的查询区
- 字段较多，需要按行折叠，只在展开后显示次要条件
- 下拉选项来自接口，需要加载态、失败兜底或手动刷新
- 条件值需要与外部状态双向同步（URL、store、父组件表单）
- 某一列需要非标准控件（区间滑块、组合输入等）

## 快速上手

### 安装

```script-tabs
@banmao/procomponent
```

### 按需引入

```vue
<script setup>
import { QueryFilter } from '@banmao/procomponent'
</script>
```

### 全局注册

```ts
import { createApp } from 'vue'
import { QueryFilterPlugin } from '@banmao/procomponent'
import App from './App.vue'

createApp(App).use(QueryFilterPlugin).mount('#app')
```

### 基本使用

```vue
<script setup lang="ts">
import { QueryFilter, type QueryFilterColumn } from '@banmao/procomponent'

const columns: QueryFilterColumn[] = [
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
  <QueryFilter :columns="columns" @search="handleSearch" />
</template>
```

## 核心概念

### 列配置

`columns` 的每一项描述一个查询条件：

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| `key` | 字段标识，同时作为表单取值 key | `string` |
| `title` | 字段标题 | `string` |
| `valueType` | 控件类型，见下方字段类型表 | `QueryFilterValueType` |
| `options` | 静态选项，`select` / `radio` / `checkboxGroup` 等使用 | `any[]` |
| `request` | 远程枚举请求函数 | `() => Promise<any[]>` |
| `requestOnce` | 远程枚举是否只请求一次，默认 `true` | `boolean` |
| `hideInSearch` | 不在表单中渲染；默认值仍会保留在取值结果里 | `boolean` |
| `order` | 排序权重，数值小的在前；未设置时排在有 `order` 的列之后，保持原顺序 | `number` |
| `tooltip` | 标题后的提示图标与内容 | `string` |
| `formItemProps` | **透传给控件**的属性，如 `min`、`multiple`、`type`、`valueFormat` | `Record<string, any>` |
| `placeholder` | 覆盖默认占位符 | `string` |
| `disabled` | 禁用控件 | `boolean` |
| `grid` | 栅格跨列数 | `number` |

`formItemProps` 与 ProForm 的列配置保持一致：它作用在**控件**上，而不是 NFormItem。

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

### 值模型

两种使用方式：

| 模式 | 写法 | 说明 |
| --- | --- | --- |
| 非受控 | 只传 `defaultValue` | 组件内部维护值；输入变化抛 `update:modelValue` 与 `field-change` |
| 受控 | `v-model:modelValue` | 外部对象作为完整值模型；字段缺失时用各类型空值补齐 |

要点：

- `defaultValue` 是**初始值与重置目标**。传入 `modelValue` 时，挂载与后续同步以 `modelValue` 为准
- `update:modelValue` 抛出的对象始终是**完整值**，不是单字段补丁
- `field-change(key, value, values)` 在任意字段变化时抛出，适合做埋点或条件联动
- 外部直接替换 `modelValue` 会把表单整体同步为「空值 + 新值」；未在新对象中出现的字段会回到该类型的空值
- 非受控模式下，运行中修改 `defaultValue` 会合并进当前值；受控模式下以 `modelValue` 为准

```vue
<QueryFilter v-model:model-value="conditions" :columns="columns" />
```

### 查询与重置

- **查询**：点击「查询」或调用实例 `search()`，校验通过后抛出 `search(values)`
- **重置**：点击「重置」或调用实例 `reset()`，恢复 `defaultValue` 并抛出 `reset(values)`
- **loading**：`loading` 为 `true` 时查询按钮 loading 并禁用，重置按钮禁用
- **beforeSearch**：查询前钩子，返回 `false` 或 `Promise<false>` 时拦截；异步执行期间按钮进入 loading
- **searchOnReset**：为 `true` 时重置后自动查询

```vue
<script setup lang="ts">
async function beforeSearch(values: Record<string, any>) {
  if (values.keyword && values.keyword.length < 2) {
    message.warning('关键词至少 2 个字符')
    return false
  }
  return true
}
</script>

<template>
  <QueryFilter :columns="columns" :before-search="beforeSearch" search-on-reset />
</template>
```

`beforeSearch` 抛错时会在控制台打印错误并中止本次查询，不会抛出 `search`。

### 远程枚举

列配置 `request` 后，组件会在挂载时拉取选项：

- 同一个 `key` + 同一个 `request` 函数只请求一次（`requestOnce` 默认 `true`）
- 并发请求会被去重；请求期间 `select` / `cascader` / `treeSelect` 显示 loading
- 成功抛出 `options-loaded(key, options)`，失败抛出 `options-error(key, error)` 并继续渲染，不影响其他字段
- 需要重新拉取时调用实例 `refreshOptions(key?)`；`requestOnce: false` 则每次列配置变化都会重新请求

```vue
<script setup lang="ts">
const filterRef = ref()

function requestCities() {
  return api.getCities()
}
</script>

<template>
  <QueryFilter ref="filterRef" :columns="columns" />
  <NButton @click="filterRef?.refreshOptions('city')">刷新城市</NButton>
</template>
```

静态 `options` 优先于远程枚举：列上同时配置 `options` 与 `request` 时使用 `options`。

### 折叠与栅格

| 配置 | 说明 | 默认值 |
| --- | --- | --- |
| `gridCols` | 每行列数，支持数字或响应式字符串（如 `'1 s:2 m:3 l:4'`） | `3` |
| `formConfig.gridCollapsed` | 初始是否折叠；受控模式下被 `collapsed` 覆盖 | `true` |
| `formConfig.gridCollapsedRows` | 折叠后显示的行数 | `1` |
| `collapsed` | 受控折叠（`v-model:collapsed`） | `undefined` |
| `showAdvancedButton` | 是否显示折叠 / 展开按钮 | `true` |
| `expandText` / `collapseText` | 展开 / 折叠文案 | `'展开'` / `'折叠'` |

折叠按钮的显示条件：`列数 + 1 > 列数上限 × 折叠行数`（操作区也占一个栅格单元），且 `showAdvancedButton` 为 `true`。`gridCols` 为响应式字符串时，按其中第一个数字估算列数。

其余 `formConfig` 属性会透传给内部 `NForm`（如 `labelPlacement`、`size`、`rules`）；`gridCollapsed` 与 `gridCollapsedRows` 不会透传。

### 自定义字段

`field-<key>` 插槽可以接管某一列的控件，作用域包含 `column`、`value`、`setValue`：

```vue
<QueryFilter :columns="columns">
  <template #field-budget="{ value, setValue }">
    <NSlider range :value="value ?? [0, 100]" @update:value="setValue" />
  </template>
</QueryFilter>
```

插槽内必须调用 `setValue` 写回，组件才能同步值模型、触发 `field-change` 与 `update:modelValue`。没有对应插槽的列仍使用内置控件。

### actions 插槽

`actions` 插槽渲染在「重置 / 查询 / 折叠」之后，作用域提供：

| 字段 | 说明 |
| --- | --- |
| `search()` | 触发查询，等价于点击查询 |
| `reset()` | 触发重置 |
| `toggleCollapsed()` | 切换折叠 |
| `collapsed` | 当前是否折叠 |
| `loading` | 当前是否处于查询 loading |

```vue
<QueryFilter :columns="columns">
  <template #actions="{ search }">
    <NButton text type="primary" @click="search">导出当前条件</NButton>
  </template>
</QueryFilter>
```

### 容器

默认外层是 `NCard`（hoverable）。`card=false` 时只渲染表单本身，适合放进已有的卡片、抽屉或工具栏。

## 代码示例

### 基础查询

<Demo title="文本 / 下拉 / 日期"
desc="6 个字段、3 列布局，默认折叠；查询和重置都会把当前值输出到下方。"
:raw="BasicRaw">

<Basic />

</Demo>

### 远程枚举

<Demo title="request 拉取选项"
desc="城市与部门来自异步接口；同一请求只执行一次，顶部可手动刷新枚举并观察请求次数。"
:raw="RemoteSelectRaw">

<RemoteSelect />

</Demo>

### 全部字段类型

<Demo title="15 种 valueType"
desc="展开查看所有控件，查询后输出每种类型对应的值，便于对照类型与空值约定。"
:raw="ValueTypesRaw">

<ValueTypes />

</Demo>

### 受控值

<Demo title="v-model:modelValue 与 v-model:collapsed"
desc="外部按钮填充 / 清空条件并控制折叠；字段变化会抛 field-change，查询时带 500ms loading。"
:raw="ControlledRaw">

<Controlled />

</Demo>

### 自定义字段

<Demo title="field-<key> 插槽"
desc="关键词列换成带标签的输入框，预算列换成区间滑块；两个自定义控件都通过 setValue 写回。"
:raw="CustomFieldRaw">

<CustomField />

</Demo>

### 栅格与折叠

<Demo title="gridCols / grid / hideInSearch"
desc="切换 2 列、3 列与响应式列数；备注列跨两列，隐藏列不渲染，card=false 去掉卡片容器。"
:raw="GridLayoutRaw">

<GridLayout />

</Demo>

### 实例方法与 beforeSearch

<Demo title="setValues / search / refreshOptions"
desc="通过外部按钮调用实例方法；beforeSearch 拦截少于 2 个字符的关键词，查询期间按钮 loading。"
:raw="InstanceApiRaw">

<InstanceApi />

</Demo>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 列配置 | `QueryFilterColumn[]` | `[]` |
| defaultValue | 初始值与重置目标 | `Record<string, any>` | `{}` |
| modelValue | 受控值（`v-model:modelValue`） | `Record<string, any>` | `undefined` |
| gridCols | 每行列数 | `number \| string` | `3` |
| formConfig | NForm 属性与折叠配置 | `FormConfig` | `{ gridCollapsed: true, gridCollapsedRows: 1 }` |
| card | 是否渲染卡片容器 | `boolean` | `true` |
| collapsed | 受控折叠（`v-model:collapsed`） | `boolean` | `undefined` |
| loading | 查询 loading 与按钮禁用 | `boolean` | `false` |
| searchText | 查询按钮文案 | `string` | `'查询'` |
| resetText | 重置按钮文案 | `string` | `'重置'` |
| expandText | 展开按钮文案 | `string` | `'展开'` |
| collapseText | 折叠按钮文案 | `string` | `'折叠'` |
| showResetButton | 是否显示重置按钮 | `boolean` | `true` |
| showAdvancedButton | 是否显示折叠 / 展开按钮 | `boolean` | `true` |
| searchOnReset | 重置后是否自动查询 | `boolean` | `false` |
| beforeSearch | 查询前钩子，返回 `false` 拦截 | `(values) => boolean \| Promise<boolean>` | `undefined` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| search | 查询触发 | `(values: Record<string, any>) => void` |
| reset | 重置完成 | `(values: Record<string, any>) => void` |
| update:modelValue | 值变化，用于 `v-model:modelValue` | `(values: Record<string, any>) => void` |
| update:collapsed | 折叠状态变化，用于 `v-model:collapsed` | `(collapsed: boolean) => void` |
| field-change | 任一字段变化 | `(key: string, value: any, values: Record<string, any>) => void` |
| options-loaded | 远程枚举成功 | `(key: string, options: any[]) => void` |
| options-error | 远程枚举失败 | `(key: string, error: unknown) => void` |

### Slots

| 插槽 | 说明 | 作用域 |
| --- | --- | --- |
| `field-<key>` | 接管指定列的控件 | `{ column, value, setValue }` |
| actions | 在默认按钮后追加操作 | `{ search, reset, toggleCollapsed, collapsed, loading }` |

### Expose

| 名称 | 说明 |
| --- | --- |
| `getValues()` | 获取当前完整值（深拷贝） |
| `setValues(values, merge = true)` | 合并写入；`merge=false` 时以 `defaultValue` 为底整体替换 |
| `setFieldValue(key, value)` | 写入单个字段 |
| `getFieldValue(key)` | 读取单个字段 |
| `search()` | 触发查询，返回 `Promise<void>` |
| `reset()` | 恢复 `defaultValue` |
| `toggleCollapsed(force?)` | 切换折叠；传布尔值时强制为该状态 |
| `refreshOptions(key?)` | 重新拉取远程枚举，不传 `key` 时刷新全部 |
| `collapsed` | 当前折叠状态 |
| `optionsLoading` | 各字段远程枚举加载状态 |
| `form` | 内部 NForm 实例 |

### QueryFilterColumn

见 [列配置](#列配置) 与 [字段类型](#字段类型)。

### 类型导出

```ts
import type {
  QueryFilterActionsScope,
  QueryFilterColumn,
  QueryFilterEmits,
  QueryFilterExpose,
  QueryFilterFieldScope,
  QueryFilterProps,
  QueryFilterValueType,
} from '@banmao/procomponent'
```

## 常见问题

**点了查询没有触发 `search`？**
检查 `beforeSearch` 是否返回了 `false`，或异步钩子仍在执行（此时按钮处于 loading）。`beforeSearch` 抛错也会中止查询并在控制台打印错误。

**重置后想自动刷新列表？**
设置 `search-on-reset`，组件会在重置后自动调用一次查询；也可以在 `@reset` 里自行处理。

**远程枚举没有重新请求？**
默认 `requestOnce: true`，同一个 `key` + 同一个 `request` 函数只请求一次。调用 `refreshOptions(key)` 强制刷新，或把该列设为 `requestOnce: false`。

**折叠按钮不显示？**
显示条件是 `列数 + 1 > 每行列数 × 折叠行数`，且 `showAdvancedButton` 为 `true`。`gridCols` 为响应式字符串时按第一个数字估算；列数较少时本来就不需要折叠。

**`modelValue` 改了但表单没变？**
受控模式要求 `modelValue` 是新的对象引用，组件通过深比较决定是否同步；同时 `v-model` 需要监听 `update:modelValue` 才能回写。

**复选框为什么是布尔值？**
`valueType: 'checkbox'` 是单个布尔开关；多选请用 `checkboxGroup`，值为数组。

**日期值是什么格式？**
默认 `yyyy-MM-dd` 字符串（`dateRange` 为字符串数组）。通过 `formItemProps.valueFormat` 修改；设为 `null` 会得到时间戳。

**隐藏列还会出现在查询值里吗？**
会。`hideInSearch` 只控制是否渲染，列仍参与空值初始化，并保留 `defaultValue` 中的值。

**`formItemProps` 是给 FormItem 还是控件的？**
给控件的，与 ProForm 一致。需要改标签宽度等表单级属性请用 `formConfig`。

**能替换整个字段区域吗？**
用 `field-<key>` 插槽接管单列；组件没有提供替换整个表单的默认插槽。需要完全自定义时直接用 NForm。

## 行为约定

- 列顺序：先按 `order` 升序，未设置 `order` 的列保持原顺序排在后面；`hideInSearch` 列不渲染
- 空值：按字段类型初始化；`defaultValue` 与 `modelValue` 覆盖对应 key
- 值同步：字段变化 → `field-change` → `update:modelValue`；`update:modelValue` 始终是完整值
- 查询：`beforeSearch` 通过（或未配置）后抛 `search`；异步钩子期间按钮 loading，重复调用被忽略
- 重置：恢复 `defaultValue`，抛 `reset`；`searchOnReset` 为 `true` 时继续触发查询
- 远程枚举：请求一次、并发去重、失败不阻塞；静态 `options` 优先
- 折叠：受控与非受控都立即更新内部状态，受控模式下额外抛 `update:collapsed`
- 容器：`card=false` 时只渲染 NForm，不附加任何外层卡片样式
