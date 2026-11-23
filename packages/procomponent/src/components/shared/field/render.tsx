import {
  NCheckbox,
  NCheckboxGroup,
  NDatePicker,
  NRadio,
  NRadioGroup,
  NSwitch,
  NTimePicker,
} from 'naive-ui'
import {
  loadingValueTypes,
  optionValueTypes,
  resolvePlaceholder,
  valueFieldMaps,
} from './maps'
import type { FieldColumn } from './types'

export interface FieldRenderContext<T extends FieldColumn = FieldColumn> {
  column: T
  /** 组件持有的可变表单模型,内核通过 v-model 直接绑定 */
  model: Record<string, any>
  /** 当前列的候选选项 */
  options?: any[]
  /** 当前列远程枚举是否加载中 */
  loading?: boolean
}

/** 按 valueType 渲染单个查询控件;不处理插槽与布局 */
export function renderFieldControl<T extends FieldColumn>({
  column,
  model,
  options: columnOptions,
  loading,
}: FieldRenderContext<T>) {
  const fieldProps = column.formItemProps ?? {}
  const style = { width: '100%' }
  const placeholder = resolvePlaceholder(column)

  switch (column.valueType) {
    case 'date':
    case 'dateRange': {
      const isRange = column.valueType === 'dateRange'
        || fieldProps.type === 'daterange'
        || fieldProps.type === 'datetimerange'
      const rangePlaceholders = column.placeholder
        ? { startPlaceholder: column.placeholder, endPlaceholder: column.placeholder }
        : { startPlaceholder: '开始日期', endPlaceholder: '结束日期' }

      return (
        <NDatePicker
          v-model:formatted-value={model[column.key]}
          type={(isRange ? fieldProps.type ?? 'daterange' : fieldProps.type ?? 'date') as any}
          value-format={fieldProps.valueFormat ?? 'yyyy-MM-dd'}
          clearable
          {...(isRange ? rangePlaceholders : { placeholder })}
          style={style}
          disabled={column.disabled}
          {...fieldProps}
        />
      )
    }

    case 'time':
      return (
        <NTimePicker
          v-model:value={model[column.key]}
          placeholder={placeholder}
          clearable
          style={style}
          disabled={column.disabled}
          {...fieldProps}
        />
      )

    case 'checkbox':
      return (
        <NCheckbox
          v-model:checked={model[column.key]}
          disabled={column.disabled}
          {...fieldProps}
        />
      )

    case 'switch':
      return (
        <NSwitch
          v-model:value={model[column.key]}
          disabled={column.disabled}
          {...fieldProps}
        />
      )

    case 'radio':
      return (
        <NRadioGroup
          v-model:value={model[column.key]}
          disabled={column.disabled}
          {...fieldProps}
        >
          {(columnOptions ?? []).map(option => (
            <NRadio
              key={String(option.value)}
              value={option.value}
              label={option.label}
              disabled={option.disabled}
            />
          ))}
        </NRadioGroup>
      )

    case 'checkboxGroup':
      return (
        <NCheckboxGroup
          v-model:value={model[column.key]}
          disabled={column.disabled}
          {...fieldProps}
        >
          {(columnOptions ?? []).map(option => (
            <NCheckbox
              key={String(option.value)}
              value={option.value}
              label={option.label}
              disabled={option.disabled}
            />
          ))}
        </NCheckboxGroup>
      )

    default: {
      const Field = valueFieldMaps[column.valueType as keyof typeof valueFieldMaps] as any
      if (!Field)
        return null

      return (
        <Field
          v-model:value={model[column.key]}
          {...(optionValueTypes.has(column.valueType) && columnOptions ? { options: columnOptions } : {})}
          {...(loadingValueTypes.has(column.valueType) ? { loading: Boolean(loading) } : {})}
          placeholder={placeholder}
          clearable
          style={style}
          disabled={column.disabled}
          {...fieldProps}
        />
      )
    }
  }
}