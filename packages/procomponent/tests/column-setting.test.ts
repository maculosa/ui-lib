import { flushPromises, mount } from '@vue/test-utils'
import { NConfigProvider, NDataTable, NMessageProvider } from 'naive-ui'
import { defineComponent, h, reactive } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ColumnSetting from '../src/components/ProTable/src/components/ColumnSetting'
import ProTable from '../src/components/ProTable/src'

vi.mock('vue3-text-clamp', async () => {
  const { defineComponent, h } = await import('vue')
  return {
    default: defineComponent({ name: 'TextClamp', render: () => h('span') }),
  }
})

vi.mock('@iconify/vue', async () => {
  const { defineComponent, h } = await import('vue')
  return {
    Icon: defineComponent({ name: 'Icon', render: () => h('span') }),
  }
})

const STORAGE_KEY = 'pro-table:column-setting:test'

function mountSetting(columns: any[], storageKey = 'test') {
  const state = reactive({ columns })
  const wrapper = mount(
    defineComponent({
      render: () =>
        h(NConfigProvider, null, {
          default: () =>
            h(ColumnSetting as any, {
              ...state,
              storageKey,
            } as any),
        }),
    }),
    { attachTo: document.body },
  )
  return { wrapper, state }
}

function visibleKeys(wrapper: ReturnType<typeof mountSetting>['wrapper']) {
  const emitted = wrapper.findComponent(ColumnSetting as any).emitted('update:columns')
  const last = emitted?.at(-1)?.[0] as any[] | undefined
  return (last ?? []).map(column => column.key)
}

function visibleTitles(wrapper: ReturnType<typeof mountSetting>['wrapper']) {
  const emitted = wrapper.findComponent(ColumnSetting as any).emitted('update:columns')
  const last = emitted?.at(-1)?.[0] as any[] | undefined
  return (last ?? []).map(column => column.title)
}

afterEach(() => {
  localStorage.clear()
  document.body.replaceChildren()
})

describe('ColumnSetting persistence', () => {
  it('shows a newly added column even when older state is persisted', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ order: ['name', 'age'], hidden: ['age'] }),
    )

    const columns = [
      { title: '姓名', key: 'name' },
      { title: '年龄', key: 'age' },
      { title: '邮箱', key: 'email' },
    ]
    const { wrapper } = mountSetting(columns)
    await flushPromises()

    expect(visibleKeys(wrapper)).toEqual(['name', 'email'])
  })
})

describe('ColumnSetting keyless columns', () => {
  it('does not let a stale index-based hidden entry hide a newly inserted keyless column', async () => {
    // 旧版本:无 key 的「操作」列位于下标 2,用户将其隐藏
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ order: ['index', 'name', '__col_2'], hidden: ['__col_2'] }),
    )

    // 新版本在下标 2 插入了新的无 key 列「状态」,「操作」后移到下标 3
    const columns = [
      { type: 'index', title: '序号' },
      { title: '姓名', key: 'name' },
      { title: '状态' },
      { title: '操作' },
    ]
    const { wrapper } = mountSetting(columns)
    await flushPromises()

    expect(visibleTitles(wrapper)).toEqual(['序号', '姓名', '状态', '操作'])
  })

  it('keeps keyless column hidden state stable when a column is inserted before it', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ order: ['name', '__title_操作'], hidden: ['__title_操作'] }),
    )

    const columns = [
      { title: '姓名', key: 'name' },
      { title: '状态' },
      { title: '操作' },
    ]
    const { wrapper } = mountSetting(columns)
    await flushPromises()

    expect(visibleTitles(wrapper)).toEqual(['姓名', '状态'])
  })
})

describe('ColumnSetting new column order', () => {
  it('places a new column at its declared position instead of the end', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ order: ['name', 'age'], hidden: [] }),
    )

    const columns = [
      { title: '姓名', key: 'name' },
      { title: '邮箱', key: 'email' },
      { title: '年龄', key: 'age' },
    ]
    const { wrapper } = mountSetting(columns)
    await flushPromises()

    expect(visibleTitles(wrapper)).toEqual(['姓名', '邮箱', '年龄'])
  })
})

describe('ProTable column persistence integration', () => {
  function mountProTable(columns: any[]) {
    const state = reactive({ columns })
    const wrapper = mount(
      defineComponent({
        render: () =>
          h(NMessageProvider, null, {
            default: () =>
              h(ProTable as any, {
                columnStorageKey: 'e2e',
                ...state,
              } as any),
          }),
      }),
      { attachTo: document.body },
    )
    return { wrapper, state }
  }

  function renderedColumnKeys(wrapper: ReturnType<typeof mountProTable>['wrapper']) {
    const columns = wrapper.findComponent(NDataTable).props('columns') as any[]
    return columns.map(column => column.key)
  }

  it('renders a newly added column under persisted older state', async () => {
    localStorage.setItem(
      STORAGE_KEY.replace('test', 'e2e'),
      JSON.stringify({ order: ['name', 'age'], hidden: ['age'] }),
    )

    const { wrapper } = mountProTable([
      { title: '姓名', key: 'name' },
      { title: '年龄', key: 'age' },
      { title: '邮箱', key: 'email' },
    ])
    await flushPromises()

    expect(renderedColumnKeys(wrapper)).toEqual(['name', 'email'])
  })
})
