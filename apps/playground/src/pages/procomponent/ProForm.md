---
name: ProForm
desc: ProForm 是基于 NForm 的配置式表单组件：用 columns 描述字段，valueType 决定控件，内置栅格布局、搜索 / 登录操作区、列级与表单级校验、远程枚举、默认值重置与实例方法。
---

<route lang="yaml">
meta:
  layout: default
</route>

# ProForm

ProForm 是**配置式表单组件**：用 `columns` 数组描述字段，用 `valueType` 决定渲染哪种控件，用 `v-model:model` 持有表单数据。组件在 NForm 之上补齐了栅格布局、搜索 / 登录两种操作区、远程枚举、默认值重置和实例方法，适合中后台的增删改表单与查询表单。

本页描述仓库当前源码的行为。

## 特性

- **配置式字段**：`columns` 驱动，`key` + `title` + `valueType` 即可渲染
- **16 种内置控件**：文本、多行文本、数字、下拉、单选、多选、级联、开关、时间、日期、日期时间及两种范围、月份及月份范围、上传
- **自定义控件**：`valueType: 'custom'` + `formRender` 完全接管控件渲染
- **栅格布局**：`gridCols` 控制列数，列级 `grid` 映射为栅格 `span`
- **三种操作区**：`normal` / `search` / `login`；`modal` / `drawer` 不渲染按钮，供容器组件使用
- **校验**：表单级 `rules` 透传 NForm，列级 `rule` 挂在对应 NFormItem 上
- **远程枚举**：列级 `request` 异步加载选项，按 `key` 缓存，`options` 优先
- **数据双向同步**：`v-model:model`，内部变更写回外部模型
- **默认值与重置**：`defaultValue` 同时作为初始值与重置目标
- **实例方法**：`submit()`、`reset()`、`validate()`、`getValues()`、`setFieldValue(key, value)`
- **NForm 直通**：`labelWidth`、`labelPlacement`、`size`、`disabled`、`showFeedback` 等属性直接透传

## 何时使用

- 需要快速搭建增删改表单，字段差异主要靠配置而不是模板
- 查询区的搜索 / 重置 / 展开折叠需要统一形态
- 字段选项来自接口，且希望按字段缓存、避免重复请求
- 多个表单共享同一套字段定义与校验规则

## 快速上手

### 安装

```script-tabs
@banmao/procomponent
```

### 按需引入

```vue
<script setup>
import { ProForm } from '@banmao/procomponent'
</script>
```

### 全局注册

```ts
import { createApp } from 'vue'
import { ProFormPlugin } from '@banmao/procomponent'
import App from './App.vue'

createApp(App).use(ProFormPlugin).mount('#app')
```

### 基本使用

`columns` 描述字段，`v-model:model` 持有数据，`@submit` 在校验通过后触发：

```vue
<script setup>
import { ref } from 'vue'
import { ProForm } from '@banmao/procomponent'

const formModel = ref({})
const columns = [
  { title: '用户名', key: 'username', valueType: 'text' },
  {
    title: '角色',
    key: 'role',
    valueType: 'select',
    options: [
      { label: '管理员', value: 'admin' },
      { label: '编辑', value: 'editor' },
    ],
  },
  { title: '年龄', key: 'age', valueType: 'digit' },
  { title: '入职日期', key: 'joinDate', valueType: 'date' },
]

function handleSubmit(values) {
  console.log(values)
}
</script>

<template>
  <ProForm
    v-model:model="formModel"
    :columns="columns"
    :grid-cols="2"
    label-placement="left"
    :label-width="96"
    @submit="handleSubmit"
  />
</template>
```

## 核心概念

### 数据结构

组件内部维护一份 `formData`，在挂载时按 `columns` 初始化；重置时也会按当前 `columns` 重建。初始化规则如下：

