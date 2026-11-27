---
name: useExportFile
desc: useExportFile turns the BlobPart returned by an export endpoint into a browser download, with a custom name or a timestamped default.
---

<route lang="yaml">
meta:
  layout: default
</route>

# useExportFile

`useExportFile` is an imperative download helper (the `use` prefix is nominal — it returns nothing and does not need `setup`): it wraps the payload in a Blob, creates an object URL, clicks a hidden `<a download>`, then removes the node and calls `revokeObjectURL` so nothing leaks.

## When to use it

- The export endpoint returns a binary stream that must become a file in the browser
- A list page already uses `useList` and only needs an "export with current filters" action
- Download names should carry a timestamp so repeated exports do not collide (build the timestamp yourself — the fallback name is broken, see Notes)

## Examples

### Direct call

<Demo
title="Default and custom file names"
desc="With fileName, the string is used verbatim and no timestamp is appended. Without it, the built-in format string is used — but its dayjs tokens are misspelled (yyyy / dd), so the real download name looks like yyyy-11-Fr 10:20:31.xlsx. Pass your own name."
:raw="BasicRaw">

<Basic />

</Demo>

## API

### Signature

```ts
function useExportFile(data: BlobPart, fileName?: string): void
```

### Arguments

| Arg | Type | Description |
| --- | --- | --- |
| `data` | `BlobPart` | File content — usually the `ArrayBuffer` / `Blob` / string the endpoint returned |
| `fileName` | `string` | Download name. Falls back to `dayjs().format('yyyy-MM-dd hh:mm:ss') + '.xlsx'`, which does not yield a full date because of the token typos |

### Behaviour

| Aspect | Value |
| --- | --- |
| Blob MIME | Hardcoded to `application/vnd.ms-excel` |
| Default name | `dayjs().format('yyyy-MM-dd hh:mm:ss') + '.xlsx'` — `yyyy` and `dd` are not valid tokens, so the output looks like `yyyy-11-Fr 10:20:31.xlsx` |
| Provided name | Used verbatim as the `download` attribute, no suffix or timestamp added |
| Cleanup | The `<a>` is removed and `URL.revokeObjectURL` runs right after the click |

## Relationship with useList

`useList`'s `handleExcelData` calls this function internally:

```ts
const { handleExcelData } = useList(getUserPage, {
  filterOption: searchModel,
  // must return { data: BlobPart, fileName?: string }
  exportRequestFn: params => exportUser({ ...params, responseType: 'blob' }),
})
```

Calling `handleExcelData()` sends the current filters to the export endpoint, downloads the result and shows the success toast — see the [useList export example](/en/hooks/use-list).

## Notes

- Because the MIME is hardcoded to Excel, prefer an `.xls` / `.xlsx` suffix yourself when exporting CSV or JSON, or build the object URL from your own Blob.
- Prepend a BOM (`\ufeff`) so Excel renders UTF-8 Chinese correctly.
- The fallback name is broken: the format string reads `yyyy-MM-dd hh:mm:ss`, while dayjs expects `YYYY` / `DD`. `yyyy` is emitted literally, `dd` resolves to the short weekday name (a Friday yields `Fr`), and `hh` is the 12-hour clock. Measured output: `yyyy-11-Fr 09:11:19.xlsx`. Build the timestamp yourself and pass it as `fileName`.
- Browser-only: it uses `window.URL` and `document`, so in SSR the call must happen on the client.
