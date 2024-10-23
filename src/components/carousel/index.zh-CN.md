---
group: 数据展示
title: Carousel
subtitle: 走马灯
description: 一组轮播的区域。
demo:
  cols: 2
---

## 何时使用

- 当有一组平级的内容。
- 当内容空间不足时，可以用走马灯的形式进行收纳，进行轮播展现。
- 常用于一组图片或卡片轮播。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/position.tsx">位置</code>
<code src="./demo/autoplay.tsx">自动切换</code>
<code src="./demo/fade.tsx">渐显</code>
<code src="./demo/card.tsx">卡片化</code>
<code src="./demo/arrows.tsx">切换箭头</code>

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| showArrow | 是否显示箭头 | boolean | false |  |
| autoPlay | 是否自动切换 | boolean \| { interval?: number; hoverToPause?: boolean } | false |  |
| defaultIndex | 默认显示位置 | number | 0 |  |
| speed | 自动切换的间隔（毫秒） | number | 3000 |  |
| animation | 动画效果 | 'slide' \| 'fade' \| 'card' \| false | `slide` |
| indicatorPosition | 面板指示点位置 | 'bottom' \| 'top' \| 'left' \| 'right' \| 'outer' | `bottom` |  |
| indicator | 是否显示面板指示点 | boolean | true |  |
| timingFunc | 过渡速度曲线, 默认匀速 | string | `cubic-bezier(0.34, 0.69, 0.1, 1)` |  |
| lazy | 是否仅渲染满足动画效果的最少数量的 children | boolean | false |  |
| onChange | 切换面板的回调 | (current: number, next: number) => void | - |  |
| trigger | 切换触发方式, click/hover 指示器 | 'click' \| 'hover' | `click` |  |
| vertical | 竖向切换 | boolean | false |  |
| icons | 自定义图标 | {prev?: ReactNode; next?: ReactNode;} | - |  |
| className | 语义化结构 class | [SemanticClassName](/docs/semantic-classname-cn) | - |  |

## 方法

| 名称              | 描述           |
| ----------------- | -------------- |
| goTo(slideNumber) | 切换到指定面板 |
| next()            | 切换到下一面板 |
| prev()            | 切换到上一面板 |
