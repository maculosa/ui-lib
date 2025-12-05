import type { PropType, ExtractPropTypes } from 'vue'
import type { ProTableColumn } from 'naive-ui'
import { dataTableProps } from 'naive-ui'


export const proTableEmits = {
    loadData: (page: number) => typeof page === 'number',
    create: () => true,
    exportData: (params: Record<string, any>) => typeof params === 'object' && params !== null,
    submit: () => true,
    reset: () => true,
    'update:searchModel': (val: Record<string, any>) => typeof val === 'object' && val !== null,
}

export type ProTableEmits = ExtractPropTypes<typeof proTableEmits>

/** 
 * 表格搜索配置
 * @interface SearchConfig
 */
export interface SearchConfig {
  /** 搜索栏表格列排序方式 */
  sort?: 'asc' | 'desc'
  /** 搜索栏表格列数 */
  gridCols?: number
  /** 折叠搜索栏 */
  gridCollapsed?: boolean
  /** 搜索栏默认值 */
  defaultValue?: Record<string, any>
  /** 搜索栏校验规则 */
  formRules?: Record<string, any[]>
  /** 搜索栏表单数据 */
  formModel?: Record<string, any>
  /** 表单标签宽度 */
  labelWidth?: string | 'auto'
  /** 表单标签对齐方式 */
  labelAlign?: 'left' | 'right'
  /** 表单标签位置 */
  labelPlacement?: 'left' | 'top'
  /** 表单大小 */
  size?: 'small' | 'medium' | 'large'
  /** 是否显示高级搜索按钮 */
  showAdvancedButton?: boolean
  /** 是否显示重置按钮 */
  showResetButton?: boolean
  /** 重置按钮文本 */
  resetText?: string
  /** 提交按钮文本 */
  submitText?: string
  /** 查询按钮文本 */
  searchText?: string
}

/** 
 * 表格工具栏配置
 * @interface ToolbarConfig
 */
export interface ToolbarConfig {
  /** 新增按钮 */
  create?: boolean
  /** 新增按钮文本 */
  createLabel?: string
  /** 新增按钮模式 */
  createMode?: 'button' | 'modal' | 'drawer'
  /** 删除按钮 */
  delete?: boolean
  /** 删除按钮文本 */
  deleteLabel?: string
  /** 导出按钮 */
  export?: boolean
  /** 导出按钮文本 */
  exportLabel?: string
  /** 打印按钮 */
  print?: boolean
  /** 打印按钮文本 */
  printLabel?: string
  /** 导入按钮 */
  import?: boolean
  /** 导入按钮文本 */
  importLabel?: string
  /** 刷新按钮 */
  reload?: boolean
  /** 刷新按钮文本 */
  reloadLabel?: string
  /** 表格密度按钮 */
  density?: boolean
  /** 表格列设置按钮 */
  columnSetting?: boolean
  /** 表格列设置按钮文本 */
  columnSettingLabel?: string
}

/** 
 * ProTable 组件 Props 定义
 * @const proTableProps
 */
export const proTableProps = {
  ...dataTableProps,
  /** 表格标题 */
  title: {
    type: String,
    default: '数据列表',
  },
  /** 
   * 表格列配置
   * @type {ProTableColumn[]}
   */
  columns: {
    type: Array as PropType<ProTableColumn<any>[]>,
    default: () => [],
  },
  /** 加载状态 */
  loading: {
    type: Boolean,
    default: false,
  },
  /** 
   * 搜索表单配置
   * @type {false | undefined | SearchConfig}
   */
  search: {
    type: [Boolean, Object] as PropType<false | undefined | SearchConfig>,
    default: undefined,
  },
  /** 
   * 工具栏配置
   * @type {ToolbarConfig}
   * @deprecated 该配置项将在 v0.8.0 移除，请使用 toolbar 代替
   */
  toolbarConfig: {
    type: Object as PropType<ToolbarConfig>,
    default: () => ({
      createMode: 'button',
    }),
  },
  /**
   * 工具栏配置
   * @type {ToolbarConfig}
   */
  toolbar: {
    type: Object as PropType<ToolbarConfig>,
    default: () => ({
      createMode: 'button',
    }),
  },
  /** 
   * 用于 request 查询的额外参数，一旦变化会触发重新加载
   * @type {Record<string, any>}
   */
  params: {
    type: Object as PropType<Record<string, any>>,
  },
  /** 
   * 搜索模型
   * @type {Record<string, any>}
   */
  searchModel: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
  /** 
   * 查询回调函数
   * @param {Record<string, any>} params - 查询参数
   * @returns {Promise<void>}
   */
  onQuery: {
    type: Function as PropType<(params: Record<string, any>) => Promise<void>>,
  },
  request: {
    type: Function as PropType<(params: { pageSize: number, current: number }, sort: Record<string, any>, filter: Record<string, any>) => Promise<void>>,
  },

  // TODO 1.该配置不生效
  /** 
   * 表格高度
   * @type {number}
   */
  height: {
    type: Number,
  },
  /** 
   * 是否为简单模式
   * @type {boolean}
   */
  simple: {
    type: Boolean,
    default: false,
  },
}

export type ProTableProps = typeof proTableProps