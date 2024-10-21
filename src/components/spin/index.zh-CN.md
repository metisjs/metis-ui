---
title: Spin
subtitle: 加载中
description: 用于页面和区块的加载中状态。
group: 反馈
demo:
  cols: 2
---

## 何时使用

页面局部处于等待异步数据或正在渲染过程时，合适的加载动效会有效缓解用户的焦虑。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本用法</code>
<code src="./demo/size.tsx">各种大小</code>
<code src="./demo/nested.tsx">卡片加载中</code>
<code src="./demo/tip.tsx">自定义描述文案</code>
<code src="./demo/delay-and-debounce.tsx">延迟</code>
<code src="./demo/fullscreen.tsx">全屏</code>

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| className | 语义化结构 class | string \| Record&lt;'root' \| 'wrapper' \| 'fullscreen' \| 'indicator' \| 'tip', string> | - |  |
| delay | 延迟显示加载效果的时间（防止闪烁） | number (毫秒) | - |  |
| fullscreen | 显示带有 `Spin` 组件的背景 | boolean | false |  |
| size | 组件大小，可选值为 `small` `default` `large` | string | `default` |  |
| spinning | 是否为加载中状态 | boolean | true |  |
| tip | 当作为包裹元素时，可以自定义描述文案 | ReactNode | - |  |
