---
name: StepsForm
desc: StepsForm 是基于 NModal、NSteps 与 ProForm 的弹窗分步表单：每步用 columns 配置字段，前进时校验当前步，最后一步提交各步合并值，支持受控显隐、自定义 footer 与异步提交。
---

<route lang="yaml">
meta:
  layout: default
</route>

# StepsForm

StepsForm 把 `NSteps` 与 `ProForm` 装进 `NModal`（card 预设），把长表单拆成可逐级校验的步骤。每一步都有自己的 `columns`，下一步前先校验当前步，最后一步把各步数据合并后提交。

本页描述仓库当前源码的行为。

## 特性

- **步骤式配置**：`steps` 数组，每步含 `title`、`description`、`columns`
- **逐步校验**：下一步先校验当前步，失败停留并把该步标为 `error`
- **上一步免校验**：后退不校验，已填值随合并后的 `model` 保留
- **合并提交**：最后一步校验通过后触发 `submit`，参数为各步合并后的值
- **内置 trigger**：`trigger` 插槽 > 默认插槽 > 内置「打开」按钮；`showTrigger=false` 可完全受控
- **两种显隐模式**：非受控（`defaultShow` + 实例方法）与受控（`v-model:show`）
- **footer 可定制**：内置「上一步 / 取消 / 下一步（或提交）」，`hideFooter` 隐藏，`footer` 插槽完全接管
- **异步提交**：`closeOnSubmit=false` + `confirmLoading`，由业务在请求完成后关闭
- **数据同步**：`v-model:model` 合并各步字段；`defaultValue` 同时作为初始值与重置目标
- **自定义步骤内容**：`step` 插槽接管当前步表单，拿到 `values` 与 `setFieldValue`
- **实例方法**：`open`、`close`、`next`、`prev`、`submit`、`reset`、`setStep`、`setFieldValue`、`current`、`forms`、`form`
- **类型导出**：`StepsFormProps`、`StepsFormEmits`、`StepsFormExpose`、`StepsFormFooterScope`、`StepsFormStepScope`、`StepsFormStep`、`StepsFormColumn`

## 何时使用

- 新增 / 编辑流程字段较多，适合按业务分组拆成 2-4 步
- 希望「填完一步校验一步」，而不是最后一次性报错
- 弹窗开合需要由外部按钮或业务流程控制
- footer 需要自定义动作（暂存、跳过、动态文案等）
- 提交走异步接口，不希望请求完成前就关闭弹窗

## 快速上手

### 安装

```script-tabs
@banmao/procomponent
```

### 按需引入

```vue
<script setup>
import { StepsForm } from '@banmao/procomponent'
</script>
```

### 全局注册

```ts
import { createApp } from 'vue'
import { StepsFormPlugin } from '@banmao/procomponent'
import App from './App.vue'

createApp(App).use(StepsFormPlugin).mount('#app')
```

### 基本使用

```vue
<script setup>
import { StepsForm } from '@banmao/procomponent'

const steps = [
  {
    title: '基本信息',
    columns: [
      {
        title: '姓名',
        key: 'name',
        valueType: 'text',
        rule: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
      },
    ],
  },
  {
    title: '联系方式',
    columns: [
      { title: '手机号', key: 'phone', valueType: 'text' },
    ],
  },
]

function handleSubmit(values) {
  console.log(values)
}
</script>

<template>
  <StepsForm title="新增用户" :steps="steps" @submit="handleSubmit" />
</template>
```

不传插槽时，组件会渲染一个内置的「打开」按钮作为 trigger。

## 核心概念

### 步骤配置

`steps` 的每一项描述一个步骤：

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| `title` | 步骤标题 | `string` |
| `description` | 步骤副标题 | `string` |
| `columns` | 该步字段配置，类型同 ProForm 的列配置 | `StepsFormColumn[]` |

- `type: 'index' | 'selection'` 与 `key: 'actions'` 的列会被过滤，不参与表单渲染
- 每步使用独立的 `ProForm` 实例，切换步骤时按当前 `key` 重新挂载
- 除本页声明的属性外，其余属性会**透传给各步 ProForm**：`label-placement`、`label-width`、`grid-cols`、`rules`、`size` 等可以直接写在 StepsForm 上

### 开合控制

与 ModalForm 一致：

