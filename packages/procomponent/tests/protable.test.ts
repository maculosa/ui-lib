import { flushPromises, mount } from '@vue/test-utils'
import { NDataTable, NMessageProvider } from 'naive-ui'
import { defineComponent, h, nextTick, reactive } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ProTable from '../src/components/ProTable/src'
import ProForm from '../src/components/ProForm/src'

vi.mock('vue3-text-clamp', async () => {
  const { defineComponent, h } = await import('vue')
  return {
    default: defineComponent({
      name: 'TextClamp',
      render: () => h('span'),
    }),
  }
})

vi.mock('@iconify/vue', async () => {
  const { defineComponent, h } = await import('vue')
  return {
    Icon: defineComponent({
      name: 'Icon',
      render: () => h('span'),
    }),
  }
})

const baseColumns = [
  { title: '姓名', key: 'name', valueType: 'text' },
  { title: '年龄', key: 'age', valueType: 'digit' },
]

function mountTable(initial: Record<string, any> = {}) {
  const state = reactive({ columns: baseColumns, ...initial })
  const wrapper = mount(
    defineComponent({
      render: () => h(NMessageProvider, null, { default: () => h(ProTable as any, state) }),
    }),
    { attachTo: document.body },
  )
  return {
    wrapper,
    state,
    table: () => wrapper.findComponent(ProTable as any),
    dataTable: () => wrapper.findComponent(NDataTable),
    form: () => wrapper.findComponent(ProForm as any),
  }
}

function toolbarButton(wrapper: ReturnType<typeof mountTable>['wrapper'], label: string) {
  return wrapper.findAll('button').find(button => button.text().includes(label))
}

/** 取组件 expose 出来的公开 API(与调用方通过 ref 得到的 exposeProxy 一致) */
function exposedApi(wrapper: ReturnType<typeof mountTable>['wrapper']) {
  const vm = wrapper.findComponent(ProTable as any).vm as any
  return vm.$.exposeProxy ?? vm.$.exposed
}

