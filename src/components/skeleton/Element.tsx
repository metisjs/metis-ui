import * as React from 'react';
import { clsx } from '../_util/classNameUtils';

export interface SkeletonElementProps {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  size?: 'large' | 'small' | 'default' | number;
  shape?: 'circle' | 'square' | 'round' | 'default';
  active?: boolean;
}

const Element: React.FC<SkeletonElementProps> = (props) => {
  const { prefixCls, className, style, size = 'default', shape = 'default', active } = props;

  const cls = clsx(
    prefixCls,
    {
      [`${prefixCls}-lg`]: size === 'large',
      [`${prefixCls}-sm`]: size === 'small',
    },
    {
      [`${prefixCls}-circle`]: shape === 'circle',
      [`${prefixCls}-square`]: shape === 'square',
      [`${prefixCls}-round`]: shape === 'round',
    },
    'inline-block rounded bg-neutral-fill-tertiary',
    {
      'rounded-full': shape === 'circle' || shape === 'round',
      'rounded-md': shape === 'square' || shape === 'default',
    },
    active && 'animate-pulse',
    className,
  );

  const sizeStyle = React.useMemo<React.CSSProperties>(
    () =>
      typeof size === 'number'
        ? {
            width: size,
            height: size,
            lineHeight: `${size}px`,
          }
        : {},
    [size],
  );

  return <div className={cls} style={{ ...sizeStyle, ...style }} />;
};

export default Element;
