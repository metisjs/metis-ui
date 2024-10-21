---
title: Scrollbar
subtitle: 滚动条
description: 可以自动隐藏的滚动条。
group: 其他
---

## 何时使用

- 用于美化滚动条。
- 防止因滚动条导致的页面抖动。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/vertical.tsx">竖向滚动</code>
<code src="./demo/horizontal.tsx">横向滚动</code>
<code src="./demo/auto-height.tsx">自动高度</code>

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| autoHeight | 启用自动高度模式。需要设置最小、最大高度 | [autoHeightMin:number, autoHeightMax:number] | false |  |
| autoHide | 启用自动隐藏模式。为 `true` 时，滚动条会自动隐藏，只在滚动时显示 | boolean | true |  |
| autoHideDuration | 隐藏动画的持续时间（毫秒） | number | 500 |  |
| autoHideTimeout | 隐藏延迟时间（毫秒） | number | 1000 |  |
| className | 语义化结构 class | string \| Record&lt;'root' \| 'view' \| 'trackHorizontal' \| 'trackVertical' \| 'thumbHorizontal' \| 'thumbVertical', string> | - |  |
| thumbMinSize | 滑块最小尺寸 | number | 20 |  |
| thumbSize | 滑块尺寸 | number | - |  |
| universal | 服务端渲染时激活 | boolean | false |  |
| onScroll | 在滚动时运行 | (values: ScrollValues, event:UIEvent&lt;HTMLElement>) => void | undefined |  |
| onScrollStart | 滚动开始时调用 | () => void | - |  |
| onScrollStop | 滚动停止时调用 | () => void | - |  |

#### Methods

| 名称 | 说明 | 类型 | 版本 |
| --- | --- | --- | --- |
| getValues | 获取当前位置信息对象 | () => ScrollValues |  |
| scrollTo | 滚动到指定值 | 同原生 HtmlElement scrollTo 方法：见：[MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTo) |  |
