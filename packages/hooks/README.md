# @banmao/hooks

这是一个基于 Vue Composition API 的自定义 Hooks 库，旨在提高开发效率并简化复杂的状态管理和逻辑处理。

## 特性

- 提供多种实用的 Vue Composition API Hooks
- 易于集成到 Vue 3 项目中
- 支持 TypeScript，具有完善的类型定义

## 安装

使用 pnpm 或 yarn 安装：

```bash
pnpm install @banmao/hooks
# 或者
yarn add @banmao/hooks

```vue
import { useCustomHook } from '@banmao/hooks';
<script setup>
defineComponent({
  setup() {
    const { value, setValue } = useCustomHook();

    return {
      value,
      setValue,
    };
  },
});
</script>

<template>
<!-- element -->
</template>
```