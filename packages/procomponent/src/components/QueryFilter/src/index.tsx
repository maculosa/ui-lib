import type { PropType } from 'vue'
import type {
  QueryFilterColumn,
  QueryFilterFieldScope,
  QueryFilterProps,
} from './types'
import {
  NButton,
  NCard,
  NForm,
  NFormItemGi,
  NGi,
  NGrid,
  NSpace,
  NTooltip,
} from 'naive-ui'
import { cloneDeep, isEqual } from 'lodash-es'
import { computed, defineComponent, ref, shallowRef, watch } from 'vue'
import BmIconInfoCircle from '~icons/bm-icon/info-circle'
import BmIconRefresh from '~icons/bm-icon/refresh'
import BmIconSearch from '~icons/bm-icon/search'
import BmIconArrowDown from '~icons/bm-icon/arrow-down'
import BmIconArrowUp from '~icons/bm-icon/arrow-up'
import {
  createFieldModel,
  orderSearchColumns,
  renderFieldControl,
  useFieldOptions,
} from '../../shared/field'

import './styles/css'

function parseGridCols(value: number | string | undefined) {
  if (typeof value === 'number')
    return Math.max(1, value)
  const matched = String(value ?? '').match(/\d+/)
  return matched ? Math.max(1, Number(matched[0])) : 1
}

function pickFormProps(config: QueryFilterProps['formConfig']) {
  const rest = { ...(config ?? {}) }
  delete rest.gridCollapsed
  delete rest.gridCollapsedRows
  return rest
}

