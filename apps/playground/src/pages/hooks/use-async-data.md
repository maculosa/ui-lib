---
name: useAsyncData
desc: useAsyncData 包装一个异步请求函数，托管 data / loading / error 三态，并暴露 fetchData 供手动重试。
---

<route lang="yaml">
meta:
  layout: default
</route>

# useAsyncData

`useAsyncData` 是最轻量的请求托管：接收一个返回 Promise 的函数，把结果摊成 `data` / `loading` / `error` 三个 ref，并提供 `fetchData` 重新触发。适合详情、统计卡片、下拉选项这类「一次请求一份数据」的场景。

## 何时使用

- 需要在模板里区分「加载中 / 有数据 / 请求失败」三种状态
- 希望由按钮、路由参数变化等时机手动重试请求
- 不想要 `useList` 的分页与筛选逻辑

## 代码示例

### 自动请求

<Demo
title="immediate 默认为 true"
desc="调用即发起请求，loading 跟随请求生命周期；点击「重新加载」复用同一个 fetchData 拿到新数据。"
:raw="BasicRaw">

<Basic />

</Demo>

### 手动触发

<Demo
title="immediate: false"
desc="挂载时不发请求，由交互触发。请求被 reject 时不会抛出，而是把异常写入 error，模板据此渲染错误态。"
:raw="ManualRaw">

<Manual />

</Demo>

## API

### 类型签名

```ts
function useAsyncData<T>(
  requestFn: () => Promise<T>,
  options?: { immediate?: boolean },
): {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<any>
  fetchData: () => Promise<void>
}
```

### options

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `immediate` | `boolean` | `true` | 是否在调用 `useAsyncData` 时立即发起请求 |

### 返回值

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `data` | `Ref<T \| null>` | 最近一次成功请求的结果，失败时保留上一次的值 |
| `loading` | `Ref<boolean>` | 请求进行中为 `true`，`finally` 中复位 |
| `error` | `Ref<any>` | 最近一次捕获到的异常对象，成功时为 `null` |
| `fetchData` | `() => Promise<void>` | 重新发起请求；会先清空 `error` |

## 注意事项

- 请求函数以回调形式传入，因此可以读到响应式参数：`useAsyncData(() => getDetail(id.value))`。
- `fetchData` 内部已 `try/catch`，不会向上抛错；并发调用不做取消处理，后返回的结果会后写入 `data`。
- 需要分页、筛选与导出时改用 [useList](/hooks/use-list)。
