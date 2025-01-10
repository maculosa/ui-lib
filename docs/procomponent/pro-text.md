---
title: ProText

prev:
  text: ProLayout
  link: /procomponent/pro-layout/
next:
  text: ProDescriptions
  link: /procomponent/pro-descriptions/
---

# ProText

文本复制组件，基于 Naive UI 的 Text 组件，扩展支持复制文本、省略号显示等。

## 示例

:::demo 
procomponent/pro-text/demo
:::

## 属性

| 属性     | 类型      | 默认值  | 说明           |
| -------- | --------- | ------- | -------------- |
| text     | `string`  | `-`     | 复制文本       |
| copyable | `boolean` | `false` | 是否可复制     |
| ellipsis | `boolean` | `false` | 是否显示省略号 |
| lineCamp | `number`  | `1`     | 省略行数       |

## 插槽

| 插槽名  | 说明     |
| ------- | -------- |
| default | 文本内容 |

## 事件

| 事件名  | 说明     | 回调参数 |
| ------- | -------- | -------- |
| on-copy | 复制事件 | -        |
