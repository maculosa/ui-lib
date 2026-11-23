import type { FormProps } from 'naive-ui'
import type { FieldColumn, FieldValueType } from '../../shared/field'

/** 表单配置 */
export interface FormConfig extends FormProps {
  /** 是否默认折叠 */
  gridCollapsed?: boolean
  /** 折叠后显示的行数 */
  gridCollapsedRows?: number
}

/** 查询字段类型 */
export type QueryFilterValueType = FieldValueType

/** 查询表单列配置 */
export interface QueryFilterColumn extends FieldColumn {
  /** 栅格跨列数 */
  grid?: number
}

/** 自定义字段插槽作用域 */
export interface QueryFilterFieldScope {
  column: QueryFilterColumn
  value: any
  setValue: (value: any) => void
}

/** actions 插槽作用域 */
export interface QueryFilterActionsScope {
  search: () => void | Promise<void>
  reset: () => void
  toggleCollapsed: () => void
  collapsed: boolean
  loading: boolean
}

/** 查询表单属性 */
export interface QueryFilterProps {
  /** 表单列配置 */
  columns: QueryFilterColumn[]
  /** 默认值 */
  defaultValue?: Record<string, any>
  /** 受控值（v-model:modelValue） */
  modelValue?: Record<string, any>
  /** 搜索栏显示列数，支持响应式字符串 */
  gridCols?: number | string
  /** 表单配置 */
  formConfig?: FormConfig
  /** 是否显示卡片容器 */
  card?: boolean
  /** 受控折叠（v-model:collapsed） */
  collapsed?: boolean
  /** 查询按钮 loading，同时禁用重置 */
  loading?: boolean
  /** 查询按钮文案 */
  searchText?: string
  /** 重置按钮文案 */
  resetText?: string
  /** 展开按钮文案 */
  expandText?: string
  /** 折叠按钮文案 */
  collapseText?: string
  /** 是否显示重置按钮 */
  showResetButton?: boolean
  /** 是否显示折叠 / 展开按钮 */
  showAdvancedButton?: boolean
  /** 重置后是否自动触发查询 */
  searchOnReset?: boolean
  /** 查询前钩子，返回 false 或 Promise<false> 时拦截 */
  beforeSearch?: (values: Record<string, any>) => boolean | Promise<boolean>
}

/** 查询表单事件 */
export interface QueryFilterEmits {
  search: (values: Record<string, any>) => void
  reset: (values: Record<string, any>) => void
  'update:modelValue': (values: Record<string, any>) => void
  'update:collapsed': (collapsed: boolean) => void
  'field-change': (key: string, value: any, values: Record<string, any>) => void
  'options-loaded': (key: string, options: any[]) => void
  'options-error': (key: string, error: unknown) => void
}

/** 查询表单实例方法 */
export interface QueryFilterExpose {
  getValues: () => Record<string, any>
  setValues: (values: Record<string, any>, merge?: boolean) => void
  setFieldValue: (key: string, value: any) => void
  getFieldValue: (key: string) => any
  search: () => void | Promise<void>
  reset: () => void
  toggleCollapsed: (force?: boolean) => void
  refreshOptions: (key?: string) => Promise<void[]>
  collapsed: boolean
  optionsLoading: Record<string, boolean>
  form: any
}
