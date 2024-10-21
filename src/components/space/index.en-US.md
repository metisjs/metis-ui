---
title: Space
description: Set components spacing.
group: Layout
---

## When To Use

- Avoid components clinging together and set a unified space.
- Use Space.Compact when child form components are compactly connected and the border is collapsed.

## Examples

<!-- TODO: Component 待开发 -->

<!-- prettier-ignore -->
<!-- <code src="./demo/base.tsx">Basic Usage</code>
<code src="./demo/vertical.tsx">Vertical Space</code>
<code src="./demo/size.tsx">Space Size</code>
<code src="./demo/align.tsx">Align</code>
<code src="./demo/customize.tsx">Customize Size</code>
<code src="./demo/wrap.tsx">Wrap</code>
<code src="./demo/split.tsx">Split</code>
<code src="./demo/compact.tsx">Compact Mode for form component</code>
<code src="./demo/compact-buttons.tsx">Button Compact Mode</code>
<code src="./demo/compact-button-vertical.tsx">Vertical Compact Mode</code>
<code src="./demo/compact-debug.tsx" debug>Input addon debug</code>
<code src="./demo/compact-nested.tsx" debug>Nested Space Compact</code>
<code src="./demo/debug.tsx" debug>Diverse Child</code>
<code src="./demo/gap-in-line.tsx" debug>Flex gap style</code> -->

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| align | Align items | `start` \| `end` \|`center` \|`baseline` | - |  |
| block | block-level elements, default is inline elements | boolean | false |  |
| justify | Justify Content | `start` \| `end` \| `center` \| `space-around` \| `space-between` | `start` |  |
| size | The space size | [Size](#size) \| [Size\[\]](#size) | `small` |  |
| split | Set split | ReactNode | - |  |
| vertical | vertical space | boolean | false |  |
| wrap | Auto wrap line, when `horizontal` effective | boolean | false |  |

### Size

`'small' | 'middle' | 'large' | number`

### Space.Compact

Use Space.Compact when child form components are compactly connected and the border is collapsed. The supported components are：

- Button
- AutoComplete
- Cascader
- DatePicker
- Input
- Select
- TimePicker
- TreeSelect

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| block | Option to fit width to its parent\\'s width | boolean | false |  |
| size | Set child component size | `large` \| `middle` \| `small` | `middle` |  |
| vertical | vertical space | boolean | false |  |
