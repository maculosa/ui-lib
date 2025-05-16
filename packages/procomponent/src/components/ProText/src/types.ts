
export interface ProTextProps {
  /**
   * 文本内容
   */
  text: string

  /**
   * 是否可复制
   * @default false
   */
  copyable?: boolean

  /**
   * 是否显示省略号
   * @default false
   */
  ellipsis?: boolean

  /**
   * 最大行数，超出后显示省略号
   * @default 1
   */
  lineClamp?: number | string

  /**
   * 文本类型
   * @default default
   */
  type?: 'default' | 'success' | 'info' | 'warning' | 'error'
}

export const textProps = {
  /**
   * 文本内容
   */
  text: {
    type: String as PropType<ProTextProps['text']>,
    default: '',
  },
  /**
   * 是否可复制
   * @default false
   */
  copyable: {
    type: Boolean as PropType<ProTextProps['copyable']>,
    default: false,
  },
  /**
   * 是否省略
   * @default false
   */
  ellipsis: {
    type: Boolean as PropType<ProTextProps['ellipsis']>,
    default: false,
  },
  /**
   * 行数
   * @default 1
   */
  lineClamp: {
    type: [Number, String] as PropType<ProTextProps['lineClamp']>,
    default: 1,
  },
  /**
   * 类型, 'default' | 'success' | 'info' | 'warning' | 'error'
   * @default default
   */
  type: {
    type: String as PropType<ProTextProps['type']>,
    default: 'default'
  }
}