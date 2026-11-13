---
name: UI
desc: Design foundation — Banmao UI's color tokens, type metrics, dark mode and an exportable token playground
---

<route lang="yaml">
meta:
  layout: default
</route>

# Design Foundation

The library's visual language is called the “Component Atelier”: a paper-like warm white as the base, warm ink black for body text, vermilion as the primary color running through actions and emphasis, and electric blue / acid green / amber / magenta for data and decoration. Every color is exposed as a CSS variable, switches in one step with `html.dark`, and is bridged into Naive UI through `themeOverrides`, so business components and the site skin share the same source.

This page is not a static swatch sheet but an **interactive design system reference**: every token below can be copied with a click, every typeface can be previewed live, and every metric can be tuned by dragging and exported as CSS you can put straight into production.

## Color Tokens

The 18 core tokens are grouped into primary, accent hues, semantic colors and paper-and-ink neutrals. Swatches are shown **in light / dark pairs** by default, so you can see at a glance what the same token resolves to in both themes; switch the “Paired / Light / Dark” control in the top right to inspect a single theme. Click any swatch to copy its color value or `var()` reference; the search box filters by token name, color value or usage.

Neutral text tokens come with a **WCAG AA contrast badge** — all three text levels already reach ≥ 4.5:1 on both the light paper surface and the dark ink surface, so they are safe for annotations, placeholders and meta information.

<ColorTokens />

Reference the variables directly in any component's styles, with no need to care about the current theme:

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

## Typography and Metrics

All three typefaces are loaded locally (`public/assets/fonts`) and fetched ahead of the first screen via `<link rel="preload">`, with no dependency on an external CDN: the serif **DM Serif Display** handles display headings, falling back to Songti SC for Chinese; the sans-serif **DM Sans** handles UI body text, falling back to PingFang SC for Chinese; the monospace **DM Mono** handles labels, numbers and code.

Type into the inputs below and drag the font size sliders to try out text in the real fonts instantly; the type scale, radii, spacing and elevation shadows are all rendered at true pixel sizes, so you can read values straight off the page.

<TypeScale />

## Token Playground

The playground is a **steerable object**: the persistent control area on the left provides 8 groups of live adjustments — primary color, accent color, radius, font size, density, border, elevation and dark preview — while the card on the right consumes those tokens immediately. The contrast between the primary color and the text color is calculated live and marked as meeting AA or not, helping you pick a primary color that is both good-looking and readable.

Once you are happy with it, click “Export CSS” to copy a complete `:root` token definition and paste it straight into your project; “Random” is for exploring directions, and “Reset” returns to the atelier defaults.

<TokenPlayground />

## Dark Mode

The site drives `html.dark` with `useDark` from `@vueuse/core` and persists it under the `color-scheme` key; on the Naive UI side, `NConfigProvider` switches `darkTheme` and `themeOverrides` in sync:

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

Business components only consume CSS variables internally, so switching to dark mode requires no component-level changes. Chart components (`@banmao/datav`) pin the ECharts light theme internally, and the site always hosts them on a paper-white canvas, keeping readings consistent across both themes.

## Integration

To bridge the atelier tokens into Naive UI, just map the CSS variables onto `themeOverrides.common`, and business components can re-skin from the same source as the site:

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

The [“Live Specimen”](/#specimen) on the home page takes these overrides further by applying them to real Naive UI components, offering more than 7 groups of controls — primary color, radius, font size, size, compact / ghost / dark and more — plus reset, random and theme JSON export. It complements the playground on this page: one targets the Naive theme layer, the other the CSS token layer.