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
    columns?.filter(column => column && !column.hideInTable),
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

  return {
    settingColumns,
    tableColumns,
    searchColumns,
    formColumns,
  }
}
