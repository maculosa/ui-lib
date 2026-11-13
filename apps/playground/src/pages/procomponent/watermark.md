---
name: Watermark
description: Watermark
---

<route lang="yaml">
meta:
  layout: default
</route>

# Watermark

水印组件在内容区域或整个视口上叠加半透明文字标记，用于敏感页面的溯源与防截图外传。支持局部覆盖与全屏覆盖两种模式，文字、颜色、旋转角度与间距均可配置。

## 基本用法

将水印包裹在需要保护的内容外层，水印仅覆盖该局部区域。

<Demo title="基本用法" desc="局部水印：包裹报表内容，文字以 -22° 倾斜平铺，间距 80×80。" :raw="BaseRaw">
    <Base />
</Demo>

## 全屏水印

开启 `fullscreen` 后水印覆盖整个视口，适合登录后台后的全局保护。下方开关可实时切换。

<Demo title="全屏水印" desc="全屏模式：通过开关切换 fullscreen，水印铺满整个视口。" :raw="FullscreenRaw">
    <Fullscreen />
</Demo>
