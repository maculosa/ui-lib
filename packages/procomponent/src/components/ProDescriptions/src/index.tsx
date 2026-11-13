import { NDescriptions, NDescriptionsItem } from 'naive-ui'
import { computed, defineComponent } from 'vue'
import { proDescriptionsProps } from './types'

export default defineComponent({
  name: 'ProDescriptions',
  props: proDescriptionsProps,
  setup(props) {
    const descriptionsPassThrough = computed(() => {
      const { data, columns, ...rest } = props
      return rest
    })

    return () => (
      <NDescriptions {...descriptionsPassThrough.value}>
        {props.columns.map((item) => {
          if (item && item.render) {
            return (
              <NDescriptionsItem
                key={item.key}
                label={item.title}
                span={item.span}
              >
                {item.render(props.data[item.key])}
              </NDescriptionsItem>
            )
          }
          else {
            return (
              <NDescriptionsItem
                key={item.key}
                label={item.title}
                span={item.span}
              >
                {props.data[item.key]}
              </NDescriptionsItem>
            )
          }
        })}
      </NDescriptions>
    )
  },
})
