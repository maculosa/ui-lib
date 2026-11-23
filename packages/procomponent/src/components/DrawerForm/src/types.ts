import type { ExtractPublicPropTypes, PropType } from 'vue'

export interface DrawerFormColumn {
  type?: 'index' | 'selection' | string
  key: string
  [key: string]: any
}

export const drawerFormProps = {
  /** 受控显隐；不传时组件内部维护开合状态 */
  show: {
    type: Boolean,
    default: undefined,
  },
  /** 非受控模式下的初始显隐 */
  defaultShow: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  /** 抽屉方向 */
  placement: {
    type: String as PropType<'left' | 'right' | 'top' | 'bottom'>,
    default: 'right',
  },
  /** 抽屉宽度；数字按 px，字符串按 CSS 宽度；placement 为 left / right 时生效 */
  width: {
    type: [Number, String] as PropType<number | string>,
    default: 500,
  },
  /** 抽屉高度；数字按 px，字符串按 CSS 高度；placement 为 top / bottom 时生效 */
  height: {
    type: [Number, String] as PropType<number | string>,
    default: undefined,
  },
  /** 是否允许拖拽边缘调整尺寸 */
  resizable: {
    type: Boolean,
    default: false,
  },
  columns: {
    type: Array as PropType<DrawerFormColumn[]>,
    default: () => [],
  },
  model: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
  defaultValue: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
  /** 是否渲染内置 trigger 区域；完全受控时可关闭 */
  showTrigger: {
    type: Boolean,
    default: true,
  },
  /** 是否渲染内置 footer */
  hideFooter: {
    type: Boolean,
    default: false,
  },
  /** 提交后是否自动关闭 */
  closeOnSubmit: {
    type: Boolean,
    default: true,
  },
  submitText: {
    type: String,
    default: '确定',
  },
  resetText: {
    type: String,
    default: '重置',
  },
  cancelText: {
    type: String,
    default: '取消',
  },
  /** 确定按钮 loading，配合 closeOnSubmit=false 处理异步提交 */
  confirmLoading: {
    type: Boolean,
    default: false,
  },
  closable: {
    type: Boolean,
    default: true,
  },
  maskClosable: {
    type: Boolean,
    default: true,
  },
  /** 是否显示遮罩；'transparent' 时遮罩透明但仍拦截点击 */
  showMask: {
    type: [Boolean, String] as PropType<boolean | 'transparent'>,
    default: true,
  },
  closeOnEsc: {
    type: Boolean,
    default: true,
  },
  /** NDrawer 默认锁定页面滚动 */
  blockScroll: {
    type: Boolean,
    default: true,
  },
  autoFocus: {
    type: Boolean,
    default: true,
  },
  trapFocus: {
    type: Boolean,
    default: true,
  },
  displayDirective: {
    type: String as PropType<'if' | 'show'>,
    default: 'if',
  },
  zIndex: {
    type: Number,
  },
}
export type DrawerFormProps = ExtractPublicPropTypes<typeof drawerFormProps>

export const drawerFormEmits = ['submit', 'reset', 'update:show', 'update:model', 'open', 'close']
export type DrawerFormEmits = {
  submit: (values: Record<string, any>) => void
  reset: () => void
  'update:show': (show: boolean) => void
  'update:model': (model: Record<string, any>) => void
  open: () => void
  close: () => void
}

export interface DrawerFormFooterScope {
  close: () => void
  reset: () => void
  submit: () => void
  confirmLoading: boolean
}

export interface DrawerFormExpose {
  open: () => void
  close: () => void
  submit: () => void
  reset: () => void
  setFieldValue: (key: string, value: any) => void
  form: any
}
