import { proLayoutProps } from "./types"
import { NLayout, NLayoutContent, NLayoutFooter, NLayoutHeader, NLayoutSider } from "naive-ui"

export default defineComponent({
    name: 'ProLayout',
    props: proLayoutProps,
    setup(props, { slots }) {

        const { mode, headerHeight, sliderWidth, brand, theme } = props

        const layoutContentStyle = computed(() => {

            if (theme === 'arc') {
                return {
                    padding: '8px',
                    background: '#e7e5e4'
                }
            }
        })

        const siderStyle = computed(() => {
            if (theme === 'arc') {
                return {
                    background: 'transparent',
                    marginRight: '8px'
                }
            }
        })

        const contentStyle = computed(() => {
            if (theme === 'arc') {
                return {
                    background: '#fff',
                    borderRadius: '4px',
                    overflow: 'hidden'
                }
            }
        })

        return () => {
            console.log(brand)
            return (
                <NLayout has-sider={mode === 'horizontal' || mode === 'horizontal-mix'}
                    contentStyle={layoutContentStyle.value}
                >
                    {
                        (mode === 'horizontal-mix' || mode === 'horizontal') && (
                            <NLayoutSider width={sliderWidth} style={siderStyle.value}>
                                { brand && <brand /> }
                                {slots.sider?.()}
                            </NLayoutSider>
                        )
                    }
                    {
                        (mode === 'vertical' || mode === 'vertical-mix') && (
                            <NLayoutHeader style={{ display: 'flex', alignItems: 'center',  height: `${headerHeight}px` }}>
                                { brand && <brand /> }
                                <div>
                                    {slots.header?.()}
                                </div>
                            </NLayoutHeader>
                        )
                    }

                    <NLayout has-sider={mode === 'vertical-mix'}
                        style={ theme === 'arc' ? { background: 'transparent' } : {}}
                    >
                        {
                            (mode === 'horizontal-mix') && (<NLayoutHeader style={{ height: `${headerHeight}px` }}>
                                {slots.header?.()}
                            </NLayoutHeader>
                            )
                        }
                        {
                            (mode === 'vertical-mix') && (
                                <NLayoutSider width={sliderWidth}>
                                    {slots.sider?.()}
                                </NLayoutSider>
                            )
                        }

                        <NLayoutContent style={contentStyle.value}>
                            {slots.default?.()}
                        </NLayoutContent>

                        {
                            (slots.footer) && (
                                <NLayoutFooter>
                                    {slots.footer?.()}
                                </NLayoutFooter>
                            )
                        }
                    </NLayout>
                </NLayout>
            )
        }
    }
})
