import { computed, defineComponent, ref } from 'vue'
import type { PropType } from 'vue'
import { NButton, NDivider, NPopover, NTooltip, useThemeVars } from 'naive-ui'
import BmIconSort from '~icons/bm-icon/sort'
import BmIconCheck from '~icons/bm-icon/check'

/** 工具栏排序状态:key 为列 key,order 与 NDataTable 的排序方向保持一致 */
export interface ToolbarSortState {
  key: string
  order: 'ascend' | 'descend'
}

/** 「综合排序」选项的占位 key,选中表示清除排序、按数据原始顺序展示 */
const DEFAULT_SORT_KEY = '__default-sort__'

/** 排序方向选项 */
const ORDER_OPTIONS = [
  { label: '升序', value: 'ascend' as const },
  { label: '降序', value: 'descend' as const },
]

/**
 * 工具栏排序按钮
 * 弹层内直接铺开「综合排序」+ 全部可排序列,选中项以对号标记,点击即生效;
 * 下方为升序 / 降序方向选择,列较多时字段区域内部滚动。
 */
export default defineComponent({
  name: 'SortButton',
  props: {
    /** 可排序列,元素需包含 key 与 title */
    columns: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    /** 当前排序状态,null 表示未排序 */
    value: {
      type: Object as PropType<ToolbarSortState | null>,
      default: null,
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const themeVars = useThemeVars()
    const show = ref(false)
    /** 当前悬停的选项 key,用于行级 hover 高亮 */
    const hoverKey = ref<string | null>(null)

    const activeColumn = computed(() =>
      props.columns.find(column => column.key === props.value?.key),
    )

    const tooltip = computed(() => {
      if (!props.value || !activeColumn.value) return '排序'
      return `${activeColumn.value.title} ${props.value.order === 'ascend' ? '升序' : '降序'}`
    })

    /**
     * 选择排序字段并立即生效
     * @param key 列 key;等于占位 key 时表示「综合排序」,回传 null 清除排序
     */
    function handleSelectColumn(key: string) {
      if (key === DEFAULT_SORT_KEY) {
        emit('change', null)
        return
      }
      // 点击已选中的列不重复触发请求
      if (props.value?.key === key) return
      // 换列时沿用当前方向,未排序时默认升序
      emit('change', { key, order: props.value?.order ?? 'ascend' })
    }

    /**
     * 选择排序方向并立即生效
     * @param order 升序 / 降序
     */
    function handleSelectOrder(order: ToolbarSortState['order']) {
      if (!props.value || props.value.order === order) return
      emit('change', { key: props.value.key, order })
    }

    /**
     * 渲染分组标题
     * @param text 标题文案
     */
    function renderSectionTitle(text: string) {
      return (
        <div style={{ padding: '4px 8px 6px', fontSize: '12px', color: themeVars.value.textColor3 }}>
          {text}
        </div>
      )
    }

    /**
     * 渲染单行可选项
     * @param label 选项文案
     * @param active 是否选中,选中时展示对号图标
     * @param onClick 点击回调
     * @param disabled 是否禁用(未选字段时方向项禁用)
     * @param optionKey 选项唯一标识,用于 hover 高亮
     */
    function renderOption(
      label: string,
      active: boolean,
      onClick: () => void,
      disabled = false,
      optionKey = label,
    ) {
      const hovered = !disabled && hoverKey.value === optionKey
      return (
        <div
          onClick={disabled ? undefined : onClick}
          onMouseenter={disabled ? undefined : () => { hoverKey.value = optionKey }}
          onMouseleave={disabled ? undefined : () => { hoverKey.value = null }}
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '30px',
            padding: '0 8px',
            borderRadius: '4px',
            fontSize: '13px',
            userSelect: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            color: disabled ? themeVars.value.textColor3 : themeVars.value.textColor1,
            backgroundColor: hovered ? themeVars.value.hoverColor : 'transparent',
            transition: 'background-color .2s',
          }}
        >
          <span style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {label}
          </span>
          {active && (
            <BmIconCheck
              class="text-14px"
              style={{ flexShrink: 0, marginLeft: '8px', color: themeVars.value.primaryColor }}
            />
          )}
        </div>
      )
    }

    return () => (
      <NPopover
        trigger="click"
        placement="bottom-end"
        show={show.value}
        style={{ width: '260px' }}
        onUpdate:show={(visible: boolean) => { show.value = visible }}
      >
        {{
          trigger: () => (
            <NTooltip trigger="hover">
              {{
                trigger: () => (
                  <NButton size="small" quaternary type={props.value ? 'primary' : undefined}>
                    <BmIconSort class="text-16px" />
                  </NButton>
                ),
                default: () => tooltip.value,
              }}
            </NTooltip>
          ),
          default: () => (
            <div style={{ padding: '2px' }}>
              {/* 排序字段:默认「综合排序」+ 全部列,列较多时内部滚动 */}
              {renderSectionTitle('排序字段')}
              <div style={{ maxHeight: '216px', overflowY: 'auto' }}>
                {renderOption('综合排序', !props.value, () => handleSelectColumn(DEFAULT_SORT_KEY), false, DEFAULT_SORT_KEY)}
                {props.columns.map(column =>
                  renderOption(
                    column.title,
                    props.value?.key === column.key,
                    () => handleSelectColumn(column.key),
                    false,
                    column.key,
                  ),
                )}
              </div>
              <NDivider style={{ margin: '6px 0' }} />
              {/* 排序方向:未选字段时禁用 */}
              {renderSectionTitle('排序方向')}
              {ORDER_OPTIONS.map(option =>
                renderOption(
                  option.label,
                  !!props.value && props.value.order === option.value,
                  () => handleSelectOrder(option.value),
                  !props.value,
                  option.value,
                ),
              )}
            </div>
          ),
        }}
      </NPopover>
    )
  },
})
