// import type { ProTextProps } from './types'
import { Icon } from '@iconify/vue'
import { useClipboard } from '@vueuse/core'
import { NText, NTooltip } from 'naive-ui'
import { computed, defineComponent, Fragment, ref, toRef } from 'vue'
import TextClamp from 'vue3-text-clamp'

import './index.scss'

export default defineComponent({
  name: 'ProText',
  components: {
    Icon,
    NText,
    NTooltip,
    TextClamp,
  },
  props: {
    text: {
      type: String,
      default: '',
    },
    copyable: {
      type: Boolean,
      default: false,
    },
    ellipsis: {
      type: Boolean,
      default: false,
    },
    lineClamp: {
      type: [Number, String],
      default: 1,
    },
  },
  setup(props, { attrs }) {
    const defaultColor = ref('#3b82f6')
    const copiedColor = ref('#22c55e')

    const ellipsis = computed(() => props.ellipsis !== false)
    const copyable = computed(() => props.copyable !== false)
    const maxLines = computed(() => props.lineClamp)

    const bmIconStyle = computed(() => ({
      display: 'inline-block',
      verticalAlign: 'middle',
      cursor: 'pointer',
    }))

    const text = toRef(props, 'text')
    const { text: _clipboardText, copy, copied } = useClipboard({ legacy: true })

    const isCopied = ref(false)

    function handleCopy() {
      if (!text.value.toString()) {
        return
      }

      copy(text.value.toString())

      isCopied.value = true
      setTimeout(() => {
        isCopied.value = false
      }, 2500)
    }

    return () => {
      if (ellipsis.value) {
        return (
          <NTooltip trigger="hover">
            {{
              trigger: () => (
                <TextClamp max-lines={maxLines.value} text={props.text}>
                  {{
                    after: () => {
                      return copyable.value && (
                        <div
                          style={{
                            ...bmIconStyle.value,
                          }}
                          onClick={handleCopy}
                        >
                          <Icon
                            style={{
                              color: copied.value ? copiedColor.value : defaultColor.value,
                            }}
                            icon={`ant-design:${isCopied.value ? 'check' : 'copy'}-outlined`}
                          />
                        </div>
                      )
                    },
                  }}
                </TextClamp>
              ),
              default: () => (
                <div style="max-width: 300px">
                  <span>{props.text}</span>
                </div>
              ),
            }}
          </NTooltip>
        )
      }
      else {
        return (
          <Fragment>
            <NText {...attrs}>
              {props.text}
            </NText>
            {copyable.value && (
              <div
                style={{
                  ...bmIconStyle.value,
                }}
                onClick={handleCopy}
              >
                <Icon
                  style={{
                    color: copied.value ? copiedColor.value : defaultColor.value,
                  }}
                  icon={`ant-design:${isCopied.value ? 'check' : 'copy'}-outlined`}
                />
              </div>
            )}
          </Fragment>
        )
      }
    }
  },
})
