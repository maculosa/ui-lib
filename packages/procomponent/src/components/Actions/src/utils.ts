export interface VisibleCountOptions {
    /** 每个操作按钮的宽度 */
    widths: number[]
    /** 「更多」触发器宽度 */
    moreWidth: number
    /** 容器可用宽度 */
    containerWidth: number
    /** 按钮间距 */
    gap: number
    /** 可见数量上限 */
    cap: number
}

/**
 * 按实际宽度计算能放下多少个操作按钮；放不下时预留「更多」触发器的位置。
 */
export function computeVisibleCount({
    widths,
    moreWidth,
    containerWidth,
    gap,
    cap,
}: VisibleCountOptions): number {
    if (containerWidth <= 0 || widths.length === 0) return 0

    const max = Math.min(cap, widths.length)
    let used = 0
    let count = 0

    for (let index = 0; index < max; index++) {
        const width = widths[index] + (index === 0 ? 0 : gap)
        const hasOverflow = index < widths.length - 1
        const reserve = hasOverflow ? gap + moreWidth : 0

        if (used + width + reserve > containerWidth) break

        used += width
        count += 1
    }

    return count
}
