import { flushPromises, mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import QueryFilter from '../src/components/QueryFilter/src'
import type { QueryFilterColumn } from '../src/components/QueryFilter'

afterEach(() => {
  document.body.replaceChildren()
  vi.restoreAllMocks()
})

async function settle() {
  await nextTick()
  await flushPromises()
  await nextTick()
}

function findButton(text: string) {
  return Array.from(document.body.querySelectorAll<HTMLButtonElement>('button'))
    .find(button => button.textContent?.trim() === text)
}

function labelTexts() {
  return Array.from(document.body.querySelectorAll('.n-form-item-label'))
    .map(node => node.textContent?.trim())
}

const textColumns: QueryFilterColumn[] = [
  { key: 'keyword', title: '关键词', valueType: 'text' },
  { key: 'name', title: '姓名', valueType: 'text' },
]

describe('QueryFilter 默认值与重置', () => {
  it('按字段类型初始化空值，并允许 defaultValue 覆盖', async () => {
    const wrapper = mount(QueryFilter, {
      props: {
        columns: [
          { key: 'keyword', title: '关键词', valueType: 'text' },
          { key: 'status', title: '状态', valueType: 'select' },
          { key: 'enabled', title: '启用', valueType: 'checkbox' },
          { key: 'tags', title: '标签', valueType: 'checkboxGroup' },
          { key: 'range', title: '日期', valueType: 'dateRange' },
          { key: 'age', title: '年龄', valueType: 'digit' },
          { key: 'active', title: '激活', valueType: 'switch' },
        ],
        defaultValue: { status: 'active' },
      },
      attachTo: document.body,
    })
    await settle()

    expect((wrapper.vm as any).getValues()).toEqual({
      keyword: '',
      status: 'active',
      enabled: false,
      tags: [],
      range: null,
      age: null,
      active: false,
    })
  })

  it('重置恢复默认值并抛出 reset', async () => {
    const wrapper = mount(QueryFilter, {
      props: { columns: textColumns, defaultValue: { keyword: '默认值' } },
      attachTo: document.body,
    })
    await settle()

    ;(wrapper.vm as any).setFieldValue('keyword', '改了')
    await nextTick()
    expect((wrapper.vm as any).getValues().keyword).toBe('改了')

    ;(wrapper.vm as any).reset()
    await settle()

    expect((wrapper.vm as any).getValues().keyword).toBe('默认值')
    const resetEvents = wrapper.emitted('reset') as any[]
    expect(resetEvents.at(-1)?.[0]).toMatchObject({ keyword: '默认值' })
    const modelEvents = wrapper.emitted('update:modelValue') as any[]
    expect(modelEvents.at(-1)?.[0]).toMatchObject({ keyword: '默认值' })
  })

  it('searchOnReset 打开时重置后自动查询', async () => {
    const wrapper = mount(QueryFilter, {
      props: { columns: textColumns, searchOnReset: true, defaultValue: { keyword: 'abc' } },
      attachTo: document.body,
    })
    await settle()

    findButton('重置')?.click()
    await settle()

    const searchEvents = wrapper.emitted('search') as any[]
    expect(searchEvents).toHaveLength(1)
    expect(searchEvents[0][0]).toMatchObject({ keyword: 'abc' })
  })
})

describe('QueryFilter 列配置', () => {
  it('过滤 hideInSearch 并按 order 稳定排序', async () => {
    mount(QueryFilter, {
      props: {
        columns: [
          { key: 'b', title: '第二', valueType: 'text', order: 2 },
          { key: 'a', title: '无排序', valueType: 'text' },
          { key: 'c', title: '第一', valueType: 'text', order: 1 },
          { key: 'hidden', title: '隐藏列', valueType: 'text', hideInSearch: true },
        ],
      },
      attachTo: document.body,
    })
    await settle()

    expect(labelTexts()).toEqual(['第一', '第二', '无排序'])
  })

  it('column.placeholder 与 column.grid 生效', async () => {
    const wrapper = mount(QueryFilter, {
      props: {
        columns: [
          { key: 'keyword', title: '关键词', valueType: 'text', placeholder: '搜索姓名' },
          { key: 'remark', title: '备注', valueType: 'text', grid: 2 },
        ],
        gridCols: 3,
      },
      attachTo: document.body,
    })
    await settle()

    const input = document.body.querySelector<HTMLInputElement>('input')
    expect(input?.placeholder).toBe('搜索姓名')

    expect(document.body.querySelector('.n-grid > div[style*="span 2"]')).toBeTruthy()
  })

  it('card=false 时不渲染 NCard', async () => {
    const wrapper = mount(QueryFilter, {
      props: { columns: textColumns, card: false },
      attachTo: document.body,
    })
    await settle()

    expect(wrapper.find('.n-card').exists()).toBe(false)
  })
})

describe('QueryFilter 值模型', () => {
  it('输入变化抛出 update:modelValue 与 field-change', async () => {
    const wrapper = mount(QueryFilter, {
      props: { columns: textColumns },
      attachTo: document.body,
    })
    await settle()

    const input = document.body.querySelector<HTMLInputElement>('input')!
    input.value = 'hello'
    input.dispatchEvent(new Event('input'))
    await settle()

    const modelEvents = wrapper.emitted('update:modelValue') as any[]
    expect(modelEvents.at(-1)?.[0]).toMatchObject({ keyword: 'hello' })

    const fieldEvents = wrapper.emitted('field-change') as any[]
    expect(fieldEvents.at(-1)?.slice(0, 2)).toEqual(['keyword', 'hello'])
  })

  it('受控 modelValue 同步到控件', async () => {
    const wrapper = mount(QueryFilter, {
      props: {
        columns: [
          { key: 'keyword', title: '关键词', valueType: 'text' },
          { key: 'enabled', title: '启用', valueType: 'checkbox' },
        ],
        modelValue: { keyword: 'init', enabled: true },
      },
      attachTo: document.body,
    })
    await settle()

    expect(document.body.querySelector<HTMLInputElement>('input')?.value).toBe('init')
    expect(document.body.querySelector('[role="checkbox"]')?.getAttribute('aria-checked')).toBe('true')

    await wrapper.setProps({ modelValue: { keyword: 'next', enabled: false } })
    await settle()

    expect(document.body.querySelector<HTMLInputElement>('input')?.value).toBe('next')
    expect(document.body.querySelector('[role="checkbox"]')?.getAttribute('aria-checked')).toBe('false')
  })
})

describe('QueryFilter 交互与实例方法', () => {
  it('点击查询抛出 search，loading 时按钮禁用', async () => {
    const wrapper = mount(QueryFilter, {
      props: { columns: textColumns, loading: true },
      attachTo: document.body,
    })
    await settle()

    const searchButton = findButton('查询')!
    expect(searchButton.disabled).toBe(true)

    await wrapper.setProps({ loading: false })
    await settle()
    findButton('查询')?.click()
    await settle()

    const events = wrapper.emitted('search') as any[]
    expect(events.at(-1)?.[0]).toMatchObject({ keyword: '' })
  })

  it('beforeSearch 返回 false 时拦截查询', async () => {
    const beforeSearch = vi.fn(async () => false)
    const wrapper = mount(QueryFilter, {
      props: { columns: textColumns, beforeSearch },
      attachTo: document.body,
    })
    await settle()

    ;(wrapper.vm as any).search()
    await settle()

    expect(beforeSearch).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('search')).toBeUndefined()
  })

  it('setValues 支持合并与整体替换', async () => {
    const wrapper = mount(QueryFilter, {
      props: { columns: textColumns, defaultValue: { keyword: 'k' } },
      attachTo: document.body,
    })
    await settle()

    ;(wrapper.vm as any).setValues({ name: 'n' })
    expect((wrapper.vm as any).getValues()).toMatchObject({ keyword: 'k', name: 'n' })

    ;(wrapper.vm as any).setValues({ name: 'only' }, false)
    expect((wrapper.vm as any).getValues()).toMatchObject({ keyword: '', name: 'only' })
  })

  it('折叠按钮受控抛出 update:collapsed', async () => {
    const columns = Array.from({ length: 5 }, (_, index) => ({
      key: `field${index}`,
      title: `字段${index}`,
      valueType: 'text' as const,
    }))
    const wrapper = mount(QueryFilter, {
      props: {
        columns,
        gridCols: 2,
        collapsed: false,
        formConfig: { gridCollapsedRows: 1 },
      },
      attachTo: document.body,
    })
    await settle()

    findButton('折叠')?.click()
    await settle()

    const events = wrapper.emitted('update:collapsed') as any[]
    expect(events.at(-1)?.[0]).toBe(true)

    await wrapper.setProps({ collapsed: true })
    await settle()
    expect(findButton('展开')).toBeTruthy()
  })

  it('showAdvancedButton=false 时不渲染折叠按钮', async () => {
    const columns = Array.from({ length: 5 }, (_, index) => ({
      key: `field${index}`,
      title: `字段${index}`,
      valueType: 'text' as const,
    }))
    mount(QueryFilter, {
      props: { columns, gridCols: 2, showAdvancedButton: false },
      attachTo: document.body,
    })
    await settle()

    expect(findButton('折叠')).toBeUndefined()
    expect(findButton('展开')).toBeUndefined()
  })
})

