import type { CSSProperties } from 'react';
import React, { useMemo } from 'react';
import { TinyColor } from '@ctrl/tinycolor';
import { CalendarOutline } from '@metisjs/icons';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx } from '@util/classNameUtils';
import { getPresetColorCls, isPresetColor } from '@util/colors';
import useSemanticCls from '@util/hooks/useSemanticCls';
import type { SafeKey } from '@util/type';
import type { Dayjs } from 'dayjs';
import omit from 'rc-util/es/omit';
import useTheme from '../../../theme/useTheme';
import { EVENT_GAP, EVENT_HEIGHT } from '../../constant';
import type { AllDayEventType } from '../../interface';

export interface AllDayEventProps<DateType extends object = Dayjs>
  extends Omit<AllDayEventType<DateType>, 'key'>,
    React.DOMAttributes<HTMLDivElement> {
  prefixCls: string;
  className?: SemanticClassName<{ icon?: string; title?: string }>;
  eventKey: SafeKey;
  selected?: boolean;
  borderWidth?: number;
  maxDuration?: number;
}

const AllDayEvent = React.forwardRef<HTMLDivElement, AllDayEventProps>((props, ref) => {
  const {
    prefixCls,
    className,
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
    ...restProps
  } = props;

  const { primary, isDark } = useTheme();

  const semanticCls = useSemanticCls(className);

  const isInternalColor = isPresetColor(color);
  const mergedColor = isInternalColor
    ? getPresetColorCls(color, { rawColor: true })
    : (color ?? primary);

  const bgColor = useMemo(() => {
    const tinyColor = new TinyColor(mergedColor);
    if (isDark) {
      return tinyColor.darken(color ? 35 : 45).toRgbString();
    }

    return tinyColor.brighten(50).toRgbString();
  }, [color, isDark]);

  const textColor = useMemo(() => {
    const tinyColor = new TinyColor(mergedColor);
    if (isDark) {
      return tinyColor.brighten(40).toRgbString();
    }

    return tinyColor.darken(20).toRgbString();
  }, [color, isDark]);

  const rootCls = clsx(
    `${prefixCls}-allday-event`,
    'absolute z-10 flex select-none items-center gap-1 px-0.5 text-xs',
    {
      'rounded-s-full': rangeStart,
      'rounded-e-full': rangeEnd,
      'pl-6': !rangeStart,
    },
    semanticCls.root,
  );

  const iconCls = clsx(
    `${prefixCls}-allday-event-icon`,
    'flex h-4 w-4 items-center justify-center rounded-full text-white',
    semanticCls.icon,
  );

  const titleCls = clsx(
    `${prefixCls}-allday-event-title`,
    'w-0 flex-1 truncate text-left',
    semanticCls.title,
  );

  const mergedDuration = Math.min(duration, maxDuration);
  const style: CSSProperties = {
    height: EVENT_HEIGHT,
    width: `calc(${mergedDuration * 100}% + ${(mergedDuration - 1) * borderWidth}px - ${rangeStart ? EVENT_GAP * 2 : 0}px - ${rangeEnd ? EVENT_GAP * 2 : 0}px)`,
    top: index * (EVENT_HEIGHT + EVENT_GAP) + EVENT_GAP * 2,
    left: rangeStart ? EVENT_GAP * 2 : 0,
    backgroundColor: selected ? mergedColor : bgColor,
    color: selected ? 'white' : textColor,
  };

  return (
    <div
      ref={ref}
      className={rootCls}
      style={style}
      {...omit(restProps, ['eventKey', 'allDay', 'dateKey'])}
    >
      {rangeStart && icon && (
        <span className={iconCls} style={{ backgroundColor: mergedColor }}>
          {icon}
        </span>
      )}
      <span className={titleCls}>{title}</span>
    </div>
  );
}) as unknown as <DateType extends object = Dayjs>(
  props: AllDayEventProps<DateType> & {
    ref?: React.Ref<HTMLDivElement>;
  },
) => React.ReactElement;

export default AllDayEvent;
