---
name: ProTable
desc: ProTable 是一个基于 Table 的高级表格组件，提供了搜索、筛选、分页等常用的表格功能，可以帮助开发者快速构建数据表格界面。

---

<route lang="yaml">
  meta:
    layout: default
</route>

# ProTable

ProTable 是一个功能强大的高级表格组件，基于基础 Table 组件扩展而来，提供了丰富的表格功能，包括搜索、筛选、分页、排序、导出等，可以帮助开发者快速构建复杂的数据表格界面。

## 特性

- 🎨 **开箱即用**：内置多种常用表格功能，无需重复开发
- 📋 **灵活配置**：支持丰富的配置选项，满足不同场景需求
- 🔍 **智能搜索**：支持高级搜索、表单验证、动态列配置
- 🛠️ **强大的工具栏**：内置新增、删除、导出、打印等常用操作
- 📱 **响应式设计**：适配不同屏幕尺寸，提供良好的移动端体验
- 🎯 **类型安全**：完善的 TypeScript 类型支持，提高开发效率

## 快速上手

### 安装

```script-tabs
@banmao/procomponent
```

### 基本使用

```vue
<template>
  <ProTable
    :columns="columns"
    :dataSource="dataSource"
    :loading="loading"
    :search="true"
    @onQuery="handleQuery"
  />
</template>

<script setup>
import { ref } from 'vue'
import { ProTable } from '@banmao/procomponent'

const loading = ref(false)
const dataSource = ref([])

const columns = [
  { title: '姓名', dataIndex: 'name' },
  { title: '年龄', dataIndex: 'age' },
  { title: '性别', dataIndex: 'gender' },
  { title: '邮箱', dataIndex: 'email' }
]

const handleQuery = (params) => {
  loading.value = true
  // 模拟异步请求
  setTimeout(() => {
    dataSource.value = [
      { id: 1, name: '张三', age: 25, gender: '男', email: 'zhangsan@example.com' },
      { id: 2, name: '李四', age: 30, gender: '女', email: 'lisi@example.com' }
    ]
    loading.value = false
  }, 1000)
}
</script>
```

## 示例

以下是 ProTable 的一些常用示例，展示了不同功能和配置的使用方式：

<Demo title="简单模式"
    desc="简单模式下仅显示数据，不包含任何额外功能，适合快速展示基础表格数据。"
    :raw="SimpleDemoRaw"
>
<SimpleDemo />
</Demo>

<Demo
    title="基础模式"
    desc="基础模式包含了表格的核心功能，如分页、排序等，适合大多数常规数据展示场景。"
    :raw="BaseRaw"
>
<Base />
</Demo>

<Demo
    title="无搜索栏模式"
    desc="不显示搜索栏，仅展示表格数据，适合不需要搜索功能的场景。"
    :raw="NoSearchbarRaw"
>
<NoSearchbar />
</Demo>

<Demo
    title="固定高度模式"
    desc="设置固定高度，当数据超出高度时会显示滚动条，适合数据量较大的场景。"
    :raw="FixedHeightRaw"
>
<FixedHeight />
</Demo>

<Demo
    title="列提示模式"
    desc="在表格列中使用 tooltip，当鼠标悬停时显示详细信息，适合内容较长或需要额外说明的场景。"
    :raw="UseTooltipInColumnsRaw"
>
<UseTooltipInColumns />
</Demo>

<Demo
    title="搜索网格模式"
    desc="搜索表单采用网格布局，可自定义列数，适合搜索条件较多的场景。"
    :raw="SearchGridRaw"
>
<SearchGrid />
</Demo>

<Demo
    title="表单创建模式"
    desc="集成创建表单功能，点击新增按钮时显示表单，适合简单的创建场景。"
    :raw="CreateDemoRaw"
>
<CreateDemo />
</Demo>

<Demo
    title="弹窗创建模式"
    desc="集成弹窗创建功能，点击新增按钮时显示弹窗，适合需要更复杂创建表单的场景。"
    :raw="CreateModalDemoRaw"
>
<CreateModalDemo />
</Demo>

<Demo
    title="查询表格模式"
    desc="专注于查询功能的表格模式，适合需要复杂查询条件的场景。"
    :raw="QueryTableRaw"
>
<QueryTable />
</Demo>

<Demo
    title="重置搜索模式"
    desc="重置搜索功能，点击重置按钮时会清空搜索表单并触发查询。"
    :raw="ResetSearchRaw"
>
<ResetSearch />
</Demo>

<Demo
    title="搜索引用模式"
    desc="使用搜索引用功能，可以通过 ref 控制搜索表单，适合需要外部控制搜索的场景。"
    :raw="SearchRefDemoRaw"
>
<SearchRefDemo />
</Demo>

<Demo
    title="工具栏插槽模式"
    desc="使用工具栏插槽自定义工具栏内容，适合需要添加自定义操作按钮的场景。"
    :raw="ToolbarSlotDemoRaw"
>
<ToolbarSlotDemo />
</Demo>


<div class="table-responsive">

## API

