import type { SelectOption } from 'naive-ui'
import { reactive, watch } from 'vue'
import type { FieldColumn } from './types'

interface UseFieldOptionsConfig {
  /** 日志前缀 */
  label?: string
  onLoaded?: (key: string, options: any[]) => void
  onError?: (key: string, error: unknown) => void
}

/** 远程枚举加载:同一 request 只请求一次,支持强制刷新 */
export function useFieldOptions(
  getColumns: () => FieldColumn[],
  { label = 'Field', onLoaded, onError }: UseFieldOptionsConfig = {},
) {
  const options = reactive<Record<string, SelectOption[]>>({})
  const optionsLoading = reactive<Record<string, boolean>>({})
  const loadedRequests = new Map<string, () => Promise<any[]>>()
  const inFlight = new Set<string>()

  async function loadOptions(column: FieldColumn, force = false) {
    const request = column.request
    if (!request)
      return

    const key = column.key
    if (inFlight.has(key))
      return
    if (!force && column.requestOnce !== false && loadedRequests.get(key) === request)
      return

    inFlight.add(key)
    optionsLoading[key] = true
    try {
      const result = await request()
      options[key] = Array.isArray(result) ? result : []
      loadedRequests.set(key, request)
      onLoaded?.(key, options[key])
    }
    catch (error) {
      console.error(`${label} remote options failed:`, error)
      onError?.(key, error)
    }
    finally {
      optionsLoading[key] = false
      inFlight.delete(key)
    }
  }

  watch(
    getColumns,
    (columns) => {
      columns.forEach((column) => {
        if (column.request)
          void loadOptions(column)
      })
    },
    { deep: true, immediate: true },
  )

  function refreshOptions(key?: string) {
    const columns = getColumns()
    const targets = key
      ? columns.filter(column => column.key === key)
      : columns
    return Promise.all(
      targets.map(column => column.request ? loadOptions(column, true) : Promise.resolve()),
    )
  }

  function getColumnOptions(column: FieldColumn) {
    return column.options ?? options[column.key]
  }

  return {
    options,
    optionsLoading,
    loadOptions,
    refreshOptions,
    getColumnOptions,
  }
}