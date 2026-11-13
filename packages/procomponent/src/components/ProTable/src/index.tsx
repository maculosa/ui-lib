import {
  NCard,
  NDataTable,
  NFlex,
  useMessage
} from 'naive-ui'
import { computed, defineComponent, provide, ref, watchEffect } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { ProForm } from '@components/ProForm'
import { Toolbar } from './components'
import { renderEmptyCell, estimateColumnWidth } from '@/utils/table'
import { useTableColumns } from '@hooks/useTableColumns'
import { proTableProps, proTableEmits } from './types'
import './styles/css'

export default defineComponent({
  name: 'ProTable',
  props: proTableProps,
  emits: proTableEmits,
  setup(props, { emit, expose, slots }) {
    const message = useMessage()
    const excludeKeys = ['title', 'columns', 'searchConfig', 'toolbarConfig', 'toolbar', 'search', 'columnStorageKey']
    const tableProps = computed(() => {
      const p = { ...props }
      excludeKeys.forEach(key => {
        if (key in p) {
          delete (p as Record<string, unknown>)[key]
        }
      })

      if (props.height && !Number.isNaN(props.height)) {
        return {
          ...p,
          flexHeight: true,
          style: { height: `${props.height}px` },
        }
      }
      return p
    })

    // const searchModel = computed({
    //   get: () => props.searchModel || {},
    //   set: (val) => {
    //     emit('update:searchModel', val)
    //   }
    // })

    const isRefreshing = ref(false)
    const searchLoading = ref(false)

    watchEffect(() => {
      searchLoading.value = isRefreshing.value ? false : props.loading
    })

    const {
      tableColumns,
      settingColumns,
      searchColumns,
      formColumns,
    } = useTableColumns(props.columns, {
      searchSort: props.search && props.search?.sort || 'desc',
    })

    provide('settingColumns', settingColumns)

    // 未配置 columnStorageKey 时的托底 key:每个组件实例生成一次并保持稳定,
    // 保证列设置仍可缓存;注意随机 key 刷新后会变化,偏好无法跨刷新复用,仅作兜底
    const fallbackColumnSettingKey = `auto-${Math.random().toString(36).slice(2, 10)}`
    if (Boolean((import.meta as any).env?.DEV) && !props.columnStorageKey) {
      console.warn(
        `[ProTable] 未配置 columnStorageKey,列设置将使用随机 key "${fallbackColumnSettingKey}" 缓存,刷新后偏好不会保留。`,
      )
    }

    const toolbarCfg = computed(() => {
      return {
        ...props.toolbarConfig,
        ...props.toolbar,
        columnSettingKey: props.columnStorageKey || fallbackColumnSettingKey
      }
    })

    type TableSize = 'small' | 'medium' | 'large'
    const size = ref<TableSize>('large')
    const searchFormRef = ref<InstanceType<typeof ProForm> | null>(null)
    const searchRef = ref(null)

    /**
     * autoFlex 下表格高度完全交给 flex 布局:
     * 外层容器定高 -> 卡片 flex:1 且 minHeight:0 -> 内容区撑满 -> 表格 flex:1 填充剩余空间。
     * 不再用 JS 读取卡片高度回写像素值,避免「表格高度 -> 卡片内容高度 -> 卡片高度」的循环依赖。
     */
    const flexHeightStyles = computed(() => {
      if (props.autoFlex) {
        return {
          flex: 1,
          // 不置 0 时会取内容最小高度,导致窗口放大后再缩小无法收缩
          minHeight: 0
        }
      } else {
        return ''
      }
    })

    /**
     * autoFlex 时卡片及其内容区共用同一套 flex 布局:
     * 卡片自身纵向排列,内容区占满表头之外的空间,表格再填充内容区
     */
    const cardFlexStyles = computed(() => {
      if (!props.autoFlex) return undefined

      return {
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column' as const
      }
    })

    /** 表格自身样式:autoFlex 时由 flex 撑满卡片内容区 */
    const dataTableStyle = computed(() => {
      const baseStyle = (tableProps.value as Record<string, any>).style

      if (!props.autoFlex) return baseStyle

      return {
        ...baseStyle,
        flex: 1,
        minHeight: 0
      }
    })
    /**
     * 自动计算 scroll-x：
     * 存在固定列且调用方未显式配置 scrollX 时，按可见列宽度求和自动生成，
     * 避免列宽总和超出容器宽度时固定列失效，免去手动调试 scroll-x。
     * 返回 undefined 表示不干预（无固定列或调用方已显式配置）。
     */
    const autoScrollX = computed<number | undefined>(() => {
      // 调用方已显式配置 scrollX 时尊重原值
      if (props.scrollX !== undefined) return undefined
      const columns = tableColumns.value as Record<string, any>[]
      // 无固定列时不存在固定列失效问题，保持 naive-ui 默认行为
      if (!columns.some(column => column.fixed)) return undefined
      const totalWidth = columns.reduce(
        (sum, column) => sum + estimateColumnWidth(column),
        0,
      )
      return totalWidth > 0 ? totalWidth : undefined
    })

    /**
     * 加载数据
     * @param page 页码
     */
    function loadData(page: number) {
      emit('loadData', page)
    }

    const filterData = ref<Record<string, any>>(props.params || {})
    /**
     * 刷新数据
     */
    async function handleRefresh() {
      if (isRefreshing.value) return

      isRefreshing.value = true
      try {
        await loadData(1)
      } catch (error) {
        console.error('Refresh failed:', error)
        message?.error('刷新失败，请重试')
      } finally {
        isRefreshing.value = false
      }
    }

    /**
     * 搜索表单提交
     * @param formModel 表单数据
     */
    const handleSearch = useDebounceFn(async (formModel: Record<string, any>) => {
      if (!props.onQuery) {
        console.warn('ProTable: onQuery prop is required for search functionality')
        return
      }

      filterData.value = formModel

      try {
        searchLoading.value = true
        await props.onQuery(formModel)
      } catch (error) {
        console.error('Search failed:', error)
        // 可以添加错误通知
        message?.error('搜索失败，请重试')
      } finally {
        searchLoading.value = false
      }
    }, 300)

    /**
     * 重置搜索表单
     */
    async function handleReset(searchParams?: Record<string, any>) {
      try {
        searchLoading.value = true
        if (searchFormRef.value && searchParams) {
          // await loadData(1)
          await props.onQuery?.(searchParams)
          filterData.value = searchParams
          emit('reset')
        }
      } catch (error) {
        console.error('Reset failed:', error)
        message?.error('重置失败，请重试')
      } finally {
        searchLoading.value = false
      }
    }

    provide('toolbar-create', () => emit('create'))

    /**
     * 导出数据
     */
    function handleExportData() {
      emit('exportData', filterData.value)
    }

    expose({
      size,
      searchFormRef,
      searchRef,
    })

    return () => {
      const OriginDataTable = (
        <NDataTable
          {...tableProps.value}
          columns={tableColumns.value}
          size={size.value}
          loading={props.loading}
          pagination={props.pagination}
          renderCell={renderEmptyCell}
          flexHeight={props.autoFlex || props.height !== null}
          style={dataTableStyle.value}
          scrollX={autoScrollX.value ?? props.scrollX}
        />
      )

      if (props.simple !== false) return OriginDataTable

      return (
        <NFlex vertical style={flexHeightStyles.value}>
          {props.search !== false && (
            <NCard ref={searchRef}>
              <ProForm
                ref={searchFormRef}
                columns={searchColumns.value}
                mode="search"
                gridCols={3}
                labelPlacement="left"
                showFeedback={false}
                defaultValue={props.params}
                loading={searchLoading.value}
                {...props.search}
                onSubmit={handleSearch}
                onReset={handleReset}
              />
            </NCard>
          )}

          {slots['summary']?.()}

          <NCard
              title={props.title}
              style={cardFlexStyles.value ?? flexHeightStyles.value}
              contentStyle={cardFlexStyles.value}
          >
            {{
              'header-extra': () => (
                <Toolbar
                  v-model:size={size.value}
                  title={props.title}
                  config={toolbarCfg.value}
                  loading={props.loading}
                  formColumns={formColumns.value}
                  onExport={handleExportData}
                  onRefresh={handleRefresh}
                >
                  {slots['toolbar']?.()}
                </Toolbar>
              ),
              default: () => [
                slots['selection-action']?.(),
                OriginDataTable
              ]
            }}
          </NCard>
        </NFlex>
      )
    }
  },
})
