import { defineComponent } from "vue";

export default defineComponent({
    name: 'Tour',
    props: {
        steps: {
            type: Array,
            default: () => []
        },
        defaultActive: {
            type: Number,
            default: 0
        },
        onChange: {
            type: Function,
            default: () => { }
        },
        onFinish: {
            type: Function,
            default: () => { }
        },
        onClose: {
            type: Function,
           default: () => { }
        }
    },
    setup() {
        return () => (
            <div>
                Tour
            </div>
        )
    }
})