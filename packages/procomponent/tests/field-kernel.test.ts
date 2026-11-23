import { flushPromises, mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  createFieldModel,
  getDefaultPlaceholder,
  getInitialValue,
  orderSearchColumns,
  renderFieldControl,
  useFieldOptions,
} from '../src/components/shared/field'

afterEach(() => {
  document.body.replaceChildren()
  vi.restoreAllMocks()
})

function renderControl(ctx: any) {
  return mount(
    defineComponent({ render: () => renderFieldControl(ctx) }),
    { attachTo: document.body },
  )
}

describe('getInitialValue', () => {
  it('按字段类型给出空值', () => {
    for (const valueType of ['select', 'date', 'dateRange', 'time', 'cascader', 'treeSelect', 'digit', 'colorPicker']) {
      expect(getInitialValue({ valueType } as any)).toBeNull()
    }
    for (const valueType of ['checkbox', 'switch']) {
      expect(getInitialValue({ valueType } as any)).toBe(false)
    }
    for (const valueType of ['checkboxGroup', 'dynamicTags']) {
      expect(getInitialValue({ valueType } as any)).toEqual([])
    }
    for (const valueType of ['text', 'autoComplete', 'radio']) {
      expect(getInitialValue({ valueType } as any)).toBe('')
    }
  })
})

describe('createFieldModel', () => {
  const columns = [
    { key: 'keyword', title: '关键词', valueType: 'text' },
    { key: 'status', title: '状态', valueType: 'select' },
    { key: 'tags', title: '标签', valueType: 'checkboxGroup' },
  ] as any[]

  it('为所有列生成初始值并合并外部值', () => {
    expect(createFieldModel(columns, { status: 'active' })).toEqual({
      keyword: '',
      status: 'active',
      tags: [],
    })
  })

  it('没有外部值时只返回初始值', () => {
    expect(createFieldModel(columns)).toEqual({
      keyword: '',
      status: null,
      tags: [],
    })
  })

  it('保留外部值中列配置之外的键', () => {
    expect(createFieldModel(columns, { extra: 1 } as any)).toMatchObject({ extra: 1 })
  })
})

describe('getDefaultPlaceholder', () => {
  it('日期与时间只返回基础文案', () => {
    expect(getDefaultPlaceholder('date')).toBe('请选择日期')
    expect(getDefaultPlaceholder('dateRange')).toBe('请选择日期范围')
    expect(getDefaultPlaceholder('time')).toBe('请选择时间')
  })

  it('其他类型拼接列标题', () => {
    expect(getDefaultPlaceholder('text', '姓名')).toBe('请输入姓名')
    expect(getDefaultPlaceholder('select', '状态')).toBe('请选择状态')
  })
})

describe('orderSearchColumns', () => {
  it('过滤 hideInSearch 并按 order 稳定排序', () => {
    const columns = [
      { key: 'a', title: 'A', valueType: 'text', order: 2 },
      { key: 'hidden', title: 'H', valueType: 'text', hideInSearch: true },
      { key: 'b', title: 'B', valueType: 'text' },
      { key: 'c', title: 'C', valueType: 'text', order: 1 },
      { key: 'd', title: 'D', valueType: 'text' },
    ] as any[]

    expect(orderSearchColumns(columns).map(column => column.key)).toEqual(['c', 'a', 'b', 'd'])
  })

  it('没有 order 时保持声明顺序', () => {
    const columns = [
      { key: 'a', title: 'A', valueType: 'text' },
      { key: 'b', title: 'B', valueType: 'text' },
    ] as any[]

    expect(orderSearchColumns(columns).map(column => column.key)).toEqual(['a', 'b'])
  })
})

