import type { AnyObject } from '@util/type';
import warning from '@util/warning';
import type { Dayjs } from 'dayjs';
import { groupBy } from 'lodash';
import omit from 'rc-util/lib/omit';
import type { GenerateConfig } from '../date-picker/interface';
import { parseDate } from '../date-picker/PickerInput/hooks/useFilledProps';
import { isSame, isSameOrAfter, isSameOrBefore } from '../date-picker/utils/dateUtil';
import type { AllDayEventType, CalendarLocale, EventType, TimeEventType } from './interface';

const FORMAT_LIST = [
  'YYYY-MM-DD HH:mm:ss',
  'YYYY/MM/DD HH:mm:ss',
  'YYYY-MM-DD HH:mm',
  'YYYY/MM/DD HH:mm',
  'YYYY-M-D HH:mm:ss',
  'YYYY/M/D HH:mm:ss',
  'YYYY-M-D HH:mm',
  'YYYY/M/D HH:mm',
  'YYYY-MM-DD',
  'YYYY/MM/DD',
  'YYYY-M-D',
  'YYYY/M/D',
];

function checkEventsDate<DateType extends AnyObject = Dayjs>(
  event: EventType<DateType>,
  generateConfig: GenerateConfig<DateType>,
  locale: CalendarLocale,
) {
  const startDate = parseDate(event.start, generateConfig, locale, FORMAT_LIST);
  const endDate = parseDate(event.end, generateConfig, locale, FORMAT_LIST);

  if (
    !startDate ||
    !endDate ||
    !isSameOrAfter(
      generateConfig,
      locale,
      parseDate(event.end, generateConfig, locale, FORMAT_LIST)!,
      parseDate(event.start, generateConfig, locale, FORMAT_LIST)!,
      event.allDay ? 'date' : 'datetime',
    )
  ) {
    warning(false, 'Invalid event date range.');
    return false;
  }

  return true;
}

