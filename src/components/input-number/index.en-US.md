---
group: Data Entry
title: InputNumber
description: Enter a number within certain range with the mouse or keyboard.
demo:
  cols: 2
---

## When To Use

When a numeric value needs to be provided.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/size.tsx">Sizes</code>
<code src="./demo/addon.tsx">Pre / Post tab</code>
<code src="./demo/disabled.tsx">Disabled</code>
<code src="./demo/digit.tsx">High precision decimals</code>
<code src="./demo/formatter.tsx">Formatter</code>
<code src="./demo/keyboard.tsx">Keyboard</code>
<code src="./demo/change-on-wheel.tsx">Wheel</code>
<code src="./demo/variant.tsx">Variants</code>
<code src="./demo/out-of-range.tsx">Out of range</code>
<code src="./demo/prefix.tsx">Prefix</code>
<code src="./demo/status.tsx">Status</code>
<code src="./demo/controls.tsx" debug>Icon</code>
<code src="./demo/styles-debug.tsx" debug>Styles Debug</code>

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| addonAfter | The label text displayed after (on the right side of) the input field | ReactNode | - |  |
| addonBefore | The label text displayed before (on the left side of) the input field | ReactNode | - |  |
| autoFocus | If get focus when component mounted | boolean | false | - |
| changeOnBlur | Trigger `onChange` when blur. e.g. reset value in range by blur | boolean | true |  |
| changeOnWheel | Allow control with mouse wheel | boolean | - |  |
| className | Semantic DOM class | [SemanticDOM](#semantic-dom) | - |  |
| controls | Whether to show `+-` controls, or set custom arrows icon | boolean \| { upIcon?: React.ReactNode; downIcon?: React.ReactNode; } | - |  |
| decimalSeparator | Decimal separator | string | - | - |
| defaultValue | The initial value | number | - | - |
| disabled | If disable the input | boolean | false | - |
| formatter | Specifies the format of the value presented | function(value: number \| string, info: { userTyping: boolean, input: string }): string | - | info: |
| keyboard | If enable keyboard behavior | boolean | true |  |
| max | The max value | number | [Number.MAX_SAFE_INTEGER](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER) | - |
| min | The min value | number | [Number.MIN_SAFE_INTEGER](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_SAFE_INTEGER) | - |
| parser | Specifies the value extracted from formatter | function(string): number | - | - |
| placeholder | placeholder | string | - |  |
| precision | The precision of input value. Will use `formatter` when config of `formatter` | number | - | - |
| prefix | The prefix icon for the Input | ReactNode | - |  |
| readOnly | If readonly the input | boolean | false | - |
| size | The height of input box | `large` \| `middle` \| `small` | - | - |
| status | Set validation status | 'error' \| 'warning' | - |  |
| step | The number to which the current value is increased or decreased. It can be an integer or decimal | number \| string | 1 | - |
| stringMode | Set value as string to support high precision decimals. Will return string value by `onChange` | boolean | false |  |
| value | The current value | number | - | - |
| variant | Variants of Input | `outlined` \| `borderless` \| `filled` | `outlined` |  |
| onChange | The callback triggered when the value is changed | function(value: number \| string \| null) | - | - |
| onPressEnter | The callback function that is triggered when Enter key is pressed | function(e) | - | - |
| onStep | The callback function that is triggered when click up or down buttons | (value: number, info: { offset: number, type: 'up' \| 'down' }) => void | - |  |

## Ref

| Name          | Description            | Version |
| ------------- | ---------------------- | ------- |
| blur()        | Remove focus           |         |
| focus()       | Get focus              |         |
| nativeElement | The native DOM element |         |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>

## FAQ

### Why `value` can exceed `min` or `max` in control?

Developer handle data by their own in control. It will make data out of sync if InputNumber change display value. It also cause potential data issues when use in form.

### Why dynamic change `min` or `max` which makes `value` out of range will not trigger `onChange`?

`onChange` is user trigger event. Auto trigger will makes form lib can not detect data modify source.

### Why `onBlur` or other event can not get correct value?

InputNumber's value is wrapped by internal logic. The `event.target.value` you get from `onBlur` or other event is the DOM element's `value` instead of the actual value of InputNumber. For example, if you change the display format through `formatter` or `decimalSeparator`, you will get the formatted string in the DOM. You should always get the current value through `onChange`.

### Why `changeOnWheel` unable to control whether the mouse scroll wheel changes value?

> The use of the `type` attribute is deprecated

The InputNumber component allows you to use all the attributes of the input element and ultimately pass them to the input element, This attribute will also be added to the input element when you pass in `type='number'`, which will cause the input element to trigger native properties (allowing the mouse wheel to change the value), As a result `changeOnWheel` cannot control whether the mouse wheel changes the value.