describe('renderFieldControl', () => {
  it('text 使用默认占位符并绑定 model 值', () => {
    const wrapper = renderControl({
      column: { key: 'name', title: '姓名', valueType: 'text' } as any,
      model: { name: '张三' },
    })

    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toBe('请输入姓名')
    expect((input.element as HTMLInputElement).value).toBe('张三')
  })

  it('formItemProps 覆盖默认占位符与禁用态', () => {
    const wrapper = renderControl({
      column: {
        key: 'name',
        title: '姓名',
        valueType: 'text',
        disabled: true,
        formItemProps: { placeholder: '自定义占位' },
      } as any,
      model: { name: '' },
    })

    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toBe('自定义占位')
    expect(input.attributes('disabled')).toBeDefined()
  })

  it('select 渲染传入的选项', async () => {
    const wrapper = renderControl({
      column: { key: 'status', title: '状态', valueType: 'select' } as any,
      model: { status: null },
      options: [{ label: '启用', value: 'on' }],
    })
    await nextTick()

    expect(wrapper.find('.n-base-selection').exists()).toBe(true)
  })

  it('dateRange 渲染日期范围选择器', () => {
    const wrapper = renderControl({
      column: { key: 'range', title: '日期', valueType: 'dateRange' } as any,
      model: { range: null },
    })

    expect(wrapper.find('.n-date-picker').exists()).toBe(true)
    expect(wrapper.html()).toContain('开始日期')
    expect(wrapper.html()).toContain('结束日期')
  })

  it('date 通过 formItemProps.type 指定范围时按范围渲染', () => {
    const wrapper = renderControl({
      column: {
        key: 'range',
        title: '日期',
        valueType: 'date',
        formItemProps: { type: 'datetimerange' },
      } as any,
      model: { range: null },
    })

    expect(wrapper.html()).toContain('开始日期')
  })

  it('checkbox 渲染单个复选框并绑定布尔值', () => {
    const wrapper = renderControl({
      column: { key: 'enabled', title: '启用', valueType: 'checkbox' } as any,
      model: { enabled: true },
    })

    expect(wrapper.find('.n-checkbox').classes()).toContain('n-checkbox--checked')
  })

  it('switch 绑定布尔值', () => {
    const wrapper = renderControl({
      column: { key: 'active', title: '激活', valueType: 'switch' } as any,
      model: { active: true },
    })

    expect(wrapper.find('.n-switch').classes()).toContain('n-switch--active')
  })

  it('radio 与 checkboxGroup 按选项渲染', () => {
    const radio = renderControl({
      column: { key: 'level', title: '级别', valueType: 'radio' } as any,
      model: { level: 'a' },
      options: [
        { label: '甲', value: 'a' },
        { label: '乙', value: 'b' },
      ],
    })
    expect(radio.findAll('.n-radio')).toHaveLength(2)

    const group = renderControl({
      column: { key: 'tags', title: '标签', valueType: 'checkboxGroup' } as any,
      model: { tags: ['a'] },
      options: [
        { label: '甲', value: 'a' },
        { label: '乙', value: 'b' },
      ],
    })
    expect(group.findAll('.n-checkbox')).toHaveLength(2)
  })

  it('未知类型返回 null', () => {
    expect(renderFieldControl({
      column: { key: 'x', title: 'X', valueType: 'unknown' } as any,
      model: { x: '' },
    })).toBeNull()
  })
})

describe('useFieldOptions', () => {
  function mountLoader(columns: any[]) {
    const onLoaded = vi.fn()
    const onError = vi.fn()
    let api: any
    const wrapper = mount(defineComponent({
      setup() {
        api = useFieldOptions(() => columns, {
          label: 'Test',
          onLoaded,
          onError,
        })
        return () => h('div')
      },
    }))
    return { wrapper, api, onLoaded, onError }
  }

  it('同一 request 只请求一次，refreshOptions 强制重取', async () => {
    const request = vi.fn().mockResolvedValue([{ label: 'A', value: 'a' }])
    const columns = [{ key: 'status', title: '状态', valueType: 'select', request }]
    const { api, onLoaded } = mountLoader(columns)
    await flushPromises()

    expect(request).toHaveBeenCalledTimes(1)
    expect(api.options.status).toEqual([{ label: 'A', value: 'a' }])
    expect(onLoaded).toHaveBeenCalledWith('status', [{ label: 'A', value: 'a' }])

    await api.refreshOptions('status')
    expect(request).toHaveBeenCalledTimes(2)
  })

  it('request 失败时回调 onError 且不阻塞', async () => {
    const error = new Error('boom')
    const request = vi.fn().mockRejectedValue(error)
    const columns = [{ key: 'status', title: '状态', valueType: 'select', request }]
    const { api, onError } = mountLoader(columns)
    vi.spyOn(console, 'error').mockImplementation(() => {})
    await flushPromises()

    expect(onError).toHaveBeenCalledWith('status', error)
    expect(api.optionsLoading.status).toBe(false)
  })
})