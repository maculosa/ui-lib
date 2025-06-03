import type { ExtractPublicPropTypes, PropType } from 'vue'

export interface ModalFormColumn {
  type?: 'index' | 'selection' | string
  key: string
  [key: string]: any
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
export type ModalFormProps = ExtractPublicPropTypes<typeof modalFormProps>

export const modalFormEmits = ['submit', 'reset']
export type ModalFormEmits = {
  submit: (values: Record<string, any>) => void
  reset: () => void
}


export interface ModalFormExpose {
  reset: () => void
  submit: () => void
}