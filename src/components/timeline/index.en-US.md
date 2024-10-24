---
group: Data Display
title: Timeline
description: Vertical display timeline.
demo:
  cols: 2
---

## When To Use

- When a series of information needs to be ordered by time (ascending or descending).
- When you need a timeline to make a visual connection.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/color.tsx">Color</code>
<code src="./demo/pending.tsx">Last node and Reversing</code>
<code src="./demo/alternate.tsx">Alternate</code>
<code src="./demo/custom.tsx">Custom</code>
<code src="./demo/right.tsx">Right alternate</code>
<code src="./demo/label.tsx">Label</code>

## API

### Timeline

| Property | Description | Type | Default |
| --- | --- | --- | --- | --- |
| mode | By sending `alternate` the timeline will distribute the nodes to the left and right | `left` \| `alternate` \| `right` | - |
| pending | Set the last ghost node's existence or its content | ReactNode | false |
| pendingDot | Set the dot of the last ghost node when pending is true | ReactNode | &lt;LoadingOutline /&gt; |
| reverse | Whether reverse nodes or not | boolean | false |
| items | Each node of timeline | [Items](#Items)[] |  |
| className | Semantic DOM class | [SemanticClassName](/docs/semantic-classname) | - |  |

### Items

Node of timeline.

| Property | Description | Type | Default |
| --- | --- | --- | --- | --- |
| color | Set the circle's color to `blue`, `red`, `green` or other custom colors | string | `blue` |
| dot | Customize timeline dot | ReactNode | - |
| label | Set the label | ReactNode | - |
| content | Set the content | ReactNode | - |
| className | Semantic DOM class | [SemanticClassName](/docs/semantic-classname) | - |  |
