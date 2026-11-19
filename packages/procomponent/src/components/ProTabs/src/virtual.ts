import type { ProTabsSize, TabOption } from './types'

export interface VirtualWindow {
    /** 起始索引（含） */
    start: number
    /** 结束索引（含），空列表为 -1 */
    end: number
    /** 左侧占位宽度 */
    paddingStart: number
    /** 右侧占位宽度 */
    paddingEnd: number
}

export interface TabEstimateOptions {
    size: ProTabsSize
    defaultIcon?: string
    closable?: boolean
}

const sizeMetrics: Record<ProTabsSize, { fontSize: number; padding: number; iconGap: number }> = {
    small: { fontSize: 13, padding: 20, iconGap: 5 },
    medium: { fontSize: 14, padding: 24, iconGap: 5 },
    large: { fontSize: 15, padding: 32, iconGap: 6 },
}

const cjkPattern = /[\u2e80-\u9fff\uf900-\ufaff\uff00-\uffef]/

function textWidth(text: string, fontSize: number): number {
    let width = 0
    for (const char of text) width += cjkPattern.test(char) ? fontSize : fontSize * 0.6
    return width
}

/** 未测量页签的宽度估算，仅用于生成占位宽度 */
export function estimateTabWidth(option: TabOption, options: TabEstimateOptions): number {
    const metrics = sizeMetrics[options.size] ?? sizeMetrics.medium
    let width = metrics.padding
    let pieces = 0

    if (option.icon || options.defaultIcon) {
        width += metrics.fontSize + metrics.iconGap + 1
        pieces += 1
    }

    width += textWidth(option.label, metrics.fontSize)
    pieces += 1

    const badge = option.badge ?? (option.dot !== undefined ? option.dot : undefined)
    if (badge !== undefined && badge !== null) {
        if (badge === 'dot') width += 4 + 8
        else if (typeof badge === 'number') width += 4 + Math.max(18, String(badge).length * metrics.fontSize * 0.6 + 8)
        else width += 4 + 18
        pieces += 1
    }

    if (option.closable ?? options.closable) {
        width += 4 + metrics.fontSize
        pieces += 1
    }

    width += Math.max(0, pieces - 1) * 6
    return Math.max(44, Math.ceil(width))
}

/** 根据滚动位置计算可视窗口与两侧占位宽度；viewport 为 0 时退化为全量渲染 */
export function buildVirtualWindow(
    sizes: number[],
    gap: number,
    scrollLeft: number,
    viewport: number,
    overscan: number,
    pinned: number[] = [],
): VirtualWindow {
    const count = sizes.length
    if (!count) return { start: 0, end: -1, paddingStart: 0, paddingEnd: 0 }
    if (!(viewport > 0)) return { start: 0, end: count - 1, paddingStart: 0, paddingEnd: 0 }

    const offsets = new Array<number>(count)
    let cursor = 0
    for (let index = 0; index < count; index += 1) {
        offsets[index] = cursor
        cursor += sizes[index] + gap
    }
    const total = Math.max(0, cursor - gap)
    const from = Math.max(0, scrollLeft)
    const to = from + viewport

    let start = count - 1
    for (let index = 0; index < count; index += 1) {
        if (offsets[index] + sizes[index] > from) {
            start = index
            break
        }
    }

    let end = start
    for (let index = start; index < count; index += 1) {
        if (offsets[index] >= to) break
        end = index
    }

    const safeOverscan = Math.max(0, Math.floor(overscan))
    start = Math.max(0, start - safeOverscan)
    end = Math.min(count - 1, end + safeOverscan)

    for (const index of pinned) {
        if (index < 0 || index >= count) continue
        start = Math.min(start, index)
        end = Math.max(end, index)
    }

    const paddingStart = start === 0 ? 0 : Math.max(0, offsets[start] - gap)
    const paddingEnd = end === count - 1 ? 0 : Math.max(0, total - (offsets[end] + sizes[end]) - gap)
    return { start, end, paddingStart, paddingEnd }
}