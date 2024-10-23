---
group: Data Display
title: Carousel
description: A set of carousel areas.
demo:
  cols: 2
---

## When To Use

- When there is a group of content on the same level.
- When there is insufficient content space, it can be used to save space in the form of a revolving door.
- Commonly used for a group of pictures/cards.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/position.tsx">Position</code>
<code src="./demo/autoplay.tsx">Scroll automatically</code>
<code src="./demo/fade.tsx">Fade in</code>
<code src="./demo/card.tsx">Card</code>
<code src="./demo/arrows.tsx" version="5.17.0">Arrows for switching</code>

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| showArrow | When to show the switch trigger | boolean | false |  |
| autoPlay | Whether to scroll automatically | boolean \| { interval?: number; hoverToPause?: boolean } | false |  |
| defaultIndex | The default index of slide which starts from 0 | number | 0 |  |
| speed | The duration of the slide movement(ms) | number | 3000 |  |
| animation | The animation of the slide movement | 'slide' \| 'fade' \| 'card' \| false | `slide` |
| indicatorPosition | Position of indication | 'bottom' \| 'top' \| 'left' \| 'right' \| 'outer' | `bottom` |  |
| indicator | Whether to render indicator | boolean | true |  |
| timingFunc | How intermediate values are calculated for CSS properties being affected by a transition effect | string | `cubic-bezier(0.34, 0.69, 0.1, 1)` |  |
| lazy | Whether to render only the minimum number of children that meet the animation effect | boolean | false |  |
| onChange | Callback when slide changes. | (current: number, next: number) => void | - |  |
| trigger | How to trigger the slide switch, click/hover the indicator, click/hover 指示器 | 'click' \| 'hover' | `click` |  |
| vertical | Vertical mode | boolean | false |  |
| icons | Customize icons | {prev?: ReactNode; next?: ReactNode;} | - |  |
| className | Semantic Dom class | [SemanticClassName](/docs/semantic-classname) | - |  |

## Methods

| Name              | Description                            |
| ----------------- | -------------------------------------- |
| goTo(slideNumber) | Go to slide index                      |
| next()            | Change current slide to next slide     |
| prev()            | Change current slide to previous slide |
