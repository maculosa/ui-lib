import VChart, { THEME_KEY } from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, ScatterChart } from 'echarts/charts';
import { DatasetComponent, TitleComponent, TooltipComponent, GraphicComponent, GridComponent, LegendComponent } from 'echarts/components'
import { computed, defineComponent, provide, shallowRef } from 'vue';
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
    mapData: Record<string, string>
}


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
        seriesType: {
            type: [String, Array] as PropType<'bar' | 'line' | 'scatter' | ('bar' | 'line' | 'scatter')[]>,
            default: 'bar'
        },
        option: {
            type: Object as PropType<Record<string, any>>,
            default: () => ({})
        }
    },
    setup(props) {
        provide(THEME_KEY, 'light')

        const chartRef = shallowRef()

        // const series = computed(() => {
        //     if (Array.isArray(props.seriesType)) {
        //         const seriesArr: any[] = []
        //         for (const type of props.seriesType) {
        //             if (type === 'bar') {
        //                 seriesArr.push({
        //                     type: type,
        //                     barWidth: props.barWidth
        //                 })
        //             } else {
        //                 seriesArr.push({
        //                     type: type,
        //                 })
        //             }
        //         }
        //         console.log({ seriesArr });

        //         return seriesArr
        //     } else {
        //         return [{
        //             type: props.seriesType
        //         }]
        //     }
        // })

        const option = computed(() => {



            return {
                title: props.title,
                tooltip: {
                    trigger: props.triggerType
                },
                legend: {
                    ...props.legend,
                    formatter: (name: string) => {
                        return props.legend.mapData[name]
                    }
                },
                // series: series.value,
                // series: [
                //     {
                //         type: props.seriesType[0],
                //         barWidth: props.barWidth
                //     },
                //     {
                //         type: props.seriesType[1],
                //         barWidth: props.barWidth
                //     }
                // ],
                ...props.option
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
