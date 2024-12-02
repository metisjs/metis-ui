import type { AnyObject } from '@util/type';
import warning from '@util/warning';
import type { Dayjs } from 'dayjs';
import type { GenerateConfig } from '../date-picker/interface';
import { parseDate } from '../date-picker/PickerInput/hooks/useFilledProps';
import { isSame, isSameOrAfter } from '../date-picker/utils/dateUtil';
import type { AllDayEventType, CalendarLocale, EventType, TimeEventType } from './interface';

const FORMAT_LIST = ['YYYY-MM-DD HH:mm', 'YYYY/MM/DD HH:mm'];

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
 * Sort all-day events by duration descending.
 * @param events
 * @returns
 */
function sortAllDayEvents(
  events: Record<string, AllDayEventType[]>,
): Record<string, AllDayEventType[]> {
  Object.keys(events).forEach((dateKey) => {
    const eventList = events[dateKey];
    eventList.sort((a, b) => b.duration - a.duration);
  });

  return events;
}

/**
 * Sort by start time ascending.
 * @param events
 * @returns
 */
function sortTimeEvents(events: Record<string, TimeEventType[]>): Record<string, TimeEventType[]> {
  Object.keys(events).forEach((dateKey) => {
    const eventList = events[dateKey];

    eventList.sort((a, b) => {
      if (a.start.hour !== b.start.hour) {
        return a.start.hour - b.start.hour;
      }
      return a.start.minute - b.start.minute;
    });
  });

  return events;
}

function calcTimeEventsIndent(events: Record<string, TimeEventType[]>) {
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

// /**
//  * Calculate events index
//  * @param events
//  * @returns
//  */
// function calcEventsIndex(events: Record<string, DateEvent[]>) {
//   return events;
// }

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
): Record<string, AllDayEventType[]> {
  const groupedEvents: Record<string, AllDayEventType[]> = {};

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
        key: event.key,
        icon: event.icon,
        title: event.title,
        color: event.color,
        dateKey: dateKey,
        rangeStart,
        rangeEnd,
        duration,
      });

      currentStartDate = generateConfig.addDate(currentEndOfWeek, 1);
      rangeStart = false;
    }
  }

  sortAllDayEvents(groupedEvents);

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
): Record<string, TimeEventType[]> {
  let groupedEvents: Record<string, TimeEventType[]> = {};

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

      const dateEvent: TimeEventType = {
        key: event.key,
        icon: event.icon,
        title: event.title,
        color: event.color,
        dateKey: currentDateKey,
        start: {
          hour: generateConfig.getHour(currentDate),
          minute: generateConfig.getMinute(currentDate),
        },
        end: {
          hour: 12,
          minute: 59,
        },
        indent: 0,
        rangeStart: isSame(generateConfig, locale, currentDate, startDate, 'date'),
        rangeEnd: isSame(generateConfig, locale, currentDate, endDate, 'date'),
      };

      groupedEvents[currentDateKey].push(dateEvent);

      // To next day
      currentDate = generateConfig.addDate(currentDate, 1);
    }
  }

  groupedEvents = calcTimeEventsIndent(groupedEvents);

  return groupedEvents;
}

/**
 * Group events by date
 */
export function groupEventsByDate<DateType extends AnyObject = Dayjs>(
  events: EventType<DateType>[],
  generateConfig: GenerateConfig<DateType>,
  locale: CalendarLocale,
): [Record<string, AllDayEventType[]>, Record<string, TimeEventType[]>] {
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

  return [groupedAllDayEvents, groupedTimeEvents] as const;
}
