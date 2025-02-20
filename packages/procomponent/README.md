# @banmao/procomponent

基于 Naive UI 封装的高级组件库，旨在帮助开发者快速搭建企业级中后台应用。

## 特性

- 🚀 开箱即用的高级组件
- 💪 基于 Naive UI，享受其完善的基础组件能力
- 📦 支持按需加载，减小打包体积
- 🎨 继承 Naive UI 的主题系统

## 安装

```bash
# 安装 naive-ui
pnpm add naive-ui

# 安装 @banmao/procomponent
pnpm add @banmao/procomponent
```

## 使用

```ts
import { createApp } from 'vue'
import { 
  ProLayout,
  ProTable,
  ProForm,
  DrawerForm,
  ModalForm
} from '@banmao/procomponent'

const app = createApp()

// 注册需要使用的组件
app.use(ProLayout)
app.use(ProTable)
app.use(ProForm)
app.use(DrawerForm)
app.use(ModalForm)
```

## 组件列表

- DrawerForm - 抽屉表单组件
- ModalForm - 弹窗表单组件
- ProForm - 表单组件
- ProLayout - 布局组件
- ProTable - 表格组件
- ProText - 文本组件
- ProDescriptions - 描述列表组件
- ProList - 列表组件
- Tour - 漫游式引导组件
- Watermark - 水印组件

## 文档

访问 [ProComponent 文档](https://procomponent.banmao.cc/) 了解更多使用细节。

## License

[MIT](./LICENSE)