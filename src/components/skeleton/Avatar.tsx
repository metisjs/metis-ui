import * as React from 'react';
import { clsx } from '@util/classNameUtils';
import { ConfigContext } from '../config-provider';
import type { SkeletonElementProps } from './Element';
import Element from './Element';

export interface AvatarProps extends Omit<SkeletonElementProps, 'shape' | 'size'> {
  shape?: 'circle' | 'square';
  size?: 'large' | 'small' | 'middle' | number;
}

const SkeletonAvatar: React.FC<AvatarProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    active,
    shape = 'circle',
    size = 'middle',
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
      'h-12 w-12 leading-[3rem]': size === 'large',
      'h-10 w-10 leading-10': size === 'middle',
      'h-8 w-8 leading-8': size === 'small',
    },
    className,
  );

  return (
    <Element
      prefixCls={`${prefixCls}-avatar`}
      className={cls}
      active={active}
      shape={shape}
      size={size}
      {...restProps}
    />
  );
};

export default SkeletonAvatar;
