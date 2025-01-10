---
title: 'DrawerForm'

prev:
  text: '组件'
  link: '/procomponent/components'
next:
  text: 'ModalForm'
  link: '/procomponent/modal-form/'
---


# DrawerForm

## 示例


### 基础示例

::: demo DrawerForm demo

procomponent/drawer-form/demo

:::


### trigger Button 插槽示例

::: demo DrawerForm demo

procomponent/drawer-form/button-slot

:::

### 数据回显

::: demo Data display

procomponent/drawer-form/data-display

:::

## API

### ProDrawerForm

| 参数      | 描述             | 类型                                     |  默认值   |
| --------- | ---------------- | ---------------------------------------- | :-------: |
| title     | 抽屉标题         | `string`                                 |     -     |
| trigger   | 触发方式         | `'click' \| 'hover' \| 'focus'`          | `'click'` |
| placement | 抽屉弹出位置     | `'top' \| 'right' \| 'bottom' \| 'left'` | `'right'` |
| closable  | 是否显示关闭按钮 | `boolean`                                |  `true`   |

### Slots

| 插槽名  |   描述   | 参数  |
| ------- | :------: | :---: |
| title   | 抽屉标题 |   -   |
| trigger | 触发方式 |   -   |
| default | 抽屉内容 |   -   |
| footer  | 抽屉底部 |   -   |

### Events

| 事件名 |   描述   | 参数  |
| ------ | :------: | :---: |
| open   | 打开抽屉 |   -   |
| close  | 关闭抽屉 |   -   |
| toggle | 切换抽屉 |   -   |
