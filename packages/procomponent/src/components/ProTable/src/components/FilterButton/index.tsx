import { computed, defineComponent, ref, watch } from 'vue'
import type { PropType } from 'vue'
import { NButton, NDatePicker, NDivider, NInput, NPopover, NSelect, NSpace, NTimePicker, NTooltip, useThemeVars } from 'naive-ui'
import BmIconFilter from '~icons/bm-icon/filter'
import BmIconPlus from '~icons/bm-icon/plus'
import BmIconDelete from '~icons/bm-icon/delete'

/** 筛选值是否为空,空值不参与筛选,也不会回传给服务端 */
export function isEmptyFilterValue(value: any) {
  if (value === undefined || value === null || value === '') return true
  if (Array.isArray(value)) {
    return value.length === 0 || value.every(item => item === undefined || item === null || item === '')
  }
  return false
}

/** 弹层内的一条筛选条件草稿 */
interface FilterRowDraft {
  /** 列 key,未选择字段时为 null */
  key: string | null
  /** 条件值,多选为数组,其余为字符串 */
  value: any
}

/**
 * 工具栏筛选按钮
 * 弹层默认不展示任何条件,点击「添加筛选条件」按需增加;
 * 每条条件为「字段选择 + 值输入」的同行布局,带 options 的字段用多选。
 */
