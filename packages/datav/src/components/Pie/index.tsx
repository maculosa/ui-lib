import VChart, { THEME_KEY } from 'vue-echarts'
// import * as echarts from 'echarts/core'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts';
import { DatasetComponent, TitleComponent, TooltipComponent, GraphicComponent, GridComponent, LegendComponent } from 'echarts/components'
import { computed, defineComponent, provide, shallowRef } from 'vue';
import type { PropType } from 'vue';
import styles from './styles/index.module.css'
import type { LegendOption, TitleOption } from 'echarts/types/dist/shared';

export interface Props {
    data: Array<any>
    type?: 'pie'
    title?: any
}

export interface Emits {
    (e: 'click'): void
    (e: 'dblclick'): void
}

use([
    PieChart,
    CanvasRenderer,
    DatasetComponent,
    GraphicComponent,
    GridComponent,
    LegendComponent,
    TitleComponent,
    TooltipComponent,
])

interface LegendOptions extends LegendOption {
    mapData?: Record<string, string>
}

export default defineComponent({
    name: 'PieChartComponent',
    components: {
        VChart
    },
    props: {
        title: {
            type: Object as PropType<TitleOption>,
            default: () => ({})
        },
        legend: {
            type: Object as PropType<LegendOptions>,
            default: () => ({})
        },
        triggerType: {
            type: String as PropType<'items'>,
            default: 'items'
        },
        data: {
            type: Array as PropType<any[]>,
            required: true
        },
        type: {
            type: String as PropType<'pie'| 'doughnut'>,
            default: 'pie'
        },
        corner: {
            type: Boolean,
            default: false
        },
        cornerColor: {
            
        }
    },
    setup(props) {
        provide(THEME_KEY, 'light')

        const chartRef = shallowRef()

        const option = computed(() => {
            return {
                title: props.title,
                tooltip: {
                    trigger: props.triggerType
                },
                legend: {
                    ...props.legend,
                    formatter: (name: string) => {
                        return props.legend.mapData && props.legend.mapData[name]
                    }
                },
                series: [
                    {
                        type: 'pie',
                        radius: props.type === 'pie' ? '50%' : ['40%', '70%'],
                        itemStyle: props.corner && {
                            borderRadius: 10,
                            borderColor: props.cornerColor || '#fff',
                            borderWidth: 2
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ],
                dataset: {
                    source: props.data
                },
            }
        })

        return () => (
            <v-chart
                ref={chartRef}
                autoresize
                class={styles.chart}
                option={option.value}
            // onClick={handleClick}
            // onDblclick={handleDbClick}
            />
        )
    }
})
