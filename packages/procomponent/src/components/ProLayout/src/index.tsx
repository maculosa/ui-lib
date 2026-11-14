import { NButton, NMenu, NScrollbar, NSpin } from "naive-ui";
import type { MenuOption } from "naive-ui";
import { proLayoutEmits, proLayoutProps } from "./types";
import { computed, ref, shallowRef, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { cn } from '@/utils'

function toTopLevel(options: MenuOption[]): MenuOption[] {
  return options.map((option) => {
    if (option.type === 'group' && option.children)
      return { ...option, children: toTopLevel(option.children) }
    return { ...option, children: undefined }
  })
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
    watch(headerMenus, (options) => {
      if (props.layout !== 'mix') return;
      if (options.some(option => option.key === activeTopKey.value)) return;
      const source = topLevelOptions.value;
      const first = source.find(option => option.children?.length) ?? source[0];
      activeTopKey.value = first?.key ?? null;
    }, { immediate: true });

    const collapsedWidth = computed(() => props.menu?.collapsedWidth ?? 64);
    const collapsedIconSize = computed(() => props.menu?.collapsedIconSize ?? 22);
    const hasTrigger = computed(() => props.layout !== 'top');

    const renderTitle = () => {
      if (props.titleRender) return props.titleRender(props.title);
      if (!props.title) return null;
      return <div class="text-white text-lg font-bold">{props.title}</div>;
    }

    const renderHorizontalMenu = () => (
      <div class="flex-1 min-w-0 mx-4 flex items-center">
        {menuLoading.value
          ? <NSpin size="small" />
          : <NMenu
            mode="horizontal"
            responsive={props.menu?.responsive}
            options={headerMenus.value}
            value={props.layout === 'mix' ? activeTopKey.value : undefined}
            onUpdate:value={(key: string | number) => { activeTopKey.value = key }}
          />}
      </div>
    );

    const renderSideMenu = () => (
      <NScrollbar>
        {menuLoading.value
          ? <div class="flex justify-center py-6"><NSpin size="small" /></div>
          : <NMenu
            collapsed={currentCollapsed.value}
            collapsedWidth={collapsedWidth.value}
            collapsedIconSize={collapsedIconSize.value}
            options={sideMenus.value}
          />}
      </NScrollbar>
    );

    expose({ reloadMenus: loadMenus, setCollapsed, toggleCollapsed });

    return () => (
      <div class={cn('w-full flex flex-col', props.class)} style={props.style}>
        <header class={cn(
          'p-4 h-16 flex items-center bg-zinc-800 shadow-[0_2px_4px_rgba(0,0,0,0.1)]',
          props.headerClass
        )}>
          {props.logo && <img src={props.logo} alt="" class="h-8 w-auto mr-2 object-contain" />}
          {renderTitle()}
          {props.layout !== 'side' && renderHorizontalMenu()}
          {slots['header-extra']?.()}
          {hasTrigger.value && props.collapsedTriggerPosition === 'top' && (
            <NButton
              quaternary
              size="small"
              class="ml-2"
              onClick={toggleCollapsed}
            >
              {{
                icon: () => <Icon icon="hugeicons:sidebar-left-01" class="text-white cursor-pointer" />
              }}
            </NButton>
          )}
        </header>
        <main class="flex flex-1 min-h-0 overflow-hidden">
          {(props.layout === 'side' || (props.layout === 'mix' && sideMenus.value.length > 0)) && (
            <aside
              class={cn(
                'bg-zinc-800 transition-all duration-300 ease-in-out flex flex-col gap-2 min-h-0 overflow-hidden',
                props.siderClass
              )}
              style={{ width: `${currentCollapsed.value ? collapsedWidth.value : props.siderWidth}px` }}
            >
              {renderSideMenu()}
              {hasTrigger.value && props.collapsedTriggerPosition === 'bottom' && (
                <div class="mt-auto! p-4">
                  <NButton
                    quaternary
                    onClick={toggleCollapsed}
                  >
                    {{
                      icon: () => <Icon icon="hugeicons:sidebar-right-01" class="text-white cursor-pointer" />
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
          props.footer && <footer class="p-4 h-16 flex items-center shadow-[0_-2px_4px_rgba(0,0,0,0.1)]">
            {slots.footer?.() ?? 'Footer'}
          </footer>
        }
      </div>
    );
  },
});
