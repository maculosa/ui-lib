import type { PropType, ExtractPropTypes, VNode, ComputedRef } from "vue"

export type ProTabsSize = 'small' | 'medium' | 'large'

/** 徽标：数字、红点或自定义渲染；优先于旧版 dot */
export type TabBadge = number | 'dot' | ((option: TabOption) => VNode)

/** 路由适配器，结构上兼容 vue-router 的 Router，组件本身不依赖 vue-router */
export interface ProTabsRouter {
    push(to: string): unknown
}

/** 拖拽分组，字符串等价于 { name, pull: true, put: true } */
export type ProTabsDragGroup =
    | string
    | { name: string; pull?: boolean | 'clone'; put?: boolean }

export interface ProTabsTransferPayload {
    /** 被拖拽页签的 key */
    key: string
    /** 来源分组名 */
    from: string
    /** 目标分组名 */
    to: string
    /** 在目标 options 中的落点索引 */
    index: number
}

/** 面板异步加载器，返回的节点会按 key 缓存 */
export type PanelLoader = (option: TabOption) => Promise<VNode | VNode[]>

export type ContextMenuCommand = 'close' | 'close-others' | 'close-right' | 'close-all'

export interface ProTabsContextMenuLabels {
    close?: string
    closeOthers?: string
    closeRight?: string
    closeAll?: string
}

export interface TabOption {
    label: string
    key: string
    disabled?: boolean
    /** 旧版数字徽标，需同时开启 showBadge；badge 存在时被忽略 */
    dot?: number
    /** 该页签的图标，未指定时回退到组件级 icon */
    icon?: string
    /** 自定义该页签的内容区，点击与选中态仍由 ProTabs 负责 */
    render?: (option: TabOption) => VNode
    /** 用于 ARIA id 的稳定标识，不传时按 key 生成 */
    id?: string
    /** 是否渲染关闭按钮，覆盖组件级 closable */
    closable?: boolean
    /** 徽标：数字、红点 'dot' 或自定义渲染 */
    badge?: TabBadge
    /** 该页签徽标的溢出阈值，覆盖组件级 badgeMax */
    badgeMax?: number
    /** 该页签的内容面板渲染，优先级最高 */
    renderPanel?: (option: TabOption) => VNode
    /** 面板异步加载器，存在静态渲染来源时忽略 */
    panelLoader?: PanelLoader
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
    },
    /** 尺寸档位 */
    size: {
        type: String as PropType<ProTabsSize>,
        default: 'medium',
    },
    /** 溢出时是否显示左右滚动箭头 */
    scrollButtons: {
        type: Boolean,
        default: true,
    },
    /** 左滚动按钮的无障碍名称 */
    scrollLeftLabel: {
        type: String,
        default: '向左滚动',
    },
    /** 右滚动按钮的无障碍名称 */
    scrollRightLabel: {
        type: String,
        default: '向右滚动',
    },
    /** 是否渲染内置新增按钮 */
    addable: {
        type: Boolean,
        default: false,
    },
    /** 新增按钮文案与无障碍名称 */
    addLabel: {
        type: String,
        default: '新增页签',
    },
    /** 新增按钮图标（Iconify 名称） */
    addIcon: {
        type: String,
        default: 'hugeicons:add-01',
    },
    /** 是否允许拖拽排序 */
    draggable: {
        type: Boolean,
        default: false,
    },
    /** 是否允许双击重命名 */
    renamable: {
        type: Boolean,
        default: false,
    },
    /** 路由路径，非空时作为选中态来源之一：active > route > 内部状态 */
    route: {
        type: String,
        default: '',
    },
    /** 点击页签时调用的路由适配器，例如 vue-router 实例 */
    router: {
        type: Object as PropType<ProTabsRouter>,
        default: undefined,
    },
    /** 数字徽标溢出阈值，超过时显示 `${max}+` */
    badgeMax: {
        type: Number,
        default: 99,
    },
    /** 关闭按钮无障碍名称前缀 */
    closeLabel: {
        type: String,
        default: '关闭',
    },
    /** 面板首次激活时才挂载（keepAlive 为 true 时生效） */
    lazy: {
        type: Boolean,
        default: false,
    },
    /** 切走后保留已挂载的面板 */
    keepAlive: {
        type: Boolean,
        default: false,
    },
    /** 面板容器附加类名 */
    panelClass: {
        type: String,
        default: 'mt-3',
    },
    /** 虚拟滚动：true 强制开启，'auto' 达到阈值时开启；开启后拖拽不可用 */
    virtual: {
        type: [Boolean, String] as PropType<boolean | 'auto'>,
        default: false,
    },
    /** 'auto' 模式下开启虚拟滚动的最小页签数 */
    virtualThreshold: {
        type: Number,
        default: 100,
    },
    /** 虚拟窗口上下预渲染的页签数 */
    virtualOverscan: {
        type: Number,
        default: 3,
    },
    /** 面板异步加载器，选项级 panelLoader 优先 */
    panelLoader: {
        type: Function as PropType<PanelLoader>,
        default: undefined,
    },
    /** 面板加载中文案 */
    panelLoadingText: {
        type: String,
        default: '加载中…',
    },
    /** 面板加载失败文案 */
    panelErrorText: {
        type: String,
        default: '加载失败',
    },
    /** 面板重试按钮文案 */
    panelRetryText: {
        type: String,
        default: '重试',
    },
    /** 是否启用右键菜单 */
    contextMenu: {
        type: Boolean,
        default: false,
    },
    /** 右键菜单文案 */
    contextMenuLabels: {
        type: Object as PropType<ProTabsContextMenuLabels>,
        default: () => ({}),
    },
    /** 拖拽分组，支持跨容器拖拽；跨组落位抛 transfer */
    dragGroup: {
        type: [String, Object] as PropType<ProTabsDragGroup>,
        default: undefined,
    },
    /** 当前 route 不在 options 中时，自动追加的临时页签标题 */
    routeTitle: {
        type: [String, Function] as PropType<string | ((route: string) => string)>,
        default: undefined,
    },
    /** 组件级面板渲染，优先级低于选项级 renderPanel 与 panel 插槽 */
    renderPanel: {
        type: Function as PropType<(option: TabOption) => VNode>,
        default: undefined,
    },
}

