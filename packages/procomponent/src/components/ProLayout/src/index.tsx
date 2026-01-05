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
      <div class={'w-full  flex flex-col ' + props.class} style={props.style}>
        <header class="p-4 h-16 flex items-center bg-zinc-800 shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
          {props.title && <div class="text-white text-lg font-bold">{props.title}</div>}
          <slot name="header-extra" />
          <NButton
            quaternary
            size="small"
            class="ml-2"
            onClick={() => toggleCollapsed()}
          >
            {{
              icon: <Icon icon="hugeicons:sidebar-left-01" class="text-white cursor-pointer" />
            }}
          </NButton>
        </header>
        <main class="flex flex-1 min-h-0 overflow-hidden">
          <aside class={[
            currentCollapsed.value ? 'w-[64px] bg-zinc-800' : 'w-64 bg-zinc-800',
            'transition-all duration-300 ease-in-out flex flex-col gap-2 min-h-0 overflow-hidden'
          ]}>
            <div class={[
              'flex-1 overflow-auto min-h-0'
            ]}>

            <NMenu
              collapsed={currentCollapsed.value}
              collapsedWidth={64}
              collapsedIconSize={22}
              options={props.menus}
            />
            </div>

            <div class="mt-auto! p-4">
              <NButton
                quaternary
                onClick={() => toggleCollapsed()}
              >
                {{
                  icon: <Icon icon="hugeicons:sidebar-right-01" class="text-white cursor-pointer" />
                }}
              </NButton>
            </div>
          </aside>
          <section class="flex-1 p-4">
            {slots.default?.()}
          </section>
        </main>
        {
          props.footer && <footer class="p-4 h-16 flex items-center shadow-[0_-2px_4px_rgba(0,0,0,0.1)]">
            Footer
          </footer>
        }
      </div>
    );
  },
});
