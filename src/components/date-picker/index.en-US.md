---
group: Data Entry
title: DatePicker
description: To select or input a date.
demo:
  cols: 2
---

## When To Use

By clicking the input box, you can select a date from a popup calendar.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/range-picker.tsx">Range Picker</code>
<code src="./demo/multiple.tsx">Multiple</code>
<code src="./demo/multiple-debug.tsx" debug>Multiple Debug</code>
<code src="./demo/need-confirm.tsx">Need Confirm</code>
<code src="./demo/switchable.tsx">Switchable picker</code>
<code src="./demo/format.tsx">Date Format</code>
<code src="./demo/time.tsx">Choose Time</code>
<code src="./demo/mask.tsx">Mask Format</code>
<code src="./demo/date-range.tsx">Limit Date Range</code>
<code src="./demo/disabled.tsx">Disabled</code>
<code src="./demo/disabled-date.tsx">Disabled Date & Time</code>
<code src="./demo/allow-empty.tsx">Allow Empty</code>
<code src="./demo/select-in-range.tsx">Select range dates</code>
<code src="./demo/preset-ranges.tsx">Preset Ranges</code>
<code src="./demo/extra-footer.tsx">Extra Footer</code>
<code src="./demo/size.tsx">Three Sizes</code>
<code src="./demo/cell-render.tsx">Customized Cell Rendering</code>
<code src="./demo/components.tsx">Customize Panel</code>
<code src="./demo/buddhist-era.tsx">Buddhist Era</code>
<code src="./demo/status.tsx">Status</code>
<code src="./demo/variant.tsx">Variants</code>
<code src="./demo/style-debug.tsx" debug>Style Debug</code>
<code src="./demo/placement.tsx">Placement</code>
<code src="./demo/mode.tsx" debug>Controlled Panels</code>
<code src="./demo/start-end.tsx" debug>Customized Range Picker</code>
<code src="./demo/suffix.tsx" debug>Suffix</code>

## API

There are five kinds of picker:

- DatePicker
- DatePicker\[picker="month"]
- DatePicker\[picker="week"]
- DatePicker\[picker="year"]
- DatePicker\[picker="quarter"] (Added in )
- RangePicker

### Common API

