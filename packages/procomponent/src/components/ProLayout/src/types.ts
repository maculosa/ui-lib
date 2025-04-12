import type { VNodeChild } from "vue"

export const proLayoutProps = {
    /** 侧边栏宽度 */
    sliderWidth: {
        type: Number,
        default: 200,
    },
    /** Header 高度 */
    headerHeight: {
        type: Number,
        default: 48,
    },
    mode: {
        type: String as PropType<'vertical' | 'horizontal' | 'vertical-mix' | 'horizontal-mix'>,
        default: 'vertical',
    },
    /** 品牌 */
    brand: {
        type: Object,
    },
    /** 是否显示Footer */
    footer: {
        type: [Boolean, String] as PropType<boolean | string>,
        default: false,
    },
    /**
     * 画风 
     * normal: 普通风格，arc: Arc 风格
     * @default normal
     */
    theme: {
        type: String as PropType<'normal' | 'arc'>,
        default: 'normal',
    }
}

export type ProLayoutProps = typeof proLayoutProps
