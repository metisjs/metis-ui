---
title: Segmented
group:
  title: Data Display
  order: 4
---

Segmented Controls.

## When To Use

- When displaying multiple options and user can select a single option;
- When switching the selected option, the content of the associated area changes.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/block.tsx">Block Segmented</code>
<code src="./demo/disabled.tsx">Basic</code>
<code src="./demo/controlled.tsx">Controlled mode</code>
<code src="./demo/dynamic.tsx">Dynamic</code>
<code src="./demo/size.tsx">Three sizes of Segmented</code>
<code src="./demo/with-icon.tsx">With Icon</code>
<code src="./demo/icon-only.tsx">With Icon only</code>

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| block | Option to fit width to its parent\'s width | boolean | false |  |
| defaultValue | Default selected value | string \| number |  |  |
| disabled | Disable all segments | boolean | false |  |
| onChange | The callback function that is triggered when the state changes | function(value: string \| number) |  |  |
| options | Set children optional | string\[] \| number\[] \| Array<{ label: ReactNode value: string icon? ReactNode disabled?: boolean className?: string }> | [] |  |
| size | The size of the Segmented. | `large` \| `middle` \| `small` | `middle` |  |
| value | Currently selected value | string \| number |  |  |