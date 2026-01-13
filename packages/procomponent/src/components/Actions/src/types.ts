import type { PropType } from "vue"

export const actionButtonProps = {
    type: {
        type: String as PropType<'primary' | 'success' | 'info' | 'warning' | 'error'>,
        default: 'primary',
    },
    size: {
        type: String as PropType<'small' | 'medium' | 'large'>,
        default: 'medium',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    confirm: {
        type: Boolean,
        default: false,
    },
    confirmContent: {
        type: String,
        default: '',
    },
}

export type ActionButtonProps = PropType<typeof actionButtonProps>

export const actionButtonEmits = ['click', 'cancel']

export type ActionButtonEmits = {
    (e: 'click'): void
    (e: 'cancel'): void
}

export interface ActionButton {
    label: string
    key: string
    variant: 'primary' | 'success' | 'info' | 'warning' | 'error'
    disabled?: boolean
    permission?: string
    /** 点击事件 */
    onClick?: () => void
}

export const actionsProps = {
    /** 操作按钮列表 */
    items: {
        type: Array as PropType<ActionButton[]>,
        default: () => [],
    },
    /** 显示操作按钮数量 */
    showNum: {
        type: Number,
        default: 2,
    },
    align: {
        type: String as PropType<'left' | 'center' | 'right'>,
        default: 'left',
    }
}

export const actionsEmits = ['click', 'cancel']

