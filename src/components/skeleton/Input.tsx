import * as React from 'react';
import { clsx } from '../_util/classNameUtils';
import { ConfigContext } from '../config-provider';
import type { SkeletonElementProps } from './Element';
import Element from './Element';

export interface SkeletonInputProps extends Omit<SkeletonElementProps, 'size' | 'shape'> {
  size?: 'large' | 'small' | 'default';
}

const SkeletonInput: React.FC<SkeletonInputProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    active,
    size = 'default',
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
      'h-10 min-w-[12.5rem] leading-10': size === 'large',
      'h-9 min-w-[11.25rem] leading-9': size === 'default',
      'h-8 min-w-[10rem] leading-8': size === 'small',
    },
    className,
  );

  return (
    <Element
      prefixCls={`${prefixCls}-input`}
      className={cls}
      active={active}
      size={size}
      {...restProps}
    />
  );
};

export default SkeletonInput;
