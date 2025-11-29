import { ref } from 'vue'
import type { OptionsType } from './types'

/**
 * 异步请求数据的 Hook
 * @param requestFn - 请求函数
 * @param options - 配置
 * @param options.immediate - 是否立即执行，默认为 true
 * @returns 
 */
export function useAsyncData<T>(requestFn: () => Promise<T>, options?: OptionsType): any {
    const { immediate = true } = options || {}
    const data = ref<T | null>(null)
    const loading = ref<boolean>(false)
    const error = ref<any>(null)
    
    const fetchData = async () => {
        loading.value = true
        error.value = null
        try {
            const response = await requestFn()
            data.value = response
        } catch (err) {
            error.value = err
        } finally {
            loading.value = false
        }
    }

    if (immediate) {
        fetchData()
    }

    return {
        data,
        loading,
        error,
        fetchData,
    }
}
