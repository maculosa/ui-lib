import VChart, { THEME_KEY } from 'vue-echarts'
import { graphic } from 'echarts/core'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, PictorialBarChart } from 'echarts/charts';
import { DatasetComponent, TitleComponent, TooltipComponent, GraphicComponent, GridComponent, LegendComponent } from 'echarts/components'
import { computed, defineComponent, provide, shallowRef } from 'vue';
import type { PropType } from 'vue';
import styles from './styles/index.module.css'
import type { LegendOption, TitleOption } from 'echarts/types/dist/shared';

export interface Props {
    data: Array<any>
    barWidth?: number
    title?: any
}

export interface Emits {
    (e: 'click'): void
    (e: 'dblclick'): void
}

use([
    BarChart,
    PictorialBarChart,
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
    name: 'CircleBarChartComponent',
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
            type: String as PropType<'axis' | 'item'>,
            default: 'item'
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
        data: {
            type: Array as PropType<any[]>,
            required: true
        },
        attr: {
            type: Object as PropType<Record<string, any>>,
            default: () => ({
                name: '数值',
                unit: '个'
            })
        }
    },
    setup(props) {
        provide(THEME_KEY, 'light')

        const chartRef = shallowRef()

        // const maxValue = computed(() => {
        //     return Math.max(...props.data.map((item: any) => item['value'])) || 0
        // })
        const yData = computed(() => {
            return props.data.map((item: any) => item['value'])
        })
        const xData = computed(() => {
            return props.data.map((item: any) => item['name'])
        })

        const option = computed(() => {
            return {
                title: props.title,
                tooltip: {
                    trigger: props.triggerType,
                    padding: 1,
                    formatter: (param: any) => {
                        const resultTooltip =
                            "<div style='background:#ffffff;color: #333;border:1px solid rgba(255,255,255,.2);padding:5px;border-radius:3px;'>" +
                            "<div style='text-align:center;'>" + param.name + "</div>" +
                            "<div style='padding-top:5px;'>" +
                            "<span style=''> " + props.attr.name + ": </span>" +
                            "<span style=''>" + param.value + "</span><span>" + props.attr.unit + "</span>" +
                            "</div>" +
                            "</div>";
                        return resultTooltip
                    }
                },
                legend: {
                    ...props.legend,
                    formatter: (name: string) => {
                        return props.legend.mapData && props.legend.mapData[name]
                    }
                },
                xAxis: {
                    ...props.xAxis,
                    data: xData.value,
                    axisTick: {
                        show: false, // 不显示刻度
                        alignWithLabel: true,
                    },
                    nameTextStyle: {
                        color: '#82b0ec',
                    },
                    axisLine: {
                        show: false, // 不显示 x 轴线
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#333',
                        },
                        margin: 30, // 刻度标签与轴线之间的距离
                    },
                    boundaryGap: true,
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    ...props.yAxis,
                    show: false,
                    axisLabel: {
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#0c2c5a'
                        }
                    },
                    axisLine: {
                        show: false
                    }
                },
                series: [
                    {
                        name: '',
                        type: 'pictorialBar',
                        symbolSize: [40, 10],
                        symbolOffset: [0, -6], // 上部椭圆
                        symbolPosition: 'end',
                        z: 12,
                        label: {
                            show: true,
                            position: 'top',
                            fontSize: 15,
                            fontWeight: 'bold',
                            color: '#34DCFF'
                        },
                        color: '#2DB1EF',
                        data: yData.value
                    },
                    {
                        name: '',
                        type: 'pictorialBar',
                        symbolSize: [40, 10],
                        symbolOffset: [0, 6], // 下部椭圆
                        z: 12,
                        color: '#2DB1EF',
                        data: yData.value
                    },
                    {
                        name: '',
                        type: 'pictorialBar',
                        symbolSize: (d: number) => {
                            return d > 0 ? [50, 15] : [0, 0]
                        },
                        symbolOffset: [0, 12], // 下部内环
                        z: 12,
                        itemStyle: {
                            color: 'transparent',
                            borderColor: '#2ea9e5',
                            borderType: 'solid',
                            borderWidth: 4
                        },
                        data: yData.value
                    },
                    {
                        name: '',
                        type: 'pictorialBar',
                        symbolSize: [70, 20],
                        symbolOffset: [0, 18], // 下部外环
                        z: 10,
                        itemStyle: {
                            color: 'transparent',
                            borderColor: '#60a5fa',
                            borderType: 'solid',
                            borderWidth: 8,
                        },
                        data: yData.value
                    },
                    {
                        type: 'bar',
                        //silent: true,
                        barWidth: '40',
                        barGap: '10%', // Make series be overlap
                        barCateGoryGap: '10%',
                        itemStyle: {
                            color: new graphic.LinearGradient(0, 0, 0, 0.7, [
                                {
                                    offset: 0,
                                    color: '#38B2E6',
                                },
                                {
                                    offset: 1,
                                    color: '#22d3ee',
                                },
                            ]),
                            opacity: 0.8,
                        },
                        data: yData.value
                    },
                ],
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
