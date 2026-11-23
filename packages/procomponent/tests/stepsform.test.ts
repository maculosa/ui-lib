import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it } from 'vitest'
import StepsForm from '../src/components/StepsForm/src'

const steps = [
  {
    title: '基本信息',
    description: '填写姓名',
    columns: [
      {
        title: '姓名',
        key: 'name',
        valueType: 'text',
        rule: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
      },
    ],
  },
  {
    title: '联系方式',
    columns: [
      {
        title: '手机号',
        key: 'phone',
        valueType: 'text',
        rule: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
      },
      { title: '邮箱', key: 'email', valueType: 'text' },
    ],
  },
]

afterEach(() => {
  document.body.replaceChildren()
})

async function settle() {
  await nextTick()
  await flushPromises()
  await nextTick()
}

function mountForm(props: Record<string, any> = {}) {
  return mount(StepsForm, {
    props: { steps, defaultShow: true, ...props },
    attachTo: document.body,
  })
}

function bodyText() {
  return document.body.textContent || ''
}

function currentInputValue() {
  return (document.body.querySelector('input') as HTMLInputElement | null)?.value
}

describe('StepsForm 渲染', () => {
  it('渲染各步骤标题、当前步字段与 footer', async () => {
    mountForm()
    await settle()

    expect(bodyText()).toContain('基本信息')
    expect(bodyText()).toContain('联系方式')
    expect(bodyText()).toContain('姓名')
    expect(bodyText()).not.toContain('手机号')
    expect(bodyText()).toContain('下一步')
    expect(bodyText()).toContain('取消')
    expect(bodyText()).not.toContain('上一步')
  })

  it('最后一步显示提交文案', async () => {
    const wrapper = mountForm()
    await settle()
    ;(wrapper.vm as any).setStep(1)
    await settle()

    expect(bodyText()).toContain('上一步')
    expect(bodyText()).toContain('提交')
    expect(bodyText()).not.toContain('下一步')
  })
})

describe('StepsForm 步骤流转', () => {
  it('校验失败停留在当前步并标记错误状态', async () => {
    const wrapper = mountForm()
    await settle()

    const passed = await (wrapper.vm as any).next()
    await settle()

    expect(passed).toBe(false)
    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.emitted('step-change')).toBeUndefined()
    expect(bodyText()).toContain('姓名')
    expect(document.body.querySelector('.n-step--error-status')).toBeTruthy()
  })

  it('校验通过后前进并抛 step-change', async () => {
    const wrapper = mountForm()
    await settle()
    ;(wrapper.vm as any).setFieldValue('name', '张三')
    await settle()

    const passed = await (wrapper.vm as any).next()
    await settle()

    expect(passed).toBe(true)
    expect(wrapper.emitted('step-change')?.[0]).toEqual([1, 0])
    expect((wrapper.vm as any).current).toBe(1)
    expect(bodyText()).toContain('手机号')
  })

  it('上一步不校验且保留已填值', async () => {
    const wrapper = mountForm()
    await settle()
    ;(wrapper.vm as any).setFieldValue('name', '张三')
    await settle()
    await (wrapper.vm as any).next()
    await settle()
    ;(wrapper.vm as any).prev()
    await settle()

    expect((wrapper.vm as any).current).toBe(0)
    expect(wrapper.emitted('step-change')?.[1]).toEqual([0, 1])
    expect(currentInputValue()).toBe('张三')
  })

  it('setStep 拒绝越界索引并允许跳转', async () => {
    const wrapper = mountForm()
    await settle()

    expect((wrapper.vm as any).setStep(5)).toBe(false)
    expect((wrapper.vm as any).setStep(-1)).toBe(false)
    expect((wrapper.vm as any).setStep(1)).toBe(true)
  })
})

describe('StepsForm 提交', () => {
  async function fillAll(wrapper: ReturnType<typeof mountForm>) {
    ;(wrapper.vm as any).setFieldValue('name', '张三')
    await settle()
    await (wrapper.vm as any).next()
    await settle()
    ;(wrapper.vm as any).setFieldValue('phone', '13800000000')
    ;(wrapper.vm as any).setFieldValue('email', 'zhang@example.com')
    await settle()
  }

  it('最后一步提交合并值并关闭弹窗', async () => {
    const wrapper = mountForm()
    await settle()
    await fillAll(wrapper)

    const passed = await (wrapper.vm as any).submit()
    await settle()

    expect(passed).toBe(true)
    const submitted = wrapper.emitted('submit')?.[0]?.[0] as Record<string, any>
    expect(submitted).toMatchObject({
      name: '张三',
      phone: '13800000000',
      email: 'zhang@example.com',
    })
    expect(wrapper.emitted('update:show')?.[0]).toEqual([false])
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('closeOnSubmit=false 时提交后保持打开', async () => {
    const wrapper = mountForm({ closeOnSubmit: false })
    await settle()
    await fillAll(wrapper)

    await (wrapper.vm as any).submit()
    await settle()

    expect(wrapper.emitted('submit')).toHaveLength(1)
    expect(wrapper.emitted('update:show')).toBeUndefined()
  })

  it('当前步校验失败时不提交', async () => {
    const wrapper = mountForm()
    await settle()
    ;(wrapper.vm as any).setFieldValue('name', '张三')
    await settle()
    await (wrapper.vm as any).next()
    await settle()

    const passed = await (wrapper.vm as any).submit()
    await settle()

    expect(passed).toBe(false)
    expect(wrapper.emitted('submit')).toBeUndefined()
    expect((wrapper.vm as any).current).toBe(1)
  })
})

describe('StepsForm 数据与重置', () => {
  it('v-model:model 合并各步字段', async () => {
    const wrapper = mountForm()
    await settle()
    ;(wrapper.vm as any).setFieldValue('name', '张三')
    await settle()

    const emitted = wrapper.emitted('update:model')?.at(-1)?.[0] as Record<string, any>
    expect(emitted).toMatchObject({ name: '张三' })
  })

  it('reset 恢复 defaultValue 并回到第一步', async () => {
    const wrapper = mountForm({ defaultValue: { name: '默认用户' } })
    await settle()

    expect(currentInputValue()).toBe('默认用户')
    ;(wrapper.vm as any).setFieldValue('name', '张三')
    await settle()
    await (wrapper.vm as any).next()
    await settle()

    ;(wrapper.vm as any).reset()
    await settle()

    expect((wrapper.vm as any).current).toBe(0)
    expect(currentInputValue()).toBe('默认用户')
    expect(wrapper.emitted('reset')).toHaveLength(1)
  })

  it('外部 model 变化同步到当前步', async () => {
    const wrapper = mountForm()
    await settle()

    await wrapper.setProps({ model: { name: '外部写入' } })
    await settle()

    expect(currentInputValue()).toBe('外部写入')
  })
})
