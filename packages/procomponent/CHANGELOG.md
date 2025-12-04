# @banmao/procomponent

## 0.7.23

### Patch Changes

- fix(ProForm): 修复表单重置时未使用默认值的问题

  强制创建新表单结构时使用深拷贝避免引用共享问题，并在重置表单时正确处理默认值

## 0.7.22

### Patch Changes

- feat(docs/ProForm): 添加筛选重置示例并修复 grid-cols 绑定问题

  添加新的筛选重置示例组件 FilterReset.vue，并在文档中展示
  修复 RequestCascaderForm.vue 中 grid-cols 属性未绑定的问题

## 0.7.21

### Patch Changes

- perf(ProForm): 优化表单性能，减少不必要的渲染和请求

  - 使用 shallowRef 替代 reactive 减少响应式开销
  - 添加 columns 哈希缓存避免重复创建 formData
  - 记录已请求的 key 避免重复请求远程选项
  - 重构 renderFormItem 提高代码可读性

## 0.7.20

### Patch Changes

- feat(procomponent): 为 ProTable 搜索配置添加折叠功能

  在 SearchConfig 接口中新增 gridCollapsed 属性，用于控制搜索栏的折叠状态。
  该属性允许用户自定义搜索栏是否默认折叠，提升表格组件的灵活性和用户体验。

## 0.7.19

### Patch Changes

- style(ProTable/Toolbar): 调整工具栏按钮垂直居中

## 0.7.18

### Patch Changes

- fix(NaiveProvider): 添加 NDialogProvider 以优化组件嵌套结构

## 0.7.17

### Patch Changes

- feat(ProTable): 添加搜索栏列排序功能

## 0.7.16

### Patch Changes

- update to v0.7.16 release version
- a72f62f: - fix(procomponent): 修正表格列排序顺序错误

  - 将排序逻辑修改为按 order 降序排列
  - 修复了 order 未定义时的排序返回值问题
  - 确保列根据 order 属性正确排序展示

  - feat(naiveProvider): 添加 NConfigProvider 支持并定义组件 Props

    - 在 NaiveProvider 组件中引入并使用 NConfigProvider 包裹子组件
    - 将组件结构调整为支持 props 传递
    - 新增 types.ts 文件定义 NaiveProviderProps，继承 naive-ui 的 configProviderProps
    - 修改 setup 函数以便正确访问 props 和 slots
    - 修复 slots 默认内容变量名拼写错误

- 9bb022f: fix(table): 隐藏表格中姓名列以改善显示效果

## 0.7.16-alpha.1

### Patch Changes

- - fix(procomponent): 修正表格列排序顺序错误

    - 将排序逻辑修改为按 order 降序排列
    - 修复了 order 未定义时的排序返回值问题
    - 确保列根据 order 属性正确排序展示

  - feat(naiveProvider): 添加 NConfigProvider 支持并定义组件 Props

    - 在 NaiveProvider 组件中引入并使用 NConfigProvider 包裹子组件
    - 将组件结构调整为支持 props 传递
    - 新增 types.ts 文件定义 NaiveProviderProps，继承 naive-ui 的 configProviderProps
    - 修改 setup 函数以便正确访问 props 和 slots
    - 修复 slots 默认内容变量名拼写错误

## 0.7.16-alpha.0

### Patch Changes

- fix(table): 隐藏表格中姓名列以改善显示效果

## 0.7.15

### Patch Changes

- - fix(procomponents): 修复 NFormItemGi label 自定义显示
  - feat(procomponent): 【新增】ProForm 组件添加 reponsive 属性

## 0.7.14

### Patch Changes

- - feat(ProTable): 优化表格
  - fix: 修复在 tooltip 定义时，align 失效的问题
  - fix(Protable): 修复 ProTable 工具栏的新建按钮不显示的问题

## 0.7.13

### Patch Changes

- fixed to the some bugs with ProTable.

## 0.7.12

### Patch Changes

- 修复已知问题

# @banmao/procomponent

## 0.7.11

### Patch Changes

- optimize: 优化代码尺寸

## 0.7.10

### Patch Changes

- 修复列渲染失效的问题

## 0.7.9

### Patch Changes

