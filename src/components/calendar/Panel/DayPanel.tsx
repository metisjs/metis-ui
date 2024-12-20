import React, { useMemo } from 'react';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx, mergeSemanticCls } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import type { AnyObject } from '@util/type';
import type { Dayjs } from 'dayjs';
import { isSameOrAfter } from 'metis-ui/es/date-picker/utils/dateUtil';
import { SolarDay } from 'tyme4ts';
import PickerPanel from '../../date-picker/PickerPanel';
import type { AllDayEventType, SharedPanelProps } from '../interface';
import { getDateKey } from '../util';
import type { TimeGridProps } from './components/TimeGrid';
import TimeGrid from './components/TimeGrid';

export type DayPanelClassName = SemanticClassName<{
  header?: string;
  headerCell?: SemanticClassName<
    { date?: string; weekDay?: string; lunar?: string },
    { today: boolean }
  >;
  body?: string;
  eventGrid?: TimeGridProps['className'];
  calendar?: string;
}>;

export type DayPanelProps<DateType extends AnyObject = Dayjs> = SharedPanelProps<DateType> & {
  className?: DayPanelClassName;
};

const DayPanel = <DateType extends AnyObject = Dayjs>(props: DayPanelProps<DateType>) => {
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
    onEventClick,
  } = props;

  const semanticCls = useSemanticCls(className);

  const weekDaysLocale: string[] =
    locale.fullWeekDays ||
    locale.weekDays ||
    (generateConfig.locale.getShortWeekDays
      ? generateConfig.locale.getShortWeekDays(locale.locale)
      : []);

  const lunarName = useMemo(() => {
    if (lunar) {
      const solarDay = SolarDay.fromYmd(
        generateConfig.getYear(value),
        generateConfig.getMonth(value) + 1,
        generateConfig.getDate(value),
      );
      const lunarDay = solarDay.getLunarDay();
      const lunarMonth = lunarDay.getLunarMonth();
      const lunarYear = lunarMonth.getLunarYear();
      return `${lunarYear.getName().replace('农历', '')}${lunarMonth.getName()}${lunarDay.getName()}`;
    }
  }, [value, lunar]);

  const mergedAllDayEvents = useMemo(() => {
    const weekFirstDate = generateConfig.locale.getWeekFirstDate(locale.locale, value);
    const valueDateKey = getDateKey(value, generateConfig);

    let currentDate = weekFirstDate;
    const events: AllDayEventType<DateType>[] = [];
    while (isSameOrAfter(generateConfig, locale, value, currentDate, 'date')) {
      const currentDateKey = getDateKey(currentDate, generateConfig);
      const diff = generateConfig.diffDate(value, currentDate);

      allDayEventRecord[currentDateKey]?.forEach((event) => {
        if (event.duration > diff) {
          events.push({
            ...event,
            rangeStart: diff === 0 ? event.rangeStart : false,
            rangeEnd: diff === 0 ? event.duration === 1 : event.duration === diff + 1,
          });
        }
      });

      currentDate = generateConfig.addDate(currentDate, 1);
    }

    // Reset index
    events.sort((a, b) => a.index - b.index);
    events.forEach((event, index) => {
      event.index = index;
    });

    return {
      [valueDateKey]: events,
    };
  }, [value, allDayEventRecord]);

  // ========================= Styles =========================
  const rootCls = clsx(`${prefixCls}-day-panel`, 'flex h-0 flex-1 flex-col ps-4', semanticCls.root);

  const headerCls = clsx(
    `${prefixCls}-day-header`,
    'flex justify-between border-b border-border pr-4 text-lg leading-9',
    semanticCls.header,
  );

  const bodyCls = clsx(`${prefixCls}-day-body`, 'flex h-0 flex-1', semanticCls.body);

  const calendarCls = clsx(
    `${prefixCls}-day-calendar`,
    'w-72 border-l border-border-secondary sm:hidden',
    semanticCls.calendar,
  );

  // ========================= Render =========================
  return (
    <div className={rootCls}>
      <div className={headerCls}>
        <div>{weekDaysLocale[generateConfig.getWeekDay(value)]}</div>
        {lunarName && <div>{lunarName}</div>}
      </div>
      <div className={bodyCls}>
        <TimeGrid
          prefixCls={prefixCls}
          className={mergeSemanticCls(
            'relative flex h-full w-0 flex-1 flex-col',
            semanticCls.eventGrid,
          )}
          dates={[value]}
          allDayEventRecord={mergedAllDayEvents}
          timeEventRecord={timeEventRecord}
          selectedEventKeys={selectedEventKeys}
          locale={locale}
          generateConfig={generateConfig}
          eventRender={eventRender}
          onEventClick={onEventClick}
        />
        <div className={calendarCls}>
          <PickerPanel
            prefixCls={prefixCls}
            value={value}
            locale={locale}
            generateConfig={generateConfig}
            mode="date"
            picker="date"
            hideHeader
            className={{ root: 'h-full w-full' }}
            hoverValue={null}
            onSelect={onChange}
          />
        </div>
      </div>
    </div>
  );
};

export default DayPanel;
