import type { PropType } from 'vue'
import type {
  LiteFilterColumn,
  LiteFilterFieldScope,
  LiteFilterProps,
  LiteFilterValueType,
} from './types'
import {
  NButton,
  NCard,
  NForm,
  NFormItem,
  NPopover,
  NSpace,
  NTooltip,
} from 'naive-ui'
import { cloneDeep } from 'lodash-es'
import { computed, defineComponent, onBeforeUnmount, onMounted, nextTick, ref, watch } from 'vue'
import BmIconInfoCircle from '~icons/bm-icon/info-circle'
import BmIconRefresh from '~icons/bm-icon/refresh'
import BmIconSearch from '~icons/bm-icon/search'
import BmIconArrowDown from '~icons/bm-icon/arrow-down'
import BmIconArrowUp from '~icons/bm-icon/arrow-up'
import {
  createFieldModel,
  getInitialValue,
  orderSearchColumns,
  renderFieldControl,
  useFieldOptions,
} from '../../shared/field'

import './styles/css'

const fieldWidthMaps: Partial<Record<LiteFilterValueType, number>> = {
  text: 180,
  autoComplete: 180,
  dynamicTags: 220,
  select: 160,
  cascader: 160,
  treeSelect: 160,
  date: 150,
  dateRange: 260,
  time: 140,
  digit: 140,
  colorPicker: 120,
}

const rowHeightMaps = {
  small: 34,
  medium: 40,
  large: 46,
} as const

const ADVANCED_POPOVER_WIDTH = 280

function toCssSize(value: number | string | undefined) {
  if (typeof value === 'number')
    return `${value}px`

  return value || undefined
}

function resolveFieldWidth(column: LiteFilterColumn) {
  const fromProps = toCssSize(column.formItemProps?.style?.width)
  if (fromProps)
    return fromProps

  const fromColumn = toCssSize(column.width)
  if (fromColumn)
    return fromColumn

  const preset = fieldWidthMaps[column.valueType]

  return preset ? `${preset}px` : undefined
}

function pickFormProps(config: LiteFilterProps['formConfig']) {
  return { ...(config ?? {}) }
}