- [ProTable] 新增 height 属性

## 0.7.8

### Patch Changes

- fix(ProTable): 修复表格 column.hideInForm 不生效的问题

## 0.7.7

### Patch Changes

- 1. feat: ProForm 添加搜索加载中动画
  2. feat(ProForm): 新增 searchText, submitText, resetText 属性

## 0.7.6

### Patch Changes

- 1. refactor: 添加废弃 prop 和 slot 的提示
  2. feat: 使用 search 属性替换 hideSearchbar 和 search-config
  3. fix: 修复 重置按钮无法重置为原始数据的问题
  4. fix: 修复 ProForm 初始值的问题
  5. fix: 修复 search 属性默认为 undefined, 新增 onQuery 属性方法, 搜索事件传递查询表单数据

## 0.7.5

### Patch Changes

- 修复 slots 警告

## 0.7.4

### Patch Changes

- 修复已知问题

## 0.7.3

### Patch Changes

- 1. [ProTable]: 优化默认不显示导出和添加按钮的功能

## 0.7.2

### Patch Changes

- fix: 修复 ProForm submit click preventdefault, compliant clipboardText

## 0.7.1

### Patch Changes

- update 0.7.1

## 0.7.0

### Minor Changes

- aa665d4: 重构 ProForm

### Patch Changes

- 修复已知问题
- ae82f76: 优化数字表单项默认显示 0 改为无默认值

## 0.7.0-beta.1

### Patch Changes

- 优化数字表单项默认显示 0 改为无默认值

## 0.7.0-beta.0

### Minor Changes

- 重构 ProForm

## 0.6.6

### Patch Changes

- queryfilter 组件

## 0.6.5

### Patch Changes

- 修复 QueryFilter 组件已知问题

## 0.6.4

### Patch Changes

- Protable 新增 statistics-card 插槽

## 0.6.3

### Patch Changes

- 修改 columnData 默认不显示表格列时,在列设置中也不显示

## 0.6.2

### Patch Changes

- 修复 Protable Column.type = index 搜索栏渲染问题

## 0.6.1

### Patch Changes

- - Protable:

    1. 内置导出和添加按钮
    2. 添加按钮支持 createButtonMode: button, modal, drawer 三种模式

## 0.6.0

### Minor Changes

- 新增 LinkDiagram 组件

## 0.5.0

### Minor Changes

- 添加 ProDescriptions, ProList

## 0.4.3

### Patch Changes

- feat: 新增 column.type = 'index' 来渲染序号

## 0.4.2

### Patch Changes

- fix: 修复 ModalForm,DrawerForm 组件无关闭的函数

## 0.4.1

### Patch Changes

- Watermark: 修复颜色不可控;新增旋转角度

## 0.4.0

### Minor Changes

- 新增水印功能

## 0.3.18

### Patch Changes

- fix(protable): 优化无值的单元格渲染"

## 0.3.17

### Patch Changes

- ProTable: 添加自定义渲染空单元格

## 0.3.16

### Patch Changes

- 新增表格列设置功能

## 0.3.15

### Patch Changes

- 添加 columnsetting

## 0.3.14

### Patch Changes

- fix(DrawerForm): 修复默认值无法回显的问题"

## 0.3.13

### Patch Changes

- feat(ProTable): 新增 hideSearchbar 属性, 用于隐藏搜索栏"

## 0.3.12

### Patch Changes

- 复制按钮问题

## 0.3.11

### Patch Changes

- 优化 ProText 组件

## 0.3.10

### Patch Changes

- 优化 ProText 组件的复制功能

## 0.3.9

### Patch Changes

- drawerForm 新增 default,trigger,footer 插槽

## 0.3.8

### Patch Changes

- fix(ProForm): 修改默认不显示表格中的 key=action,actions 和 type='selection'

## 0.3.7

### Patch Changes

- 1. ModalForm 添加 trigger button 插槽
  2. DrawerForm 添加 trigger button 插槽

## 0.3.6

### Patch Changes

- 新增 ProTable Component
- 新增 QueryFilter Component
- 新增 ProText Component
- 新增 ModalForm component
- 新增 DrawerForm Component
- 新增 ProForm Component
