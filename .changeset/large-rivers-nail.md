---
"@banmao/procomponent": patch
---

- fix(procomponent): 修正表格列排序顺序错误

  - 将排序逻辑修改为按 order 降序排列
  - 修复了 order 未定义时的排序返回值问题
  - 确保列根据 order 属性正确排序展示

- feat(naiveProvider): 添加 NConfigProvider 支持并定义组件 Props

  - 在 NaiveProvider 组件中引入并使用 NConfigProvider 包裹子组件
  - 将组件结构调整为支持 props 传递
  - 新增 types.ts 文件定义 NaiveProviderProps，继承 naive-ui 的 configProviderProps
  - 修改 setup 函数以便正确访问 props 和 slots
  - 修复 slots 默认内容变量名拼写错误
