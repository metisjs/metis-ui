---
group: 数据录入
title: DatePicker
subtitle: 日期选择框
description: 输入或选择日期的控件。
demo:
  cols: 2
---

## 何时使用

当用户需要输入一个日期，可以点击标准输入框，弹出日期面板进行选择。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/range-picker.tsx">范围选择器</code>
<code src="./demo/multiple.tsx">多选</code>
<code src="./demo/multiple-debug.tsx" debug>多选 Debug</code>
<code src="./demo/need-confirm.tsx">选择确认</code>
<code src="./demo/switchable.tsx">切换不同的选择器</code>
<code src="./demo/format.tsx">日期格式</code>
<code src="./demo/time.tsx">日期时间选择</code>
<code src="./demo/mask.tsx">格式对齐</code>
<code src="./demo/date-range.tsx">日期限定范围</code>
<code src="./demo/disabled.tsx">禁用</code>
<code src="./demo/disabled-date.tsx">不可选择日期和时间</code>
<code src="./demo/allow-empty.tsx">允许留空</code>
<code src="./demo/select-in-range.tsx">选择不超过一定的范围</code>
<code src="./demo/preset-ranges.tsx">预设范围</code>
<code src="./demo/extra-footer.tsx">额外的页脚</code>
<code src="./demo/size.tsx">三种大小</code>
<code src="./demo/cell-render.tsx">定制单元格</code>
<code src="./demo/components.tsx">定制面板</code>
<code src="./demo/buddhist-era.tsx">佛历格式</code>
<code src="./demo/status.tsx">自定义状态</code>
<code src="./demo/variant.tsx">多种形态</code>
<code src="./demo/style-debug.tsx" debug>Style Debug</code>
<code src="./demo/placement.tsx">弹出位置</code>
<code src="./demo/mode.tsx" debug>受控面板</code>
<code src="./demo/start-end.tsx" debug>自定义日期范围选择</code>
<code src="./demo/suffix.tsx" debug>后缀图标</code>

## API

日期类组件包括以下五种形式。

- DatePicker
- DatePicker\[picker="month"]
- DatePicker\[picker="week"]
- DatePicker\[picker="year"]
- DatePicker\[picker="quarter"]
- RangePicker

### 共同的 API

