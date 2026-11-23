---
name: ModalForm
desc: ModalForm 是基于 NModal 与 ProForm 的弹窗表单：用 columns 配置字段，支持内置 trigger、受控显隐、自定义 footer、提交后自动关闭与实例方法，异步提交可配合 closeOnSubmit 与 confirmLoading。
---

<route lang="yaml">
meta:
  layout: default
</route>

# ModalForm

ModalForm 把 [ProForm](/procomponent/ProForm) 装进 `NModal`（card 预设），在弹窗内完成新增 / 编辑表单。字段仍然用 `columns` 配置，弹窗负责开合、trigger、底部按钮与提交后的关闭。

本页描述仓库当前源码的行为。

## 特性

- **配置式字段**：`columns` 直接传给 ProForm，`valueType` 决定控件
- **内置 trigger**：`trigger` 插槽 > 默认插槽 > 内置「打开」按钮；`showTrigger=false` 可完全受控
- **两种显隐模式**：非受控（`defaultShow` + 实例方法）与受控（`v-model:show`）
- **提交后关闭**：校验通过触发 `submit`，`closeOnSubmit` 控制是否自动关闭
- **footer 可定制**：内置「重置 / 取消 / 确定」，`hideFooter` 隐藏，`footer` 插槽完全接管
- **异步提交**：`closeOnSubmit=false` + `confirmLoading`，由业务在请求完成后关闭
- **数据同步**：`v-model:model` 双向绑定，`defaultValue` 同时作为初始值与重置目标
- **NForm 直通**：`label-placement`、`rules`、`grid-cols` 等写在 ModalForm 上即可透传给 ProForm
- **实例方法**：`open`、`close`、`submit`、`reset`、`setFieldValue`、`form`
- **类型导出**：`ModalFormProps`、`ModalFormEmits`、`ModalFormExpose`、`ModalFormFooterScope`、`ModalFormColumn`

## 何时使用

- 中后台的新增 / 编辑弹窗，字段适合用配置描述
- 弹窗开合需要由外部按钮或业务流程控制
- footer 需要放自定义动作（保存并继续、仅保存草稿等）
- 提交走异步接口，不希望请求完成前就关闭弹窗

## 快速上手

### 安装

```script-tabs
@banmao/procomponent
```

### 按需引入

```vue
<script setup>
import { ModalForm } from '@banmao/procomponent'
</script>
```

### 全局注册

```ts
import { createApp } from 'vue'
import { ModalFormPlugin } from '@banmao/procomponent'
import App from './App.vue'

createApp(App).use(ModalFormPlugin).mount('#app')
```

### 基本使用

```vue
<script setup>
import { ref } from 'vue'
import { ModalForm } from '@banmao/procomponent'

const columns = [
  { title: '姓名', key: 'name', valueType: 'text' },
  { title: '年龄', key: 'age', valueType: 'digit' },
]

function handleSubmit(values) {
  console.log(values)
}
</script>

<template>
  <ModalForm title="新增用户" :columns="columns" @submit="handleSubmit" />
</template>
```

不传插槽时，组件会渲染一个内置的「打开」按钮作为 trigger。

## 核心概念

### 开合控制

ModalForm 支持两种用法：

| 用法 | 写法 | 说明 |
| --- | --- | --- |
| 非受控 | 不传 `show` | 内部维护状态；trigger 点击、实例 `open()` / `close()` 都能开关 |
| 受控 | `v-model:show` | 组件只抛 `update:show`，显隐由父组件决定 |

- `defaultShow` 只影响非受控模式的初始值，默认 `false`
- 受控模式下，父组件必须响应 `update:show`（例如 `v-model:show`），否则弹窗不会真正关闭
- 组件自身触发的开合会抛 `update:show`；无论显隐由谁改变，状态变化都会抛 `open` / `close` 事件
- `displayDirective` 默认 `'if'`：关闭后弹窗内容销毁，再次打开时 ProForm 会重新挂载并按 `model` / `defaultValue` 初始化
- 把 `displayDirective` 设为 `'show'` 时内容常驻，适合想保留未提交输入的弹窗；此时再次打开**不会**重新初始化表单

