import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  "./apps/playground/vite.config.ts",
  "./packages/datav/vitest.config.ts",
  "./packages/draw/vitest.config.ts",
  "./packages/hooks/vitest.config.ts",
  "./packages/procomponent/vite.config.ts"
])
