---
name: ProForm
desc: ProForm is an advanced form component built on Form. It covers the common form needs — layout, validation and submission — so you can build form screens quickly.
---

<route lang="yaml">
meta:
  layout: default
</route>

# ProForm

ProForm is an advanced form component built on Form. It covers the common form needs — layout, validation and submission — so you can build form screens quickly.

## When to use

- When you need to build a form page quickly
- When you need a more configuration-driven form

## Examples

Code examples for ProForm:

<Demo title="Linked fields" desc="Linked fields" :raw="UniLinkChange">
  <UniLinkChange />
</Demo>

<Demo title="Filter and reset" desc="Filter and reset" :raw="FilterResetRaw">
  <FilterReset />
</Demo>

<Demo title="Filter and reset with defaults" desc="Filter and reset with defaults" :raw="FilterResetWithDefaultRaw">
  <FilterResetWithDefault />
</Demo>

<Demo title="Basic usage" desc="Basic usage" :raw="BaseRaw">
  <Base />
</Demo>

<Demo title="Cascader with remote options" desc="Cascader with remote options" :raw="RequestCascaderFormRaw">
  <RequestCascaderForm />
</Demo>

## ProForm API