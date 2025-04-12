import * as React from 'react';
import { clsx } from '@util/classNameUtils';
import type { SpinSize } from '.';

export interface IndicatorProps {
  prefixCls: string;
  size?: SpinSize;
  className?: string;
}

export default function Indicator(props: IndicatorProps) {
  const { prefixCls, className, size } = props;

  const spinnerClassName = clsx(`${prefixCls}-spinner`, 'flex h-6 w-6 justify-between', {
    'size-4': size === 'small',
    'h-8 w-8': size === 'large',
  });
  const itemClassName = clsx(
    `${prefixCls}-spinner-item`,
    'bg-fill h-full w-1.5 origin-center animate-[0.6s_ease-in-out_0s_infinite_normal_none_running_bounce-spin] rounded-xs opacity-20',
    {
      'w-1 rounded-xs': size === 'small',
      'w-2 rounded-sm': size === 'large',
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
