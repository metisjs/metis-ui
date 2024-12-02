import React, { useMemo } from 'react';
import type { Dayjs } from 'dayjs';
import type { EventType, SharedPanelProps } from '../interface';
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
  extends Omit<SharedPanelProps<DateType>, 'events'> {
  events?: EventType<DateType>[];
}

const Panel = <DateType extends object = Dayjs>({ events, ...restProps }: PanelProps<DateType>) => {
  const PanelComponent = DefaultComponents[restProps.mode] as typeof MonthPanel;

  const [allDayEvents, timeEvents] = useMemo(
    () => groupEventsByDate(events ?? [], restProps.generateConfig, restProps.locale),
    [events],
  );

  return <PanelComponent {...restProps} allDayEvents={allDayEvents} timeEvents={timeEvents} />;
};

export default Panel;
