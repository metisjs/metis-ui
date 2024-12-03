import type { AnyObject } from '@util/type';
import warning from '@util/warning';
import type { Dayjs } from 'dayjs';
import { groupBy } from 'lodash';
import type { GenerateConfig } from '../date-picker/interface';
import { parseDate } from '../date-picker/PickerInput/hooks/useFilledProps';
import { isSame, isSameOrAfter } from '../date-picker/utils/dateUtil';
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
 * Sort by start time ascending.
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
      return a.start.minute - b.start.minute;
    });
  });

  return events;
}

function calcTimeEventsIndent<DateType extends AnyObject = Dayjs>(
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
 * 同一周内duration越长，越靠前
 * @param events
 * @returns
 */
function calcAllDayEventsIndex<DateType extends AnyObject = Dayjs>(
  allDayEventRecord: Record<string, AllDayEventType<DateType>[]>,
  generateConfig: GenerateConfig<DateType>,
  locale: CalendarLocale,
) {
  const events = Object.values(allDayEventRecord).flat();
  const weeksEvents = Object.values(
    groupBy(
      events,
      (event) =>
        `${generateConfig.getYear(event.date)}-${generateConfig.locale.getWeek(locale.locale, event.date)}`,
    ),
  );

  for (const weekEvents of weeksEvents) {
    weekEvents.sort((a, b) => b.duration - a.duration);

    for (let i = 1; i < weekEvents.length; i++) {
      const currentEvent = weekEvents[i];

      for (let j = 0; j < i; j++) {
        const prevEvent = weekEvents[j];

        if (
          prevEvent.index === currentEvent.index &&
          // 时间段有重叠
          !generateConfig.isAfter(
            prevEvent.date,
            generateConfig.addDate(currentEvent.date, currentEvent.duration - 1),
          ) &&
          !generateConfig.isAfter(
            currentEvent.date,
            generateConfig.addDate(prevEvent.date, prevEvent.duration - 1),
          )
        ) {
          currentEvent.index += 1;
        }
      }
    }
  }

  return allDayEventRecord;
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
        key: event.key,
        icon: event.icon,
        title: event.title,
        color: event.color,
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

      const dateEvent: TimeEventType<DateType> = {
        key: event.key,
        icon: event.icon,
        title: event.title,
        color: event.color,
        dateKey: currentDateKey,
        date: currentDate,
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
        index: 0,
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

  groupedAllDayEvents = calcAllDayEventsIndex(groupedAllDayEvents, generateConfig, locale);

  return [groupedAllDayEvents, groupedTimeEvents] as const;
}
