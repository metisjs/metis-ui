---
title: Scrollbar
subtitle: 滚动条
group:
  title: 其他
  order: 6
---

可以自动隐藏的滚动条。

> 由 [rc-scrollbars](https://github.com/sakhnyuk/rc-scrollbars) 扩展而来

## 何时使用

- 用于美化滚动条。
- 防止因滚动条导致的页面抖动。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/vertical.tsx">竖向滚动</code>
<code src="./demo/horizontal.tsx">横向滚动</code>
<code src="./demo/customization.tsx">自定义</code>

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| autoHeight | 启用自动高度模式。需要设置最小、最大高度 | [autoHeightMin:number, autoHeightMax:number] | - |  |
| autoHide | 启用自动隐藏模式。为 `true` 时，滚动条会自动隐藏，只在滚动时显示 | boolean | true |  |
| autoHideDuration | 隐藏动画的持续时间（毫秒） | number | 200 |  |
| autoHideTimeout | 隐藏延迟时间（毫秒） | number | 1000 |  |
| className | 语义化结构 class | string \| Record<'root' \| 'view', string> | - |  |
| disableDefaultStyles | 移除基础样式以便进行视觉自定义 | boolean | false |  |
| hideTracksWhenNotNeeded | 当内容不溢出容器时隐藏轨道（`visibility: hidden`） | boolean | false |  |
| onScroll | 在滚动时运行 | (values: ScrollValues) => void | undefined |  |
| onScrollStart | 滚动开始时调用 | () => void | - |  |
| onScrollStop | 滚动停止时调用 | () => void | - |  |
| onUpdate | 组件更新时调用 | (values: ScrollValues) => void | - |  |
| renderThumbHorizontal | 水平滚动条元素 | (props: HTMLAttributes\<HTMLDivElement\>) => JSX.Element | - |  |
| renderThumbVertical | 垂直滚动条元素 | (props: HTMLAttributes\<HTMLDivElement\>) => JSX.Element | - |  |
| renderTrackHorizontal | 水平轨道元素 | (props: HTMLAttributes\<HTMLDivElement\>) => JSX.Element | - |  |
| renderTrackVertical | 垂直轨道元素 | (props: HTMLAttributes\<HTMLDivElement>\) => JSX.Element | - |  |
| renderView | 内容渲染的元素 | (props: HTMLAttributes\<HTMLDivElement\>) => JSX.Element | - |  |

#### Methods

| 名称            | 说明                     | 类型                       | 版本 |
| --------------- | ------------------------ | -------------------------- | ---- |
| getScrollLeft   | 获取当前 scrollLeft 值   | () => number               |      |
| getScrollTop    | 获取当前 scrollTop 值    | () => number               |      |
| getScrollWidth  | 获取当前 scrollWidth 值  | () => number               |      |
| getScrollHeight | 获取当前 scrollHeight 值 | () => number               |      |
| getClientWidth  | 获取视图的宽度           | () => number               |      |
| getClientHeight | 获取视图的高度           | () => number               |      |
| getValues       | 获取当前位置信息对象     | () => ScrollValues         |      |
| scrollTop       | 滚动到指定顶部值         | (top: number = 0) => void  |      |
| scrollLeft      | 滚动到指定左侧值         | (left: number = 0) => void |      |
| scrollToTop     | 滚动到顶部               | () => void                 |      |
| scrollToBottom  | 滚动到底部               | () => void                 |      |
| scrollToLeft    | 滚动到左侧               | () => void                 |      |
| scrollToRight   | 滚动到右侧               | () => void                 |      |