| valueType | 控件 | 初始值 |
| --- | --- | --- |
| `text` | NInput | `''` |
| `textarea` | NInput（textarea） | `''` |
| `digit` | NInputNumber | `null` |
| `select` | NSelect | `null` |
| `radio` | NRadioGroup | `''` |
| `checkbox` | NCheckboxGroup | `[]` |
| `cascader` | NCascader | `null` |
| `switch` | NSwitch | `false` |
| `time` | NTimePicker | `null` |
| `date` / `datetime` / `daterange` / `datetimerange` | NDatePicker | `null` |
| `month` / `monthrange` | NDatePicker | `''` |
| `upload` | NUpload | `null` |
| `custom` | `formRender` 决定 | `''` |

`month` / `monthrange` 当前按文本类初始化，建议在 `model` 中显式给 `null`，避免日期控件拿到空字符串。

日期类控件通过 `formatted-value` 绑定字符串：

| valueType | 格式 |
| --- | --- |
| `date` / `daterange` | `yyyy-MM-dd`，范围值为字符串数组 |
| `datetime` / `datetimerange` | `yyyy-MM-dd HH:mm:ss`，范围值为字符串数组 |
| `month` / `monthrange` | `yyyy-MM`，范围值为字符串数组 |

### 数据流：model 与 defaultValue

