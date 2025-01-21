import type { SelectOption } from 'naive-ui'
import type { QueryFilterProps, QueryFilterColumn } from './types'
import {
  NAutoComplete,
  NButton,
  NCard,
  NCascader,
  NCheckbox,
  NColorPicker,
  NDatePicker,
  NDynamicTags,
  NForm,
  NFormItemGi,
  NGi,
  NGrid,
  NInput,
  NInputNumber,
  NSelect,
  NSpace,
  NSwitch,
  NTimePicker,
  NTooltip,
  NTreeSelect,
} from 'naive-ui'
import { computed, defineComponent, onMounted, reactive, ref, shallowRef, watch } from 'vue'
import { useShowSuffix } from '@hooks/useShowSuffix'

const formFieldMaps = {
  text: NInput,
  select: NSelect,
  date: NDatePicker,
  time: NTimePicker,
  cascader: NCascader,
  autoComplete: NAutoComplete,
  colorPicker: NColorPicker,
  checkbox: NCheckbox,
  switch: NSwitch,
  dynamicTags: NDynamicTags,
  digit: NInputNumber,
  treeSelect: NTreeSelect,
} as const

const placeholderMaps = {
  text: '请输入',
  select: '请选择',
  date: '请选择日期',
  time: '请选择时间',
  cascader: '请选择',
  autoComplete: '请输入',
  colorPicker: '请选择',
  checkbox: '请选择',
  switch: '请选择',
  dynamicTags: '请输入',
  digit: '请输入',
  treeSelect: '请选择',
} as const

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
    gridCols: {
      type: Number,
      default: 3,
    },
    formConfig: {
      type: Object as PropType<QueryFilterProps['formConfig']>,
      default: () => ({
        gridCollapsed: true,
        gridCollapsedRows: 1,
      }),
    },
  },
  emits: ['search', 'reset'],
  setup(props, { emit }) {
    /**
     * 获取默认占位符
     * @param type 字段类型
     * @param title 字段标题
     */
    function getDefaultPlaceholder(type: keyof typeof placeholderMaps, title?: string) {
      if (type === 'date' || type === 'time')
        return placeholderMaps[type]

      return placeholderMaps[type] + title
    }

    const transformColumns = computed(() => {
      return props.columns
        .filter(i => !i.hideInSearch)
        .sort((a, b) => {
          if (a?.order && b?.order)
            return a.order - b.order
          return 0
        })
    })

    const gridRef = shallowRef()
    const gridCollapsed = ref(props.formConfig?.gridCollapsed)
    const gridCollapsedRows = ref(props.formConfig?.gridCollapsedRows)
    const { showSuffix } = useShowSuffix(gridRef, props.gridCols)

    function handleToggleCollapsed() {
      gridCollapsed.value = !gridCollapsed.value
    }

    const options = reactive<Record<string, SelectOption[]>>({})

    /**
     * 获取远程服务器枚举
     * @param fn 请求函数
     * @param prop 字段标识
     */
    async function getRemoteServerEnum(fn: () => Promise<any[]>, prop: string) {
      if (!fn || !prop) return

      const column = props.columns.find(item => item.key === prop)
      if (!column) return

      try {
        options[column.key] = await fn()
      } catch (error) {
        console.error('Failed to fetch remote options:', error)
      }
    }

    watch(
      () => props.columns,
      (columns) => {
        columns.forEach((item) => {
          if (item.request)
            getRemoteServerEnum(item.request, item.key)
        })
      },
      { deep: true, immediate: true }
    )

    const searchFormData = ref<Record<string, any>>({})

    /**
     * 创建搜索表单数据
     */
    function createSearchFormData() {
      const formData: Record<string, any> = {}

      props.columns.forEach((column) => {
        if (column.valueType === 'select' || column.valueType === 'date')
          formData[column.key] = null
        else
          formData[column.key] = ''
      })

      if (typeof props.defaultValue === 'object' && Object.keys(props.defaultValue).length > 0)
        return { ...formData, ...props.defaultValue }

      return formData
    }

    onMounted(() => {
      searchFormData.value = createSearchFormData()
    })

    watch(
      () => props.defaultValue,
      (val) => {
        searchFormData.value = { ...searchFormData.value, ...val }
      },
      { deep: true, immediate: true }
    )

    function handleReset() {
      searchFormData.value = createSearchFormData()
      emit('reset', searchFormData.value)
    }

    function handleSearch() {
      emit('search', searchFormData.value)
    }

    return () => (
      <NCard hoverable>
        <NForm
          labelPlacement="left"
          labelWidth="auto"
          showFeedback={false}
          showRequireMark={false}
          v-bind={props.formConfig}
          model={searchFormData.value}
        >
          <NGrid
            ref={gridRef}
            itemResponsive
            cols={props.gridCols}
            x-gap={16}
            y-gap={16}
            collapsed={gridCollapsed.value}
            collapsedRows={gridCollapsedRows.value}
          >
            {transformColumns.value.map(item => (
              <NFormItemGi key={item.key} label={item.title} path={item.key}>
                {item.tooltip
                  ? {
                      label: () => (
                        <div class="flex gap-2 items-center">
                          <span>{item.title}</span>
                          <NTooltip trigger="hover">
                            {{
                              trigger: () => <bm-info-circle />,
                              default: () => item.tooltip,
                            }}
                          </NTooltip>
                        </div>
                      ),
                      default: () => (
                        item.valueType === 'date'
                          ? <NDatePicker
                              v-model:formatted-value={searchFormData.value[item.key]}
                              type={item.valueType}
                              style="width: 100%"
                              placeholder={getDefaultPlaceholder(item.valueType, item.title)}
                              clearable
                              value-format="yyyy-MM-dd"
                              v-bind={item?.formItemProps}
                            />
                          : <component
                              is={formFieldMaps[item.valueType]}
                              v-model:value={searchFormData.value[item.key]}
                              options={item.options || options[item.key]}
                              placeholder={getDefaultPlaceholder(item.valueType, item.title)}
                              clearable
                              style={{ width: '100%' }}
                              v-bind={item?.formItemProps}
                            />
                      ),
                    }
                  : <component
                      is={formFieldMaps[item.valueType]}
                      v-model:value={searchFormData.value[item.key]}
                      options={item.options || options[item.key]}
                      placeholder={getDefaultPlaceholder(item.valueType, item.title)}
                      clearable
                      style={{ width: '100%' }}
                      v-bind={item?.formItemProps}
                    />
                }
              </NFormItemGi>
            ))}

            <NGi suffix>
              <NSpace justify="end" wrap={false}>
                <NButton onClick={handleReset}>
                  {{
                    icon: () => <bm-refresh />,
                    default: () => '重置',
                  }}
                </NButton>
                <NButton type="primary" onClick={handleSearch}>
                  {{
                    icon: () => <bm-search />,
                    default: () => '查询',
                  }}
                </NButton>
                {showSuffix.value && (
                  <NButton text type="primary" onClick={handleToggleCollapsed}>
                    {{
                      icon: () => gridCollapsed.value ? <bm-arrow-down /> : <bm-arrow-up />,
                      default: () => gridCollapsed.value ? '展开' : '折叠',
                    }}
                  </NButton>
                )}
              </NSpace>
            </NGi>
          </NGrid>
        </NForm>
      </NCard>
    )
  },
})
