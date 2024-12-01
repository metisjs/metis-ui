import type { AnyObject } from '@util/type';
import warning from '@util/warning';
import type { Dayjs } from 'dayjs';
import type { GenerateConfig } from '../date-picker/interface';
import { parseDate } from '../date-picker/PickerInput/hooks/useFilledProps';
import { isSameOrAfter } from '../date-picker/utils/dateUtil';
import type { CalendarLocale, EventType } from './interface';

export interface DateEvent extends Omit<EventType, 'start' | 'end'> {
  date: string;
  start: { hour: number; minute: number };
  end: { hour: number; minute: number };
  /* show indent for resolving time conflicts in the day and week views */
  indent: number;
  rangeStart: boolean;
  rangeEnd: boolean;
  allDay?: boolean;
  /* only available in all-day events, unit:day */
  duration: number;
}

const FORMAT_LIST = ['YYYY-MM-DD HH:mm', 'YYYY/MM/DD HH:mm'];

function splitDate<DateType extends AnyObject = Dayjs>(
  date: DateType,
  generateConfig: GenerateConfig<DateType>,
) {
  const year = generateConfig.getYear(date);
  const month = generateConfig.getMonth(date) + 1;
  const day = generateConfig.getDate(date);
  const hour = generateConfig.getHour(date);
  const minute = generateConfig.getMinute(date);

  return [year, month, day, hour, minute];
}

export function getDateKey(year: number, month: number, day: number) {
  return `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
}

/**
 * Sort all-day events by duration (descending) and other events by start time (ascending).
 * @param events
 * @returns
 */
function sortEvents(events: Record<string, DateEvent[]>): Record<string, DateEvent[]> {
  const sortedEvents: Record<string, DateEvent[]> = {};

  Object.keys(events).forEach((dateKey) => {
    const eventList = events[dateKey];

    const allDayEvents = eventList.filter((event) => event.allDay);
    const otherEvents = eventList.filter((event) => !event.allDay);

    allDayEvents.sort((a, b) => b.duration - a.duration);

    otherEvents.sort((a, b) => {
      if (a.start.hour !== b.start.hour) {
        return a.start.hour - b.start.hour;
      }
      return a.start.minute - b.start.minute;
    });

    sortedEvents[dateKey] = [...allDayEvents, ...otherEvents];
  });

  return sortedEvents;
}

function calcEventsIndent(events: Record<string, DateEvent[]>) {
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
 * Calculate all-day events index
 * @param events
 * @returns
 */
function calcEventsIndex(events: Record<string, DateEvent[]>) {
  return events;
}

/**
 * Group events by date
 * @example {'20241130': [DateEvent, DateEvent]}
 */
export function groupEventsByDate<DateType extends AnyObject = Dayjs>(
  events: EventType<DateType>[],
  generateConfig: GenerateConfig<DateType>,
  locale: CalendarLocale,
): Record<string, DateEvent[]> {
  let groupedEvents: Record<string, DateEvent[]> = {};

  for (const event of events) {
    // Check startTime is before endTime
    if (
      !isSameOrAfter(
        generateConfig,
        locale,
        parseDate(event.end, generateConfig, locale, FORMAT_LIST)!,
        parseDate(event.start, generateConfig, locale, FORMAT_LIST)!,
        event.allDay ? 'date' : 'datetime',
      )
    ) {
      warning(false, 'Calendar', 'Event start or end invalid, start time need before of end time.');
      continue;
    }

    const startDate = parseDate(event.start, generateConfig, locale, FORMAT_LIST);
    if (!startDate) {
      warning(false, 'Calendar', 'Invalid event start date type:' + event.start);
      continue;
    }
    const endDate = parseDate(event.end, generateConfig, locale, FORMAT_LIST);
    if (!endDate) {
      warning(false, 'Calendar', 'Invalid event end date type:' + event.end);
      continue;
    }

    const duration = generateConfig.diffDate(endDate, startDate) + 1;

    const [startYear, startMonth, startDay, startHour, startMinute] = splitDate(
      startDate,
      generateConfig,
    );
    const [endYear, endMonth, endDay, endHour, endMinute] = splitDate(endDate, generateConfig);

    const endDateKey = getDateKey(endYear, endMonth, endDay);

    let [currentYear, currentMonth, currentDay, currentHour, currentMinute] = [
      startYear,
      startMonth,
      startDay,
      startHour,
      startMinute,
    ];
    const startDateKey = getDateKey(currentYear, currentMonth, currentDay);
    let currentDateKey = startDateKey;

    while (currentDateKey !== endDateKey) {
      if (!groupedEvents[currentDateKey]) {
        groupedEvents[currentDateKey] = [];
      }

      const dateEvent: DateEvent = {
        key: event.key?.toString(),
        icon: event.icon,
        title: event.title,
        date: currentDateKey,
        start: {
          hour: currentHour,
          minute: currentMinute,
        },
        end: {
          hour: 12,
          minute: 59,
        },
        indent: 0,
        allDay: !!event.allDay,
        rangeStart: startDateKey === currentDateKey,
        rangeEnd: false,
        duration: event.allDay ? duration : -1,
      };

      groupedEvents[currentDateKey].push(dateEvent);

      // To next day
      const currentDate = generateConfig.addDate(
        parseDate(`${currentYear}/${currentMonth}/${currentDay}`, generateConfig, locale, [
          'YYYY/M/D',
        ])!,
        1,
      );
      [currentYear, currentMonth, currentDay, currentHour, currentMinute] = splitDate(
        currentDate,
        generateConfig,
      );
      currentDateKey = getDateKey(currentYear, currentMonth, currentDay);
    }

    if (!groupedEvents[currentDateKey]) {
      groupedEvents[currentDateKey] = [];
    }

    const dateEvent: DateEvent = {
      key: event.key?.toString(),
      icon: event.icon,
      title: event.title,
      date: currentDateKey,
      start: {
        hour: currentHour,
        minute: currentMinute,
      },
      end: {
        hour: endHour,
        minute: endMinute,
      },
      indent: 0,
      allDay: !!event.allDay,
      rangeStart: startDateKey === currentDateKey,
      rangeEnd: true,
      duration: event.allDay ? duration : -1,
    };

    groupedEvents[currentDateKey].push(dateEvent);
  }

  groupedEvents = sortEvents(groupedEvents);
  groupedEvents = calcEventsIndent(groupedEvents);
  groupedEvents = calcEventsIndex(groupedEvents);

  return groupedEvents;
}