完全受控时通常会关闭内置 trigger：

```vue
<script setup>
import { ref } from 'vue'

const show = ref(false)
</script>

<template>
  <NButton @click="show = true">打开</NButton>
  <ModalForm v-model:show="show" :show-trigger="false" :columns="columns" />
</template>
```

### trigger 与插槽

trigger 的渲染优先级：

1. `trigger` 插槽
2. 默认插槽（兼容旧用法）
3. 内置「打开」按钮

trigger 外层包了一个可点击容器，点击即打开弹窗。默认插槽仅作为 trigger 的兼容回退；新代码建议使用 `trigger` 插槽。

### 与 ProForm 的关系

- `columns` 会先过滤掉 `type: 'index' | 'selection'` 与 `key: 'actions'` 的列，再交给 ProForm
- 除本页列出的属性外，其余属性会**透传给 ProForm**：`label-placement`、`label-width`、`rules`、`grid-cols`、`size`、`show-feedback` 等 NForm / ProForm 属性可以直接写在 ModalForm 上
- `model` 支持 `v-model:model`，内部变化会通过 `update:model` 写回
- `defaultValue` 与 ProForm 语义一致：挂载时优先于 `model`，同时作为重置目标
- 需要完全替换表单时使用 `form` 插槽；此时内置的「确定 / 重置」找不到 ProForm 实例，需要在 `footer` 里自行处理

### 提交、关闭与异步

点击「确定」会调用 ProForm 的 `submit()`：

1. ProForm 先整体校验
2. 校验通过后触发 ModalForm 的 `submit(values)`
3. `closeOnSubmit` 为 `true`（默认）时，紧接着关闭弹窗

校验失败只会在控制台打印错误，不触发 `submit`，弹窗保持打开。

Vue 的事件监听是同步调用，**组件不会等待 `@submit` 处理函数返回的 Promise**。异步提交请关闭自动关闭：

```vue
<ModalForm
  v-model:show="show"
  :close-on-submit="false"
  :confirm-loading="loading"
  @submit="handleSubmit"
/>

<script setup>
async function handleSubmit(values) {
  loading.value = true
  try {
    await save(values)
    show.value = false
  }
  finally {
    loading.value = false
  }
}
</script>
```

- `confirmLoading` 只控制确定按钮的 loading 与禁用，不会阻止取消 / 关闭
- 点击取消、右上角关闭或遮罩只关闭弹窗，不触发 `submit`
- 点击「重置」调用 ProForm 的 `reset()`，回到 `defaultValue`，**不会关闭弹窗**

### footer 与 header

内置 footer 依次为「重置 / 取消 / 确定」。以下属性可以调整文案或隐藏 footer：

- `submitText` / `resetText` / `cancelText`
- `hideFooter`
- `footer` 插槽（作用域：`close`、`reset`、`submit`、`confirmLoading`）

`header` 插槽会替换 `title` 文案，`header-extra` 插槽用于在头部右侧追加内容。二者渲染在 NModal card 预设的标题区内。

### 实例方法

```vue
<script setup>
import { ref } from 'vue'

const modalRef = ref()

function handleOpen() {
  modalRef.value?.open()
}

function handleClose() {
  modalRef.value?.close()
}

function handleSubmit() {
  modalRef.value?.submit()
}
</script>

<template>
  <ModalForm ref="modalRef" :columns="columns" />
</template>
```

| 方法 | 说明 |
| --- | --- |
| `open()` | 打开弹窗 |
| `close()` | 关闭弹窗 |
| `submit()` | 触发 ProForm 校验并提交 |
| `reset()` | 重置表单，不关闭弹窗 |
| `setFieldValue(key, value)` | 直接写入字段，不触发校验 |
| `form` | 内部 ProForm 实例；使用 `form` 插槽时为 `undefined` |

