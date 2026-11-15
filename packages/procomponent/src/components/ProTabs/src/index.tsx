import { computed, ref, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { cn } from '@/utils'
import { proTabsEmits, proTabsProps } from './types'
import type { TabOption } from './types'

export default defineComponent({
    name: 'ProTabs',
    props: proTabsProps,
    emits: proTabsEmits,
    setup(props, { slots, emit }) {
        const innerActive = ref(props.defaultActive || props.options[0]?.key || '')
        const currentActive = computed(() => props.active || innerActive.value)

        // 非受控下选中项消失时落到最后一个仍存在的页签；从未选中过（如 options 异步到达）则取第一项
        watch(() => props.options, (options) => {
            if (props.active) return
            if (options.some(option => option.key === innerActive.value)) return
            innerActive.value = (innerActive.value ? options[options.length - 1] : options[0])?.key ?? ''
        })

        const select = (option: TabOption) => {
            if (option.disabled) return
            innerActive.value = option.key
            emit('update:active', option.key)
        }

        const renderContent = (option: TabOption) => {
            const custom = option.render?.(option) ?? props.render?.(option)
            if (custom) return custom
            const icon = option.icon || props.icon
            return (
                <>
                    {icon && <Icon icon={icon} class="text-[16px] shrink-0" />}
                    <span class="truncate">{option.label}</span>
                    {props.showBadge && option.dot !== undefined && (
                        <span class="ml-1 min-w-[18px] h-[18px] px-1 rounded-full text-[11px] leading-[18px] text-center text-white bg-[var(--color-accent,#f04e23)]">
                            {option.dot}
                        </span>
                    )}
                </>
            )
        }

        const renderTab = (option: TabOption) => {
            const active = currentActive.value === option.key
            const isLine = props.type === 'line'
            return (
                <div
                    key={option.key}
                    role="tab"
                    aria-selected={active}
                    aria-disabled={option.disabled}
                    tabindex={option.disabled ? -1 : 0}
                    class={cn(
                        'relative flex items-center gap-1.5 shrink-0 px-3 text-sm cursor-pointer select-none transition-colors',
                        isLine ? 'self-stretch' : 'h-8',
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
                    onKeydown={(event: KeyboardEvent) => {
                        if (event.key !== 'Enter' && event.key !== ' ') return
                        event.preventDefault()
                        select(option)
                    }}
                >
                    {renderContent(option)}
                    {props.closable && (
                        <button
                            type="button"
                            aria-label={`close ${option.label}`}
                            class="ml-1 flex items-center opacity-60 hover:opacity-100 cursor-pointer"
                            onClick={(event: MouseEvent) => {
                                event.stopPropagation()
                                emit('close', option.key)
                            }}
                        >
                            <Icon icon="hugeicons:cancel-01" class="text-[14px]" />
                        </button>
                    )}
                    {isLine && active && (
                        <span class="absolute left-0 right-0 bottom-0 h-[2px] bg-[var(--color-accent,#f04e23)]" />
                    )}
                </div>
            )
        }

        return () => (
            <div class={cn('relative flex w-full', props.class)} style={props.style}>
                <div
                    role="tablist"
                    class={cn(
                        'flex items-center gap-1 flex-1 min-w-0 min-h-[40px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
                        props.type === 'card'
                            ? 'bg-[var(--color-fill,#ece8de)]'
                            : 'border-b border-[var(--color-divider,#dfdacc)]',
                        props.inset ? 'px-1' : 'px-0',
                        props.type === 'card' && (props.rounded ? 'rounded-full' : 'rounded-[2px]')
                    )}
                >
                    {props.options.map(renderTab)}
                    {slots.default?.()}
                </div>
            </div>
        )
    }
})