export default defineComponent({
  name: 'FilterButton',
  props: {
    /** 可筛选列,元素需包含 key 与 title,带 options 时渲染为多选 */
    columns: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    /** 当前生效的筛选条件 */
    value: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const themeVars = useThemeVars()
    const show = ref(false)
    /** 弹层内编辑中的条件列表,点击「确定」后才生效 */
    const rows = ref<FilterRowDraft[]>([])

    // 每次打开弹层时,用当前生效条件重建草稿,避免上次未确认的内容残留
    watch(show, visible => {
      if (visible) {
        rows.value = Object.entries(props.value)
          .filter(([, value]) => !isEmptyFilterValue(value))
          .map(([key, value]) => ({ key, value: Array.isArray(value) ? [...value] : value }))
      }
    })

    const activeCount = computed(() =>
      Object.values(props.value).filter(value => !isEmptyFilterValue(value)).length,
    )

    const tooltip = computed(() => (activeCount.value > 0 ? `筛选(${activeCount.value})` : '筛选'))

    /** 未使用的可筛选列,用于每行的字段下拉(排除其他行已占用的列) */
    function getAvailableColumns(row: FilterRowDraft) {
      const usedKeys = rows.value
        .filter(item => item !== row && item.key)
        .map(item => item.key)
      return props.columns.filter(column => !usedKeys.includes(column.key))
    }

    const canAdd = computed(() => rows.value.length < props.columns.length)

    /** 新增一条空白条件,字段留空由用户选择 */
    function handleAdd() {
      rows.value.push({ key: null, value: null })
    }

    /** 删除指定条件 */
    function handleRemove(index: number) {
      rows.value.splice(index, 1)
    }

    /** 切换字段时清空已填写的值,避免不同字段的值类型不匹配 */
    function handleChangeField(row: FilterRowDraft, key: string) {
      row.key = key
      row.value = null
    }

    /** 应用筛选:剔除未选字段或空值的条件后回传并关闭弹层 */
    function handleApply() {
      const filters: Record<string, any> = {}
      rows.value.forEach(row => {
        if (row.key && !isEmptyFilterValue(row.value)) filters[row.key] = row.value
      })
      emit('change', filters)
      show.value = false
    }

    /** 清空全部条件并立即生效 */
    function handleReset() {
      rows.value = []
      emit('change', {})
      show.value = false
    }

    /** 字段下拉:固定宽度保证多行条件左侧对齐 */
    function renderFieldSelect(row: FilterRowDraft) {
      const options = getAvailableColumns(row).map(column => ({ label: column.title, value: column.key }))
      return (
        <NSelect
          size="small"
          placeholder="选择字段"
          options={options}
          value={row.key}
          style={{ width: '120px', flexShrink: 0 }}
          onUpdate:value={(value: string) => handleChangeField(row, value)}
        />
      )
    }

    /** 值输入控件:日期类用日期选择器,时间用时间选择器,有 options 的用多选,其余用关键字输入 */
    function renderValueControl(row: FilterRowDraft) {
      if (!row.key) {
        return <NInput size="small" disabled placeholder="请先选择字段" />
      }
      const column = props.columns.find(item => item.key === row.key)
      const valueType = column?.valueType

      // 日期 / 日期范围 / 日期时间:与查询表单保持一致,提交格式化后的字符串
      if (valueType === 'date' || valueType === 'dateRange' || valueType === 'datetime') {
        const isRange = valueType === 'dateRange'
        const isDateTime = valueType === 'datetime'
        return (
          <NDatePicker
            v-model:formatted-value={row.value}
            type={isDateTime ? 'datetime' : isRange ? 'daterange' : 'date'}
            value-format={isDateTime ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'}
            clearable
            size="small"
            placeholder={isRange ? '请选择日期范围' : '请选择日期'}
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style={{ width: '100%' }}
          />
        )
      }

      // 时间选择
      if (valueType === 'time') {
        return (
          <NTimePicker
            v-model:value={row.value}
            clearable
            size="small"
            placeholder="请选择时间"
            style={{ width: '100%' }}
          />
        )
      }

      if (Array.isArray(column?.options) && column.options.length > 0) {
        return (
          <NSelect
            multiple
            clearable
            filterable
            size="small"
            options={column.options}
            value={row.value ?? []}
            placeholder="请选择"
            onUpdate:value={(value: any[]) => { row.value = value }}
          />
        )
      }
      return (
        <NInput
          clearable
          size="small"
          value={row.value ?? ''}
          placeholder="请输入关键字"
          onUpdate:value={(value: string) => { row.value = value }}
        />
      )
    }

    /** 单条条件:字段与值同行展示,右侧为删除按钮 */
    function renderRow(row: FilterRowDraft, index: number) {
      return (
        <div
          key={index}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px',
          }}
        >
          {renderFieldSelect(row)}
          <div style={{ flex: 1, minWidth: 0 }}>{renderValueControl(row)}</div>
          <NButton
            size="small"
            quaternary
            style={{ flexShrink: 0 }}
            onClick={() => handleRemove(index)}
          >
            <BmIconDelete class="text-14px" />
          </NButton>
        </div>
      )
    }

    return () => (
      <NPopover
        trigger="click"
        placement="bottom-end"
        show={show.value}
        style={{ width: '460px' }}
        onUpdate:show={(visible: boolean) => { show.value = visible }}
      >
        {{
          trigger: () => (
            <NTooltip trigger="hover">
              {{
                trigger: () => (
                  <NButton size="small" quaternary type={activeCount.value > 0 ? 'primary' : undefined}>
                    <BmIconFilter class="text-16px" />
                  </NButton>
                ),
                default: () => tooltip.value,
              }}
            </NTooltip>
          ),
          default: () => (
            <div style={{ padding: '2px' }}>
              <div style={{ padding: '4px 6px 8px', fontSize: '12px', color: themeVars.value.textColor3 }}>
                筛选条件
              </div>
              {/* 条件列表:默认空白,按需添加;条目较多时内部滚动 */}
              <div style={{ maxHeight: '280px', overflowY: 'auto', padding: '0 4px' }}>
                {rows.value.map((row, index) => renderRow(row, index))}
                {canAdd.value && (
                  <NButton
                    block
                    dashed
                    size="small"
                    style={{ marginBottom: '4px' }}
                    onClick={handleAdd}
                  >
                    {{
                      icon: () => <BmIconPlus class="text-14px" />,
                      default: () => '添加筛选条件',
                    }}
                  </NButton>
                )}
              </div>
              <NDivider style={{ margin: '2px 0 10px' }} />
              <NSpace justify="end">
                <NButton size="small" onClick={handleReset}>重置</NButton>
                <NButton size="small" type="primary" onClick={handleApply}>确定</NButton>
              </NSpace>
            </div>
          ),
        }}
      </NPopover>
    )
  },
})
