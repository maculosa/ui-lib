import { NButton, NMenu } from "naive-ui";
import { proLayoutEmits, proLayoutProps } from "./types";
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

export default defineComponent({
  name: "ProLayout",
  props: proLayoutProps,
  emits: proLayoutEmits,
  setup(props, { slots }) {

    const currentCollapsed = ref(props.collapsed);
    const toggleCollapsed = () => {
      currentCollapsed.value = !currentCollapsed.value;
    }

    return () => (
      <div class={'w-full min-h-screen' + props.class}>
        <header class="p-4 h-16 flex items-center shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
          {props.title && <div class="text-white text-lg font-bold">{props.title}</div>}
          <slot name="header-extra" />
          <NButton
            ghost
            size="small"
            onClick={() => toggleCollapsed()}
          >
            <Icon icon="hugeicon:menu-2" class="text-white cursor-pointer" />
          </NButton>
        </header>
        <main class="flex h-[calc(100vh-48px)]">
          <aside class={[
            currentCollapsed.value ? 'w-[40px] h-full bg-zinc-800' : 'w-64 h-full bg-zinc-800',
            'transition-all duration-300 ease-in-out'
          ]}>
            <NMenu
              collapsed={currentCollapsed.value}
              collapsedWidth={64}
              collapsedIconSize={22}
              options={props.menus}
            />
          </aside>
          <section class="flex-1 p-4">
            {slots.default?.()}
          </section>
        </main>
        <footer class="p-4 h-16 flex items-center shadow-[0_-2px_4px_rgba(0,0,0,0.1)]">
          Footer
        </footer>
      </div>
    );
  },
});
