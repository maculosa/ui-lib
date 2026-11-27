---
name: useExportFile
desc: useExportFile 把接口返回的 BlobPart 转成临时 URL 并触发浏览器下载，支持自定义文件名与默认时间戳命名。
---

<route lang="yaml">
meta:
  layout: default
</route>

# useExportFile

`useExportFile` 是一个即时执行的下载工具（名字带 `use`，但不返回状态，也不依赖 `setup` 上下文）：把 `BlobPart` 包成 Blob、生成对象 URL、挂一个隐藏 `<a download>` 触发点击，随后移除节点并 `revokeObjectURL`，不会残留内存引用。

## 何时使用

- 后端导出接口返回二进制流，需要在浏览器侧落地成文件
- 列表页已有 `useList`，只需要补一个「按筛选条件导出」的动作
- 想让导出文件名带上时间戳，避免同名文件互相覆盖（时间串请自行拼装，缺省命名有缺陷，见注意事项）

## 代码示例

### 直接调用

<Demo
title="默认文件名与自定义文件名"
desc="传入 fileName 时原样作为下载名，不追加后缀与时间戳；不传则用内置时间格式命名，但该格式串把 dayjs 的 token 写错了（`yyyy` / `dd`），实际得到 `yyyy-11-Fr 10:20:31.xlsx` 这类名字，建议总是自己传文件名。"
:raw="BasicRaw">

<Basic />

</Demo>

## API

### 类型签名

```ts
function useExportFile(data: BlobPart, fileName?: string): void
```

### 参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `data` | `BlobPart` | 文件内容，通常是接口返回的 `ArrayBuffer` / `Blob` / 字符串 |
| `fileName` | `string` | 下载文件名。缺省时用 `dayjs().format('yyyy-MM-dd hh:mm:ss') + '.xlsx'`，因 token 拼写问题并不能得到完整日期 |

### 行为细节

| 维度 | 取值 |
| --- | --- |
| Blob MIME | 固定为 `application/vnd.ms-excel` |
| 缺省文件名 | `dayjs().format('yyyy-MM-dd hh:mm:ss') + '.xlsx'` — `yyyy` 与 `dd` 不是合法 token，实际输出形如 `yyyy-11-Fr 10:20:31.xlsx` |
| 传入文件名 | 原样作为 `download` 属性，不追加后缀与时间戳 |
| 资源清理 | 点击下载后立即移除 `<a>` 并调用 `URL.revokeObjectURL` |

## 与 useList 的关系

`useList` 的 `handleExcelData` 内部即调用本函数：

```ts
const { handleExcelData } = useList(getUserPage, {
  filterOption: searchModel,
  // 返回 { data: BlobPart, fileName?: string }
  exportRequestFn: params => exportUser({ ...params, responseType: 'blob' }),
})
```

调用 `handleExcelData()` 会带上当前筛选条件请求导出接口，落地文件并提示「成功导出」，细节见 [useList 导出示例](/hooks/use-list)。

## 注意事项

- 由于 MIME 写死为 Excel，导出 CSV / JSON 时建议自行指定 `.xls` / `.xlsx` 后缀，或改用自己创建的 Blob URL。
- UTF-8 中文在 Excel 中打开易乱码，可在内容前置 BOM（`\ufeff`）。
- 缺省文件名有缺陷：格式串写成 `yyyy-MM-dd hh:mm:ss`，而 dayjs 认的是 `YYYY` / `DD`，`yyyy` 原样输出、`dd` 会被解析成星期缩写（周五得到 `Fr`），`hh` 还是 12 小时制。实测文件名为 `yyyy-11-Fr 09:11:19.xlsx`。需要时间戳请自行传入 `fileName`。
- 仅适用于浏览器环境：内部直接使用 `window.URL` 与 `document`，SSR 场景需在客户端调用。
