import type { PropType, ExtractPropTypes } from 'vue'
import type { ProTableColumn } from 'naive-ui'
import { dataTableProps } from 'naive-ui'


export const proTableEmits = {
    loadData: (page: number) => typeof page === 'number',
    create: () => true,
    exportData: (params: Record<string, any>) => typeof params === 'object' && params !== null,
    submit: (values: Record<string, any>) => typeof values === 'object' && values !== null,
    reset: (values?: Record<string, any>) => values === undefined || typeof values === 'object',
    delete: (rowKeys: (string | number)[]) => Array.isArray(rowKeys),
    print: () => true,
    import: (file: File) => typeof File === 'undefined' || file instanceof File,
    'update:searchModel': (val: Record<string, any>) => typeof val === 'object' && val !== null,
}

export type ProTableEmits = ExtractPropTypes<typeof proTableEmits>

/** request 模式的查询参数,分页信息与查询条件合并在一层 */
export interface ProTableRequestParams {
  /** 当前页,从 1 开始 */
  current: number
  /** 每页条数 */
  pageSize: number
  [key: string]: any
}

/** 排序信息,未排序时为 null */
export interface ProTableSorter {
  columnKey?: string | number
  order?: 'ascend' | 'descend'
}

/** request 返回值 */
export interface ProTableRequestResult<T = any> {
  data: T[]
  /** 总条数,用于计算分页 */
  total?: number
}

/** 表格级远程数据请求 */
export type ProTableRequest<T = any> = (
  params: ProTableRequestParams,
  sort: ProTableSorter | null,
  filter: Record<string, any[] | null>,
) => Promise<ProTableRequestResult<T>>

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
  /** 导入文件选择器的 accept 属性 */
  importAccept?: string
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
  columnSettingKey?: string
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
  columnStorageKey: {
    type: String as PropType<string>,
    default: ''
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
  /**
   * 表格级远程数据请求，传入后由 ProTable 托管数据、分页与 loading
   * @type {ProTableRequest}
   */
  request: {
    type: Function as PropType<ProTableRequest>,
  },
  /** 适配 Flex 布局中的高度填充 */
  autoFlex: {
    type: Boolean
  },
  /** 表格 style，与 height 生成的样式合并 */
  dataTableStyle: {
    type: [String, Object] as PropType<string | Record<string, any>>
  },
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
