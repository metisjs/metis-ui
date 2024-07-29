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
<code src="./demo/customization.tsx">Customization</code>

## API

| Parameter | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autoHeight | Enable auto-height mode. Requires setting minimum and maximum height | [autoHeightMin:number, autoHeightMax:number] | - |  |
| autoHide | Enable auto-hide mode. If `true`, the scrollbar will hide automatically and only show when scrolling | boolean | true |  |
| autoHideDuration | Duration of the hide animation (ms) | number | 200 |  |
| autoHideTimeout | Hide delay time (ms) | number | 1000 |  |
| className | Semantic structure class | string \| Record<'root' \| 'view', string> | - |  |
| disableDefaultStyles | Removes basic styling to facilitate visual customization | boolean | false |  |
| hideTracksWhenNotNeeded | Hide tracks (`visibility: hidden`) when content does not overflow the container | boolean | false |  |
| onScroll | Triggered while scrolling | (values: ScrollValues) => void | undefined |  |
| onScrollStart | Called when scrolling starts | () => void | - |  |
| onScrollStop | Called when scrolling stops | () => void | - |  |
| onUpdate | Called whenever the component is updated | (values: ScrollValues) => void | - |  |
| renderThumbHorizontal | Horizontal scrollbar element | (props: HTMLAttributes\<HTMLDivElement\>) => JSX.Element | - |  |
| renderThumbVertical | Vertical scrollbar element | (props: HTMLAttributes\<HTMLDivElement\>) => JSX.Element | - |  |
| renderTrackHorizontal | Horizontal track element | (props: HTMLAttributes\<HTMLDivElement\>) => JSX.Element | - |  |
| renderTrackVertical | Vertical track element | (props: HTMLAttributes\<HTMLDivElement>\) => JSX.Element | - |  |
| renderView | Element in which content is rendered | (props: HTMLAttributes\<HTMLDivElement\>) => JSX.Element | - |  |

#### Methods

| Name | Description | Type | Version |
| --- | --- | --- | --- |
| getScrollLeft | Get the current scrollLeft value | () => number |  |
| getScrollTop | Get the current scrollTop value | () => number |  |
| getScrollWidth | Get the current scrollWidth value | () => number |  |
| getScrollHeight | Get the current scrollHeight value | () => number |  |
| getClientWidth | Get the width of the view | () => number |  |
| getClientHeight | Get the height of the view | () => number |  |
| getValues | Get an object with the current position information | () => ScrollValues |  |
| scrollTop | Scroll to the specified top value | (top: number = 0) => void |  |
| scrollLeft | Scroll to the specified left value | (left: number = 0) => void |  |
| scrollToTop | Scroll to the top | () => void |  |
| scrollToBottom | Scroll to the bottom | () => void |  |
| scrollToLeft | Scroll to the left | () => void |  |
| scrollToRight | Scroll to the right | () => void |  |