describe('QueryFilter 远程枚举', () => {
  it('同一 request 只请求一次，refreshOptions 可强制重取', async () => {
    const request = vi.fn(async () => [{ label: '北京', value: 'beijing' }])
    const wrapper = mount(QueryFilter, {
      props: {
        columns: [{ key: 'city', title: '城市', valueType: 'select', request }],
      },
      attachTo: document.body,
    })
    await settle()

    expect(request).toHaveBeenCalledTimes(1)
    const loaded = wrapper.emitted('options-loaded') as any[]
    expect(loaded.at(-1)?.[0]).toBe('city')

    await wrapper.setProps({
      columns: [{ key: 'city', title: '城市', valueType: 'select', request }],
    })
    await settle()
    expect(request).toHaveBeenCalledTimes(1)

    ;(wrapper.vm as any).refreshOptions('city')
    await settle()
    expect(request).toHaveBeenCalledTimes(2)
  })

  it('请求失败抛出 options-error 且不阻塞渲染', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const error = new Error('boom')
    const request = vi.fn(async () => {
      throw error
    })
    const wrapper = mount(QueryFilter, {
      props: {
        columns: [{ key: 'city', title: '城市', valueType: 'select', request }],
      },
      attachTo: document.body,
    })
    await settle()

    const events = wrapper.emitted('options-error') as any[]
    expect(events.at(-1)?.[0]).toBe('city')
    expect(events.at(-1)?.[1]).toBe(error)
    expect(document.body.textContent).toContain('城市')
  })
})

describe('QueryFilter 插槽', () => {
  it('actions 插槽追加自定义操作并可触发查询', async () => {
    const wrapper = mount(QueryFilter, {
      props: { columns: textColumns },
      slots: {
        actions: (scope: any) =>
          h(
            'button',
            {
              class: 'extra-action',
              onClick: () => scope.search(),
            },
            '导出',
          ),
      },
      attachTo: document.body,
    })
    await settle()

    const extra = document.body.querySelector<HTMLButtonElement>('.extra-action')
    expect(extra).toBeTruthy()
    extra?.click()
    await settle()

    expect(wrapper.emitted('search')).toHaveLength(1)
  })

  it('field-<key> 插槽接管列控件', async () => {
    mount(QueryFilter, {
      props: { columns: textColumns },
      slots: {
        'field-keyword': (scope: any) =>
          h('input', {
            class: 'custom-field',
            value: scope.value,
            onInput: (event: Event) => scope.setValue((event.target as HTMLInputElement).value),
          }),
      },
      attachTo: document.body,
    })
    await settle()

    expect(document.body.querySelector('.custom-field')).toBeTruthy()
  })
})
