// import type { FormProps } from 'naive-ui'
import type { VNodeChild } from 'vue'

export const queryFilter = {
  collapsed: {
    type: Boolean,
    default: false,
  }
}

export interface QueryFilterProps {
  /** 是否折叠超出的表单项，用于受控模式 */
  collapsed?: boolean
  /**
   * 默认状态下是否折叠超出的表单项
   * @default true
   */
  defaultCollapsed?: boolean
  /** 切换表单折叠状态时的回调 */
  onCollapse?: (collapsed: boolean) => void
  /**
   * 是否隐藏必填标记，默认隐藏
   * @default true
   */
  hideRequiredMark?: boolean
  /**
   * 自定义折叠状态下默认显示的表单控件数量，没有设置或小于 0，则显示一行控件；数量大于等于控件数量则隐藏展开按钮
   */
  defaultColsNumber?: number
  /**
   * label 宽度，在 `label-placement` 是 `left` 的时候可能会有用，`auto` 意味着 label width 会根据 label 内容自动调整
   * @default 80
   */
  labelWidth?: number | string | 'auto'
  /**
   * 表单项宽度
   */
  span?: number
  /**
   * 是否能够查询收起的数据，如果设置为 false，收起后的表单数据将会丢失
   * @default true
   */
  preserve?: boolean
}

export interface LiteFilterProps extends QueryFilterProps {
  /**
   * 是否默认折叠全部字段
   * @default false
   */
  collapse?: boolean
  /**
   * 折叠区域的标签
   */
  collapseLabel?: () => VNodeChild
  /**
   * 自定义底部操作区域的渲染函数
   * @param onClear 清除按钮的点击回调
   * @param onConfirm 确认按钮的点击回调
   * @returns 自定义的底部操作区域 VNode 或 false 表示不渲染底部操作区域
   */
  footerRender?: (onClear?: () => void, onConfirm?: () => void) => VNodeChild | false
  /**
   * 选择框弹窗的位置，默认为 `bottomLeft`，位置：`bottomLeft`、`bottomRight`、`topLeft`、`topRight`
   * @default 'bottomLeft'
   */
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topRight'
}