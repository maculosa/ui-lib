import type { PaginationProps } from 'naive-ui'

export interface ProListProps {
  /**
   * 列表标题
   */
  title?: string
  /**
   * 列表数据
   */
  data: any[]
  /**
   * 加载状态
   */
  loading?: boolean
  /**
   * 分页配置
   */
  pagination?: PaginationProps
  /**
   * 自定义渲染列表项
   */
  renderItem: (item: any) => any
}

export interface ListData {
  [key: string]: any
}

export const listProps = {
  data: {
    type: Array as PropType<ListData[]>,
    default: () => [],
  },
  pagination: {
    type: Object as PropType<PaginationProps>,
    default: () => ({
      page: 1,
      pageSize: 10,
      showSizePicker: true,
      pageCount: 1,
      pageSizes: [10, 20, 30, 40],
    })
  },
  title: {
    type: String,
    default: '列表',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  renderItem: {
    type: Function as PropType<(item: ListData) => any>,
    default: () => {
      return () => {}
    }
  }
}

export type ListProps = typeof listProps
