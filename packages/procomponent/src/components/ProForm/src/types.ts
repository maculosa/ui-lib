import { formProps } from 'naive-ui'
import type { PropType, ExtractPropTypes } from 'vue'

export const proFormProps = {
    ...formProps,
    gridCols: {
        type: Number,
        default: 1,
    },
    responsive: {
        type: String as PropType<'self' | 'screen'>,
        default: 'self',
    },
    gridCollapsed: {
        type: Boolean,
        default: false,
    },
    gridCollapsedRows: {
        type: Number,
        default: 1,
    },
    columns: {
        type: Array as PropType<any[]>,
        default: () => ([]),
    },
    mode: {
        type: String as PropType<'normal' | 'modal' | 'drawer' | 'search' | 'login'>,
        default: 'normal',
    },
    defaultValue: {
        type: Object as PropType<any>,
        default: () => ({}),
    },
    loading: {
        type: Boolean,
        default: false,
    },
    searchText: {
        type: String,
        default: '搜索',
    },
    submitText: {
        type: String,
        default: '提交',
    },
    resetText: {
        type: String,
        default: '重置',
    },
}

export const proFormEmits = {
    submit: (values: Record<string, any>) => values,
    reset: (values?: Record<string, any>) => values ?? undefined,
    // 'reset:search': (values: Record<string, any>) => values,
}

export type ProFormProps = ExtractPropTypes<typeof proFormProps>
export type ProFormEmits = typeof proFormEmits
