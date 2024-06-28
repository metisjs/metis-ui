import * as React from 'react';
import { clsx } from '../_util/classNameUtils';
import { ConfigContext } from '../config-provider';
import type { SkeletonElementProps } from './Element';
import Element from './Element';

export interface SkeletonButtonProps extends Omit<SkeletonElementProps, 'size'> {
  size?: 'large' | 'small' | 'default';
}

const SkeletonButton: React.FC<SkeletonButtonProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    active,
    size = 'default',
    shape = 'default',
    ...restProps
  } = props;
  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('skeleton', customizePrefixCls);

  const cls = clsx(
    prefixCls,
    {
      [`${prefixCls}-active`]: active,
    },
    {
      'h-10 w-20 leading-10': size === 'large',
      'h-9 w-16 leading-9': size === 'default',
      'h-8 w-14 leading-8': size === 'small',
    },
    shape === 'circle' && {
      'h-10 w-10 leading-10': size === 'large',
      'h-9 w-9 leading-9': size === 'default',
      'h-8 w-8 leading-8': size === 'small',
    },
    className,
  );

  return (
    <Element
      prefixCls={`${prefixCls}-button`}
      className={cls}
      shape={shape}
      active={active}
      size={size}
      {...restProps}
    />
  );
};

export default SkeletonButton;
