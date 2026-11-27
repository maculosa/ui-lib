---
name: useTableHeight
desc: useTableHeight derives the height a table should occupy from the viewport minus the measured ProTable search bar, with a minimum-height floor.
---

<route lang="yaml">
meta:
  layout: default
</route>

# useTableHeight

`useTableHeight` answers the classic list-page question "how tall should the table be": viewport height minus the measured search bar height, minus the fixed overhead of page headers and breadcrumbs, floored by `minHeight` so small screens do not collapse the table into a scrolling strip.

## When to use it

- The table should fill the viewport while the search bar may change height when collapsed or wrapped
- The fixed areas above the table have a known height you want to subtract once
- You want recalculation on window resize instead of a hardcoded `max-height`

## Examples

### With ProTable

<Demo
title="Measured search bar height"
desc="tableRef points at the ProTable instance, and the hook measures the searchRef it exposes. Resize the browser window to watch the computed value follow."
:raw="BasicRaw">

<Basic />

</Demo>

## API

### Signature

```ts
function useTableHeight(
  tableRef: Ref<{ searchRef?: HTMLElement } | null>,
  options?: { height?: number; minHeight?: number },
): { height: ComputedRef<number> }
```

### Arguments

| Arg | Type | Description |
| --- | --- | --- |
| `tableRef` | `Ref` | Instance ref. It must expose `searchRef`, which `ProTable` does; omitting it throws immediately |
| `options.height` | `number` | Height to subtract besides the search bar (page header, tab bar, padding). Defaults to `0` |
| `options.minHeight` | `number` | Lower bound for the result. Defaults to `600` |

### Return value

| Field | Type | Description |
| --- | --- | --- |
| `height` | `ComputedRef<number>` | Table height in px. Before the search bar is measured its height counts as `0`, so the value may settle downward |

### Formula

```text
height = max(
  window.innerHeight - searchBarHeight - options.height,
  options.minHeight,
)
```

## Notes

- Built on `useWindowSize` and `useElementSize` from `@vueuse/core`; a missing `searchRef` counts as zero search-bar height.
- `options` is destructured once during initialization, so passing reactive values does not recompute — call `useTableHeight` again if the configuration changes.
- Feed the result into `ProTable`'s `height` prop (it becomes `style="height: Npx"`). When a flexible layout fits better, `ProTable`'s `autoFlex` is an alternative to this hook.
