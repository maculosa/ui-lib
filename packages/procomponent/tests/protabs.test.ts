import { flushPromises, mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ProTabs from '../src/components/ProTabs/src'
import { diffMove, formatBadge, moveItem } from '../src/components/ProTabs/src/utils'
import { buildVirtualWindow, estimateTabWidth } from '../src/components/ProTabs/src/virtual'

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
            props: { icon: String },
            render: () => h('span', { class: 'mock-icon' }),
        }),
    }
})

// Sortable 依赖真实 DOM 测量，单元测试里用透传容器替代，拖拽路径本身在浏览器中验证
vi.mock('vue-draggable-next', async () => {
    const { defineComponent, h } = await import('vue')
    return {
        VueDraggableNext: defineComponent({
            name: 'VueDraggableNext',
            props: {
                tag: { type: String, default: 'div' },
                componentData: { type: Object, default: null },
                modelValue: { type: Array, default: () => [] },
                itemKey: { type: [String, Function], default: undefined },
                group: { type: [String, Object], default: undefined },
            },
            emits: ['update:modelValue', 'start', 'end', 'change', 'add', 'remove'],
            setup(props, { slots, attrs }) {
                return () => h(props.tag, attrs, slots.default?.() ?? [])
            },
        }),
    }
})

const baseOptions = [
    { label: '概览', key: 'a' },
    { label: '明细', key: 'b' },
    { label: '归档', key: 'c', disabled: true },
    { label: '日志', key: 'd' },
]

afterEach(() => {
    document.body.replaceChildren()
    vi.restoreAllMocks()
})

function mountTabs(props: Record<string, any> = {}, slots?: Record<string, any>) {
    return mount(ProTabs, {
        props: { options: baseOptions, ...props },
        slots,
        attachTo: document.body,
    })
}

function tabsOf(wrapper: ReturnType<typeof mountTabs>) {
    return wrapper.findAll('[role="tab"]')
}

async function settle() {
    await nextTick()
    await flushPromises()
}

describe('ProTabs 工具函数', () => {
    it('formatBadge 处理溢出阈值', () => {
        expect(formatBadge(5, 99)).toBe('5')
        expect(formatBadge(120, 99)).toBe('99+')
        expect(formatBadge(120, undefined)).toBe('120')
    })

    it('moveItem 与 diffMove 只在单次移动时返回结果', () => {
        expect(moveItem(['a', 'b', 'c'], 0, 2)).toEqual(['b', 'c', 'a'])
        expect(diffMove(['a', 'b', 'c'], ['b', 'a', 'c'])).toEqual({ from: 0, to: 1 })
        expect(diffMove(['a', 'b', 'c'], ['a', 'b', 'c'])).toBeNull()
        expect(diffMove(['a', 'b', 'c'], ['c', 'b', 'a'])).toBeNull()
    })
})

