---
name: Watermark
description: Watermark
---

<route lang="yaml">
meta:
  layout: default
</route>

# Watermark

The watermark component overlays semi-transparent text on a content area or the whole viewport, so sensitive pages can be traced and screenshots can be attributed. It supports both local and fullscreen coverage, and the text, color, rotation angle and spacing are all configurable.

## Basic usage

Wrap the watermark around the content you want to protect; it covers only that area.

<Demo title="Basic usage" desc="Local watermark: wraps the report content, text tiled at -22° with 80×80 spacing." :raw="BaseRaw">
    <Base />
</Demo>

## Fullscreen watermark

With `fullscreen` enabled the watermark covers the whole viewport, which suits global protection after signing in to an admin console. Use the switch below to toggle it live.

<Demo title="Fullscreen watermark" desc="Fullscreen mode: toggle fullscreen with the switch and the watermark fills the viewport." :raw="FullscreenRaw">
    <Fullscreen />
</Demo>