| 用法 | 写法 | 说明 |
| --- | --- | --- |
| 非受控 | 不传 `show` | 内部维护状态；trigger 点击、实例 `open()` / `close()` 都能开关 |
| 受控 | `v-model:show` | 组件只抛 `update:show`，显隐由父组件决定 |

- `defaultShow` 只影响非受控模式的初始值，默认 `false`
- 受控模式下，父组件必须响应 `update:show`，否则弹窗不会真正关闭
- 无论显隐由谁改变，状态变化都会抛 `open` / `close` 事件

### 步骤流转

内置 footer 按当前步渲染按钮：

| 步骤 | 按钮 |
| --- | --- |
| 第一步 | 取消 / 下一步 |
| 中间步 | 上一步 / 取消 / 下一步 |
| 最后一步 | 上一步 / 取消 / 提交 |

- **下一步**：先校验当前步。通过则进入下一步并抛 `step-change(current, previous)`；失败则停留在当前步，该步显示 `error` 状态
- **上一步**：只后退，不校验；已填值会通过合并后的 `model` 回填
- **提交**：只校验当前步（前序步骤已在各自前进时校验过），通过后抛 `submit`，`closeOnSubmit` 为 `true` 时关闭弹窗
- 最后一步调用 `next()` 等价于 `submit()`
- 实例 `setStep(index)` 可直接跳转，**不会触发校验**，越界索引返回 `false`

NSteps 的状态由组件维护：已完成步骤 `finish`、当前步 `process`、校验失败 `error`、未到达 `wait`。

### 校验

- 校验沿用 ProForm 的列级 `rule` 与 NForm 的表单级 `rules`
- 校验失败时 ProForm 只会在控制台打印错误，不会抛 `submit`；StepsForm 额外把当前步标为 `error`
- StepsForm 通过 ProForm 新增的 `validate()` 拿到校验结果（`Promise<boolean>`），因此可以「只校验、不提交」
- 使用 `step` 插槽时没有内置 ProForm，`validateCurrent` 直接放行；自定义内容需要自行校验

### 数据同步

- `v-model:model` 持有**各步合并后的值**：某一步变化时抛出的 `update:model` 是完整合并结果
- `defaultValue` 在打开时作为初始值（优先于 `model`），同时作为 `reset()` 的目标
- 关闭后再次打开，当前步骤与已填值会保留（StepsForm 的状态在弹窗内容之外维护）
- `reset()` 恢复 `defaultValue`、回到第一步并强制重新挂载当前步表单，抛 `reset`

### 提交与异步

点击「提交」会：

1. 校验当前步
2. 校验通过后抛 `submit(values)`，`values` 为各步合并后的值
3. `closeOnSubmit` 为 `true`（默认）时关闭弹窗

Vue 的事件监听是同步调用，**组件不会等待 `@submit` 处理函数返回的 Promise**。异步提交请关闭自动关闭：

```vue
<StepsForm
  ref="formRef"
  v-model:show="show"
  :close-on-submit="false"
  :confirm-loading="loading"
  :steps="steps"
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

- `confirmLoading` 只控制提交按钮的 loading 与禁用，不会阻止取消 / 关闭
- 点击取消、右上角关闭或遮罩只关闭弹窗，不触发 `submit`

### footer 与 header

内置 footer 由当前步骤决定按钮组合。以下属性可以调整文案或隐藏 footer：

- `submitText` / `nextText` / `prevText` / `cancelText`
- `hideFooter`
- `footer` 插槽（作用域：`close`、`prev`、`next`、`submit`、`current`、`stepCount`、`isFirst`、`isLast`、`confirmLoading`）

`next()` 与 `submit()` 返回 `Promise<boolean>`，可以据此决定自定义按钮的后续行为。

`header` 插槽会替换 `title` 文案，`header-extra` 插槽用于在头部右侧追加内容。

### 实例方法

```vue
<script setup>
import { ref } from 'vue'

const formRef = ref()

formRef.value?.open()
formRef.value?.next()
formRef.value?.prev()
formRef.value?.submit()
</script>

<template>
  <StepsForm ref="formRef" :steps="steps" />