describe('ProTabs 选中与键盘', () => {
    it('只给当前页签 0 的 tabindex，禁用项始终为 -1', async () => {
        const wrapper = mountTabs({ defaultActive: 'a' })
        const tabs = tabsOf(wrapper)
        expect(tabs[0].attributes('tabindex')).toBe('0')
        expect(tabs[1].attributes('tabindex')).toBe('-1')
        expect(tabs[2].attributes('tabindex')).toBe('-1')
        wrapper.unmount()
    })

    it('方向键循环切换并跳过禁用项', async () => {
        const wrapper = mountTabs({ defaultActive: 'a' })
        const tabs = tabsOf(wrapper)

        await tabs[0].trigger('keydown', { key: 'ArrowRight' })
        await settle()
        expect(wrapper.emitted('update:active')?.at(-1)).toEqual(['b'])

        await tabsOf(wrapper)[1].trigger('keydown', { key: 'ArrowRight' })
        await settle()
        expect(wrapper.emitted('update:active')?.at(-1)).toEqual(['d'])

        await tabsOf(wrapper)[3].trigger('keydown', { key: 'ArrowRight' })
        await settle()
        expect(wrapper.emitted('update:active')?.at(-1)).toEqual(['a'])
    })

    it('Home / End 跳到首尾可用项', async () => {
        const wrapper = mountTabs({ defaultActive: 'b' })
        await tabsOf(wrapper)[1].trigger('keydown', { key: 'End' })
        await settle()
        expect(wrapper.emitted('update:active')?.at(-1)).toEqual(['d'])

        await tabsOf(wrapper)[3].trigger('keydown', { key: 'Home' })
        await settle()
        expect(wrapper.emitted('update:active')?.at(-1)).toEqual(['a'])
    })

    it('Enter / Space 激活，禁用项点击无效', async () => {
        const wrapper = mountTabs({ defaultActive: 'a' })
        await tabsOf(wrapper)[1].trigger('keydown', { key: 'Enter' })
        expect(wrapper.emitted('update:active')?.at(-1)).toEqual(['b'])

        await tabsOf(wrapper)[3].trigger('keydown', { key: ' ' })
        expect(wrapper.emitted('update:active')?.at(-1)).toEqual(['d'])

        await tabsOf(wrapper)[2].trigger('click')
        expect(wrapper.emitted('update:active')?.length).toBe(2)
    })

    it('拖拽开启时 Alt + 方向键抛出 reorder', async () => {
        const wrapper = mountTabs({ defaultActive: 'a', draggable: true })
        const tablist = wrapper.find('[role="tablist"]')
        expect(tablist.exists()).toBe(true)
        expect(tablist.classes()).toContain('min-h-[40px]')
        await tabsOf(wrapper)[0].trigger('keydown', { key: 'ArrowRight', altKey: true })
        expect(wrapper.emitted('reorder')?.[0]).toEqual([['b', 'a', 'c', 'd'], 0, 1])
        wrapper.unmount()
    })
})

describe('ProTabs ARIA 与关闭', () => {
    it('关闭按钮 aria-label 可本地化', () => {
        const wrapper = mountTabs({ closable: true, closeLabel: 'Close' })
        const button = tabsOf(wrapper)[0].find('button')
        expect(button.attributes('aria-label')).toBe('Close 概览')
        wrapper.unmount()
    })

    it('按页签控制关闭，选项覆盖组件级开关', () => {
        const wrapper = mountTabs({
            closable: false,
            options: [
                { label: 'A', key: 'a', closable: true },
                { label: 'B', key: 'b', closable: false },
            ],
        })
        const tabs = tabsOf(wrapper)
        expect(tabs[0].find('button').exists()).toBe(true)
        expect(tabs[1].find('button').exists()).toBe(false)
        wrapper.unmount()

        const wrapper2 = mountTabs({
            closable: true,
            options: [
                { label: 'A', key: 'a' },
                { label: 'B', key: 'b', closable: false },
            ],
        })
        const tabs2 = tabsOf(wrapper2)
        expect(tabs2[0].find('button').exists()).toBe(true)
        expect(tabs2[1].find('button').exists()).toBe(false)
        wrapper2.unmount()
    })

    it('面板与页签通过 id 双向关联', () => {
        const wrapper = mountTabs({ defaultActive: 'a' }, {
            panel: ({ option }: any) => h('p', `panel-${option.key}`),
        })
        const tab = tabsOf(wrapper)[0]
        const panel = wrapper.find('[role="tabpanel"]')
        expect(tab.attributes('aria-controls')).toBe(panel.attributes('id'))
        expect(panel.attributes('aria-labelledby')).toBe(tab.attributes('id'))
        wrapper.unmount()
    })
})

