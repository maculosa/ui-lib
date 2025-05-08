import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  "./packages/datav/vitest.config.ts",
  "./packages/hooks/vitest.config.ts",
  "./packages/draw/vitest.config.ts",
  "./packages/blocks/vite.config.ts",
  "./playground/vite.config.ts",
  "./packages/procomponent/vite.config.ts"
])
