---
"@banmao/blocks": patch
---

修复 Login 根节点被宿主 Tailwind 截断宽度的问题：组件内部类名全部加 `bm-login-` 前缀。

- `.container` 与 Tailwind v4 的 `.container` 工具类同名，后者的断点 `max-width`（640/768/1024/1280/1536px）会让登录页在宽视口下右侧留白、居中内容偏移。根节点现为 `.bm-login-container`。
- 一并重命名 `.card`、`.logo`、`.column*`、`.login-form`、`.title` 等内部类名为 `.bm-login-*`，并删除与 Tailwind 同名的 `.grid`、`.flex-1`、`.flex-col`、`.flex-center`、`.space-y-4`（其效果并入对应组件类）。
- CSS 变量从 `:root` 收敛到 `.bm-login-container`，并统一加 `--bm-login-` 前缀（原 `--color-text`、`--bg-color`、`--login-shadow` 等不再污染全局）。
- 视觉行为不变；如有宿主 CSS 覆盖了上述旧类名或旧变量，需同步改名。
