---
title: Slider
description: A Slider component for displaying current value and intervals in range.
demo:
  cols: 2
group: Data Entry
---

## When To Use

To input a value in a range.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/input-number.tsx">Slider with InputNumber</code>
<code src="./demo/icon-slider.tsx">Slider with icon</code>
<code src="./demo/tip-formatter.tsx">Customize tooltip</code>
<code src="./demo/event.tsx">Event</code>
<code src="./demo/mark.tsx">Graduated slider</code>
<code src="./demo/vertical.tsx">Vertical</code>
<code src="./demo/show-tooltip.tsx">Control visible of ToolTip</code>
<code src="./demo/reverse.tsx">Reverse</code>
<code src="./demo/draggable-track.tsx">Draggable track</code>
<code src="./demo/multiple.tsx">Multiple handles</code>

## API

| Property | Description | Type | Default | Version |  |
| --- | --- | --- | --- | --- | --- |
| autoFocus | Whether get focus when component mounted | boolean | false |  |  |
| className | Semantic DOM class | [SemanticDOM](#semantic-dom) | - |  |  |
| defaultValue | The default value of slider. When `range` is false, use number, otherwise, use \[number, number] | number, \[number, number] | 0, \[0, 0] |  |  |
| disabled | If true, the slider will not be intractable | boolean | false |  |  |
| dots | Whether the thumb can drag over tick only | boolean | false |  |  |
| included | Make effect when `marks` not null, true means containment and false means coordinative | boolean | true |  |  |
| keyboard | Support using keyboard to move handlers | boolean | true | + |  |
| marks | Tick mark of Slider, type of key must be `number`, and must in closed interval \[min, max], each mark can declare its own style | object | { number: ReactNode }, { number: { className: string, label: ReactNode } } |  |  |
| max | The maximum value the slider can slide to | number | 100 |  |  |
| min | The minimum value the slider can slide to | number | 0 |  |  |
| range | Dual thumb mode | boolean | false |  |  |
| reverse | Reverse the component | boolean | false |  |  |
| step | The granularity the slider can step through values. Must greater than 0, and be divided by (max - min) . When `step` is `null` but exist `marks`, the valid point will only be the `mark`, `min` and `max` | number, null | 1 |  |  |
| tooltip | The tooltip relate props | [tooltip](#tooltip) | - |  |  |
| value | The value of slider. When `range` is false, use number, otherwise, use \[number, number] | number, \[number, number] | - |  |  |
| vertical | If true, the slider will be vertical | boolean | false |  |  |
| onChange | Callback function that is fired when the user changes the slider's value | (value) => void | - |  |  |
| onChangeComplete | Fire when `mouseup` or `keyup` is fired | (value) => void | - |  |  |

### range

| Property       | Description                     | Type    | Default | Version |
| -------------- | ------------------------------- | ------- | ------- | ------- |
| draggableTrack | Whether range track can be drag | boolean | false   |         |

### tooltip

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autoAdjustOverflow | Whether to automatically adjust the popup position | boolean | true |  |
| formatter | Slider will pass its value to `formatter`, and display its value in Tooltip, and hide Tooltip when return value is null | value => ReactNode, null | IDENTITY |  |
| getPopupContainer | The DOM container of the Tooltip, the default behavior is to create a div element in body | (triggerNode) => HTMLElement | () => document.body |  |
| open | If true, Tooltip will show always, or it will not show anyway, even if dragging or hovering | boolean | - |  |
| placement | Set Tooltip display position. Ref [Tooltip](/components/tooltip/) | string | - |  |

## Methods

| Name    | Description  | Version |
| ------- | ------------ | ------- |
| blur()  | Remove focus |         |
| focus() | Get focus    |         |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>
