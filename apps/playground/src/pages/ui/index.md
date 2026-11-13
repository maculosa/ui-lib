---
name: UI
desc: 设计基座 —— Banmao UI 的色彩令牌、字体度量、暗色模式与可导出的令牌调参台
---

<route lang="yaml">
meta:
  layout: default
</route>

# 设计基座

组件库的视觉语言称为「组件工坊」：纸感暖白打底、墨色暖黑行文，朱红作为主色贯穿操作与强调，电蓝 / 酸绿 / 琥珀 / 品红承担数据与装饰。所有色彩以 CSS 变量暴露，随 `html.dark` 一键切换，并通过 `themeOverrides` 桥接进 Naive UI，保证业务组件与站点皮肤同源。

这一页不是静态色卡，而是一套**可交互的设计系统参考**：下方每个令牌都能点击复制、每套字体都能实时试排、每个度量都能拖动调参并导出为可直接落地的 CSS。

## 色彩令牌

18 个核心令牌按主色、辅助色相、语义色与纸墨中性色分组。色卡默认**亮 / 暗成对**呈现，方便一眼看清同一令牌在两种主题下的取值；切换右上角「配对 / 亮 / 暗」可单独审视某一主题。点击任意色卡复制色值或 `var()` 引用，搜索框支持按令牌名、色值或用途过滤。

中性文字令牌附带 **WCAG AA 对比度徽标**——三级文字在亮色纸面与暗色墨面上均已达到 ≥ 4.5:1，可放心用于标注、占位与元信息。

<ColorTokens />

在任意组件样式中直接引用变量即可，无需关心当前主题：

```css
.my-card {
  background: var(--color-surface);
  border: 1px solid var(--color-divider);
  color: var(--color-foreground);
}

.my-card:hover {
  border-color: var(--color-primary);
}
```

## 字体与度量

三套字体全部本地化加载（`public/assets/fonts`），首屏通过 `<link rel="preload">` 提前抓取，不依赖外部 CDN：衬线 **DM Serif Display** 承担展示标题，中文回退 Songti SC；无衬线 **DM Sans** 承担界面正文，中文回退 PingFang SC；等宽 **DM Mono** 承担标签、编号与代码。

在下方输入框键入文字、拖动字号滑块，即可用真实字体即时试排；字号阶梯、圆角、间距与层级阴影均按真实像素渲染，可直接对照取用。

<TypeScale />

## 令牌调参台

调参台是一个**可转向的对象**：左侧常驻控件区提供主色、强调色、圆角、字号、密度、描边、层级与暗色预览共 8 组实时调节，右侧卡片即时消费这些令牌。主色与文字色的对比度会实时计算并标注是否满足 AA，帮助你选出既好看又可读的主色。

调好后点击「导出 CSS」，即可复制一段完整的 `:root` 令牌定义，直接粘贴进业务项目；「随机」用于探索方向，「重置」回到工坊默认。

<TokenPlayground />

## 暗色模式

站点用 `@vueuse/core` 的 `useDark` 驱动 `html.dark`，并持久化到 `color-scheme` 键；Naive UI 侧由 `NConfigProvider` 同步切换 `darkTheme` 与 `themeOverrides`：

```ts
import { useDark } from '@vueuse/core'
import { darkTheme } from 'naive-ui'

const isDark = useDark({ storageKey: 'color-scheme' })

function toggleTheme() {
  isDark.value = !isDark.value
}
```

```vue
<n-config-provider :theme="isDark ? darkTheme : null" :theme-overrides="themeOverrides">
  <router-view />
</n-config-provider>
```

业务组件内部只消费 CSS 变量，因此暗色切换无需任何组件级改动。图表类组件（`@banmao/datav`）内部固定 ECharts 亮色主题，站点统一以纸白画布承载，保证两种主题下读数一致。

## 接入方式

把工坊令牌桥接进 Naive UI，只需将 CSS 变量映射到 `themeOverrides.common`，业务组件即可与站点同源换肤：

```ts
const themeOverrides = {
  common: {
    primaryColor: 'var(--color-primary)',
    primaryColorHover: 'var(--color-primary-hover)',
    primaryColorPressed: 'var(--color-primary-pressed)',
    borderRadius: '6px',
    fontSize: '14px',
  },
}
```

首页的[「活体标本」](/#specimen)进一步把这组覆盖作用于真实 Naive UI 组件，提供主色、圆角、字号、尺寸、紧凑 / 幽灵 / 暗色等 7 组以上控件，并支持重置、随机与导出主题 JSON——与本页调参台互为补充：一个面向 Naive 主题层，一个面向 CSS 令牌层。