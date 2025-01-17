import * as React from 'react';
import { clsx } from '@util/classNameUtils';
import Transition from '../transition';

export type MaskProps = {
  prefixCls: string;
  open: boolean;
  style?: React.CSSProperties;
  maskProps?: React.HTMLAttributes<HTMLDivElement>;
  className?: string;
};

const Mask: React.FC<MaskProps> = (props) => {
  const { prefixCls, style, open, maskProps, className } = props;
  return (
    <Transition
      key="mask"
      appear
      visible={open}
      enter="transition-opacity ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      {({ className: transitionClassName, style: transitionStyle }, ref) => (
        <div
          ref={ref}
          style={{ ...transitionStyle, ...style }}
          className={clsx(
            `${prefixCls}-mask`,
            'pointer-events-none fixed inset-0 bg-mask',
            className,
            transitionClassName,
          )}
          {...maskProps}
        />
      )}
    </Transition>
  );
};

export default Mask;
