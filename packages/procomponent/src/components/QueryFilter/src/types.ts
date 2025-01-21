import type { FormProps } from 'naive-ui'

/** 表单配置 */
export interface FormConfig extends FormProps {
  /** 是否默认折叠 */
  gridCollapsed?: boolean
  /** 折叠后显示的行数 */
  gridCollapsedRows?: number
}

/** 查询表单列配置 */
export interface QueryFilterColumn {
  /** 字段标识 */
  key: string
  /** 字段标题 */
  title: string
  /** 字段类型 */
  valueType: 'text' | 'select' | 'date' | 'time' | 'cascader' | 'autoComplete' | 'colorPicker' | 'checkbox' | 'switch' | 'dynamicTags' | 'digit' | 'treeSelect'
  /** 是否在搜索表单中隐藏 */
  hideInSearch?: boolean
  /** 排序权重，权重大的排在前面 */
  order?: number
  /** 提示信息 */
  tooltip?: string
  /** 表单项属性 */
  formItemProps?: Record<string, any>
  /** 选项数据 */
  options?: any[]
  /** 远程请求函数 */
  request?: () => Promise<any[]>
}

/** 查询表单属性 */
export interface QueryFilterProps {
  /** 表单列配置 */
  columns: QueryFilterColumn[]
  /** 默认值 */
  defaultValue?: Record<string, any>
  /** 搜索栏显示列数 */
  gridCols?: number
  /** 表单配置 */
  formConfig?: FormConfig
}
