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
import { renderCopyableCell, renderEmptyCell, renderIndexCell, renderTitle } from '@/utils/table'
import { useTableColumns } from '@hooks/useTableColumns'
import { proTableProps, proTableEmits } from './types'
import './styles/css'

export default defineComponent({
  name: 'ProTable',
  props: proTableProps,
  emits: proTableEmits,
  setup(props, { emit, expose, slots }) {
    const message = useMessage()
    const tableProps = computed(() => {
      const p = { ...props }
      const excludeKeys = ['title', 'columns', 'searchConfig', 'toolbarConfig', 'search']
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
    } = useTableColumns(props.columns)

    provide('settingColumns', settingColumns)

    const toolbarConfig = computed(() => props.toolbarConfig)

    watchEffect(() => {
      tableColumns.value = settingColumns.value.map((column) => {
        if (column?.type === 'index') return renderIndexCell(column)
        if (column?.copyable) return renderCopyableCell(column)
        if (column?.tooltip && typeof column.title === 'string') {
          column.title = renderTitle(column)
        }
        return column
      })
    })

    type TableSize = 'small' | 'medium' | 'large'
    const size = ref<TableSize>('large')
    const searchFormRef = ref(null)
    const searchRef = ref(null)


    /**
     * 加载数据
     * @param page 页码
     */
    function loadData(page: number) {
      emit('loadData', page)
    }

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
    async function handleReset() {
      try {
        searchLoading.value = true
        emit('reset')
        if (searchFormRef.value) {
          await loadData(1)
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
      emit('exportData')
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
        />
      )

      if (props.simple !== false) return OriginDataTable

      return (
        <NFlex vertical>
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

          <div class="bm-card">
            <div class="bm-card_header">
              <div class="bm-card_header-title">{props.title}</div>
              <div class="bm-card_header-extra">
                <Toolbar
                  v-model:size={size.value}
                  title={props.title}
                  config={toolbarConfig.value}
                  loading={props.loading}
                  formColumns={formColumns.value}
                  onExport={handleExportData}
                  onRefresh={handleRefresh}
                >
                  {slots['toolbar']?.()}
                </Toolbar>
              </div>
            </div>

            <div class="bm-card_body">
              {slots['selection-action']?.()}
              {OriginDataTable}
            </div>
          </div>
        </NFlex>
      )
    }
  },
})
