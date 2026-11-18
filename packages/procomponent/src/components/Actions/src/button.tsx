import { NButton } from "naive-ui"
import { Icon } from "@iconify/vue"
import { actionButtonEmits, actionButtonProps } from "./types"

export default defineComponent({
    name: 'ActionButton',
    props: actionButtonProps,
    emits: actionButtonEmits,
    setup(props, { emit, slots }) {
        return () => (
            <NButton
                {...({ role: props.menuItem ? 'menuitem' : undefined } as any)}
                quaternary
                size={props.size}
                disabled={props.disabled}
                type={props.type}
                block={props.block}
                style={props.menuItem ? { justifyContent: 'flex-start' } : undefined}
                renderIcon={props.icon
                    ? () => <Icon icon={props.icon} class="text-[16px]" />
                    : undefined}
                onClick={(event: MouseEvent) => emit('click', event)}
            >
                {slots.default?.()}
            </NButton>
        )
    }
})
