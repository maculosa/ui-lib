import {
  NAutoComplete,
  NCascader,
  NColorPicker,
  NDynamicTags,
  NInput,
  NInputNumber,
  NSelect,
  NSwitch,
  NTimePicker,
  NTreeSelect,
} from 'naive-ui'
import type { FieldColumn } from './types'

export const valueFieldMaps = {
  text: NInput,
  select: NSelect,
  time: NTimePicker,
  cascader: NCascader,
  autoComplete: NAutoComplete,
  colorPicker: NColorPicker,
  dynamicTags: NDynamicTags,
  digit: NInputNumber,
  treeSelect: NTreeSelect,
  switch: NSwitch,
} as const

export const placeholderMaps: Record<string, string> = {
  text: '请输入',
  select: '请选择',
  date: '请选择日期',
  dateRange: '请选择日期范围',
  time: '请选择时间',
  cascader: '请选择',
  autoComplete: '请输入',
  colorPicker: '请选择',
  checkbox: '请选择',
  checkboxGroup: '请选择',
  radio: '请选择',
  switch: '请选择',
  dynamicTags: '请输入',
  digit: '请输入',
  treeSelect: '请选择',
}

export const optionValueTypes = new Set(['select', 'cascader', 'treeSelect', 'autoComplete', 'radio', 'checkboxGroup'])
export const loadingValueTypes = new Set(['select', 'cascader', 'treeSelect'])

export function getDefaultPlaceholder(type: string, title?: string) {
  const base = placeholderMaps[type] ?? '请输入'
  if (type === 'date' || type === 'dateRange' || type === 'time')
    return base

  return base + (title ?? '')
}

export function resolvePlaceholder(column: Pick<FieldColumn, 'valueType' | 'title' | 'placeholder'>) {
  return column.placeholder ?? getDefaultPlaceholder(column.valueType, column.title)
}