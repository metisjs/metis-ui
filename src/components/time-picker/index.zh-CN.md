---
group: 数据录入
title: TimePicker
subtitle: 时间选择框
description: 输入或选择时间的控件。
demo:
  cols: 2
---

## 何时使用

当用户需要输入一个时间，可以点击标准输入框，弹出时间面板进行选择。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/value.tsx">受控组件</code>
<code src="./demo/size.tsx">四种大小</code>
<code src="./demo/need-confirm.tsx">选择确认</code>
<code src="./demo/disabled.tsx">禁用</code>
<code src="./demo/hide-column.tsx">选择时分</code>
<code src="./demo/interval-options.tsx">步长选项</code>
<code src="./demo/addon.tsx">附加内容</code>
<code src="./demo/12hours.tsx">12 小时制</code>
<code src="./demo/change-on-scroll.tsx">滚动即改变</code>
<code src="./demo/range-picker.tsx">范围选择器</code>
<code src="./demo/variant.tsx">多种形态</code>
<code src="./demo/status.tsx">自定义状态</code>
<code src="./demo/suffix.tsx" debug>后缀图标</code>

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| allowClear | 自定义清除按钮 | boolean、 { clearIcon?: ReactNode } | true |  |
| autoFocus | 自动获取焦点 | boolean | false |  |
| cellRender | 自定义单元格的内容 | (current: number, info: { originNode: React.ReactNode, today: dayjs, range?: 'start'、 'end', subType: 'hour'、 'minute'、 'second'、 'meridiem' }) => React.ReactNode | - |  |
| changeOnScroll | 在滚动时改变选择值 | boolean | false |  |
| className | 语义化结构 class | [SemanticDOM](#semantic-dom) | - |  |
| defaultValue | 默认时间 | [DateValue](#datevalue) | - |  |
| disabled | 禁用全部操作 | boolean | false |  |
| disabledTime | 不可选择的时间 | [DisabledTime](#disabledtime) | - |  |
| format | 展示的时间格式 | string | `HH:mm:ss` |  |
| getPopupContainer | 定义浮层的容器，默认为 body 上新建 div | function(trigger) | - |  |
| hideDisabledOptions | 隐藏禁止选择的选项 | boolean | false |  |
| hourStep | 小时选项间隔 | number | 1 |  |
| inputReadOnly | 设置输入框为只读（避免在移动设备上打开虚拟键盘） | boolean | false |  |
| minuteStep | 分钟选项间隔 | number | 1 |  |
| needConfirm | 是否需要确认按钮，为 `false` 时失去焦点即代表选择 | boolean | - |  |
| open | 面板是否打开 | boolean | false |  |
| placeholder | 没有值的时候显示的内容 | string、 \[string, string] | `请选择时间` |  |
| placement | 选择框弹出的位置 | `bottomLeft` `bottomRight` `topLeft` `topRight` | bottomLeft |  |
| renderExtraFooter | 选择框底部显示自定义的内容 | () => ReactNode | - |  |
| secondStep | 秒选项间隔 | number | 1 |  |
| showNow | 面板是否显示“此刻”按钮 | boolean | - |  |
| size | 输入框大小 | `large`、 `middle`、 `small` | - |  |
| status | 设置校验状态 | 'error'、 'warning' | - |  |
| suffixIcon | 自定义的选择框后缀图标 | ReactNode | - |  |
| use12Hours | 使用 12 小时制，为 true 时 `format` 默认为 `h:mm:ss a` | boolean | false |  |
| value | 当前时间 | [DateValue](#datevalue) | - |  |
| variant | 形态变体 | `outlined`、 `borderless`、 `filled` | `outlined` |  |
| onChange | 时间发生变化的回调 | function(timeString: string, time: dayjs): void | - |  |
| onOpenChange | 面板打开/关闭时的回调 | (open: boolean) => void | - |  |

#### DateValue

```typescript
import type { Dayjs } from 'dayjs';

/**
 * 日期值类型,支持传入 string 和 number(毫秒) 类型，会自动做一次 dayjs 的转换
 */
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

## 方法

| 名称    | 描述     | 版本 |
| ------- | -------- | ---- |
| blur()  | 移除焦点 |      |
| focus() | 获取焦点 |      |

## RangePicker

属性与 DatePicker 的 [RangePicker](/components/date-picker-cn#rangepicker) 相同。还包含以下属性：

| 参数         | 说明                 | 类型                                    | 默认值 | 版本 |
| ------------ | -------------------- | --------------------------------------- | ------ | ---- |
| disabledTime | 不可选择的时间       | [RangeDisabledTime](#rangedisabledtime) | -      |      |
| order        | 始末时间是否自动排序 | boolean                                 | true   |      |

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
