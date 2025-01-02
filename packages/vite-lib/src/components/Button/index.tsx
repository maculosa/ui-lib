import { computed, defineComponent } from "vue"
import styles from "./styles/index.module.css"

export default defineComponent({
  name: "Button",
  props: {
    label: {
      type: String,
      default: "Button",
    },
    size: {
      type: String,
      default: "medium",
    },
    type: {
      type: String,
      default: "info",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["click"],
  setup(props, { emit, slots }) {
    const handleClick = () => {
      emit("click")
    }

    const btnType = computed(() => {
      return styles[`btn-${props.type}`]
    })

    const btnSize = computed(() => {
      return styles[`btn-${props.size}`]
    })
  
    const children = slots.default?.() || undefined
    return () => (
        <button type="button" disabled={props.disabled}
            onClick={handleClick}
            class={[styles.btn, btnType.value, btnSize.value ]}
        >
            {children}
        </button>
    )
  },
})
