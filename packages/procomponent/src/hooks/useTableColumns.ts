import { renderCopyableCell, renderIndexCell, renderTitle } from '@/utils/table'
import type { ProTableColumn } from 'naive-ui'
import { computed, ref, toValue, watch, type MaybeRefOrGetter } from 'vue'
import { orderBy } from 'lodash-es'

type ColumnsSource = MaybeRefOrGetter<ProTableColumn<any>[]>

/**
 * useColumns - 获取表格列、搜索栏列、表单列
 * @param columns - 表格列,支持 ref / getter,列数组替换或内部变化时自动重建
 * @param options - 选项
 * @param options.searchSort - 搜索栏列排序方式，'asc'表示升序，'desc'表示降序，默认值为'desc'
 * @returns
 */
export function useTableColumns(columns: ColumnsSource, options?: { searchSort?: 'asc' | 'desc' }) {
  if (!Array.isArray(toValue(columns))) {
    console.warn('useTableColumns: columns should be an array, ref or getter')
  }
  const { searchSort = 'asc' } = options ?? {}

  /** 归一化后的列来源,非数组时退化为空数组 */
  const source = computed<ProTableColumn<any>[]>(() => {
    const value = toValue(columns)
    return Array.isArray(value) ? value : []
  })

  /** 由原始列配置派生列设置面板的完整列(过滤 hideInTable,index 列生成序号渲染) */
  function buildSettingColumns(cols: ProTableColumn<any>[]): ProTableColumn<any>[] {
    return cols
      .filter((column: ProTableColumn<any>) => !column.hideInTable)
      .map((column: ProTableColumn<any>) => (column?.type === 'index' ? renderIndexCell(column) : column))
  }

  /**
   * 设置列的数据
   */
  const settingColumns = ref<ProTableColumn<any>[]>(buildSettingColumns(source.value))

  // 列数组被替换(或内部变化)时重建列设置列表,
  // 保持工具栏列设置、表格列与搜索栏同步
  watch(
    source,
    (cols) => {
      settingColumns.value = buildSettingColumns(cols)
    },
    { deep: true },
  )

  /**
   * 表格列
   */
  const tableColumns = computed(() => {
    return settingColumns.value
      .filter((column: ProTableColumn<any>) => !column.hideInTable)
      .map((column: ProTableColumn<any>) => {
        if (column?.type === 'index') return renderIndexCell(column)
        if (column?.copyable) return renderCopyableCell(column)
        if (column?.tooltip && typeof column.title === 'string') {
          return { ...column, formTitle: column.title, title: renderTitle(column) }
        }
        return column
      })
  })

  /**
   * 搜索栏列
   */
  const searchColumns = computed(() => orderBy(source.value.filter(
    (column: ProTableColumn) =>
      column?.type !== 'selection'
      && column?.type !== 'index'
      && column.key !== 'action'
      && column.key !== 'actions'
      && column.hideInSearch !== true,
  ), ['order'], [searchSort]))

  /**
   * 表单列
   */
  const formColumns = computed(() => {
    return source.value.filter(
      column => !column.hideInForm && column.type !== 'selection' && column.type !== 'index' && column.key !== 'actions',
    )
  })

  return {
    settingColumns,
    tableColumns,
    searchColumns,
    formColumns,
  }
}
