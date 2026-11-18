import { NButton, NDrawer, NMenu, NScrollbar, NSpin } from "naive-ui";
import type { MenuGroupOption, MenuInst, MenuOption } from "naive-ui";
import { proLayoutEmits, proLayoutProps } from "./types";
import { computed, nextTick, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import type { Ref } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { Icon } from '@iconify/vue'
import { cn } from '@/utils'

type MenuKey = string | number

function toTopLevel(options: MenuOption[]): MenuOption[] {
  return options.map((option) => {
    if (option.type === 'group' && option.children)
      return { ...option, children: toTopLevel(option.children) }
    return { ...option, children: undefined }
  })
}

function hasMenuKey(options: MenuOption[] | undefined, key: string | number): boolean {
  return (options ?? []).some(option => option.key === key || hasMenuKey(option.children as MenuOption[] | undefined, key));
}

function getMenuAncestorKeys(options: MenuOption[] | undefined, key: MenuKey | null | undefined): MenuKey[] {
  if (key === null || key === undefined) return []
  const walk = (items: MenuOption[] | undefined, path: MenuKey[]): MenuKey[] | null => {
    for (const option of items ?? []) {
      if (option.key === key) return path
      const optionKey = option.key
      const nextPath = optionKey === undefined ? path : [...path, optionKey]
      const hit = walk(option.children as MenuOption[] | undefined, nextPath)
      if (hit) return hit
    }
    return null
  }
  return walk(options, []) ?? []
}

function mergeMenuKeys(base: MenuKey[], extra: MenuKey[]): MenuKey[] {
  const merged = [...base]
  const seen = new Set(base)
  for (const key of extra) {
    if (seen.has(key)) continue
    seen.add(key)
    merged.push(key)
  }
  return merged
}

function includesAllKeys(keys: MenuKey[], required: MenuKey[]): boolean {
  return required.every(key => keys.includes(key))
}

export default defineComponent({
  name: "ProLayout",
  props: proLayoutProps,
  emits: proLayoutEmits,
  setup(props, { slots, emit, expose }) {

    const currentCollapsed = ref(props.collapsed ?? props.menu?.collapsed ?? false);
    watch(() => props.collapsed, (val) => {
      if (val !== undefined)
        currentCollapsed.value = val;
    });
    const toggleCollapsed = () => {
      currentCollapsed.value = !currentCollapsed.value;
      emit('collapseChange', currentCollapsed.value);
    }
    const setCollapsed = (value: boolean) => {
      currentCollapsed.value = value;
      emit('collapseChange', value);
    }

    const remoteMenus = shallowRef<MenuOption[] | null>(null);
    const requestLoading = ref(false);
    const menuOptions = computed((): MenuOption[] => {
      if (remoteMenus.value) return remoteMenus.value;
      return props.menus ?? [];
    });
    const menuLoading = computed(() => !!props.menu?.loading || requestLoading.value);

    const currentMenuValue = ref<MenuKey | undefined>(props.menuValue)
    watch(() => props.menuValue, (value) => {
      currentMenuValue.value = value
    })

    const initialAncestorKeys = getMenuAncestorKeys(menuOptions.value, props.menuValue)
    const initialExpandedKeys = props.expandedKeys ? [...props.expandedKeys] : initialAncestorKeys
    const currentExpandedKeys = ref<MenuKey[]>(
      props.autoExpandSelected ? mergeMenuKeys(initialExpandedKeys, initialAncestorKeys) : initialExpandedKeys
    )

    function expandToValue(key: MenuKey | null | undefined) {
      if (!props.autoExpandSelected || key === null || key === undefined) return
      const ancestors = getMenuAncestorKeys(menuOptions.value, key)
      if (!ancestors.length || includesAllKeys(currentExpandedKeys.value, ancestors)) return
      const next = mergeMenuKeys(currentExpandedKeys.value, ancestors)
      currentExpandedKeys.value = next
      emit('update:expandedKeys', [...next])
    }

    watch(currentMenuValue, value => { expandToValue(value) })
    watch(() => props.expandedKeys, (keys) => {
      currentExpandedKeys.value = keys
        ? [...keys]
        : getMenuAncestorKeys(menuOptions.value, currentMenuValue.value)
    })
    watch(() => props.autoExpandSelected, (enabled) => {
      if (enabled) expandToValue(currentMenuValue.value)
    })
    watch(menuOptions, () => {
      if (!props.autoExpandSelected) return
      const ancestors = getMenuAncestorKeys(menuOptions.value, currentMenuValue.value)
      if (ancestors.length && !includesAllKeys(currentExpandedKeys.value, ancestors))
        currentExpandedKeys.value = mergeMenuKeys(currentExpandedKeys.value, ancestors)
    })

    let requestSeq = 0;
    async function loadMenus() {
      const request = props.menu?.request;
      if (!request) return;
      // params 连续变化时会有多个请求在飞，只让最后一次落地
      const seq = ++requestSeq;
      requestLoading.value = true;
      props.menu?.onLoadingChange?.(true);
      try {
        const result = await request(props.menu?.params ?? {}, props.menus ?? []);
        if (seq === requestSeq) remoteMenus.value = result;
      } catch (error) {
        console.error('Failed to fetch remote menus:', error);
      } finally {
        if (seq === requestSeq) {
          requestLoading.value = false;
          props.menu?.onLoadingChange?.(false);
        }
      }
    }
    watch(() => props.menus, loadMenus, { immediate: true });
    watch(() => props.menu?.params, loadMenus, { deep: true });

    const activeTopKey = ref<string | number | null>(null);
    const topLevelOptions = computed<MenuOption[]>(() => menuOptions.value.flatMap(option => option.type === 'group' ? (option.children ?? []) : [option]));
    const headerMenus = computed(() => props.layout === 'mix' ? toTopLevel(menuOptions.value) : menuOptions.value);
    const sideMenus = computed<MenuOption[]>(() => {
      if (props.layout !== 'mix') return menuOptions.value;
      const active = topLevelOptions.value.find(option => option.key === activeTopKey.value);
      return active?.children ?? [];
    });
    watch([headerMenus, currentMenuValue], ([options, value]) => {
      if (props.layout !== 'mix') return;
      // 单一 value 源：外部选中项反推所属一级项，顶栏点击只切一级、不写 value
      if (value !== undefined) {
        const owner = topLevelOptions.value.find(option => hasMenuKey(option.children as MenuOption[] | undefined, value));
        if (owner) {
          activeTopKey.value = owner.key ?? null;
          return;
        }
      }
      if (options.some(option => option.key === activeTopKey.value)) return;
      const source = topLevelOptions.value;
      const first = source.find(option => option.children?.length) ?? source[0];
      activeTopKey.value = first?.key ?? null;
    }, { immediate: true });

    // mobileBreakpoint 未传时用一个永不匹配的查询，默认行为与旧版完全一致
    const rootRef = ref<HTMLElement | null>(null)
    const containerWidth = ref(0)
    const viewportIsMobile = useMediaQuery(computed(() => `(max-width: ${props.mobileBreakpoint ?? 0}px)`))
    const isMobile = computed(() => {
      if (props.mobileBreakpoint === undefined) return false
      if (props.breakpointMode === 'container')
        return containerWidth.value > 0 && containerWidth.value <= props.mobileBreakpoint
      return viewportIsMobile.value
    })
    let containerObserver: ResizeObserver | null = null
    function stopContainerObserver() {
      containerObserver?.disconnect()
      containerObserver = null
    }
    watch(
      [rootRef, () => props.breakpointMode, () => props.mobileBreakpoint],
      () => {
        stopContainerObserver()
        containerWidth.value = 0
        if (props.breakpointMode !== 'container' || props.mobileBreakpoint === undefined) return
        const el = rootRef.value
        if (!el || typeof ResizeObserver === 'undefined') return
        const updateWidth = () => { containerWidth.value = el.clientWidth }
        containerObserver = new ResizeObserver(updateWidth)
        containerObserver.observe(el)
        updateWidth()
      },
      { immediate: true, flush: 'post' }
    )
    onBeforeUnmount(stopContainerObserver)

    const drawerVisible = ref(false);
    const drawerWidth = computed(() => props.drawerWidth ?? props.siderWidth)
    const openDrawer = () => {
      if (isMobile.value) drawerVisible.value = true
    }
    const closeDrawer = () => {
      drawerVisible.value = false
    }
    const toggleDrawer = () => {
      if (isMobile.value) drawerVisible.value = !drawerVisible.value
    }
    watch(isMobile, (mobile) => {
      if (!mobile) drawerVisible.value = false;
    });

    const handleMenuSelect = (key: string | number, item: MenuOption) => {
      currentMenuValue.value = key
      emit('update:menuValue', key);
      expandToValue(key)
      emit('menuClick', key, item);
    }
    const setMenuValue = (key: string | number) => {
      currentMenuValue.value = key
      emit('update:menuValue', key)
      expandToValue(key)
    }
    const handleTopMenuSelect = (key: string | number, item: MenuOption) => {
      activeTopKey.value = key;
      emit('topMenuClick', key, topLevelOptions.value.find(option => option.key === key) ?? item);
    }
    const handleExpandedKeysChange = (keys: (string | number)[]) => {
      currentExpandedKeys.value = [...keys]
      emit('update:expandedKeys', keys);
    }
    const setExpandedKeys = (keys: (string | number)[]) => {
      currentExpandedKeys.value = [...keys]
      emit('update:expandedKeys', [...keys])
    }
    const handleDrawerMenuSelect = (key: string | number, item: MenuOption) => {
      handleMenuSelect(key, item);
      drawerVisible.value = false;
    }

    const sideMenuRef = ref<MenuInst | null>(null)
    const headerMenuRef = ref<MenuInst | null>(null)
    const drawerMenuRef = ref<MenuInst | null>(null)
    const sideMenuContainerRef = ref<HTMLElement | null>(null)
    const headerMenuContainerRef = ref<HTMLElement | null>(null)
    const drawerMenuContainerRef = ref<HTMLElement | null>(null)

    const menuNodeProps = (option: MenuOption | MenuGroupOption) => option.key === undefined
      ? {}
      : { 'data-prolayout-menu-key': String(option.key) }

    async function scrollToMenu(key: string | number): Promise<boolean> {
      if (isMobile.value) drawerVisible.value = true
      await nextTick()
      const useHeaderMenu = props.layout === 'top'
        || (props.layout === 'mix' && !hasMenuKey(sideMenus.value, key))
      const menuRef: Ref<MenuInst | null> = isMobile.value
        ? drawerMenuRef
        : useHeaderMenu
          ? headerMenuRef
          : sideMenuRef
      const container = isMobile.value
        ? drawerMenuContainerRef.value
        : useHeaderMenu
          ? headerMenuContainerRef.value
          : sideMenuContainerRef.value
      const menu = menuRef.value
      if (!menu || !container) return false
      menu.showOption(key)
      await nextTick()
      await nextTick()
      const target = Array.from(container.querySelectorAll<HTMLElement>('[data-prolayout-menu-key]'))
        .find(el => el.dataset.prolayoutMenuKey === String(key))
      if (!target) return false
      target.scrollIntoView?.({ block: 'nearest', inline: 'nearest' })
      return true
    }

    const collapsedWidth = computed(() => props.menu?.collapsedWidth ?? 64);
    const collapsedIconSize = computed(() => props.menu?.collapsedIconSize ?? 22);
    const hasTrigger = computed(() => props.layout !== 'top');

    const renderTitle = () => {
      if (props.titleRender) return props.titleRender(props.title);
      if (!props.title) return null;
      return <div class="text-lg font-bold">{props.title}</div>;
    }

    const renderHorizontalMenu = () => (
      <div ref={headerMenuContainerRef} class="flex-1 min-w-0 mx-4 flex items-center">
        {menuLoading.value
          ? <NSpin size="small" />
          : <NMenu
            ref={headerMenuRef}
            mode="horizontal"
            responsive={props.menu?.responsive}
            options={headerMenus.value}
            value={props.layout === 'mix' ? activeTopKey.value : currentMenuValue.value}
            expandedKeys={currentExpandedKeys.value}
            nodeProps={menuNodeProps}
            onUpdate:value={props.layout === 'mix' ? handleTopMenuSelect : handleMenuSelect}
            onUpdate:expandedKeys={handleExpandedKeysChange}
          />}
      </div>
    );

    const renderMenu = (
      options: MenuOption[],
      onSelect: (key: string | number, item: MenuOption) => void,
      menuRef: Ref<MenuInst | null>,
      collapsed = false
    ) => (
      <NScrollbar>
        {menuLoading.value
          ? <div class="flex justify-center py-6"><NSpin size="small" /></div>
          : <NMenu
            ref={menuRef}
            collapsed={collapsed}
            collapsedWidth={collapsedWidth.value}
            collapsedIconSize={collapsedIconSize.value}
            options={options}
            value={currentMenuValue.value}
            expandedKeys={currentExpandedKeys.value}
            nodeProps={menuNodeProps}
            onUpdate:value={onSelect}
            onUpdate:expandedKeys={handleExpandedKeysChange}
          />}
      </NScrollbar>
    );

    expose({
      reloadMenus: loadMenus,
      setCollapsed,
      toggleCollapsed,
      openDrawer,
      closeDrawer,
      toggleDrawer,
      setMenuValue,
      setExpandedKeys,
      scrollToMenu,
    });

    return () => (
      <div ref={rootRef} class={cn('w-full flex flex-col', props.class)} style={props.style}>
        <header class={cn(
          'p-4 h-16 flex items-center text-white bg-zinc-800 shadow-[0_2px_4px_rgba(0,0,0,0.1)]',
          props.headerClass
        )}>
          {isMobile.value && (
            <NButton
              quaternary
              size="small"
              class="mr-2"
              style={{ color: 'inherit' }}
              onClick={openDrawer}
            >
              {{
                icon: () => <Icon icon="hugeicons:menu-01" class="cursor-pointer" />
              }}
            </NButton>
          )}
          {props.logo && <img src={props.logo} alt="" class="h-8 w-auto mr-2 object-contain" />}
          {renderTitle()}
          {!isMobile.value && props.layout !== 'side' && renderHorizontalMenu()}
          {slots['header-extra']?.()}
          {!isMobile.value && hasTrigger.value && props.collapsedTriggerPosition === 'top' && (
            <NButton
              quaternary
              size="small"
              class="ml-2"
              style={{ color: 'inherit' }}
              onClick={toggleCollapsed}
            >
              {{
                icon: () => <Icon icon="hugeicons:sidebar-left-01" class="cursor-pointer" />
              }}
            </NButton>
          )}
        </header>
        <main class="flex flex-1 min-h-0 overflow-hidden">
          {!isMobile.value && (props.layout === 'side' || (props.layout === 'mix' && sideMenus.value.length > 0)) && (
            <aside
              ref={sideMenuContainerRef}
              class={cn(
                'bg-zinc-800 text-white transition-all duration-300 ease-in-out flex flex-col gap-2 min-h-0 overflow-hidden',
                props.siderClass
              )}
              style={{ width: `${currentCollapsed.value ? collapsedWidth.value : props.siderWidth}px` }}
            >
              {renderMenu(sideMenus.value, handleMenuSelect, sideMenuRef, currentCollapsed.value)}
              {hasTrigger.value && props.collapsedTriggerPosition === 'bottom' && (
                <div class="mt-auto! p-4">
                  <NButton
                    quaternary
                    style={{ color: 'inherit' }}
                    onClick={toggleCollapsed}
                  >
                    {{
                      icon: () => <Icon icon="hugeicons:sidebar-right-01" class="cursor-pointer" />
                    }}
                  </NButton>
                </div>
              )}
            </aside>
          )}
          <section class={cn('flex-1 p-4', props.contentScroll && 'flex flex-col min-h-0', props.contentClass)}>
            {props.contentScroll
              ? <NScrollbar class="flex-1 min-h-0">{slots.default?.()}</NScrollbar>
              : slots.default?.()}
          </section>
        </main>
        {
          props.footer && (
            <footer
              class={cn('p-4 h-16 flex items-center shadow-[0_-2px_4px_rgba(0,0,0,0.1)]', props.footerClass)}
              style={props.footerStyle}
            >
              {slots.footer?.() ?? 'Footer'}
            </footer>
          )
        }
        {isMobile.value && (
          <NDrawer
            show={drawerVisible.value}
            onUpdate:show={(value: boolean) => { drawerVisible.value = value }}
            placement={props.drawerPlacement}
            width={drawerWidth.value}
            height={props.drawerPlacement === 'top' || props.drawerPlacement === 'bottom' ? drawerWidth.value : undefined}
          >
            {slots.drawer
              ? slots.drawer({ menus: menuOptions.value, close: closeDrawer })
              : (
                <div
                  ref={drawerMenuContainerRef}
                  class={cn(
                    'h-full bg-zinc-800 text-white flex flex-col gap-2 min-h-0 overflow-hidden',
                    props.siderClass
                  )}
                >
                  {renderMenu(menuOptions.value, handleDrawerMenuSelect, drawerMenuRef)}
                </div>
              )}
          </NDrawer>
        )}
      </div>
    );
  },
});
