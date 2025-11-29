---
name: ProTable
desc: ProTable 是一个基于 Table 的高级表格组件，提供了搜索、筛选、分页等常用的表格功能，可以帮助开发者快速构建数据表格界面。

---

<route lang="yaml">
  meta:
    layout: default
</route>

# ProTable

ProTable 是一个基于 Table 的高级表格组件，提供了搜索、筛选、分页等常用的表格功能，可以帮助开发者快速构建数据表格界面。

## Examples

下边展示的一些示例。

<Demo title="Simple Demo"
    desc="Simple mode is a mode that only displays the data without any additional features."
    :raw="SimpleDemoRaw"
>
<SimpleDemo />
</Demo>

<Demo
    title="Base Demo"
    desc="Base mode is a mode that displays the data with some basic features."
    :raw="BaseRaw"
>
<Base />
</Demo>

<Demo
    title="No Search Demo"
    desc="No search is a mode that displays the data without search."
    :raw="NoSearchbarRaw"
>
<NoSearchbar />
</Demo>

<Demo
    title="Fixed Height"
    desc="Fixed height is a mode that displays the data with a fixed height."
    :raw="FixedHeightRaw"
>
<FixedHeight />
</Demo>

<Demo
    title="Use Tooltip in Columns Demo"
    desc="Use tooltip in columns is a mode that displays the data with a tooltip in columns."
    :raw="UseTooltipInColumnsRaw"
>
<UseTooltipInColumns />
</Demo>

<Demo
    title="Search Grid Demo"
    desc="Search grid is a mode that displays the data with a search grid."
    :raw="SearchGridRaw"
>
<SearchGrid />
</Demo>

<div class="table-responsive">

## API

### Props

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| simple | 简单模式 | `boolean` | `false` |
| title | 表格标题 | `string` | '数据列表' |
| columns | 表格列的配置描述 | [ProTableColumn[]](#columns) | - |
| dataSource | 数据源 | `any[]` | - |
| loading | 加载中动画 | `boolean` | `false` |
| search | 搜索配置 | [SearchConfig](#searchConfig) | `false` |
| toolbarConfig | 工具栏配置 | [ToolbarConfig](#toolbarConfig) | `{ createMode: 'button' }` |
| params | 额外的查询参数 | `object` | - |
| onQuery | 查询回调函数 | `(params: Record<string, any>) => void` | |
| height | 表格高度 | `string` | - | |


### SearchConfig
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| gridCols | 搜索表单的列数 | number | 3 |
| defaultValue | 搜索表单的默认值 | `Record<string, any>` | - |
| formRules | 搜索表单的校验规则 | [FormRules](#formRules) | - |
| formModel | 搜索表单的表单模型 | `Record<string, any>` | - |
| labelWidth | 搜索表单的标签宽度 | string | 'auto' | auto |
| labelAlign | 搜索表单的标签对齐方式 | `left` \| `right` | `left` |
| labelPlacement | 搜索表单的标签对齐方式 | `left` \| `right` | `left` |
| size | 搜索表单的尺寸 | `large` \| `middle` \| `small` | `middle` |
| showAdvancedButton | 显示高级搜索按钮 | boolean | `true` |
| showResetButton | 显示重置按钮 | boolean | `true` |
| resetText | 重置按钮的文字 | string | '重置' |
| submitText | 提交按钮的文字 | string | '提交' |
| searchText | 搜索按钮的文字 | string | '搜索' |
| sort | 排序 | `asc` \| `desc` | - |

### ToolbarConfig

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| create | 新增按钮 | boolean | `true` |
| createLabel | 新增按钮的文字 | string | '新增' |
| createMode | 新增按钮的模式 | `button` \| `modal` \| `drawer` | `button` |
| delete | 删除按钮 | boolean | `false` |
| deleteLabel | 删除按钮的文字 | string | '删除' |
| export | 导出按钮 | boolean | `false` |
| exportLabel | 导出按钮的文字 | string | '导出' |
| print | 打印按钮 | boolean | `false` |
| printLabel | 打印按钮的文字 | string | '打印' |
| import | 导入按钮 | boolean | `false` |
| importLabel | 导入按钮的文字 | string | '导入' |
| reload | 重置按钮 | boolean | `false` |
| reloadLabel | 重置按钮的文字 | string | '重置' |
| density | 密度按钮 | boolean | `false` |
| densityLabel | 密度按钮的文字 | string | '密度' |
| columnSetting | 列设置按钮 | boolean | `false` |
| columnSettingLabel | 列设置按钮的文字 | string | '列设置' |



### Columns
| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 列头显示文字 | string | - |
| valueType | 高级表单类型 | [ValueType](#valueType) | - |
| hideInSearch | 是否在搜索表单中隐藏 | boolean | false |
| hideInForm | 是否在表单中隐藏 | boolean | false |
| hideInTable | 是否在表格中隐藏 | boolean | false |
| copyable | 是否可复制 | boolean | false |
| tooltip | 会在 title 之后展示一个 icon，hover 之后提示一些信息 | string | - |
| order | 查询表单中的权重，权重大排序靠前 | number | - |
| request | 从服务器请求枚举，一般用于选择类组件 | (params: any, prop: string) => Promise<SelectOption[]> | - |
| formItemProps | 表单项属性，参考 [FormItemProps](/procomponent/ProForm/#FormItemProps) | `object` | - |


### ValueType

| 值类型 | 说明 | 版本 |
| --- | --- | --- |
| select | 下拉选择 |
| text | 文本 |
| cascader | 级联选择 |
| treeSelect | 树形选择 |
| date | 日期选择 |
| datetime | 日期时间选择 |
| time | 时间选择 |
| timerange | 时间范围选择 |

### Events
| 事件名称 | 说明 | 回调参数 |
| --- | --- | --- |
| loadData | 加载数据 | `(page: number) => typeof page === number` |
| create | 新增回调函数 | `() => void` |
| exportData | 导出数据回调函数 | `() => void` |
| submit | 提交回调函数 | `(params: Record<string, any>) => void` |
| reset | 重置回调函数 | `() => void` |

### Slots

| 名称 | 说明 | 参数 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| default | 默认插槽，用于自定义表格内容 |
| summary | 表格总结行插槽，用于自定义表格总结行内容 | `{ columns: ProTableColumn[], dataSource: any[] }` | - |
| selection-action | 选择行操作栏插槽，用于自定义选择行操作栏内容 | `{ selectedRowKeys: string[], selectedRows: any[] }` | - |
| toolbar | 工具栏插槽，用于自定义工具栏内容 |



</div>