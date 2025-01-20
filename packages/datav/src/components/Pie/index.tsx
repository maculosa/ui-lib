import VChart, { THEME_KEY } from 'vue-echarts'
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
            type: String as PropType<'item'>,
            default: 'item'
        },
        data: {
            type: Array as PropType<any[]>,
            required: true
        },
        type: {
            type: String as PropType<'pie'| 'doughnut' | 'rose'>,
            default: 'pie'
        },
        /**
         * 仅当 type 为 doughnut 时有效
         */
        minRadius: {
            type: String,
            default: ''
        },
        /**
         * 仅当 type 为 doughnut 时有效
         */
        maxRadius: {
            type: String,
            default: ''
        },
        padAngle: {
            type: Number,
            default: 1
        },
        corner: {
            type: Boolean,
            default: false
        },
        cornerColor: {
            type: String,
            default: '#fff'
        },
        half: {
            type: Boolean,
            default: false
        },
        label: {
            type: Boolean,
            default: false
        },
        labelPosition: {
            type: String as PropType<'inside' | 'outside' | 'center'>,
            default: 'outside'
        },
        rose: {
            type: Boolean,
            default: false
        },
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
                    // ...{
                    //     formatter: (name: string) => {
                    //         return props.legend.mapData && props.legend.mapData[name]
                    //     }
                    // }
                },
                series: [
                    {
                        name: props.title.text,
                        type: 'pie',
                        radius: props.type === 'pie' ? '50%' : [ props.minRadius || '40%', props.maxRadius || '70%'],
                        center: ['50%', props.half !== false ? '75%' : '50%'],
                        startAngle: props.half !== false ? 180 : 90,
                        endAngle: props.half !== false ? 360 : null,
                        roseType: props.rose !== false ? 'radius' : null,
                        // padAngle: props.type === 'doughnut' && props.padAngle,
                        itemStyle: props.corner && {
                            borderRadius: 8,
                            borderColor: props.cornerColor,
                            borderWidth: props.type === 'doughnut' && props.padAngle
                        },
                        label: {
                            show: props.label,
                            position: props.labelPosition
                        },
                        emphasis: {
                            label: props.labelPosition === 'center' && {
                                show: true,
                                fontSize: 40,
                                fontWeight: 'bold'
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
