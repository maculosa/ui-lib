---
name: useTableHeight
desc: useTableHeight 依据窗口高度与 ProTable 搜索栏实测高度，算出表格应占用的高度，并支持最小值兜底。
---

<route lang="yaml">
meta:
  layout: default
</route>

# useTableHeight

`useTableHeight` 解决列表页「表格到底多高」的老问题：视口高度减去搜索栏实测高度，再减去页头、面包屑等固定开销，得到表格应设置的高度，并用 `minHeight` 兜住下限，避免小屏下表格被压成一屏滚动。

## 何时使用

- 表格需要铺满可视区域，且搜索栏可能因折叠、换行而改变高度
- 页面头部、标签栏等固定区域高度已知，想做一次性扣减
- 需要随窗口尺寸变化自动重算，而不是写死 `max-height`

## 代码示例

### 配合 ProTable

<Demo
title="搜索栏高度实测"
desc="tableRef 取 ProTable 实例，hook 会读取实例上的 searchRef 并实测其高度。缩放浏览器窗口可看到计算值实时变化。"
:raw="BasicRaw">

<Basic />

</Demo>

## API

### 类型签名

```ts
function useTableHeight(
  tableRef: Ref<{ searchRef?: HTMLElement } | null>,
  options?: { height?: number; minHeight?: number },
): { height: ComputedRef<number> }
```

### 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `tableRef` | `Ref` | 组件实例引用。必须暴露 `searchRef`，`ProTable` 实例满足该约定；未传时直接抛错 |
| `options.height` | `number` | 搜索栏之外还需要扣除的高度（页头、标签栏、内边距等），默认 `0` |
| `options.minHeight` | `number` | 计算结果的下限，默认 `600` |

### 返回值

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `height` | `ComputedRef<number>` | 表格高度（px）。搜索栏尚未测量完成时按 `0` 参与计算，结果可能先偏大再回落 |

### 计算方式

```text
height = max(
  window.innerHeight - searchBarHeight - options.height,
  options.minHeight,
)
```

## 注意事项

- 依赖 `@vueuse/core` 的 `useWindowSize` 与 `useElementSize`，`searchRef` 不存在时搜索栏高度按 `0` 计。
- `options` 只在初始化时解构一次，传入响应式值不会触发重算；需要改配置时重新调用一次 `useTableHeight`。
- 把结果交给 `ProTable` 的 `height` 属性即可（`ProTable` 会转成 `style="height: Npx"`）；若布局更适合弹性伸缩，可直接用 `ProTable` 的 `autoFlex` 替代本 hook。