describe('ProTabs 徽标', () => {
    it('旧版 dot 需要 showBadge，0 也渲染', () => {
        const wrapper = mountTabs({
            showBadge: true,
            options: [{ label: 'A', key: 'a', dot: 0 }],
        })
        expect(tabsOf(wrapper)[0].text()).toContain('0')
        wrapper.unmount()

        const hidden = mountTabs({ options: [{ label: 'A', key: 'a', dot: 0 }] })
        expect(tabsOf(hidden)[0].text()).not.toContain('0')
        hidden.unmount()
    })

    it('badge 支持数字溢出、红点与自定义渲染', () => {
        const custom = mountTabs({
            options: [{ label: 'A', key: 'a', badge: 120 }],
            badgeMax: 99,
        })
        expect(tabsOf(custom)[0].text()).toContain('99+')
        custom.unmount()

        const dot = mountTabs({ options: [{ label: 'A', key: 'a', badge: 'dot' }] })
        expect(tabsOf(dot)[0].html()).toContain('h-2 w-2')
        dot.unmount()

        const render = mountTabs({
            options: [{ label: 'A', key: 'a', badge: () => h('em', { class: 'custom-badge' }, 'new') }],
        })
        expect(tabsOf(render)[0].find('.custom-badge').text()).toBe('new')
        render.unmount()
    })

    it('选项级 badgeMax 覆盖组件级', () => {
        const wrapper = mountTabs({
            badgeMax: 99,
            options: [{ label: 'A', key: 'a', badge: 12, badgeMax: 9 }],
        })
        expect(tabsOf(wrapper)[0].text()).toContain('9+')
        wrapper.unmount()
    })
})

describe('ProTabs 新增、重命名与路由', () => {
    it('内置新增按钮抛出 add', async () => {
        const wrapper = mountTabs({ addable: true })
        await wrapper.find('button[aria-label="新增页签"]').trigger('click')
        expect(wrapper.emitted('add')).toHaveLength(1)
        wrapper.unmount()
    })

    it('双击进入重命名，Enter 提交、Esc 取消', async () => {
        const wrapper = mountTabs({ renamable: true })
        await tabsOf(wrapper)[0].trigger('dblclick')
        await settle()
        const input = wrapper.find('input.pro-tabs-rename-input')
        expect(input.exists()).toBe(true)

        await input.setValue('  新名称  ')
        await input.trigger('keydown', { key: 'Enter' })
        expect(wrapper.emitted('rename')?.[0]).toEqual(['a', '新名称'])
        expect(wrapper.find('input.pro-tabs-rename-input').exists()).toBe(false)

        await tabsOf(wrapper)[1].trigger('dblclick')
        await settle()
        await wrapper.find('input.pro-tabs-rename-input').setValue('丢弃')
        await wrapper.find('input.pro-tabs-rename-input').trigger('keydown', { key: 'Escape' })
        expect(wrapper.emitted('rename')).toHaveLength(1)
        wrapper.unmount()
    })

    it('点击页签调用 router.push，route 可作为选中态来源', async () => {
        const push = vi.fn()
        const wrapper = mountTabs({ router: { push } })
        await tabsOf(wrapper)[1].trigger('click')
        expect(push).toHaveBeenCalledWith('b')
        wrapper.unmount()

        const routed = mountTabs({ route: 'd' })
        expect(tabsOf(routed)[3].attributes('aria-selected')).toBe('true')
        routed.unmount()
    })

    it('active 优先于 route', () => {
        const wrapper = mountTabs({ active: 'a', route: 'd' })
        expect(tabsOf(wrapper)[0].attributes('aria-selected')).toBe('true')
        expect(tabsOf(wrapper)[3].attributes('aria-selected')).toBe('false')
        wrapper.unmount()
    })
})

