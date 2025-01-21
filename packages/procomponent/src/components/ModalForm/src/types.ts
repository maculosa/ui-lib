import type { PropType } from 'vue'

export interface ModalFormColumn {
  type?: 'index' | 'selection' | string
  key: string
  [key: string]: any
}

export interface ModalFormProps {
  title?: string
  width?: number
  columns?: ModalFormColumn[]
  closable?: boolean
  model?: Record<string, any>
}

export const modalFormProps = {
  title: {
    type: String,
    default: '标题',
  },
  width: {
    type: Number,
    default: 500,
  },
  columns: {
    type: Array as PropType<ModalFormColumn[]>,
    default: () => [],
  },
  closable: {
    type: Boolean,
    default: true,
  },
  model: {
    type: Object,
    default: () => ({}),
  },
}

export type ModalFormEmits = {
  submit: (values: Record<string, any>) => void
  reset: () => void
}

export const modalFormEmits = ['submit', 'reset']

export interface ModalFormExpose {
  reset: () => void
  submit: () => void
}