export default defineComponent({
  name: 'QueryFilter',
  props: {
    columns: {
      type: Array as PropType<QueryFilterColumn[]>,
      default: () => [],
    },
    defaultValue: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
    modelValue: {
      type: Object as PropType<Record<string, any>>,
      default: undefined,
    },
    gridCols: {
      type: [Number, String] as PropType<number | string>,
      default: 3,
    },
    formConfig: {
      type: Object as PropType<QueryFilterProps['formConfig']>,
      default: () => ({
        gridCollapsed: true,
        gridCollapsedRows: 1,
      }),
    },
    card: {
      type: Boolean,
      default: true,
    },
    collapsed: {
      type: Boolean,
      default: undefined,
    },
    loading: {
      type: Boolean,
      default: false,
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
    showAdvancedButton: {
      type: Boolean,
      default: true,
    },
    searchOnReset: {
      type: Boolean,
      default: false,
    },
    beforeSearch: {
      type: Function as PropType<QueryFilterProps['beforeSearch']>,
      default: undefined,
    },
  },
  emits: [
    'search',
    'reset',
    'update:modelValue',
    'update:collapsed',
    'field-change',
    'options-loaded',
    'options-error',
  ],
  setup(props, { emit, expose, slots }) {
    const formRef = shallowRef()

    const transformColumns = computed(() => orderSearchColumns(props.columns))

    const resolvedCols = computed(() => parseGridCols(props.gridCols))
    const collapsedRows = computed(() => props.formConfig?.gridCollapsedRows ?? 1)
    const collapsed = ref(props.collapsed ?? props.formConfig?.gridCollapsed ?? true)
    const showAdvanced = computed(
      () => props.showAdvancedButton && transformColumns.value.length + 1 > resolvedCols.value * collapsedRows.value,
    )

    watch(
      () => props.collapsed,
      (value) => {
        if (typeof value === 'boolean')
          collapsed.value = value
      },
    )

    function toggleCollapsed(force?: boolean) {
      const next = typeof force === 'boolean' ? force : !collapsed.value
      if (next === collapsed.value)
        return
      collapsed.value = next
      emit('update:collapsed', next)
    }

    function createSearchFormData(model?: Record<string, any>) {
      return createFieldModel(props.columns, model ?? props.defaultValue)
    }

    const searchFormData = ref<Record<string, any>>(createSearchFormData(props.modelValue))
    let snapshot = cloneDeep(searchFormData.value)

    watch(
      () => props.defaultValue,
      (value) => {
        if (props.modelValue !== undefined)
          return
        if (value && typeof value === 'object')
          searchFormData.value = { ...searchFormData.value, ...value }
      },
      { deep: true },
    )

    watch(
      () => props.modelValue,
      (value) => {
        if (value === undefined)
          return
        const next = createSearchFormData(value)
        if (isEqual(next, searchFormData.value))
          return
        searchFormData.value = next
        snapshot = cloneDeep(next)
      },
      { deep: true },
    )

    watch(
      searchFormData,
      () => {
        const next = cloneDeep(searchFormData.value)
        const changedKeys = Object.keys(next).filter(key => !isEqual(next[key], snapshot[key]))
        if (changedKeys.length === 0)
          return

        snapshot = next
        changedKeys.forEach((key) => {
          emit('field-change', key, next[key], { ...next })
        })

        if (!isEqual(props.modelValue, next))
          emit('update:modelValue', { ...next })
      },
      { deep: true },
    )

    function getValues() {
      return cloneDeep(searchFormData.value)
    }

    function setFieldValue(key: string, value: any) {
      searchFormData.value[key] = value
    }

    function getFieldValue(key: string) {
      return searchFormData.value[key]
    }

    function setValues(values: Record<string, any>, merge = true) {
      searchFormData.value = merge
        ? { ...searchFormData.value, ...values }
        : createSearchFormData(values)
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
          console.error('QueryFilter beforeSearch failed:', error)
          return
        }
        finally {
          pending.value = false
        }
      }

      emit('search', values)
    }

    function handleReset() {
      searchFormData.value = createSearchFormData()
      emit('reset', getValues())
      if (props.searchOnReset)
        void handleSearch()
    }

    const { optionsLoading, refreshOptions, getColumnOptions } = useFieldOptions(
      () => props.columns,
      {
        label: 'QueryFilter',
        onLoaded: (key, loadedOptions) => emit('options-loaded', key, loadedOptions),
        onError: (key, error) => emit('options-error', key, error),
      },
    )

    function renderField(column: QueryFilterColumn) {
      const customSlot = slots[`field-${column.key}`] as
        | ((scope: QueryFilterFieldScope) => any)
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

    expose({
      getValues,
      setValues,
      setFieldValue,
      getFieldValue,
      search: handleSearch,
      reset: handleReset,
      toggleCollapsed,
      refreshOptions,
      collapsed,
      optionsLoading,
      form: formRef,
    })

    return () => {
      const form = (
        <NForm
          ref={formRef}
          labelPlacement="left"
          labelWidth="auto"
          showFeedback={false}
          showRequireMark={false}
          model={searchFormData.value}
          {...pickFormProps(props.formConfig)}
        >
          <NGrid
            itemResponsive
            cols={props.gridCols as any}
            x-gap={16}
            y-gap={16}
            collapsed={collapsed.value}
            collapsedRows={collapsedRows.value}
          >
            {transformColumns.value.map(column => (
              <NFormItemGi
                key={column.key}
                label={column.title}
                path={column.key}
                span={column.grid as any}
              >
                {{
                  default: () => renderField(column),
                  ...(column.tooltip
                    ? {
                        label: () => (
                          <div class="flex gap-2 items-center">
                            <span>{column.title}</span>
                            <NTooltip trigger="hover">
                              {{
                                trigger: () => <BmIconInfoCircle />,
                                default: () => column.tooltip,
                              }}
                            </NTooltip>
                          </div>
                        ),
                      }
                    : {}),
                }}
              </NFormItemGi>
            ))}

            <NGi suffix>
              <NSpace justify="end" wrap={false}>
                {props.showResetButton && (
                  <NButton disabled={isLoading.value} onClick={handleReset}>
                    {{
                      icon: () => <BmIconRefresh />,
                      default: () => props.resetText,
                    }}
                  </NButton>
                )}
                <NButton type="primary" loading={isLoading.value} disabled={isLoading.value} onClick={handleSearch}>
                  {{
                    icon: () => <BmIconSearch />,
                    default: () => props.searchText,
                  }}
                </NButton>
                {showAdvanced.value && (
                  <NButton text type="primary" onClick={() => toggleCollapsed()}>
                    {{
                      icon: () => collapsed.value ? <BmIconArrowDown /> : <BmIconArrowUp />,
                      default: () => collapsed.value ? props.expandText : props.collapseText,
                    }}
                  </NButton>
                )}
                {slots.actions?.({
                  search: handleSearch,
                  reset: handleReset,
                  toggleCollapsed: () => toggleCollapsed(),
                  collapsed: collapsed.value,
                  loading: isLoading.value,
                })}
              </NSpace>
            </NGi>
          </NGrid>
        </NForm>
      )

      return props.card ? <NCard hoverable>{form}</NCard> : form
    }
  },
})
