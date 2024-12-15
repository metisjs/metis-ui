import type { AnyObject } from '@util/type';
import warning from '@util/warning';
import type { Dayjs } from 'dayjs';
import { groupBy, uniqueId } from 'lodash';
import type { GenerateConfig } from '../date-picker/interface';
import { parseDate } from '../date-picker/PickerInput/hooks/useFilledProps';
import { isSame, isSameOrAfter, isSameOrBefore } from '../date-picker/utils/dateUtil';
import { CELL_ONE_HOUR_HEIGHT, EVENT_HEIGHT, TIME_EVENT_MULTI_COLUMN_DIFF } from './constant';
import type {
  AllDayEventType,
  CalendarLocale,
  EventType,
  TimeEventGroup,
  TimeEventType,
} from './interface';

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
      const aStartMinute = a.start.minute + a.start.hour * 60;
      const aEndMinute = a.end.minute + a.end.hour * 60;
      const bStartMinute = b.start.minute + b.start.hour * 60;
      const bEndMinute = b.end.minute + b.end.hour * 60;

      if (
        Math.abs(aStartMinute - bStartMinute) <= TIME_EVENT_MULTI_COLUMN_DIFF &&
        aEndMinute !== bEndMinute
      ) {
        return bEndMinute - aEndMinute;
      }

      return aStartMinute - bStartMinute;
    });
  });

  return events;
}

/**
 * 在 1440 * 1440 的容器中来模拟时间轴上事件的位置信息
 * @param event
 * @returns
 */
function getTimeEventPosition<DateType extends AnyObject = Dayjs>(event: TimeEventType<DateType>) {
  const getWidth = (
    info: { group: TimeEventGroup; offset: number; span: number } | null,
  ): number => {
    if (info === null) {
      return 1440; // 假设总宽度为 1440
    }

    const { group, span } = info;
    const parentWidth = getWidth(group.parent);
    const indent = group.parent === null ? 0 : 1;

    return ((parentWidth - indent) * span) / group.column;
  };
  const getLeft = (
    info: { group: TimeEventGroup; offset: number; span: number } | null,
  ): number => {
    if (info === null) {
      return 0;
    }

    const { group, offset } = info;

    const parentLeft = getLeft(group.parent);
    const parentWidth = getWidth(group.parent);

    const indent = group.parent === null ? 0 : 1;
    const groupWidth = parentWidth - indent;
    const offsetWidth = (groupWidth * offset) / group.column;

    return parentLeft + offsetWidth + indent;
  };

  const width = getWidth({ group: event.group, offset: event.offset, span: event.span });
  const left = getLeft({ group: event.group, offset: event.offset, span: event.span });
  const top = (event.start.hour + event.start.minute / 60) * CELL_ONE_HOUR_HEIGHT;

  return {
    x: left,
    width,
    y: top,
    // 显示最小高度为 EVENT_HEIGHT
    height: Math.max(
      (event.end.hour + event.end.minute / 60) * CELL_ONE_HOUR_HEIGHT - top,
      EVENT_HEIGHT,
    ),
  };
}

/**
 * 判断同一天内的两个时间事件是否重叠
 * @param target
 * @param source
 * @returns
 */