The following APIs are shared by DatePicker, RangePicker.

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowClear | Customize clear button | boolean \| { clearIcon?: ReactNode } | true |  |
| autoFocus | If get focus when component mounted | boolean | false |  |
| cellRender | Custom rendering function for picker cells | (current: dayjs, info: { originNode: React.ReactElement,today: DateType, range?: 'start' \| 'end', type: PanelMode, locale?: Locale, subType?: 'hour' \| 'minute' \| 'second' \| 'meridiem' }) => React.ReactNode | - |  |
| className | Semantic DOM class class | string \| Record&lt;'root' \| 'popup', string> | - |  |
| components | Custom panels | Record&lt;Panel \| 'input', React.ComponentType> | - |  |
| dateRender | Custom rendering function for date cells, >= use `cellRender` instead. | function(currentDate: dayjs, today: dayjs) => React.ReactNode | - | &lt; |
| disabled | Determine whether the DatePicker is disabled | boolean | false |  |
| disabledDate | Specify the date that cannot be selected | (currentDate: dayjs, info: { from?: dayjs }) => boolean | - |  |
| format | To set the date format, support multi-format matching when it is an array, display the first one shall prevail. refer to [dayjs#format](https://day.js.org/docs/en/display/format). for example: [Custom Format](#date-picker-demo-format) | [FormatType](#formattype) |  |  |
| getPopupContainer | To set the container of the floating layer, while the default is to create a `div` element in `body` | function(trigger) | - |  |
| inputReadOnly | Set the `readonly` attribute of the input tag (avoids virtual keyboard on touch devices) | boolean | false |  |
| locale | Localization configuration | object |  |  |
| maxDate | The maximum date, which also limits the range of panel switching | [DateValue](#datevalue) | - |  |
| minDate | The minimum date, which also limits the range of panel switching | [DateValue](#datevalue) | - |  |
| mode | The picker panel mode | `time` \| `date` \| `month` \| `year` \| `decade` | - |  |
| needConfirm | Need click confirm button to trigger value change. Default `false` when `multiple` | boolean | - |  |
| nextIcon | The custom next icon | ReactNode | - |  |
| open | The open state of picker | boolean | - |  |
| order | Auto order date when multiple or range selection | boolean | true |  |
| panelRender | Customize panel render | (panelNode) => ReactNode | - |  |
| picker | Set picker type | `date` \| `week` \| `month` \| `quarter` \| `year` | `date` |  |
| placeholder | The placeholder of date input | string \| \[string,string] | - |  |
| placement | The position where the selection box pops up | `bottomLeft` `bottomRight` `topLeft` `topRight` | bottomLeft |  |
| preserveInvalidOnBlur | Not clean input on blur even when the typing is invalidate | boolean | false |  |
| presets | The preset ranges for quick selection. | { label: React.ReactNode, value: Dayjs \| (() => Dayjs) }\[] | - |  |
| prevIcon | The custom prev icon | ReactNode | - |  |
| size | To determine the size of the input box | `large` \| `middle` \| `small` | - |  |
| status | Set validation status | 'error' \| 'warning' | - |  |
| style | To customize the style of the input box | CSSProperties | {} |  |
| suffixIcon | The custom suffix icon | ReactNode | - |  |
| superNextIcon | The custom super next icon | ReactNode | - |  |
| superPrevIcon | The custom super prev icon | ReactNode | - |  |
| variant | Variants of picker | `outlined` \| `borderless` \| `filled` | `outlined` |  |
| onOpenChange | Callback function, can be executed whether the popup calendar is popped up or closed | function(open) | - |  |
| onPanelChange | Callback when picker panel mode is changed | function(value, mode) | - |  |

### Common Methods

| Name    | Description  | Version |
| ------- | ------------ | ------- |
| blur()  | Remove focus |         |
| focus() | Get focus    |         |

### DatePicker

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| defaultPickerValue | Default panel date, will be reset when panel open | [dayjs](https://day.js.org/) | - |  |
| defaultValue | To set default date, if start time or end time is null or undefined, the date range will be an open interval | [DateValue](#datevalue) | - |  |
| disabledTime | To specify the time that cannot be selected | function(date) | - |  |
| format | To set the date format. refer to [dayjs#format](https://day.js.org/docs/en/display/format) | [FormatType](#formattype) | `YYYY-MM-DD` |  |
| multiple | Enable multiple selection. Not support `showTime` | boolean | false |  |
| pickerValue | Panel date. Used for controlled switching of panel date. Work with `onPanelChange` | [dayjs](https://day.js.org/) | - |  |
| renderExtraFooter | Render extra footer in panel | (mode) => React.ReactNode | - |  |
| showNow | Show the fast access of current datetime | boolean | - |  |
| showTime | To provide an additional time selection | object \| boolean | [TimePicker Options](/components/time-picker/#api) |  |
| showTime.defaultValue | To set default time of selected date, [demo](#date-picker-demo-disabled-date) | [DateValue](#datevalue) | dayjs() |  |
| showWeek | Show week info when in DatePicker | boolean | false |  |
| value | To set date | [DateValue](#datevalue) | - |  |
| onChange | Callback function, can be executed when the selected time is changing | function(dateString: string, date: dayjs) | - |  |
| onOk | Callback when click ok button | function() | - |  |
| onPanelChange | Callback function for panel changing | function(value, mode) | - |  |

### DatePicker\[picker=year]

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| defaultValue | To set default date | [DateValue](#datevalue) | - |  |
| format | To set the date format. refer to [dayjs#format](https://day.js.org/docs/en/display/format) | [FormatType](#formattype) | `YYYY` |  |
| multiple | Enable multiple selection | boolean | false |  |
| renderExtraFooter | Render extra footer in panel | () => React.ReactNode | - |  |
| value | To set date | [DateValue](#datevalue) | - |  |
| onChange | Callback function, can be executed when the selected time is changing | function(dateString: string, date: dayjs) | - |  |

### DatePicker\[picker=quarter]

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| defaultValue | To set default date | [DateValue](#datevalue) | - |  |
| format | To set the date format. refer to [dayjs#format](https://day.js.org/docs/en/display/format) | [FormatType](#formattype) | `YYYY-\QQ` |  |
| multiple | Enable multiple selection | boolean | false |  |
| renderExtraFooter | Render extra footer in panel | () => React.ReactNode | - |  |
| value | To set date | [DateValue](#datevalue) | - |  |
| onChange | Callback function, can be executed when the selected time is changing | function(dateString: string, date: dayjs) | - |  |

### DatePicker\[picker=month]

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| defaultValue | To set default date | [DateValue](#datevalue) | - |  |
| format | To set the date format. refer to [dayjs#format](https://day.js.org/docs/en/display/format) | [FormatType](#formattype) | `YYYY-MM` |  |
| multiple | Enable multiple selection | boolean | false |  |
| renderExtraFooter | Render extra footer in panel | () => React.ReactNode | - |  |
| value | To set date | [DateValue](#datevalue) | - |  |
| onChange | Callback function, can be executed when the selected time is changing | function(dateString: string, date: dayjs) | - |  |

### DatePicker\[picker=week]

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| defaultValue | To set default date | [DateValue](#datevalue) | - |  |
| format | To set the date format. refer to [dayjs#format](https://day.js.org/docs/en/display/format) | [FormatType](#formattype) | `YYYY-wo` |  |
| multiple | Enable multiple selection | boolean | false |  |
| renderExtraFooter | Render extra footer in panel | (mode) => React.ReactNode | - |  |
| value | To set date | [DateValue](#datevalue) | - |  |
| onChange | Callback function, can be executed when the selected time is changing | function(dateString: string, date: dayjs) | - |  |

### RangePicker

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| allowEmpty | Allow start or end input leave empty | \[boolean, boolean] | \[false, false] |  |
| cellRender | Custom rendering function for picker cells | (current: dayjs, info: { originNode: React.ReactElement,today: DateType, range?: 'start' \| 'end', type: PanelMode, locale?: Locale, subType?: 'hour' \| 'minute' \| 'second' \| 'meridiem' }) => React.ReactNode | - |  |
| dateRender | Custom rendering function for date cells, >= use `cellRender` instead. | function(currentDate: dayjs, today: dayjs) => React.ReactNode | - |  |
| defaultPickerValue | Default panel date, will be reset when panel open | [dayjs](https://day.js.org/) | - |  |
| defaultValue | To set default date | \[[DateValue](#datevalue), [DateValue](#datevalue)] | - |  |
| disabled | If disable start or end | \[boolean, boolean] | - |  |
| disabledTime | To specify the time that cannot be selected | function(date: dayjs, partial: `start` \| `end`, info: { from?: dayjs }) | - |  |
| format | To set the date format. refer to [dayjs#format](https://day.js.org/docs/en/display/format) | [FormatType](#formattype) | `YYYY-MM-DD HH:mm:ss` |  |
| id | Config input ids | { start?: string, end?: string } | - |  |
| pickerValue | Panel date. Used for controlled switching of panel date. Work with `onPanelChange` | [dayjs](https://day.js.org/) | - |  |
| presets | The preset ranges for quick selection. | { label: React.ReactNode, value: (Dayjs \| (() => Dayjs))\[] }\[] | - |  |
| renderExtraFooter | Render extra footer in panel | () => React.ReactNode | - |  |
| separator | Set separator between inputs | React.ReactNode | `<SwapRightOutlined />` |  |
| showTime | To provide an additional time selection | object \| boolean | [TimePicker Options](/components/time-picker/#api) |  |
| showTime.defaultValue | To set default time of selected date, [demo](#date-picker-demo-disabled-date) | \[[DateValue](#datevalue), [DateValue](#datevalue)] | \[dayjs(), dayjs()] |  |
| value | To set date | \[[DateValue](#datevalue), [DateValue](#datevalue)] | - |  |
| onBlur | Trigger when lose focus | function(event, { range: 'start' \| 'end' }) | - |  |
| onCalendarChange | Callback function, can be executed when the start time or the end time of the range is changing. `info` argument is added in | function(dateStrings: \[string, string], dates: \[dayjs, dayjs], info: { range:`start`\|`end` }) | - |  |
| onChange | Callback function, can be executed when the selected time is changing | function(dateStrings: \[string, string], dates: \[dayjs, dayjs]) | - |  |
| onFocus | Trigger when get focus | function(event, { range: 'start' \| 'end' }) | - |  |

#### DateValue

```typescript
import type { Dayjs } from 'dayjs';

export type DateValue = Dayjs | string | number;
```

#### FormatType

```typescript
import type { Dayjs } from 'dayjs';

type Generic = string;
type GenericFn = (value: Dayjs) => string;

export type FormatType =
  | Generic
  | GenericFn
  | Array<Generic | GenericFn>
  | {
      format: string;
      type?: 'mask';
    };
```
