import { useClipboard } from '@vueuse/core'
import { NText, NTooltip } from 'naive-ui'
import { computed, defineComponent, Fragment, ref, toRef } from 'vue'
import TextClamp from 'vue3-text-clamp'

import { textProps } from './types'

import './index.scss'

export default defineComponent({
  name: 'ProText',
  components: {
    NText,
    NTooltip,
    TextClamp,
  },
  props: textProps,
  setup(props, { attrs }) {
    // const defaultColor = ref('#3b82f6')
    // const copiedColor = ref('#22c55e')

    const ellipsis = computed(() => props.ellipsis !== false)
    const copyable = computed(() => props.copyable !== false)
    const maxLines = computed(() => props.lineClamp)

    const bmIconStyle = computed(() => ({
      display: 'inline-block',
      verticalAlign: 'middle',
      cursor: 'pointer',
    }))

    const text = toRef(props, 'text')
    const { text: _clipboardText, copy } = useClipboard({ legacy: true })

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
                          {
                            isCopied.value ? <bm-check class="text-green-500" /> : <bm-copy class="text-blue-500" />
                          }
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
                {
                  isCopied.value ? <bm-check class="text-green-500" /> : <bm-copy class="text-blue-500" />
                }
              </div>
            )}
          </Fragment>
        )
      }
    }
  },
})
