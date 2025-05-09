---
title: Tooltip
description: A simple text popup tip.
group: Data Display
demo:
  cols: 2
---

## When To Use

- The tip is shown on mouse enter, and is hidden on mouse leave. The Tooltip doesn't support complex text or operations.
- To provide an explanation of a `button/text/operation`. It's often used instead of the html `title` attribute.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/placement.tsx">Placement</code>
<code src="./demo/arrow.tsx">Arrow</code>
<code src="./demo/shift.tsx" iframe="200">Auto Shift</code>
<code src="./demo/auto-adjust-overflow.tsx" debug>Adjust placement automatically</code>
<code src="./demo/destroy-tooltip-on-hide.tsx" debug>Destroy tooltip when hidden</code>
<code src="./demo/colorful.tsx">Colorful Tooltip</code>

## API

| Property  | Description                   | Type                         | Default |
| --------- | ----------------------------- | ---------------------------- | ------- |
| className | Semantic DOM class            | [SemanticDOM](#semantic-dom) | -       |
| title     | The text shown in the tooltip | ReactNode, () => ReactNode   | -       |

### Common API

The following APIs are shared by Tooltip, Popconfirm, Popover.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| align | This value will be merged into placement's config | object | - |  |
| arrow | Change arrow's visible state and change whether the arrow is pointed at the center of target. | boolean, { pointAtCenter: boolean } | true |  |
| autoAdjustOverflow | Whether to adjust popup placement automatically when popup is off screen | boolean | true |  |
| color | The background color | string | - |  |
| defaultOpen | Whether the floating tooltip card is open by default | boolean | false |  |
| destroyTooltipOnHide | Whether destroy tooltip when hidden | boolean | false |  |
| fresh | Tooltip will cache content when it is closed by default. Setting this property will always keep updating | boolean | false |  |
| getPopupContainer | The DOM container of the tip, the default behavior is to create a `div` element in `body` | (triggerNode: HTMLElement) => HTMLElement | () => document.body |  |
| mouseEnterDelay | Delay in seconds, before tooltip is shown on mouse enter | number | 0.1 |  |
| mouseLeaveDelay | Delay in seconds, before tooltip is hidden on mouse leave | number | 0.1 |  |
| open | Whether the floating tooltip card is open or not | boolean | false |  |
| overlayClassName | Class name of the tooltip card | string | - |  |
| overlayInnerStyle | Style of the tooltip inner content | object | - |  |
| overlayStyle | Style of the tooltip card | object | - |  |
| placement | The position of the tooltip relative to the target, which can be one of `top` `left` `right` `bottom` `topLeft` `topRight` `bottomLeft` `bottomRight` `leftTop` `leftBottom` `rightTop` `rightBottom` | string | `top` |  |
| trigger | Tooltip trigger mode. Could be multiple by passing an array | `hover`, `focus`, `click`, `contextMenu`, Array&lt;string> | `hover` |  |
| zIndex | Config `z-index` of Tooltip | number | - |  |
| onOpenChange | Callback executed when visibility of the tooltip card is changed | (open: boolean) => void | - |  |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>

## Note

Please ensure that the child node of `Tooltip` accepts `onMouseEnter`, `onMouseLeave`, `onPointerEnter`, `onPointerLeave`, `onFocus`, `onClick` events.
