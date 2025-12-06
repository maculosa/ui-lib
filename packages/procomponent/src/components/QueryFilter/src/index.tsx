import type { SelectOption } from 'naive-ui'
import type { QueryFilterProps } from './types'
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
import BmIconInfoCircle from '~icons/bm-icon/info-circle'
import BmIconRefresh from '~icons/bm-icon/refresh'
import BmIconSearch from '~icons/bm-icon/search'
import BmIconArrowDown from '~icons/bm-icon/arrow-down'
import BmIconArrowUp from '~icons/bm-icon/arrow-up'

import './styles/css'

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
    gridCols: {
      type: Number,
      default: 3
    },
    collapsed: {
      type: Boolean,
      default: false
    },
    gridCollapsedRows: {
      type: Number,
      default: 0
    },
    initialValues: {
      type: Object,
      default: () => ({})
    },
    fields: {
      type: Array,
      default: () => []
    },
    showFeedback: {
      type: Boolean,
      default: false
    },
    showRequireMark: {
      type: Boolean,
      default: false
    },
  },
  emits: ['search', 'reset'],
  setup(props, { emit }) {

    // 初始化表单数据
    const searchFormData = ref<Record<string, any>>({})
    searchFormData.value = props.initialValues

    // 初始化网格布局
    const gridRef = shallowRef()
    const gridCollapsed = ref(props.collapsed)
    const gridCollapsedRows = ref(props.gridCollapsedRows)
    const { showSuffix } = useShowSuffix(gridRef, props.gridCols)
    // 切换网格布局折叠状态
    function handleToggleCollapsed() {
      gridCollapsed.value = !gridCollapsed.value
    }

    // 提交查询
    function handleSearch() {
      emit('search', searchFormData.value)
    }

    // 重置查询
    function handleReset() {
      if (props.initialValues) {
        searchFormData.value = props.initialValues
      } else {
        searchFormData.value = {}
      }
      emit('reset')
    }

    return () => (
        <NForm
          labelPlacement="left"
          labelWidth="auto"
          showFeedback={props.showFeedback}
          showRequireMark={props.showRequireMark}
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
            {/* {transformColumns.value.map(item => (
              <NFormItemGi key={item.key} label={item.title} path={item.key}>
                {item.tooltip
                  ? {
                      label: () => (
                        <div class="flex gap-2 items-center">
                          <span>{item.title}</span>
                          <NTooltip trigger="hover">
                            {{
                              trigger: () => <BmIconInfoCircle />,
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
            ))} */}

            <slot />

            <NGi suffix>
              <NSpace justify="end" wrap={false}>
                <NButton onClick={handleReset}>
                  {{
                    icon: () => <BmIconRefresh />,
                    default: () => '重置',
                  }}
                </NButton>
                <NButton type="primary" onClick={handleSearch}>
                  {{
                    icon: () => <BmIconSearch />,
                    default: () => '查询',
                  }}
                </NButton>
                {showSuffix.value && (
                  <NButton text type="primary" onClick={handleToggleCollapsed}>
                    {{
                      icon: () => gridCollapsed.value ? <BmIconArrowDown /> : <BmIconArrowUp />,
                      default: () => gridCollapsed.value ? '展开' : '折叠',
                    }}
                  </NButton>
                )}
              </NSpace>
            </NGi>
          </NGrid>
        </NForm>
    )
  },
})
