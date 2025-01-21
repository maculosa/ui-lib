import type { ExtractPropTypes } from 'vue'

/**
 * Tour 步骤组件属性定义
 * @description 定义 Tour 步骤组件的可配置属性
 * @example
 * {
 *   title: '欢迎使用',
 *   description: '这是一个引导步骤'
 * }
 */
export const tourStepProps = {
    /**
     * 步骤标题
     * @description 显示在步骤引导框顶部的标题文本
     * @default ''
     */
    title: {
        type: String,
        default: ''
    },
    /**
     * 步骤描述
     * @description 显示在步骤引导框中的详细描述文本
     * @default ''
     */
    description: {
        type: String,
        default: ''
    }
} as const

/**
 * Tour 步骤组件属性类型
 * @description 从 tourStepProps 中提取的 Vue 属性类型
 */
export type TourStepProps = ExtractPropTypes<typeof tourStepProps>