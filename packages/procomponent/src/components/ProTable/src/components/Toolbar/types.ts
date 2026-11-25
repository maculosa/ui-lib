import type { PropType } from 'vue'
// import type { ToolbarConfig } from 'naive-ui'
import type { ToolbarConfig } from '../../types'

export type TableSize = 'small' | 'medium' | 'large'

export interface ToolbarProps {
  /** 工具栏配置 */
  config: ToolbarConfig
  /** 表格标题 */
  title?: string
  /** 加载状态 */
  loading: boolean
  /** 表单列配置 */
  formColumns: any[]
  /** 表格大小 */
  size: TableSize
  /** 删除按钮是否禁用(无选中行时) */
  deleteDisabled?: boolean
  /** 是否处于放大(全屏)状态 */
  fullscreen?: boolean
  /** 可用于排序 / 筛选的列(当前显示的列) */
  tableColumns?: any[]
  /** 当前工具栏排序状态 */
  sortState?: { key: string; order: 'ascend' | 'descend' } | null
  /** 当前工具栏筛选条件 */
  filterState?: Record<string, any>
}

export const toolbarProps = {
  config: {
    type: Object as PropType<ToolbarProps['config']>,
    default: () => ({}),
  },
  title: {
    type: String as PropType<ToolbarProps['title']>,
    default: '',
  },
  loading: {
    type: Boolean as PropType<ToolbarProps['loading']>,
    default: false,
  },
  formColumns: {
    type: Array as PropType<ToolbarProps['formColumns']>,
    default: () => [],
  },
  size: {
    type: String as PropType<ToolbarProps['size']>,
    default: 'medium',
  },
  deleteDisabled: {
    type: Boolean,
    default: false,
  },
  fullscreen: {
    type: Boolean,
    default: false,
  },
  tableColumns: {
    type: Array as PropType<ToolbarProps['tableColumns']>,
    default: () => [],
  },
  sortState: {
    type: Object as PropType<ToolbarProps['sortState']>,
    default: null,
  },
  filterState: {
    type: Object as PropType<ToolbarProps['filterState']>,
    default: () => ({}),
  },
}

export const toolbarEmits = {
  refresh: () => true,
  create: () => true,
  export: () => true,
  delete: () => true,
  print: () => true,
  import: (file: File) => typeof File === 'undefined' || file instanceof File,
  'update:size': (key: TableSize) => ['small', 'medium', 'large'].includes(key),
  'update:fullscreen': (value: boolean) => typeof value === 'boolean',
  sort: (payload: { key: string; order: 'ascend' | 'descend' } | null) =>
    payload === null || (typeof payload.key === 'string' && ['ascend', 'descend'].includes(payload.order)),
  filter: (payload: Record<string, any>) => typeof payload === 'object' && payload !== null,
}

export type ToolbarEmits = typeof toolbarEmits