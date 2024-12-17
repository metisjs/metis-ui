import type { MouseEvent } from 'react';
import React, { useRef, useState } from 'react';
import type { SemanticRecord } from '@util/classNameUtils';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import type { AnyObject, GetProp, SafeKey } from '@util/type';
import type { Dayjs } from 'dayjs';
import ResizeObserver from 'rc-resize-observer';
import { useEvent } from 'rc-util';
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import { SolarDay } from 'tyme4ts';
import type { CellRenderInfo } from '../../date-picker/interface';
import type { PickerPanelProps, PickerPanelRef } from '../../date-picker/PickerPanel';
import PickerPanel from '../../date-picker/PickerPanel';
import { isSameDate } from '../../date-picker/utils/dateUtil';
import { EVENT_GAP, EVENT_HEIGHT } from '../constant';
import type { AllDayEventType, SharedPanelProps, TimeEventType } from '../interface';
import { getDateKey } from '../util';
import AllDayEvent from './components/AllDayEvent';
import TimeEvent from './components/TimeEvent';
import useWinClick from './hooks/useWinClick';

type CellSemanticClassName = GetProp<
  SemanticRecord<GetProp<PickerPanelProps, 'className'>>,
  'cell'
>;

const MonthPanel = <DateType extends AnyObject = Dayjs>(props: SharedPanelProps<DateType>) => {
  const {
    prefixCls,
    className,
    locale,
    generateConfig,
    value,
    lunar,
    allDayEventRecord,
    timeEventRecord,
    onChange,
    onModeChange,
  } = props;

  const panelRef = React.useRef<PickerPanelRef>(null);

  const semanticCls = useSemanticCls(className);

  const today = generateConfig.getNow();

  // ========================= States =========================
  const [selectedEventKey, setSelectedEventKey] = useState<SafeKey>();
  const [eventMoreInfo, setEventMoreInfo] = useState<
    Record<string, { count: number; index: number }>
  >({});

  useWinClick(() => setSelectedEventKey(undefined));

  const resetEventOutOfView = useEvent(
    (eventRecord: Record<string, (TimeEventType<DateType> | AllDayEventType<DateType>)[]>) => {
      Object.values(eventRecord)
        .flat()
        .forEach((event) => {
          event.outOfView = false;
        });
    },
  );

  const calcEventMore = useEvent(() => {
    const eventContainerHeight =
      (panelRef.current!.nativeElement.offsetHeight - 36) / 6 - 34 - 1 - 4; //  ((PanelHeight - THeadHeight) / 6) - CellValueHeight - BorderHeight - PaddingHeight
    const limit = Math.floor((eventContainerHeight + EVENT_GAP) / (EVENT_HEIGHT + EVENT_GAP));

    const remindHeight = eventContainerHeight - limit * EVENT_HEIGHT - (limit - 1) * EVENT_GAP;

    resetEventOutOfView(allDayEventRecord);
    resetEventOutOfView(timeEventRecord);

    const eventRecord: Record<string, (TimeEventType<DateType> | AllDayEventType<DateType>)[]> =
      Object.fromEntries(
        Object.entries(timeEventRecord).map(([dateKey, events]) => [dateKey, [...events]]),
      );

    const allDayEvents = Object.values(allDayEventRecord).flat();
    for (const event of allDayEvents) {
      for (let i = 0; i < event.duration; i++) {
        const curr = generateConfig.addDate(event.date, i);
        const dateKey = getDateKey(curr, generateConfig);

        if (!eventRecord[dateKey]) {
          eventRecord[dateKey] = [];
        }

        eventRecord[dateKey].push(event);
      }
    }

    Object.values(eventRecord).forEach((events) => {
      const showMore = events.some((event) => event.index + 1 > limit);

      events.forEach((event) => {
        if (showMore) {
          event.outOfView =
            remindHeight >= 16 ? event.index + 1 > limit : event.index + 1 > limit - 1; // 剩余高度放不下more则空出一行显示 +more
        }
      });
    });

    setEventMoreInfo(
      Object.fromEntries(
        Object.entries(eventRecord).map(([dateKey, events]) => {
          const inViewEvents = events.filter((event) => !event.outOfView);
          return [
            dateKey,
            {
              count: events.length - inViewEvents.length,
              index:
                inViewEvents.length === 0
                  ? 0
                  : Math.max(...inViewEvents.map((event) => event.index)) + 1,
            },
          ];
        }),
      ),
    );
  });

  useLayoutEffect(() => calcEventMore(), [calcEventMore, timeEventRecord, allDayEventRecord]);

  // ========================= Events =========================
  const handleGotoDay = (date: DateType, e: MouseEvent) => {
    onChange(date);
    onModeChange('day');
    e.stopPropagation();
  };

  // ========================= Style =========================
  const rootCls = clsx(`${prefixCls}-month-panel`, 'h-full w-full', semanticCls.root);

  const bodyCls = clsx(
    'h-full p-0 *:h-full [&_th]:border-b [&_th]:border-b-border [&_th]:px-3 [&_th]:text-right [&_tr:last-of-type_>_td]:border-b-0',
  );

  const cellCls: CellSemanticClassName = ({ inView }) =>
    clsx(
      'cursor-default border border-border-secondary p-0 first-of-type:border-l-0 last-of-type:border-r-0',
      {
        'bg-fill-quinary': !inView,
      },
    );

  const innerCellCls = clsx(`${prefixCls}-cell-inner`, `${prefixCls}-date`, 'flex h-full flex-col');

  // ========================= Render =========================
  const cellRender = React.useCallback(
    (date: DateType, info: CellRenderInfo): React.ReactNode => {
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

      const dateKey = getDateKey(date, generateConfig);
      const allDayEvents = allDayEventRecord[dateKey] ?? [];
      const timeEvents = timeEventRecord[dateKey] ?? [];

      const isFirstOfWeek =
        generateConfig.getWeekDay(date) === generateConfig.locale.getWeekFirstDay(locale.locale);

      const more = eventMoreInfo[dateKey] ?? { count: 0, index: 0 };
      const moreStyle: React.CSSProperties = {
        left: EVENT_GAP * 4,
        top: more.index * (EVENT_HEIGHT + EVENT_GAP) + EVENT_GAP * 2,
      };

      return (
        <div
          className={clsx(innerCellCls, {
            [`${prefixCls}-date-today`]: isToday,
          })}
        >
          <div className={clsx(`${prefixCls}-date-value`, 'flex items-center px-1 pb-0.5 pt-1')}>
            {lunar && (
              <span
                className={clsx('text-text-secondary', {
                  'text-text-tertiary': !info.inView,
                })}
              >
                {lunarName}
              </span>
            )}
            <span
              className={clsx(
                'ml-auto inline-flex h-7 w-7 items-center justify-end rounded-full px-2',
                {
                  'justify-center bg-primary text-white': isToday,
                },
              )}
              onDoubleClick={(e) => handleGotoDay(date, e)}
            >
              {generateConfig.getDate(date)}
            </span>
          </div>
          <div className={clsx(`${prefixCls}-date-events`, 'relative h-0 flex-1')}>
            {allDayEvents.map(
              ({ key, outOfView, ...rest }) =>
                !outOfView && (
                  <AllDayEvent
                    prefixCls={prefixCls}
                    key={key}
                    eventKey={key}
                    borderWidth={isFirstOfWeek ? 0.5 : 1}
                    {...rest}
                    selected={selectedEventKey === key}
                    onSelect={setSelectedEventKey}
                  />
                ),
            )}
            {timeEvents.map(
              ({ key, outOfView, rangeStart, ...rest }) =>
                !outOfView &&
                rangeStart && (
                  <TimeEvent
                    prefixCls={prefixCls}
                    key={key}
                    eventKey={key}
                    rangeStart={rangeStart}
                    {...rest}
                    selected={selectedEventKey === key}
                    onSelect={setSelectedEventKey}
                  />
                ),
            )}
            {more.count > 0 && (
              <div
                className="absolute text-xs text-text-secondary"
                style={moreStyle}
              >{`+${more.count} ${locale.more}`}</div>
            )}
          </div>
        </div>
      );
    },
    [generateConfig, today, innerCellCls, lunar, allDayEventRecord, timeEventRecord],
  );

  const firstResize = useRef(false);
  return (
    <ResizeObserver
      onResize={() => {
        if (firstResize.current) {
          calcEventMore();
        }
        firstResize.current = true;
      }}
    >
      <PickerPanel
        ref={panelRef}
        pickerValue={value}
        prefixCls={prefixCls}
        locale={{ ...locale, shortWeekDays: locale.weekDays }}
        generateConfig={generateConfig}
        cellRender={cellRender}
        mode="date"
        picker="date"
        hideHeader
        className={{ root: rootCls, body: bodyCls, cell: cellCls }}
        hoverValue={null}
      />
    </ResizeObserver>
  );
};

export default MonthPanel;
