import type { CSSProperties } from 'react';
import React, { useMemo } from 'react';
import { TinyColor } from '@ctrl/tinycolor';
import { ClockOutline } from '@metisjs/icons';
import { clsx } from '@util/classNameUtils';
import { getPresetColorCls, isPresetColor } from '@util/colors';
import type { SafeKey } from '@util/type';
import type { Dayjs } from 'dayjs';
import omit from 'rc-util/lib/omit';
import useTheme from '../../../../theme/useTheme';
import {
  CELL_ONE_HOUR_HEIGHT,
  EVENT_GAP,
  EVENT_HEIGHT,
  TIME_EVENT_INDENT,
} from '../../../constant';
import type { TimeEventGroup, TimeEventType } from '../../../interface';

export interface TimeEventProps<DateType extends object = Dayjs>
  extends Omit<TimeEventType<DateType>, 'key'>,
    React.DOMAttributes<HTMLDivElement> {
  prefixCls: string;
  eventKey: SafeKey;
  selected?: boolean;
}

const TimeEvent = React.forwardRef<HTMLDivElement, TimeEventProps>((props, ref) => {
  const {
    prefixCls,
    title,
    color,
    selected,
    start,
    end,
    rangeStart,
    rangeEnd,
    group,
    offset,
    span,
    ...restProps
  } = props;

  const { primary, isDark } = useTheme();

  const isInternalColor = isPresetColor(color);
  const mergedColor = isInternalColor
    ? getPresetColorCls(color, { rawColor: true })
    : (color ?? primary);

  const bgColor = useMemo(() => {
    const tinyColor = new TinyColor(mergedColor);
    tinyColor.setAlpha(0.65);
    if (isDark) {
      return tinyColor.darken(45).toRgbString();
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

  const secondTextColor = useMemo(() => {
    const tinyColor = new TinyColor(mergedColor);
    if (isDark) {
      return tinyColor.brighten(10).toRgbString();
    }

    return tinyColor.toRgbString();
  }, [color, isDark]);

  const height =
    (end.hour + end.minute / 60 - start.hour - start.minute / 60) * CELL_ONE_HOUR_HEIGHT;

  const zIndex = useMemo(() => group.path.length + 10, [group]);

  /**
   * 获取宽度
   *  X 轴 padding 2*EVENT_GAP
   *  列间距 EVENT_GAP
   */
  const getStyleWidth = (
    info: { group: TimeEventGroup; offset: number; span: number } | null,
  ): string => {
    if (info === null) {
      return `100% - ${EVENT_GAP * 4}px`;
    }

    const { group, span } = info;

    const parentWidth = getStyleWidth(group.parent);
    const indent = group.parent === null || group.parent.unindent ? 0 : TIME_EVENT_INDENT;

    return `((${parentWidth}) - ${indent + EVENT_GAP * (group.column - 1)}px) * ${span / group.column} + ${(span - 1) * EVENT_GAP}px`;
  };

  /**
   * 获取左侧位置
   *  X 轴 padding 2*EVENT_GAP
   *  列间距 EVENT_GAP
   */
  const getStyleLeft = (
    info: { group: TimeEventGroup; offset: number; span: number } | null,
  ): string => {
    if (info === null) {
      return `${EVENT_GAP * 2}px`;
    }

    const { group, offset } = info;

    const parentLeft = getStyleLeft(group.parent);
    const parentWidth = getStyleWidth(group.parent);

    const indent = group.parent === null || group.parent.unindent ? 0 : TIME_EVENT_INDENT;
    // 去除缩进和间距后组宽度
    const groupWidth = `((${parentWidth}) - ${indent + EVENT_GAP * (group.column - 1)}px`;
    const offsetWidth = `(${groupWidth}) * ${offset / group.column}`;

    return `(${parentLeft}) + (${offsetWidth}) + ${indent + offset * EVENT_GAP}px`;
  };

  // ============================== Style ==============================
  const rootCls = clsx(
    `${prefixCls}-time-event`,
    'absolute z-10 select-none overflow-hidden !border-0 py-1 pl-2.5 pr-1 text-xs',
    'before:absolute before:bottom-1.5 before:left-1 before:top-1.5 before:w-[3px] before:rounded-full before:bg-[var(--metis-calendar-event-color)]',
    {
      'rounded-se-md rounded-ss-md': rangeStart,
      'rounded-ee-md rounded-es-md': rangeEnd,
      'py-0.5': height <= EVENT_HEIGHT,
    },
  );

  const titleCls = clsx(`${prefixCls}-time-event-title`, 'w-full break-words');

  const timeCls = clsx(`${prefixCls}-time-event-time`, 'flex w-full items-center gap-0.5 truncate');

  const width = useMemo(
    () => `calc(${getStyleWidth({ group, offset, span })})`,
    [group, offset, span],
  );
  const left = useMemo(
    () => `calc(${getStyleLeft({ group, offset, span })})`,
    [group, offset, span],
  );
  const style: CSSProperties = {
    // @ts-ignore
    ['--metis-calendar-event-color']: mergedColor,
    backgroundColor: selected ? mergedColor : bgColor,
    color: selected ? 'white' : textColor,
    top: (start.hour + start.minute / 60) * CELL_ONE_HOUR_HEIGHT,
    height: Math.max(height, EVENT_HEIGHT),
    left,
    width,
    zIndex: selected ? 199 : zIndex,
    opacity: selected ? 0.8 : 1,
  };

  // ============================== Render ==============================
  const startTime = `${String(start.hour).padStart(2, '0')}:${String(start.minute).padStart(2, '0')}`;
  const endTime = `${String(end.hour).padStart(2, '0')}:${String(end.minute).padStart(2, '0')}`;

  return (
    <div
      ref={ref}
      className={rootCls}
      style={style}
      {...omit(restProps, ['eventKey', 'allDay', 'dateKey'])}
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
}) as unknown as <DateType extends object = Dayjs>(
  props: TimeEventProps<DateType> & {
    ref?: React.Ref<HTMLDivElement>;
  },
) => React.ReactElement;

export default TimeEvent;
