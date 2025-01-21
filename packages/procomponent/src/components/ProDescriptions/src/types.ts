import type { ExtractPropTypes, PropType } from "vue"

export interface ProDescriptionsColumn {
  /** 列的标题 */
  title: string
  /** 列的唯一标识 */
  key: string
  /** 列的跨度 */
  span?: number
  /** 自定义渲染函数 */
  render?: (value: any) => any
}

export const descriptionsProps = {
  data: {
    type: Object,
    default: () => ({}),
  },
  columns: {
    type: Array as PropType<ProDescriptionsColumn[]>,
    default: () => [],
  },
}

export type ProDescriptionsProps = ExtractPropTypes<typeof descriptionsProps>