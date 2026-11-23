import type { ExtractPublicPropTypes, PropType } from 'vue'

export interface ModalFormColumn {
  type?: 'index' | 'selection' | string
  key: string
  [key: string]: any
}

export const modalFormProps = {
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
    default: '标题',
  },
  width: {
    type: [Number, String] as PropType<number | string>,
    default: 500,
  },
  columns: {
    type: Array as PropType<ModalFormColumn[]>,
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
  closeOnEsc: {
    type: Boolean,
    default: true,
  },
  blockScroll: {
    type: Boolean,
    default: false,
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
  draggable: {
    type: [Boolean, Object] as PropType<boolean | Record<string, any>>,
    default: false,
  },
}
export type ModalFormProps = ExtractPublicPropTypes<typeof modalFormProps>

export const modalFormEmits = ['submit', 'reset', 'update:show', 'update:model', 'open', 'close']
export type ModalFormEmits = {
  submit: (values: Record<string, any>) => void
  reset: () => void
  'update:show': (show: boolean) => void
  'update:model': (model: Record<string, any>) => void
  open: () => void
  close: () => void
}

export interface ModalFormFooterScope {
  close: () => void
  reset: () => void
  submit: () => void
  confirmLoading: boolean
}

export interface ModalFormExpose {
  open: () => void
  close: () => void
  submit: () => void
  reset: () => void
  setFieldValue: (key: string, value: any) => void
  form: any
}