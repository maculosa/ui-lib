import VChart, { THEME_KEY } from 'vue-echarts'
import * as echarts from 'echarts/core'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, RadarChart, ScatterChart } from 'echarts/charts';
import { DatasetComponent, TitleComponent, TooltipComponent, GraphicComponent, GridComponent, LegendComponent } from 'echarts/components'
import { computed, defineComponent, provide, shallowRef, toRef } from 'vue';
import type { PropType } from 'vue';
import styles from './styles/index.module.css'
import type { LegendOption, TitleOption } from 'echarts/types/dist/shared';

export interface Props {
    data: Array<any>
    barWidth?: number
    type?: 'bar' | 'line' | 'scatter'
    title?: any
}

export interface Emits {
    (e: 'click'): void
    (e: 'dblclick'): void
}

use([
    BarChart,
    LineChart,
    RadarChart,
    ScatterChart,
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

interface SeriesType {
    type: 'bar' | 'line' | 'scatter'
    color?: string | string[]
}

// function isPure2DArray(arr: Array<any>) {
//     if (!Array.isArray(arr)) {
//         return false
//     }
//     return arr.every(item => Array.isArray(item))
// }

export default defineComponent({
    name: 'ChartComponent',
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
            type: String as PropType<'axis' | 'items'>,
            default: 'axis'
        },
        barWidth: {
            type: Number,
            default: 10
        },
        xAxis: {
            type: Object as PropType<Record<string, any>>,
            default: () => ({})
        },
        yAxis: {
            type: Object as PropType<Record<string, any>>,
            default: () => ({})
        },
        seriesType: {
            type: Array as PropType<SeriesType[]>,
            default: () => ({
                type: 'bar',
            })
        },
        data: {
            type: Array as PropType<any[]>,
            required: true
        },
    },
    setup(props) {
        provide(THEME_KEY, 'light')

        const chartRef = shallowRef()

        const series = computed(() => {
            if (Array.isArray(props.seriesType)) {
                const seriesArr: any[] = []
                for (const item of props.seriesType) {
                    const colors = toRef(item, 'color')
                    const linearColor = Array.isArray(colors.value) ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: colors.value[0] },
                        { offset: 1, color: colors.value[1] }
                    ]) : colors.value
                    
                    if (item.type === 'bar') {
                        seriesArr.push({
                            type: item.type,
                            barWidth: props.barWidth,
                            color: linearColor,
                            universalTransition: {
                                enabled: true,
                                seriesKey: ['female', 'male'],
                                delay: function(idx: number, _count: number) {
                                    return idx * 100 + Math.random() * 1000;
                                }
                            },
                        })
                    } else {
                        seriesArr.push({
                            type: item.type,
                            color: linearColor,
                            universalTransition: {
                                enabled: true,
                                seriesKey: ['female', 'male'],
                                delay: function(idx: number, _count: number) {
                                    return idx * 100 + Math.random() * 1000;
                                }
                            },
                        })
                    }
                }

                return seriesArr
            } else {
                return [{
                    type: props.seriesType
                }]
            }
        })

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
                xAxis: {
                    ...props.xAxis
                },
                yAxis: {
                    ...props.yAxis
                },
                series: series.value,
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
