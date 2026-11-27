---
name: Hooks
desc: "@banmao/hooks 是面向 Vue 3 + Naive UI 业务场景的组合式函数集合，托管列表分页、异步请求、表格高度与文件导出等通用逻辑。"
---

<route lang="yaml">
meta:
  layout: default
</route>

# @banmao/hooks

`@banmao/hooks` 把中后台页面里重复出现的状态编排抽成组合式函数：列表页的「请求 + loading + 分页 + 筛选 + 导出」、异步数据的「loading / error / 重试」、表格的「视口高度计算」以及远端文件的下载落地。它不绑定任何 UI 组件，返回值可直接铺给 `NDataTable`、`ProTable` 或自定义模板。

## 何时使用

- 列表页需要把分页、筛选、加载态与导出收敛成一处状态源
- 想在 `ProTable` 的托管请求之外，自己掌握请求时机（受控模式）
- 需要按窗口高度扣减搜索栏，算出表格可用高度
- 需要把接口返回的 `BlobPart` 落地成文件下载

## 导出清单

| Hook | 签名 | 返回 | 说明 |
| --- | --- | --- | --- |
| `useList` | `(listRequestFn, options?)` | `dataSource` / `loading` / `pagination` / `loadData` / `handlePageChange` / `handlePageSizeChange` / `handleSortChange` / `handleExcelData` | 列表数据与分页、筛选、导出的完整状态机 |
| `useAsyncData` | `(requestFn, options?)` | `data` / `loading` / `error` / `fetchData` | 单个异步请求的加载态托管 |
| `useTableHeight` | `(tableRef, options?)` | `height` | 依据窗口与搜索栏高度计算表格高度 |
| `useExportFile` | `(data, fileName?)` | `void` | 把 `BlobPart` 转成 `<a download>` 触发下载 |

## 安装与引入

```bash
pnpm add @banmao/hooks
```

```ts
import { useAsyncData, useExportFile, useList, useTableHeight } from '@banmao/hooks'
```

`vue` 是唯一的 external，因此需要 `vue >= 3.5.13` 与宿主应用共用同一实例。`naive-ui`、`dayjs` 等依赖已随产物打包，无需额外安装，但 `useList` 的导出提示仍要求组件树中存在 `NMessageProvider`——本站点已由 `NaiveProvider` 全局提供。

## 快速开始

```vue
<script setup lang="ts">
import { useList } from '@banmao/hooks'

// 请求函数收到 { pageNum, pageSize, ...筛选参数 }
// 需返回 { status, data: { list, pageNum, pageSize, total } }
const { dataSource, loading, pagination, handlePageChange, handlePageSizeChange } = useList(getUserPage, {
  filterOption: searchModel,
})
</script>

<template>
  <n-data-table
    remote
    :columns="columns"
    :data="dataSource"
    :loading="loading"
    :pagination="pagination"
    @update:page="handlePageChange"
    @update:page-size="handlePageSizeChange"
  />
</template>
```

`pagination` 的结构（`page` / `pageSize` / `itemCount` / `pageSizes` / `showSizePicker` / `showQuickJumper` / `prefix`）与 Naive UI 分页属性同名，可直接透传，无需二次映射。

## 各 Hook 文档

- [useList 列表数据](/hooks/use-list)
- [useAsyncData 异步数据](/hooks/use-async-data)
- [useTableHeight 表格高度](/hooks/use-table-height)
- [useExportFile 文件导出](/hooks/use-export-file)

## 与 ProTable 的配合

`ProTable` 自带托管请求，只在需要「父组件持有查询条件、多个视图共用一份数据」等受控场景下才需要 `useList`：把 `dataSource` 传给 `:data`、`pagination` 透传、`onQuery` 里更新筛选条件后调用 `loadData`。完整示例见 [ProTable 受控分页](/procomponent/ProTable)。

## 已知边界

- `useList` 的 `options.requestError` / `requestSuccess` 在类型中声明但当前未被实现读取，失败会直接抛出并由 `console.error` 记录。
- `useList` 的 `handleSortChange` 只对当前页数据做本地排序，不会重新请求接口。
- `useList` 的 `options.pagination.displayOrder` 当前不生效：`showSizePicker` / `showQuickJumper` 的计算写成 `displayOrder.includes(...) || true`，恒为 `true`。另外传入 `pagination` 会整体替换默认配置，省略的字段按 `undefined` / `[]` 处理而非回落默认值。
- `useTableHeight` 读取 `tableRef.value.searchRef`，因此入参需要是暴露了 `searchRef` 的 `ProTable` 实例；`options` 只在初始化时读取一次，后续修改不会触发重算。
- `useExportFile` 不传 `fileName` 时的缺省命名用了错误的 dayjs token（`yyyy` / `dd`），会得到 `yyyy-11-Fr 09:11:19.xlsx` 这类文件名；需要时间戳请自行拼接并传入。
- 源码目录中的 `useDeviceInfo` 尚未从入口导出，无法通过 `@banmao/hooks` 引入。
