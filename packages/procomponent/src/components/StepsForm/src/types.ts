import type { ExtractPublicPropTypes, PropType } from 'vue'

export interface StepsFormColumn {
  type?: 'index' | 'selection' | string
  key: string
  [key: string]: any
}

export interface StepsFormStep {
  title: string
  description?: string
  columns: StepsFormColumn[]
}

export const stepsFormProps = {
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
    default: '分步表单',
  },
  width: {
    type: [Number, String] as PropType<number | string>,
    default: 600,
  },
  /** 步骤配置，每步拥有独立的列定义 */
  steps: {
    type: Array as PropType<StepsFormStep[]>,
    default: () => [],
  },
  /** 合并后的表单数据（v-model:model） */
  model: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
  /** 各步初始值，同时作为重置目标 */
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
    default: '提交',
  },
  nextText: {
    type: String,
    default: '下一步',
  },
  prevText: {
    type: String,
    default: '上一步',
  },
  cancelText: {
    type: String,
    default: '取消',
  },
  /** 提交按钮 loading，配合 closeOnSubmit=false 处理异步提交 */
  confirmLoading: {
    type: Boolean,
    default: false,
  },
  stepSize: {
    type: String as PropType<'small' | 'medium'>,
    default: 'medium',
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
export type StepsFormProps = ExtractPublicPropTypes<typeof stepsFormProps>

export const stepsFormEmits = [
  'submit',
  'step-change',
  'reset',
  'update:show',
  'update:model',
  'open',
  'close',
]
export type StepsFormEmits = {
  /** 最后一步校验通过后触发，values 为各步合并后的值 */
  submit: (values: Record<string, any>) => void
  /** 前进或后退后触发 */
  'step-change': (current: number, previous: number) => void
  reset: () => void
  'update:show': (show: boolean) => void
  'update:model': (model: Record<string, any>) => void
  open: () => void
  close: () => void
}

export interface StepsFormFooterScope {
  close: () => void
  prev: () => void
  next: () => Promise<boolean>
  submit: () => Promise<boolean>
  current: number
  stepCount: number
  isFirst: boolean
  isLast: boolean
  confirmLoading: boolean
}

export interface StepsFormStepScope {
  step: StepsFormStep
  index: number
  values: Record<string, any>
  setFieldValue: (key: string, value: any) => void
}

export interface StepsFormExpose {
  open: () => void
  close: () => void
  /** 校验当前步并前进；最后一步等价于 submit */
  next: () => Promise<boolean>
  prev: () => void
  /** 校验当前步并提交合并值 */
  submit: () => Promise<boolean>
  reset: () => void
  /** 直接跳转步骤，不触发校验 */
  setStep: (index: number) => boolean
  setFieldValue: (key: string, value: any) => void
  current: number
  forms: any[]
  form: any
}
