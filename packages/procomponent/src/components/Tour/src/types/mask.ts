import type { PropType, ExtractPropTypes } from 'vue'

/**
 * Tour 组件遮罩层位置信息接口
 * @interface TourMaskPosition
 * @description 定义遮罩层的位置和尺寸信息
 * @example
 * {
 *   top: 100,
 *   left: 200,
 *   width: 300,
 *   height: 400
 * }
 */
export interface TourMaskPosition {
    /** 遮罩层距离顶部的位置（单位：像素） */
    top: number
    /** 遮罩层距离左侧的位置（单位：像素） */
    left: number
    /** 遮罩层的宽度（单位：像素） */
    width: number
    /** 遮罩层的高度（单位：像素） */
    height: number
}

/**
 * Tour 组件遮罩层属性定义
 * @description 定义遮罩层组件的可配置属性
 */
export const tourMaskProps = {
    /**
     * 遮罩层位置信息
     */
    pos: {
        type: Object as PropType<TourMaskPosition | null>,
        default: () => ({
            top: 0,
            left: 0,
            width: 0,
            height: 0
        })
    },
    /**
     * 是否显示遮罩层
     * @default true
     */
    show: {
        type: Boolean,
        default: true
    }
}

/**
 * Tour 组件遮罩层属性类型
 * @description 从 tourMaskProps 中提取的 Vue 属性类型
 */
export type TourMaskProps = ExtractPropTypes<typeof tourMaskProps>
