import VChart, { THEME_KEY } from 'vue-echarts'
// import * as echarts from 'echarts/core'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts';
import { DatasetComponent, TitleComponent, TooltipComponent, GraphicComponent, GridComponent, LegendComponent } from 'echarts/components'
import { SurfaceChart } from 'echarts-gl/charts'
import { Grid3DComponent } from 'echarts-gl/components'
import { computed, defineComponent, provide, shallowRef } from 'vue';
import type { PropType } from 'vue';
import styles from './styles/index.module.css'
import type { LegendOption, TitleOption } from 'echarts/types/dist/shared';

import { getPie3D } from './helpers'

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
    SurfaceChart,
    Grid3DComponent,
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
                ...getPie3D(props.data, 0.59),
                title: props.title,
                // tooltip: {
                //     trigger: props.triggerType
                // },
                legend: {
                    ...props.legend,
                    // ...{
                    //     formatter: (name: string) => {
                    //         return props.legend.mapData && props.legend.mapData[name]
                    //     }
                    // }
                },
                // series: [
                //     {
                //         name: props.title.text,
                //         type: 'surface',
                //         parametric: true,
                //         parametricEquation: getParametricEquation()
                //     }
                // ],
                // dataset: {
                //     source: props.data
                // },
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
