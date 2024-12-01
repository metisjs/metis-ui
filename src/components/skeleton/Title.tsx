import * as React from 'react';
import { clsx } from '@util/classNameUtils';

export interface SkeletonTitleProps {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  width?: number | string;
}

const Title: React.FC<SkeletonTitleProps> = ({ prefixCls, className, width, style }) => (
  <h3
    className={clsx(prefixCls, 'h-4 w-full rounded bg-fill-tertiary', className)}
    style={{ width, ...style }}
  />
);

export default Title;
