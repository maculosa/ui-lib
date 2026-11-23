import { flushPromises, mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import LiteFilter from '../src/components/LiteFilter/src'
import type { LiteFilterColumn } from '../src/components/LiteFilter'

afterEach(() => {
  document.body.replaceChildren()
  vi.restoreAllMocks()
  vi.useRealTimers()
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

function setInputValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
  setter?.call(input, value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
}

function row() {
  return document.body.querySelector<HTMLElement>('.bm-lite-filter-row')
}

function fieldItems() {
  return Array.from(document.body.querySelectorAll<HTMLElement>('.bm-lite-filter .n-form-item'))
}

function buttonIn(scope: Element | null | undefined, text: string) {
  return Array.from(scope?.querySelectorAll<HTMLButtonElement>('button') ?? [])
    .find(button => button.textContent?.trim() === text)
}

function mainActions() {
  return document.body.querySelector<HTMLElement>('.bm-lite-filter .bm-lite-filter-actions')
}

function advancedArea() {
  return document.body.querySelector<HTMLElement>('.bm-lite-filter-advanced')
}

function mainInput() {
  return document.body.querySelector<HTMLInputElement>('.bm-lite-filter .n-form-item input')!
}

async function flushAutoSearch(ms = 300) {
  vi.advanceTimersByTime(ms)
  await settle()
}

function mockScrollHeight(value: number) {
  const proto = HTMLElement.prototype as any
  const original = Object.getOwnPropertyDescriptor(proto, 'scrollHeight')
  Object.defineProperty(proto, 'scrollHeight', { configurable: true, get() { return value } })

  return () => {
    if (original)
      Object.defineProperty(proto, 'scrollHeight', original)
    else
      delete proto.scrollHeight
  }
}

const textColumns: LiteFilterColumn[] = [
  { key: 'keyword', title: '关键词', valueType: 'text' },
  { key: 'owner', title: '负责人', valueType: 'text' },
  {
    key: 'status',
    title: '状态',
    valueType: 'select',
    options: [
      { label: '启用', value: 'active' },
      { label: '停用', value: 'disabled' },
    ],
  },
]

describe('LiteFilter', () => {
  it('renders a plain toolbar by default and a card when requested', async () => {
    const wrapper = mount(LiteFilter, {
      props: { columns: textColumns },
      attachTo: document.body,
    })
    await settle()

    expect(document.body.querySelector('.n-card')).toBeNull()
    expect(document.body.querySelector('.n-form')).not.toBeNull()

    await wrapper.setProps({ card: true })
    await settle()

    expect(document.body.querySelector('.n-card')).not.toBeNull()
    wrapper.unmount()
  })

  it('hides labels by default and falls back to placeholders', async () => {
    const wrapper = mount(LiteFilter, {
      props: { columns: textColumns },
      attachTo: document.body,
    })
    await settle()

    expect(labelTexts()).toEqual([])
    const inputs = Array.from(document.body.querySelectorAll<HTMLInputElement>('.n-form-item input'))
    expect(inputs[0]?.placeholder).toBe('请输入关键词')
    expect(document.body.querySelector('.n-form-item--no-label')).not.toBeNull()

    await wrapper.setProps({ showLabel: true })
    await settle()

    expect(labelTexts()).toEqual(['关键词', '负责人', '状态'])
    wrapper.unmount()
  })

  it('keeps a compact label for columns with tooltip', async () => {
    mount(LiteFilter, {
      props: {
        columns: [
          { key: 'keyword', title: '关键词', valueType: 'text' },
          { key: 'status', title: '状态', valueType: 'text', tooltip: '仅支持启用 / 停用' },
        ],
      },
      attachTo: document.body,
    })
    await settle()

    expect(labelTexts()).toEqual(['状态'])
  })

  it('lays fields out with flex and a 12px gap instead of a grid', async () => {
    mount(LiteFilter, {
      props: { columns: textColumns },
      attachTo: document.body,
    })
    await settle()

    expect(document.body.querySelector('.n-grid')).toBeNull()
    const list = row()
    expect(list).not.toBeNull()
    expect(list!.style.display).toBe('flex')
    expect(list!.style.flexWrap).toBe('wrap')
    expect(list!.style.gap).toBe('12px')
    expect(document.body.querySelector('.n-form-item--small-size')).not.toBeNull()
    expect(fieldItems().every(item => item.style.flex === '0 0 auto')).toBe(true)
    expect(findButton('重置')?.classList.contains('n-button--small-type')).toBe(true)
  })

  it('sizes fields from their value type and honors width overrides', async () => {
    const columns: LiteFilterColumn[] = [
      { key: 'keyword', title: '关键词', valueType: 'text' },
      { key: 'status', title: '状态', valueType: 'select', options: [] },
      { key: 'createdAt', title: '创建日期', valueType: 'date' },
      { key: 'period', title: '周期', valueType: 'dateRange' },
      { key: 'amount', title: '金额', valueType: 'digit' },
      { key: 'enabled', title: '启用', valueType: 'switch' },
      { key: 'owner', title: '负责人', valueType: 'text', width: 320 },
      { key: 'note', title: '备注', valueType: 'text', formItemProps: { style: { width: '12rem' } } },
    ]
    mount(LiteFilter, {
      props: { columns },
      attachTo: document.body,
    })
    await settle()

    expect(fieldItems().map(item => item.style.width)).toEqual([
      '180px',
      '160px',
      '150px',
      '260px',
      '140px',
      '',
      '320px',
      '12rem',
    ])
  })

  it('clamps the row height while collapsed and releases it after expanding', async () => {
    const restore = mockScrollHeight(200)
    const columns: LiteFilterColumn[] = [
      { key: 'a', title: 'A', valueType: 'text' },
      { key: 'b', title: 'B', valueType: 'text' },
      { key: 'c', title: 'C', valueType: 'text' },
      { key: 'd', title: 'D', valueType: 'text' },
    ]
    mount(LiteFilter, {
      props: { columns },
      attachTo: document.body,
    })
    await settle()

    expect(findButton('展开')).toBeTruthy()
    expect(row()!.style.maxHeight).toBe('34px')
    expect(row()!.style.overflow).toBe('hidden')

    findButton('展开')?.click()
    await settle()

    expect(row()!.style.maxHeight).toBe('')
    expect(row()!.style.overflow).toBe('')
    restore()
  })

  it('stacks the advanced popover fields with flex', async () => {
    const restore = mockScrollHeight(200)
    mount(LiteFilter, {
      props: {
        columns: [
          { key: 'keyword', title: '关键词', valueType: 'text' },
          { key: 'owner', title: '负责人', valueType: 'text', advanced: true },
        ],
      },
      attachTo: document.body,
    })
    await settle()

    findButton('高级筛选')?.click()
    await settle()

    const advanced = document.body.querySelector<HTMLElement>('.bm-lite-filter-advanced')
    expect(advanced).not.toBeNull()
    expect(advanced!.querySelector('.n-grid')).toBeNull()
    const list = advanced!.querySelector<HTMLElement>('.bm-lite-filter-row')
    expect(list!.style.display).toBe('flex')
    expect(list!.style.flexDirection).toBe('column')
    expect(list!.querySelector('.n-form-item')!.style.width).toBe('100%')
    restore()
  })

  it('sets the default slot outside form items and only once', async () => {
    const wrapper = mount(LiteFilter, {
      props: { columns: textColumns },
      slots: {
        default: () => h('span', { class: 'legacy-default' }, '旧默认插槽'),
      },
      attachTo: document.body,
    })
    await settle()

    const legacy = document.body.querySelectorAll('.legacy-default')
    expect(legacy).toHaveLength(1)
    expect(legacy[0].closest('.n-form-item')).toBeNull()
    wrapper.unmount()
  })

  it('collects advanced columns into a popover and searches with their values', async () => {
    const columns: LiteFilterColumn[] = [
      { key: 'keyword', title: '关键词', valueType: 'text' },
      { key: 'owner', title: '负责人', valueType: 'text', advanced: true },
    ]
    const wrapper = mount(LiteFilter, {
      props: { columns },
      attachTo: document.body,
    })
    await settle()

    expect(fieldItems()).toHaveLength(1)
    expect(document.body.querySelector('.n-popover')).toBeNull()

    findButton('高级筛选')?.click()
    await settle()

    const advancedInput = document.body.querySelector<HTMLInputElement>('.n-popover input')
    expect(advancedInput).not.toBeNull()

    vi.useFakeTimers()
    setInputValue(advancedInput!, '张三')
    await settle()
    await flushAutoSearch()

    expect(wrapper.emitted('search')?.[0][0]).toMatchObject({ keyword: '', owner: '张三' })

    buttonIn(mainActions(), '重置')?.click()
    await settle()
    await flushAutoSearch()

    expect(wrapper.emitted('reset')?.[0][0]).toMatchObject({ keyword: '', owner: '' })
    expect(advancedInput!.value).toBe('')
    vi.useRealTimers()
    wrapper.unmount()
  })

  it('renders advanced columns inline when advancedPopover is false', async () => {
    mount(LiteFilter, {
      props: {
        columns: [
          { key: 'keyword', title: '关键词', valueType: 'text' },
          { key: 'owner', title: '负责人', valueType: 'text', advanced: true },
        ],
        advancedPopover: false,
      },
      attachTo: document.body,
    })
    await settle()

    expect(fieldItems()).toHaveLength(2)
    expect(findButton('高级筛选')).toBeUndefined()
  })

  it('emits search with current values and reset restores the defaults', async () => {
    const wrapper = mount(LiteFilter, {
      props: { columns: textColumns, defaultValue: { status: 'active' }, showSearchButton: true },
      attachTo: document.body,
    })
    await settle()

    const keyword = document.body.querySelector<HTMLInputElement>('.n-form-item input')!
    setInputValue(keyword, '合同')
    await settle()

    findButton('查询')?.click()
    await settle()

    expect(wrapper.emitted('search')?.[0][0]).toMatchObject({ keyword: '合同', status: 'active' })

    findButton('重置')?.click()
    await settle()

    expect(keyword.value).toBe('')
    expect(wrapper.emitted('reset')?.[0][0]).toMatchObject({ keyword: '', status: 'active' })
    wrapper.unmount()
  })

  it('disables the actions while loading', async () => {
    const wrapper = mount(LiteFilter, {
      props: { columns: textColumns, loading: true, showSearchButton: true },
      attachTo: document.body,
    })
    await settle()

    expect(findButton('查询')?.disabled).toBe(true)
    expect(findButton('重置')?.disabled).toBe(true)
    wrapper.unmount()
  })

  it('blocks search when beforeSearch returns false', async () => {
    const beforeSearch = vi.fn(() => false)
    const wrapper = mount(LiteFilter, {
      props: { columns: textColumns, beforeSearch, showSearchButton: true },
      attachTo: document.body,
    })
    await settle()

    findButton('查询')?.click()
    await settle()

    expect(beforeSearch).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('search')).toBeUndefined()
    wrapper.unmount()
  })

  it('forwards collapsed state through update:collapsed', async () => {
    const restore = mockScrollHeight(200)
    const columns: LiteFilterColumn[] = [
      { key: 'a', title: 'A', valueType: 'text' },
      { key: 'b', title: 'B', valueType: 'text' },
      { key: 'c', title: 'C', valueType: 'text' },
      { key: 'd', title: 'D', valueType: 'text' },
    ]
    const wrapper = mount(LiteFilter, {
      props: { columns, collapsed: true },
      attachTo: document.body,
    })
    await settle()

    findButton('展开')?.click()
    await settle()

    expect(wrapper.emitted('update:collapsed')?.[0][0]).toBe(false)

    await wrapper.setProps({ collapsed: false })
    await settle()

    expect(findButton('折叠')).toBeTruthy()
    restore()
    wrapper.unmount()
  })

  it('loads a remote enum once and exposes refreshOptions', async () => {
    const request = vi.fn(() => Promise.resolve([
      { label: '北京', value: 'beijing' },
      { label: '上海', value: 'shanghai' },
    ]))
    const wrapper = mount(LiteFilter, {
      props: {
        columns: [
          { key: 'city', title: '城市', valueType: 'select', request },
        ],
      },
      attachTo: document.body,
    })
    await settle()

    expect(request).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('options-loaded')?.[0][0]).toBe('city')

    await (wrapper.vm as any).refreshOptions('city')
    await settle()

    expect(request).toHaveBeenCalledTimes(2)
    wrapper.unmount()
  })

  it('forwards field and actions slots', async () => {
    const wrapper = mount(LiteFilter, {
      props: { columns: textColumns },
      slots: {
        'field-keyword': ({ value, setValue }: any) => h('input', {
          class: 'custom-keyword',
          value,
          onInput: (event: Event) => setValue((event.target as HTMLInputElement).value),
        }),
        'actions': ({ search, collapsed, loading }: any) => h(
          'button',
          {
            class: 'custom-action',
            onClick: () => search(),
            'data-collapsed': String(collapsed),
            'data-loading': String(loading),
          },
          '导出',
        ),
      },
      attachTo: document.body,
    })
    await settle()

    const custom = document.body.querySelector<HTMLInputElement>('.custom-keyword')
    expect(custom).not.toBeNull()

    setInputValue(custom!, '自定义')
    await settle()

    const action = document.body.querySelector<HTMLButtonElement>('.custom-action')!
    expect(action.dataset.collapsed).toBe('true')
    action.click()
    await settle()

    expect(wrapper.emitted('search')?.[0][0]).toMatchObject({ keyword: '自定义' })
    wrapper.unmount()
  })

  it('does not render columns with hideInSearch', async () => {
    const wrapper = mount(LiteFilter, {
      props: {
        columns: [
          ...textColumns,
          { key: 'internal', title: '内部编码', valueType: 'text', hideInSearch: true },
        ],
      },
      attachTo: document.body,
    })
    await settle()

    expect(fieldItems()).toHaveLength(textColumns.length)
    expect(document.body.textContent).not.toContain('内部编码')
    wrapper.unmount()
  })

  it('omits the search button and leaves reset right after the fields', async () => {
    mount(LiteFilter, {
      props: { columns: textColumns },
      attachTo: document.body,
    })
    await settle()

    expect(findButton('查询')).toBeUndefined()
    expect(buttonIn(mainActions(), '重置')).toBeTruthy()
    expect(mainActions()!.style.marginLeft).toBe('')
    expect(mainActions()!.querySelector<HTMLElement>('.n-space')!.style.justifyContent).not.toBe('flex-end')
  })

  it('renders the search button again when showSearchButton is on', async () => {
    const wrapper = mount(LiteFilter, {
      props: { columns: textColumns },
      attachTo: document.body,
    })
    await settle()

    expect(findButton('查询')).toBeUndefined()

    await wrapper.setProps({ showSearchButton: true })
    await settle()

    expect(findButton('查询')).toBeTruthy()

    vi.useFakeTimers()
    setInputValue(mainInput(), '合同')
    await settle()
    await flushAutoSearch()

    expect(wrapper.emitted('search')).toBeUndefined()
    vi.useRealTimers()
    wrapper.unmount()
  })

  it('searches automatically on a debounced value change', async () => {
    const wrapper = mount(LiteFilter, {
      props: { columns: textColumns },
      attachTo: document.body,
    })
    await settle()
    vi.useFakeTimers()

    setInputValue(mainInput(), '合')
    await settle()
    await flushAutoSearch(100)
    expect(wrapper.emitted('search')).toBeUndefined()

    setInputValue(mainInput(), '合同')
    await settle()
    await flushAutoSearch(300)

    expect(wrapper.emitted('search')).toHaveLength(1)
    expect(wrapper.emitted('search')?.[0][0]).toMatchObject({ keyword: '合同' })
    vi.useRealTimers()
    wrapper.unmount()
  })

  it('waits for the configured searchDebounce before searching', async () => {
    const wrapper = mount(LiteFilter, {
      props: { columns: textColumns, searchDebounce: 600 },
      attachTo: document.body,
    })
    await settle()
    vi.useFakeTimers()

    setInputValue(mainInput(), '合同')
    await settle()
    await flushAutoSearch(300)
    expect(wrapper.emitted('search')).toBeUndefined()

    await flushAutoSearch(300)
    expect(wrapper.emitted('search')).toHaveLength(1)
    vi.useRealTimers()
    wrapper.unmount()
  })

  it('lets beforeSearch block the automatic search', async () => {
    const beforeSearch = vi.fn(() => false)
    const wrapper = mount(LiteFilter, {
      props: { columns: textColumns, beforeSearch },
      attachTo: document.body,
    })
    await settle()
    vi.useFakeTimers()

    setInputValue(mainInput(), '合同')
    await settle()
    await flushAutoSearch()

    expect(beforeSearch).toHaveBeenCalledTimes(1)
    expect(wrapper.emitted('search')).toBeUndefined()
    vi.useRealTimers()
    wrapper.unmount()
  })

  it('searches again after reset restores the defaults', async () => {
    const wrapper = mount(LiteFilter, {
      props: { columns: textColumns },
      attachTo: document.body,
    })
    await settle()
    vi.useFakeTimers()

    setInputValue(mainInput(), '合同')
    await settle()
    await flushAutoSearch()
    expect(wrapper.emitted('search')).toHaveLength(1)

    buttonIn(mainActions(), '重置')?.click()
    await settle()
    expect(wrapper.emitted('reset')).toHaveLength(1)
    expect(wrapper.emitted('search')).toHaveLength(1)

    await flushAutoSearch()
    expect(wrapper.emitted('search')).toHaveLength(2)
    expect(wrapper.emitted('search')?.[1][0]).toMatchObject({ keyword: '' })
    vi.useRealTimers()
    wrapper.unmount()
  })

  it('keeps only reset in the advanced popover and clears just its own fields', async () => {
    const columns: LiteFilterColumn[] = [
      { key: 'keyword', title: '关键词', valueType: 'text' },
      { key: 'owner', title: '负责人', valueType: 'text', advanced: true },
    ]
    const wrapper = mount(LiteFilter, {
      props: { columns },
      attachTo: document.body,
    })
    await settle()

    buttonIn(mainActions(), '高级筛选')?.click()
    await settle()

    expect(advancedArea()).not.toBeNull()
    expect(buttonIn(advancedArea(), '查询')).toBeUndefined()
    expect(buttonIn(advancedArea(), '重置')).toBeTruthy()

    const advancedInput = document.body.querySelector<HTMLInputElement>('.bm-lite-filter-advanced input')!
    vi.useFakeTimers()

    setInputValue(advancedInput, '张三')
    await settle()
    await flushAutoSearch()
    setInputValue(mainInput(), '合同')
    await settle()
    await flushAutoSearch()

    buttonIn(advancedArea(), '重置')?.click()
    await settle()
    await flushAutoSearch()

    expect(advancedInput.value).toBe('')
    expect(mainInput().value).toBe('合同')
    expect(wrapper.emitted('search')?.at(-1)?.[0]).toMatchObject({ keyword: '合同', owner: '' })
    vi.useRealTimers()
    wrapper.unmount()
  })
})
