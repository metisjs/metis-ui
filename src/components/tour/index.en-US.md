---
group: Data Display
title: Tour
description: A popup component for guiding users through a product.
demo:
  cols: 2
---

## When To Use

Use when you want to guide users through a product.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/non-modal.tsx">Non-modal</code>
<code src="./demo/placement.tsx">Placement</code>
<code src="./demo/mask.tsx">Custom mask style</code>
<code src="./demo/indicator.tsx">Custom indicator</code>
<code src="./demo/gap.tsx">Custom highlighted area style</code>

## API

### Tour

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| arrow | Whether to show the arrow, including the configuration whether to point to the center of the element | `boolean`\|`{ pointAtCenter: boolean}` | `true` |  |
| className | Semantic DOM class | [SemanticDOM](#semantic-dom) | - |  |
| closable | The config of closable | boolean \| ({ closeIcon?: React.ReactNode } & React.AriaAttributes) | `false` |  |
| current | What is the current step | `number` | - |  |
| defaultCurrent | What is the default current step | `number` | - |  |
| disabledInteraction | Disable interaction on highlighted area. | `boolean` | `false` |  |
| gap | Control the radius of the highlighted area and the offset between highlighted area and the element. | `{ offset?: number \| [number, number]; radius?: number }` | `{ offset?: 6 ; radius?: 2 }` |  |
| getPopupContainer | Set the rendering node of Tour floating layer | `(node: HTMLElement) => HTMLElement` | body |  |
| indicatorsRender | custom indicator | `(current: number, total: number) => ReactNode` | - |  |
| mask | Whether to enable masking | `boolean` | `true` |  |
| open | Open tour | `boolean` | - |  |
| placement | Position of the guide card relative to the target element | `center` `left` `leftTop` `leftBottom` `right` `rightTop` `rightBottom` `top` `topLeft` `topRight` `bottom` `bottomLeft` `bottomRight` | `bottom` |  |
| scrollIntoViewOptions | support pass custom scrollIntoView options | `boolean \| ScrollIntoViewOptions` | `true` |  |
| steps | Tour's steps | [TourStepInfo\[\]](#tourstepinfo) | - |  |
| type | Type, affects the background color and text color | `default` `primary` | `default` |  |
| zIndex | Tour's zIndex | number | 1001 |  |
| onChange | Callback when the step changes. Current is the previous step | `(current: number) => void` | - |  |
| onClose | Callback function on shutdown | `Function` | - |  |

### TourStepInfo

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| arrow | Whether to show the arrow, including the configuration whether to point to the center of the element | `boolean` `{ pointAtCenter: boolean}` | `true` |  |
| className | Semantic DOM class | [SemanticDOM](#semantic-dom) | - |  |
| closable | The config of closable | boolean \| ({ closeIcon?: React.ReactNode } & React.AriaAttributes) | `false` |  |
| cover | Displayed pictures or videos | `ReactNode` | - |  |
| description | description | `ReactNode` | - |  |
| mask | Whether to enable masking, the default follows the `mask` property of Tour | `boolean` | `true` |  |
| nextButtonProps | Properties of the Next button | [ButtonProps](/components/button-cn/#api) | - |  |
| placement | Position of the guide card relative to the target element | `center` `left` `leftTop` `leftBottom` `right` `rightTop` `rightBottom` `top` `topLeft` `topRight` `bottom` `bottomLeft` `bottomRight` | `bottom` |  |
| prevButtonProps | Properties of the previous button | [ButtonProps](/components/button-cn/#api) | - |  |
| scrollIntoViewOptions | support pass custom scrollIntoView options, the default follows the `scrollIntoViewOptions` property of Tour | `boolean \| ScrollIntoViewOptions` | `true` |  |
| target | Get the element the guide card points to. Empty makes it show in center of screen | `() => HTMLElement` `HTMLElement` | - |  |
| title | title | `ReactNode` | - |  |
| type | Type, affects the background color and text color | `default` `primary` | `default` |  |
| onClose | Callback function on shutdown | `Function` | - |  |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>
