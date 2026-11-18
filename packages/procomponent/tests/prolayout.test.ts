import { flushPromises, mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ProLayout from '../src/components/ProLayout/src'

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

const menus = [
    { label: '首页', key: '/home' },
    {
        label: '系统管理',
        key: '/sys',
        children: [
            { label: '用户管理', key: '/sys/user' },
            {
                label: '权限管理',
                key: '/sys/auth',
                children: [
                    { label: '角色管理', key: '/sys/auth/role' },
                    { label: '菜单管理', key: '/sys/auth/menu' },
                ],
            },
        ],
    },
]

afterEach(() => {
    document.body.replaceChildren()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
})

function mountLayout(props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) {
    return mount(ProLayout as any, {
        attachTo: document.body,
        props: { menus, style: { height: '420px' }, ...props },
        slots,
    })
}

describe('ProLayout menu state', () => {
    it('expands ancestors of the initial selected value', async () => {
        const wrapper = mountLayout({ menuValue: '/sys/auth/role' })
        await nextTick()

        expect(wrapper.text()).toContain('角色管理')
        expect(wrapper.text()).toContain('菜单管理')
    })

    it('expands ancestors when the selected value changes', async () => {
        const wrapper = mountLayout({ menuValue: '/home' })
        await nextTick()
        expect(wrapper.text()).not.toContain('角色管理')

        await wrapper.setProps({ menuValue: '/sys/auth/role' })
        await flushPromises()

        expect(wrapper.text()).toContain('角色管理')
        expect(wrapper.emitted('update:expandedKeys')?.at(-1)?.[0]).toEqual(
            expect.arrayContaining(['/sys', '/sys/auth'])
        )
    })

    it('can opt out of auto expansion', async () => {
        const wrapper = mountLayout({ menuValue: '/home', autoExpandSelected: false })
        await nextTick()

        await wrapper.setProps({ menuValue: '/sys/auth/role' })
        await flushPromises()

        expect(wrapper.text()).not.toContain('角色管理')
        expect(wrapper.emitted('update:expandedKeys')).toBeUndefined()
    })

    it('exposes setMenuValue and setExpandedKeys', async () => {
        const wrapper = mountLayout({ menuValue: '/home' })
        await nextTick()
        const vm = wrapper.vm as any

        vm.setMenuValue('/sys/auth/menu')
        await flushPromises()

        expect(wrapper.emitted('update:menuValue')?.at(-1)?.[0]).toBe('/sys/auth/menu')
        expect(wrapper.text()).toContain('菜单管理')

        vm.setExpandedKeys(['/sys'])
        await flushPromises()

        expect(wrapper.emitted('update:expandedKeys')?.at(-1)?.[0]).toEqual(['/sys'])
        expect(wrapper.text()).toContain('用户管理')
        expect(wrapper.text()).not.toContain('角色管理')
    })

    it('scrolls to a menu item through scrollToMenu', async () => {
        const scrollIntoView = vi.fn()
        Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
            configurable: true,
            value: scrollIntoView,
        })
        const wrapper = mountLayout({ menuValue: '/home' })
        await nextTick()

        const found = await (wrapper.vm as any).scrollToMenu('/sys/auth/role')

        expect(found).toBe(true)
        expect(scrollIntoView).toHaveBeenCalled()
        expect(wrapper.text()).toContain('角色管理')
    })
})

describe('ProLayout footer and header', () => {
    it('merges footer class and applies footer style', async () => {
        const wrapper = mountLayout({
            footer: true,
            footerClass: 'h-12 custom-footer',
            footerStyle: { color: 'rgb(255, 0, 0)' },
        })
        await nextTick()

        const footer = wrapper.find('footer')
        expect(footer.exists()).toBe(true)
        expect(footer.classes()).toContain('h-12')
        expect(footer.classes()).not.toContain('h-16')
        expect(footer.classes()).toContain('custom-footer')
        expect((footer.element as HTMLElement).style.color).toBe('rgb(255, 0, 0)')
    })

    it('lets headerClass control title color without titleRender', async () => {
        const wrapper = mountLayout({ headerClass: 'bg-white text-zinc-900' })
        await nextTick()

        const header = wrapper.find('header')
        expect(header.classes()).toContain('text-zinc-900')
        expect(header.classes()).not.toContain('text-white')
        expect(wrapper.find('header .text-lg').classes()).not.toContain('text-white')
    })
})

describe('ProLayout drawer', () => {
    it('supports placement, width and a custom drawer slot', async () => {
        const wrapper = mountLayout(
            {
                mobileBreakpoint: 2000,
                drawerPlacement: 'right',
                drawerWidth: 320,
            },
            {
                drawer: () => h('div', { class: 'custom-drawer' }, 'custom drawer'),
            }
        )
        await nextTick()

        ;(wrapper.vm as any).openDrawer()
        await flushPromises()

        expect(document.body.textContent).toContain('custom drawer')
        const drawer = document.body.querySelector<HTMLElement>('.n-drawer')
        expect(drawer).not.toBeNull()
        expect(drawer?.className).toContain('n-drawer--right')
        expect(drawer?.style.width).toBe('320px')
    })

    it('switches to mobile mode by container width', async () => {
        let observerCallback: ResizeObserverCallback | undefined
        class ResizeObserverMock {
            constructor(callback: ResizeObserverCallback) {
                observerCallback = callback
            }
            observe() {}
            disconnect() {}
            unobserve() {}
        }
        vi.stubGlobal('ResizeObserver', ResizeObserverMock)

        const wrapper = mountLayout({
            mobileBreakpoint: 500,
            breakpointMode: 'container',
            layout: 'side',
        })
        await nextTick()
        expect(wrapper.find('header button').exists()).toBe(false)

        Object.defineProperty(wrapper.element, 'clientWidth', { configurable: true, value: 400 })
        observerCallback?.([], {} as ResizeObserver)
        await nextTick()

        expect(wrapper.find('header button').exists()).toBe(true)

        Object.defineProperty(wrapper.element, 'clientWidth', { configurable: true, value: 700 })
        observerCallback?.([], {} as ResizeObserver)
        await nextTick()

        expect(wrapper.find('header button').exists()).toBe(false)
    })
})
