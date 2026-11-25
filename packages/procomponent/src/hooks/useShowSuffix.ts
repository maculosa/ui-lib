import { nextTick, onMounted, ref, toValue, watch } from 'vue'
import type { MaybeRefOrGetter } from 'vue'

/**
 * 判断栅格内容是否超过当前列数,用于决定是否展示折叠按钮
 * @param domRef 栅格组件实例(NGrid),通过其 contentEl 统计实际渲染项数
 * @param num 当前展示列数,支持数字或 getter;列数变化时重新判断
 * @returns showSuffix:是否需要展示折叠 / 展开按钮
 */
export function useShowSuffix(domRef: any, num: MaybeRefOrGetter<number>) {
  const showSuffix = ref<boolean>(true)

  /** 依据当前列数重新判断是否存在被折叠的内容 */
  const refresh = () => {
    const contentEl = domRef.value?.contentEl
    if (!contentEl)
      return
    const len = contentEl.children.length || 0
    showSuffix.value = len > toValue(num)
  }

  onMounted(() => nextTick(refresh))
  // 列数随屏幕宽度自适应变化时,折叠按钮的可用性需同步刷新
  watch(() => toValue(num), () => nextTick(refresh))

  return {
    showSuffix,
  }
}
