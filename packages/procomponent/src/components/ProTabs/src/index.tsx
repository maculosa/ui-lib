import { proTabsEmits, proTabsProps } from "./types"

export default defineComponent({
    name: 'ProTabs',
    props: proTabsProps,
    emits: proTabsEmits,
    setup(props, { slots }) {
        const { inset, rounded } = props
        const tabsContainerClass = computed(() => [
  'flex items-center relative overflow-hidden min-h-[40px] bg-accent',
  [inset ? 'px-[4px]' : 'px-0'],
  [rounded ? 'rounded-full' : 'rounded-[2px]'],
        ]
)
        return () => (
            <div class="relative flex w-full">
                <div ref="tabsContainerRef" class={tabsContainerClass.value}>

                </div>
            </div>
        )
    }
})