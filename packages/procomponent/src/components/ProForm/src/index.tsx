import type {
  SelectOption,
} from 'naive-ui'
import {
  NButton,
  NCascader,
  NCheckbox,
  NCheckboxGroup,
  NDatePicker,
  NForm,
  NFormItemGi,
  NGi,
  NGrid,
  NInput,
  NInputNumber,
  NRadio,
  NRadioGroup,
  NSelect,
  NSpace,
  NSwitch,
  NTimePicker,
  NTooltip,
  NUpload,
} from 'naive-ui'
import { defineComponent, onMounted, ref, watch } from 'vue'
import { useShowSuffix } from '@/hooks/useShowSuffix'
// import RemoteCascader from './components/RemoteCascader'
import initTreeData from '@/utils/buildTree'
import BmIconInfoCircle from '~icons/bm-icon/info-circle'
import BmIconRefresh from '~icons/bm-icon/refresh'
import BmIconSearch from '~icons/bm-icon/search'
import BmIconArrowDown from '~icons/bm-icon/arrow-down'
import BmIconArrowUp from '~icons/bm-icon/arrow-up'
import { proFormEmits, proFormProps } from './types'

export default defineComponent({
  name: 'ProForm',
  props: proFormProps,
  emits: proFormEmits,
  setup(props, ctx) {
    const formData = ref<any>({})

    // 存储初始默认值，用于重置表单数据
    const defaultValue = { ...props.defaultValue }
    // 表单项的options，使用shallowRef减少响应式开销
    const options = ref<{ [key: string]: SelectOption[] }>({})
    // 记录已请求过的key，避免重复请求
    const requestedKeys = ref<Set<string>>(new Set())
    // 缓存columns哈希值，用于判断columns是否变化
    const columnsHash = ref<string>('')
    // 缓存formData结构
    const cachedFormDataStructure = ref<any>({})

    /**
     * 创建表单数据
     * @param forceCreate 是否强制创建新的表单结构，不使用缓存
     * @returns 表单数据
     */
    const createFormData = (forceCreate: boolean = false) => {
      const currentHash = getColumnsHash(props.columns)
      
      // 如果columns结构未变化且不强制创建，直接返回缓存的结构的深拷贝
      if (!forceCreate && currentHash === columnsHash.value && Object.keys(cachedFormDataStructure.value).length > 0) {
        const result = JSON.parse(JSON.stringify(cachedFormDataStructure.value))
        if (
          typeof props.model === 'object'
          && Object.keys(props.model).length > 0
        ) {
          return {
            ...result,
            ...props.model,
          }
        }
        return result
      }
      
      // columns结构变化或强制创建，重新创建formData
      const formData: any = {}
      props.columns.forEach((item: any) => {
        switch (item.valueType) {
          case 'cascader':
          case 'digit':
          case 'date':
          case 'datetime':
          case 'datetimerange':
          case 'daterange':
          case 'select':
          case 'time':
          case 'upload':
            formData[item.key] = null
            break
          case 'checkbox':
            formData[item.key] = []
            break
          case 'switch':
            formData[item.key] = false
            break
          default:
            formData[item.key] = ''
            break
        }
      })
      
      // 更新缓存，使用深拷贝避免引用共享
      columnsHash.value = currentHash
      cachedFormDataStructure.value = JSON.parse(JSON.stringify(formData))
      
      if (
        typeof props.model === 'object'
        && Object.keys(props.model).length > 0
      ) {
        return {
          ...formData,
          ...props.model,
        }
      }
      return formData
    }

    onMounted(() => {
      if (props.defaultValue && Object.keys(props.defaultValue).length > 0) {
        formData.value = { ...defaultValue }
      }
      else {
        formData.value = createFormData()
      }
    })



    // 获取columns的哈希值
    const getColumnsHash = (cols: any[]) => {
      return JSON.stringify(cols.map(col => ({ key: col.key, valueType: col.valueType })))
    }

    // 获取 Select 的远程服务器枚举值
    const getRemoteServerOptions = async (fn: any, prop: string) => {
      if (!fn || !prop) {
        return []
      }
      // 如果已经请求过，直接返回，避免重复请求
      if (requestedKeys.value.has(prop)) {
        return options.value[prop] || []
      }
      // 获取当前有选择项的表单项
      const currentFormItem = props.columns.find(item => item.key === prop)
      if (!currentFormItem) {
        return []
      }
      const currentFormItemKey = currentFormItem.key

      const defaultValue = currentFormItem?.defaultValue

      options.value[currentFormItemKey] = defaultValue
        ? await initTreeData(defaultValue, fn)
        : await fn()
      // 标记为已请求
      requestedKeys.value.add(prop)
    }

    watch(
      () => props.columns,
      (newVal, oldVal) => {
        // 只处理新增或request变化的列
        newVal.forEach((item: any) => {
          if (item.request) {
            const oldItem = oldVal?.find((old: any) => old.key === item.key)
            // 如果是新增列或request函数变化，重新请求
            if (!oldItem || oldItem.request !== item.request) {
              // 清除旧的缓存
              requestedKeys.value.delete(item.key)
            }
            getRemoteServerOptions(item.request, item.key)
          }
        })
      },
      {
        immediate: true,
        deep: true,
      },
    )

    // watch(
    //   () => props.model,
    //   (val) => {
    //     formData.value = createFormData()
    //   },
    //   {
    //     deep: true,
    //     immediate: true
    //   }
    // )

    // 通用表单项属性
    const getCommonFieldProps = (item: any, oc: string = '输入') => {
      return {
        placeholder: `请${oc}${item.formTitle || item.title}`,
        clearable: true,
        ...item?.formItemProps,
      }
    }

    // 表单项样式
    const styles = {
      proFormItemLabel: {
        display: 'flex',
        justifyContent: props.labelPlacement === 'left' ? 'right' : 'left',
        alignItems: 'center',
        gap: '4px',
      },
    }

    // 渲染表单项
    const renderFormItem = (item: any) => {
      const renderField = () => {
        switch (item.valueType) {
          case 'text':
            return (
              <NInput
                v-model:value={formData.value[item.key]}
                {...getCommonFieldProps(item)}
              />
            )
          case 'textarea':
            return (
              <NInput
                v-model:value={formData.value[item.key]}
                type="textarea"
                {...getCommonFieldProps(item)}
              />
            )
          case 'digit':
            return (
              <NInputNumber
                v-model:value={formData.value[item.key]}
                {...getCommonFieldProps(item)}
                autosize
                style="width: 100%"
              />
            )
          case 'select':
            return (
              <NSelect
                v-model:value={formData.value[item.key]}
                {...getCommonFieldProps(item, '选择')}
                options={item.options || options.value[item.key]}
              />
            )
          case 'radio':
            return (
              <NRadioGroup
                v-model:value={formData.value[item.key]}
                {...getCommonFieldProps(item)}
              >
                {item.options?.map((option: any, idx: number) => {
                  return (
                    <NRadio key={idx} value={option.value}>
                      {option.label}
                    </NRadio>
                  )
                })}
              </NRadioGroup>
            )
          case 'checkbox':
            return (
              <NCheckboxGroup
                v-model:value={formData.value[item.key]}
                {...getCommonFieldProps(item)}
              >
                {item.options?.map((option: any, idx: number) => {
                  return (
                    <NCheckbox key={idx} value={option.value}>
                      {option.label}
                    </NCheckbox>
                  )
                })}
              </NCheckboxGroup>
            )
          case 'cascader':
            return (
              <NCascader
                v-model:value={formData.value[item.key]}
                {...getCommonFieldProps(item, '选择')}
                options={item.options || options.value[item.key]}
              />
            )
          case 'switch':
            return (
              <NSwitch
                v-model:value={formData.value[item.key]}
                {...getCommonFieldProps(item)}
              />
            )
          case 'time':
            return (
              <NTimePicker
                v-model:value={formData.value[item.key]}
                {...getCommonFieldProps(item, '选择')}
              />
            )
          case 'datetime':
            return (
              <NDatePicker
                v-model:formatted-value={formData.value[item.key]}
                type="datetime"
                style="width: 100%"
                clearable
                value-format="yyyy-MM-dd HH:mm:ss"
                {...getCommonFieldProps(item, '选择')}
              />
            )
          case 'datetimerange':
            return (
              <NDatePicker
                v-model:formatted-value={formData.value[item.key]}
                type="datetimerange"
                style="width: 100%"
                clearable
                value-format="yyyy-MM-dd HH:mm:ss"
                {...getCommonFieldProps(item, '选择')}
              />
            )
          case 'date':
            return (
              <NDatePicker
                v-model:formatted-value={formData.value[item.key]}
                type="date"
                style="width: 100%"
                clearable
                value-format="yyyy-MM-dd"
                {...getCommonFieldProps(item, '选择')}
              />
            )
          case 'daterange':
            return (
              <NDatePicker
                v-model:formatted-value={formData.value[item.key]}
                type="daterange"
                style="width: 100%"
                clearable
                value-format="yyyy-MM-dd"
                {...getCommonFieldProps(item, '选择')}
              />
            )
          case 'month':
            return (
              <NDatePicker
                v-model:formatted-value={formData.value[item.key]}
                type="month"
                style="width: 100%"
                clearable
                value-format="yyyy-MM"
                {...getCommonFieldProps(item, '选择')}
              />
            )
          case 'monthrange':
            return (
              <NDatePicker
                v-model:formatted-value={formData.value[item.key]}
                type="monthrange"
                style="width: 100%"
                clearable
                value-format="yyyy-MM"
                {...getCommonFieldProps(item, '选择')}
              />
            )
          case 'upload':
            return (
              <NUpload {...item?.formItemProps}>
                <NButton>上传文件</NButton>
              </NUpload>
            )
          default:
            return null
        }
      }
      if (item.tooltip) {
        return (
          <NFormItemGi path={item.key} rule={item.rule} span={item.grid}>
            {{
              label: () => {
                return typeof item.title === 'string' ? (
                  <div style={styles.proFormItemLabel}>
                    <span>{item.title}</span>
                    <NTooltip trigger="hover">
                      {{
                        trigger: () => (
                          <BmIconInfoCircle />
                        ),
                        default: () => item.tooltip,
                      }}
                    </NTooltip>
                  </div>
                ) : item.title
              },
              default: () => {
                    if (item.valueType === 'custom') {
                      return item.formRender(item.key, formData, item.formItemProps)
                    }
                    return renderField()
                  },
            }}
          </NFormItemGi>
        )
      }
      return (
        <NFormItemGi
          label={item.title}
          path={item.key}
          rule={item.rule}
          span={item.grid}
        >
          {item.valueType === 'custom'
            ? item.formRender(item.key, formData, item.formItemProps)
            : renderField()}
        </NFormItemGi>
      )
    }

    const formRef = ref()
    /**
     * 提交表单
     */
    const handleSubmit = () => {
      formRef.value?.validate((errors: any) => {
        if (!errors) {
          ctx.emit('submit', formData.value)
        }
        else {
          console.error(errors)
        }
      })
    }

    // 重置表单
    const handleReset = () => {
      if (props.defaultValue && Object.keys(props.defaultValue).length > 0) {
        formData.value = { ...defaultValue }
      }
      else {
        formData.value = createFormData(true) // 强制创建新表单结构
      }

      ctx.emit('reset')
    }

    // 重置搜索模型
    const handleResetWithSearchMode = () => {
      if (props.defaultValue && Object.keys(props.defaultValue).length > 0) {
        console.info('有默认值', props.defaultValue)
        formData.value = { ...createFormData(), ...props.defaultValue }
      } else {
        console.info('没有默认值')
        formData.value = createFormData(true) // 强制创建新表单结构
      }

      ctx.emit('reset', formData.value)
    }

    ctx.expose({
      reset: handleReset,
      submit: handleSubmit,
    })

    const gridRef = ref()
    const gridCollapsed = ref(props.gridCollapsed)
    const gridCollapsedRows = ref(props.gridCollapsedRows)

    const { showSuffix } = useShowSuffix(gridRef, props.gridCols)

    const handleToggleCollapsed = () => {
      gridCollapsed.value = !gridCollapsed.value
    }

    return () => (
      <NForm ref={formRef} {...props} model={formData.value}>
        <NGrid
          ref={gridRef}
          item-responsive
          cols={props.gridCols}
          responsive="screen"
          x-gap={16}
          collapsed={gridCollapsed.value}
          collapsedRows={gridCollapsedRows.value}
          y-gap={16}
        >
          {props.columns.map((column: any) => renderFormItem(column))}

          {props.mode === 'search' && (
            <NGi suffix>
              <NSpace justify="end" wrap={false}>
                <NButton onClick={() => handleResetWithSearchMode()}>
                  {{
                    icon: () => <BmIconRefresh />,
                    default: () => props.resetText,
                  }}
                </NButton>
                <NButton
                  attr-type="button"
                  type="primary"
                  loading={props.loading}
                  onClick={handleSubmit}
                >
                  {{
                    icon: () => <BmIconSearch />,
                    default: () => props.searchText,
                  }}
                </NButton>
                {showSuffix.value && (
                  <NButton
                    type="info"
                    ghost
                    onClick={() => handleToggleCollapsed()}
                  >
                    {{
                      icon: () => gridCollapsed.value ?
                        <BmIconArrowDown /> : <BmIconArrowUp />,
                      default: () => (gridCollapsed.value ? '展开' : '折叠'),
                    }}
                  </NButton>
                )}
              </NSpace>
            </NGi>
          )}
        </NGrid>
        {props.mode === 'normal' && (
          <NSpace justify="center" wrap={false}>
            <NButton onClick={() => handleReset()}>
              {props.resetText}
            </NButton>
            <NButton attr-type="button" type="primary" onClick={handleSubmit}>
              {props.submitText}
            </NButton>
          </NSpace>
        )}
        {props.mode === 'login' && (
          <NButton type="primary" block onClick={handleSubmit}>
            登录
          </NButton>
        )}
      </NForm>
    )
  },
})