function isTimeEventOverlap<DateType extends AnyObject = Dayjs>(
  target: TimeEventType<DateType>,
  source: TimeEventType<DateType> | TimeEventType<DateType>,
) {
  if (target.dateKey !== source.dateKey) {
    return false;
  }
  // 显示时需要保留最小高度，比较时以显示高度为准
  const targetStartMinute = target.start.minute + target.start.hour * 60;
  const targetEndMinute = Math.max(
    target.end.minute + target.end.hour * 60,
    targetStartMinute + EVENT_HEIGHT / (CELL_ONE_HOUR_HEIGHT / 60),
  );
  const sourceStartMinute = source.start.minute + source.start.hour * 60;
  const sourceEndMinute = Math.max(
    source.end.minute + source.end.hour * 60,
    sourceStartMinute + EVENT_HEIGHT / (CELL_ONE_HOUR_HEIGHT / 60),
  );

  const timeOverlap = sourceStartMinute < targetEndMinute && targetStartMinute < sourceEndMinute;

  if (source.group === target.group) {
    return (
      source.offset + source.span > source.group.column ||
      (timeOverlap &&
        source.offset < target.offset + target.span &&
        target.offset < source.offset + source.span)
    );
  }

  if (source.group.parent === null && source.group.column === 1) {
    return timeOverlap;
  }

  if (source.group.parent?.group === target.group) {
    const targetStart = (1 / target.group.column) * target.offset;
    const targetEnd = targetStart + (1 / target.group.column) * target.span;

    const sourceStart =
      (1 / target.group.column) * source.group.parent!.offset +
      (((1 / target.group.column) * source.group.parent!.span) / source.group.column) *
        source.offset;
    const sourceEnd =
      sourceStart +
      (((1 / target.group.column) * source.group.parent!.span) / source.group.column) * source.span;

    return (
      source.offset + source.span > source.group.column ||
      source.group.parent.offset + source.group.parent.span > source.group.parent.group.column ||
      (timeOverlap &&
        targetStart !== sourceStart &&
        targetStart < sourceEnd &&
        sourceStart < targetEnd)
    );
  }

  const targetPos = getTimeEventPosition(target);
  const sourcePos = getTimeEventPosition(source);

  return (
    sourcePos.x + sourcePos.width > 1440 ||
    !(
      sourcePos.x + sourcePos.width <= targetPos.x ||
      sourcePos.x >= targetPos.x + targetPos.width ||
      sourcePos.y >= targetPos.y + targetPos.height ||
      sourcePos.y + targetPos.height <= targetPos.y ||
      (source.group.path.includes(target.group.key) && sourcePos.x > targetPos.x)
    )
  );
}

function isClosely<DateType extends AnyObject = Dayjs>(
  target: TimeEventType<DateType>,
  source: TimeEventType<DateType>,
) {
  const sourceStartMinute = source.start.minute + source.start.hour * 60;
  const targetStartMinute = target.start.minute + target.start.hour * 60;

  return Math.abs(sourceStartMinute - targetStartMinute) <= TIME_EVENT_MULTI_COLUMN_DIFF;
}

function getTimeGroups(group: TimeEventGroup): TimeEventGroup[] {
  if (group.parent !== null) {
    return [...getTimeGroups(group.parent.group), group];
  }

  return [group];
}

/**
 * 计算事件显示位置信息
 * - 事件开始时间相差小于20min，则采用多列显示
 * @param events
 * @returns
 */