afterEach(() => {
  document.body.replaceChildren()
  localStorage.clear()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('ProTable request mode', () => {
  it('fetches on mount with merged params and renders the returned rows', async () => {
    const request = vi.fn().mockResolvedValue({ data: [{ name: '张三' }], total: 1 })
    mountTable({ request, params: { keyword: 'x' } })
    await flushPromises()

    expect(request).toHaveBeenCalledTimes(1)
    expect(request.mock.calls[0][0]).toMatchObject({ current: 1, pageSize: 10, keyword: 'x' })
  })

  it('renders the data returned by request', async () => {
    const request = vi.fn().mockResolvedValue({ data: [{ name: '张三' }], total: 1 })
    const { wrapper } = mountTable({ request })
    await flushPromises()

    expect(wrapper.text()).toContain('张三')
  })

  it('refetches when the page changes', async () => {
    const request = vi.fn().mockResolvedValue({ data: [], total: 50 })
    const { dataTable } = mountTable({ request })
    await flushPromises()

    dataTable().props('onUpdatePage')?.(2)
    await flushPromises()

    expect(request).toHaveBeenCalledTimes(2)
    expect(request.mock.calls[1][0]).toMatchObject({ current: 2, pageSize: 10 })
  })

  it('refetches from page 1 when params change', async () => {
    const request = vi.fn().mockResolvedValue({ data: [], total: 50 })
    const { state } = mountTable({ request })
    await flushPromises()

    state.params = { keyword: 'b' }
    await flushPromises()

    expect(request).toHaveBeenCalledTimes(2)
    expect(request.mock.calls[1][0]).toMatchObject({ current: 1, keyword: 'b' })
  })

  it('forwards sorter and filters to request', async () => {
    const request = vi.fn().mockResolvedValue({ data: [], total: 0 })
    const { dataTable } = mountTable({ request })
    await flushPromises()

    dataTable().props('onUpdateSorter')?.({ columnKey: 'name', order: 'ascend' })
    dataTable().props('onUpdateFilters')?.({ name: ['张三'] })
    await flushPromises()

    const lastCall = request.mock.calls.at(-1)
    expect(lastCall?.[1]).toMatchObject({ columnKey: 'name', order: 'ascend' })
    expect(lastCall?.[2]).toMatchObject({ name: ['张三'] })
  })

  it('drops the response of a stale request', async () => {
    let resolveFirst: (value: any) => void = () => {}
    const first = new Promise(resolve => {
      resolveFirst = resolve
    })
    const request = vi
      .fn()
      .mockImplementationOnce(() => first)
      .mockResolvedValueOnce({ data: [{ name: '第二页' }], total: 2 })

    const { wrapper, dataTable } = mountTable({ request })
    dataTable().props('onUpdatePage')?.(2)
    await flushPromises()

    resolveFirst({ data: [{ name: '第一页' }], total: 2 })
    await flushPromises()

    expect(wrapper.text()).toContain('第二页')
    expect(wrapper.text()).not.toContain('第一页')
  })
})

describe('ProTable search model', () => {
  it('emits submit and update:searchModel when the search button is clicked', async () => {
    const { wrapper, form } = mountTable()
    await flushPromises()

    const input = form().findAll('input')[0]
    await input.setValue('张三')
    await flushPromises()

    const buttons = form().findAll('button')
    const searchButton = buttons.find(button => button.text().includes('搜索'))
    await searchButton!.trigger('click')
    await flushPromises()

    expect(wrapper.findComponent(ProTable as any).emitted('submit')?.at(-1)?.[0]).toMatchObject({ name: '张三' })
    expect(wrapper.findComponent(ProTable as any).emitted('update:searchModel')?.at(-1)?.[0]).toMatchObject({
      name: '张三',
    })
  })

  it('emits reset with the reset form values when the reset button is clicked', async () => {
    const { wrapper, form } = mountTable()
    await flushPromises()

    const input = form().findAll('input')[0]
    await input.setValue('张三')
    await flushPromises()

    const resetButton = form().findAll('button').find(button => button.text().includes('重置'))
    await resetButton!.trigger('click')
    await flushPromises()

    expect(wrapper.findComponent(ProTable as any).emitted('reset')?.at(-1)?.[0]).toMatchObject({ name: '' })
    expect(wrapper.findComponent(ProTable as any).emitted('update:searchModel')?.at(-1)?.[0]).toMatchObject({
      name: '',
    })
  })

  it('initializes the form from the searchModel prop and follows external changes', async () => {
    const { wrapper, state, form } = mountTable({ searchModel: { name: '李四' } })
    await flushPromises()

    expect((form().findAll('input')[0].element as HTMLInputElement).value).toBe('李四')

    state.searchModel = { name: '王五' }
    await flushPromises()

    expect((form().findAll('input')[0].element as HTMLInputElement).value).toBe('王五')
    expect(wrapper.findComponent(ProTable as any).emitted('update:searchModel')).toBeUndefined()
  })

  it('uses submitText as the search button label when searchText is absent', async () => {
    const { form } = mountTable({ search: { submitText: '查询数据' } })
    await flushPromises()

    expect(form().findAll('button').some(button => button.text().includes('查询数据'))).toBe(true)
  })

  it('hides the reset button when showResetButton is false', async () => {
    const { form } = mountTable({ search: { showResetButton: false } })
    await flushPromises()

    expect(form().findAll('button').some(button => button.text().includes('重置'))).toBe(false)
  })

  it('hides the advanced toggle when showAdvancedButton is false', async () => {
    const { form } = mountTable({ search: { showAdvancedButton: false } })
    await flushPromises()

    expect(form().findAll('button').some(button => button.text().includes('展开'))).toBe(false)
    expect(form().findAll('button').some(button => button.text().includes('折叠'))).toBe(false)
  })
})

describe('ProTable toolbar', () => {
  it('emits delete with the checked row keys', async () => {
    const { wrapper, state, dataTable } = mountTable({ toolbar: { delete: true } })
    await flushPromises()

    const deleteButton = toolbarButton(wrapper, '删除')
    expect(deleteButton).toBeTruthy()
    expect(deleteButton!.attributes('disabled')).toBeDefined()

    state.columns = [
      { type: 'selection' },
      { title: '姓名', key: 'name', valueType: 'text' },
    ]
    await flushPromises()
    dataTable().props('onUpdateCheckedRowKeys')?.(['1', '2'])
    await flushPromises()

    expect(toolbarButton(wrapper, '删除')!.attributes('disabled')).toBeUndefined()

    await toolbarButton(wrapper, '删除')!.trigger('click')

    expect(wrapper.findComponent(ProTable as any).emitted('delete')?.at(-1)?.[0]).toEqual(['1', '2'])
    expect(toolbarButton(wrapper, '删除')!.attributes('disabled')).toBeDefined()
  })

  it('calls window.print and emits print', async () => {
    const printMock = vi.fn()
    vi.stubGlobal('print', printMock)

    const { wrapper } = mountTable({ toolbar: { print: true } })
    await flushPromises()

    await toolbarButton(wrapper, '打印')!.trigger('click')

    expect(printMock).toHaveBeenCalled()
    expect(wrapper.findComponent(ProTable as any).emitted('print')).toHaveLength(1)
  })

  it('emits the selected file when importing', async () => {
    const { wrapper } = mountTable({ toolbar: { import: true } })
    await flushPromises()

    const input = wrapper.find('input[type="file"]')
    expect(input.exists()).toBe(true)

    const file = new File(['name,age'], 'data.csv', { type: 'text/csv' })
    Object.defineProperty(input.element, 'files', { configurable: true, value: [file] })
    await input.trigger('change')

    expect(wrapper.findComponent(ProTable as any).emitted('import')?.at(-1)?.[0]).toBe(file)
  })

  it('reacts to toolbar config changes', async () => {
    const { wrapper, state } = mountTable({ toolbar: {} })
    await flushPromises()

    expect(toolbarButton(wrapper, '新增')).toBeUndefined()

    state.toolbar = { create: true }
    await flushPromises()

    expect(toolbarButton(wrapper, '新增')).toBeTruthy()
  })
})

describe('ProTable table props', () => {
  it('applies dataTableStyle to the table while keeping the height style', async () => {
    const { dataTable } = mountTable({
      height: 300,
      dataTableStyle: { color: 'rgb(255, 0, 0)' },
    })
    await flushPromises()

    const element = dataTable().element as HTMLElement
    expect(element.style.height).toBe('300px')
    expect(element.style.color).toBe('rgb(255, 0, 0)')
  })
})

describe('ProTable dynamic columns', () => {
  it('rebuilds table and search columns when columns are replaced', async () => {
    const { wrapper, state } = mountTable()
    await flushPromises()
    expect(wrapper.text()).toContain('年龄')

    state.columns = [
      { title: '姓名', key: 'name', valueType: 'text' },
      { title: '邮箱', key: 'email', valueType: 'text' },
    ]
    await flushPromises()

    expect(wrapper.text()).toContain('邮箱')
    expect(wrapper.text()).not.toContain('年龄')
  })
})

describe('ProTable instance API', () => {
  it('updates data and loading through setTableData and setLoading', async () => {
    const { wrapper, dataTable } = mountTable()
    await flushPromises()
    const api = exposedApi(wrapper)

    api.setTableData([{ name: '实例数据' }])
    api.setLoading(true)
    await flushPromises()

    expect(wrapper.text()).toContain('实例数据')
    expect(dataTable().props('loading')).toBe(true)
  })

  it('replaces columns through setColumns', async () => {
    const { wrapper } = mountTable()
    await flushPromises()

    exposedApi(wrapper).setColumns([{ title: '工号', key: 'code', valueType: 'text' }])
    await flushPromises()

    expect(wrapper.text()).toContain('工号')
    expect(wrapper.text()).not.toContain('姓名')
  })

  it('refetches with the new pagination through setPagination', async () => {
    const request = vi.fn().mockResolvedValue({ data: [], total: 100 })
    const { wrapper } = mountTable({ request })
    await flushPromises()

    exposedApi(wrapper).setPagination({ current: 3, pageSize: 20 })
    await flushPromises()

    expect(request.mock.calls.at(-1)?.[0]).toMatchObject({ current: 3, pageSize: 20 })
  })

  it('updates the form and emits update:searchModel through setSearch', async () => {
    const { wrapper, form } = mountTable()
    await flushPromises()

    exposedApi(wrapper).setSearch({ name: '赵六' })
    await flushPromises()

    expect((form().findAll('input')[0].element as HTMLInputElement).value).toBe('赵六')
    expect(wrapper.findComponent(ProTable as any).emitted('update:searchModel')?.at(-1)?.[0]).toMatchObject({
      name: '赵六',
    })
  })

  it('hides columns through setColumnsState', async () => {
    const { wrapper } = mountTable()
    await flushPromises()

    exposedApi(wrapper).setColumnsState({ order: ['name', 'age'], hidden: ['age'] })
    await flushPromises()

    expect(wrapper.text()).toContain('姓名')
    expect(wrapper.findAll('th').some(th => th.text() === '年龄')).toBe(false)
  })
})

describe('ProTable column storage fallback', () => {
  function mountWithGlobals(global: Record<string, any>) {
    return mount(
      defineComponent({
        render: () => h(NMessageProvider, null, { default: () => h(ProTable as any, { columns: baseColumns }) }),
      }),
      { attachTo: document.body, global },
    )
  }

  it('uses the current route name when columnStorageKey is omitted', async () => {
    // 与 vue-router 安装方式一致:$route 挂在全局属性上
    mountWithGlobals({ config: { globalProperties: { $route: { name: 'user-list' } } } })
    await flushPromises()

    expect(localStorage.getItem('pro-table:column-setting:user-list')).toBeTruthy()
  })

  it('falls back to a random key outside a router', async () => {
    mountWithGlobals({})
    await flushPromises()

    const keys = Object.keys(localStorage).filter(key => key.startsWith('pro-table:column-setting:'))
    expect(keys).toHaveLength(1)
    expect(keys[0]).toMatch(/^pro-table:column-setting:auto-/)
  })
})