以下 API 为 DatePicker、 RangePicker 共享的 API。

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| allowClear | 自定义清除按钮 | boolean \| { clearIcon?: ReactNode } | true |  |
| autoFocus | 自动获取焦点 | boolean | false |  |
| className | 语义化结构 class | string \| Record<'root' \| 'popup', string> | - |  |
| dateRender | 自定义日期单元格的内容， 起用 `cellRender` 代替 | function(currentDate: dayjs, today: dayjs) => React.ReactNode | - | < |
| cellRender | 自定义单元格的内容 | (current: dayjs, info: { originNode: React.ReactElement,today: DateType, range?: 'start' \| 'end', type: PanelMode, locale?: Locale, subType?: 'hour' \| 'minute' \| 'second' \| 'meridiem' }) => React.ReactNode | - |  |
| components | 自定义面板 | Record<Panel \| 'input', React.ComponentType> | - |  |
| disabled | 禁用 | boolean | false |  |
| disabledDate | 不可选择的日期 | (currentDate: dayjs, info: { from?: dayjs }) => boolean | - |  |
| format | 设置日期格式，为数组时支持多格式匹配，展示以第一个为准。配置参考 [dayjs#format](https://day.js.org/docs/zh-CN/display/format#%E6%94%AF%E6%8C%81%E7%9A%84%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%8D%A0%E4%BD%8D%E7%AC%A6%E5%88%97%E8%A1%A8)。示例：[自定义格式](#date-picker-demo-format) | [FormatType](#formattype) |  |  |
| order | 多选、范围时是否自动排序 | boolean | true |  |
| preserveInvalidOnBlur | 失去焦点是否要清空输入框内无效内容 | boolean | false |  |
| getPopupContainer | 定义浮层的容器，默认为 body 上新建 div | function(trigger) | - |  |
| inputReadOnly | 设置输入框为只读（避免在移动设备上打开虚拟键盘） | boolean | false |  |
| locale | 国际化配置 | object |  |  |
| minDate | 最小日期，同样会限制面板的切换范围 | [DateValue](#datevalue) | - |  |
| maxDate | 最大日期，同样会限制面板的切换范围 | [DateValue](#datevalue) | - |  |
| mode | 日期面板的状态 | `time` \| `date` \| `month` \| `year` \| `decade` | - |  |
| needConfirm | 是否需要确认按钮，为 `false` 时失去焦点即代表选择。当设置 `multiple` 时默认为 `false` | boolean | - |  |
| nextIcon | 自定义下一个图标 | ReactNode | - |  |
| open | 控制弹层是否展开 | boolean | - |  |
| panelRender | 自定义渲染面板 | (panelNode) => ReactNode | - |  |
| picker | 设置选择器类型 | `date` \| `week` \| `month` \| `quarter` \| `year` | `date` |  |
| placeholder | 输入框提示文字 | string \| \[string, string] | - |  |
| placement | 选择框弹出的位置 | `bottomLeft` `bottomRight` `topLeft` `topRight` | bottomLeft |  |
| prevIcon | 自定义上一个图标 | ReactNode | - |  |
| presets | 预设时间范围快捷选择 | { label: React.ReactNode, value: Dayjs \| (() => Dayjs) }\[] | - |  |
| size | 输入框大小 | `large` \| `middle` \| `small` | - |  |
| status | 设置校验状态 | 'error' \| 'warning' | - |  |
| style | 自定义输入框样式 | CSSProperties | {} |  |
| suffixIcon | 自定义的选择框后缀图标 | ReactNode | - |  |
| superNextIcon | 自定义 `>>` 切换图标 | ReactNode | - |  |
| superPrevIcon | 自定义 `<<` 切换图标 | ReactNode | - |  |
| variant | 形态变体 | `outlined` \| `borderless` \| `filled` | `outlined` |  |
| onOpenChange | 弹出日历和关闭日历的回调 | function(open) | - |  |
| onPanelChange | 日历面板切换的回调 | function(value, mode) | - |  |

### 共同的方法

| 名称    | 描述     | 版本 |
| ------- | -------- | ---- |
| blur()  | 移除焦点 |      |
| focus() | 获取焦点 |      |

### DatePicker

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| defaultPickerValue | 默认面板日期，每次面板打开时会被重置到该日期 | [dayjs](https://day.js.org/) | - |  |
| defaultValue | 默认日期，如果开始时间或结束时间为 `null` 或者 `undefined`，日期范围将是一个开区间 | [DateValue](#datevalue) | - |  |
| disabledTime | 不可选择的时间 | function(date) | - |  |
| format | 展示的日期格式，配置参考 [dayjs#format](https://day.js.org/docs/zh-CN/display/format#%E6%94%AF%E6%8C%81%E7%9A%84%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%8D%A0%E4%BD%8D%E7%AC%A6%E5%88%97%E8%A1%A8)。 | [FormatType](#formattype) | `YYYY-MM-DD` |  |
| multiple | 是否为多选，不支持 `showTime` | boolean | false |  |
| pickerValue | 面板日期，可以用于受控切换面板所在日期。配合 `onPanelChange` 使用。 | [dayjs](https://day.js.org/) | - |  |
| renderExtraFooter | 在面板中添加额外的页脚 | (mode) => React.ReactNode | - |  |
| showNow | 显示当前日期时间的快捷选择 | boolean | - |  |
| showTime | 增加时间选择功能 | Object \| boolean | [TimePicker Options](/components/time-picker-cn#api) |  |
| showTime.defaultValue | 设置用户选择日期时默认的时分秒，[例子](#date-picker-demo-disabled-date) | [DateValue](#datevalue) | dayjs() |  |
| showWeek | DatePicker 下展示当前周 | boolean | false |  |
| value | 日期 | [DateValue](#datevalue) | - |  |
| onChange | 时间发生变化的回调 | function(dateString: string, date: dayjs) | - |  |
| onOk | 点击确定按钮的回调 | function() | - |  |
| onPanelChange | 日期面板变化时的回调 | function(value, mode) | - |  |

### DatePicker\[picker=year]

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| defaultValue | 默认日期 | [DateValue](#datevalue) | - |  |
| format | 展示的日期格式，配置参考 [dayjs#format](https://day.js.org/docs/zh-CN/display/format#%E6%94%AF%E6%8C%81%E7%9A%84%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%8D%A0%E4%BD%8D%E7%AC%A6%E5%88%97%E8%A1%A8)。 | [FormatType](#formattype) | `YYYY` |  |
| multiple | 是否为多选 | boolean | false |  |
| renderExtraFooter | 在面板中添加额外的页脚 | () => React.ReactNode | - |  |
| value | 日期 | [DateValue](#datevalue) | - |  |
| onChange | 时间发生变化的回调，发生在用户选择时间时 | function(dateString: string, date: dayjs) | - |  |

### DatePicker\[picker=quarter]

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| defaultValue | 默认日期 | [DateValue](#datevalue) | - |  |
| format | 展示的日期格式，配置参考 [dayjs#format](https://day.js.org/docs/zh-CN/display/format#%E6%94%AF%E6%8C%81%E7%9A%84%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%8D%A0%E4%BD%8D%E7%AC%A6%E5%88%97%E8%A1%A8)。 | [FormatType](#formattype) | `YYYY-\QQ` |  |
| multiple | 是否为多选 | boolean | false |  |
| renderExtraFooter | 在面板中添加额外的页脚 | () => React.ReactNode | - |  |
| value | 日期 | [DateValue](#datevalue) | - |  |
| onChange | 时间发生变化的回调，发生在用户选择时间时 | function(dateString: string, date: dayjs) | - |  |

### DatePicker\[picker=month]

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| defaultValue | 默认日期 | [DateValue](#datevalue) | - |  |
| format | 展示的日期格式，配置参考 [dayjs#format](https://day.js.org/docs/zh-CN/display/format#%E6%94%AF%E6%8C%81%E7%9A%84%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%8D%A0%E4%BD%8D%E7%AC%A6%E5%88%97%E8%A1%A8)。 | [FormatType](#formattype) | `YYYY-MM` |  |
| multiple | 是否为多选 | boolean | false |  |
| renderExtraFooter | 在面板中添加额外的页脚 | () => React.ReactNode | - |  |
| value | 日期 | [DateValue](#datevalue) | - |  |
| onChange | 时间发生变化的回调，发生在用户选择时间时 | function(dateString: string, date: dayjs) | - |  |

### DatePicker\[picker=week]

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| defaultValue | 默认日期 | [DateValue](#datevalue) | - |  |
| format | 展示的日期格式，配置参考 [dayjs#format](https://day.js.org/docs/zh-CN/display/format#%E6%94%AF%E6%8C%81%E7%9A%84%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%8D%A0%E4%BD%8D%E7%AC%A6%E5%88%97%E8%A1%A8)。 | [FormatType](#formattype) | `YYYY-wo` |  |
| multiple | 是否为多选 | boolean | false |  |
| renderExtraFooter | 在面板中添加额外的页脚 | (mode) => React.ReactNode | - |  |
| value | 日期 | [DateValue](#datevalue) | - |  |
| onChange | 时间发生变化的回调，发生在用户选择时间时 | function(dateString: string, date: dayjs) | - |  |

### RangePicker

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| allowEmpty | 允许起始项部分为空 | \[boolean, boolean] | \[false, false] |  |
| cellRender | 自定义单元格的内容。 | (current: dayjs, info: { originNode: React.ReactElement,today: DateType, range?: 'start' \| 'end', type: PanelMode, locale?: Locale, subType?: 'hour' \| 'minute' \| 'second' \| 'meridiem' }) => React.ReactNode | - |  |
| dateRender | 自定义日期单元格的内容， 起用 `cellRender` 代替 | function(currentDate: dayjs, today: dayjs) => React.ReactNode | - |  |
| defaultPickerValue | 默认面板日期，每次面板打开时会被重置到该日期 | [dayjs](https://day.js.org/)[] | - |  |
| defaultValue | 默认日期 | \[[DateValue](#datevalue), [DateValue](#datevalue)] | - |  |
| disabled | 禁用起始项 | \[boolean, boolean] | - |  |
| disabledTime | 不可选择的时间 | function(date: dayjs, partial: `start` \| `end`, info: { from?: dayjs }) | - |  |
| format | 展示的日期格式，配置参考 [dayjs#format](https://day.js.org/docs/zh-CN/display/format#%E6%94%AF%E6%8C%81%E7%9A%84%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%8D%A0%E4%BD%8D%E7%AC%A6%E5%88%97%E8%A1%A8)。 | [FormatType](#formattype) | `YYYY-MM-DD HH:mm:ss` |  |
| id | 设置输入框 `id` 属性。 | { start?: string, end?: string } | - |  |
| pickerValue | 面板日期，可以用于受控切换面板所在日期。配合 `onPanelChange` 使用。 | [dayjs](https://day.js.org/)[] | - |  |
| presets | 预设时间范围快捷选择 | { label: React.ReactNode, value: (Dayjs \| (() => Dayjs))\[] }\[] | - |  |
| renderExtraFooter | 在面板中添加额外的页脚 | () => React.ReactNode | - |  |
| separator | 设置分隔符 | React.ReactNode | `<SwapRightOutlined />` |  |
| showTime | 增加时间选择功能 | Object\|boolean | [TimePicker Options](/components/time-picker-cn#api) |  |
| showTime.defaultValue | 设置用户选择日期时默认的时分秒，[例子](#date-picker-demo-disabled-date) | \[[DateValue](#datevalue), [DateValue](#datevalue)] | \[dayjs(), dayjs()] |  |
| value | 日期 | \[[DateValue](#datevalue), [DateValue](#datevalue)] | - |  |
| onCalendarChange | 待选日期发生变化的回调。`info` 参数自 添加 | function(dateStrings: \[string, string], dates: \[dayjs, dayjs], info: { range:`start`\|`end` }) | - |  |
| onChange | 日期范围发生变化的回调 | function(dateStrings: \[string, string], dates: \[dayjs, dayjs]) | - |  |
| onFocus | 聚焦时回调 | function(event, { range: 'start' \| 'end' }) | - |  |
| onBlur | 失焦时回调 | function(event, { range: 'start' \| 'end' }) | - |  |

#### DateValue

```typescript
import type { Dayjs } from 'dayjs';

/**
 * 日期值类型,支持传入 string 和 number(毫秒) 类型，会自动做一次 dayjs 的转换
 */
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