function calcTimeEventsLayout<DateType extends AnyObject = Dayjs>(
  events: Record<string, TimeEventType<DateType>[]>,
) {
  sortTimeEvents(events);

  // 缓存组下的所有事件，包括子组内事件
  const groupEventsCache = new Map<string, Set<TimeEventType<DateType>>>();
  const cacheGroupEvent = (group: TimeEventGroup, event: TimeEventType<DateType>) => {
    const groupKey = group.key;
    const groupEvents = groupEventsCache.get(groupKey) ?? new Set();

    groupEvents.add(event);
    groupEventsCache.set(groupKey, groupEvents);

    if (group.parent !== null) {
      cacheGroupEvent(group.parent.group, event);
    }
  };

  Object.keys(events).forEach((dateKey) => {
    const eventList = events[dateKey];

    for (let index = 0; index < eventList.length; index++) {
      const currEvent = eventList[index];
      cacheGroupEvent(currEvent.group, currEvent);

      // 找出与当前事件重叠的事件列表
      let overlayEvents = eventList
        .slice(0, index)
        .filter((event) => isTimeEventOverlap(event, currEvent));

      if (overlayEvents.length) {
        const targetGroupList = new Set(
          overlayEvents.map((event) => getTimeGroups(event.group)).flat(),
        );

        let foundPosition = false;
        groupLoop: for (const targetGroup of targetGroupList) {
          const targetEventList = groupEventsCache.get(targetGroup.key);

          if (!targetEventList?.size) {
            continue;
          }

          let offset = 0;
          let span = targetGroup.column;
          while (span > 0) {
            currEvent.group.parent = { group: targetGroup, offset, span };
            currEvent.group.path.unshift(targetGroup.key);

            foundPosition = targetEventList
              ? [...targetEventList].every(
                  (targetEvent) => !isTimeEventOverlap(targetEvent, currEvent),
                )
              : false;

            if (foundPosition) {
              break groupLoop;
            }

            if (currEvent.group.parent !== null) {
              currEvent.group.parent = null;
              currEvent.group.path.shift();
            }

            if (offset + span < targetGroup.column) {
              offset++;
            } else {
              span--;
              offset = 0;
            }
          }
        }

        if (foundPosition) {
          if (currEvent.group.parent) {
            const targetGroup = currEvent.group.parent.group;
            // targetGroup下的事件列表，不包括子事件
            const targetEventList = [
              ...(groupEventsCache.get(targetGroup.key) ?? new Set()),
            ].filter((event) => event.group.key === targetGroup.key);

            const closelyCount = targetEventList.filter((event) =>
              isClosely(event, currEvent),
            ).length;
            if (closelyCount === targetEventList.length) {
              // 分栏
              groupEventsCache.delete(currEvent.group.key);
              const groupedEvent = targetEventList[0];
              currEvent.group = groupedEvent.group;
              currEvent.group.column += 1;
              currEvent.offset = currEvent.group.column - 1;
              currEvent.span = 1;
            } else if (closelyCount > 0) {
              // 换位置
              for (const targetEvent of targetEventList) {
                if (!isClosely(targetEvent, currEvent)) {
                  currEvent.group.parent!.offset = targetEvent.offset;
                  currEvent.group.parent!.span = targetEvent.span;
                  break;
                }
              }
            }
          }
          cacheGroupEvent(currEvent.group, currEvent);
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

    const endDateCache = Object.fromEntries(
      weekEvents.map((event) => {
        const duration = 'duration' in event ? event.duration : 1;
        return [event.key, generateConfig.addDate(event.date, duration - 1)];
      }),
    );

    for (let i = 1; i < weekEvents.length; i++) {
      const currentEvent = weekEvents[i];

      let j = 0;
      while (j < i) {
        const prevEvent = weekEvents[j];

        if (
          prevEvent.index === currentEvent.index &&
          // 时间段有重叠
          isSameOrBefore(
            generateConfig,
            locale,
            prevEvent.date,
            endDateCache[currentEvent.key],
            'date',
          ) &&
          isSameOrBefore(
            generateConfig,
            locale,
            currentEvent.date,
            endDateCache[prevEvent.key],
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
        key: event.key,
        icon: event.icon,
        title: event.title,
        color: event.color,
        allDay: true,
        readonly: event.readonly,
        dateKey: dateKey,
        date: currentStartDate,
        rangeStart,
        rangeEnd,
        duration,
        index: 0,
        data: event,
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

      const groupKey = uniqueId('group-');
      const dateEvent = {
        key: event.key,
        icon: event.icon,
        title: event.title,
        color: event.color,
        allDay: false,
        readonly: event.readonly,
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
        group: { key: groupKey, column: 1, parent: null, path: [groupKey] },
        offset: 0,
        span: 1,
        data: event,
      };

      groupedEvents[currentDateKey].push(dateEvent);

      // To next day
      currentDate = generateConfig.addDate(currentDate, 1).set('hour', 0).set('minute', 0);
    }
  }

  groupedEvents = calcTimeEventsLayout(groupedEvents);

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

  console.time('calcEventsIndex');
  calcEventsIndex(groupedAllDayEvents, groupedTimeEvents, generateConfig, locale);
  console.log(groupedTimeEvents['20241225']);
  console.timeEnd('calcEventsIndex');

  return [groupedAllDayEvents, groupedTimeEvents] as const;
}