## 代码示例

### 基础弹窗

<Demo title="内置 trigger 与提交"
desc="不传 trigger 时渲染内置「打开」按钮；提交后自动关闭，并在下方展示表单值。"
:raw="BasicRaw">

<Basic />

</Demo>

### 自定义 trigger

<Demo title="trigger 插槽"
desc="用 trigger 插槽替换内置按钮；点击插槽内容同样会打开弹窗。"
:raw="TriggerRaw">

<Trigger />

</Demo>

### 受控显隐与异步提交

<Demo title="v-model:show + closeOnSubmit=false"
desc="关闭内置 trigger，由外部按钮控制显隐；提交时先模拟 800ms 请求，再手动关闭并抛 open / close 事件。"
:raw="ControlledRaw">

<Controlled />

</Demo>

### 自定义 header 与 footer

<Demo title="header / footer 插槽"
desc="header 替换标题区；footer 拿到 close / reset / submit 三个方法，自定义「恢复默认」「暂不保存」「保存」。"
:raw="FooterRaw">

<Footer />

</Demo>

### model 双向同步

<Demo title="v-model:model"
desc="外部按钮直接改 model；关闭后再次打开会按最新 model 重新初始化表单，提交值也会写回 model。"
:raw="ModelSyncRaw">

<ModelSync />

</Demo>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| show | 受控显隐（`v-model:show`）；不传时使用内部状态 | `boolean` | `undefined` |
| defaultShow | 非受控模式的初始显隐 | `boolean` | `false` |
| title | 弹窗标题 | `string` | `'标题'` |
| width | 弹窗宽度；数字按 px，字符串按 CSS 宽度 | `number \| string` | `500` |
| columns | 字段配置，类型同 ProForm 的列配置 | `ModalFormColumn[]` | `[]` |
| model | 表单数据（`v-model:model`） | `Record<string, any>` | `{}` |
| defaultValue | 初始值，同时作为重置目标 | `Record<string, any>` | `{}` |
| showTrigger | 是否渲染内置 trigger 区域 | `boolean` | `true` |
| hideFooter | 是否隐藏内置 footer | `boolean` | `false` |
| closeOnSubmit | 提交后是否自动关闭 | `boolean` | `true` |
| submitText | 确定按钮文案 | `string` | `'确定'` |
| resetText | 重置按钮文案 | `string` | `'重置'` |
| cancelText | 取消按钮文案 | `string` | `'取消'` |
| confirmLoading | 确定按钮 loading 与禁用，配合异步提交 | `boolean` | `false` |
| closable | 是否显示右上角关闭按钮 | `boolean` | `true` |
| maskClosable | 点击遮罩是否关闭 | `boolean` | `true` |
| closeOnEsc | 按 Esc 是否关闭 | `boolean` | `true` |
| blockScroll | 打开时是否锁定页面滚动 | `boolean` | `false` |
| autoFocus | 打开时是否自动聚焦 | `boolean` | `true` |
| trapFocus | 是否把焦点限制在弹窗内 | `boolean` | `true` |
| displayDirective | 关闭后内容销毁（`if`）还是保留（`show`） | `'if' \| 'show'` | `'if'` |
| zIndex | 弹窗层级 | `number` | - |
| draggable | 是否支持拖动弹窗 | `boolean \| object` | `false` |

> 未列出的属性会透传给 ProForm（及其内部 NForm），例如 `label-placement`、`rules`、`grid-cols`。弹窗预设固定为 card，未暴露 `preset`、`size` 等 NModal 属性。

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| submit | 校验通过后触发 | `(values: Record<string, any>) => void` |
| reset | 点击重置或调用实例 `reset()` 后触发 | - |
| update:show | 显隐变化时触发，用于 `v-model:show` | `(show: boolean) => void` |
| update:model | 内部表单值变化时触发，用于 `v-model:model` | `(model: Record<string, any>) => void` |
| open | 弹窗打开后触发 | - |
| close | 弹窗关闭后触发 | - |

