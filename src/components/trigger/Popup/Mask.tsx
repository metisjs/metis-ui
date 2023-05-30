import * as React from 'react';
import type { TransitionProps } from '../../transition';
import Transition from '../../transition';

export interface MaskProps {
  className?: string;
  open?: boolean;
  zIndex?: number;
  mask?: boolean;
  transition?: TransitionProps;
}

export default function Mask(props: MaskProps) {
  const { className, open, zIndex, mask, transition } = props;

  if (!mask) {
    return null;
  }

  return (
    <Transition {...transition} appear show={open} unmount>
      <div className={className} style={{ zIndex }} />
    </Transition>
  );
}
