import omit from 'rc-util/lib/omit';
import * as React from 'react';
import { clsx } from '../_util/classNameUtils';
import { ConfigContext } from '../config-provider';
import type { SkeletonElementProps } from './Element';
import Element from './Element';

export interface SkeletonButtonProps extends Omit<SkeletonElementProps, 'size'> {
  size?: 'large' | 'small' | 'default';
  block?: boolean;
}

const SkeletonButton: React.FC<SkeletonButtonProps> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    active,
    block = false,
    size = 'default',
  } = props;
  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('skeleton', customizePrefixCls);

  const otherProps = omit(props, ['prefixCls']);
  const cls = clsx(
    prefixCls,
    `${prefixCls}-element`,
    {
      [`${prefixCls}-active`]: active,
      [`${prefixCls}-block`]: block,
    },
    className,
  );

  return (
    <div className={cls}>
      <Element prefixCls={`${prefixCls}-button`} size={size} {...otherProps} />
    </div>
  );
};

export default SkeletonButton;
