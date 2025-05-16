import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * 创建节流函数，限制目标函数在指定时间间隔内只执行一次
 *
 * @param fn - 需要进行节流控制的原始函数
 * @param delay - 节流时间间隔（单位：毫秒）
 * @returns 经过节流处理的新函数，该函数接收与原始函数相同的参数并返回void
 */
export function throttle(fn: Function, delay: number) {
  // 定时器引用，用于控制函数执行间隔
  let timer: number | null = null

  // 返回包装后的节流函数，使用剩余参数接收任意数量参数
  return (...args: any[]) => {
    // 当没有定时器运行时，创建新的定时器
    if (!timer) {
      timer = window.setTimeout(() => {
        // 定时器触发时执行原始函数并清除定时器引用
        fn(...args)
        timer = null
      }, delay)
    }
  }
}
