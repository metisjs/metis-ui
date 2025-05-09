---
group: Data Entry
title: Rate
description: Used for rating operation on something.
demo:
  cols: 2
---

## When To Use

- Show evaluation.
- A quick rating operation on something.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/half.tsx">Half star</code>
<code src="./demo/text.tsx">Show copywriting</code>
<code src="./demo/disabled.tsx">Read only</code>
<code src="./demo/clear.tsx">Clear star</code>
<code src="./demo/character.tsx">Other Character</code>
<code src="./demo/character-function.tsx">Customize character</code>

## API

| Property | Description | type | Default | Version |
| --- | --- | --- | --- | --- |
| allowClear | Whether to allow clear when click again | boolean | true |  |
| allowHalf | Whether to allow semi selection | boolean | false |  |
| autoFocus | If get focus when component mounted | boolean | false |  |
| character | The custom character of rate | ReactNode, (RateProps) => ReactNode | &lt;StarSolid /> |  |
| className | Semantic DOM class | [SemanticDOM](#semantic-dom) | - |  |
| count | Star count | number | 5 |  |
| defaultValue | The default value | number | 0 |  |
| disabled | If read only, unable to interact | boolean | false |  |
| keyboard | Support keyboard operation | boolean | true |  |
| style | The custom style object of rate | CSSProperties | - |  |
| tooltips | Customize tooltip by each character | string\[] | - |  |
| value | The current value | number | - |  |
| onBlur | Callback when component lose focus | function() | - |  |
| onChange | Callback when select value | function(value: number) | - |  |
| onFocus | Callback when component get focus | function() | - |  |
| onHoverChange | Callback when hover item | function(value: number) | - |  |
| onKeyDown | Callback when keydown on component | function(event) | - |  |

## Methods

| Name    | Description  |
| ------- | ------------ |
| blur()  | Remove focus |
| focus() | Get focus    |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>
