import { renderCopyableCell, renderIndexCell, renderTitle } from '@/utils/table'
import type { ProTableColumn } from 'naive-ui'
import { computed, ref } from 'vue'

/**
 * useColumns - 获取表格列、搜索栏列、表单列
 * @param columns - 表格列
 * @returns
 */
export function useTableColumns(columns: any[]) {
  /**
   * 设置列的数据
   */
  const settingColumns = ref( 
    columns?.map(column => {
      if (column?.type === 'index') {
        return renderIndexCell(column)
      }
      return column
    })
  )

  /**
   * 表格列
   */
  const tableColumns = ref(settingColumns.value)

  /**
   * 搜索栏列
   */
  const searchColumns = ref(columns?.filter(
    (column: ProTableColumn) =>
      column?.type !== 'selection'
      && column?.type !== 'index'
      && column.key !== 'action'
      && column.key !== 'actions'
      && column.hideInSearch !== true,
  )
    .sort((a: ProTableColumn, b: ProTableColumn) => {
      if (a?.order === undefined)
        return 1
      if (b?.order === undefined)
        return -1
      return a.order - b.order
    }),
  )

  /**
   * 表单列
   */
  const formColumns = computed(() => {
    return columns?.filter(
      column => !column.hideInForm && column.type !== 'selection' && column.type !== 'index' && column.key !== 'actions',
    )
  })

  watchEffect(() => {
    if (settingColumns.value.length > 0) {
      const cloneSettingColumns = [...settingColumns.value]
      tableColumns.value = cloneSettingColumns.map((column) => {
        if (column?.type === 'index') return renderIndexCell(column)
        if (column?.copyable) return renderCopyableCell(column)
        if (column?.tooltip && typeof column.title === 'string') {
          if (typeof column.tooltip === 'string') {
            column.title = renderTitle(column)
          }
        }
        return column
      })
    }
  })

  return {
    settingColumns,
    tableColumns,
    searchColumns,
    formColumns,
  }
}
