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

**Note:** Part of the Calendar's locale is read from `value`. So, please set the locale of `dayjs` correctly.

```jsx
// The default locale is en-US, if you want to use other locale, just set locale in entry file globally.
// import dayjs from 'dayjs';
// import 'dayjs/locale/zh-cn';
// dayjs.locale('zh-cn');

<Calendar />
```

| Property | Description | Type | Default | Version |
| --- | --- | --- | --- | --- |
| className | Semantic DOM class | [SemanticDOM](#semantic-dom) | - |  |
| defaultValue | The date by default | [dayjs](https://day.js.org/) | - |  |
| defaultMode | The mode by default | [CalendarMode](#calendarmode) | - |  |
| headerRender | Render custom header | function(object:{value: Dayjs, mode: CalendarMode, onChange: f(), onModeChange: f()}) | - |  |
| locale | The calendar's locale | object |  |  |
| mode | The display mode of the calendar | [CalendarMode](#calendarmode) | `month` |  |
| modeOptions | The mode options of the calendar | [CalendarMode](#calendarmode)\[] \| null | `month` |  |
| value | The current date | [dayjs](https://day.js.org/) | - |  |
| onChange | Callback for when date changes | function(date: Dayjs) | - |  |
| events | The calendar's Event list | [EventType](#eventtype)\[] | - |  |
| extra | Content to render in the top-right corner of the header | ReactNode | - |  |
| selectedEventKeys | The selected event keys | Key[] | - |  |
| eventRender | Replace the Event | function(props:EventProps, DefaultEvent：ComponentClass) | - |  |
| onModeChange | Callback for when mode changes | function(mode: CalendarMode) | - |  |
| onEventSelectChange | Callback for when event select changes | function(selectedKeys: Key[]) | - |  |

### CalendarMode

```typescript
type CalendarMode = 'day' | 'week' | 'month' | 'year';
```

### EventType

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| key | The unique identifier of the event | Key | - |  |
| icon | The event icon | ReactNode | `<CalendarOutline />` |  |
| title | The event title | string | - |  |
| start | The event start time | [dayjs](https://day.js.org/) \| string \| number | - |  |
| end | The event end time | [dayjs](https://day.js.org/) \| string \| number | - |  |
| allDay | All-day event | boolean | false |  |
| color | The event color | string | `primary-color` |  |

## Semantic DOM

<code src="./demo/_semantic.tsx" simplify></code>
