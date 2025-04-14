---
group: 数据展示
title: Calendar
subtitle: 日历
description: 按照日历形式展示数据的容器。
---

## 何时使用

当数据是日期或按照日期划分时，例如日程、课表、价格日历等，农历等。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx" compact>基本</code>
<code src="./demo/events.tsx" compact>事件</code>
<code src="./demo/lunar.tsx" compact>农历</code>

## API

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| className | 语义化结构 class | [SemanticDOM](#semantic-dom) | - |  |
| defaultMode | 默认展示的模式 | [CalendarMode](#calendarmode) | - |  |
| defaultValue | 默认展示的日期 | [dayjs](https://day.js.org/) | - |  |
| eventRender | 替换 Event，用于二次封装事件 | function(props:EventProps, DefaultEvent：ComponentClass) | - |  |
| events | 事件集合 | [EventType](#eventtype)\[] | - |  |
| extra | 右上角的操作区域 | ReactNode | - |  |
| headerRender | 自定义头部内容 | function(object:{value: Dayjs, mode: CalendarMode, onChange: f(), onModeChange: f()}) | - |  |
| locale | 国际化配置 | object |  |  |
| lunar | 显示农历 | false | - |  |
| mode | 模式 | [CalendarMode](#calendarmode) | `month` |  |
| modeOptions | 模式选项 | [CalendarMode](#calendarmode)\[]、 null | `month` |  |
| selectedEventKeys | 已选中的事件 | Key\[] | - |  |
| value | 展示日期 | [dayjs](https://day.js.org/) | - |  |
| onChange | 日期变化回调 | function(date: Dayjs) | - |  |
| onEventSelectChange | 事件选中变化回调 | function(selectedKeys: Key\[]) | - |  |
| onModeChange | 模式变化回调 | function(mode: CalendarMode) | - |  |

### CalendarMode

```typescript
type CalendarMode = 'day' | 'week' | 'month' | 'year';
```

### EventType

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| allDay | 是否为全天事件 | boolean | false |  |
| color | 显示颜色 | string | `主题色` |  |
| end | 结束时间 | [dayjs](https://day.js.org/)、 string、 number | - |  |
| icon | 图标 | ReactNode | `<CalendarOutline />` |  |
| key | 唯一标志 | Key | - |  |
| start | 开始时间 | [dayjs](https://day.js.org/)、 string、 number | - |  |
| title | 标题 | string | - |  |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>
