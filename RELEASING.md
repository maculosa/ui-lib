# 发布指引

本项目使用 [changesets](https://github.com/changesets/changesets) 管理版本与 CHANGELOG，发布有两条路径：

| 路径 | 适用场景 | 入口 |
| --- | --- | --- |
| **CI 自动发布（推荐）** | 日常迭代 | 合并带 changeset 的 PR，机器人开 Version PR，合并即发布 |
| **本地手动发布** | 紧急发版、CI 不可用 | `pnpm release:one` |

## 参与发布的包

| 包 | 是否发 npm |
| --- | --- |
| `@banmao/procomponent` | ✅ |
| `@banmao/hooks` | ✅ |
| `@banmao/blocks` | ✅ |
| `@banmao/datav` | ❌ private |
| `@banmao/draw` | ❌ private |

---

## 一、日常开发：写 changeset

每次改动 `packages/*` 且需要体现到新版本时，在功能提交旁附带一个 changeset：

```bash
pnpm changeset
```

交互式选择：

1. **影响哪些包**：空格多选，只选真正改动的包；
2. **bump 类型**：
   - `patch` — 修复、样式调整、文档；
   - `minor` — 新增组件 / 新增 API，向后兼容；
   - `major` — 破坏性变更（0.x 阶段也可用 minor 代替，团队约定为准）；
3. **变更说明**：一句话描述，会进入 CHANGELOG。

生成的文件在 `.changeset/`，形如：

```md
---
"@banmao/procomponent": patch
---

修复 ProTable 列固定后宽度计算错误
```

随功能一起提交：

```bash
git add .changeset packages
git commit -m "fix(ProTable): 修复列固定宽度计算"
git push
```

> 一个 PR 可以有多个 changeset；纯内部改动（文档、playground、CI）不需要 changeset。

## 二、CI 自动发布流程

```
功能 PR（含 .changeset/*.md）合入 main
        │
        ▼  Release workflow（.github/workflows/release.yml）
机器人创建/更新 "Version Packages" PR
  （升版本号 + 写 CHANGELOG + 删除已消费的 changeset）
        │
        ▼  维护者 review 并合并该 PR
再次触发 workflow：
   pnpm install → pnpm run build（全量构建）
        → changeset publish（只发版本变化的公开包）
        → 推送 git tag → 创建 GitHub Release
```

要点：

- **合并功能 PR 不会直接发版**，发版时机是合并 "Version Packages" PR 那一刻，天然带一次人工确认；
- 机器人 PR 有新 changeset 时会自动更新，无需手动关掉重开；
- 发布后可在 npm 与 GitHub Releases 页面核对版本、tag、CHANGELOG。

## 三、本地手动发布

仅在需要绕开 CI 时使用。前置条件（脚本会校验）：

- 当前在 `main` 分支，工作区干净（无未提交改动）；
- 存在待发布的 changeset（`.changeset/*.md`）；
- 已登录 npm：`npm login --registry=https://registry.npmjs.org/`；
- 有 npm 账号发布 `@banmao` scope 的权限。

执行：

```bash
pnpm release:one
```

脚本会依次：`changeset version` → 构建版本变化的包 → 提交版本号与 CHANGELOG → **交互确认** → `changeset publish` → `git push --follow-tags`。

发布中断（如网络失败、取消确认）后恢复：

```bash
pnpm exec changeset publish --registry=https://registry.npmjs.org/ && git push --follow-tags
```

> 本地发布与 CI 发布不要同时进行；任一路径发布后都会产生版本提交与 tag，另一路径会因版本号已存在而跳过或失败。

## 四、常见问题

**合并功能 PR 后没有出现 Version Packages PR？**
检查该 PR 是否包含 `.changeset/*.md` 文件；若确实忘了，补一个 changeset 再 push，机器人会在下次运行时更新。

**发布报 `401 Unauthorized` / `EOTP`？**
CI 使用仓库 secret `NPM_TOKEN`（npm Granular Access Token，需勾选 *Bypass 2FA*、具备 `@banmao` scope 的 read & write 权限）。token 过期会导致发布静默失败，重新生成后到 GitHub → Settings → Secrets and variables → Actions 更新即可。

**版本发了但 tag 没推上去？**
确认 workflow 中 `actions/checkout` 带 `fetch-depth: 0`（已配置）。本地发布漏推 tag 时：`git push --follow-tags`。

**想看下次发布会长成什么样（不发版）？**

```bash
pnpm exec changeset status
```

**发布失败了能重跑吗？**
可以。`changeset publish` 会跳过 npm 上已存在的版本，在 Actions 页面 re-run 失败的任务即可，不会重复发布。

**首个版本 / 新增包发布注意什么？**
新包名需在 npm 上未被占用且归属 `@banmao` scope；首次发布必须通过 token 完成（OIDC Trusted Publishing 只能用于已存在的包）。