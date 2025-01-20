import VChart, { THEME_KEY } from 'vue-echarts'
import { graphic } from 'echarts/core'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { CustomChart } from 'echarts/charts';
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

// const paperDataURI =
// 'data:image/png;base64,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';


use([
    CustomChart,
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

// interface SeriesType {
//     type: ''
//     color?: string | string[]
// }

const CubeLeft = graphic.extendShape({
    shape: {
        x: 0,
        y: 0
    },
    buildPath: function (ctx, shape) {
        const xAxisPoint = shape.xAxisPoint
        const c0 = [shape.x, shape.y]
        const c1 = [shape.x - 9, shape.y - 9]
        const c2 = [xAxisPoint[0] - 9, xAxisPoint[1] - 9]
        const c3 = [xAxisPoint[0], xAxisPoint[1]]
        ctx.moveTo(c0[0], c0[1])?.lineTo(c1[0], c1[1]).lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).closePath()
    }
})
const CubeRight = graphic.extendShape({
    shape: {
        x: 0,
        y: 0
    },
    buildPath: function (ctx, shape) {
        const xAxisPoint = shape.xAxisPoint
        const c1 = [shape.x, shape.y]
        const c2 = [xAxisPoint[0], xAxisPoint[1]]
        const c3 = [xAxisPoint[0] + 18, xAxisPoint[1] - 9]
        const c4 = [shape.x + 18, shape.y - 9]
        ctx.moveTo(c1[0], c1[1])?.lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath()
    }
})
const CubeTop = graphic.extendShape({
    shape: {
        x: 0,
        y: 0
    },
    buildPath: function (ctx, shape) {
        const c1 = [shape.x, shape.y]
        const c2 = [shape.x + 18, shape.y - 9]
        const c3 = [shape.x + 9, shape.y - 18]
        const c4 = [shape.x - 9, shape.y - 9]
        ctx.moveTo(c1[0], c1[1])?.lineTo(c2[0], c2[1]).lineTo(c3[0], c3[1]).lineTo(c4[0], c4[1]).closePath()
    }
})
graphic.registerShape('CubeLeft', CubeLeft)
graphic.registerShape('CubeRight', CubeRight)
graphic.registerShape('CubeTop', CubeTop)

export default defineComponent({
    name: 'CubeBarChartComponent',
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
        // seriesType: {
        //     type: Array as PropType<SeriesType[]>,
        //     default: () => ({
        //         type: 'pictorialBar',
        //     })
        // },
        data: {
            type: Array as PropType<any[]>,
            required: true
        },
    },
    setup(props) {
        provide(THEME_KEY, 'light')

        const chartRef = shallowRef()

        // const maxValue = computed(() => {
        //     return Math.max(...props.data.map((item: any) => item['value'])) || 0
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
                        return props.legend.mapData && props.legend.mapData[name]
                    }
                },
                xAxis: {
                    ...props.xAxis,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#333'
                        }
                    },
                    offset: 20,
                    axisTick: {
                        show: false,
                        length: 9,
                        alignWithLabel: true,
                        lineStyle: {
                            color: '#7DFFFD'
                        }
                    },
                    axisLabel: {
                        fontSize: 10,
                        color: '#333'
                    }
                },
                yAxis: {
                    ...props.yAxis,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: 'white'
                        }
                    },
                    splitLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        fontSize: 16
                    },
                    boundaryGap: ['20%', '20%']
                },
                series: [
                    // {
                    //     type: 'custom',
                    //     renderItem: function(params, api) {
                    //         const location = api.coord([api.value(0), api.value(1)])
                    //         return {
                    //             type: 'group',
                    //             children: [{
                    //                 type: 'CubeLeft',
                    //                 shape: {
                    //                     api,
                    //                     xValue: api.value(0),
                    //                     yValue: api.value(1),
                    //                     x: location[0],
                    //                     y: location[1],
                    //                     xAxisPoint: api.coord([api.value(0), 0])
                    //                 },
                    //                 style: {
                    //                     fill: 'rgba(7,29,97,.6)'
                    //                 }
                    //             }, {
                    //                 type: 'CubeRight',
                    //                 shape: {
                    //                     api,
                    //                     xValue: api.value(0),
                    //                     yValue: api.value(1),
                    //                     x: location[0],
                    //                     y: location[1],
                    //                     xAxisPoint: api.coord([api.value(0), 0])
                    //                 },
                    //                 style: {
                    //                     fill: 'rgba(10,35,108,.7)'
                    //                 }
                    //             }, {
                    //                 type: 'CubeTop',
                    //                 shape: {
                    //                     api,
                    //                     xValue: api.value(0),
                    //                     yValue: api.value(1),
                    //                     x: location[0],
                    //                     y: location[1],
                    //                     xAxisPoint: api.coord([api.value(0), 0])
                    //                 },
                    //                 style: {
                    //                     fill: 'rgba(11,42,106,.8)'
                    //                 }
                    //             }]
                    //         }
                    //     },
                    //     animationDelay(dataIndex: number) {
                    //         return dataIndex * 30;
                    //     },
                    // },
                    {
                        type: 'custom',
                        renderItem: (_params: any, api: any) => {
                            const location = api.coord([api.value(0), api.value(1)])
                            return {
                                type: 'group',
                                children: [{
                                    type: 'CubeLeft',
                                    shape: {
                                        api,
                                        xValue: api.value(0),
                                        yValue: api.value(1),
                                        x: location[0],
                                        y: location[1],
                                        xAxisPoint: api.coord([api.value(0), 0])
                                    },
                                    style: {
                                        fill: new graphic.LinearGradient(0, 0, 0, 1, [{
                                            offset: 0,
                                            color: '#3B80E2'
                                        },
                                        {
                                            offset: 1,
                                            color: '#49BEE5'
                                        }
                                        ])
                                    }
                                }, {
                                    type: 'CubeRight',
                                    shape: {
                                        api,
                                        xValue: api.value(0),
                                        yValue: api.value(1),
                                        x: location[0],
                                        y: location[1],
                                        xAxisPoint: api.coord([api.value(0), 0])
                                    },
                                    style: {
                                        fill: new graphic.LinearGradient(0, 0, 0, 1, [{
                                            offset: 0,
                                            color: '#3B80E2'
                                        },
                                        {
                                            offset: 1,
                                            color: '#49BEE5'
                                        }
                                        ])
                                    }
                                }, {
                                    type: 'CubeTop',
                                    shape: {
                                        api,
                                        xValue: api.value(0),
                                        yValue: api.value(1),
                                        x: location[0],
                                        y: location[1],
                                        xAxisPoint: api.coord([api.value(0), 0])
                                    },
                                    style: {
                                        fill: new graphic.LinearGradient(0, 0, 0, 1, [{
                                            offset: 0,
                                            color: '#3B80E2'
                                        },
                                        {
                                            offset: 1,
                                            color: '#49BEE5'
                                        }
                                        ])
                                    }
                                }]
                            }
                        },
                    },
                    {
                        type: 'bar',
                        label: {
                            show: true,
                            position: 'top',
                            fontSize: 16,
                            color: '#333',
                            offset: [4, -25]
                        },
                        itemStyle: {
                            color: 'transparent'
                        },
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
