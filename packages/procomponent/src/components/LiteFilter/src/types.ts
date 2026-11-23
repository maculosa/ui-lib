import type { FormProps } from 'naive-ui'
import type { FieldColumn, FieldValueType } from '../../shared/field'

/** 轻量筛选字段类型 */
export type LiteFilterValueType = FieldValueType

/** 轻量筛选列配置 */
export interface LiteFilterColumn extends FieldColumn {
  /** 字段宽度，未设置时按 valueType 取默认宽度 */
  width?: number | string
  /** 收进「高级筛选」弹层 */
  advanced?: boolean
}

/** 自定义字段插槽作用域 */
export interface LiteFilterFieldScope {
  column: LiteFilterColumn
  value: any
  setValue: (value: any) => void
}

/** actions 插槽作用域 */
export interface LiteFilterActionsScope {
  search: () => void | Promise<void>
  reset: () => void
  toggleCollapsed: () => void
  collapsed: boolean
  loading: boolean
}

/** 轻量筛选表单配置（透传给 NForm） */
export type LiteFilterFormConfig = FormProps

/** LiteFilter 属性 */
export interface LiteFilterProps {
  /** 表单列配置 */
  columns: LiteFilterColumn[]
  /** 默认值 */
  defaultValue?: Record<string, any>
  /** 表单配置 */
  formConfig?: LiteFilterFormConfig
  /** 是否显示卡片容器，默认 false */
  card?: boolean
  /** 初始是否折叠（非受控）；受控折叠请使用 collapsed */
  defaultCollapsed?: boolean
  /** 折叠后显示的行数 */
  collapsedRows?: number
  /** 受控折叠（v-model:collapsed） */
  collapsed?: boolean
  /** 查询按钮 loading，同时禁用重置 */
  loading?: boolean
  /** 查询前钩子，返回 false 或 Promise<false> 时拦截 */
  beforeSearch?: (values: Record<string, any>) => boolean | Promise<boolean>
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
  /** 是否显示查询按钮，默认 false（不显示时字段值变化会自动查询） */
  showSearchButton?: boolean
  /** 自动查询的防抖时长，默认 300（毫秒） */
  searchDebounce?: number
  /** 是否显示折叠 / 展开按钮 */
  showAdvancedButton?: boolean
  /** 重置后是否自动触发查询 */
  searchOnReset?: boolean
  /** 是否显示字段标签，默认 false，使用占位符 */
  showLabel?: boolean
  /** 是否把 advanced 列收进弹层，默认 true */
  advancedPopover?: boolean
  /** 高级筛选按钮文案 */
  advancedText?: string
  /** 字段间距，默认 12 */
  gap?: number
}

/** LiteFilter 事件 */
export interface LiteFilterEmits {
  search: (values: Record<string, any>) => void
  reset: (values: Record<string, any>) => void
  'update:collapsed': (collapsed: boolean) => void
  'options-loaded': (key: string, options: any[]) => void
  'options-error': (key: string, error: unknown) => void
}

/** LiteFilter 实例方法 */
export interface LiteFilterExpose {
  refreshOptions: (key?: string) => Promise<void[]>
}