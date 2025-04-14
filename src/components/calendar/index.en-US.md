---
group: Data Display
title: Calendar
description: A container that displays data in calendar form.
---

## When To Use

When data is in the form of dates, such as schedules, timetables, prices calendar, lunar calendar.

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx" compact>Basic</code>
<code src="./demo/events.tsx" compact>Event</code>

## API

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| className | Semantic DOM class | [SemanticDOM](#semantic-dom) | - |  |
| defaultMode | The mode by default | [CalendarMode](#calendarmode) | - |  |
| defaultValue | The date by default | [dayjs](https://day.js.org/) | - |  |
| eventRender | Replace the Event | function(props:EventProps, DefaultEvent：ComponentClass) | - |  |
| events | The calendar's Event list | [EventType](#eventtype)\[] | - |  |
| extra | Content to render in the top-right corner of the header | ReactNode | - |  |
| headerRender | Render custom header | function(object:{value: Dayjs, mode: CalendarMode, onChange: f(), onModeChange: f()}) | - |  |
| locale | The calendar's locale | object |  |  |
| mode | The display mode of the calendar | [CalendarMode](#calendarmode) | `month` |  |
| modeOptions | The mode options of the calendar | [CalendarMode](#calendarmode)\[], null | `month` |  |
| selectedEventKeys | The selected event keys | Key\[] | - |  |
| value | The current date | [dayjs](https://day.js.org/) | - |  |
| onChange | Callback for when date changes | function(date: Dayjs) | - |  |
| onEventSelectChange | Callback for when event select changes | function(selectedKeys: Key\[]) | - |  |
| onModeChange | Callback for when mode changes | function(mode: CalendarMode) | - |  |

### CalendarMode

```typescript
type CalendarMode = 'day' | 'week' | 'month' | 'year';
```

### EventType

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| allDay | All-day event | boolean | false |  |
| color | The event color | string | `primary-color` |  |
| end | The event end time | [dayjs](https://day.js.org/), string, number | - |  |
| icon | The event icon | ReactNode | `<CalendarOutline />` |  |
| key | The unique identifier of the event | Key | - |  |
| start | The event start time | [dayjs](https://day.js.org/), string, number | - |  |
| title | The event title | string | - |  |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>
