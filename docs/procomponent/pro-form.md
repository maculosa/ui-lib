---
title: ProForm
prev:
  text: ModalForm
  link: /procomponent/modal-form/
next:
  text: QueryFilter
  link: /procomponent/query-filter/
---

# ProForm

## 基础表单

::: demo
procomponent/pro-form/demo
:::

## 查询表单

推荐使用该组件替代 `QueryFilter`, `QueryFilter` 将被废弃，不再进行维护更新。

::: demo
procomponent/pro-form/query-form
:::

## Select 异步请求

::: demo
procomponent/pro-form/select-remote
:::

## 表单验证

::: demo
procomponent/pro-form/validate
:::


> Tips:
> 示例中的活动时间，需要自定义表单验证规则，才可生效。示例如下：

```js
rule: [
  {
    required: true,
    validator(rule: FormItemRule, value: [string, string] | null) {
      if (!value) {
        return new Error('请选择活动时间')
      }

      const startDate = value[0]
      if (!startDate) {
        return new Error('请选择活动开始时间')
      }

      return true
    },
    trigger: ['blur', 'change']
  }
]
```

## 表单栅格布局

通过 gridCols 属性设置栅格布局，默认为 1 列。


::: demo
procomponent/pro-form/grid
:::


## 异步级联选择器

异步级联选择器，通过 request 属性设置异步请求函数，并在 formItemProps 设置 `remote`，`onload`

::: demo
procomponent/pro-form/cascader-remote
:::


## 自定义表单项

通过 valueType 属性设置为 `custom`，并实现 `formRender` 方法。

::: demo
procomponent/pro-form/custom-form-item
:::

## Props

### ProFormProps

ProForm 属性继承 NaiveUI 的 [NForm](https://www.naiveui.com/zh-CN/os-theme/components/form) 组件。下述展示额外扩展的属性：

| 参数       | 说明                                            | 类型                    | 默认值   | 版本  |
| ---------- | ----------------------------------------------- | ----------------------- | -------- | ----- |
| columns    | 表单配置项 [Columns]()                          | `Array`                 | -        |
| gridCols   | grid 布局列，参考[NGrid]()                      | `String\|Number`        | 1        |
| mode       | 表单显示模型，用于内部封装 Modal 和 Drawer 组件 | `normal\|modal\|drawer` | `normal` |
| searchText | 搜索按钮文本                                    | `String`                | `搜索`   | 0.7.7 |
| submitText | 提交按钮文本                                    | `String`                | `提交`   | 0.7.7 |
| resetText  | 重置按钮文本                                    | `String`                | `重置`   | 0.7.7 |

### Columns

<!-- | value | 表单项的值，用于绑定数据 | `String\|Number\|Array` | - | -->

| 参数          | 说明                                  | 类型                                                                             | 默认值 |
| ------------- | ------------------------------------- | -------------------------------------------------------------------------------- | ------ |
| title         | 表单项的标题                          | `String`                                                                         | -      |
| key           | 表单项的名称，用于绑定数据            | `String`                                                                         | -      |
| valueType     | 表单项的类型，参考 [ValueTypes]()     | `String`                                                                         | -      |
| options       | 表单项的枚举值，参考 [SelectOption]() | `Object`                                                                         | -      |
| rule          | 表单项的校验规则，参考 [NFormItem]()  | `Array\|Object`                                                                  | -      |
| grid          | 表单项的栅格，参考 [NGrid]()          | `String\|Number`                                                                 | -      |
| request       | 表单项的异步请求，参考 [Request]()    | `(params?: any) => Promise<any>(data)`                                           | -      |
| formItemProps | 表单项的属性，参考 [NFormItem]()      | `Object`                                                                         | -      |
| formRender    | 表单项的自定义渲染函数                | `(key: string, formData: {[key:string]: any}, formItemProps: any) => JSXElement` | -      |

> Tips:
> formItemProps 属性会透传给 NFormItem 组件，如需设置 NFormItem 的属性，请使用 formItemProps 属性。

### ValueTypes

| 值        | 说明                 |
| --------- | -------------------- |
| custom    | 自定义表单项         |
| text      | 文本框               |
| textarea  | 多行文本框           |
| password  | 密码框（规划中）     |
| select    | 下拉框               |
| cascader  | 级联选择器           |
| date      | 日期选择器           |
| daterange | 日期范围选择器       |
| datetime  | 日期时间选择器       |
| time      | 时间选择器           |
| timerange | 时间范围选择器       |
| digit     | 数字输入框           |
| radio     | 单选框               |
| checkbox  | 多选框               |
| switch    | 开关                 |
| slider    | 滑动选择器（规划中） |
| rate      | 评分（规划中）       |
| upload    | 上传（规划中）       |
