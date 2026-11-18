import { flushPromises, mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Actions from '../src/components/Actions/src'
import { computeVisibleCount } from '../src/components/Actions/src/utils'
import type { ActionButton } from '../src/components/Actions'

const baseItems: ActionButton[] = [
    { key: 'edit', label: '编辑', variant: 'primary' },
    { key: 'detail', label: '详情', variant: 'info' },
    { key: 'delete', label: '删除', variant: 'error' },
]

afterEach(() => {
    document.body.replaceChildren()
})

function findButton(text: string) {
    return Array.from(document.body.querySelectorAll<HTMLButtonElement>('button'))
        .find(button => button.textContent?.trim() === text)
}

async function settle() {
    await nextTick()
    await flushPromises()
    await new Promise(resolve => setTimeout(resolve, 0))
}

async function openOverflow(wrapper: ReturnType<typeof mount>) {
    const trigger = wrapper.find('button[aria-haspopup="menu"]')
    await trigger.trigger('click')
    await settle()
    return trigger
}

describe('computeVisibleCount', () => {
    const options = { moreWidth: 40, containerWidth: 200, gap: 2, cap: Number.POSITIVE_INFINITY }

    it('reserves the more trigger and gap when overflowing', () => {
        expect(computeVisibleCount({ ...options, containerWidth: 180, widths: [60, 60, 60] })).toBe(2)
    })

    it('shows everything when the container is wide enough', () => {
        expect(computeVisibleCount({ ...options, containerWidth: 1000, widths: [60, 60, 60] })).toBe(3)
    })

    it('respects the cap', () => {
        expect(computeVisibleCount({ ...options, containerWidth: 1000, widths: [60, 60, 60], cap: 1 })).toBe(1)
    })

    it('returns zero for empty widths or zero container', () => {
        expect(computeVisibleCount({ ...options, widths: [] })).toBe(0)
        expect(computeVisibleCount({ ...options, containerWidth: 0, widths: [60] })).toBe(0)
    })

    it('does not reserve more space for the last item', () => {
        expect(computeVisibleCount({ ...options, containerWidth: 50, widths: [60] })).toBe(0)
        expect(computeVisibleCount({ ...options, containerWidth: 100, widths: [60] })).toBe(1)
    })
})

describe('Actions', () => {
    it('filters items by the permissions array', () => {
        const wrapper = mount(Actions, {
            props: {
                items: [
                    { ...baseItems[0], permission: 'edit' },
                    { ...baseItems[1], permission: 'detail' },
                    { ...baseItems[2], permission: 'delete' },
                    { key: 'audit', label: '审核', variant: 'warning', permission: 'audit' },
                ],
                permissions: ['edit', 'audit'],
                showNum: 5,
            },
        })

        expect(wrapper.text()).toContain('编辑')
        expect(wrapper.text()).toContain('审核')
        expect(wrapper.text()).not.toContain('详情')
        expect(wrapper.text()).not.toContain('删除')
    })

    it('prefers hasPermission over permissions', () => {
        const hasPermission = vi.fn((permission: string) => permission === 'delete')

        const wrapper = mount(Actions, {
            props: {
                items: [
                    ...baseItems,
                    { key: 'audit', label: '审核', variant: 'warning', permission: 'audit' },
                ],
                permissions: ['audit'],
                hasPermission,
                showNum: 5,
            },
        })

        expect(hasPermission).toHaveBeenCalledWith('audit')
        expect(wrapper.text()).toContain('删除')
        expect(wrapper.text()).not.toContain('审核')
    })

    it('reacts to showNum changes', async () => {
        const wrapper = mount(Actions, { props: { items: baseItems, showNum: 1 } })

        expect(wrapper.text()).toContain('编辑')
        expect(wrapper.text()).not.toContain('详情')
        expect(wrapper.find('button[aria-haspopup="menu"]').exists()).toBe(true)

        await wrapper.setProps({ showNum: 2 })

        expect(wrapper.text()).toContain('详情')
        expect(wrapper.find('button[aria-haspopup="menu"]').exists()).toBe(true)

        await wrapper.setProps({ showNum: 3 })

        expect(wrapper.text()).toContain('删除')
        expect(wrapper.find('button[aria-haspopup="menu"]').exists()).toBe(false)
    })

    it('emits click with the item and the mouse event', async () => {
        const onClick = vi.fn()
        const item = { key: 'edit', label: '编辑', variant: 'primary' as const, onClick }
        const wrapper = mount(Actions, { props: { items: [item], showNum: 1 } })

        await wrapper.find('button').trigger('click')

        expect(onClick).toHaveBeenCalledTimes(1)
        expect(onClick.mock.calls[0][0]).toMatchObject({ key: 'edit' })
        expect(wrapper.emitted('click')?.[0][0]).toMatchObject({ key: 'edit' })
        expect(wrapper.emitted('click')?.[0][1]).toBeDefined()
    })

    it('runs a confirmed action only after the positive button is clicked', async () => {
        const onClick = vi.fn()
        const deleteItem: ActionButton = {
            key: 'delete',
            label: '删除',
            variant: 'error',
            confirm: true,
            onClick,
        }
        const wrapper = mount(Actions, { props: { items: [deleteItem], showNum: 1 }, attachTo: document.body })

        await wrapper.find('button').trigger('click')
        await settle()

        expect(onClick).not.toHaveBeenCalled()
        expect(wrapper.emitted('click')).toBeUndefined()
        expect(document.body.textContent).toContain('确认执行「删除」操作？')

        findButton('确认')?.click()
        await settle()

        expect(onClick).toHaveBeenCalledTimes(1)
        expect(wrapper.emitted('click')?.[0][0]).toMatchObject({ key: 'delete' })
        wrapper.unmount()
    })

    it('emits cancel when a confirmed action is rejected', async () => {
        const onClick = vi.fn()
        const deleteItem: ActionButton = {
            key: 'delete',
            label: '删除',
            variant: 'error',
            confirm: true,
            confirmContent: '删除后无法恢复',
            onClick,
        }
        const wrapper = mount(Actions, { props: { items: [deleteItem], showNum: 1 }, attachTo: document.body })

        await wrapper.find('button').trigger('click')
        await settle()

        expect(document.body.textContent).toContain('删除后无法恢复')

        findButton('取消')?.click()
        await settle()

        expect(onClick).not.toHaveBeenCalled()
        expect(wrapper.emitted('cancel')?.[0][0]).toMatchObject({ key: 'delete' })
        wrapper.unmount()
    })

    it('passes size down to the buttons', () => {
        const wrapper = mount(Actions, { props: { items: baseItems, showNum: 3, size: 'large' } })

        expect(wrapper.find('button').classes().some(name => name.includes('large'))).toBe(true)
    })

    it('renders overflow items in a menu and closes after selecting one', async () => {
        const wrapper = mount(Actions, {
            props: { items: baseItems, showNum: 1 },
            attachTo: document.body,
        })

        const trigger = await openOverflow(wrapper)

        expect(trigger.attributes('aria-expanded')).toBe('true')
        const menu = document.body.querySelector('[role="menu"]')
        expect(menu).not.toBeNull()

        expect(menu?.className).toContain('min-w-[120px]')

        const menuItems = Array.from(menu?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? [])
        expect(menuItems.map(item => item.textContent?.trim())).toEqual(['详情', '删除'])
        expect(menuItems[0].style.justifyContent).toBe('flex-start')

        menuItems[1].click()
        await settle()

        expect(wrapper.emitted('click')?.[0][0]).toMatchObject({ key: 'delete' })
        expect(trigger.attributes('aria-expanded')).toBe('false')
        wrapper.unmount()
    })

    it('supports keyboard navigation inside the overflow menu', async () => {
        const wrapper = mount(Actions, {
            props: { items: baseItems, showNum: 1 },
            attachTo: document.body,
        })

        await openOverflow(wrapper)

        const menu = document.body.querySelector<HTMLElement>('[role="menu"]')!
        const menuItems = () => Array.from(menu.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'))

        expect(document.activeElement).toBe(menuItems()[0])

        menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }))
        expect(document.activeElement).toBe(menuItems()[1])

        menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
        await settle()

        expect(wrapper.find('button[aria-haspopup="menu"]').attributes('aria-expanded')).toBe('false')
        expect(document.activeElement).toBe(wrapper.find('button[aria-haspopup="menu"]').element)
        wrapper.unmount()
    })

    it('replaces the default overflow panel with the overflow slot', async () => {
        const wrapper = mount(Actions, {
            props: { items: baseItems, showNum: 1 },
            slots: {
                overflow: ({ items, close }: { items: ActionButton[]; close: () => void }) => h(
                    'div',
                    { class: 'custom-overflow' },
                    [
                        h('span', items.map(item => item.label).join(',')),
                        h('button', { class: 'custom-close', onClick: close }, '关闭'),
                    ],
                ),
            },
            attachTo: document.body,
        })

        await openOverflow(wrapper)

        expect(document.body.querySelector('.custom-overflow')).not.toBeNull()
        expect(document.body.querySelector('.custom-overflow span')?.textContent).toBe('详情,删除')
        expect(document.body.querySelector('[role="menu"]')).toBeNull()

        document.body.querySelector<HTMLButtonElement>('.custom-close')?.click()
        await settle()

        expect(wrapper.find('button[aria-haspopup="menu"]').attributes('aria-expanded')).toBe('false')
        wrapper.unmount()
    })
})
