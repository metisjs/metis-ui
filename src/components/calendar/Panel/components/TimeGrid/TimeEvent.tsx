import type { CSSProperties } from 'react';
import React, { useMemo } from 'react';
import { TinyColor } from '@ctrl/tinycolor';
import { ClockOutline } from '@metisjs/icons';
import { clsx } from '@util/classNameUtils';
import { getPresetColorCls, isPresetColor } from '@util/colors';
import type { SafeKey } from '@util/type';
import type { Dayjs } from 'dayjs';
import useTheme from '../../../../theme/useTheme';
import { CELL_ONE_HOUR_HEIGHT, EVENT_GAP, EVENT_HEIGHT } from '../../../constant';
import type { TimeEventType } from '../../../interface';

interface TimeEventProps<DateType extends object = Dayjs> extends TimeEventType<DateType> {
  prefixCls: string;
  eventKey: SafeKey;
  selected?: boolean;
  borderWidth?: number;
  onSelect?: (key: SafeKey) => void;
}

const TimeEvent = <DateType extends object = Dayjs>(props: TimeEventProps<DateType>) => {
  const {
    prefixCls,
    eventKey,
    title,
    color,
    indent,
    selected,
    start,
    end,
    rangeStart,
    rangeEnd,
    onSelect,
  } = props;

  const { primary, isDark } = useTheme();

  const isInternalColor = isPresetColor(color);
  const mergedColor = isInternalColor
    ? getPresetColorCls(color, { rawColor: true })
    : (color ?? primary);

  const bgColor = useMemo(() => {
    const tinyColor = new TinyColor(mergedColor);
    if (isDark) {
      return tinyColor.darken(45).toRgbString();
    }

    return tinyColor.brighten(50).toRgbString();
  }, [color, isDark]);

  const secondTextColor = useMemo(() => {
    const tinyColor = new TinyColor(mergedColor);
    if (isDark) {
      return tinyColor.darken(10).toRgbString();
    }

    return tinyColor.brighten(15).toRgbString();
  }, [color, isDark]);

  const height =
    (end.hour + end.minute / 60 - start.hour - start.minute / 60) * CELL_ONE_HOUR_HEIGHT;

  const rootCls = clsx(
    `${prefixCls}-time-event`,
    'absolute z-10 select-none overflow-hidden !border-0 py-1 pl-2 pr-1 text-xs',
    'before:absolute before:bottom-1 before:left-0.5 before:top-1 before:w-[3px] before:rounded-full before:bg-[var(--metis-calendar-event-color)]',
    {
      'rounded-se-md rounded-ss-md': rangeStart,
      'rounded-ee-md rounded-es-md': rangeEnd,
      'py-0.5': height <= EVENT_HEIGHT,
    },
  );

  const titleCls = clsx(`${prefixCls}-time-event-title`, 'w-full truncate');

  const timeCls = clsx(`${prefixCls}-time-event-time`, 'flex w-full items-center gap-1 truncate');

  const style: CSSProperties = {
    // @ts-ignore
    ['--metis-calendar-event-color']: mergedColor,
    backgroundColor: selected ? mergedColor : bgColor,
    color: selected ? 'white' : mergedColor,
    top: (start.hour + start.minute / 60) * CELL_ONE_HOUR_HEIGHT,
    height: Math.max(height, EVENT_HEIGHT),
    left: EVENT_GAP * 2 + indent * EVENT_GAP * 8,
    right: EVENT_GAP * 2,
    zIndex: selected ? 99 : indent + 10,
    opacity: selected ? 0.8 : 1,
  };

  const startTime = `${String(start.hour).padStart(2, '0')}:${String(start.minute).padStart(2, '0')}`;
  const endTime = `${String(end.hour).padStart(2, '0')}:${String(end.minute).padStart(2, '0')}`;

  return (
    <div
      className={rootCls}
      style={style}
      onClick={(e) => {
        if (!selected) {
          onSelect?.(eventKey);
        }
        e.stopPropagation();
      }}
    >
      <div className={titleCls}>{title}</div>
      {rangeStart && (
        <div className={timeCls} style={{ color: selected ? 'white' : secondTextColor }}>
          <ClockOutline />
          {startTime}
          {rangeEnd && `~${endTime}`}
        </div>
      )}
    </div>
  );
};

export default TimeEvent;
