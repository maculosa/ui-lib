import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// 全局 mock vue3-text-clamp
vi.mock('vue3-text-clamp', () => ({
  default: {
    name: 'TextClamp',
    render() {
      return null
    }
  }
}))

// 配置全局组件
config.global.stubs = {
  'TextClamp': true,
  'NTooltip': true,
  'NText': true
}