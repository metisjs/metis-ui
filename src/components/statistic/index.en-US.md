---
group: Data Display
title: Statistic
description: Display statistic number.
---

## When To Use

- When want to highlight some data.
- When want to display statistic data with description.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/unit.tsx">Unit</code>
<code src="./demo/animated.tsx">Animated number</code>
<code src="./demo/card.tsx" background="grey">In Card</code>
<code src="./demo/group.tsx">Group</code>
<code src="./demo/countdown.tsx">Countdown</code>

## API

#### Statistic

| Property         | Description                   | Type                   | Default | Version |
| ---------------- | ----------------------------- | ---------------------- | ------- | ------- |
| decimalSeparator | The decimal separator         | string                 | `.`     |         |
| formatter        | Customize value display logic | (value) => ReactNode   | -       |         |
| groupSeparator   | Group separator               | string                 | `,`     |         |
| loading          | Loading status of Statistic   | boolean                | false   |         |
| precision        | The precision of input value  | number                 | -       |         |
| prefix           | The prefix node of value      | ReactNode              | -       |         |
| suffix           | The suffix node of value      | ReactNode              | -       |         |
| title            | Display title                 | ReactNode              | -       |         |
| value            | Display value                 | string \| number       | -       |         |
| tip              | title bar tips                | string \| TooltipProps | -       |         |

#### Statistic.Countdown

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| format | Format as [dayjs](https://day.js.org/) | string | `HH:mm:ss` |  |
| prefix | The prefix node of value | ReactNode | - |  |
| suffix | The suffix node of value | ReactNode | - |  |
| title | Display title | ReactNode | - |  |
| value | Set target countdown time | number | - |  |
| valueStyle | Set value section style | CSSProperties | - |  |
| onFinish | Trigger when time's up | () => void | - |  |
| onChange | Trigger when time's changing | (value: number) => void | - |  |
