import type { FieldColumn } from './types'

export function getInitialValue(column: Pick<FieldColumn, 'valueType'>) {
  switch (column.valueType) {
    case 'select':
    case 'date':
    case 'dateRange':
    case 'time':
    case 'cascader':
    case 'treeSelect':
    case 'digit':
    case 'colorPicker':
      return null
    case 'checkbox':
    case 'switch':
      return false
    case 'checkboxGroup':
    case 'dynamicTags':
      return []
    default:
      return ''
  }
}

export function createFieldModel(
  columns: Pick<FieldColumn, 'key' | 'valueType'>[],
  source?: Record<string, any> | null,
) {
  const model: Record<string, any> = {}
  columns.forEach((column) => {
    model[column.key] = getInitialValue(column)
  })

  if (source && typeof source === 'object' && Object.keys(source).length > 0)
    Object.assign(model, source)

  return model
}