### Slots

| 插槽 | 说明 | 作用域 |
| --- | --- | --- |
| trigger | trigger 内容；优先级高于默认插槽 | - |
| default | 兼容旧用法的 trigger 回退 | - |
| form | 替换内置 ProForm | - |
| footer | 替换内置 footer | `{ close, reset, submit, confirmLoading }` |
| header | 替换标题区内容（优先于 `title`） | - |
| header-extra | 头部右侧追加内容 | - |

### Expose

| 名称 | 说明 |
| --- | --- |
| `open()` | 打开弹窗 |
| `close()` | 关闭弹窗 |
| `submit()` | 校验并提交，等价于点击确定 |
| `reset()` | 重置表单，不关闭弹窗 |
| `setFieldValue(key, value)` | 直接写入字段值 |
| `form` | 内部 ProForm 实例 |

### 类型导出

```ts
import type {
  ModalFormColumn,
  ModalFormEmits,
  ModalFormExpose,
  ModalFormFooterScope,
  ModalFormProps,
} from '@banmao/procomponent'
```

## 常见问题

**异步提交后弹窗提前关闭？**
`submit` 是同步事件，不会等待处理函数里的 Promise。设置 `:close-on-submit="false"`，在请求完成后自行关闭（修改 `v-model:show` 或调用 `close()`）。

**受控模式下改 `show` 没反应？**
`v-model:show` 依赖父组件写回；只给 `:show` 而不监听 `update:show`，弹窗会一直停在当前状态。

**关闭再打开，之前填的值没了？**
`displayDirective` 默认 `'if'`，关闭会销毁内容，重新打开时 ProForm 按 `model` / `defaultValue` 重新初始化。需要保留未提交输入时设为 `'show'`，但此时不会重新初始化。

**`defaultValue` 和 `model` 同时传，谁生效？**
挂载时 `defaultValue` 优先（与 ProForm 一致）；挂载后修改 `model` 中已存在的字段仍会同步进表单。

**点确定没触发 `submit`？**
先检查校验是否通过。ProForm 校验失败只 `console.error`，不会抛事件，也不会关闭弹窗。

**`columns` 里的操作列不显示？**
`type: 'index' | 'selection'` 与 `key: 'actions'` 的列会被过滤，弹窗表单只渲染字段列。

**`hideInForm` 没生效？**
ProForm 当前未实现 `hideInForm`；ModalForm 也不会额外处理，需要从 `columns` 中移除该列。

**`class` / `style` 为什么作用在表单上？**
除本页声明的属性外，其余属性透传给 ProForm，因此 `class` / `style` 落在 NForm 根节点，而不是弹窗容器。

**用了 `form` 插槽后确定 / 重置没反应？**
内置按钮依赖内部 ProForm 实例。替换表单后请在 `footer` 插槽里自行调用业务提交逻辑。

**`confirmLoading` 会阻止关闭吗？**
不会。它只让确定按钮 loading 并禁用，取消、遮罩、Esc 仍然可用。

## 行为约定

- trigger 点击只负责打开；关闭入口为取消、右上角关闭、遮罩、Esc、实例 `close()` 或受控 `show`
- 提交只在校验通过后发生；`closeOnSubmit` 默认为 `true`，关闭发生在 `submit` 事件之后同步执行
- `submit` 不等待异步返回值；异步场景请关闭自动关闭
- 重置不关闭弹窗，也不重新请求远程选项（沿用 ProForm 行为）
- `displayDirective='if'` 时每次打开都会重新挂载 ProForm；`'show'` 时内容常驻
- 未声明的属性透传给 ProForm；弹窗本身的样式请通过 `width` 与 NModal 级别的显式属性控制