describe('ProTabs 尺寸与滚动', () => {
    it('size 切换 token 类名', () => {
        const medium = mountTabs()
        expect(tabsOf(medium)[0].classes()).toContain('h-8')
        medium.unmount()

        const small = mountTabs({ size: 'small' })
        expect(tabsOf(small)[0].classes()).toContain('h-7')
        expect(tabsOf(small)[0].classes()).toContain('text-[13px]')
        small.unmount()

        const large = mountTabs({ size: 'large' })
        expect(tabsOf(large)[0].classes()).toContain('h-9')
        expect(tabsOf(large)[0].classes()).toContain('text-[15px]')
        large.unmount()
    })

    it('溢出时出现滚动按钮，点击滚动 80% 视口', async () => {
        const wrapper = mountTabs()
        const scroller = wrapper.find('[data-pro-tabs-scroller]').element as HTMLElement
        Object.defineProperty(scroller, 'scrollWidth', { value: 300, configurable: true })
        Object.defineProperty(scroller, 'clientWidth', { value: 100, configurable: true })
        let scrollLeft = 0
        Object.defineProperty(scroller, 'scrollLeft', {
            configurable: true,
            get: () => scrollLeft,
            set: (value: number) => { scrollLeft = value },
        })
        const scrollBy = vi.fn()
        scroller.scrollBy = scrollBy

        scroller.dispatchEvent(new Event('scroll'))
        await nextTick()
        expect(wrapper.find('button[aria-label="向左滚动"]').exists()).toBe(false)
        const right = wrapper.find('button[aria-label="向右滚动"]')
        expect(right.exists()).toBe(true)

        await right.trigger('click')
        expect(scrollBy).toHaveBeenCalledWith({ left: 80, behavior: 'smooth' })

        scrollLeft = 200
        scroller.dispatchEvent(new Event('scroll'))
        await nextTick()
        expect(wrapper.find('button[aria-label="向左滚动"]').exists()).toBe(true)

        await wrapper.setProps({ scrollButtons: false })
        expect(wrapper.find('button[aria-label="向右滚动"]').exists()).toBe(false)
        wrapper.unmount()
    })
})

describe('ProTabs 内容面板', () => {
    const panelSlot = {
        panel: ({ option }: any) => h('p', { class: 'panel-content' }, `panel-${option.key}`),
    }

    it('keepAlive 关闭时只挂载当前面板', async () => {
        const wrapper = mountTabs({ defaultActive: 'a' }, panelSlot)
        expect(wrapper.findAll('.panel-content').map(node => node.text())).toEqual(['panel-a'])

        await tabsOf(wrapper)[1].trigger('click')
        await settle()
        expect(wrapper.findAll('.panel-content').map(node => node.text())).toEqual(['panel-b'])
        wrapper.unmount()
    })

    it('keepAlive + lazy 首访后才保留面板', async () => {
        const wrapper = mountTabs({ defaultActive: 'a', keepAlive: true, lazy: true }, panelSlot)
        expect(wrapper.findAll('.panel-content').map(node => node.text())).toEqual(['panel-a'])

        await tabsOf(wrapper)[1].trigger('click')
        await settle()
        expect(wrapper.findAll('.panel-content').map(node => node.text())).toEqual(['panel-a', 'panel-b'])

        const panelB = wrapper.findAll('[role="tabpanel"]')[1]
        expect(panelB.attributes('hidden')).toBeUndefined()
        wrapper.unmount()
    })

    it('keepAlive 且非 lazy 时预先挂载全部面板，非当前项 hidden', () => {
        const wrapper = mountTabs({ defaultActive: 'a', keepAlive: true }, panelSlot)
        const panels = wrapper.findAll('[role="tabpanel"]')
        expect(panels).toHaveLength(4)
        expect(panels[0].attributes('hidden')).toBeUndefined()
        expect(panels[1].attributes('hidden')).toBeDefined()
        wrapper.unmount()
    })
})

describe('ProTabs 实例方法', () => {
    it('expose scrollTo / focus / getEl / activeKey', async () => {
        const wrapper = mountTabs({ defaultActive: 'b' })
        const vm = wrapper.vm as any
        expect(vm.activeKey).toBe('b')
        expect(vm.getEl()).toBe(wrapper.find('[data-pro-tabs-scroller]').element)

        const secondTab = tabsOf(wrapper)[1].element as HTMLElement
        const scrollIntoView = vi.fn()
        secondTab.scrollIntoView = scrollIntoView
        vm.scrollTo('b')
        expect(scrollIntoView).toHaveBeenCalled()

        vm.focus()
        expect(document.activeElement).toBe(secondTab)
        wrapper.unmount()
    })
})

