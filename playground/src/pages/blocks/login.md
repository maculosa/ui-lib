---
name: Login
desc: Login 是一个登录页面组件，提供了登录表单的布局、表单验证、登录请求等常用功能，可以帮助开发者快速构建登录页面。
---

<route lang="yaml">
meta:
  layout: default
</route>

# Login Blocks

Login Blocks 是基于 Naive UI 而开发的登录页面组件，提供了登录表单的布局、表单验证、登录请求等常用功能，可以帮助开发者快速构建登录页面。

## 何时使用

- 当你需要快速开发登录页面
- 当你需要表单验证

## 快速开始

<Demo title="简单登录页" url="/examples/blocks/login/simple-login" :raw="SimpleLoginRaw">
    <SimpleLogin />
</Demo>

<Demo title="带背景的登录页" url="/examples/blocks/login/simple-bg-login" :raw="SimpleBgLoginRaw">
    <SimpleBgLogin />
</Demo>
