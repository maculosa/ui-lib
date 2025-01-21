import type { DrawerProps } from 'naive-ui'
import type { PropType } from 'vue'

export interface DrawerFormColumn {
  type?: 'index' | 'selection' | string
  key: string
  [key: string]: any
}

export interface DrawerFormProps extends Partial<DrawerProps> {
  closable?: boolean
  hideFooter?: boolean
  title?: string
  columns?: DrawerFormColumn[]
  defaultValue?: Record<string, any>
}

export const drawerFormProps = {
  ...{
    closable: {
      type: Boolean,
      default: true,
    },
    hideFooter: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    columns: {
      type: Array as PropType<DrawerFormColumn[]>,
      default: () => [],
    },
    defaultValue: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
  },
}

export type DrawerFormEmits = {
  submit: (values: Record<string, any>) => void
  reset: () => void
}

export const drawerFormEmits = ['submit', 'reset']

export interface DrawerFormExpose {
  open: () => void
  close: () => void
}