</template>
```

| 方法 | 说明 |
| --- | --- |
| `open()` | 打开弹窗 |
| `close()` | 关闭弹窗 |
| `next()` | 校验当前步并前进；最后一步等价于 `submit()`，返回 `Promise<boolean>` |
| `prev()` | 回到上一步，不校验 |
| `submit()` | 校验当前步并提交合并值，返回 `Promise<boolean>` |
| `reset()` | 恢复 `defaultValue` 并回到第一步 |
| `setStep(index)` | 直接跳转步骤，不校验；越界返回 `false` |
| `setFieldValue(key, value)` | 写入当前步字段，不触发校验 |
| `current` | 当前步骤索引（从 0 开始） |
| `forms` | 已挂载的 ProForm 实例数组 |
| `form` | 当前步的 ProForm 实例；使用 `step` 插槽时为 `undefined` |

## 代码示例

### 基础分步表单

<Demo title="三步新增用户"
desc="第一步校验用户名与姓名；校验失败时该步标红，通过后进入联系方式与补充说明，提交后展示合并值。"
:raw="BasicRaw">

<Basic />

</Demo>

### 自定义 footer

<Demo title="footer 插槽"
desc="footer 拿到 prev / next / submit 与步骤信息，自定义「上一步 / 取消 / 继续（提交订单）」与步骤标签。"
:raw="FooterRaw">

<Footer />

</Demo>

### 受控显隐

<Demo title="v-model:show 与实例方法"
desc="关闭内置 trigger，由外部按钮控制显隐；打开、关闭与步骤切换都会记录事件。"
:raw="ControlledRaw">

<Controlled />

</Demo>

### 异步提交

<Demo title="closeOnSubmit=false + confirmLoading"
desc="提交时模拟 800ms 请求，期间按钮 loading；请求完成后通过实例 close() 关闭。"
:raw="AsyncSubmitRaw">

<AsyncSubmit />

</Demo>

### 自定义步骤内容

<Demo title="step 插槽"
desc="step 插槽接管所有步骤的表单，用原生 NSelect / NInput 搭配 setFieldValue 写入数据。"
:raw="CustomStepRaw">

<CustomStep />

</Demo>

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| show | 受控显隐（`v-model:show`）；不传时使用内部状态 | `boolean` | `undefined` |
| defaultShow | 非受控模式的初始显隐 | `boolean` | `false` |
| title | 弹窗标题 | `string` | `'分步表单'` |
| width | 弹窗宽度；数字按 px，字符串按 CSS 宽度 | `number \| string` | `600` |
| steps | 步骤配置 | `StepsFormStep[]` | `[]` |
| model | 合并后的表单数据（`v-model:model`） | `Record<string, any>` | `{}` |
| defaultValue | 各步初始值，同时作为重置目标 | `Record<string, any>` | `{}` |
| showTrigger | 是否渲染内置 trigger 区域 | `boolean` | `true` |
| hideFooter | 是否隐藏内置 footer | `boolean` | `false` |
| closeOnSubmit | 提交后是否自动关闭 | `boolean` | `true` |
| submitText | 提交按钮文案 | `string` | `'提交'` |
| nextText | 下一步按钮文案 | `string` | `'下一步'` |
| prevText | 上一步按钮文案 | `string` | `'上一步'` |
| cancelText | 取消按钮文案 | `string` | `'取消'` |
| confirmLoading | 提交按钮 loading 与禁用，配合异步提交 | `boolean` | `false` |
| stepSize | NSteps 尺寸 | `'small' \| 'medium'` | `'medium'` |
| closable | 是否显示右上角关闭按钮 | `boolean` | `true` |
| maskClosable | 点击遮罩是否关闭 | `boolean` | `true` |
| closeOnEsc | 按 Esc 是否关闭 | `boolean` | `true` |
| blockScroll | 打开时是否锁定页面滚动 | `boolean` | `false` |
| autoFocus | 打开时是否自动聚焦 | `boolean` | `true` |
| trapFocus | 是否把焦点限制在弹窗内 | `boolean` | `true` |
| displayDirective | 关闭后内容销毁（`if`）还是保留（`show`） | `'if' \| 'show'` | `'if'` |
| zIndex | 弹窗层级 | `number` | - |
| draggable | 是否支持拖动弹窗 | `boolean \| object` | `false` |

> 未列出的属性会透传给当前步的 ProForm（及其内部 NForm），例如 `label-placement`、`rules`、`grid-cols`。弹窗预设固定为 card，未暴露 `preset`、`size` 等 NModal 属性。

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| submit | 最后一步校验通过后触发 | `(values: Record<string, any>) => void` |
| step-change | 前进或后退后触发 | `(current: number, previous: number) => void` |
| reset | 调用实例 `reset()` 后触发 | - |
| update:show | 显隐变化时触发，用于 `v-model:show` | `(show: boolean) => void` |
| update:model | 任一步表单变化时触发，参数为合并后的值 | `(model: Record<string, any>) => void` |
| open | 弹窗打开后触发 | - |
| close | 弹窗关闭后触发 | - |

### Slots

| 插槽 | 说明 | 作用域 |
| --- | --- | --- |
| trigger | trigger 内容；优先级高于默认插槽 | - |
| default | 兼容旧用法的 trigger 回退 | - |
| step | 替换当前步表单（所有步骤都会走该插槽） | `{ step, index, values, setFieldValue }` |
| footer | 替换内置 footer | `{ close, prev, next, submit, current, stepCount, isFirst, isLast, confirmLoading }` |
| header | 替换标题区内容（优先于 `title`） | - |
| header-extra | 头部右侧追加内容 | - |

### Expose

| 名称 | 说明 |
| --- | --- |
| `open()` | 打开弹窗 |
| `close()` | 关闭弹窗 |
| `next()` | 校验当前步并前进；最后一步等价于 `submit()` |
| `prev()` | 回到上一步，不校验 |
| `submit()` | 校验当前步并提交合并值 |
| `reset()` | 恢复 `defaultValue` 并回到第一步 |
| `setStep(index)` | 直接跳转步骤，不校验 |
| `setFieldValue(key, value)` | 写入当前步字段 |
| `current` | 当前步骤索引 |
| `forms` | 已挂载的 ProForm 实例数组 |
| `form` | 当前步的 ProForm 实例 |

### 类型导出

```ts
import type {
  StepsFormColumn,
  StepsFormEmits,
  StepsFormExpose,
  StepsFormFooterScope,
  StepsFormProps,
  StepsFormStep,
  StepsFormStepScope,
} from '@banmao/procomponent'
```

## 常见问题

**点「下一步」没反应？**
当前步校验未通过。StepsForm 会把该步标为 `error`，ProForm 同时在控制台打印校验错误；修正字段后再次点击即可前进。

**异步提交后弹窗提前关闭？**
`submit` 是同步事件，不会等待处理函数里的 Promise。设置 `:close-on-submit="false"`，在请求完成后通过 `v-model:show` 或实例 `close()` 关闭。

**关闭再打开，步骤和填过的值还在？**
StepsForm 的当前步骤与合并值维护在组件层，不随 `displayDirective='if'` 销毁弹窗内容而丢失。需要每次从第一步、空表单开始，可在关闭后调用 `reset()`，或自行控制 `defaultValue`。

**`defaultValue` 和 `model` 同时传，谁生效？**
打开（挂载）时 `defaultValue` 优先，与 ProForm 一致；之后外部修改 `model` 中已存在的字段仍会同步进当前步。

**每步可以有不同的默认值吗？**
`defaultValue` 是全局合并值，按 key 作用到对应步骤；不同步的字段互不影响。

**`step` 插槽为什么没有校验？**
插槽接管后没有内置 ProForm 实例，StepsForm 无法调用 `validate()`，因此直接放行。需要在自定义内容里自行校验，`submit` 前可以拦截。

**`setStep` 会触发校验吗？**
不会。它用于程序化跳转，前跳时请自行保证目标步骤的数据有效。

**`columns` 里的操作列不显示？**
`type: 'index' | 'selection'` 与 `key: 'actions'` 的列会被过滤，步骤表单只渲染字段列。

**`confirmLoading` 会阻止关闭吗？**
不会。它只让提交按钮 loading 并禁用，取消、遮罩、Esc 仍然可用。

## 行为约定

- trigger 点击只负责打开；关闭入口为取消、右上角关闭、遮罩、Esc、实例 `close()` 或受控 `show`
- 下一步先校验当前步；失败停留并标记 `error`，成功前进并抛 `step-change`
- 上一步只后退，不校验，已填值通过合并后的 `model` 回填
- 提交只校验当前步；`closeOnSubmit` 默认为 `true`，关闭发生在 `submit` 事件之后同步执行
- `submit` 不等待异步返回值；异步场景请关闭自动关闭
- `reset()` 恢复 `defaultValue`、回到第一步，并强制重新挂载当前步表单
- 使用 `step` 插槽时不创建 ProForm，步骤校验直接通过
- 未声明的属性透传给当前步 ProForm；弹窗本身的样式请通过 `width` 与 NModal 级别的显式属性控制
