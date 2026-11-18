---
name: Actions
desc: Actions 是表格行内与工具栏共用的操作按钮组：用 items 声明操作，按 showNum 与容器宽度展示，其余收进 Popover 菜单，并内置权限过滤、二次确认、图标与尺寸。
---

<route lang="yaml">
meta:
  layout: default
</route>

# Actions

Actions 是**操作按钮组**：用 `items` 声明一组操作，按 `showNum` 和容器宽度展示一部分按钮，其余收进「更多」Popover 菜单。组件内置权限过滤、二次确认、图标、尺寸与响应式收缩，业务动作仍然写在 `items[].onClick` 里。

## 特性

- **配置式操作**：`items` 数组驱动，每项包含 `label`、`key`、`variant`、`disabled`、`permission`、`icon`、`confirm` 与 `onClick`
- **可见数量上限**：`showNum` 控制平铺按钮数量，超出部分收进「更多」菜单；非响应式默认 2，响应式默认不限
- **可选响应式**：`responsive` 开启后按容器宽度收缩，`showNum` 变为上限，实际可见数取「宽度可容纳数」和「上限」的较小值
- **权限过滤**：`permissions` 数组与 `hasPermission` 回调二选一，回调优先；没有声明 `permission` 的操作始终展示
- **二次确认**：`confirm` / `confirmContent` 对接统一确认弹窗，平铺按钮与溢出项行为一致
- **根级事件**：`click(item, event?)` 与 `cancel(item)`，可统一做埋点、日志或拦截
- **外观可配**：`size` 统一按钮尺寸，`item.icon` / `moreIcon` 使用 Iconify 名称，`variant` 控制颜色
- **键盘可用**：默认溢出菜单支持方向键、Home / End、Esc 与焦点回收
- **自定义溢出**：`overflow` 插槽可完全替换默认菜单，用于分组或特殊排版

## 何时使用

- 表格操作列里的「编辑 / 详情 / 删除」等行内操作
- 工具栏右侧的一组次级操作，需要控制展示数量、其余收起
- 操作数量或可见性会随权限、容器宽度变化的场景
- 删除、归档等需要执行前二次确认的危险操作

以下场景**不适合**直接使用：

- 需要按钮 loading、异步禁用或自定义按钮内容
- 需要按操作项粒度控制按钮样式或尺寸
- 需要把操作按业务分组——可用 `overflow` 插槽自行渲染，但默认菜单不分组

## 快速上手

### 安装

```script-tabs
@banmao/procomponent
```

### 按需引入

```vue
<script setup>
import { Actions } from '@banmao/procomponent'
</script>
```

### 全局注册

```ts
import { createApp } from 'vue'
import { ActionsPlugin } from '@banmao/procomponent'
import App from './App.vue'

createApp(App).use(ActionsPlugin).mount('#app')
```

### 基本使用

`items` 是操作数组，点击按钮执行该项的 `onClick`。`variant` 与 `key` 为必填字段：

```vue
<script setup lang="ts">
import { Actions, type ActionButton } from '@banmao/procomponent'

const items: ActionButton[] = [
  {
    label: '编辑',
    key: 'edit',
    variant: 'primary',
    onClick: (item, event) => console.log('编辑', item.key, event?.type),
  },
  {
    label: '详情',
    key: 'detail',
    variant: 'info',
    onClick: item => console.log('详情', item.key),
  },
]
</script>

<template>
  <Actions :items="items" />
</template>
```

`showNum` 默认是 `2`。操作超过 2 个时，第 3 个开始收进「更多」菜单；刚好 2 个时不会出现「更多」按钮。开启 `responsive` 后，`showNum` 变为上限，不传时不设上限，只受容器宽度约束。

## 核心概念

### 处理顺序

组件按以下顺序决定最终展示：

