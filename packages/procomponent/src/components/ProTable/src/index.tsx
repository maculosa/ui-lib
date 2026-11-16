import {
  NCard,
  NDataTable,
  NFlex,
  useMessage
} from 'naive-ui'
import { computed, defineComponent, onMounted, provide, ref, watch, watchEffect } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { ProForm } from '@components/ProForm'
import { Toolbar } from './components'
import { renderEmptyCell, renderIndexCell, estimateColumnWidth } from '@/utils/table'
import { useTableColumns } from '@hooks/useTableColumns'
import { applyColumnState } from './components/ColumnSetting'
import type { ColumnSettingState } from './components/ColumnSetting'
import { proTableProps, proTableEmits } from './types'
import './styles/css'

export default defineComponent({
  name: 'ProTable',
  props: proTableProps,
  emits: proTableEmits,
  setup(props, { emit, expose, slots }) {
    const message = useMessage()

    /**
     * 内部列配置:props.columns 变化时覆盖,
     * 同时作为 setColumns 的写入目标
     */
    const innerColumns = ref(props.columns)
    watch(
      () => props.columns,
      (columns) => {
        innerColumns.value = columns
      },
      { deep: true },
    )

    const excludeKeys = [
      'title',
      'columns',
      'searchConfig',
      'toolbarConfig',
      'toolbar',
      'search',
      'columnStorageKey',
      'request',
      'onQuery',
      'params',
      'searchModel',
      'autoFlex',
      'simple',
      'dataTableStyle',
      'height',
    ]
    const tableProps = computed(() => {
      const p: Record<string, any> = { ...props }
      excludeKeys.forEach(key => {
        delete p[key]
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
    const requestLoading = ref(false)
    const innerLoading = ref(false)
    const searchLoading = ref(false)

    watchEffect(() => {
      searchLoading.value = isRefreshing.value ? false : (props.loading || requestLoading.value)
    })

    const {
      tableColumns,
      settingColumns,
      searchColumns,
      formColumns,
    } = useTableColumns(innerColumns, {
      searchSort: props.search && props.search?.sort || 'desc',
    })

    provide('settingColumns', settingColumns)

    // 列设置面板实例:setColumnsState 通过它同步面板与表格
    const columnSettingRef = ref()
    provide('column-setting-ref', columnSettingRef)

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

    const searchConfig = computed<Record<string, any>>(() => {
      const config = props.search
      return config && typeof config === 'object' ? config as Record<string, any> : {}
    })

    // 搜索按钮文案:searchText > submitText > 默认
    const searchProps = computed(() => ({
      ...searchConfig.value,
      searchText: searchConfig.value.searchText ?? searchConfig.value.submitText ?? '搜索',
    }))

    // 重置目标值:实例创建时的 params/searchModel 快照 + search.defaultValue
    // 不能直接用实时 searchModelState,否则用户输入后再点重置会「重置为刚输入的值」
    const initialSearchModel = {
      ...(props.params || {}),
      ...(props.searchModel || {}),
    }
    const searchDefaults = computed(() => ({
      ...initialSearchModel,
      ...(searchConfig.value.defaultValue || {}),
    }))

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

    /**
     * 表格自身样式:
     * height 生成的 style < dataTableStyle < autoFlex 的 flex 规则,
     * 保证调用方可覆盖外观而 autoFlex 布局不被破坏。
     */
    const mergedTableStyle = computed(() => {
      const baseStyle = (tableProps.value as Record<string, any>).style
      const userStyle = props.dataTableStyle

      if (typeof userStyle === 'string' && !props.autoFlex) return userStyle

      let style: Record<string, any> = {}
      if (baseStyle && typeof baseStyle === 'object') {
        style = { ...baseStyle }
      }
      if (userStyle && typeof userStyle === 'object') {
        style = { ...style, ...userStyle }
      }
      if (props.autoFlex) {
        style = { ...style, flex: 1, minHeight: 0 }
      }

      return Object.keys(style).length > 0 ? style : undefined
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

    // ---------------- 数据状态 ----------------

    const innerData = ref<any[]>(props.data ?? [])
    watch(
      () => props.data,
      (data) => {
        innerData.value = (data as any[]) ?? []
      },
    )

    const effectiveLoading = computed(() => innerLoading.value || props.loading || requestLoading.value)

    // 查询模型:searchModel 优先于 params,并与搜索表单双向同步
    const searchModelState = ref<Record<string, any>>({
      ...(props.params || {}),
      ...(props.searchModel || {}),
    })

    function isSameModel(a?: Record<string, any>, b?: Record<string, any>) {
      return JSON.stringify(a ?? {}) === JSON.stringify(b ?? {})
    }

    watch(
      [() => props.params, () => props.searchModel],
      ([params, searchModel]) => {
        searchModelState.value = {
          ...(params || {}),
          ...(searchModel || {}),
        }
      },
      { deep: true },
    )

    // ---------------- 分页 / 排序 / 筛选 ----------------

    interface PaginationState {
      current: number
      pageSize: number
      itemCount?: number
    }

    const paginationState = ref<PaginationState>({ current: 1, pageSize: 10 })
    const paginationTouched = ref(false)

    watch(
      () => props.pagination,
      (pagination) => {
        if (!pagination || typeof pagination !== 'object') return
        paginationState.value = {
          current: (pagination as Record<string, any>).page ?? 1,
          pageSize: (pagination as Record<string, any>).pageSize ?? 10,
          itemCount: (pagination as Record<string, any>).itemCount,
        }
      },
      { deep: true, immediate: true },
    )

    const effectivePagination = computed(() => {
      if (props.pagination === false) return false
      // 非 request 模式且未主动分页时,保持原有透传行为
      if (!props.request && !paginationTouched.value) return props.pagination

      const base = props.pagination && typeof props.pagination === 'object'
        ? props.pagination as Record<string, any>
        : {}
      const merged: Record<string, any> = {
        ...base,
        page: paginationState.value.current,
        pageSize: paginationState.value.pageSize,
      }
      const itemCount = paginationState.value.itemCount ?? base.itemCount
      if (typeof itemCount === 'number') merged.itemCount = itemCount
      return merged
    })

    const sorterState = ref<any>(null)
    const filtersState = ref<Record<string, any[] | null>>({})

    function normalizeSorter(sorter: any) {
      const current = Array.isArray(sorter) ? sorter[0] : sorter
      if (!current || !current.order || current.order === false) return null
      return { columnKey: current.columnKey, order: current.order }
    }

    // ---------------- 选中状态 ----------------

    const checkedRowKeys = ref<(string | number)[]>([])
    const selectedRows = ref<any[]>([])
    const rowSelectionState = ref<Record<string, any> | undefined>((props as Record<string, any>).rowSelection)

    watch(
      () => (props as Record<string, any>).rowSelection,
      (rowSelection) => {
        rowSelectionState.value = rowSelection
      },
    )

    // ---------------- request 数据请求 ----------------

    let requestSeq = 0

    async function runRequest(options: { resetPage?: boolean } = {}) {
      if (!props.request) return
      if (options.resetPage) paginationState.value.current = 1

      const seq = ++requestSeq
      requestLoading.value = true
      try {
        const result = await props.request(
          {
            ...(props.params || {}),
            ...searchModelState.value,
            current: paginationState.value.current,
            pageSize: paginationState.value.pageSize,
          },
          normalizeSorter(sorterState.value),
          { ...filtersState.value },
        )
        // 丢弃过期响应,避免快速翻页 / 搜索时旧数据覆盖新数据
        if (seq !== requestSeq) return

        innerData.value = Array.isArray(result?.data) ? result.data : []
        if (typeof result?.total === 'number') {
          paginationState.value.itemCount = result.total
        }
      } catch (error) {
        if (seq === requestSeq) {
          console.error('Request failed:', error)
          message?.error('加载失败，请重试')
        }
      } finally {
        if (seq === requestSeq) requestLoading.value = false
      }
    }

    onMounted(() => {
      if (props.request) runRequest()
    })

    // params 变化触发重新加载,并回到第一页
    watch(
      () => props.params,
      () => {
        if (props.request) runRequest({ resetPage: true })
      },
      { deep: true },
    )

    // ---------------- 工具栏 / 搜索交互 ----------------

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
        if (props.request) {
          await runRequest()
        } else {
          loadData(1)
        }
      } catch (error) {
        console.error('Refresh failed:', error)
        message?.error('刷新失败，请重试')
      } finally {
        isRefreshing.value = false
      }
    }

    /**
     * onQuery 回调查询(保留 300ms 防抖)
     */
    const queryByCallback = useDebounceFn(async (formModel: Record<string, any>) => {
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
        message?.error('搜索失败，请重试')
      } finally {
        searchLoading.value = false
      }
    }, 300)

    /**
     * 搜索表单提交:同步抛出 submit / update:searchModel 后再走查询
     */
    function handleSubmit(formModel: Record<string, any>) {
      searchModelState.value = { ...formModel }
      filterData.value = { ...formModel }
      emit('submit', { ...formModel })
      emit('update:searchModel', { ...formModel })

      if (props.request) {
        runRequest({ resetPage: true })
        return
      }
      queryByCallback(formModel)
    }

    /**
     * 搜索表单数据变化(输入即同步,供 v-model:searchModel)
     */
    function handleModelUpdate(value: Record<string, any>) {
      if (!value || typeof value !== 'object') return
      if (isSameModel(value, searchModelState.value)) return
      searchModelState.value = { ...value }
      emit('update:searchModel', { ...value })
    }

    /**
     * 重置搜索表单
     */
    async function handleReset(searchParams?: Record<string, any>) {
      if (searchParams) {
        searchModelState.value = { ...searchParams }
        filterData.value = { ...searchParams }
        emit('update:searchModel', { ...searchParams })
      }
      emit('reset', searchParams ? { ...searchParams } : undefined)

      if (props.request) {
        await runRequest({ resetPage: true })
        return
      }

      try {
        searchLoading.value = true
        if (searchFormRef.value && searchParams && props.onQuery) {
          await props.onQuery(searchParams)
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

    /** 删除按钮:携带当前选中行 key */
    function handleDelete() {
      emit('delete', [...checkedRowKeys.value])
      checkedRowKeys.value = []
    }

    /** 打印:抛出事件后交给浏览器打印 */
    function handlePrint() {
      emit('print')
      window.print()
    }

    /** 导入:文件选择完成后抛出 File */
    function handleImport(file: File) {
      emit('import', file)
    }

    // ---------------- NDataTable 事件转发 ----------------

    function handlePage(page: number) {
      paginationTouched.value = true
      paginationState.value.current = page
      ;(props as Record<string, any>).onUpdatePage?.(page)
      if (props.request) runRequest()
    }

    function handlePageSize(pageSize: number) {
      paginationTouched.value = true
      paginationState.value.pageSize = pageSize
      paginationState.value.current = 1
      ;(props as Record<string, any>).onUpdatePageSize?.(pageSize)
      if (props.request) runRequest()
    }

    function handleSorter(sorter: any) {
      sorterState.value = sorter
      ;(props as Record<string, any>).onUpdateSorter?.(sorter)
      if (props.request) runRequest()
    }

    function handleFilters(filters: Record<string, any> | null) {
      filtersState.value = filters ?? {}
      ;(props as Record<string, any>).onUpdateFilters?.(filters)
      if (props.request) runRequest()
    }

    function handleCheckedRowKeys(keys: (string | number)[]) {
      checkedRowKeys.value = Array.isArray(keys) ? keys : []
      ;(props as Record<string, any>).onUpdateCheckedRowKeys?.(keys)
    }

    // ---------------- 实例方法 ----------------

    function reload() {
      if (props.request) return runRequest()
      loadData(1)
    }

    function setColumns(columns: any[]) {
      innerColumns.value = Array.isArray(columns) ? columns : []
    }

    function setSearch(values: Record<string, any>) {
      if (!values || typeof values !== 'object') return
      const next = { ...searchModelState.value, ...values }
      searchModelState.value = next
      emit('update:searchModel', { ...next })
    }

    function setForm(values: Record<string, any>) {
      setSearch(values)
    }

    function setPagination(pagination: Record<string, any>) {
      if (!pagination || typeof pagination !== 'object') return
      paginationTouched.value = true
      paginationState.value = {
        current: pagination.page ?? pagination.current ?? paginationState.value.current,
        pageSize: pagination.pageSize ?? paginationState.value.pageSize,
        itemCount: pagination.itemCount ?? paginationState.value.itemCount,
      }
      if (props.request) runRequest()
    }

    function setTableData(data: any[]) {
      innerData.value = Array.isArray(data) ? data : []
    }

    function setLoading(loading: boolean) {
      innerLoading.value = Boolean(loading)
    }

    function setSelectedRowKeys(keys: (string | number)[]) {
      checkedRowKeys.value = Array.isArray(keys) ? keys : []
    }

    function setSelectedRows(rows: any[]) {
      selectedRows.value = Array.isArray(rows) ? rows : []
    }

    function setRowSelection(rowSelection: Record<string, any>) {
      rowSelectionState.value = {
        ...(rowSelectionState.value || {}),
        ...(rowSelection || {}),
      }
    }

    function setColumnsState(state: ColumnSettingState | null) {
      if (columnSettingRef.value?.applyState) {
        columnSettingRef.value.applyState(state)
        return
      }
      settingColumns.value = applyColumnState(innerColumns.value, state)
        .map(column => (column?.type === 'index' ? renderIndexCell(column) : column))
    }

    expose({
      size,
      searchFormRef,
      searchRef,
      reload,
      setColumns,
      setSearch,
      setForm,
      setPagination,
      setTableData,
      setLoading,
      setSelectedRowKeys,
      setSelectedRows,
      setRowSelection,
      setColumnsState,
    })

    return () => {
      const OriginDataTable = (
        <NDataTable
          {...tableProps.value}
          data={innerData.value}
          columns={tableColumns.value}
          size={size.value}
          loading={effectiveLoading.value}
          pagination={effectivePagination.value}
          renderCell={renderEmptyCell}
          flexHeight={props.autoFlex || props.height != null}
          style={mergedTableStyle.value}
          remote={Boolean(props.request)}
          scrollX={autoScrollX.value ?? props.scrollX}
          onUpdateCheckedRowKeys={handleCheckedRowKeys}
          onUpdatePage={handlePage}
          onUpdatePageSize={handlePageSize}
          onUpdateSorter={handleSorter}
          onUpdateFilters={handleFilters}
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
                defaultValue={searchDefaults.value}
                model={searchModelState.value}
                loading={searchLoading.value}
                {...searchProps.value}
                onSubmit={handleSubmit}
                onReset={handleReset}
                onUpdate:model={handleModelUpdate}
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
                  loading={effectiveLoading.value}
                  formColumns={formColumns.value}
                  deleteDisabled={checkedRowKeys.value.length === 0}
                  onExport={handleExportData}
                  onRefresh={handleRefresh}
                  onDelete={handleDelete}
                  onPrint={handlePrint}
                  onImport={handleImport}
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
