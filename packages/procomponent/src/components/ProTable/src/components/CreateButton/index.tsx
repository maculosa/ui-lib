import { NButton } from 'naive-ui'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CreateButton',
  props: {
    label: {
      type: String,
      default: '新增',
    },
  },
  emits: ['click'],
  setup(props, { emit }) {
    const handleClick = () => {
      emit('click')
    }

    return () => (
      <NButton type="info" size="small" secondary onClick={handleClick}>
        {{
          icon: () => <bm-plus />,
          default: () => props.label,
        }}
      </NButton>
    )
  },
})
