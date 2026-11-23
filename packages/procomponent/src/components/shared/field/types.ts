/** 查询表单共用的字段类型 */
export type FieldValueType =
  | 'text'
  | 'select'
  | 'date'
  | 'dateRange'
  | 'time'
  | 'cascader'
  | 'autoComplete'
  | 'colorPicker'
  | 'checkbox'
  | 'checkboxGroup'
  | 'radio'
  | 'switch'
  | 'dynamicTags'
  | 'digit'
  | 'treeSelect'

/** 字段渲染内核消费的最小列配置 */
export interface FieldColumn {
  /** 字段标识 */
  key: string
  /** 字段标题 */
  title: string
  /** 字段类型 */
  valueType: FieldValueType
  /** 是否在搜索表单中隐藏 */
  hideInSearch?: boolean
  /** 排序权重，数值小的排在前面 */
  order?: number
  /** 提示信息 */
  tooltip?: string
  /** 透传给控件的属性 */
  formItemProps?: Record<string, any>
  /** 选项数据 */
  options?: any[]
  /** 远程请求函数 */
  request?: () => Promise<any[]>
  /** 远程枚举是否只请求一次，默认 true */
  requestOnce?: boolean
  /** 控件占位符，覆盖默认文案 */
  placeholder?: string
  /** 是否禁用控件 */
  disabled?: boolean
}