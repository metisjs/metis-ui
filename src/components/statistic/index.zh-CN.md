---
group: 数据展示
title: Statistic
subtitle: 统计数值
description: 展示统计数值。
---

## 何时使用

- 当需要突出某个或某组数字时。
- 当需要展示带描述的统计类数据时使用。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">基本</code>
<code src="./demo/unit.tsx">单位</code>
<code src="./demo/animated.tsx">动画效果</code>
<code src="./demo/card.tsx" background="grey">在卡片中使用</code>
<code src="./demo/group.tsx">组</code>
<code src="./demo/countdown.tsx">倒计时</code>

## API

#### Statistic

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| className | 语义化结构 class | [SemanticClassName](/docs/semantic-classname-cn) | - |  |
| decimalSeparator | 设置小数点 | string | `.` |  |
| formatter | 自定义数值展示 | (value) => ReactNode | - |  |
| groupSeparator | 设置千分位标识符 | string | `,` |  |
| loading | 数值是否加载中 | boolean | false |  |
| precision | 数值精度 | number | - |  |
| prefix | 设置数值的前缀 | ReactNode | - |  |
| suffix | 设置数值的后缀 | ReactNode | - |  |
| title | 数值的标题 | ReactNode | - |  |
| tooltip | 标题栏提示 | string \| TooltipProps | - |  |
| value | 数值内容 | string \| number | - |  |
| valueStyle | 设置数值区域的样式 | CSSProperties | - |  |

#### Statistic.Group

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| className | 语义化结构 class | [SemanticClassName](/docs/semantic-classname-cn) | - |  |
| column | 一行的 `Statistic` 数量，可以写成像素值或支持响应式的对象写法 `{ xs: 8, sm: 16, md: 24}` | number \| Record&lt;Breakpoint, number> | 4 |  |
| expandable | 是否可展开 | `boolean` | true |  |
| item | 列表项内容 | [StatisticItem](#statistic)\[] |  |  |
| loading | 数值是否加载中 | `boolean` | false |  |

#### Statistic.Countdown

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| className | 语义化结构 class | [SemanticClassName](/docs/semantic-classname-cn) | - |  |
| format | 格式化倒计时展示，参考 [dayjs](https://day.js.org/) | string | `HH:mm:ss` |  |
| prefix | 设置数值的前缀 | ReactNode | - |  |
| suffix | 设置数值的后缀 | ReactNode | - |  |
| title | 数值的标题 | ReactNode | - |  |
| value | 数值内容 | number | - |  |
| valueStyle | 设置数值区域的样式 | CSSProperties | - |  |
| onChange | 倒计时时间变化时触发 | (value: number) => void | - |  |
| onFinish | 倒计时完成时触发 | () => void | - |  |
