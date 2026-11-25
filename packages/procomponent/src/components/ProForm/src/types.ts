import { formProps } from 'naive-ui'
import type { PropType, ExtractPropTypes } from 'vue'

/** naive-ui 的 NForm 自带原生 onSubmit 属性，会遮蔽 ProForm 自定义的 submit 事件类型，构造 props 时剔除 */
const { onSubmit: _nativeOnSubmit, ...naiveFormProps } = formProps

export const proFormProps = {
    ...naiveFormProps,
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
    /** 搜索模式下是否展示重置按钮 */
    showResetButton: {
        type: Boolean,
        default: true,
    },
    /** 搜索模式下是否展示折叠 / 展开按钮 */
    showAdvancedButton: {
        type: Boolean,
        default: true,
    },
}

export const proFormEmits = {
    submit: (values: Record<string, any>) => values,
    reset: (values?: Record<string, any>) => values === undefined || typeof values === 'object',
    'update:model': (values: Record<string, any>) => typeof values === 'object' && values !== null,
    // 'reset:search': (values: Record<string, any>) => values,
}

export type ProFormProps = ExtractPropTypes<typeof proFormProps>
export type ProFormEmits = typeof proFormEmits
