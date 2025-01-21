import { NDescriptions, NDescriptionsItem } from 'naive-ui'
import { defineComponent } from 'vue'
import { descriptionsProps } from './types'

export default defineComponent({
  name: 'ProDescriptions',
  props: descriptionsProps,
  setup(props) {
    const { data, columns, ...descriptionsProps } = props

    return () => (
      <NDescriptions {...descriptionsProps}>
        {columns.map((item) => {
          if (item && item.render) {
            return (
              <NDescriptionsItem
                key={item.key}
                label={item.title}
                span={item.span}
              >
                {item.render(data[item.key])}
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
                {data[item.key]}
              </NDescriptionsItem>
            )
          }
        })}
      </NDescriptions>
    )
  },
})
