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
import type { Component } from 'vue'
import type { FieldColumn } from './types'

/**
 * valueType 到表单控件组件的映射
 * 显式标注 Component 而非依赖推断,避免声明文件生成时
 * 引用 naive-ui 的传递依赖(seemly/treemate/vueuc)导致 TS2742
 */
export const valueFieldMaps: Record<string, Component> = {
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
}

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