import type { ExtractPropTypes, PropType } from "vue"

export type ActionVariant = 'primary' | 'success' | 'info' | 'warning' | 'error'
export type ActionSize = 'small' | 'medium' | 'large'
export type ActionAlign = 'left' | 'center' | 'right'

export interface ActionButton {
    label: string
    key: string
    variant: ActionVariant
    disabled?: boolean
    permission?: string
    /** Iconify 图标名 */
    icon?: string
    /** 执行前是否弹出二次确认 */
    confirm?: boolean
    /** 二次确认正文，不传时按 label 生成默认文案 */
    confirmContent?: string
    /** 点击事件，确认开启时在确认后调用 */
    onClick?: (item: ActionButton, event?: MouseEvent) => void
}

export const actionButtonProps = {
    type: {
        type: String as PropType<ActionVariant>,
        default: 'primary',
    },
    size: {
        type: String as PropType<ActionSize>,
        default: 'medium',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    icon: {
        type: String,
        default: '',
    },
    block: {
        type: Boolean,
        default: false,
    },
    menuItem: {
        type: Boolean,
        default: false,
    },
} as const

export type ActionButtonProps = ExtractPropTypes<typeof actionButtonProps>

export const actionButtonEmits = {
    click: (event: MouseEvent) => event instanceof MouseEvent,
}

export const actionsProps = {
    /** 操作按钮列表 */
    items: {
        type: Array as PropType<ActionButton[]>,
        default: () => [],
    },
    /** 可见操作数量上限；非响应式默认 2，响应式且未传时不限 */
    showNum: {
        type: Number,
        default: undefined,
    },
    /** 整组按钮的水平对齐 */
    align: {
        type: String as PropType<ActionAlign>,
        default: 'left',
    },
    /** 按钮尺寸 */
    size: {
        type: String as PropType<ActionSize>,
        default: 'medium',
    },
    /** 按容器宽度自动收缩可见操作数量 */
    responsive: {
        type: Boolean,
        default: false,
    },
    /** 允许的权限码；传 hasPermission 时不生效 */
    permissions: {
        type: Array as PropType<string[]>,
        default: undefined,
    },
    /** 权限判断回调，优先级高于 permissions */
    hasPermission: {
        type: Function as PropType<(permission: string) => boolean>,
        default: undefined,
    },
    /** 「更多」按钮图标（Iconify 名称） */
    moreIcon: {
        type: String,
        default: '',
    },
    /** 「更多」按钮的无障碍名称 */
    moreLabel: {
        type: String,
        default: '更多操作',
    },
    /** 二次确认弹窗标题 */
    confirmTitle: {
        type: String,
        default: '操作确认',
    },
} as const

export type ActionsProps = ExtractPropTypes<typeof actionsProps>

export type ActionsEmits = {
    (e: 'click', item: ActionButton, event?: MouseEvent): void
    (e: 'cancel', item: ActionButton): void
}

export const actionsEmits = ['click', 'cancel']