describe('ProTabs 虚拟滚动', () => {
    const manyOptions = Array.from({ length: 30 }, (_, index) => ({ label: `页签${index}`, key: `k${index}` }))

    it('窗口计算与宽度估算', () => {
        expect(buildVirtualWindow([50, 50, 50, 50], 10, 0, 60, 0)).toMatchObject({
            start: 0,
            end: 0,
            paddingStart: 0,
            paddingEnd: 170,
        })
        expect(buildVirtualWindow([50, 50, 50, 50], 10, 120, 60, 0)).toMatchObject({
            start: 2,
            end: 2,
            paddingStart: 110,
            paddingEnd: 50,
        })
        expect(buildVirtualWindow([50, 50, 50, 50], 10, 0, 0, 3)).toMatchObject({
            start: 0,
            end: 3,
        })
        expect(buildVirtualWindow([50, 50, 50, 50], 10, 0, 60, 0, [3])).toMatchObject({ start: 0, end: 3 })

        const short = estimateTabWidth({ label: 'AB', key: 'a' }, { size: 'medium' })
        const long = estimateTabWidth({ label: '中文页签', key: 'b' }, { size: 'medium' })
        const decorated = estimateTabWidth(
            { label: 'AB', key: 'c', icon: 'mdi:home', badge: 120, closable: true },
            { size: 'medium' },
        )
        expect(long).toBeGreaterThan(short)
        expect(decorated).toBeGreaterThan(short)
    })

    it('只渲染可视窗口并补充 setsize / posinset', async () => {
        const wrapper = mountTabs({ options: manyOptions, virtual: true })
        const scroller = wrapper.find('[data-pro-tabs-scroller]').element as HTMLElement
        Object.defineProperty(scroller, 'clientWidth', { value: 320, configurable: true })
        Object.defineProperty(scroller, 'scrollWidth', { value: 2000, configurable: true })
        let scrollLeft = 0
        Object.defineProperty(scroller, 'scrollLeft', {
            configurable: true,
            get: () => scrollLeft,
            set: (value: number) => { scrollLeft = value },
        })

        scroller.dispatchEvent(new Event('scroll'))
        await settle()
        const windowed = tabsOf(wrapper)
        expect(windowed.length).toBeLessThan(manyOptions.length)
        expect(windowed.length).toBeGreaterThan(0)
        expect(windowed[0].attributes('aria-setsize')).toBe('30')
        expect(wrapper.find('[data-pro-tabs-spacer="end"]').exists()).toBe(true)

        scrollLeft = 1800
        scroller.dispatchEvent(new Event('scroll'))
        await settle()
        const rendered = tabsOf(wrapper)
        expect(rendered.at(-1)?.attributes('aria-posinset')).toBe('30')
        expect(wrapper.find('[data-pro-tabs-spacer="start"]').exists()).toBe(true)
        wrapper.unmount()
    })

    it('虚拟模式下拖拽失效并给出提示', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
        const wrapper = mountTabs({ options: manyOptions, virtual: true, draggable: true })
        expect(wrapper.findComponent({ name: 'VueDraggableNext' }).exists()).toBe(false)
        await tabsOf(wrapper)[0].trigger('keydown', { key: 'ArrowRight', altKey: true })
        expect(wrapper.emitted('reorder')).toBeUndefined()
        expect(warn).toHaveBeenCalled()
        wrapper.unmount()
    })
})