export function getDateKey<DateType extends AnyObject = Dayjs>(
  date: DateType,
  generateConfig: GenerateConfig<DateType>,
) {
  const year = generateConfig.getYear(date);
  const month = generateConfig.getMonth(date) + 1;
  const day = generateConfig.getDate(date);

  return `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
}

/**
 * Sort by start time asc and end time desc.
 * @param events
 * @returns
 */
function sortTimeEvents<DateType extends AnyObject = Dayjs>(
  events: Record<string, TimeEventType<DateType>[]>,
): Record<string, TimeEventType<DateType>[]> {
  Object.keys(events).forEach((dateKey) => {
    const eventList = events[dateKey];

    eventList.sort((a, b) => {
      if (a.start.hour !== b.start.hour) {
        return a.start.hour - b.start.hour;
      }
      if (a.start.minute !== b.start.minute) {
        return a.start.minute - b.start.minute;
      }
      if (a.end.hour !== b.end.hour) {
        return b.end.hour - a.end.hour;
      }
      return b.end.minute - a.end.minute;
    });
  });

  return events;
}

/**
 * 计算事件显示位置信息
 * - 事件开始时间相差小于15min，则采用分栏显示
 * - 如果事件于前面事件时间重叠，则在重叠的事件indent基础上+1
 * @param events
 * @returns
 */
function calcTimeEventsPosition<DateType extends AnyObject = Dayjs>(
  events: Record<string, TimeEventType<DateType>[]>,
) {
  sortTimeEvents(events);

  Object.keys(events).forEach((dateKey) => {
    const eventList = events[dateKey];

    for (let index = 0; index < eventList.length; index++) {
      const event = eventList[index];

      if (event.allDay) continue;

      for (let i = 0; i < index; i++) {
        const previousEvent = eventList[i];

        if (previousEvent.allDay) continue;

        if (
          event.start.hour < previousEvent.end.hour ||
          (event.start.hour === previousEvent.end.hour &&
            event.start.minute < previousEvent.end.minute)
        ) {
          event.indent = previousEvent.indent + 1;
        }
      }
    }
  });

  return events;
}

/**
 * Calculate events index
 * - all-day event 优先级高于 time event
 * - 同一周内duration越长，越靠前
 * - time event 按开始时间排序
 */
function calcEventsIndex<DateType extends AnyObject = Dayjs>(
  allDayEventRecord: Record<string, AllDayEventType<DateType>[]>,
  timeEventRecord: Record<string, TimeEventType<DateType>[]>,
  generateConfig: GenerateConfig<DateType>,
  locale: CalendarLocale,
) {
  const events = [
    ...Object.values(allDayEventRecord).flat(),
    ...Object.values(timeEventRecord)
      .flat()
      .filter((event) => event.rangeStart),
  ];
  const weeksEvents = Object.values(
    groupBy(
      events,
      (event) =>
        `${generateConfig.getYear(event.date)}-${generateConfig.locale.getWeek(locale.locale, event.date)}`,
    ),
  );

  for (const weekEvents of weeksEvents) {
    weekEvents.sort((a, b) => {
      const aAllday = 'duration' in a;
      const bAllday = 'duration' in b;

      if (aAllday && bAllday) {
        return b.duration - a.duration;
      }

      if (!aAllday && !bAllday) {
        if (a.start.hour !== b.start.hour) {
          return a.start.hour - b.start.hour;
        }
        if (a.start.minute !== b.start.minute) {
          return a.start.minute - b.start.minute;
        }
        if (a.end.hour !== b.end.hour) {
          return b.end.hour - a.end.hour;
        }
        return b.end.minute - a.end.minute;
      }

      if (aAllday) {
        return -1;
      }

      return 1;
    });

    for (let i = 1; i < weekEvents.length; i++) {
      const currentEvent = weekEvents[i];
      const currentDuration = 'duration' in currentEvent ? currentEvent.duration : 1;

      let j = 0;
      while (j < i) {
        const prevEvent = weekEvents[j];
        const prevDuration = 'duration' in prevEvent ? prevEvent.duration : 1;

        if (
          prevEvent.index === currentEvent.index &&
          // 时间段有重叠
          isSameOrBefore(
            generateConfig,
            locale,
            prevEvent.date,
            generateConfig.addDate(currentEvent.date, currentDuration - 1),
            'date',
          ) &&
          isSameOrBefore(
            generateConfig,
            locale,
            currentEvent.date,
            generateConfig.addDate(prevEvent.date, prevDuration - 1),
            'date',
          )
        ) {
          currentEvent.index += 1;
          j = 0;
        } else {
          j += 1;
        }
      }
    }
  }

  return [allDayEventRecord, timeEventRecord];
}

/**
 * 按日期分组全天事件
 * - 跨周事件会按周拆分成多个事件
 * @param events
 * @param generateConfig
 * @param locale
 */
function groupAllDayEvents<DateType extends AnyObject = Dayjs>(
  events: EventType<DateType>[],
  generateConfig: GenerateConfig<DateType>,
  locale: CalendarLocale,
): Record<string, AllDayEventType<DateType>[]> {
  const groupedEvents: Record<string, AllDayEventType<DateType>[]> = {};

  for (const event of events) {
    if (!checkEventsDate(event, generateConfig, locale)) {
      continue;
    }

    const startDate = parseDate(event.start, generateConfig, locale, ['YYYY-MM-DD'])!;
    const endDate = parseDate(event.end, generateConfig, locale, ['YYYY-MM-DD'])!;

    let currentStartDate = startDate;
    let rangeStart = true;
    let duration = 0;

    while (isSameOrAfter(generateConfig, locale, endDate, currentStartDate, 'date')) {
      const currentStartOfWeek = generateConfig.locale.getWeekFirstDate(
        locale.locale,
        currentStartDate,
      );
      const currentEndOfWeek = generateConfig.addDate(currentStartOfWeek, 6);
      let rangeEnd = false;

      if (isSameOrAfter(generateConfig, locale, currentEndOfWeek, endDate, 'date')) {
        duration = generateConfig.diffDate(endDate, currentStartDate) + 1;
        rangeEnd = true;
      } else {
        // 如果事件跨越当前周
        duration = generateConfig.diffDate(currentEndOfWeek, currentStartDate) + 1;
        rangeEnd = false;
      }

      const dateKey = getDateKey(currentStartDate, generateConfig);

      if (!groupedEvents[dateKey]) {
        groupedEvents[dateKey] = [];
      }

      groupedEvents[dateKey].push({
        ...omit(event, ['start', 'end']),
        dateKey: dateKey,
        date: currentStartDate,
        rangeStart,
        rangeEnd,
        duration,
        index: 0,
      });

      currentStartDate = generateConfig.addDate(currentEndOfWeek, 1);
      rangeStart = false;
    }
  }

  return groupedEvents;
}

/**
 * 按日期分组非全天事件
 * @param events
 * @param generateConfig
 * @param locale
 */
function groupTimeEvents<DateType extends AnyObject = Dayjs>(
  events: EventType<DateType>[],
  generateConfig: GenerateConfig<DateType>,
  locale: CalendarLocale,
): Record<string, TimeEventType<DateType>[]> {
  let groupedEvents: Record<string, TimeEventType<DateType>[]> = {};

  for (const event of events) {
    if (!checkEventsDate(event, generateConfig, locale)) {
      continue;
    }

    const startDate = parseDate(event.start, generateConfig, locale, FORMAT_LIST)!;
    const endDate = parseDate(event.end, generateConfig, locale, FORMAT_LIST)!;

    let currentDate = startDate;

    while (isSameOrAfter(generateConfig, locale, endDate, currentDate, 'date')) {
      const currentDateKey = getDateKey(currentDate, generateConfig);

      if (!groupedEvents[currentDateKey]) {
        groupedEvents[currentDateKey] = [];
      }

      const rangeStart = isSame(generateConfig, locale, currentDate, startDate, 'date');
      const rangeEnd = isSame(generateConfig, locale, currentDate, endDate, 'date');

      const dateEvent: TimeEventType<DateType> = {
        ...omit(event, ['start', 'end']),
        dateKey: currentDateKey,
        date: currentDate,
        start: {
          hour: generateConfig.getHour(currentDate),
          minute: generateConfig.getMinute(currentDate),
        },
        end: {
          hour: rangeEnd ? generateConfig.getHour(endDate) : 23,
          minute: rangeEnd ? generateConfig.getMinute(endDate) : 59,
        },
        rangeStart,
        rangeEnd,
        index: 0,
        offset: 0,
        spans: [1],
      };

      groupedEvents[currentDateKey].push(dateEvent);

      // To next day
      currentDate = generateConfig.addDate(currentDate, 1).set('hour', 0).set('minute', 0);
    }
  }

  groupedEvents = calcTimeEventsPosition(groupedEvents);

  return groupedEvents;
}

/**
 * Group events by date
 */
export function groupEventsByDate<DateType extends AnyObject = Dayjs>(
  events: EventType<DateType>[],
  generateConfig: GenerateConfig<DateType>,
  locale: CalendarLocale,
): [Record<string, AllDayEventType<DateType>[]>, Record<string, TimeEventType<DateType>[]>] {
  let groupedAllDayEvents = groupAllDayEvents(
    events.filter((e) => e.allDay),
    generateConfig,
    locale,
  );
  let groupedTimeEvents = groupTimeEvents(
    events.filter((e) => !e.allDay),
    generateConfig,
    locale,
  );

  calcEventsIndex(groupedAllDayEvents, groupedTimeEvents, generateConfig, locale);

  return [groupedAllDayEvents, groupedTimeEvents] as const;
}
