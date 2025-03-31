import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import type { AnyObject, SafeKey } from '@util/type';
import { useInterval } from 'ahooks';
import type { Dayjs } from 'dayjs';
import type { GenerateConfig } from '../../../../date-picker/interface';
import { isSame } from '../../../../date-picker/utils/dateUtil';
import type { ScrollbarRef } from '../../../../scrollbar';
import Scrollbar from '../../../../scrollbar';
import Tag from '../../../../tag';
import { CELL_ONE_HOUR_HEIGHT, EVENT_GAP, EVENT_HEIGHT } from '../../../constant';
import type {
  AllDayEventType,
  CalendarLocale,
  EventRender,
  EventType,
  TimeEventType,
} from '../../../interface';
import { getDateKey } from '../../../util';
import type { AllDayEventProps } from '../AllDayEvent';
import AllDayEvent from '../AllDayEvent';
import type { TimeEventProps } from './TimeEvent';
import TimeEvent from './TimeEvent';

export interface TimeGridProps<DateType extends AnyObject = Dayjs> {
  prefixCls: string;
  className?: SemanticClassName<{
    allDayRow?: string;
    timeColumn?: string;
    eventColumn?: string;
    eventCell?: string;
    nowTag?: string;
    nowLine?: string;
    timeCell?: string;
    allDayEvent?: AllDayEventProps['className'];
    timeEvent?: TimeEventProps['className'];
  }>;
  allDayEventRecord: Record<string, AllDayEventType<DateType>[]>;
  timeEventRecord: Record<string, TimeEventType<DateType>[]>;
  dates: DateType[];
  locale: CalendarLocale;
  generateConfig: GenerateConfig<DateType>;
  selectedEventKeys?: SafeKey[];
  eventRender?: EventRender<DateType>;
  onEventClick?: (
    event: EventType<DateType>,
    domEvent: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void;
}

const TimeGrid = <DateType extends AnyObject = Dayjs>(props: TimeGridProps<DateType>) => {
  const {
    prefixCls,
    className,
    allDayEventRecord,
    timeEventRecord,
    dates,
    selectedEventKeys,
    locale,
    generateConfig,
    eventRender,
    onEventClick,
  } = props;

  // ========================= States =======================
  const [hour, setHour] = useState<number>(-1);
  const [minute, setMinute] = useState<number>(-1);

  const scrollbarRef = useRef<ScrollbarRef>(null);

  useInterval(
    () => {
      const now = generateConfig.getNow();
      setHour(generateConfig.getHour(now));
      setMinute(generateConfig.getMinute(now));
    },
    1000,
    { immediate: true },
  );

  const includeToday = useMemo(
    () => dates.some((d) => isSame(generateConfig, locale, d, generateConfig.getNow(), 'date')),
    [],
  );

  useEffect(() => {
    if (includeToday && hour) {
      scrollbarRef.current?.scrollTo(0, CELL_ONE_HOUR_HEIGHT * hour);
    }
  }, [hour]);

  // ========================= Styles =======================
  const semanticCls = useSemanticCls(className);

  const rootCls = clsx(
    `${prefixCls}-time-grid`,
    'flex h-0 flex-1 flex-col text-xs',
    semanticCls.root,
  );

  const allDayRowCls = clsx(
    `${prefixCls}-time-event-row-all-day`,
    'divide-border-secondary border-b-border-secondary flex h-auto divide-x border-b-2 leading-6 *:top-0',
    semanticCls.allDayRow,
  );

  const timeColumnCls = clsx(
    `${prefixCls}-time-grid-column`,
    `${prefixCls}-time-grid-column-time`,
    'relative h-fit w-12',
    semanticCls.timeColumn,
  );

  const columnCls = clsx(
    `${prefixCls}-time-grid-column`,
    'divide-border-tertiary relative h-fit w-0 flex-1 divide-y',
    semanticCls.eventColumn,
  );

  const placeholderCellCls = clsx(
    `${prefixCls}-time-event-placeholder`,
    'text-text-tertiary relative -top-2 h-[10px] w-full pr-1 text-right empty:top-0',
  );

  const timeCellCls = clsx(
    `${prefixCls}-time-event-time`,
    'text-text-tertiary relative -top-2 w-12 pr-1 text-right',
    semanticCls.timeCell,
  );

  const eventCellCls = clsx(
    `${prefixCls}-time-event-cell`,
    'relative h-full min-h-6 w-full flex-1',
    semanticCls.eventCell,
  );

  const nowTagCls = clsx(
    `${prefixCls}-time-event-now-tag`,
    'bg-primary absolute right-[calc(100%-3rem+0.25rem)] z-101 px-1 py-0.5 text-white',
    semanticCls.nowTag,
  );

  const nowLineCls = clsx(
    `${prefixCls}-time-event-now-line`,
    'bg-primary absolute right-0 z-100 h-0.5 w-[calc(100%-3rem+0.5rem)]',
    semanticCls.nowLine,
  );

  // ========================= Render =======================
  const allDayEventRender = (props: AllDayEventProps<DateType>) => {
    if (eventRender) {
      return eventRender(props, AllDayEvent);
    }
    return <AllDayEvent key={props.eventKey} {...props} className={semanticCls.allDayEvent} />;
  };

  const timeEventRender = (props: TimeEventProps<DateType>) => {
    if (eventRender) {
      return eventRender(props, TimeEvent);
    }
    return <TimeEvent key={props.eventKey} {...props} className={semanticCls.timeEvent} />;
  };

  const renderAllDayRow = () => {
    const rowCount =
      dates.reduce((max, date) => {
        const dateKey = getDateKey(date, generateConfig);
        const events = allDayEventRecord[dateKey] ?? [];
        return Math.max(
          max,
          events.reduce((max, item) => Math.max(max, item.index), 0),
        );
      }, 0) + 1;

    return (
      <div className={allDayRowCls}>
        <div className={timeCellCls}>{locale.allDay}</div>
        <Scrollbar
          autoHeight={[24, 108]}
          className={{ root: 'w-0 flex-1', view: 'divide-border-secondary flex divide-x' }}
        >
          {dates.map((date) => {
            const dateKey = getDateKey(date, generateConfig);
            const events = allDayEventRecord[dateKey] ?? [];
            const height = EVENT_HEIGHT * rowCount + EVENT_GAP * (rowCount - 1) + EVENT_GAP * 4;

            return (
              <div
                key={generateConfig.getDate(date)}
                className={eventCellCls}
                style={{ minHeight: height }}
              >
                {events.map(({ key, ...rest }) =>
                  allDayEventRender({
                    prefixCls,
                    eventKey: key,
                    ...rest,
                    maxDuration: dates.length,
                    selected: selectedEventKeys?.includes(key),
                    onClick: (e) => onEventClick?.(rest.data, e),
                  }),
                )}
              </div>
            );
          })}
        </Scrollbar>
      </div>
    );
  };

  const renderTimeColumn = () => (
    <div className={timeColumnCls}>
      <div className={placeholderCellCls}></div>
      {Array.from({ length: 24 }).map((_, index) => (
        <div key={index} className={timeCellCls} style={{ height: CELL_ONE_HOUR_HEIGHT }}>
          {`${String(index).padStart(2, '0')}:00`}
        </div>
      ))}
      <div className={placeholderCellCls}>00:00</div>
    </div>
  );

  const renderEventColumns = () =>
    dates.map((date) => {
      const dateKey = getDateKey(date, generateConfig);
      const events = timeEventRecord[dateKey] ?? [];

      return (
        <div key={dateKey} className={columnCls}>
          <div className={placeholderCellCls}></div>
          <div className="divide-border-tertiary relative divide-y">
            {Array.from({ length: 24 }).map((_, index) => (
              <div key={index} className={eventCellCls} style={{ height: CELL_ONE_HOUR_HEIGHT }} />
            ))}
            {events.map(({ key, ...rest }) =>
              timeEventRender({
                prefixCls,
                eventKey: key,
                ...rest,
                selected: selectedEventKeys?.includes(key),
                onClick: (e) => onEventClick?.(rest.data, e),
              }),
            )}
          </div>
          <div className={placeholderCellCls}></div>
        </div>
      );
    });

  const renderBaseline = () => {
    const now = generateConfig.getNow();
    const includeToday = dates.some((d) => isSame(generateConfig, locale, d, now, 'date'));

    if (hour < 0 || minute < 0 || !includeToday) return null;

    const top = hour * CELL_ONE_HOUR_HEIGHT + (minute * CELL_ONE_HOUR_HEIGHT) / 60;
    return (
      <>
        <Tag bordered={false} className={nowTagCls} style={{ top }}>
          {String(hour).padStart(2, '0')}:{String(minute).padStart(2, '0')}
        </Tag>
        <div className={nowLineCls} style={{ top: top + 9 }} />
      </>
    );
  };

  return (
    <div className={rootCls}>
      {renderAllDayRow()}
      <Scrollbar ref={scrollbarRef} className={{ view: 'divide-border-secondary flex divide-x' }}>
        {renderTimeColumn()}
        {renderEventColumns()}
        {renderBaseline()}
      </Scrollbar>
    </div>
  );
};

export default TimeGrid;