describe('ProTabs 异步面板', () => {
    it('渲染加载态，完成后显示节点并抛 panel-loaded', async () => {
        let resolveLoader: (node: any) => void = () => {}
        const loader = vi.fn(() => new Promise<any>((resolve) => { resolveLoader = resolve }))
        const wrapper = mountTabs({ panelLoader: loader })
        await settle()

        expect(loader).toHaveBeenCalledTimes(1)
        expect(wrapper.text()).toContain('加载中…')

        resolveLoader(h('p', { class: 'async-panel' }, 'done'))
        await settle()
        expect(wrapper.find('.async-panel').text()).toBe('done')
        expect(wrapper.emitted('panel-loaded')?.[0]).toEqual(['a'])
        wrapper.unmount()
    })

    it('失败后展示错误与重试，重试成功', async () => {
        const loader = vi.fn()
            .mockRejectedValueOnce(new Error('boom'))
            .mockResolvedValueOnce(h('p', { class: 'retried' }, 'ok'))
        const wrapper = mountTabs({ panelLoader: loader })
        await settle()

        expect(wrapper.text()).toContain('加载失败')
        expect(wrapper.text()).toContain('boom')
        expect(wrapper.emitted('panel-error')?.[0][0]).toBe('a')

        const retry = wrapper.findAll('button').find(button => button.text() === '重试')
        expect(retry).toBeTruthy()
        await retry!.trigger('click')
        await settle()
        expect(wrapper.find('.retried').text()).toBe('ok')
        expect(loader).toHaveBeenCalledTimes(2)
        wrapper.unmount()
    })

    it('重新加载时旧请求结果不会覆盖新结果', async () => {
        const resolvers: Array<(node: any) => void> = []
        const loader = vi.fn(() => new Promise<any>((resolve) => { resolvers.push(resolve) }))
        const wrapper = mountTabs({ panelLoader: loader })
        await settle()

        ;(wrapper.vm as any).reloadPanel('a')
        await settle()
        expect(resolvers).toHaveLength(2)

        resolvers[0](h('p', { class: 'stale' }, 'stale'))
        await settle()
        resolvers[1](h('p', { class: 'fresh' }, 'fresh'))
        await settle()

        expect(wrapper.find('.fresh').exists()).toBe(true)
        expect(wrapper.find('.stale').exists()).toBe(false)
        wrapper.unmount()
    })

    it('静态渲染来源优先于 panelLoader', async () => {
        const loader = vi.fn(() => Promise.resolve(h('p', 'async')))
        const wrapper = mountTabs({
            panelLoader: loader,
            options: [{ label: 'A', key: 'a', renderPanel: () => h('p', { class: 'static' }, 'static') }],
        })
        await settle()
        expect(wrapper.find('.static').exists()).toBe(true)
        expect(loader).not.toHaveBeenCalled()
        wrapper.unmount()
    })
})

describe('ProTabs 路由标题', () => {
    it('route 不在 options 中时追加临时页签并抛 route-enter', async () => {
        const wrapper = mountTabs({ route: 'ticket-9', routeTitle: route => `工单 ${route}` })
        await settle()
        const tabs = tabsOf(wrapper)
        expect(tabs).toHaveLength(baseOptions.length + 1)
        expect(tabs.at(-1)?.text()).toContain('工单 ticket-9')
        expect(tabs.at(-1)?.find('button').exists()).toBe(false)
        expect(tabs.at(-1)?.attributes('aria-selected')).toBe('true')
        expect(wrapper.emitted('route-enter')?.[0]).toEqual(['ticket-9', '工单 ticket-9'])
        wrapper.unmount()
    })

    it('route 已在 options 中时不追加也不抛事件', async () => {
        const wrapper = mountTabs({ route: 'b', routeTitle: '不会被使用' })
        await settle()
        expect(tabsOf(wrapper)).toHaveLength(baseOptions.length)
        expect(wrapper.emitted('route-enter')).toBeUndefined()
        wrapper.unmount()
    })
})

