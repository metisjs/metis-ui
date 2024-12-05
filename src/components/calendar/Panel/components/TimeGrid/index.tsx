import React, { useState } from 'react';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import type { AnyObject, SafeKey } from '@util/type';
import { useInterval } from 'ahooks';
import type { Dayjs } from 'dayjs';
import type { GenerateConfig } from '../../../../date-picker/interface';
import { isSame } from '../../../../date-picker/utils/dateUtil';
import Scrollbar from '../../../../scrollbar';
import Tag from '../../../../tag';
import { CELL_ONE_HOUR_HEIGHT, EVENT_GAP, EVENT_HEIGHT } from '../../../constant';
import type { AllDayEventType, CalendarLocale, TimeEventType } from '../../../interface';
import { getDateKey } from '../../../util';
import useWinClick from '../../hooks/useWinClick';
import AllDayEvent from '../AllDayEvent';
import TimeEvent from './TimeEvent';

export interface TimeGridProps<DateType extends AnyObject = Dayjs> {
  prefixCls: string;
  className?: SemanticClassName;
  allDayEventRecord: Record<string, AllDayEventType<DateType>[]>;
  timeEventRecord: Record<string, TimeEventType<DateType>[]>;
  dates: DateType[];
  locale: CalendarLocale;
  generateConfig: GenerateConfig<DateType>;
}

const TimeGrid = <DateType extends AnyObject = Dayjs>(props: TimeGridProps<DateType>) => {
  const {
    prefixCls,
    className,
    allDayEventRecord,
    timeEventRecord,
    dates,
    locale,
    generateConfig,
  } = props;

  // ========================= States =======================
  const [hour, setHour] = useState<number>();
  const [minute, setMinute] = useState<number>();
  const [selectedEventKey, setSelectedEventKey] = useState<SafeKey>();

  useWinClick(() => setSelectedEventKey(undefined));

  useInterval(
    () => {
      const now = generateConfig.getNow();
      setHour(generateConfig.getHour(now));
      setMinute(generateConfig.getMinute(now));
    },
    1000,
    { immediate: true },
  );

  // ========================= Styles =======================
  const semanticCls = useSemanticCls(className);

  const rootCls = clsx(
    `${prefixCls}-time-grid`,
    'flex h-0 flex-1 flex-col text-xs',
    semanticCls.root,
  );

  const allDayRowCls = clsx(
    `${prefixCls}-time-event-row-all-day`,
    'flex h-auto divide-x divide-border-secondary border-b-2 border-b-border-secondary leading-6 *:top-0',
  );

  const timeColumnCls = clsx(
    `${prefixCls}-time-grid-column`,
    `${prefixCls}-time-grid-column-time`,
    'relative h-fit w-12',
  );

  const columnCls = clsx(
    `${prefixCls}-time-grid-column`,
    'relative h-fit w-0 flex-1 divide-y divide-border-tertiary',
  );

  const placeholderCellCls = clsx(
    `${prefixCls}-time-event-placeholder`,
    'relative -top-2 h-[10px] w-full pr-1 text-right text-text-tertiary empty:top-0',
  );

  const timeCellCls = clsx(
    `${prefixCls}-time-event-time`,
    'relative -top-2 w-12 pr-1 text-right text-text-tertiary',
  );

  const eventCellCls = clsx(
    `${prefixCls}-time-event-cell`,
    'relative h-full min-h-6 w-full flex-1',
  );

  const nowTagCls = clsx(
    `${prefixCls}-time-event-now-tag`,
    'absolute right-[calc(100%-3rem+0.25rem)] bg-primary px-1 py-0.5 text-white transition-all',
  );

  const nowLineCls = clsx(
    `${prefixCls}-time-event-now-line`,
    'absolute right-0 z-[100] h-px w-[calc(100%-3rem+0.25rem)] bg-primary opacity-45 transition-all',
  );

  // ========================= Render =======================
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
          className={{ root: 'w-0 flex-1', view: 'flex divide-x divide-border-secondary' }}
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
                {events.map(({ key, ...rest }) => (
                  <AllDayEvent
                    prefixCls={prefixCls}
                    key={key}
                    eventKey={key}
                    {...rest}
                    maxDuration={dates.length}
                    selected={selectedEventKey === key}
                    onSelect={setSelectedEventKey}
                  />
                ))}
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
          <div className="relative divide-y divide-border-tertiary">
            {Array.from({ length: 24 }).map((_, index) => (
              <div key={index} className={eventCellCls} style={{ height: CELL_ONE_HOUR_HEIGHT }} />
            ))}
            {events.map(({ key, ...rest }) => (
              <TimeEvent
                prefixCls={prefixCls}
                key={key}
                eventKey={key}
                {...rest}
                selected={selectedEventKey === key}
                onSelect={setSelectedEventKey}
              />
            ))}
          </div>
          <div className={placeholderCellCls}></div>
        </div>
      );
    });

  const renderBaseline = () => {
    const now = generateConfig.getNow();
    const includeToday = dates.some((d) => isSame(generateConfig, locale, d, now, 'date'));

    if (!hour || !minute || !includeToday) return null;

    const top = hour * CELL_ONE_HOUR_HEIGHT + (minute * CELL_ONE_HOUR_HEIGHT) / 60;
    return (
      <>
        <Tag bordered={false} className={nowTagCls} style={{ top }}>
          {String(hour).padStart(2, '0')}:{String(minute).padStart(2, '0')}
        </Tag>
        <div className={nowLineCls} style={{ top: top + 9.5 }} />
      </>
    );
  };

  return (
    <div className={rootCls}>
      {renderAllDayRow()}
      <Scrollbar className={{ view: 'flex divide-x divide-border-secondary' }}>
        {renderTimeColumn()}
        {renderEventColumns()}
        {renderBaseline()}
      </Scrollbar>
    </div>
  );
};

export default TimeGrid;
