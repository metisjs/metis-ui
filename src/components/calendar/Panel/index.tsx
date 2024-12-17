import React, { useMemo } from 'react';
import type { AnyObject } from '@util/type';
import type { Dayjs } from 'dayjs';
import type { DateValue, GenerateConfig } from '../../date-picker/interface';
import { isSame } from '../../date-picker/utils/dateUtil';
import type { CalendarLocale, EventType, SharedPanelProps } from '../interface';
import { groupEventsByDate } from '../util';
import DayPanel from './DayPanel';
import MonthPanel from './MonthPanel';
import WeekPanel from './WeekPanel';
import YearPanel from './YearPanel';

const DefaultComponents = {
  day: DayPanel,
  week: WeekPanel,
  month: MonthPanel,
  year: YearPanel,
};

export interface PanelProps<DateType extends object = Dayjs>
  extends Omit<SharedPanelProps<DateType>, 'allDayEventRecord' | 'timeEventRecord'> {
  events?: EventType<DateType>[];
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
  ...restProps
}: PanelProps<DateType>) => {
  const PanelComponent = DefaultComponents[mode] as typeof MonthPanel;

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

  return (
    <PanelComponent
      {...restProps}
      mode={mode}
      value={value}
      generateConfig={generateConfig}
      locale={locale}
      allDayEventRecord={allDayEventRecord}
      timeEventRecord={timeEventRecord}
    />
  );
};

export default Panel;
