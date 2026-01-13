import { NButton, NPopconfirm } from "naive-ui"
import { actionButtonEmits, actionButtonProps } from "./types"

export default defineComponent({
    name: 'ActionButton',
    props: actionButtonProps,
    emits: actionButtonEmits,
    setup(props, { emit, slots }) {
        const { disabled, type, confirm, confirmContent, size } = props
        
        if (confirm) {
            return () => (
                <NPopconfirm
                    onPositiveClick={() => emit('click')}
                    onNegativeClick={() => emit('cancel')}
                >
                    {{
                        trigger: () => (
                            <NButton quaternary size={size} disabled={disabled} type={type}>
                                {slots.default?.()}
                            </NButton>
                        ),
                        default: () => confirmContent
                    }}
                </NPopconfirm>
            )
        }

        return () => (
            <NButton quaternary size={size} disabled={disabled} type={type}>
               {slots.default?.()}
            </NButton>
        )
    }
})