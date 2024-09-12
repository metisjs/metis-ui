---
category: Components
group: Data Entry
title: Mentions
description: Used to mention someone or something in an input.
cover: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*e4bXT7Uhi9YAAAAAAAAAAAAADrJ8AQ/original
coverDark: https://mdn.alipayobjects.com/huamei_7uahnr/afts/img/A*pxR2S53P_xoAAAAAAAAAAAAADrJ8AQ/original
demo:
  cols: 2
---

## When To Use

When you need to mention someone or something.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/variant.tsx">Variants</code>
<code src="./demo/async.tsx">Asynchronous loading</code>
<code src="./demo/form.tsx">With Form</code>
<code src="./demo/prefix.tsx">Customize Trigger Token</code>
<code src="./demo/readonly.tsx">disabled or readOnly</code>
<code src="./demo/placement.tsx">Placement</code>
<code src="./demo/allow-clear.tsx">With clear icon</code>
<code src="./demo/auto-size.tsx">autoSize</code>
<code src="./demo/status.tsx">Status</code>

## API

### Mention

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowClear | If allow to remove mentions content with clear icon | boolean \| { clearIcon?: ReactNode } | false |  |
| autoFocus | Auto get focus when component mounted | boolean | false |  |
| autoSize | Textarea height autosize feature, can be set to true \| false or an object { minRows: 2, maxRows: 6 } | boolean \| object | false |  |
| defaultValue | Default value | string | - |  |
| filterOption | Customize filter option logic | false \| (input: string, option: OptionProps) => boolean | - |  |
| getPopupContainer | Set the mount HTML node for suggestions | () => HTMLElement | - |  |
| notFoundContent | Set mentions content when not match | ReactNode | `Not Found` |  |
| placement | Set popup placement | `top` \| `bottom` | `bottom` |  |
| prefix | Set trigger prefix keyword | string \| string\[] | `@` |  |
| split | Set split string before and after selected mention | string | ` ` |  |
| status | Set validation status | 'error' \| 'warning' \| 'success' \| 'validating' | - |  |
| validateSearch | Customize trigger search logic | (text: string, props: MentionsProps) => void | - |  |
| value | Set value of mentions | string | - |  |
| variant | Variants of Input | `outlined` \| `borderless` \| `filled` | `outlined` |  |
| onBlur | Trigger when mentions lose focus | () => void | - |  |
| onChange | Trigger when value changed | (text: string) => void | - |  |
| onClear | Callback when click the clear button | () => void | - |  |
| onFocus | Trigger when mentions get focus | () => void | - |  |
| onResize | The callback function that is triggered when textarea resize | function({ width, height }) | - |  |
| onSearch | Trigger when prefix hit | (text: string, prefix: string) => void | - |  |
| onSelect | Trigger when user select the option | (option: OptionProps, prefix: string) => void | - |  |
| options | Option Configuration | [Options](#option) | \[] |  |
| className | Semantic DOM class | string \| Record<'root' \| 'textarea' \| 'popup', string> | - |  |

### Mention methods

| Name    | Description  |
| ------- | ------------ |
| blur()  | Remove focus |
| focus() | Get focus    |

### Option

<!-- prettier-ignore -->
| Property | Description | Type | Default |
| --- | --- | --- | --- |
| label | Title of the option | React.ReactNode | - |
| key | The key value of the option | string | - |
| disabled | Optional | boolean | - |
| className | className | string | - |
| style | The style of the option | React.CSSProperties | - |

### Mention.getMentions

```tsx
interface MentionsConfig {
  prefix?: string | string[];
  split?: string;
}

interface MentionsEntity {
  prefix: string;
  value: string;
}

type getMentions: (value: string, config?: MentionsConfig) => MentionsEntity[];
```