- `model`（`v-model:model`）用于和外部共享数据：挂载时**整体合并**进内部 `formData`（包括不在 `columns` 中的 key），内部变更通过 `update:model` 写回
- 挂载那一刻不回写 `update:model`；之后每次字段变化都会写回
- **`defaultValue` 与 `model` 同时存在时，`defaultValue` 优先**：挂载会直接用 `defaultValue` 覆盖内部数据
- 挂载后再修改 `model`，只有**已经存在于 `formData` 中的 key** 会被同步；新增 key 不会自动进入表单
- `defaultValue` 同时是**重置目标**，见[提交与重置](#提交与重置)

```ts
const formModel = ref({ name: '张三' })

// 挂载后外部修改：会回写到表单
formModel.value.name = '李四'

// 不会回写到表单：extra 不在 columns 中
formModel.value.extra = 'x'
```

### columns

每个字段是一个列配置对象，最常用的是 `key` / `title` / `valueType`：

```ts
const columns = [
  { title: '姓名', key: 'name', valueType: 'text' },
  { title: '城市', key: 'city', valueType: 'select', options: [] },
]
```

- `key` 是 `formData` 的字段名，也是 `rules` 与 `rule` 的匹配依据，不支持路径嵌套
- `title` 是标签文案；传 VNode 时正常渲染，但列上的 `tooltip` 只在 `title` 为字符串时生效
- 完整字段见 [ProFormColumn](#proformcolumn)

### 远程枚举 request

给列配置 `request`，用于异步加载 `select` / `cascader` 等控件的选项：

```ts
{
  title: '城市',
  key: 'city',
  valueType: 'select',
  request: async () => {
    const res = await fetchCities()
    return res.map(item => ({ label: item.name, value: item.code }))
  },
}
```

- 挂载时**无参调用** `request()`，结果作为该字段的选项
- 同一个 `key` 只请求一次；只有列的 `request` 函数**引用变化**时才重新请求
- `options` 与远程结果同时存在时 **`options` 优先**（空数组也会挡住远程结果）
- 请求失败没有内置错误态，请在 `request` 内部自行 `catch`
- 列上的 `defaultValue` 会被当作级联的「默认路径」：组件用 `initTreeData` 按路径逐级调用 `request(item)` 并组装 `children`，只建议给级联列配置
- 控件的其余配置写在 `formItemProps` 中，例如远程级联的 `remote` / `onLoad`

### 自定义控件 formRender

`valueType: 'custom'` 时，控件由 `formRender` 渲染：

```ts
{
  title: '满意度',
  key: 'rating',
  valueType: 'custom',
  formRender: (key, formData, formItemProps) => h(NRate, {
    'value': formData.value[key],
    'onUpdate:value': (v) => (formData.value[key] = v),
  }),
}
```

- 第一个参数是字段 `key`
- 第二个参数是**内部的 `formData` Ref**，需要通过 `.value` 读写
- 第三个参数是列上的 `formItemProps`，不是 NFormItem 的属性

### 栅格布局

内部使用 NGrid 渲染，`gridCols` 是列数，列级 `grid` 映射为 NGridItem 的 `span`：

```ts
const columns = [
  { title: '姓名', key: 'name', valueType: 'text' },
  { title: '年龄', key: 'age', valueType: 'digit' },
  { title: '备注', key: 'remark', valueType: 'textarea', grid: 2 },
]
```

```vue
<ProForm :columns="columns" :grid-cols="2" />
```

- `gridCols` 默认 `1`
- `grid` 支持数字，也支持 Naive UI 的响应式 `span` 写法
- 栅格间距固定为 16px
- NGrid 固定使用 `item-responsive` + `responsive="screen"`；组件声明了 `responsive` 属性，但当前**没有接线**

### 校验

校验规则有两种写法，可以同时使用：

```ts
// 表单级：按 key 匹配
const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
}

// 列级：直接在列上
const columns = [
  {
    title: '城市',
    key: 'city',
    valueType: 'select',
    rule: [{ required: true, message: '请选择城市', trigger: 'change' }],
  },
]
```

- `rules` 直接透传给 NForm
- 列级 `rule` 挂在对应的 NFormItem 上
- 只有点击提交 / 搜索按钮时才会整体校验
- **校验失败只在控制台打印错误，不会抛出事件**；需要自定义失败处理时请自行包裹提交逻辑
- `showFeedback`（NForm 属性）控制是否展示错误文案，但不影响拦截提交

### 操作区与 mode

| mode | 操作区 | 说明 |
| --- | --- | --- |
| `normal` | 居中「重置 + 提交」 | 默认值；`submitText` / `resetText` 生效 |
| `search` | 右下角「重置 + 搜索 + 展开/折叠」 | `searchText` / `loading` / `showResetButton` / `showAdvancedButton` 生效 |
| `login` | 单个全宽按钮 | 文案固定为「登录」，不支持修改 |
| `modal` / `drawer` | 无内置按钮 | 供 `ModalForm` / `DrawerForm` 等容器渲染 footer |

搜索模式的两个折叠属性：

- `gridCollapsed`：初始是否折叠，默认 `false`
- `gridCollapsedRows`：折叠时保留的行数，默认 `1`
- `showAdvancedButton` 为 `false` 时不渲染展开/折叠按钮，并强制展开
- 按钮是否出现只在**挂载时**按「表单项数量（含后缀项）与 `gridCols` 比较」计算一次，之后修改 `columns` / `gridCols` 不会重新判断

### 提交与重置

提交时先校验，通过后触发 `submit(values)`：

```ts
function handleSubmit(values) {
  // values 就是内部的 formData 对象
}
```

重置语义按模式区分：

| mode | 重置目标 | `reset` 事件参数 |
| --- | --- | --- |
| `normal` / `login` | 有 `defaultValue` 时回到它；否则按当前 `columns` 重建空结构 | 无参数 |
| `search` | 空结构 + `defaultValue` 合并后的值 | 当前表单值 |

- `defaultValue` 在组件创建时被浅拷贝保存，深层对象仍然共享引用
- 重置也会触发 `update:model`，外部 `model` 会同步变成重置后的值
- 重置不会重新发起远程 `request`，已加载的选项继续复用

### 实例方法

通过模板 ref 获取实例：

```vue
<script setup>
import { ref } from 'vue'

const formRef = ref()

formRef.value?.submit()
formRef.value?.reset()
formRef.value?.setFieldValue('city', 'shanghai')
</script>
```

- `submit()`：执行校验并触发 `submit`
- `reset()`：等价于点击重置按钮
- `validate()`：只校验不提交，返回 `Promise<boolean>`，失败时 resolve `false` 而不抛错
- `getValues()`：返回当前表单值的浅拷贝，不触发校验或提交
- `setFieldValue(key, value)`：直接写入字段，不触发校验
- `setFieldValue` 可以写入不在 `columns` 中的 key，写回 `update:model` 后外部模型会带上它；但重置时会按 `columns` / `defaultValue` 重建，未声明的 key 可能被丢弃

## 代码示例

### 基础表单

<Demo title="基础表单"
desc="normal 模式：两列栅格、列级校验、备注跨两列；提交后在下方展示表单值。"
:raw="BasicFormRaw">

<BasicForm />

</Demo>

### 全部控件

<Demo title="16 种内置 valueType"
desc="文本、多行文本、数字、下拉、单选、多选、级联、开关、时间、日期与日期范围、月份与月份范围、上传。选择与日期类字段在 model 中显式给 null。"
:raw="ValueTypesRaw">

<ValueTypes />

</Demo>

### 栅格与气泡提示

<Demo title="gridCols 与列级 grid"
desc="切换 1 / 2 / 3 列；备注固定跨 3 列，姓名标签带 tooltip 气泡提示。"
:raw="GridLayoutRaw">

<GridLayout />

</Demo>

### 字段联动

<Demo title="下拉联动 + setFieldValue"
desc="企业变化时清空产品并重新生成产品选项；配合 rules 演示跨字段必填校验。"
:raw="UniLinkChangeRaw">

<UniLinkChange />

</Demo>

### 远程枚举

<Demo title="request 加载选项"
desc="城市选项异步加载；替换 request 引用后同一 key 会重新请求，静态 options 与远程结果互不影响。"
:raw="RemoteSelectRaw">

<RemoteSelect />

</Demo>

### 异步级联

<Demo title="级联逐级加载"
desc="第一个级联通过 formItemProps.remote + onLoad 逐级请求子节点；第二个级联用 request 一次加载完整树。"
:raw="RequestCascaderFormRaw">

<RequestCascaderForm />

</Demo>

### 搜索模式

<Demo title="搜索操作区"
desc="search 模式下按钮位于右下角，带重置、搜索与展开/折叠；gridCollapsedRows 控制折叠后保留的行数。"
:raw="FilterResetRaw">

<FilterReset />

</Demo>

### 搜索默认值与重置

<Demo title="defaultValue 与搜索重置"
desc="defaultValue 提供初始条件；点击重置时，search 模式会回到「空结构 + defaultValue」，并携带当前值触发 reset。"
:raw="FilterResetWithDefaultRaw">

<FilterResetWithDefault />

</Demo>

### 登录模式

<Demo title="登录模式"
desc="login 模式渲染单个全宽按钮，文案固定为「登录」；校验规则与普通表单一致。"
:raw="BaseRaw">

<Base />

</Demo>

### 自定义控件

<Demo title="valueType: custom + formRender"
desc="用 NRate 完全接管满意度字段；formRender 的第二个参数是内部 formData 的 Ref。"
:raw="CustomFieldRaw">

<CustomField />

</Demo>

### 双向绑定

<Demo title="v-model:model"
desc="下方实时展示外部 model；按钮从外部改字段，表单控件同步更新，输入表单时 model 也会写回。"
:raw="VModelRaw">

<VModel />

</Demo>

### 实例方法

<Demo title="submit / reset / setFieldValue"
desc="通过 ref 调用实例方法；defaultValue 作为重置目标，setFieldValue 可以写入已有或新的字段。"
:raw="InstanceApiRaw">

<InstanceApi />

</Demo>

## 进阶用法

### 在 ModalForm / DrawerForm 中使用

包内同时导出了 `ModalForm` 与 `DrawerForm`，它们内部以 `mode="modal"` / `mode="drawer"` 渲染 ProForm，并负责弹窗开合与底部按钮：

```vue
<ModalForm
  title="新增用户"
  :columns="columns"
  :model="formModel"
  @submit="handleSubmit"
/>
```

ProForm 在这两种模式下不渲染任何按钮，单独使用 `mode="modal"` / `mode="drawer"` 时需要自行提供 footer。`ModalForm` 的独立文档见 [ModalForm](/procomponent/ModalForm)，`DrawerForm` 的独立文档见 [DrawerForm](/procomponent/DrawerForm)。

### 与 ProTable 搜索栏的关系

ProTable 的搜索栏由 ProForm 内部渲染，`search` 传对象时，其字段会覆盖到 ProForm 上，因此 `gridCols`、`gridCollapsed`、`gridCollapsedRows`、`labelWidth` 等可以直接写在 `search` 里。ProTable 会额外固定 `showFeedback: false`，并把重置目标处理成「创建时的快照 + `search.defaultValue`」，两处重置语义不完全相同。

## API

### Props

除下表外，全部 [NForm](https://www.naiveui.com/zh-CN/os-theme/components/form) 属性都会透传（如 `labelWidth`、`labelPlacement`、`labelAlign`、`size`、`disabled`、`inline`、`showFeedback`、`showLabel`、`showRequireMark`、`validateMessages`）。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 字段配置，见 [ProFormColumn](#proformcolumn) | `ProFormColumn[]` | `[]` |
| model | 双向绑定表单数据（`v-model:model`） | `Record<string, any>` | `{}` |
| rules | 表单级校验规则，按字段 `key` 匹配 | `Record<string, FormItemRule[]>` | - |
| gridCols | 栅格列数 | `number` | `1` |
| gridCollapsed | search 模式初始是否折叠 | `boolean` | `false` |
| gridCollapsedRows | 折叠时保留的行数 | `number` | `1` |
| mode | 操作区形态 | `'normal' \| 'search' \| 'login' \| 'modal' \| 'drawer'` | `'normal'` |
| defaultValue | 初始值快照，同时作为重置目标 | `Record<string, any>` | `{}` |
| loading | 搜索按钮 loading，仅 search 模式生效 | `boolean` | `false` |
| searchText | 搜索按钮文案 | `string` | `'搜索'` |
| submitText | 提交按钮文案 | `string` | `'提交'` |
| resetText | 重置按钮文案 | `string` | `'重置'` |
| showResetButton | 是否渲染重置按钮，仅 search 模式生效 | `boolean` | `true` |
| showAdvancedButton | 是否渲染展开/折叠按钮；`false` 时强制展开，仅 search 模式生效 | `boolean` | `true` |
| responsive | 已声明但当前未接线；内部固定 `item-responsive` + `responsive="screen"` | `'self' \| 'screen'` | `'self'` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| submit | 校验通过后触发 | `(values: Record<string, any>) => void` |
| reset | 点击重置（或调用实例 `reset()`）后触发 | `(values?: Record<string, any>) => void`，仅 search 模式携带值 |
| update:model | 内部表单值变化时触发，用于 `v-model:model` | `(values: Record<string, any>) => void` |

校验失败不会触发任何事件，错误只会在控制台打印。

### Expose

| 名称 | 说明 |
| --- | --- |
| `submit()` | 校验并提交，等价于点击提交 / 搜索按钮 |
| `reset()` | 重置表单，等价于点击重置按钮 |
| `setFieldValue(key, value)` | 直接写入字段值，不触发校验 |

### ProFormColumn

| 字段 | 说明 | 类型 | 必填 |
| --- | --- | --- | --- |
| key | 字段名，对应 `formData` 的 key，不支持路径嵌套 | `string` | 是 |
| title | 标签文案；字符串或 VNode | `string \| VNode` | 否 |
| valueType | 控件类型，见[数据结构](#数据结构)；不传或未知类型不会渲染控件 | `string` | 是 |
| options | 静态枚举，`select` / `radio` / `checkbox` / `cascader` 使用；存在时优先于远程结果 | `SelectOption[]` | 否 |
| formItemProps | 透传给控件的属性；`placeholder`、`clearable` 有默认值可覆盖 | `Record<string, any>` | 否 |
| rule | 该字段的校验规则 | `FormItemRule \| FormItemRule[]` | 否 |
| grid | 栅格 `span`，配合 `gridCols` 使用 | `number \| string` | 否 |
| tooltip | 标签后的气泡提示；要求 `title` 为字符串 | `string` | 否 |
| formTitle | 仅用于生成默认 placeholder（`请{formTitle}...`），不改变标签 | `string` | 否 |
| request | 异步枚举，挂载时无参调用一次，按 `key` 缓存 | `(item?: string \| number) => Promise<SelectOption[]>` | 否 |
| defaultValue | 级联枚举的默认路径，交给 `initTreeData` 逐级请求 | `(string \| number)[]` | 否 |
| formRender | `valueType: 'custom'` 时的控件渲染函数 | `(key: string, formData: Ref<Record<string, any>>, formItemProps?: Record<string, any>) => VNodeChild` | 否 |

> 常见 ProComponents 字段如 `hideInForm`、`password`、`slider`、`rate`、`timerange` 当前**未实现**。密码框可用 `formItemProps: { type: 'password' }`；评分 / 滑块请用 `valueType: 'custom'`。

### 类型导出

包入口目前只导出 `ProForm` 与 `ProFormPlugin`，**未导出** Props / Emits / 列类型。列配置建议自行声明接口；实例类型可使用 `InstanceType<typeof ProForm>`。

## 常见问题

**点了提交没反应？**
先看控制台：校验失败时组件只 `console.error`，不抛事件。确保必填字段通过，或检查 `trigger` 是否与交互匹配。

**改了 `model`，表单没变？**
挂载后只有已经存在于内部 `formData` 的 key 会被同步（挂载时传入的 `model` 会整体合并）。新增字段请写进 `columns`，或用实例 `setFieldValue`。

**`model` 和 `defaultValue` 同时传，谁生效？**
挂载时 `defaultValue` 优先，会覆盖 `model`；挂载后再改 `model` 仍会同步到已有字段。

**`reset` 事件拿不到值？**
`normal` / `login` 模式的重置不带参数；只有 `search` 模式会携带重置后的值。

**搜索模式的重置没有回到 `defaultValue`？**
确认 `defaultValue` 是对象且非空；search 模式重置的是「空结构 + `defaultValue`」，不是 `model` 的当前值。

**搜索栏没有重置按钮 / 折叠按钮？**
重置按钮检查 `show-reset-button`，折叠按钮检查 `show-advanced-button`；二者只在 `search` 模式生效。

**折叠按钮出现了但内容本来就只有一行？**
按钮可见性只在挂载时计算一次，且会把后缀按钮本身计入表单项数量，可能比预期更早出现。

**`request` 不会重新请求？**
同一 `key` 会缓存结果；只有 `request` 函数引用变化才会重拉。请替换成新函数，而不是修改原函数的内部状态。

**`options` 和 `request` 都配了？**
`options` 优先；即使配置的是空数组，也不会使用远程结果。

**上传的文件没进提交值？**
`upload` 只渲染 NUpload 并透传 `formItemProps`，文件列表不会写回 `formData`。若需提交文件，请在业务侧自行维护。

**日期控件显示异常？**
`date` / `datetime` / 范围类字段的初始值请用 `null`；`month` / `monthrange` 当前初始化为 `''`，建议在 `model` 中显式给 `null`。

**`grid` 没生效？**
`grid` 是栅格 `span`，必须配合 `gridCols`；`gridCols=1` 时任何 `span` 都会被压到 1 列。

**`responsive` 改了没效果？**
该属性当前未接线，栅格固定按屏幕断点响应。

**自定义控件拿不到值？**
`formRender` 的第二个参数是 `formData` 的 Ref，需要用 `formData.value[key]` 读写；第三个参数是列上的 `formItemProps`，不是 NFormItem 属性。

**为什么没导出的 `ProFormProps` 类型？**
当前包入口未导出相关类型，请自行声明列接口，或用 `InstanceType<typeof ProForm>` 标注 ref。

## 行为约定

- 组件不持有 `columns` 的所有权：列配置由外部传入，远程结果与选项缓存在内部维护。
- `formData` 只在挂载与重置时按 `columns` 构建；运行时增删列不会自动补齐或删除字段值。
- `request` 按字段 `key` 缓存，`options` 始终优先；远程失败没有内置错误态。
- 校验只在提交 / 搜索时整体执行，失败不抛事件，仅打印错误。
- `upload` 的文件列表不参与表单数据。
- `normal` / `login` 的 `reset` 不带参数，`search` 的 `reset` 携带值；两者都会触发 `update:model`。
- `login` 模式的按钮文案固定为「登录」。
- `modal` / `drawer` 模式不渲染按钮，footer 由容器负责。
- 组件没有插槽；所有字段级扩展通过 `valueType: 'custom'` + `formRender` 完成。
