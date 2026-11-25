import { computed, defineComponent } from 'vue'
import { NButton, NTooltip } from 'naive-ui'
import BmIconMaximize from '~icons/bm-icon/maximize'
import BmIconMinimize from '~icons/bm-icon/minimize'

/**
 * 全屏切换按钮
 * 仅负责展示当前状态并抛出点击事件,真正的放大/还原由 ProTable 控制
 */
export default defineComponent({
  name: 'FullscreenButton',
  props: {
    /** 当前是否处于放大状态 */
    active: {
      type: Boolean,
      default: false,
    },
    /** 自定义提示文案,不传时按状态取默认文案 */
    label: {
      type: String,
      default: '',
    },
  },
  emits: ['click'],
  setup(props, { emit }) {
    /** 提示文案:放大中提示「还原」,否则提示「全屏」 */
    const tooltip = computed(() => props.label || (props.active ? '还原' : '全屏'))

    return () => (
      <NTooltip trigger="hover">
        {{
          trigger: () => (
            <NButton size="small" quaternary onClick={() => emit('click')}>
              {props.active
                ? <BmIconMinimize class="text-16px" />
                : <BmIconMaximize class="text-16px" />}
            </NButton>
          ),
          default: () => tooltip.value,
        }}
      </NTooltip>
    )
  },
})