1. **权限过滤**：去掉当前用户无权访问的操作
2. **数量上限**：`cap = showNum ?? (responsive ? 不限 : 2)`
3. **宽度测量**：`responsive` 开启时，计算容器能放下几个按钮
4. **切分**：`cap` 与测量结果取较小值，前面的平铺，后面的进入溢出菜单

权限过滤发生在数量计算之前，因此隐藏的操作不会占用可见名额。

### 可见项与溢出项

| 位置 | 条件 | 渲染 |
| --- | --- | --- |
| 可见项 | `allowedItems.slice(0, visibleCount)` | 文字按钮（`NButton quaternary`），按 `variant` 着色 |
| 溢出项 | `allowedItems.slice(visibleCount)` | 「更多」按钮 + Popover 纵向菜单 |

`showNum` 的默认值随 `responsive` 变化：

| `responsive` | `showNum` | 行为 |
| --- | --- | --- |
| `false` | 未传 | 平铺 2 个 |
| `false` | `N` | 平铺 `N` 个；`0` 表示全部收起 |
| `true` | 未传 | 不设数量上限，只按宽度收缩 |
| `true` | `N` | 最多平铺 `N` 个，宽度不足时继续减少 |

要点：

- `items[].key` **在同一组里必须唯一**，它同时用作渲染 key 与操作标识
- 权限过滤后的数组才参与数量计算；`disabled` 项仍然占用位置，但不会触发事件
- `items`、`showNum`、`align`、`size`、`responsive`、`permissions`、`hasPermission` 都是响应式的
- 溢出项使用与可见项相同的 `label`、`variant`、`disabled`、`icon`、`confirm` 与 `onClick`

### 响应式收缩

开启 `responsive` 后：

- 组件在根节点内渲染一条不可见的测量行，包含全部允许项和一个「更多」触发器
- 使用 `ResizeObserver` 监听根节点宽度，并结合 `requestAnimationFrame` 合并重算
- 计算时预留「更多」触发器的宽度与间距；全部放得下时不渲染「更多」按钮
- 字体加载完成后会再测量一次，避免 Web Font 导致的宽度偏差
- 容器宽度取自 Actions 根节点的 `clientWidth`

根节点是块级 `div`，宽度默认跟随父容器。如果父级是 inline 或 shrink-to-fit 布局，根节点可能收缩到内容宽度，测量结果就会一直是「全部放得下」——请给父容器一个明确宽度，或让它在 flex 布局中占满剩余空间。

### 权限过滤

| 配置 | 行为 |
| --- | --- |
| `permissions: string[]` | 操作声明了 `permission` 且不在数组中时隐藏 |
| `hasPermission: (permission) => boolean` | 对每个声明了 `permission` 的操作调用；返回 `false` 时隐藏 |
| 两者同时传 | **`hasPermission` 优先**，`permissions` 被忽略 |
| 两者都没传 | 不做过滤 |
| 操作没有 `permission` | 始终展示 |

```vue
<Actions :items="items" :has-permission="permission => acl.can(permission)" />
```

`hasPermission` 只会对声明了 `permission` 的项调用；没有 `permission` 的项直接保留。

### 二次确认

操作项设置 `confirm: true` 后，点击不会立即执行：

- 平铺按钮与溢出菜单项都会先关闭菜单，再打开统一确认弹窗
- 弹窗标题取 `confirmTitle`，默认「操作确认」
- 正文取 `confirmContent`，未传时按 label 生成「确认执行「xxx」操作？」
- `variant: 'error'` 的项使用错误态弹窗，其余使用警告态
- 点击「确认」后依次执行 `item.onClick(item)` 并抛出 `click(item, undefined)`
- 点击「取消」、按 Esc 或点击遮罩会抛出 `cancel(item)`，不执行操作

确认弹窗由组件内部统一管理，不需要调用方再包一层 `NPopconfirm`。

### 事件模型

| 事件 | 触发时机 | 参数 |
| --- | --- | --- |
| `click` | 操作真正执行后（确认项在确认之后） | `(item, event?)`；直接点击时 event 为 `MouseEvent`，确认后为 `undefined` |
| `cancel` | 确认弹窗被取消、Esc 或遮罩关闭 | `(item)` |

