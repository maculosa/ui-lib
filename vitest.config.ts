import { defineConfig } from 'vitest/config'

// Vitest 5 移除了 vitest.workspace.ts，改用根配置的 test.projects
export default defineConfig({
  test: {
    projects: [
      './apps/playground/vite.config.ts',
      './packages/datav/vitest.config.ts',
      './packages/draw/vitest.config.ts',
      './packages/hooks/vitest.config.ts',
      './packages/procomponent/vite.config.ts',
    ],
  },
})
