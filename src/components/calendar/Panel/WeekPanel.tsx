import React, { useMemo } from 'react';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import type { AnyObject } from '@util/type';
import type { Dayjs } from 'dayjs';
import { SolarDay } from 'tyme4ts';
import { isSameDate } from '../../date-picker/utils/dateUtil';
import type { SharedPanelProps } from '../interface';
import TimeGrid from './components/TimeGrid';

const WeekPanel = <DateType extends AnyObject = Dayjs>(props: SharedPanelProps<DateType>) => {
  const {
    prefixCls,
    className,
    locale,
    generateConfig,
    value,
    allDayEventRecord,
    timeEventRecord,
    lunar,
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

  // ========================= Style =========================
  const rootCls = clsx(
    `${prefixCls}-week-panel`,
    'flex h-0 flex-1 flex-col ps-4',
    semanticCls.root,
  );

  const headerCls = clsx(`${prefixCls}-week-header`, 'flex border-b border-border pl-12');

  const headerCellCls = clsx(
    `${prefixCls}-week-header-cell`,
    'inline-flex h-9 w-0 flex-1 items-center justify-center gap-1',
  );

  // ========================= Render =========================
  return (
    <div className={rootCls}>
      <div className={headerCls}>
        {weekDates.map((date) => {
          const isToday = isSameDate(generateConfig, today, date);
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
                  isToday &&
                    'inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white',
                )}
              >
                {generateConfig.getDate(date)}
              </span>
              <span className="text-text-secondary xs:hidden">
                {weekDaysLocale[generateConfig.getWeekDay(date)]}
              </span>
              <span className="ml-2 text-text-secondary empty:hidden md:hidden">{lunarName}</span>
            </div>
          );
        })}
      </div>
      <TimeGrid
        prefixCls={prefixCls}
        dates={weekDates}
        allDayEventRecord={allDayEventRecord}
        timeEventRecord={timeEventRecord}
        locale={locale}
        generateConfig={generateConfig}
      />
    </div>
  );
};

export default WeekPanel;
