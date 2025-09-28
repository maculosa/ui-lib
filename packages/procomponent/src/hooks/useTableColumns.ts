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
   * 初始化表格列配置
   * 
   * 本函数用于从全局列配置中筛选出需要显示在表格中的列。
   * 通过过滤掉设置中标记了`hideInTable`属性的列，保留需要在表格展示的列配置。
   * 
   * @returns {Array<object>} 过滤后的表格列配置数组，包含所有未标记隐藏的列配置项
   */
  function initTableColumns() {
    // 从响应式列配置中筛选出未隐藏的列（hideInTable为假值的列）
    return settingColumns.value.filter((column) => !column.hideInTable)
  }

  /**
   * 表格列
   */
  const tableColumns = ref(initTableColumns())

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
        return -1
      if (b?.order === undefined)
        return 1
      return b.order - a.order
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
      const cloneSettingColumns = initTableColumns()
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
