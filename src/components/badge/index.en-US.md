---
title: Badge
description: Small numerical value or status descriptor for UI elements.
group: Data Display
demo:
  cols: 2
---

## When To Use

Badge normally appears in proximity to notifications or user avatars with eye-catching appeal, typically displaying unread messages count.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/no-wrapper.tsx">Standalone</code>
<code src="./demo/overflow.tsx">Overflow Count</code>
<code src="./demo/dot.tsx">Red badge</code>
<code src="./demo/change.tsx">Dynamic</code>
<code src="./demo/link.tsx">Clickable</code>
<code src="./demo/offset.tsx">Offset</code>
<code src="./demo/size.tsx">Size</code>
<code src="./demo/status.tsx">Status</code>
<code src="./demo/colorful.tsx">Colorful Badge</code>
<code src="./demo/ribbon.tsx">Ribbon</code>
<code src="./demo/ribbon-debug.tsx" debug>Ribbon Debug</code>
<code src="./demo/mix.tsx" debug>Mixed usage</code>
<code src="./demo/title.tsx" debug>Title</code>

## API

### Badge

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| className | Semantic DOM class | [SemanticDOM](#badge-1) | - |  |
| color | Customize Badge dot color | string | - |  |
| count | Number to show in badge | ReactNode | - |  |
| dot | Whether to display a red dot instead of `count` | boolean | false |  |
| offset | Set offset of the badge dot | \[number, number] | - |  |
| overflowCount | Max count to show | number | 99 |  |
| showZero | Whether to show badge when `count` is zero | boolean | false |  |
| size | If `count` is set, `size` sets the size of badge | `default`, `small` | - | - |
| status | Set Badge as a status dot | `success`, `processing`, `default`, `error`, `warning` | - |  |
| styles | Semantic DOM style | [Record&lt;SemanticDOM, CSSProperties>](#semantic-dom) | - |  |
| text | If `status` is set, `text` sets the display text of the status `dot` | ReactNode | - |  |
| title | Text to show when hovering over the badge | string | - |  |

### Badge.Ribbon

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| className | Semantic DOM class | [SemanticDOM](#badgeribbon-1) | - |  |
| color | Customize Ribbon color | string | - |  |
| placement | The placement of the Ribbon, `start` and `end` follow text direction (RTL or LTR) | `start`, `end` | `end` |  |
| text | Content inside the Ribbon | ReactNode | - |  |

## Semantic DOM

### Badge

<code src="./demo/_semantic_basic.tsx" simplify></code>

### Badge.Ribbon

<code src="./demo/_semantic_ribbon.tsx" simplify></code>
