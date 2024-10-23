import * as React from 'react';
import { clsx } from '../_util/classNameUtils';
import type { LiteralUnion } from '../_util/type';

type Color = 'blue' | 'red' | 'green' | 'gray';

export interface TimelineItemProps {
  key?: React.Key;
  prefixCls?: string;
  className?: string;
  color?: LiteralUnion<Color>;
  dot?: React.ReactNode;
  pending?: boolean;
  position?: string;
  style?: React.CSSProperties;
  label?: React.ReactNode;
  content?: React.ReactNode;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  prefixCls,
  className,
  color = 'blue',
  dot,
  pending = false,
  position /** Dead, but do not pass in <li {...omit()} */,
  label,
  content,
  ...restProps
}) => {
  const rootCls = clsx(
    `${prefixCls}-item`,
    {
      [`${prefixCls}-item-pending`]: pending,
    },
    'relative',
    className,
  );

  const customColor = /blue|red|green|gray/.test(color || '') ? undefined : color;

  const dotClassName = clsx(`${prefixCls}-item-head`, {
    [`${prefixCls}-item-head-custom`]: !!dot,
    [`${prefixCls}-item-head-${color}`]: !customColor,
  });

  return (
    <li {...restProps} className={rootCls}>
      {label && <div className={`${prefixCls}-item-label`}>{label}</div>}
      <div className={`${prefixCls}-item-tail`} />
      <div className={dotClassName} style={{ borderColor: customColor, color: customColor }}>
        {dot}
      </div>
      <div className={`${prefixCls}-item-content`}>{content}</div>
    </li>
  );
};

export default TimelineItem;
