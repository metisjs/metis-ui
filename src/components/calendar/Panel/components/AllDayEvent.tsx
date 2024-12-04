import type { CSSProperties } from 'react';
import React, { useMemo } from 'react';
import { TinyColor } from '@ctrl/tinycolor';
import { CalendarOutline } from '@metisjs/icons';
import { clsx } from '@util/classNameUtils';
import { getPresetColorCls, isPresetColor } from '@util/colors';
import type { SafeKey } from '@util/type';
import type { Dayjs } from 'dayjs';
import useTheme from '../../../theme/useTheme';
import { EVENT_GAP, EVENT_HEIGHT } from '../../constant';
import type { AllDayEventType } from '../../interface';

interface AllDayEventProps<DateType extends object = Dayjs> extends AllDayEventType<DateType> {
  prefixCls: string;
  eventKey: SafeKey;
  selected?: boolean;
  borderWidth?: number;
  maxDuration?: number;
  onSelect?: (key: SafeKey) => void;
}

const AllDayEvent = <DateType extends object = Dayjs>(props: AllDayEventProps<DateType>) => {
  const {
    prefixCls,
    eventKey,
    icon = <CalendarOutline />,
    title,
    color,
    duration,
    maxDuration = duration,
    rangeStart,
    rangeEnd,
    index,
    borderWidth = 1,
    selected,
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

  const rootCls = clsx(
    `${prefixCls}-allday-event`,
    'absolute z-10 flex select-none items-center gap-1 px-0.5 text-xs transition-colors',
    {
      'rounded-s-full': rangeStart,
      'rounded-e-full': rangeEnd,
      'pl-3': !rangeStart,
    },
  );

  const iconCls = clsx(
    `${prefixCls}-allday-event-icon`,
    'flex h-4 w-4 items-center justify-center rounded-full text-white',
  );

  const titleCls = clsx(`${prefixCls}-allday-event-title`, 'w-0 flex-1 truncate text-left');

  const mergedDuration = Math.min(duration, maxDuration);
  const style: CSSProperties = {
    height: EVENT_HEIGHT,
    width: `calc(${mergedDuration * 100}% + ${(mergedDuration - 1) * borderWidth}px - ${rangeStart ? EVENT_GAP * 2 : 0}px - ${rangeEnd ? EVENT_GAP * 2 : 0}px)`,
    top: index * (EVENT_HEIGHT + EVENT_GAP) + EVENT_GAP * 2,
    left: rangeStart ? EVENT_GAP * 2 : 0,
    backgroundColor: selected ? mergedColor : bgColor,
    color: selected ? 'white' : mergedColor,
  };

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
      {rangeStart && (
        <span className={iconCls} style={{ backgroundColor: mergedColor }}>
          {icon}
        </span>
      )}
      <span className={titleCls}>{title}</span>
    </div>
  );
};

export default AllDayEvent;
