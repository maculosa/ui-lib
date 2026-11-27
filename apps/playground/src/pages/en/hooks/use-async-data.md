---
name: useAsyncData
desc: useAsyncData wraps an async request function and keeps data / loading / error in refs, exposing fetchData for manual retries.
---

<route lang="yaml">
meta:
  layout: default
</route>

# useAsyncData

`useAsyncData` is the lightest request wrapper here: give it a function returning a Promise and it spreads the outcome into `data` / `loading` / `error` refs, plus `fetchData` to run it again. It fits detail pages, stat cards and select options — one request, one dataset.

## When to use it

- The template must distinguish "loading / has data / failed"
- Retries are triggered by a button, a route param change or any other manual moment
- You do not need the pagination and filter machinery of `useList`

## Examples

### Automatic request

<Demo
title="immediate defaults to true"
desc="The request fires on call and loading follows its lifetime. Reload reuses the same fetchData to pull fresh values."
:raw="BasicRaw">

<Basic />

</Demo>

### Manual trigger

<Demo
title="immediate: false"
desc="Nothing is requested on mount; interactions start it. A rejected promise is not thrown — it lands in error so the template can render the failure state."
:raw="ManualRaw">

<Manual />

</Demo>

## API

### Signature

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

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `immediate` | `boolean` | `true` | Whether to request as soon as `useAsyncData` is called |

### Return value

| Field | Type | Description |
| --- | --- | --- |
| `data` | `Ref<T \| null>` | Result of the latest successful request; kept as-is when a request fails |
| `loading` | `Ref<boolean>` | `true` while a request runs, reset in `finally` |
| `error` | `Ref<any>` | Last caught exception, `null` after a success |
| `fetchData` | `() => Promise<void>` | Runs the request again and clears `error` first |

## Notes

- The request function is passed as a callback, so it can read reactive params: `useAsyncData(() => getDetail(id.value))`.
- `fetchData` swallows errors internally and never throws. Concurrent calls are not cancelled, so whichever response arrives last wins.
- For pagination, filters and export, use [useList](/en/hooks/use-list) instead.
