import type { MaybeComputedElementRef } from '@vueuse/core'
import { useElementSize, useWindowSize } from '@vueuse/core'
import { computed } from 'vue'

interface Options {
    height?: number
    minHeight?: number
}

/**
 * useTableHeight
 * 
 * @description 计算表格高度
 * @example const { height } = useTableHeight(tableRef, { height: 100, minHeight: 600 })
 * 
 * @param tableRef - 表格元素引用
 * @param options - 表格高度配置
 * @param options.height - 表格之外的高度值
 * @param options.minHeight - 表格的最小高度
 * @returns { height } - 表格高度
 */
export function useTableHeight(tableRef: any, options?: Options) {
    // 验证参数
    if (!tableRef) throw new Error('tableRef are required')

    // 获取搜索栏元素引用
    const searchRef = computed(() => tableRef.value?.searchRef)

    // 获取窗口高度和搜索栏高度
    const { height: winHeight } = useWindowSize()
    const { height: searchHeight } = useElementSize(searchRef as unknown as MaybeComputedElementRef)

    // 获取表格高度和最小高度
    const { height = 0, minHeight = 600} = options || {}

    // 计算表格高度
    const tableHeight = computed(() => {
        const h =
            winHeight.value -
            searchHeight.value -
            height
        if (h > minHeight) {
            return h
        }
        return minHeight
    })

    return {
        height: tableHeight
    }
}
