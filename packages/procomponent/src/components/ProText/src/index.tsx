import { useClipboard } from '@vueuse/core'
import { NText, NTooltip } from 'naive-ui'
import { computed, defineComponent, ref, toRef } from 'vue'
import TextClamp from 'vue3-text-clamp'
import BmIconCopy from '~icons/bm-icon/copy'
import BmIconCheck from '~icons/bm-icon/check'

import { textProps } from './types'

import './styles/css'

const ProTextIcon = defineComponent({
  name: 'ProTextIcon',
  props: {
    copied: {
      type: Boolean,
      default: false,
    }
  },
  setup(props) {
    
    return () => {
      if (props.copied) {
        return <BmIconCheck style="color: #22c55e; font-size: 18px;" />
      } else {
        return <BmIconCopy style="color: #3b82f6; font-size: 18px;" />
      }
    }
  }
})

export default defineComponent({
  name: 'ProText',
  components: {
    NText,
    NTooltip,
    TextClamp,
  },
  props: textProps,
  setup(props, { attrs }) {
    const ellipsis = computed(() => props.ellipsis !== false)
    const copyable = computed(() => props.copyable !== false)
    const maxLines = computed(() => props.lineClamp)

    const bmIconStyle = {
      display: 'inline-block',
      verticalAlign: 'inherit',
      cursor: 'pointer',
    }

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
                        <span
                          style={{
                            ...bmIconStyle,
                          }}
                          onClick={handleCopy}
                        >
                          <ProTextIcon copied={isCopied.value} />
                        </span>
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
          <span>
            <NText {...attrs}>
              {props.text}
            </NText>
            {copyable.value && (
              <span
                style={{
                  ...bmIconStyle,
                }}
                onClick={handleCopy}
              >
                <ProTextIcon copied={isCopied.value} />
              </span>
            )}
          </span>
        )
      }
    }
  },
})
