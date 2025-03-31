import type { CSSProperties } from 'react';
import React from 'react';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx } from '@util/classNameUtils';
import { getPresetColorCls, isPresetColor } from '@util/colors';
import useSemanticCls from '@util/hooks/useSemanticCls';
import type { SafeKey } from '@util/type';
import type { Dayjs } from 'dayjs';
import omit from 'rc-util/es/omit';
import useTheme from '../../../theme/useTheme';
import { EVENT_GAP, EVENT_HEIGHT } from '../../constant';
import type { TimeEventType } from '../../interface';

export interface TimeEventProps<DateType extends object = Dayjs>
  extends Omit<TimeEventType<DateType>, 'key'>,
    React.DOMAttributes<HTMLDivElement> {
  prefixCls: string;
  className?: SemanticClassName<{ time?: string; title?: string }>;
  eventKey: SafeKey;
  selected?: boolean;
}

const TimeEvent = React.forwardRef<HTMLDivElement, TimeEventProps>((props, ref) => {
  const { prefixCls, className, title, color, index, selected, start, ...restProps } = props;

  const { primary } = useTheme();

  const semanticCls = useSemanticCls(className);

  const isInternalColor = isPresetColor(color);
  const mergedColor = isInternalColor
    ? getPresetColorCls(color, { rawColor: true })
    : (color ?? primary);

  const rootCls = clsx(
    `${prefixCls}-time-event`,
    'text-text absolute z-10 flex items-center gap-1 rounded-sm pr-1 pl-2 text-xs select-none',
    'before:absolute before:top-1 before:bottom-1 before:left-0.5 before:w-[3px] before:rounded-full before:bg-[var(--metis-calendar-event-color)]',
    {
      'text-white': selected,
    },
    semanticCls.root,
  );

  const titleCls = clsx(
    `${prefixCls}-time-event-title`,
    'w-0 flex-1 truncate text-left',
    semanticCls.title,
  );

  const startCls = clsx(
    `${prefixCls}-time-event-start`,
    'text-text-tertiary',
    {
      'text-white': selected,
    },
    semanticCls.time,
  );

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
    <div
      ref={ref}
      className={rootCls}
      style={style}
      {...omit(restProps, ['eventKey', 'allDay', 'dateKey', 'rangeStart', 'rangeEnd'])}
    >
      <span className={titleCls}>{title}</span>
      <span className={startCls}>{startTime}</span>
    </div>
  );
}) as unknown as <DateType extends object = Dayjs>(
  props: TimeEventProps<DateType> & {
    ref?: React.Ref<HTMLDivElement>;
  },
) => React.ReactElement;

export default TimeEvent;
