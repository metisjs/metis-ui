---
group: Data Entry
title: TimePicker
description: To select/input a time.
demo:
  cols: 2
---

## When To Use

By clicking the input box, you can select a time from a popup panel.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/value.tsx">Under Control</code>
<code src="./demo/size.tsx">Sizes</code>
<code src="./demo/need-confirm.tsx">Need Confirm</code>
<code src="./demo/disabled.tsx">disabled</code>
<code src="./demo/hide-column.tsx">Hour and minute</code>
<code src="./demo/interval-options.tsx">interval option</code>
<code src="./demo/addon.tsx">Addon</code>
<code src="./demo/12hours.tsx">12 hours</code>
<code src="./demo/change-on-scroll.tsx">Change on scroll</code>
<code src="./demo/range-picker.tsx">Time Range Picker</code>
<code src="./demo/variant.tsx">Variants</code>
<code src="./demo/status.tsx">Status</code>
<code src="./demo/suffix.tsx" debug>Suffix</code>

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowClear | Customize clear icon | boolean, { clearIcon?: ReactNode } | true |  |
| autoFocus | If get focus when component mounted | boolean | false |  |
| cellRender | Custom rendering function for picker cells | (current: number, info: { originNode: React.ReactElement, today: dayjs, range?: 'start', 'end', subType: 'hour', 'minute', 'second', 'meridiem' }) => React.ReactNode | - |  |
| changeOnScroll | Trigger selection when scroll the column | boolean | false |  |
| className | Semantic DOM class | [SemanticDOM](#semantic-dom) | - |  |
| defaultValue | To set default time | [DateValue](#datevalue) | - |  |
| disabled | Determine whether the TimePicker is disabled | boolean | false |  |
| disabledTime | To specify the time that cannot be selected | [DisabledTime](#disabledtime) | - |  |
| format | To set the time format | string | `HH:mm:ss` |  |
| getPopupContainer | To set the container of the floating layer, while the default is to create a div element in body | function(trigger) | - |  |
| hideDisabledOptions | Whether hide the options that can not be selected | boolean | false |  |
| hourStep | Interval between hours in picker | number | 1 |  |
| inputReadOnly | Set the `readonly` attribute of the input tag (avoids virtual keyboard on touch devices) | boolean | false |  |
| minuteStep | Interval between minutes in picker | number | 1 |  |
| needConfirm | Need click confirm button to trigger value change | boolean | - |  |
| open | Whether to popup panel | boolean | false |  |
| placeholder | Display when there's no value | string, \[string, string] | `Select a time` |  |
| placement | The position where the selection box pops up | `bottomLeft` `bottomRight` `topLeft` `topRight` | bottomLeft |  |
| renderExtraFooter | Called from time picker panel to render some addon to its bottom | () => ReactNode | - |  |
| secondStep | Interval between seconds in picker | number | 1 |  |
| showNow | Whether to show `Now` button on panel | boolean | - |  |
| size | To determine the size of the input box | `large`, `middle`, `small` | - |  |
| status | Set validation status | 'error', 'warning', 'success', 'validating' | - |  |
| suffixIcon | The custom suffix icon | ReactNode | - |  |
| use12Hours | Display as 12 hours format, with default format `h:mm:ss a` | boolean | false |  |
| value | To set time | [DateValue](#datevalue) | - |  |
| variant | Variants of picker | `outlined`, `borderless`, `filled` | `outlined` |  |
| onChange | A callback function, can be executed when the selected time is changing | function(time: dayjs, timeString: string): void | - |  |
| onOpenChange | A callback function which will be called while panel opening/closing | (open: boolean) => void | - |  |

#### DateValue

```typescript
import type { Dayjs } from 'dayjs';

export type DateValue = Dayjs | string | number;
```

#### DisabledTime

```typescript
type DisabledTime = (now: Dayjs) => {
  disabledHours?: () => number[];
  disabledMinutes?: (selectedHour: number) => number[];
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
  disabledMilliseconds?: (
    selectedHour: number,
    selectedMinute: number,
    selectedSecond: number,
  ) => number[];
};
```

Note: `disabledMilliseconds` is added in \`\`.

## Methods

| Name    | Description  | Version |
| ------- | ------------ | ------- |
| blur()  | Remove focus |         |
| focus() | Get focus    |         |

### RangePicker

Same props from [RangePicker](/components/date-picker/#rangepicker) of DatePicker. And includes additional props:

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| disabledTime | To specify the time that cannot be selected | [RangeDisabledTime](#rangedisabledtime) | - |  |
| order | Order start and end time | boolean | true |  |

### RangeDisabledTime

```typescript
type RangeDisabledTime = (
  now: Dayjs,
  type = 'start' | 'end',
) => {
  disabledHours?: () => number[];
  disabledMinutes?: (selectedHour: number) => number[];
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[];
};
```

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>
