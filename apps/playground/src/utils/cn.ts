import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并 Tailwind CSS 类名的工具函数
 * 使用 tailwind-merge 自动处理类名冲突，clsx 处理条件渲染
 * 
 * @param inputs - 类名数组或对象
 * @returns 合并后的类名字符串
 * 
 * @example
 * // 基本用法
 * cn('px-4 py-2', 'bg-blue-500')
 * // => 'px-4 py-2 bg-blue-500'
 * 
 * @example
 * // 条件渲染
 * cn('px-4', { 'bg-blue-500': isActive })
 * // => 'px-4 bg-blue-500' (当 isActive 为 true)
 * 
 * @example
 * // 处理冲突（后面的会覆盖前面的）
 * cn('p-4', 'p-2') 
 * // => 'p-2' (p-2 覆盖了 p-4)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
