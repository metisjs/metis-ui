import React, { useMemo } from 'react';
import type { Dayjs } from 'dayjs';
import { SolarDay } from 'tyme4ts';
import { clsx } from '../../_util/classNameUtils';
import useSemanticCls from '../../_util/hooks/useSemanticCls';
import type { AnyObject } from '../../_util/type';
import PickerPanel from '../../date-picker/PickerPanel';
import type { SharedPanelProps } from '../interface';
import TimeEvents from './components/TimeEvents';

const DayPanel = <DateType extends AnyObject = Dayjs>(props: SharedPanelProps<DateType>) => {
  const { prefixCls, className, locale, generateConfig, value, events, lunar, onChange } = props;

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

  // ========================= Styles =========================
  const rootCls = clsx(`${prefixCls}-day-panel`, 'flex h-0 flex-1 flex-col ps-4', semanticCls.root);

  const headerCls = clsx(
    `${prefixCls}-day-header`,
    'flex justify-between border-b border-border pr-4 text-lg leading-9',
  );

  const bodyCls = clsx(`${prefixCls}-day-body`, 'flex h-0 flex-1');

  const eventsCls = clsx(`${prefixCls}-day-event-container`, 'flex w-0 flex-1 flex-col');

  const calendarCls = clsx(
    `${prefixCls}-day-calendar`,
    'w-72 border-l border-border-secondary sm:hidden',
  );

  // ========================= Render =========================
  return (
    <div className={rootCls}>
      <div className={headerCls}>
        <div>{weekDaysLocale[generateConfig.getWeekDay(value)]}</div>
        {lunarName && <div>{lunarName}</div>}
      </div>
      <div className={bodyCls}>
        <div className={eventsCls}>
          <TimeEvents
            prefixCls={prefixCls}
            dates={[value]}
            events={events}
            locale={locale}
            generateConfig={generateConfig}
          />
        </div>
        <div className={calendarCls}>
          <PickerPanel
            value={value}
            prefixCls={prefixCls}
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
