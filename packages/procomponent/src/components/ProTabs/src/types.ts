export interface TabOption {
    label: string
    key: string
    disabled?: boolean
    dot?: number
    render?: (option: TabOption) => VNode
}

export const proTabsProps = {
    class: {
        type: String,
        default: '',
    },
    style: {
        type: Object as PropType<Record<string, any>>,
        default: () => ({}),
    },
    /** 选项卡列表 */
    options: {
        type: Array as PropType<TabOption[]>,
        default: () => [],
    },
    /** 激活选项卡 */
    active: {
        type: String as PropType<TabOption['key']>,
        default: '',
    },
    /** 默认激活选项卡 */
    defaultActive: {
        type: String as PropType<TabOption['key']>,
        default: '',
    },
    /** 选项卡类型 */
    type: {
        type: String as PropType<'line' | 'card'>,
        default: 'card',
    },
    /** 是否显示选项卡 badge */
    showBadge: {
        type: Boolean,
        default: false,
    },
    icon: {
        type: String,
        default: '',
    },
    /** 是否内边距 */
    inset: {
        type: Boolean,
        default: false,
    },
    /** 是否圆角 */
    rounded: {
        type: Boolean,
        default: false,
    },
    /** 自定义渲染选项卡 */
    render: {
        type: Function as PropType<(option: TabOption) => VNode>,
        default: () => ({}),
    }
}

export type ProTabsProps = PropType<typeof proTabsProps>

export const proTabsEmits = ['update:active']

export type ProTabsEmits = {
    (e: 'update:active', active: TabOption['key']): void
}