### Props

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| simple | 是否启用简单模式，简单模式下仅显示基础表格 | `boolean` | `false` |
| title | 表格标题，显示在表格顶部 | `string` | '数据列表' |
| columns | 表格列的配置描述数组 | [ProTableColumn[]](#columns) | - |
| dataSource | 表格数据源 | `any[]` | - |
| loading | 是否显示加载中动画 | `boolean` | `false` |
| search | 搜索配置，设置为 `false` 时不显示搜索栏 | [SearchConfig](#searchConfig) | `false` |
| toolbarConfig | 工具栏配置 | [ToolbarConfig](#toolbarConfig) | `{ createMode: 'button' }` |
| params | 额外的查询参数，会与搜索表单参数合并 | `object` | - |
| onQuery | 查询回调函数，当搜索或分页变化时触发 | `(params: Record<string, any>) => void` | - |
| height | 表格高度，设置后表格内容超出高度时会显示滚动条 | `string` | - |

### SearchConfig

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| gridCols | 搜索表单的列数 | `number` | 3 |
| defaultValue | 搜索表单的默认值 | `Record<string, any>` | - |
| formRules | 搜索表单的校验规则 | [FormRules](#formRules) | - |
| formModel | 搜索表单的表单模型，用于双向绑定 | `Record<string, any>` | - |
| labelWidth | 搜索表单的标签宽度 | `string` | 'auto' |
| labelAlign | 搜索表单的标签对齐方式 | `left` \| `right` | `left` |
| labelPlacement | 搜索表单的标签位置 | `left` \| `right` | `left` |
| size | 搜索表单的尺寸 | `large` \| `middle` \| `small` | `middle` |
| showAdvancedButton | 是否显示高级搜索按钮 | `boolean` | `true` |
| showResetButton | 是否显示重置按钮 | `boolean` | `true` |
| resetText | 重置按钮的文字 | `string` | '重置' |
| submitText | 提交按钮的文字 | `string` | '提交' |
| searchText | 搜索按钮的文字 | `string` | '搜索' |
| sort | 排序方向 | `asc` \| `desc` | - |

### ToolbarConfig

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| create | 是否显示新增按钮 | `boolean` | `true` |
| createLabel | 新增按钮的文字 | `string` | '新增' |
| createMode | 新增按钮的触发模式 | `button` \| `modal` \| `drawer` | `button` |
| delete | 是否显示删除按钮 | `boolean` | `false` |
| deleteLabel | 删除按钮的文字 | `string` | '删除' |
| export | 是否显示导出按钮 | `boolean` | `false` |
| exportLabel | 导出按钮的文字 | `string` | '导出' |
| print | 是否显示打印按钮 | `boolean` | `false` |
| printLabel | 打印按钮的文字 | `string` | '打印' |
| import | 是否显示导入按钮 | `boolean` | `false` |
| importLabel | 导入按钮的文字 | `string` | '导入' |
| reload | 是否显示刷新按钮 | `boolean` | `false` |
| reloadLabel | 刷新按钮的文字 | `string` | '刷新' |
| density | 是否显示密度切换按钮 | `boolean` | `false` |
| densityLabel | 密度切换按钮的文字 | `string` | '密度' |
| columnSetting | 是否显示列设置按钮 | `boolean` | `false` |
| columnSettingLabel | 列设置按钮的文字 | `string` | '列设置' |

### Columns

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 列头显示文字 | `string` | - |
| valueType | 表单控件类型 | [ValueType](#valueType) | - |
| hideInSearch | 是否在搜索表单中隐藏该字段 | `boolean` | `false` |
| hideInForm | 是否在表单中隐藏该字段 | `boolean` | `false` |
| hideInTable | 是否在表格中隐藏该列 | `boolean` | `false` |
| copyable | 表格单元格内容是否可复制 | `boolean` | `false` |
| tooltip | 列头提示信息，hover 时显示 | `string` | - |
| order | 查询表单中的排序权重，权重大的字段排序靠前 | `number` | - |
| request | 从服务器请求枚举数据，用于选择类组件 | `(params: any, prop: string) => Promise<SelectOption[]>` | - |
| formItemProps | 表单项属性，参考 [FormItemProps](/procomponent/ProForm/#FormItemProps) | `object` | - |

### ValueType

| 值类型 | 说明 |
| --- | --- |
| select | 下拉选择框 |
| text | 文本输入框 |
| cascader | 级联选择器 |
| treeSelect | 树形选择器 |
| date | 日期选择器 |
| datetime | 日期时间选择器 |
| time | 时间选择器 |
| timerange | 时间范围选择器 |

### Events

| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| loadData | 加载数据事件，用于自定义数据加载逻辑 | `(page: number) => void` |
| create | 新增按钮点击事件 | `() => void` |
| exportData | 导出按钮点击事件 | `(params?: Record<string, any>) => void` |
| submit | 搜索表单提交事件 | `(params: Record<string, any>) => void` |
| reset | 搜索表单重置事件 | `(params?: Record<string, any>) => void` |

### Slots

| 名称 | 说明 | 参数 |
| --- | --- | --- |
| default | 默认插槽，用于自定义表格内容 | - |
| summary | 表格总结行插槽，用于自定义表格底部总结内容 | `{ columns: ProTableColumn[], dataSource: any[] }` |
| selection-action | 选择行操作栏插槽，用于自定义选择行后的操作按钮 | `{ selectedRowKeys: string[], selectedRows: any[] }` |
| toolbar | 工具栏插槽，用于自定义工具栏内容 | - |

</div>