执行顺序是 `item.onClick(item, event)` 先执行，然后根组件抛出 `click`。禁用项和未确认的确认项都不会抛出任何事件。

```vue
<Actions
  :items="items"
  @click="(item, event) => track('action', item.key, event)"
  @cancel="item => track('cancel', item.key)"
/>
```

### 按钮外观

可见按钮、溢出菜单项都使用 Naive UI 的 `quaternary` 文字按钮，颜色由 `variant` 决定，尺寸由 `size` 统一控制：

| `variant` | 效果 |
| --- | --- |
| `primary` | 主色文字按钮 |
| `success` | 成功色文字按钮 |
| `info` | 信息色文字按钮 |
| `warning` | 警告色文字按钮 |
| `error` | 错误色文字按钮（危险操作） |

- `size` 支持 `small` / `medium` / `large`，同时作用于平铺按钮、溢出触发器和菜单项
- `item.icon` 渲染为按钮左侧 16px 图标，值必须是 Iconify 名称，如 `mdi:pencil`
- `moreIcon` 用于替换「更多」触发器图标；不传时使用内置的 `bm-icon/more-horizontal`
- `moreLabel` 是「更多」触发器的无障碍名称，默认「更多操作」

图标由 `@iconify/vue` 按名称加载，运行环境需要能取得对应图标数据。

### 溢出菜单与键盘

默认溢出面板是一个 `role="menu"` 的纵向列表：

- 打开后焦点移动到第一个可用菜单项
- `ArrowDown` / `ArrowUp` 循环移动，`Home` / `End` 跳到首尾
- `Enter` / `Space` 触发当前菜单项
- `Esc` 关闭菜单并把焦点还给「更多」按钮
- 点击菜单项后菜单关闭；确认项会继续打开确认弹窗
- 禁用项不参与键盘循环

### 自定义溢出面板

`overflow` 插槽接收 `{ items, close }`，用于完全替换默认菜单：

```vue
<Actions :items="items" :show-num="1">
  <template #overflow="{ items, close }: { items: ActionButton[]; close: () => void }">
    <div class="w-[180px]">
      <div class="px-2 py-1 text-xs opacity-60">常用操作</div>
      <NButton
        v-for="item in items.filter(entry => entry.variant !== 'error')"
        :key="item.key"
        quaternary
        block
        @click="item.onClick?.(item); close()"
      >
        {{ item.label }}
      </NButton>
    </div>
  </template>
</Actions>
```

自定义面板会**完全接管**渲染与行为：组件不再自动处理 `disabled`、二次确认、`click` / `cancel` 事件、键盘导航与焦点回收，这些都需要在插槽内自行实现。`close()` 只负责关闭 Popover。

### 对齐

`align` 作用于整组按钮的 flex 容器：

| 值 | 效果 |
| --- | --- |
| `left` | 靠左（默认） |
| `center` | 居中 |
| `right` | 靠右 |

## 代码示例

### 基础

<Demo title="基本使用"
desc="两项操作时不会出现「更多」按钮；点击按钮执行对应项的 onClick，并收到 item 与 MouseEvent。"
:raw="BasicActionsRaw">

<BasicActions />

</Demo>

### 溢出与禁用

<Demo title="超出 showNum 收进菜单"
desc="调整 show-num 观察平铺按钮与菜单项的变化；0 表示全部收起，5 表示全部平铺。菜单里的禁用项不可点击，error 项显示为红色。"
:raw="OverflowActionsRaw">

<OverflowActions />

</Demo>

### 二次确认与根级事件

<Demo title="confirm 与 @click / @cancel"
desc="「归档」在平铺区、「删除」在溢出菜单里，两者都会先弹确认框。确认后执行并触发 click，取消后触发 cancel。"
:raw="ConfirmActionsRaw">

