import type { ProTabsSize } from './types'

export interface ProTabsSizeTokens {
    /** 页签条最小高度 */
    barMinHeight: string
    /** card 页签高度 */
    cardTab: string
    /** line 页签高度 */
    lineTab: string
    /** 页签水平内边距 */
    tabPadding: string
    /** 页签间距 */
    gap: string
    /** 文案字号 */
    text: string
    /** 图标尺寸 */
    icon: string
    /** 关闭图标尺寸 */
    close: string
    /** 数字徽标尺寸 */
    badge: string
}

// 全部为字面量类名，保证 Tailwind 能在源码中被扫描到
export const proTabsSizeTokens: Record<ProTabsSize, ProTabsSizeTokens> = {
    small: {
        barMinHeight: 'min-h-[32px]',
        cardTab: 'h-7',
        lineTab: 'self-stretch',
        tabPadding: 'px-2.5',
        gap: 'gap-0.5',
        text: 'text-[13px]',
        icon: 'text-[14px]',
        close: 'text-[12px]',
        badge: 'min-w-[16px] h-[16px] px-1 text-[10px] leading-[16px]',
    },
    medium: {
        barMinHeight: 'min-h-[40px]',
        cardTab: 'h-8',
        lineTab: 'self-stretch',
        tabPadding: 'px-3',
        gap: 'gap-1',
        text: 'text-sm',
        icon: 'text-[16px]',
        close: 'text-[14px]',
        badge: 'min-w-[18px] h-[18px] px-1 text-[11px] leading-[18px]',
    },
    large: {
        barMinHeight: 'min-h-[48px]',
        cardTab: 'h-9',
        lineTab: 'self-stretch',
        tabPadding: 'px-4',
        gap: 'gap-1.5',
        text: 'text-[15px]',
        icon: 'text-[18px]',
        close: 'text-[16px]',
        badge: 'min-w-[20px] h-[20px] px-1 text-[12px] leading-[20px]',
    },
}

/** 数字徽标溢出：超过阈值时显示 `${max}+` */
export function formatBadge(value: number, max: number | undefined): string {
    if (typeof max === 'number' && max >= 0 && value > max) return `${max}+`
    return String(value)
}

/** 生成 ARIA 可用的 DOM id 片段 */
export function sanitizeId(raw: string): string {
    return raw.replace(/[^a-zA-Z0-9_-]/g, '-')
}

/** 把 from 位置的元素移动到 to 位置，返回新数组 */
export function moveItem<T>(list: T[], from: number, to: number): T[] {
    const next = [...list]
    if (from < 0 || from >= next.length || to < 0 || to >= next.length || from === to) return next
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    return next
}

/** 比较两次 key 顺序，得出单次移动的 from / to；不是单次移动时返回 null */
export function diffMove(prev: string[], next: string[]): { from: number; to: number } | null {
    if (prev.length !== next.length) return null
    const firstDiff = prev.findIndex((key, index) => key !== next[index])
    if (firstDiff === -1) return null
    const key = prev[firstDiff]
    const to = next.indexOf(key)
    if (to === -1 || to === firstDiff) return null
    const withoutKey = next.filter(item => item !== key)
    const prevWithoutKey = prev.filter(item => item !== key)
    if (withoutKey.length !== prevWithoutKey.length) return null
    if (withoutKey.some((item, index) => item !== prevWithoutKey[index])) return null
    return { from: firstDiff, to }
}
