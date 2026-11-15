import type { PropType, ExtractPropTypes, VNode } from "vue"

export interface TabOption {
    label: string
    key: string
    disabled?: boolean
    dot?: number
    /** 该页签的图标，未指定时回退到组件级 icon */
    icon?: string
    /** 自定义该页签的内容区，点击与选中态仍由 ProTabs 负责 */
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
    /** 激活选项卡，空字符串表示非受控 */
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
    /** 选项卡图标，作为未指定 icon 的选项的默认图标 */
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
    /** 是否可关闭，关闭时抛 close 事件，由外部从 options 中移除 */
    closable: {
        type: Boolean,
        default: false,
    },
    /** 自定义渲染选项卡内容区 */
    render: {
        type: Function as PropType<(option: TabOption) => VNode>,
    }
}

export type ProTabsProps = ExtractPropTypes<typeof proTabsProps>

export const proTabsEmits = {
    'update:active': (key: string) => typeof key === 'string',
    close: (key: string) => typeof key === 'string',
}

export type ProTabsEmits = ExtractPropTypes<typeof proTabsEmits>