<ConfirmActions />

</Demo>

### 权限过滤

<Demo title="permissions 数组"
desc="勾选权限码观察操作显隐；没有声明 permission 的「帮助」始终可见。"
:raw="PermissionActionsRaw">

<PermissionActions />

</Demo>

### 响应式收缩

<Demo title="按容器宽度自动收起"
desc="拖动滑块改变容器宽度。responsive 开启后，show-num 是上限，实际平铺数量随宽度变化，全部放得下时不显示「更多」。"
:raw="ResponsiveActionsRaw">

<ResponsiveActions />

</Demo>

### 尺寸与图标

<Demo title="size、item.icon 与 moreIcon"
desc="切换按钮尺寸与「更多」图标；item.icon 使用 Iconify 名称渲染在文字左侧。"
:raw="IconSizeActionsRaw">

<IconSizeActions />

</Demo>

### 自定义溢出面板

<Demo title="overflow 插槽分组"
desc="用插槽把常用操作与危险操作分组；自定义面板需要自行调用 item.onClick 与 close。"
:raw="CustomOverflowActionsRaw">

<CustomOverflowActions />

</Demo>

### 对齐

<Demo title="left / center / right"
desc="align 控制整组按钮在容器内的水平对齐；这里用虚线框标出容器范围。"
:raw="AlignActionsRaw">

<AlignActions />

</Demo>

## 进阶用法

### 表格操作列

把当前行数据包进 `onClick`，并按需开启权限与响应式：

```tsx
import { Actions } from '@banmao/procomponent'

{
  title: '操作',
  key: 'actions',
  width: 200,
  fixed: 'right',
  render: row => (
    <Actions
      items={[
        { label: '编辑', key: 'edit', variant: 'primary', permission: 'order:edit', onClick: () => handleEdit(row) },
        { label: '详情', key: 'detail', variant: 'info', onClick: () => handleDetail(row) },
        { label: '删除', key: 'delete', variant: 'error', permission: 'order:delete', confirm: true, onClick: () => handleDelete(row) },
      ]}
      permissions={userPermissions}
    />
  ),
}
```

