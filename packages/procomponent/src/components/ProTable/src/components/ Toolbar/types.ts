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
}

export const toolbarEmits = {
  refresh: () => true,
  create: () => true,
  export: () => true,
  'update:size': (key: TableSize) => ['small', 'medium', 'large'].includes(key),
}

export type ToolbarEmits = typeof toolbarEmits