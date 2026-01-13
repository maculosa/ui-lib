import { actionsEmits, actionsProps } from "./types"
import ActionButton from './button'
import { NButton, NDropdown, type DropdownOption } from "naive-ui"
import BmIconMoreHorizontal from '~icons/bm-icon/more-horizontal'

export default defineComponent({
    name: 'Actions',
    props: actionsProps,
    emits: actionsEmits,
    setup(props) {
        const { items, showNum, align } = props

        // 可见项
        const visibleItems = computed(() => items.slice(0, showNum))
        // 不可见项
        const collapseItems = computed(() => items.slice(showNum).map(item => ({
            label: item.label,
            key: item.key,
            variant: item.variant,
            disabled: item.disabled,
            onClick: item.onClick
        })))

        return () => (
            <div
                class={[
                    'flex gap-0.5 items-center justify-center',
                    {
                        'justify-start': align === 'left',
                        'justify-end': align === 'right',
                    }
                ]}
            >
                {visibleItems.value.map((item, index) => (
                    <ActionButton
                        key={index}
                        type={item.variant}
                        disabled={item.disabled}
                        onClick={() => item.onClick?.()}
                    >
                        {item.label}
                    </ActionButton>
                ))}
                {collapseItems.value.length > 0 && (
                    <NDropdown trigger="click"
                    options={collapseItems.value}
                    renderLabel={(option: DropdownOption) => {
                        return (
                            <div class={
                                [
                                    {
                                        'text-red-500' : option.variant === 'error',
                                    }
                                ]
                            }>
                                {option.label}
                            </div>
                        )
                    }}
                    onSelect={(key: string | number) => {
                        const item = collapseItems.value.find(item => item.key === key)
                        item?.onClick?.()
                    }}
                >
                    <NButton size="medium" ghost>
                        <BmIconMoreHorizontal
                            class="text-16px"
                        />
                    </NButton>
                </NDropdown>)}
            </div>
        )
    }
})