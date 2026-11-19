import { Teleport, computed, defineComponent, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import type { PropType } from 'vue'
import type { ContextMenuCommand } from './types'

export interface ContextMenuItem {
    command: ContextMenuCommand
    label: string
    disabled?: boolean
}

export default defineComponent({
    name: 'ProTabsContextMenu',
    props: {
        x: { type: Number, required: true },
        y: { type: Number, required: true },
        items: { type: Array as PropType<ContextMenuItem[]>, default: () => [] },
    },
    emits: ['select', 'close'],
    setup(props, { emit }) {
        const rootRef = ref<HTMLElement | null>(null)
        const position = ref({ left: props.x, top: props.y })
        const activeIndex = ref(-1)

        const enabledIndexes = computed(() =>
            props.items.map((item, index) => (item.disabled ? -1 : index)).filter(index => index >= 0)
        )

        const focusAt = (index: number) => {
            activeIndex.value = index
            nextTick(() => {
                const buttons = rootRef.value?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')
                buttons?.[index]?.focus()
            })
        }

        const focusFirst = () => {
            if (enabledIndexes.value.length) focusAt(enabledIndexes.value[0])
        }

        const move = (delta: number) => {
            const list = enabledIndexes.value
            if (!list.length) return
            const current = list.indexOf(activeIndex.value)
            const next = list[(current + delta + list.length) % list.length]
            focusAt(next)
        }

        const jump = (edge: -1 | 1) => {
            const list = enabledIndexes.value
            if (!list.length) return
            focusAt(edge === -1 ? list[0] : list[list.length - 1])
        }

        const close = () => emit('close')

        const onPointerDown = (event: PointerEvent) => {
            if (rootRef.value && !rootRef.value.contains(event.target as Node)) close()
        }

        const onKeydown = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault()
                    move(1)
                    break
                case 'ArrowUp':
                    event.preventDefault()
                    move(-1)
                    break
                case 'Home':
                    event.preventDefault()
                    jump(-1)
                    break
                case 'End':
                    event.preventDefault()
                    jump(1)
                    break
                case 'Escape':
                    event.preventDefault()
                    event.stopPropagation()
                    close()
                    break
                case 'Tab':
                    close()
                    break
            }
        }

        onMounted(() => {
            nextTick(() => {
                const el = rootRef.value
                if (el) {
                    const rect = el.getBoundingClientRect()
                    const maxLeft = Math.max(4, window.innerWidth - rect.width - 4)
                    const maxTop = Math.max(4, window.innerHeight - rect.height - 4)
                    position.value = {
                        left: Math.min(Math.max(4, props.x), maxLeft),
                        top: Math.min(Math.max(4, props.y), maxTop),
                    }
                }
                focusFirst()
                document.addEventListener('pointerdown', onPointerDown, true)
                window.addEventListener('scroll', close, true)
                window.addEventListener('resize', close)
                window.addEventListener('blur', close)
            })
        })

        onBeforeUnmount(() => {
            document.removeEventListener('pointerdown', onPointerDown, true)
            window.removeEventListener('scroll', close, true)
            window.removeEventListener('resize', close)
            window.removeEventListener('blur', close)
        })

        return () => (
            <Teleport to="body">
                <div
                    ref={rootRef}
                    data-pro-tabs-menu=""
                    role="menu"
                    tabindex={-1}
                    style={{ left: `${position.value.left}px`, top: `${position.value.top}px` }}
                    class="fixed z-[1000] min-w-[168px] rounded-[4px] border border-[var(--color-divider,#dfdacc)] bg-[var(--color-surface,#faf8f3)] py-1 shadow-lg outline-none"
                    onKeydown={onKeydown}
                    onContextmenu={(event: MouseEvent) => event.preventDefault()}
                >
                    {props.items.map((item, index) => (
                        <button
                            key={item.command}
                            type="button"
                            role="menuitem"
                            disabled={item.disabled}
                            tabindex={activeIndex.value === index ? 0 : -1}
                            class="flex w-full cursor-pointer items-center px-3 py-1.5 text-left text-sm text-[var(--color-foreground,#1c1a15)] outline-none hover:bg-[var(--color-hover,rgba(240,78,35,0.05))] focus-visible:bg-[var(--color-hover,rgba(240,78,35,0.05))] disabled:cursor-not-allowed disabled:opacity-40"
                            onClick={() => emit('select', item.command)}
                            onMouseenter={() => { if (!item.disabled) activeIndex.value = index }}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </Teleport>
        )
    },
})