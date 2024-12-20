import React, { useMemo } from 'react';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx, getSemanticCls } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import type { AnyObject } from '@util/type';
import type { Dayjs } from 'dayjs';
import { SolarDay } from 'tyme4ts';
import { isSameDate } from '../../date-picker/utils/dateUtil';
import type { SharedPanelProps } from '../interface';
import type { TimeGridProps } from './components/TimeGrid';
import TimeGrid from './components/TimeGrid';

export type WeekPanelClassName = SemanticClassName<{
  header?: string;
  headerCell?: SemanticClassName<
    { date?: string; weekDay?: string; lunar?: string },
    { today: boolean }
  >;
  body?: TimeGridProps['className'];
}>;

export type WeekPanelProps<DateType extends AnyObject = Dayjs> = SharedPanelProps<DateType> & {
  className?: WeekPanelClassName;
};

const WeekPanel = <DateType extends AnyObject = Dayjs>(props: WeekPanelProps<DateType>) => {
  const {
    prefixCls,
    className,
    locale,
    generateConfig,
    value,
    allDayEventRecord,
    timeEventRecord,
    lunar,
    selectedEventKeys,
    eventRender,
    onChange,
    onModeChange,
    onEventClick,
  } = props;

  const semanticCls = useSemanticCls(className);

  const today = generateConfig.getNow();

  const weekDates = useMemo(() => {
    const weekFirst = generateConfig.locale.getWeekFirstDate(locale.locale, value);
    return Array.from({ length: 7 }).map((_, index) => generateConfig.addDate(weekFirst, index));
  }, [value, generateConfig]);

  const weekDaysLocale: string[] =
    locale.weekDays ||
    (generateConfig.locale.getShortWeekDays
      ? generateConfig.locale.getShortWeekDays(locale.locale)
      : []);

  // ========================= Events =========================
  const handleGotoDay = (date: DateType) => {
    onChange(date);
    onModeChange('day');
  };

  // ========================= Style =========================
  const rootCls = clsx(
    `${prefixCls}-week-panel`,
    'flex h-0 flex-1 flex-col ps-4',
    semanticCls.root,
  );

  const headerCls = clsx(
    `${prefixCls}-week-header`,
    'flex select-none border-b border-border pl-12',
    semanticCls.header,
  );

  // ========================= Render =========================
  return (
    <div className={rootCls}>
      <div className={headerCls}>
        {weekDates.map((date) => {
          const isToday = isSameDate(generateConfig, today, date);

          const cellSemanticCls = getSemanticCls(semanticCls.headerCell, { today: isToday });

          const headerCellCls = clsx(
            `${prefixCls}-week-header-cell`,
            'inline-flex h-9 w-0 flex-1 items-center justify-center gap-1',
            cellSemanticCls.root,
          );

          let lunarName;

          if (lunar) {
            const solarDay = SolarDay.fromYmd(
              generateConfig.getYear(date),
              generateConfig.getMonth(date) + 1,
              generateConfig.getDate(date),
            );
            const lunarDay = solarDay.getLunarDay();
            lunarName = lunarDay.getName();
          }

          return (
            <div key={generateConfig.getWeekDay(date)} className={headerCellCls}>
              <span
                className={clsx(
                  `${prefixCls}-week-header-date`,
                  isToday &&
                    'inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white',
                  cellSemanticCls.date,
                )}
                onDoubleClick={() => handleGotoDay(date)}
              >
                {generateConfig.getDate(date)}
              </span>
              <span
                className={clsx(
                  `${prefixCls}-week-header-week-day`,
                  'text-text-secondary xs:hidden',
                  cellSemanticCls.weekDay,
                )}
              >
                {weekDaysLocale[generateConfig.getWeekDay(date)]}
              </span>
              <span
                className={clsx(
                  `${prefixCls}-week-header-lunar`,
                  'ml-2 text-text-secondary empty:hidden md:hidden',
                  cellSemanticCls.lunar,
                )}
              >
                {lunarName}
              </span>
            </div>
          );
        })}
      </div>
      <TimeGrid
        prefixCls={prefixCls}
        className={semanticCls.body}
        dates={weekDates}
        allDayEventRecord={allDayEventRecord}
        timeEventRecord={timeEventRecord}
        selectedEventKeys={selectedEventKeys}
        locale={locale}
        generateConfig={generateConfig}
        eventRender={eventRender}
        onEventClick={onEventClick}
      />
    </div>
  );
};

export default WeekPanel;
