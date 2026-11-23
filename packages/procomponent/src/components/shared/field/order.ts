import type { FieldColumn } from './types'

/** 过滤 hideInSearch,并按 order 稳定排序;无 order 的列保持声明顺序 */
export function orderSearchColumns<T extends FieldColumn>(columns: T[]): T[] {
  return columns
    .filter(column => !column.hideInSearch)
    .map((column, index) => ({ column, index }))
    .sort((a, b) => {
      const aOrder = typeof a.column.order === 'number' ? a.column.order : Number.POSITIVE_INFINITY
      const bOrder = typeof b.column.order === 'number' ? b.column.order : Number.POSITIVE_INFINITY
      if (aOrder !== bOrder)
        return aOrder - bOrder
      return a.index - b.index
    })
    .map(item => item.column)
}