export default defineComponent({
  name: 'LiteFilter',
  props: {
    columns: {
      type: Array as PropType<LiteFilterColumn[]>,
      default: () => [],
    },
    defaultValue: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
    formConfig: {
      type: Object as PropType<LiteFilterProps['formConfig']>,
      default: () => ({}),
    },
    card: {
      type: Boolean,
      default: false,
    },
    defaultCollapsed: {
      type: Boolean,
      default: true,
    },
    collapsedRows: {
      type: Number,
      default: 1,
    },
    collapsed: {
      type: Boolean,
      default: undefined,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    beforeSearch: {
      type: Function as PropType<LiteFilterProps['beforeSearch']>,
      default: undefined,
    },
    searchText: {
      type: String,
      default: '查询',
    },
    resetText: {
      type: String,
      default: '重置',
    },
    expandText: {
      type: String,
      default: '展开',
    },
    collapseText: {
      type: String,
      default: '折叠',
    },
    showResetButton: {
      type: Boolean,
      default: true,
    },
    showSearchButton: {
      type: Boolean,
      default: false,
    },
    searchDebounce: {
      type: Number,
      default: 300,
    },
    showAdvancedButton: {
      type: Boolean,
      default: true,
    },
    searchOnReset: {
      type: Boolean,
      default: false,
    },
    showLabel: {
      type: Boolean,
      default: false,
    },
    advancedPopover: {
      type: Boolean,
      default: true,
    },
    advancedText: {
      type: String,
      default: '高级筛选',
    },
    gap: {
      type: Number,
      default: 12,
    },
  },
  emits: [
    'search',
    'reset',
    'update:collapsed',
    'options-loaded',
    'options-error',
  ],
  setup(props, { emit, expose, slots }) {
    const controlSize = computed(() => props.formConfig?.size ?? 'small')
    const collapsedRows = computed(() => Math.max(1, props.collapsedRows ?? 1))
    const collapsed = ref(props.collapsed ?? props.defaultCollapsed)
    const advancedVisible = ref(false)
    const rowRef = ref<HTMLElement>()
    const overflowing = ref(false)

    const collapsedHeight = computed(() => {
      const height = rowHeightMaps[controlSize.value as keyof typeof rowHeightMaps] ?? rowHeightMaps.small

      return collapsedRows.value * height + (collapsedRows.value - 1) * props.gap
    })

    function measure() {
      const row = rowRef.value
      if (!row)
        return
      overflowing.value = row.scrollHeight > collapsedHeight.value + 1
    }

    let observer: ResizeObserver | undefined

    onMounted(() => {
      measure()
      if (typeof ResizeObserver !== 'undefined' && rowRef.value) {
        observer = new ResizeObserver(() => measure())
        observer.observe(rowRef.value)
      }
    })

    onBeforeUnmount(() => {
      observer?.disconnect()
      observer = undefined
      clearTimeout(debounceTimer)
    })

    const sortedColumns = computed(() => orderSearchColumns(props.columns))
    const advancedColumns = computed(() =>
      props.advancedPopover ? sortedColumns.value.filter(column => column.advanced) : [],
    )
    const mainColumns = computed(() =>
      sortedColumns.value.filter(column => !(props.advancedPopover && column.advanced)),
    )
    const showAdvanced = computed(() => props.showAdvancedButton && overflowing.value)

    watch(
      () => [props.columns, props.gap, props.collapsedRows, props.showLabel, controlSize.value, props.advancedPopover],
      () => {
        void nextTick(measure)
      },
      { deep: true },
    )

    watch(
      () => props.collapsed,
      (value) => {
        if (typeof value === 'boolean')
          collapsed.value = value
      },
    )

    watch(
      () => props.advancedPopover,
      () => {
        advancedVisible.value = false
      },
    )

    function toggleCollapsed(force?: boolean) {
      const next = typeof force === 'boolean' ? force : !collapsed.value
      if (next === collapsed.value)
        return
      collapsed.value = next
      emit('update:collapsed', next)
    }

    function createFormData() {
      return createFieldModel(props.columns, props.defaultValue)
    }

    const searchFormData = ref(createFormData())

    watch(
      () => props.defaultValue,
      (value) => {
        if (value && typeof value === 'object')
          searchFormData.value = { ...searchFormData.value, ...value }
      },
      { deep: true },
    )

    function getValues() {
      return cloneDeep(searchFormData.value)
    }

    function setFieldValue(key: string, value: any) {
      searchFormData.value[key] = value
    }

    const pending = ref(false)
    const isLoading = computed(() => props.loading || pending.value)

    async function handleSearch() {
      if (pending.value)
        return

      const values = getValues()
      if (props.beforeSearch) {
        pending.value = true
        try {
          const allowed = await props.beforeSearch(values)
          if (allowed === false)
            return
        }
        catch (error) {
          console.error('LiteFilter beforeSearch failed:', error)
          return
        }
        finally {
          pending.value = false
        }
      }

      emit('search', values)
    }

    function handleReset() {
      searchFormData.value = createFormData()
      emit('reset', getValues())
      if (props.searchOnReset)
        void handleSearch()
    }

    function resetAdvancedFields() {
      advancedColumns.value.forEach((column) => {
        searchFormData.value[column.key] = props.defaultValue?.[column.key] ?? getInitialValue(column)
      })
      emit('reset', getValues())
      if (props.searchOnReset)
        void handleSearch()
    }

    let debounceTimer: ReturnType<typeof setTimeout> | undefined

    watch(
      searchFormData,
      () => {
        if (props.showSearchButton)
          return

        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
          void handleSearch()
        }, Math.max(0, props.searchDebounce ?? 300))
      },
      { deep: true },
    )

    const { optionsLoading, refreshOptions, getColumnOptions } = useFieldOptions(
      () => props.columns,
      {
        label: 'LiteFilter',
        onLoaded: (key, loadedOptions) => emit('options-loaded', key, loadedOptions),
        onError: (key, error) => emit('options-error', key, error),
      },
    )

    function renderField(column: LiteFilterColumn) {
      const customSlot = slots[`field-${column.key}`] as
        | ((scope: LiteFilterFieldScope) => any)
        | undefined
      if (customSlot) {
        return customSlot({
          column,
          value: searchFormData.value[column.key],
          setValue: value => setFieldValue(column.key, value),
        })
      }

      return renderFieldControl({
        column,
        model: searchFormData.value,
        options: getColumnOptions(column),
        loading: Boolean(optionsLoading[column.key]),
      })
    }

    function renderLabel(column: LiteFilterColumn) {
      return (
        <div class="flex gap-2 items-center">
          <span>{column.title}</span>
          <NTooltip trigger="hover">
            {{
              trigger: () => <BmIconInfoCircle />,
              default: () => column.tooltip,
            }}
          </NTooltip>
        </div>
      )
    }

    function renderFormItem(column: LiteFilterColumn, forceLabel = false, width?: string) {
      const labelVisible = forceLabel || props.showLabel || Boolean(column.tooltip)
      return (
        <NFormItem
          key={column.key}
          label={labelVisible ? column.title : undefined}
          path={column.key}
          showLabel={labelVisible}
          style={{ flex: '0 0 auto', width: width ?? resolveFieldWidth(column) }}
        >
          {{
            default: () => renderField(column),
            ...(column.tooltip ? { label: () => renderLabel(column) } : {}),
          }}
        </NFormItem>
      )
    }

    function renderAdvancedForm() {
      return (
        <div class="bm-lite-filter-advanced" style={{ width: `${ADVANCED_POPOVER_WIDTH}px`, maxWidth: '90vw' }}>
          <NForm
            labelPlacement="top"
            showFeedback={false}
            showRequireMark={false}
            size={controlSize.value as any}
            model={searchFormData.value}
          >
            <div
              class="bm-lite-filter-row"
              style={{ display: 'flex', flexDirection: 'column', gap: `${props.gap}px` }}
            >
              {advancedColumns.value.map(column => renderFormItem(column, true, '100%'))}
            </div>
          </NForm>
          {props.showResetButton && (
            <div class="mt-4 flex justify-end gap-2">
              <NButton size={controlSize.value as any} disabled={isLoading.value} onClick={resetAdvancedFields}>
                {props.resetText}
              </NButton>
            </div>
          )}
        </div>
      )
    }

    expose({
      refreshOptions,
    })

    return () => {
      const form = (
        <NForm
          class="bm-lite-filter"
          labelPlacement="left"
          labelWidth="auto"
          showFeedback={false}
          showRequireMark={false}
          size={controlSize.value as any}
          model={searchFormData.value}
          {...pickFormProps(props.formConfig)}
        >
          <div
            ref={rowRef}
            class="bm-lite-filter-row"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: `${props.gap}px`,
              maxHeight: collapsed.value ? `${collapsedHeight.value}px` : undefined,
              overflow: collapsed.value ? 'hidden' : undefined,
            }}
          >
            {mainColumns.value.map(column => renderFormItem(column))}

            <div class="bm-lite-filter-actions" style={{ flex: '0 0 auto' }}>
              <NSpace justify="start" wrap={false} size={8}>
                {props.showResetButton && (
                  <NButton size={controlSize.value as any} disabled={isLoading.value} onClick={handleReset}>
                    {{
                      icon: () => <BmIconRefresh />,
                      default: () => props.resetText,
                    }}
                  </NButton>
                )}
                {props.showSearchButton && (
                  <NButton
                    size={controlSize.value as any}
                    type="primary"
                    loading={isLoading.value}
                    disabled={isLoading.value}
                    onClick={handleSearch}
                  >
                    {{
                      icon: () => <BmIconSearch />,
                      default: () => props.searchText,
                    }}
                  </NButton>
                )}
                {showAdvanced.value && (
                  <NButton size={controlSize.value as any} text type="primary" onClick={() => toggleCollapsed()}>
                    {{
                      icon: () => collapsed.value ? <BmIconArrowDown /> : <BmIconArrowUp />,
                      default: () => collapsed.value ? props.expandText : props.collapseText,
                    }}
                  </NButton>
                )}
                {advancedColumns.value.length > 0 && (
                  <NPopover
                    trigger="click"
                    placement="bottom-end"
                    show={advancedVisible.value}
                    onUpdate:show={(value: boolean) => {
                      advancedVisible.value = value
                    }}
                  >
                    {{
                      trigger: () => (
                        <NButton size={controlSize.value as any} text type="primary">
                          {{
                            icon: () => advancedVisible.value ? <BmIconArrowUp /> : <BmIconArrowDown />,
                            default: () => props.advancedText,
                          }}
                        </NButton>
                      ),
                      default: () => renderAdvancedForm(),
                    }}
                  </NPopover>
                )}
                {slots.actions?.({
                  search: handleSearch,
                  reset: handleReset,
                  toggleCollapsed: () => toggleCollapsed(),
                  collapsed: collapsed.value,
                  loading: isLoading.value,
                })}
                {slots.default?.()}
              </NSpace>
            </div>
          </div>
        </NForm>
      )

      return props.card ? <NCard size="small" hoverable>{form}</NCard> : form
    }
  },
})