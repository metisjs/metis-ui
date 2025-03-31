import * as React from 'react';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx, getSemanticCls } from '@util/classNameUtils';
import { getPresetColorCls, isPresetColor, type PresetColorType } from '@util/colors';
import type { LiteralUnion } from '@util/type';

export interface TimelineItemProps {
  key?: React.Key;
  prefixCls?: string;
  className?: SemanticClassName<
    {
      time?: string;
      dot?: string;
      tail?: string;
      content?: string;
    },
    { last?: boolean; pending?: boolean }
  >;
  color?: LiteralUnion<PresetColorType>;
  dot?: React.ReactNode;
  pending?: boolean;
  last?: boolean;
  style?: React.CSSProperties;
  time?: React.ReactNode;
  content?: React.ReactNode;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  prefixCls,
  className,
  color,
  dot,
  pending = false,
  last,
  time,
  content,
  ...restProps
}) => {
  const semanticCls = getSemanticCls(className, { last, pending });

  const presetColor = isPresetColor(color);

  const rootCls = clsx(
    `${prefixCls}-item`,
    {
      [`${prefixCls}-item-last`]: last,
      [`${prefixCls}-item-pending`]: pending,
    },
    'relative flex gap-6 pb-6 leading-6',
    semanticCls.root,
  );

  const timeCls = clsx(
    `${prefixCls}-item-time`,
    'text-text-tertiary ml-auto items-baseline text-end text-xs/6',
    semanticCls.time,
  );

  const tailCls = clsx(
    `${prefixCls}-item-tail`,
    'border-border-secondary absolute start-[6.5px] top-6 h-[calc(100%-24px)] border-r',
    semanticCls.tail,
  );

  const dotClassName = clsx(
    `${prefixCls}-item-dot`,
    'bg-border-tertiary text-primary outline-border absolute top-[9px] left-1 h-1.5 w-1.5 rounded-full outline outline-1',
    !!dot &&
      'bg-container top-3 left-[7px] inline-flex h-auto w-auto -translate-x-1/2 -translate-y-1/2 leading-none outline-0 [&_.metis-icon]:text-2xl',
    presetColor && getPresetColorCls(color, { text: true, rawOutline: true, background: !dot }),
    semanticCls.dot,
  );

  const contentCls = clsx(
    `${prefixCls}-item-content`,
    'relative ms-8 flex-1 text-start',
    semanticCls.content,
  );

  return (
    <li {...restProps} className={rootCls}>
      <div className={tailCls} />
      <div
        className={dotClassName}
        style={!presetColor ? { outlineColor: color, color } : undefined}
      >
        {dot}
      </div>
      <div className={contentCls}>{content}</div>
      {time && <div className={timeCls}>{time}</div>}
    </li>
  );
};

export default TimelineItem;
