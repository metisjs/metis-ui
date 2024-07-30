---
title: Scrollbar
description: A scrollbar that can hide automatically.
group: Other
---

## When to Use

- To beautify the scrollbar.
- To prevent page shaking caused by scrollbars.

## Code Examples

<!-- prettier-ignore -->
<code src="./demo/vertical.tsx">Vertical Scroll</code>
<code src="./demo/horizontal.tsx">Horizontal Scroll</code>
<code src="./demo/auto-height.tsx">AutoHeight</code>

## API

| Parameter | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autoHeight | Enable auto-height mode. Requires setting minimum and maximum height | [autoHeightMin:number, autoHeightMax:number] | false |  |
| autoHide | Enable auto-hide mode. If `true`, the scrollbar will hide automatically and only show when scrolling | boolean | true |  |
| autoHideDuration | Duration of the hide animation (ms) | number | 500 |  |
| autoHideTimeout | Hide delay time (ms) | number | 1000 |  |
| className | Semantic structure class | string \| Record<'root' \| 'view' \| 'trackHorizontal' \| 'trackVertical' \| 'thumbHorizontal' \| 'thumbVertical', string> | - |  |
| onScroll | Triggered while scrolling | (values: ScrollValues, event:UIEvent&lt;HTMLElement>) => void | undefined |  |
| onScrollStart | Called when scrolling starts | () => void | - |  |
| onScrollStop | Called when scrolling stops | () => void | - |  |
| thumbMinSize | Set thumb min size | number | 30 |  |
| thumbSize | fixed a thumb size | number | - |  |
| universal | App runs on both client and server, activate the universal mode | boolean | false |  |

#### Methods

| Name | Description | Type | Version |
| --- | --- | --- | --- |
| getValues | Get an object with the current position information | () => ScrollValues |  |
| scrollTo | Scroll to the specified value | Same as HTMLElement scrollTo,see: [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollTo) |  |
