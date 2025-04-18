---
title: Progress
description: Display the current progress of the operation.
group: Feedback
demo:
  cols: 2
---

## When To Use

If it will take a long time to complete an operation, you can use `Progress` to show the current progress and status.

- When an operation will interrupt the current interface, or it needs to run in the background for more than 2 seconds.
- When you need to display the completion percentage of an operation.

## Examples

<!-- prettier-ignore -->
<code src="./demo/line.tsx">Progress bar</code>
<code src="./demo/circle.tsx">Circular progress bar</code>
<code src="./demo/line-mini.tsx">Mini size progress bar</code>
<code src="./demo/circle-micro.tsx">Responsive circular progress bar</code>
<code src="./demo/circle-mini.tsx">Mini size circular progress bar</code>
<code src="./demo/dynamic.tsx">Dynamic</code>
<code src="./demo/format.tsx">Custom text format</code>
<code src="./demo/dashboard.tsx">Dashboard</code>
<code src="./demo/segment.tsx">Progress bar with success segment</code>
<code src="./demo/linecap.tsx">Stroke Linecap</code>
<code src="./demo/gradient-line.tsx">Custom line gradient</code>
<code src="./demo/steps.tsx">Progress bar with steps</code>
<code src="./demo/circle-steps.tsx">Circular progress bar whit steps</code>
<code src="./demo/size.tsx">Progress size</code>
<code src="./demo/info-position.tsx">Change progress value position</code>

## API

Properties that shared by all types.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| className | Semantic DOM class | [SemanticDOM](#semantic-dom) | - |  |
| format | The template function of the content | function(percent, successPercent) | (percent) => percent + `%` | - |
| percent | To set the completion percentage | number | 0 | - |
| showInfo | Whether to display the progress value and the status icon | boolean | true |  |
| size | Progress size | number, \[number, string, number], { width: number, height: number }, "small", "default" | "default" |  |
| status | To set the status of the Progress, options: `success` `exception` `normal` `active`(line only) | string | - |  |
| strokeColor | The color of progress bar | string | - | - |
| strokeLinecap | To set the style of the progress linecap | `round`, `butt`, `square`, see [strokeLinecap](https://developer.mozilla.org/docs/Web/SVG/Attribute/strokeLinecap) | `round` | - |
| success | Configs of successfully progress bar | { percent: number, strokeColor: string } | - | - |
| trailColor | The color of unfilled part | string | - | - |
| type | To set the type, options: `line` `circle` `dashboard` | string | `line` |  |

### `type="line"`

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| percentPosition | Progress value position, passed in object, `align` indicates the horizontal position of the value, `type` indicates whether the value is inside or outside the progress bar | { align: string; type: string } | { align: \\"end\\", type: \\"outer\\" } |  |
| steps | The total step count | number | - | - |
| strokeColor | The color of progress bar, render `linear-gradient` when passing an object, could accept `string[]` when has `steps`. | string, string\[], { from: string; to: string; direction: string } | - | : `string[]` |

### `type="circle"`

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| steps | The total step count.When passing an object, `count` refers to the number of steps, and `gap` refers to the distance between them.When passing number, the default value for `gap` is 2. | number, { count: number, gap: number } | - |  |
| strokeColor | The color of circular progress, render gradient when passing an object | string, { number%: string } | - | - |
| strokeWidth | To set the width of the circular progress, unit: percentage of the canvas width | number | 6 | - |

### `type="dashboard"`

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| gapDegree | The gap degree of half circle, 0 ~ 295 | number | 75 |  |
| gapPosition | The gap position, options: `top` `bottom` `left` `right` | string | `bottom` |  |
| steps | The total step count.When passing an object, `count` refers to the number of steps, and `gap` refers to the distance between them.When passing number, the default value for `gap` is 2. | number, { count: number, gap: number } | - |  |
| strokeWidth | To set the width of the dashboard progress, unit: percentage of the canvas width | number | 6 |  |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>
