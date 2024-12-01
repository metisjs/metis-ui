import React from 'react';
import { LoadingOutline } from '@metisjs/icons';
import { clsx } from '@util/classNameUtils';
import Transition from '../transition';

export type LoadingIconProps = {
  prefixCls: string;
  existIcon: boolean;
  loading?: boolean | object;
  className?: string;
  style?: React.CSSProperties;
};

const getCollapsedWidth = (): React.CSSProperties => ({
  width: 0,
  opacity: 0,
  transform: 'scale(0)',
});

const getRealWidth = (node: HTMLElement): React.CSSProperties => ({
  width: node.scrollWidth,
  opacity: 1,
  transform: 'scale(1)',
});

const LoadingIcon: React.FC<LoadingIconProps> = (props) => {
  const { prefixCls, loading, existIcon, className, style } = props;
  const visible = !!loading;

  if (existIcon) {
    return (
      <LoadingOutline className={clsx(`${prefixCls}-loading-icon`, 'animate-spin', className)} />
    );
  }

  return (
    <Transition
      visible={visible}
      removeOnLeave
      enter="transition-all"
      enterFrom={getCollapsedWidth}
      enterTo={getRealWidth}
      leave="transition-all"
      leaveFrom={getRealWidth}
      leaveTo={getCollapsedWidth}
    >
      {({ className: transitionCls, style: transitionStyle }, ref) => (
        <span
          ref={ref}
          className={clsx('m-0 inline-block p-0 leading-[1]', transitionCls)}
          style={transitionStyle}
        >
          <LoadingOutline
            className={clsx(`${prefixCls}-loading-icon`, 'animate-spin', className)}
            style={style}
          />
        </span>
      )}
    </Transition>
  );
};

export default LoadingIcon;
