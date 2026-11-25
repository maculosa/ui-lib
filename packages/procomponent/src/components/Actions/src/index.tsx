import { defineComponent, computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"
import { NButton, NModal, NPopover } from "naive-ui"
import { Icon } from "@iconify/vue"
import BmIconMoreHorizontal from '~icons/bm-icon/more-horizontal'
import ActionButton from './button'
import { actionsEmits, actionsProps, type ActionButton as ActionButtonItem } from "./types"
import { computeVisibleCount } from "./utils"

const GAP = 2

export default defineComponent({
    name: 'Actions',
    props: actionsProps,
    emits: actionsEmits,
    setup(props, { emit, slots }) {
        const rootRef = ref<HTMLElement | null>(null)
        const measureRef = ref<HTMLElement | null>(null)
        const panelRef = ref<HTMLElement | null>(null)
        const moreTriggerRef = ref<InstanceType<typeof NButton> | null>(null)

        const popoverShow = ref(false)
        const fitCount = ref(Number.POSITIVE_INFINITY)
        const confirmShow = ref(false)
        const confirmItem = ref<ActionButtonItem | null>(null)

        let confirmResolved = false
        let resizeObserver: ResizeObserver | null = null
        let measureFrame = 0

        // 权限过滤发生在数量计算之前
        const allowedItems = computed(() => props.items.filter(item => {
            if (!item.permission) return true
            if (props.hasPermission) return props.hasPermission(item.permission)
            if (props.permissions) return props.permissions.includes(item.permission)
            return true
        }))

        // 非响应式默认展示 2 项；响应式且未传时不设上限
        const cap = computed(() => props.showNum ?? (props.responsive ? Number.POSITIVE_INFINITY : 2))

        const visibleCount = computed(() => {
            const limit = Math.min(cap.value, allowedItems.value.length)
            if (limit <= 0) return 0
            if (!props.responsive) return limit
            return Math.max(0, Math.min(limit, fitCount.value))
        })

        const visibleItems = computed(() => allowedItems.value.slice(0, visibleCount.value))
        const overflowItems = computed(() => allowedItems.value.slice(visibleCount.value))
        const shouldMeasure = computed(() => props.responsive && allowedItems.value.length > 0)

        const confirmContent = computed(() => {
            const item = confirmItem.value
            if (!item) return ''
            return item.confirmContent || `确认执行「${item.label}」操作？`
        })

        const confirmType = computed(() => confirmItem.value?.variant === 'error' ? 'error' : 'warning')

        function measure() {
            if (!props.responsive) return
            const root = rootRef.value
            const row = measureRef.value
            if (!root || !row) return

            const containerWidth = root.clientWidth
            if (!containerWidth) return

            const children = Array.from(row.children) as HTMLElement[]
            if (!children.length) {
                fitCount.value = 0
                return
            }

            const moreWidth = children[children.length - 1].getBoundingClientRect().width
            const widths = children.slice(0, -1).map(el => el.getBoundingClientRect().width)

            fitCount.value = computeVisibleCount({
                widths,
                moreWidth,
                containerWidth,
                gap: GAP,
                cap: cap.value,
            })
        }

        function scheduleMeasure() {
            if (!props.responsive) return
            if (measureFrame) cancelAnimationFrame(measureFrame)
            nextTick(() => {
                measureFrame = requestAnimationFrame(() => {
                    measureFrame = 0
                    measure()
                })
            })
        }

        function focusFirstMenuItem() {
            panelRef.value
                ?.querySelector<HTMLElement>('[role="menuitem"]:not([disabled])')
                ?.focus()
        }

        function focusMoreTrigger() {
            (moreTriggerRef.value?.$el as HTMLElement | undefined)?.focus()
        }

        function handlePopoverShow(value: boolean) {
            popoverShow.value = value
            if (value) {
                nextTick(() => requestAnimationFrame(focusFirstMenuItem))
            }
        }

        function closePopover(returnFocus = false) {
            popoverShow.value = false
            if (returnFocus) {
                nextTick(() => requestAnimationFrame(focusMoreTrigger))
            }
        }

        function executeItem(item: ActionButtonItem, event?: MouseEvent) {
            item.onClick?.(item, event)
            emit('click', item, event)
        }

        function handleItemClick(item: ActionButtonItem, event?: MouseEvent) {
            if (item.disabled) return
            if (item.confirm) {
                confirmItem.value = item
                confirmShow.value = true
                return
            }
            executeItem(item, event)
        }

        function handleOverflowClick(item: ActionButtonItem, event?: MouseEvent) {
            closePopover()
            handleItemClick(item, event)
        }

        function handleConfirmPositive() {
            const item = confirmItem.value
            confirmResolved = true
            confirmShow.value = false
            confirmItem.value = null
            if (item) executeItem(item)
            nextTick(() => {
                confirmResolved = false
            })
        }

        function handleConfirmNegative() {
            const item = confirmItem.value
            confirmResolved = true
            confirmShow.value = false
            confirmItem.value = null
            if (item) emit('cancel', item)
            nextTick(() => {
                confirmResolved = false
            })
        }

        function handleConfirmShow(value: boolean) {
            if (value) {
                confirmShow.value = true
                return
            }
            if (confirmResolved) {
                confirmResolved = false
                return
            }
            // Esc、遮罩等非按钮触发的关闭按取消处理
            const item = confirmItem.value
            confirmShow.value = false
            confirmItem.value = null
            if (item) emit('cancel', item)
        }

        function handleMenuKeydown(event: KeyboardEvent) {
            const buttons = Array.from(
                panelRef.value?.querySelectorAll<HTMLButtonElement>('button[role="menuitem"]:not([disabled])') ?? []
            )
            if (!buttons.length) {
                if (event.key === 'Escape') closePopover(true)
                return
            }

            const active = document.activeElement as HTMLElement | null
            const current = buttons.indexOf(active as HTMLButtonElement)

            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault()
                    buttons[(current + 1 + buttons.length) % buttons.length].focus()
                    break
                case 'ArrowUp':
                    event.preventDefault()
                    buttons[(current - 1 + buttons.length) % buttons.length].focus()
                    break
                case 'Home':
                    event.preventDefault()
                    buttons[0].focus()
                    break
                case 'End':
                    event.preventDefault()
                    buttons[buttons.length - 1].focus()
                    break
                case 'Escape':
                    event.preventDefault()
                    closePopover(true)
                    break
            }
        }

        onMounted(() => {
            if (typeof ResizeObserver !== 'undefined' && rootRef.value) {
                resizeObserver = new ResizeObserver(scheduleMeasure)
                resizeObserver.observe(rootRef.value)
            }
            scheduleMeasure()
            document.fonts?.ready.then(scheduleMeasure).catch(() => {})
        })

        onBeforeUnmount(() => {
            resizeObserver?.disconnect()
            resizeObserver = null
            if (measureFrame) cancelAnimationFrame(measureFrame)
        })

        watch(
            () => [props.items, props.showNum, props.size, props.responsive, props.permissions, props.hasPermission],
            () => scheduleMeasure(),
            { deep: true }
        )

        return () => (
            <div
                ref={rootRef}
                class={[
                    'relative flex gap-0.5 items-center',
                    {
                        'justify-start': props.align === 'left',
                        'justify-center': props.align === 'center',
                        'justify-end': props.align === 'right',
                    }
                ]}
            >
                {shouldMeasure.value && (
                    <div class="absolute left-0 top-0 w-0 h-0 overflow-hidden" aria-hidden="true">
                        <div
                            ref={measureRef}
                            class="flex w-max gap-0.5 items-center invisible pointer-events-none"
                        >
                            {allowedItems.value.map(item => (
                                <ActionButton
                                    key={item.key}
                                    type={item.variant}
                                    size={props.size}
                                    disabled={item.disabled}
                                    icon={item.icon}
                                    class="shrink-0 whitespace-nowrap"
                                >
                                    {item.label}
                                </ActionButton>
                            ))}
                            <NButton
                                size={props.size}
                                ghost
                                focusable={false}
                                class="shrink-0"
                            >
                                {props.moreIcon
                                    ? <Icon icon={props.moreIcon} class="text-[16px]" />
                                    : <BmIconMoreHorizontal class="text-[16px]" />}
                            </NButton>
                        </div>
                    </div>
                )}

                {visibleItems.value.map(item => (
                    <ActionButton
                        key={item.key}
                        type={item.variant}
                        size={props.size}
                        disabled={item.disabled}
                        icon={item.icon}
                        class="shrink-0 whitespace-nowrap"
                        onClick={(event: MouseEvent) => handleItemClick(item, event)}
                    >
                        {item.label}
                    </ActionButton>
                ))}

                {overflowItems.value.length > 0 && (
                    <NPopover
                        trigger="click"
                        placement="bottom-end"
                        show={popoverShow.value}
                        onUpdateShow={handlePopoverShow}
                    >
                        {{
                            trigger: () => (
                                <NButton
                                    ref={moreTriggerRef}
                                    size={props.size}
                                    ghost
                                    class="shrink-0"
                                    aria-label={props.moreLabel}
                                    aria-haspopup="menu"
                                    aria-expanded={popoverShow.value}
                                >
                                    {props.moreIcon
                                        ? <Icon icon={props.moreIcon} class="text-[16px]" />
                                        : <BmIconMoreHorizontal class="text-[16px]" />}
                                </NButton>
                            ),
                            default: () => slots.overflow
                                ? slots.overflow({
                                    items: overflowItems.value,
                                    close: () => closePopover(true),
                                })
                                : (
                                    <div
                                        ref={panelRef}
                                        role="menu"
                                        aria-label={props.moreLabel}
                                        class="flex min-w-[120px] flex-col gap-0.5"
                                        onKeydown={handleMenuKeydown}
                                    >
                                        {overflowItems.value.map(item => (
                                            <ActionButton
                                                key={item.key}
                                                type={item.variant}
                                                size={props.size}
                                                disabled={item.disabled}
                                                icon={item.icon}
                                                menuItem
                                                block
                                                class="whitespace-nowrap"
                                                onClick={(event: MouseEvent) => handleOverflowClick(item, event)}
                                            >
                                                {item.label}
                                            </ActionButton>
                                        ))}
                                    </div>
                                ),
                        }}
                    </NPopover>
                )}

                <NModal
                    show={confirmShow.value}
                    preset="dialog"
                    type={confirmType.value}
                    title={props.confirmTitle}
                    content={confirmContent.value}
                    positiveText="确认"
                    negativeText="取消"
                    onPositiveClick={handleConfirmPositive}
                    onNegativeClick={handleConfirmNegative}
                    onUpdateShow={handleConfirmShow}
                />
            </div>
        )
    }
})
