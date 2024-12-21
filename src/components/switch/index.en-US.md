---
title: Switch
description: Switching Selector.
group: Data Entry
demo:
  cols: 2
---

## When To Use

- If you need to represent the switching between two states or on-off state.
- The difference between `Switch` and `Checkbox` is that `Switch` will trigger a state change directly when you toggle it, while `Checkbox` is generally used for state marking, which should work in conjunction with submit operation.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/disabled.tsx">Disabled</code>
<code src="./demo/text.tsx">Text & icon</code>
<code src="./demo/size.tsx">Two sizes</code>
<code src="./demo/loading.tsx">Loading</code>

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| autoFocus | Whether get focus when component mounted | boolean | false |  |
| checked | Determine whether the Switch is checked | boolean | false |  |
| checkedChildren | The content to be shown when the state is checked | ReactNode | - |  |
| className | Semantic DOM class | [SemanticDOM](#semantic-dom) | - |  |
| defaultChecked | Whether to set the initial state | boolean | false |  |
| defaultValue | Alias for `defaultChecked` | boolean | - |  |
| disabled | Disable switch | boolean | false |  |
| loading | Loading state of switch | boolean | false |  |
| size | The size of the Switch, options: `default` `small` | string | `default` |  |
| unCheckedChildren | The content to be shown when the state is unchecked | ReactNode | - |  |
| value | Alias for `checked` | boolean | - |  |
| onChange | Trigger when the checked state is changing | function(checked: boolean, event: Event) | - |  |
| onClick | Trigger when clicked | function(checked: boolean, event: Event) | - |  |

## Methods

| Name    | Description  |
| ------- | ------------ |
| blur()  | Remove focus |
| focus() | Get focus    |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>
