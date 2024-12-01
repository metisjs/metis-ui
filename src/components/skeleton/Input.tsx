import * as React from 'react';
import { clsx } from '@util/classNameUtils';
import { ConfigContext } from '../config-provider';
import useSize from '../config-provider/hooks/useSize';
import type { SizeType } from '../config-provider/SizeContext';
import type { SkeletonElementProps } from './Element';
import Element from './Element';

export interface SkeletonInputProps extends Omit<SkeletonElementProps, 'size' | 'shape'> {
  size?: SizeType;
}

const SkeletonInput: React.FC<SkeletonInputProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    active,
    size: customizeSize,
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
      'h-10 min-w-[12.5rem] leading-10': size === 'large',
      'h-9 min-w-[11.25rem] leading-9': size === 'middle',
      'h-8 min-w-[10rem] leading-8': size === 'small',
      'h-7 min-w-[8.75rem] leading-7': size === 'mini',
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