完整示例见 [ProTable - 行操作列](/procomponent/ProTable#行操作列)。列宽建议按可见按钮数量预留：默认 `showNum` 为 2 时，两个中文字按钮加「更多」大约占 160px；开启响应式后可以适当放宽。

### 权限 + 二次确认

权限过滤与二次确认可以叠加：无权限的项不会出现，有权限的危险操作仍需确认。

```tsx
<Actions
  items={[
    { label: '导出', key: 'export', variant: 'primary', permission: 'data:export', onClick: exportData },
    { label: '删除', key: 'delete', variant: 'error', permission: 'data:delete', confirm: true, confirmContent: '删除后不可恢复', onClick: removeData },
  ]}
  hasPermission={permission => acl.can(permission)}
  @click={item => track('action', item.key)}
/>
```

## API

### Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| items | 操作列表，见 [ActionButton](#actionbutton) | `ActionButton[]` | `[]` |
| showNum | 平铺数量上限；非响应式默认 2，响应式未传时不限 | `number` | `undefined` |
| align | 整组按钮的水平对齐 | `'left' \| 'center' \| 'right'` | `'left'` |
| size | 按钮尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |
| responsive | 按容器宽度自动收缩可见数量 | `boolean` | `false` |
| permissions | 允许的权限码集合 | `string[]` | `undefined` |
| hasPermission | 权限判断回调，优先级高于 `permissions` | `(permission: string) => boolean` | `undefined` |
| moreIcon | 「更多」按钮图标（Iconify 名称） | `string` | `''` |
| moreLabel | 「更多」按钮的无障碍名称 | `string` | `'更多操作'` |
| confirmTitle | 二次确认弹窗标题 | `string` | `'操作确认'` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 操作执行后触发 | `(item: ActionButton, event?: MouseEvent)` |
| cancel | 二次确认被取消时触发 | `(item: ActionButton)` |

### Slots

| 插槽名 | 说明 | 作用域 |
| --- | --- | --- |
| overflow | 完全替换默认溢出菜单 | `{ items: ActionButton[]; close: () => void }` |

自定义 `overflow` 插槽后，组件不再处理菜单内的禁用、确认、事件与键盘行为。

### ActionButton

`items` 的元素类型，已从包入口导出：

| 字段 | 说明 | 类型 | 必填 |
| --- | --- | --- | --- |
| label | 按钮 / 菜单项文案 | `string` | 是 |
| key | 唯一标识，同组内必须唯一 | `string` | 是 |
| variant | 按钮类型 | `'primary' \| 'success' \| 'info' \| 'warning' \| 'error'` | 是 |
| disabled | 禁用该项，平铺与菜单中都不可点击 | `boolean` | 否 |
| permission | 权限码；与 `permissions` / `hasPermission` 配合 | `string` | 否 |
| icon | 左侧图标（Iconify 名称） | `string` | 否 |
| confirm | 执行前是否弹出二次确认 | `boolean` | 否 |
| confirmContent | 二次确认正文，不传时按 label 生成 | `string` | 否 |
| onClick | 点击回调；确认项在确认后调用 | `(item: ActionButton, event?: MouseEvent) => void` | 否 |

```ts
import type {
  ActionAlign,
  ActionButton,
  ActionButtonProps,
  ActionSize,
  ActionsEmits,
  ActionsProps,
  ActionVariant,
} from '@banmao/procomponent'
```

## 常见问题

**`@click` 没有触发？**
先确认操作真的执行了：禁用项、未确认的 `confirm` 项都不会触发。确认项的 `event` 参数是 `undefined`，因为事件来自弹窗按钮而不是原始点击。

**为什么没有出现「更多」按钮？**
非响应式下只有 `items.length > showNum` 才会出现；默认 `showNum` 为 2。响应式下如果容器宽度足够，也不会出现。若容器是 shrink-to-fit 布局，根节点宽度等于内容宽度，组件会认为全部放得下。

**`permission` 写了为什么没生效？**
只有同时传了 `permissions` 或 `hasPermission` 才会过滤；两者都没传时保留全部。两者同时传时以 `hasPermission` 为准。没有写 `permission` 的项始终展示。

**点了确认项为什么直接弹窗、没有执行？**
这是预期行为：`confirm: true` 的操作需要点击弹窗里的「确认」才会执行。取消、Esc 或点击遮罩会触发 `cancel`。

**`cancel` 和 `click` 都会触发吗？**
不会。确认后只触发 `click`，取消只触发 `cancel`。

**按钮尺寸、图标能改吗？**
可以。`size` 统一改尺寸；`item.icon` 改单项图标；`moreIcon` 改「更多」图标。图标名必须是 Iconify 名称，并且运行环境能加载对应图标数据。

**可以用自定义按钮内容吗？**
平铺按钮只支持 `label` + `icon`。溢出菜单可以用 `overflow` 插槽完全自定义，但需要自己处理点击、确认、禁用与关闭。

**为什么溢出从 Dropdown 变成了 Popover？**
当前实现使用 Popover 承载 `role="menu"` 纵向操作列表，便于统一焦点管理、键盘导航与自定义渲染；视觉上由下拉浮层变为带内边距的浮层菜单。

## 行为边界

| 事项 | 说明 |
| --- | --- |
| 响应式测量 | 依赖根节点有可测量宽度；父容器 shrink-to-fit 时不会收缩 |
| 自定义溢出 | `overflow` 插槽绕过默认的禁用、确认、事件与键盘逻辑 |
| 图标 | Iconify 名称需要对应图标数据可用 |
| 按钮内容 | 平铺按钮只支持 label 与 icon，不支持任意插槽 |
| 加载态 | 组件不内置 loading，异步操作请在业务侧处理 |
