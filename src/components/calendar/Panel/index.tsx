import React, { useMemo } from 'react';
import type { AnyObject, SafeKey } from '@util/type';
import type { Dayjs } from 'dayjs';
import type { DateValue, GenerateConfig } from '../../date-picker/interface';
import { isSame } from '../../date-picker/utils/dateUtil';
import type { CalendarLocale, EventType, SharedPanelProps } from '../interface';
import { groupEventsByDate } from '../util';
import type { DayPanelClassName } from './DayPanel';
import DayPanel from './DayPanel';
import useWinClick from './hooks/useWinClick';
import type { MonthPanelClassName } from './MonthPanel';
import MonthPanel from './MonthPanel';
import type { WeekPanelClassName } from './WeekPanel';
import WeekPanel from './WeekPanel';
import type { YearPanelClassName } from './YearPanel';
import YearPanel from './YearPanel';

const DefaultComponents = {
  day: DayPanel,
  week: WeekPanel,
  month: MonthPanel,
  year: YearPanel,
};

export interface PanelProps<DateType extends object = Dayjs>
  extends Omit<
    SharedPanelProps<DateType>,
    'allDayEventRecord' | 'timeEventRecord' | 'onEventClick'
  > {
  dayPanelClassName?: DayPanelClassName;
  weekPanelClassName?: WeekPanelClassName;
  monthPanelClassName?: MonthPanelClassName;
  yearPanelClassName?: YearPanelClassName;
  events?: EventType<DateType>[];
  onEventSelectChange: (arg: SafeKey[] | ((origin: SafeKey[]) => SafeKey[])) => void;
}

const MS_PER_DAY = 86400000;
function compare<DateType extends AnyObject = Dayjs>(
  generateConfig: GenerateConfig<DateType>,
  locale: CalendarLocale,
  date1: DateType,
  date2: DateValue<DateType>,
) {
  if (typeof date2 === 'number') {
    const timestamp1 = generateConfig.getTimestamp(date1);
    return Math.floor(timestamp1 / MS_PER_DAY) === Math.floor(date2 / MS_PER_DAY)
      ? 0
      : Math.floor(timestamp1 / MS_PER_DAY) > Math.floor(date2 / MS_PER_DAY)
        ? 1
        : -1;
  }

  if (typeof date2 === 'string') {
    const [year2, month2, day2] = date2.split(' ')[0].split(/[-/]/).map(Number);

    const year1 = generateConfig.getYear(date1);
    const month1 = generateConfig.getMonth(date1) + 1;
    const day1 = generateConfig.getDate(date1);

    if (year1 !== year2) return year1 > year2 ? 1 : -1;
    if (month1 !== month2) return month1 > month2 ? 1 : -1;

    return day1 === day2 ? 0 : day1 > day2 ? 1 : -1;
  }

  return isSame(generateConfig, locale, date1, date2, 'date')
    ? 0
    : generateConfig.isAfter(date1!, date2!)
      ? 1
      : -1;
}

const Panel = <DateType extends object = Dayjs>({
  events,
  value,
  mode,
  generateConfig,
  locale,
  selectedEventKeys,
  dayPanelClassName,
  weekPanelClassName,
  monthPanelClassName,
  yearPanelClassName,
  onEventSelectChange,
  ...restProps
}: PanelProps<DateType>) => {
  const PanelComponent = DefaultComponents[mode] as typeof MonthPanel;

  useWinClick(() => onEventSelectChange([]));

  const validEventDateRange = useMemo<[DateType, DateType] | null>(() => {
    if (mode === 'year') {
      return null;
    }

    if (mode === 'month') {
      const firstOfMonth = generateConfig.setDate(value, 1);
      const firstOfWeek = generateConfig.locale.getWeekFirstDate(locale.locale, firstOfMonth);
      const endOfMonth = generateConfig.getEndDate(value);
      const endOfWeek = generateConfig.addDate(
        generateConfig.locale.getWeekFirstDate(locale.locale, endOfMonth),
        6 + 7,
      );
      return [firstOfWeek, endOfWeek];
    }

    if (mode === 'week') {
      const weekFirst = generateConfig.locale.getWeekFirstDate(locale.locale, value);
      return [weekFirst, generateConfig.addDate(weekFirst, 6)];
    }

    return [value, value];
  }, [value, mode]);

  const [allDayEventRecord, timeEventRecord] = useMemo(() => {
    if (validEventDateRange === null) return [{}, {}];

    const validEvents =
      events?.filter((event) => {
        const { start, end } = event;

        return (
          compare(generateConfig, locale, validEventDateRange[0], end) <= 0 &&
          compare(generateConfig, locale, validEventDateRange[1], start) >= 0
        );
      }) ?? [];

    return groupEventsByDate(validEvents, generateConfig, locale, mode === 'month');
  }, [events, mode, validEventDateRange?.[0], validEventDateRange?.[1]]);

  const onEventClick = (
    event: EventType<DateType>,
    domEvent: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (domEvent.metaKey || domEvent.ctrlKey) {
      onEventSelectChange((origin) => [...origin, event.key]);
    } else {
      onEventSelectChange([event.key]);
    }
    domEvent.stopPropagation();
  };

  const className = {
    year: yearPanelClassName,
    month: monthPanelClassName,
    week: weekPanelClassName,
    day: dayPanelClassName,
  }[mode];

  return (
    <PanelComponent
      {...restProps}
      className={className}
      mode={mode}
      value={value}
      selectedEventKeys={selectedEventKeys}
      generateConfig={generateConfig}
      locale={locale}
      allDayEventRecord={allDayEventRecord}
      timeEventRecord={timeEventRecord}
      onEventClick={onEventClick}
    />
  );
};

export default Panel;
