import { computed, defineComponent, nextTick, onBeforeUnmount, onMounted, onUpdated, ref, shallowRef, useId, watch } from 'vue'
import type { VNode } from 'vue'
import { Icon } from '@iconify/vue'
import { VueDraggableNext as VueDraggable } from 'vue-draggable-next'
import { cn } from '@/utils'
import { proTabsEmits, proTabsProps } from './types'
import type { ContextMenuCommand, PanelLoader, ProTabsTransferPayload, TabOption } from './types'
import ProTabsContextMenu from './context-menu'
import type { ContextMenuItem } from './context-menu'
import { buildVirtualWindow, estimateTabWidth } from './virtual'
import { diffMove, formatBadge, moveItem, proTabsSizeTokens, sanitizeId } from './utils'

// Sortable 选项（animation / filter 等）通过 attrs 透传，库的类型未声明这些键
const Draggable = VueDraggable as any

// 记录跨容器拖拽的来源，供目标容器在 change 事件中回填 from
let activeDragSource: { group: string; key: string; at: number } | null = null

interface PanelState {
    status: 'loading' | 'success' | 'error'
    node?: VNode | VNode[] | null
    error?: Error
}

export default defineComponent({
    name: 'ProTabs',
    props: proTabsProps,
    emits: proTabsEmits,
    setup(props, { slots, emit, expose }) {
        const uid = sanitizeId(useId())
        const scrollerRef = ref<HTMLElement | null>(null)
        const tabElements = new Map<string, HTMLElement>()

        const innerActive = ref(props.defaultActive || props.options[0]?.key || '')
        const currentActive = computed(() => props.active || props.route || innerActive.value)
        const tokens = computed(() => proTabsSizeTokens[props.size] ?? proTabsSizeTokens.medium)

        // ---------------- 路由临时页签 ----------------

        const routeLabel = computed(() => {
            if (!props.route || !props.routeTitle) return ''
            if (props.options.some(option => option.key === props.route)) return ''
            return typeof props.routeTitle === 'function' ? props.routeTitle(props.route) : props.routeTitle
        })

        const routeOption = computed<TabOption | null>(() => routeLabel.value
            ? { key: props.route, label: routeLabel.value, closable: false, id: `route-${props.route}` }
            : null)

        const renderOptions = computed(() => routeOption.value ? [...props.options, routeOption.value] : props.options)
        const isRouteVirtual = (option: TabOption) => Boolean(routeOption.value && routeOption.value.key === option.key)

        watch([() => props.route, () => routeLabel.value], ([route, label]) => {
            if (route && label) emit('route-enter', route, label)
        }, { immediate: true, flush: 'post' })

        // 非受控下选中项消失时落到最后一个仍存在的页签；从未选中过（如 options 异步到达）则取第一项
        watch(() => props.options, (options) => {
            if (props.active || props.route) return
            if (options.some(option => option.key === innerActive.value)) return
            innerActive.value = (innerActive.value ? options[options.length - 1] : options[0])?.key ?? ''
        })

        const tabId = (option: TabOption) => `${uid}-tab-${sanitizeId(option.id || option.key)}`
        const panelId = (option: TabOption) => `${uid}-panel-${sanitizeId(option.id || option.key)}`

        const hasPanel = computed(() => Boolean(
            slots.panel
            || props.renderPanel
            || props.panelLoader
            || renderOptions.value.some(option => option.renderPanel || option.panelLoader)
        ))

        // ---------------- 虚拟滚动 ----------------

        const scrollLeft = ref(0)
        const viewportWidth = ref(0)
        const tabWidths = ref<Record<string, number>>({})

        const virtualEnabled = computed(() =>
            props.virtual === true || (props.virtual === 'auto' && renderOptions.value.length >= props.virtualThreshold)
        )
        const dragEnabled = computed(() => props.draggable && !virtualEnabled.value)
        const gapPx = computed(() => (props.size === 'small' ? 2 : props.size === 'large' ? 6 : 4))

        const estimatedSizes = computed(() => renderOptions.value.map(option =>
            tabWidths.value[option.key] ?? estimateTabWidth(option, {
                size: props.size,
                defaultIcon: props.icon,
                closable: option.closable ?? props.closable,
            })
        ))

        const virtualWindow = computed(() => virtualEnabled.value
            ? buildVirtualWindow(
                estimatedSizes.value,
                gapPx.value,
                scrollLeft.value,
                viewportWidth.value,
                props.virtualOverscan,
            )
            : { start: 0, end: renderOptions.value.length - 1, paddingStart: 0, paddingEnd: 0 })

        const visibleOptions = computed(() => virtualEnabled.value
            ? renderOptions.value.slice(virtualWindow.value.start, virtualWindow.value.end + 1)
            : renderOptions.value)

        const measureVirtual = () => {
            if (!virtualEnabled.value) return
            let changed = false
            const next = { ...tabWidths.value }
            tabElements.forEach((el, key) => {
                if (!el.isConnected) return
                const width = el.offsetWidth
                if (width > 0 && next[key] !== width) {
                    next[key] = width
                    changed = true
                }
            })
            if (changed) tabWidths.value = next
        }

        onUpdated(() => {
            if (virtualEnabled.value) measureVirtual()
        })

        let warnedVirtualDrag = false
        watch([virtualEnabled, () => props.draggable], ([virtual, draggable]) => {
            if (!virtual || !draggable || warnedVirtualDrag) return
            warnedVirtualDrag = true
            console.warn('[ProTabs] 虚拟滚动开启时 draggable 不生效')
        }, { immediate: true })

        watch([() => props.size, () => props.type], () => {
            tabWidths.value = {}
            nextTick(() => {
                updateScrollState()
                measureVirtual()
            })
        })

        watch([() => props.options.length, () => props.inset], () => {
            nextTick(updateScrollState)
        })

        watch(renderOptions, (options) => {
            const keys = new Set(options.map(option => option.key))
            const nextWidths: Record<string, number> = {}
            for (const [key, width] of Object.entries(tabWidths.value)) {
                if (keys.has(key)) nextWidths[key] = width
            }
            if (Object.keys(nextWidths).length !== Object.keys(tabWidths.value).length) tabWidths.value = nextWidths
        })

        // ---------------- 选中 ----------------

        const lastDragEnd = ref(0)

        const select = (option: TabOption) => {
            if (option.disabled) return
            // 拖拽结束后的 click 不当作选中操作
            if (Date.now() - lastDragEnd.value < 120) return
            innerActive.value = option.key
            emit('update:active', option.key)
            props.router?.push?.(option.key)
        }

        const firstEnabledKey = computed(() => renderOptions.value.find(option => !option.disabled)?.key ?? '')
        const rovingKey = computed(() => {
            const active = renderOptions.value.find(option => option.key === currentActive.value && !option.disabled)
            return active?.key ?? firstEnabledKey.value
        })

        // ---------------- 键盘 ----------------

        const focusTab = (key: string) => {
            nextTick(() => tabElements.get(key)?.focus())
        }

        const reorderByKeyboard = (delta: number, option: TabOption) => {
            if (!dragEnabled.value) return
            const from = props.options.findIndex(item => item.key === option.key)
            if (from < 0) return
            const to = from + delta
            if (to < 0 || to >= props.options.length) return
            const keys = moveItem(props.options.map(item => item.key), from, to)
            emit('reorder', keys, from, to)
            focusTab(option.key)
        }

        const onTabKeydown = (event: KeyboardEvent, option: TabOption) => {
            if (props.contextMenu && (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10'))) {
                event.preventDefault()
                openContextMenuFromKeyboard(option)
                return
            }
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                select(option)
                return
            }
            if (dragEnabled.value && event.altKey && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
                event.preventDefault()
                reorderByKeyboard(event.key === 'ArrowLeft' ? -1 : 1, option)
                return
            }
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
            event.preventDefault()
            const enabled = renderOptions.value.filter(item => !item.disabled)
            if (!enabled.length) return
            let index = enabled.findIndex(item => item.key === currentActive.value)
            if (index === -1) index = enabled.findIndex(item => item.key === option.key)
            if (index === -1) index = 0
            let nextIndex: number
            switch (event.key) {
                case 'Home':
                    nextIndex = 0
                    break
                case 'End':
                    nextIndex = enabled.length - 1
                    break
                case 'ArrowLeft':
                    nextIndex = (index - 1 + enabled.length) % enabled.length
                    break
                default:
                    nextIndex = (index + 1) % enabled.length
            }
            const next = enabled[nextIndex]
            if (!next) return
            if (next.key !== currentActive.value) select(next)
            focusTab(next.key)
        }

        // ---------------- 滚动 ----------------

        const canScrollLeft = ref(false)
        const canScrollRight = ref(false)

        const updateScrollState = () => {
            const el = scrollerRef.value
            if (!el) return
            const max = el.scrollWidth - el.clientWidth
            canScrollLeft.value = el.scrollLeft > 1
            canScrollRight.value = max > 1 && el.scrollLeft < max - 1
        }

        const offsetOfKey = (key: string) => {
            const index = renderOptions.value.findIndex(option => option.key === key)
            if (index <= 0) return 0
            let offset = 0
            for (let cursor = 0; cursor < index; cursor += 1) {
                offset += estimatedSizes.value[cursor] + gapPx.value
            }
            return offset
        }

        const scrollTo = (target: string | number, behavior: ScrollBehavior = 'smooth') => {
            const key = typeof target === 'number' ? renderOptions.value[target]?.key : target
            if (!key) return
            const el = scrollerRef.value
            if (virtualEnabled.value && el) {
                const max = Math.max(0, el.scrollWidth - el.clientWidth)
                const left = Math.min(offsetOfKey(key), max)
                if (typeof el.scrollTo === 'function') el.scrollTo({ left, behavior })
                else el.scrollLeft = left
                // 立即更新窗口，保证后续聚焦时节点已渲染
                if (behavior === 'auto') {
                    scrollLeft.value = left
                    viewportWidth.value = el.clientWidth
                }
                return
            }
            const option = renderOptions.value.find(item => item.key === key)
            if (!option) return
            const tab = tabElements.get(option.key)
            if (tab && typeof tab.scrollIntoView === 'function') {
                tab.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior })
            }
        }

        const scrollBy = (delta: number) => {
            scrollerRef.value?.scrollBy?.({ left: delta, behavior: 'smooth' })
        }

        const scrollByViewport = (direction: -1 | 1) => {
            const el = scrollerRef.value
            if (!el) return
            scrollBy(direction * el.clientWidth * 0.8)
        }

        let resizeObserver: ResizeObserver | null = null

        const handleScroll = () => {
            const el = scrollerRef.value
            if (!el) return
            scrollLeft.value = el.scrollLeft
            viewportWidth.value = el.clientWidth
            updateScrollState()
            if (virtualEnabled.value) measureVirtual()
        }

        onMounted(() => {
            const el = scrollerRef.value
            el?.addEventListener('scroll', handleScroll, { passive: true })
            if (el && typeof ResizeObserver !== 'undefined') {
                resizeObserver = new ResizeObserver(() => {
                    viewportWidth.value = el.clientWidth
                    updateScrollState()
                    if (virtualEnabled.value) measureVirtual()
                })
                resizeObserver.observe(el)
            }
            nextTick(() => {
                updateScrollState()
                if (!el) return
                viewportWidth.value = el.clientWidth
                if (virtualEnabled.value) {
                    scrollTo(currentActive.value, 'auto')
                    measureVirtual()
                }
            })
        })

        onBeforeUnmount(() => {
            scrollerRef.value?.removeEventListener('scroll', handleScroll)
            resizeObserver?.disconnect()
            resizeObserver = null
        })

        watch([() => props.options.length, () => props.size, () => props.type, () => props.inset], () => {
            nextTick(updateScrollState)
        })

        // ---------------- 内容面板 ----------------

        const mountedKeys = ref<string[]>(currentActive.value ? [currentActive.value] : [])
        const panelStates = shallowRef<Record<string, PanelState>>({})
        const panelTokens = new Map<string, number>()
        const clientReady = ref(false)

        watch(currentActive, (key) => {
            if (!key) return
            if (!mountedKeys.value.includes(key)) mountedKeys.value = [...mountedKeys.value, key]
            if (virtualEnabled.value) {
                scrollTo(key, 'auto')
            } else {
                nextTick(() => {
                    scrollTo(key)
                    updateScrollState()
                })
            }
        })

        watch(renderOptions, (options) => {
            const keys = new Set(options.map(option => option.key))
            const nextMounted = mountedKeys.value.filter(key => keys.has(key))
            if (nextMounted.length !== mountedKeys.value.length) mountedKeys.value = nextMounted

            const states = panelStates.value
            const nextStates: Record<string, PanelState> = {}
            let statesChanged = false
            for (const [key, state] of Object.entries(states)) {
                if (keys.has(key)) nextStates[key] = state
                else statesChanged = true
            }
            if (statesChanged) panelStates.value = nextStates
        })

        const loaderFor = (option: TabOption): PanelLoader | undefined =>
            option.panelLoader ?? props.panelLoader

        const hasStaticSource = (option: TabOption) => Boolean(option.renderPanel || slots.panel || props.renderPanel)

        const resolveStaticPanel = (option: TabOption): VNode | VNode[] | null => {
            const fromOption = option.renderPanel?.(option)
            if (fromOption) return fromOption
            if (slots.panel) {
                const nodes = slots.panel({ option, active: currentActive.value === option.key })
                if (nodes && nodes.length) return nodes
            }
            return props.renderPanel?.(option) ?? null
        }

        const loadPanel = async (option: TabOption, loader: PanelLoader) => {
            const token = (panelTokens.get(option.key) ?? 0) + 1
            panelTokens.set(option.key, token)
            panelStates.value = { ...panelStates.value, [option.key]: { status: 'loading' } }
            try {
                const node = await loader(option)
                if (panelTokens.get(option.key) !== token) return
                panelStates.value = { ...panelStates.value, [option.key]: { status: 'success', node } }
                emit('panel-loaded', option.key)
            } catch (error) {
                if (panelTokens.get(option.key) !== token) return
                panelStates.value = {
                    ...panelStates.value,
                    [option.key]: { status: 'error', error: error instanceof Error ? error : new Error(String(error)) },
                }
                emit('panel-error', option.key, error)
            }
        }

        const ensurePanelLoaded = (option: TabOption) => {
            const loader = loaderFor(option)
            if (!loader || hasStaticSource(option)) return
            const state = panelStates.value[option.key]
            if (state && state.status !== 'error') return
            void loadPanel(option, loader)
        }

        const reloadPanel = (key: string) => {
            const option = renderOptions.value.find(item => item.key === key)
            const loader = option ? loaderFor(option) : undefined
            if (!option || !loader) return
            void loadPanel(option, loader)
        }

        const renderPanelStatus = (option: TabOption, text: string, retry: boolean, error?: Error) => (
            <div
                role={retry ? 'alert' : 'status'}
                class="flex min-h-[96px] w-full flex-col items-center justify-center gap-2 px-4 text-center text-sm text-[var(--color-foreground-secondary,#57534a)]"
            >
                {!retry && (
                    <span
                        aria-hidden="true"
                        class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                    />
                )}
                <span>{text}</span>
                {retry && (
                    <button
                        type="button"
                        class="cursor-pointer rounded-[2px] border border-[var(--color-divider,#dfdacc)] px-3 py-1 text-[var(--color-accent,#f04e23)] hover:bg-[var(--color-hover,rgba(240,78,35,0.05))]"
                        onClick={() => reloadPanel(option.key)}
                    >
                        {props.panelRetryText}
                    </button>
                )}
                {retry && error?.message && <span class="text-xs opacity-70">{error.message}</span>}
            </div>
        )

        const resolvePanel = (option: TabOption): VNode | VNode[] | null => {
            const staticNode = resolveStaticPanel(option)
            if (staticNode) return staticNode
            const loader = loaderFor(option)
            if (!loader) return null
            const state = panelStates.value[option.key]
            if (!state || state.status === 'loading') {
                const custom = slots['panel-loading']?.({ option })
                if (custom && custom.length) return custom
                return renderPanelStatus(option, props.panelLoadingText, false)
            }
            if (state.status === 'error') {
                const custom = slots['panel-error']?.({
                    option,
                    error: state.error,
                    retry: () => reloadPanel(option.key),
                })
                if (custom && custom.length) return custom
                return renderPanelStatus(option, props.panelErrorText, true, state.error)
            }
            return state.node ?? null
        }

        const neededPanelOptions = computed(() => renderOptions.value.filter((option) => {
            if (!props.keepAlive) return option.key === currentActive.value
            if (props.lazy) return mountedKeys.value.includes(option.key)
            return true
        }))

        watch(neededPanelOptions, (options) => {
            if (!clientReady.value) return
            options.forEach(ensurePanelLoaded)
        })

        onMounted(() => {
            clientReady.value = true
            neededPanelOptions.value.forEach(ensurePanelLoaded)
        })

        const renderPanels = () => {
            if (!hasPanel.value) return null
            const visible = neededPanelOptions.value
            if (!visible.length) return null
            return (
                <div class={cn('w-full', props.panelClass)}>
                    {visible.map(option => (
                        <div
                            key={option.key}
                            id={panelId(option)}
                            role="tabpanel"
                            aria-labelledby={tabId(option)}
                            tabindex={0}
                            hidden={option.key !== currentActive.value}
                            class="focus-visible:outline-none"
                        >
                            {resolvePanel(option)}
                        </div>
                    ))}
                </div>
            )
        }

        // ---------------- 拖拽 ----------------

        const dragList = ref<TabOption[]>([...renderOptions.value])

        watch(renderOptions, (options) => {
            dragList.value = [...options]
        }, { immediate: true })

        const dragGroupConfig = computed(() => {
            if (!props.dragGroup) return undefined
            if (typeof props.dragGroup === 'string') return { name: props.dragGroup, pull: true, put: true }
            return { pull: true, put: true, ...props.dragGroup }
        })
        const dragGroupName = computed(() => dragGroupConfig.value?.name ?? '')

        const realKeysOf = (list: TabOption[]) =>
            list.filter(option => !isRouteVirtual(option)).map(option => option.key)

        const handleDragStart = (event: any) => {
            if (!dragGroupName.value) {
                activeDragSource = null
                return
            }
            const key = dragList.value[event?.oldIndex]?.key
            activeDragSource = key
                ? { group: dragGroupName.value, key, at: Date.now() }
                : null
        }

        const handleDragEnd = (event?: any) => {
            lastDragEnd.value = Date.now()
            // 跨容器落位由目标容器抛 transfer，源容器不再抛 reorder
            const crossContainer = Boolean(event?.from && event?.to && event.from !== event.to)
            const nextKeys = realKeysOf(dragList.value)
            const diff = crossContainer ? null : diffMove(props.options.map(option => option.key), nextKeys)
            dragList.value = [...renderOptions.value]
            if (diff) emit('reorder', nextKeys, diff.from, diff.to)
        }

        const handleDragChange = (event: any) => {
            const added = event?.added
            if (!added?.element) return
            const groupName = dragGroupName.value
            const source = activeDragSource
            // 内部排序只会产生 moved，带 added 的一定来自另一个容器
            if (!groupName || !source) return
            if (Date.now() - source.at > 3000) {
                activeDragSource = null
                return
            }
            const key = (added.element as TabOption).key
            const index = dragList.value
                .filter(option => !isRouteVirtual(option))
                .findIndex(option => option.key === key)
            const payload: ProTabsTransferPayload = {
                key,
                from: source.group,
                to: groupName,
                index: index < 0 ? added.newIndex : index,
            }
            activeDragSource = null
            dragList.value = [...renderOptions.value]
            emit('transfer', payload)
        }

        // ---------------- 右键菜单 ----------------

        const menuOpen = ref(false)
        const contextMenuTarget = ref('')
        const menuPosition = ref({ x: 0, y: 0 })

        const menuItems = computed<ContextMenuItem[]>(() => {
            const key = contextMenuTarget.value
            const target = renderOptions.value.find(option => option.key === key)
            if (!target) return []
            const targetIndex = renderOptions.value.findIndex(option => option.key === key)
            const closableOptions = renderOptions.value.filter(option =>
                !isRouteVirtual(option) && (option.closable ?? props.closable)
            )
            const labels = props.contextMenuLabels ?? {}
            const canCloseTarget = closableOptions.some(option => option.key === key)
            return [
                { command: 'close', label: labels.close ?? '关闭当前', disabled: !canCloseTarget },
                {
                    command: 'close-others',
                    label: labels.closeOthers ?? '关闭其他',
                    disabled: !closableOptions.some(option => option.key !== key),
                },
                {
                    command: 'close-right',
                    label: labels.closeRight ?? '关闭右侧',
                    disabled: !closableOptions.some(option =>
                        renderOptions.value.findIndex(item => item.key === option.key) > targetIndex
                    ),
                },
                { command: 'close-all', label: labels.closeAll ?? '关闭全部', disabled: closableOptions.length === 0 },
            ]
        })

        const openContextMenu = (key: string, x: number, y: number) => {
            if (!props.contextMenu) return
            contextMenuTarget.value = key
            menuPosition.value = { x, y }
            menuOpen.value = true
        }

        const onTabContextMenu = (event: MouseEvent, option: TabOption) => {
            if (!props.contextMenu) return
            if ((event.target as HTMLElement | null)?.closest?.('.pro-tabs-rename-input')) return
            event.preventDefault()
            openContextMenu(option.key, event.clientX, event.clientY)
        }

        const openContextMenuFromKeyboard = (option: TabOption) => {
            const rect = tabElements.get(option.key)?.getBoundingClientRect()
            openContextMenu(option.key, rect?.left ?? 0, rect?.bottom ?? 0)
        }

        const closeContextMenu = () => {
            const active = document.activeElement
            const restoreFocus = active instanceof HTMLElement && Boolean(active.closest('[data-pro-tabs-menu]'))
            menuOpen.value = false
            if (restoreFocus) nextTick(() => tabElements.get(contextMenuTarget.value)?.focus())
        }

        const handleMenuSelect = (command: ContextMenuCommand) => {
            const key = contextMenuTarget.value
            menuOpen.value = false
            if (command === 'close') emit('close', key)
            else if (command === 'close-others') emit('close-others', key)
            else if (command === 'close-right') emit('close-right', key)
            else emit('close-all')
            nextTick(() => tabElements.get(key)?.focus())
        }

        watch(renderOptions, (options) => {
            if (menuOpen.value && !options.some(option => option.key === contextMenuTarget.value)) {
                menuOpen.value = false
            }
        })

        // ---------------- 重命名 ----------------

        const renamingKey = ref('')
        const renameValue = ref('')
        const renameInputRef = ref<HTMLInputElement | null>(null)

        const startRename = (option: TabOption) => {
            if (!props.renamable || option.disabled || isRouteVirtual(option) || renamingKey.value === option.key) return
            renamingKey.value = option.key
            renameValue.value = option.label
            nextTick(() => {
                renameInputRef.value?.focus()
                renameInputRef.value?.select()
            })
        }

        const commitRename = () => {
            const key = renamingKey.value
            if (!key) return
            renamingKey.value = ''
            const label = renameValue.value.trim()
            const original = props.options.find(option => option.key === key)?.label
            if (label && label !== original) emit('rename', key, label)
        }

        const cancelRename = () => {
            renamingKey.value = ''
        }

        // ---------------- 渲染 ----------------

        const renderBadge = (option: TabOption) => {
            const badge = option.badge !== undefined
                ? option.badge
                : (props.showBadge && option.dot !== undefined ? option.dot : undefined)
            if (badge === undefined || badge === null) return null
            if (typeof badge === 'function') return badge(option)
            if (badge === 'dot') {
                return <span aria-hidden="true" class="ml-1 h-2 w-2 shrink-0 rounded-full bg-[var(--color-accent,#f04e23)]" />
            }
            const max = option.badgeMax ?? props.badgeMax
            return (
                <span class={cn('ml-1 shrink-0 rounded-full text-center text-white bg-[var(--color-accent,#f04e23)]', tokens.value.badge)}>
                    {formatBadge(badge, max)}
                </span>
            )
        }

        const renderRenameInput = (option: TabOption) => (
            <input
                ref={(el: any) => { renameInputRef.value = (el as HTMLInputElement | null) ?? null }}
                class="pro-tabs-rename-input w-24 min-w-0 border-b border-[var(--color-accent,#f04e23)] bg-transparent outline-none"
                value={renameValue.value}
                onInput={(event: Event) => { renameValue.value = (event.target as HTMLInputElement).value }}
                onClick={(event: MouseEvent) => event.stopPropagation()}
                onKeydown={(event: KeyboardEvent) => {
                    event.stopPropagation()
                    if (event.key === 'Enter') {
                        event.preventDefault()
                        commitRename()
                    } else if (event.key === 'Escape') {
                        event.preventDefault()
                        cancelRename()
                    }
                }}
                onBlur={commitRename}
                aria-label={option.label}
            />
        )

        const renderContent = (option: TabOption) => {
            if (renamingKey.value === option.key) return renderRenameInput(option)
            const custom = option.render?.(option) ?? props.render?.(option)
            if (custom) return custom
            const icon = option.icon || props.icon
            return (
                <>
                    {icon && <Icon icon={icon} class={cn('shrink-0', tokens.value.icon)} />}
                    <span class="truncate">{option.label}</span>
                    {renderBadge(option)}
                </>
            )
        }

        const renderTab = (option: TabOption) => {
            const active = currentActive.value === option.key
            const isLine = props.type === 'line'
            const closable = (option.closable ?? props.closable) && !isRouteVirtual(option)
            const index = virtualEnabled.value
                ? renderOptions.value.findIndex(item => item.key === option.key)
                : -1
            return (
                <div
                    key={option.key}
                    id={tabId(option)}
                    role="tab"
                    ref={(el: any) => {
                        const node = el as HTMLElement | null
                        if (node) tabElements.set(option.key, node)
                        else tabElements.delete(option.key)
                    }}
                    aria-selected={active}
                    aria-disabled={option.disabled}
                    aria-controls={hasPanel.value ? panelId(option) : undefined}
                    aria-setsize={virtualEnabled.value ? renderOptions.value.length : undefined}
                    aria-posinset={index >= 0 ? index + 1 : undefined}
                    tabindex={option.disabled ? -1 : (rovingKey.value === option.key ? 0 : -1)}
                    data-drag-disabled={option.disabled || isRouteVirtual(option) ? 'true' : undefined}
                    class={cn(
                        'relative flex items-center gap-1.5 shrink-0 cursor-pointer select-none transition-colors',
                        tokens.value.tabPadding,
                        tokens.value.text,
                        isLine ? tokens.value.lineTab : tokens.value.cardTab,
                        !isLine && (props.rounded ? 'rounded-full' : 'rounded-[2px]'),
                        active
                            ? 'font-medium text-[var(--color-accent,#f04e23)]'
                            : 'text-[var(--color-foreground-secondary,#57534a)]',
                        !isLine && active && 'bg-[var(--color-selected,rgba(240,78,35,0.09))]',
                        option.disabled
                            ? 'opacity-45 cursor-not-allowed'
                            : !active && (isLine
                                ? 'hover:text-[var(--color-foreground,#1c1a15)]'
                                : 'hover:bg-[var(--color-hover,rgba(240,78,35,0.05))]')
                    )}
                    onClick={() => select(option)}
                    onDblclick={() => startRename(option)}
                    onContextmenu={(event: MouseEvent) => onTabContextMenu(event, option)}
                    onKeydown={(event: KeyboardEvent) => onTabKeydown(event, option)}
                >
                    {renderContent(option)}
                    {closable && (
                        <button
                            type="button"
                            aria-label={`${props.closeLabel} ${option.label}`}
                            class={cn('pro-tabs-close ml-1 flex items-center opacity-60 hover:opacity-100 cursor-pointer', tokens.value.close)}
                            onClick={(event: MouseEvent) => {
                                event.stopPropagation()
                                emit('close', option.key)
                            }}
                        >
                            <Icon icon="hugeicons:cancel-01" />
                        </button>
                    )}
                    {isLine && active && (
                        <span class="absolute left-0 right-0 bottom-0 h-[2px] bg-[var(--color-accent,#f04e23)]" />
                    )}
                </div>
            )
        }

        const renderSpacer = (width: number, position: 'start' | 'end') => {
            if (!width) return null
            return (
                <div
                    key={`spacer-${position}`}
                    data-pro-tabs-spacer={position}
                    aria-hidden="true"
                    class="shrink-0"
                    style={{ width: `${Math.round(width)}px` }}
                />
            )
        }

        const renderAdd = () => {
            if (!props.addable) return null
            return (
                <button
                    type="button"
                    aria-label={props.addLabel}
                    title={props.addLabel}
                    class={cn(
                        'shrink-0 flex items-center gap-1 opacity-60 hover:opacity-100 cursor-pointer transition-opacity',
                        tokens.value.tabPadding,
                        tokens.value.text
                    )}
                    onClick={(event: MouseEvent) => {
                        event.stopPropagation()
                        emit('add')
                    }}
                >
                    <Icon icon={props.addIcon} class={tokens.value.icon} />
                    <span>{props.addLabel}</span>
                </button>
            )
        }

        const tablistClass = () => cn(
            'flex items-center min-w-full w-max',
            tokens.value.gap,
            tokens.value.barMinHeight,
            props.type === 'card'
                ? 'bg-[var(--color-fill,#ece8de)]'
                : 'border-b border-[var(--color-divider,#dfdacc)]',
            props.inset ? 'px-1' : 'px-0',
            props.type === 'card' && (props.rounded ? 'rounded-full' : 'rounded-[2px]')
        )

        const renderTablist = () => {
            if (dragEnabled.value) {
                return (
                    <Draggable
                        v-model={dragList.value}
                        item-key="key"
                        tag="div"
                        class={tablistClass()}
                        role="tablist"
                        animation={150}
                        group={dragGroupConfig.value}
                        draggable='[role="tab"]'
                        filter=".pro-tabs-close, .pro-tabs-rename-input, [data-drag-disabled='true']"
                        preventOnFilter={false}
                        onStart={handleDragStart}
                        onChange={handleDragChange}
                        onEnd={handleDragEnd}
                    >
                        {dragList.value.map(option => renderTab(option))}
                        {renderAdd()}
                        {slots.default?.()}
                    </Draggable>
                )
            }
            return (
                <div role="tablist" class={tablistClass()}>
                    {virtualEnabled.value ? (
                        <>
                            {renderSpacer(virtualWindow.value.paddingStart, 'start')}
                            {visibleOptions.value.map(option => renderTab(option))}
                            {renderSpacer(virtualWindow.value.paddingEnd, 'end')}
                        </>
                    ) : (
                        renderOptions.value.map(option => renderTab(option))
                    )}
                    {renderAdd()}
                    {slots.default?.()}
                </div>
            )
        }

        const renderScrollButton = (direction: 'left' | 'right') => {
            const visible = props.scrollButtons && (direction === 'left' ? canScrollLeft.value : canScrollRight.value)
            if (!visible) return null
            const gradient = props.type === 'card'
                ? 'from-[var(--color-fill,#ece8de)]'
                : 'from-[var(--color-background,#fff)]'
            return (
                <div
                    class={cn(
                        'pointer-events-none absolute inset-y-0 z-10 flex w-8 items-center to-transparent',
                        direction === 'left'
                            ? 'left-0 justify-start bg-gradient-to-r'
                            : 'right-0 justify-end bg-gradient-to-l',
                        gradient
                    )}
                >
                    <button
                        type="button"
                        aria-label={direction === 'left' ? props.scrollLeftLabel : props.scrollRightLabel}
                        title={direction === 'left' ? props.scrollLeftLabel : props.scrollRightLabel}
                        class="pointer-events-auto flex h-6 w-6 items-center justify-center rounded-full border border-[var(--color-divider,#dfdacc)] bg-[var(--color-surface,#faf8f3)] text-[var(--color-foreground-secondary,#57534a)] shadow-sm cursor-pointer hover:text-[var(--color-accent,#f04e23)]"
                        onClick={() => scrollByViewport(direction === 'left' ? -1 : 1)}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            class="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            aria-hidden="true"
                        >
                            <path d={direction === 'left' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
                        </svg>
                    </button>
                </div>
            )
        }

        expose({
            activeKey: currentActive,
            scrollTo,
            scrollActive: (behavior: ScrollBehavior = 'smooth') => scrollTo(currentActive.value, behavior),
            scrollBy,
            focus: () => tabElements.get(rovingKey.value)?.focus(),
            getEl: () => scrollerRef.value,
            reloadPanel,
        })

        return () => (
            <div class={cn('relative w-full flex', hasPanel.value && 'flex-col', props.class)} style={props.style}>
                <div class="relative flex w-full min-w-0">
                    <div
                        ref={scrollerRef}
                        data-pro-tabs-scroller=""
                        class="flex-1 min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                        {renderTablist()}
                    </div>
                    {renderScrollButton('left')}
                    {renderScrollButton('right')}
                </div>
                {renderPanels()}
                {menuOpen.value && (
                    <ProTabsContextMenu
                        key={`${contextMenuTarget.value}-${menuPosition.value.x}-${menuPosition.value.y}`}
                        x={menuPosition.value.x}
                        y={menuPosition.value.y}
                        items={menuItems.value}
                        onSelect={handleMenuSelect}
                        onClose={closeContextMenu}
                    />
                )}
            </div>
        )
    },
})