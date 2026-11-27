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

describe('ColumnSetting declaration order', () => {
  const columns = [
    { title: '车牌', key: 'plate_no' },
    { title: '车架号', key: 'vin_no' },
    { title: '状态', key: 'state' },
  ]

  it('follows the latest declaration order when the user never reordered', async () => {
    // 保存的 order 与保存时的声明快照一致 → 用户没拖过,应跟随代码最新顺序
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        order: ['plate_no', 'state', 'vin_no'],
        declaredOrder: ['plate_no', 'state', 'vin_no'],
        hidden: [],
      }),
    )

    // 代码里把 state 移到了 vin_no 之后
    const { wrapper } = mountSetting(columns)
    await flushPromises()

    expect(visibleKeys(wrapper)).toEqual(['plate_no', 'vin_no', 'state'])
  })

  it('keeps hidden columns hidden when following the latest declaration order', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        order: ['plate_no', 'vin_no', 'state'],
        declaredOrder: ['plate_no', 'vin_no', 'state'],
        hidden: ['state'],
      }),
    )

    const { wrapper } = mountSetting(columns)
    await flushPromises()

    expect(visibleKeys(wrapper)).toEqual(['plate_no', 'vin_no'])
  })

  it('migrates legacy state without a declaration snapshot to the latest declaration order', async () => {
    // 旧版本缓存没有 declaredOrder:无法区分默认顺序与用户拖拽,统一按未自定义迁移
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        order: ['plate_no', 'state', 'vin_no'],
        hidden: ['state'],
      }),
    )

    const { wrapper } = mountSetting(columns)
    await flushPromises()

    // 排序回到代码声明顺序,隐藏状态保留
    expect(visibleKeys(wrapper)).toEqual(['plate_no', 'vin_no'])

    // 迁移后立即回写声明快照,后续按新 schema 判断
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) as string)
    expect(saved.order).toEqual(['plate_no', 'vin_no', 'state'])
    expect(saved.declaredOrder).toEqual(['plate_no', 'vin_no', 'state'])
    expect(saved.hidden).toEqual(['state'])
  })

  it('keeps the user order when it differs from the saved declaration', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        order: ['vin_no', 'plate_no', 'state'],
        declaredOrder: ['plate_no', 'state', 'vin_no'],
        hidden: [],
      }),
    )

    const { wrapper } = mountSetting(columns)
    await flushPromises()

    expect(visibleKeys(wrapper)).toEqual(['vin_no', 'plate_no', 'state'])
  })
})

describe('ColumnSetting fixed columns', () => {
  const columns = [
    { title: '车牌', key: 'plate_no' },
    { title: '车架号', key: 'vin_no' },
    { title: '状态', key: 'state' },
  ]

  function lastColumns(wrapper: ReturnType<typeof mountSetting>['wrapper']) {
    const emitted = wrapper.findComponent(ColumnSetting as any).emitted('update:columns')
    return (emitted?.at(-1)?.[0] ?? []) as any[]
  }

  it('groups left/right fixed columns to both ends of the output', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        order: ['plate_no', 'vin_no', 'state'],
        declaredOrder: ['plate_no', 'vin_no', 'state'],
        hidden: [],
        fixed: { plate_no: null, vin_no: 'left', state: 'right' },
      }),
    )

    const { wrapper } = mountSetting(columns)
    await flushPromises()

    const emitted = lastColumns(wrapper)
    expect(emitted.map(column => column.key)).toEqual(['vin_no', 'plate_no', 'state'])
    expect(emitted.map(column => column.fixed ?? null)).toEqual(['left', null, 'right'])
  })

  it('keeps the fixed side declared in the column config by default', async () => {
    const { wrapper } = mountSetting([
      { title: '车牌', key: 'plate_no', fixed: 'left' },
      { title: '车架号', key: 'vin_no' },
    ])
    await flushPromises()

    const emitted = lastColumns(wrapper)
    expect(emitted.map(column => column.key)).toEqual(['plate_no', 'vin_no'])
    expect(emitted[0].fixed).toBe('left')
  })

  it('lets the saved state override a declared fixed side', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        order: ['plate_no', 'vin_no'],
        declaredOrder: ['plate_no', 'vin_no'],
        hidden: [],
        fixed: { plate_no: null, vin_no: 'right' },
      }),
    )

    const { wrapper } = mountSetting([
      { title: '车牌', key: 'plate_no', fixed: 'left' },
      { title: '车架号', key: 'vin_no' },
    ])
    await flushPromises()

    const emitted = lastColumns(wrapper)
    // 右固定列排到末尾,取消固定后不再保留声明里的 fixed
    expect(emitted.map(column => column.key)).toEqual(['plate_no', 'vin_no'])
    expect(emitted[0].fixed).toBeUndefined()
    expect(emitted[1].fixed).toBe('right')
  })

  it('toggles and persists the fixed side through the panel buttons', async () => {
    const { wrapper } = mountSetting(columns)
    await flushPromises()

    // 打开列设置面板
    await wrapper.find('button').trigger('click')
    await flushPromises()

    const buttons = document.querySelectorAll('.column-fixed-btn')
    expect(buttons.length).toBe(columns.length * 2)
    ;(buttons[0] as HTMLElement).click()
    await flushPromises()

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) as string)
    expect(saved.fixed).toEqual({ plate_no: 'left', vin_no: null, state: null })
    expect(lastColumns(wrapper)[0].fixed).toBe('left')
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
