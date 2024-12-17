import type { CSSProperties } from 'react';
import React from 'react';
import { clsx } from '@util/classNameUtils';
import { getPresetColorCls, isPresetColor } from '@util/colors';
import type { SafeKey } from '@util/type';
import type { Dayjs } from 'dayjs';
import useTheme from '../../../theme/useTheme';
import { EVENT_GAP, EVENT_HEIGHT } from '../../constant';
import type { TimeEventType } from '../../interface';

interface TimeEventProps<DateType extends object = Dayjs> extends TimeEventType<DateType> {
  prefixCls: string;
  eventKey: SafeKey;
  selected?: boolean;
  onClick?: (domEvent: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const TimeEvent = <DateType extends object = Dayjs>(props: TimeEventProps<DateType>) => {
  const { prefixCls, title, color, index, selected, start, onClick } = props;

  const { primary } = useTheme();

  const isInternalColor = isPresetColor(color);
  const mergedColor = isInternalColor
    ? getPresetColorCls(color, { rawColor: true })
    : (color ?? primary);

  const rootCls = clsx(
    `${prefixCls}-time-event`,
    'absolute z-10 flex select-none items-center gap-1 rounded pl-2 pr-1 text-xs text-text',
    'before:absolute before:bottom-1 before:left-0.5 before:top-1 before:w-[3px] before:rounded-full before:bg-[var(--metis-calendar-event-color)]',
    {
      'text-white': selected,
    },
  );

  const titleCls = clsx(`${prefixCls}-time-event-title`, 'w-0 flex-1 truncate text-left');

  const startCls = clsx(`${prefixCls}-time-event-start`, 'text-text-tertiary', {
    'text-white': selected,
  });

  const style: CSSProperties = {
    // @ts-ignore
    ['--metis-calendar-event-color']: mergedColor,
    height: EVENT_HEIGHT,
    top: index * (EVENT_HEIGHT + EVENT_GAP) + EVENT_GAP * 2,
    left: EVENT_GAP * 2,
    right: EVENT_GAP * 2,
    backgroundColor: selected ? mergedColor : 'unset',
  };

  const startTime = `${String(start.hour).padStart(2, '0')}:${String(start.minute).padStart(2, '0')}`;

  return (
    <div className={rootCls} style={style} onClick={onClick}>
      <span className={titleCls}>{title}</span>
      <span className={startCls}>{startTime}</span>
    </div>
  );
};

export default TimeEvent;
