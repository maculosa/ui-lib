---
"@banmao/procomponent": patch
---

- refactor(QueryFilter/LiteFilter): 抽取共享字段渲染内核

  - 新增内部模块 `components/shared/field`，统一 valueType → 控件映射、占位符、初始值、搜索列排序与远程枚举加载
  - QueryFilter 与 LiteFilter 改为复用该内核，删除两份重复的渲染与加载实现
  - 公开类型、事件、插槽、实例方法与现有行为保持不变；ProForm 与 ProTable 搜索栏本期不涉及