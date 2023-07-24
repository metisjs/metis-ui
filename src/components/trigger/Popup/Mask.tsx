import * as React from 'react';
import { clsx } from '../../_util/classNameUtils';
import type { TransitionProps } from '../../transition';
import Transition from '../../transition';

export interface MaskProps {
  prefixCls: string;
  className?: string;
  open?: boolean;
  zIndex?: number;
  mask?: boolean;
  transition?: Partial<TransitionProps>;
}

export default function Mask(props: MaskProps) {
  const { prefixCls, className, open, zIndex, mask, transition } = props;

  if (!mask) {
    return null;
  }

  return (
    <Transition {...transition} appear visible={open} removeOnLeave>
      <div className={clsx(`${prefixCls}-mask`, className)} style={{ zIndex }} />
    </Transition>
  );
}