describe('ProTabs 右键菜单', () => {
    it('默认关闭，右键不渲染菜单', async () => {
        const wrapper = mountTabs({ closable: true })
        await tabsOf(wrapper)[0].trigger('contextmenu', { clientX: 10, clientY: 10 })
        expect(document.querySelector('[data-pro-tabs-menu]')).toBeNull()
        wrapper.unmount()
    })

    it('四个命令按可关闭性置灰，并抛出对应事件', async () => {
        const wrapper = mountTabs({ closable: true, contextMenu: true })
        await tabsOf(wrapper)[0].trigger('contextmenu', { clientX: 10, clientY: 10 })
        const menu = document.querySelector('[data-pro-tabs-menu]')
        expect(menu).toBeTruthy()
        const items = [...(menu as HTMLElement).querySelectorAll<HTMLButtonElement>('[role="menuitem"]')]
        expect(items.map(item => item.textContent)).toEqual(['关闭当前', '关闭其他', '关闭右侧', '关闭全部'])
        expect(items.map(item => item.disabled)).toEqual([false, false, false, false])

        items[1].click()
        await nextTick()
        expect(wrapper.emitted('close-others')?.[0]).toEqual(['a'])
        expect(document.querySelector('[data-pro-tabs-menu]')).toBeNull()
        wrapper.unmount()

        const locked = mountTabs({ closable: false, contextMenu: true })
        await tabsOf(locked)[0].trigger('contextmenu', { clientX: 10, clientY: 10 })
        const lockedItems = [...document.querySelectorAll<HTMLButtonElement>('[data-pro-tabs-menu] [role="menuitem"]')]
        expect(lockedItems.every(item => item.disabled)).toBe(true)
        locked.unmount()
    })

    it('支持 Shift+F10 打开与 Esc 关闭', async () => {
        const wrapper = mountTabs({ closable: true, contextMenu: true })
        await tabsOf(wrapper)[1].trigger('keydown', { key: 'F10', shiftKey: true })
        const menu = document.querySelector('[data-pro-tabs-menu]') as HTMLElement
        expect(menu).toBeTruthy()
        menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
        await nextTick()
        expect(document.querySelector('[data-pro-tabs-menu]')).toBeNull()
        wrapper.unmount()
    })
})

describe('ProTabs 跨容器拖拽', () => {
    it('跨组落位抛 transfer，源容器不再抛 reorder', async () => {
        const source = mountTabs({ draggable: true, dragGroup: 'source' })
        const target = mountTabs({
            draggable: true,
            dragGroup: { name: 'target' },
            options: [{ label: 'X', key: 'x' }],
        })
        const sourceDraggable = source.findComponent({ name: 'VueDraggableNext' })
        const targetDraggable = target.findComponent({ name: 'VueDraggableNext' })

        expect(sourceDraggable.props('group')).toEqual({ name: 'source', pull: true, put: true })

        sourceDraggable.vm.$emit('start', { oldIndex: 0, from: {}, to: {} })
        targetDraggable.vm.$emit('change', { added: { element: baseOptions[0], newIndex: 0 } })
        await nextTick()
        expect(target.emitted('transfer')?.[0][0]).toEqual({
            key: 'a',
            from: 'source',
            to: 'target',
            index: 0,
        })

        sourceDraggable.vm.$emit('end', { from: {}, to: {} })
        expect(source.emitted('reorder')).toBeUndefined()
        source.unmount()
        target.unmount()
    })

    it('同组跨容器同样抛 transfer', async () => {
        const left = mountTabs({ draggable: true, dragGroup: 'board' })
        const right = mountTabs({
            draggable: true,
            dragGroup: 'board',
            options: [{ label: 'Y', key: 'y' }],
        })
        const leftDraggable = left.findComponent({ name: 'VueDraggableNext' })
        const rightDraggable = right.findComponent({ name: 'VueDraggableNext' })

        leftDraggable.vm.$emit('start', { oldIndex: 1, from: {}, to: {} })
        rightDraggable.vm.$emit('change', { added: { element: baseOptions[1], newIndex: 0 } })
        await nextTick()
        expect(right.emitted('transfer')?.[0][0]).toEqual({
            key: 'b',
            from: 'board',
            to: 'board',
            index: 0,
        })
        left.unmount()
        right.unmount()
    })
})