export type ProTabsProps = ExtractPropTypes<typeof proTabsProps>

export const proTabsEmits = {
    'update:active': (key: string) => typeof key === 'string',
    close: (key: string) => typeof key === 'string',
    add: () => true,
    reorder: (keys: string[], from: number, to: number) =>
        Array.isArray(keys) && typeof from === 'number' && typeof to === 'number',
    rename: (key: string, label: string) => typeof key === 'string' && typeof label === 'string',
    'close-others': (key: string) => typeof key === 'string',
    'close-right': (key: string) => typeof key === 'string',
    'close-all': () => true,
    transfer: (payload: ProTabsTransferPayload) =>
        Boolean(payload) && typeof payload.key === 'string' && typeof payload.index === 'number',
    'route-enter': (route: string, title: string) => typeof route === 'string' && typeof title === 'string',
    'panel-loaded': (key: string) => typeof key === 'string',
    'panel-error': (key: string, _error: unknown) => typeof key === 'string',
}

export type ProTabsEmits = {
    (e: 'update:active', key: string): void
    (e: 'close', key: string): void
    (e: 'add'): void
    (e: 'reorder', keys: string[], from: number, to: number): void
    (e: 'rename', key: string, label: string): void
    (e: 'close-others', key: string): void
    (e: 'close-right', key: string): void
    (e: 'close-all'): void
    (e: 'transfer', payload: ProTabsTransferPayload): void
    (e: 'route-enter', route: string, title: string): void
    (e: 'panel-loaded', key: string): void
    (e: 'panel-error', key: string, error: unknown): void
}

export interface ProTabsInstance {
    /** 当前选中的 key（只读） */
    activeKey: ComputedRef<string>
    /** 把指定页签滚动到可见区域，参数可为 key 或索引 */
    scrollTo(target: string | number, behavior?: ScrollBehavior): void
    /** 把选中页签滚动到可见区域 */
    scrollActive(behavior?: ScrollBehavior): void
    /** 相对当前滚动位置横向滚动 */
    scrollBy(delta: number): void
    /** 聚焦当前页签 */
    focus(): void
    /** 获取横向滚动容器 */
    getEl(): HTMLElement | null
    /** 重新执行指定页签的 panelLoader */
    reloadPanel(key: string): void
}
