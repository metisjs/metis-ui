import { clsx } from 'metis-ui/es/_util/classNameUtils';
import * as React from 'react';
import type { SpinSize } from '.';

export interface IndicatorProps {
  prefixCls: string;
  size?: SpinSize;
  className?: string;
}

export default function Indicator(props: IndicatorProps) {
  const { prefixCls, className, size } = props;

  const spinnerClassName = clsx(`${prefixCls}-spinner`, 'flex h-5 w-5 justify-between', {
    'h-3 w-3': size === 'small',
    'h-8 w-8': size === 'large',
  });
  const itemClassName = clsx(
    `${prefixCls}-spinner-item`,
    'h-full w-[0.3125rem] origin-center animate-[0.6s_ease-in-out_0s_infinite_normal_none_running_bounce-spin] rounded-sm bg-neutral-fill-secondary opacity-20',
    {
      'w-[0.1875rem] rounded-sm': size === 'small',
      'w-2 rounded': size === 'large',
    },
    className,
  );

  return (
    <>
      <div className={spinnerClassName}>
        <div className={itemClassName}></div>
        <div className={itemClassName} style={{ animationDelay: '0.15s' }}></div>
        <div className={itemClassName} style={{ animationDelay: '0.3s' }}></div>
      </div>
    </>
  );
}
