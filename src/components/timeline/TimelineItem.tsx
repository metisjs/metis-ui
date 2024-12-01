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
      label?: string;
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
  position?: 'left' | 'right';
  alternate?: boolean;
  style?: React.CSSProperties;
  label?: React.ReactNode;
  content?: React.ReactNode;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  prefixCls,
  className,
  color,
  dot,
  pending = false,
  position,
  last,
  label,
  content,
  alternate,
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
    'relative pb-5',
    semanticCls.root,
  );

  const labelCls = clsx(
    `${prefixCls}-item-label`,
    'absolute w-[calc(50%-1.5rem+0.5rem)]',
    {
      'text-end': position === 'left',
      'left-1/2 ms-4 text-start': position === 'right',
    },
    semanticCls.label,
  );

  const tailCls = clsx(
    `${prefixCls}-item-tail`,
    'absolute start-[5px] top-3 h-[calc(100%-5px)] border-r-2 border-border-secondary',
    {
      'start-1/2 -translate-x-1/2': alternate,
      'end-[5px] start-[unset]': !alternate && position === 'right',
    },
    semanticCls.tail,
  );

  const dotClassName = clsx(
    `${prefixCls}-item-dot`,
    'absolute left-1 top-2 h-1 w-1 rounded-full bg-transparent text-primary outline outline-[3px] outline-offset-0 outline-primary',
    !!dot &&
      'left-1.5 top-2.5 inline-flex h-auto w-auto -translate-x-1/2 -translate-y-1/2 bg-container leading-[1] outline-0 [&_.metis-icon]:text-base',
    {
      'left-1/2 -translate-x-1/2': alternate,
      'left-[unset] right-1': !alternate && position === 'right',
      'left-[unset] right-1.5 translate-x-1/2': !alternate && position === 'right' && dot,
    },
    presetColor && getPresetColorCls(color, { text: true, rawOutline: true }),
    semanticCls.dot,
  );

  const contentCls = clsx(
    `${prefixCls}-item-content`,
    'relative',
    {
      'ms-6 text-start': position === 'left',
      'me-6 text-end': position === 'right',
    },
    alternate && {
      'start-[calc(50%-0.255rem)] w-[calc(50%-1.5rem+0.218rem)]': position === 'left',
      'me-0 ms-0 w-[calc(50%-1.5rem+0.218rem)]': position === 'right',
    },
    semanticCls.content,
  );

  return (
    <li {...restProps} className={rootCls}>
      {label && <div className={labelCls}>{label}</div>}
      <div className={tailCls} />
      <div
        className={dotClassName}
        style={!presetColor ? { outlineColor: color, color } : undefined}
      >
        {dot}
      </div>
      <div className={contentCls}>{content}</div>
    </li>
  );
};

export default TimelineItem;
