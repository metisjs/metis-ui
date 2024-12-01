import * as React from 'react';
import { clsx } from '@util/classNameUtils';
import { ConfigContext } from '../config-provider';
import useSize from '../config-provider/hooks/useSize';
import type { SizeType } from '../config-provider/SizeContext';
import type { SkeletonElementProps } from './Element';
import Element from './Element';

export interface SkeletonButtonProps extends Omit<SkeletonElementProps, 'size'> {
  size?: SizeType;
}

const SkeletonButton: React.FC<SkeletonButtonProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    active,
    size: customizeSize,
    shape = 'default',
    ...restProps
  } = props;
  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('skeleton', customizePrefixCls);

  const size = useSize(customizeSize);

  const cls = clsx(
    prefixCls,
    {
      [`${prefixCls}-active`]: active,
    },
    {
      'h-10 w-20 leading-10': size === 'large',
      'h-9 w-16 leading-9': size === 'middle',
      'h-8 w-14 leading-8': size === 'small',
      'h-7 w-12 leading-7': size === 'mini',
    },
    shape === 'circle' && {
      'h-10 w-10 leading-10': size === 'large',
      'h-9 w-9 leading-9': size === 'middle',
      'h-8 w-8 leading-8': size === 'small',
      'h-7 w-7 leading-7': size === 'mini',
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
