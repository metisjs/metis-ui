import React from 'react';
import { clsx } from '@util/classNameUtils';

/**
 * 默认的 index 列容器，提供一个好看的 index
 */
const IndexColumn: React.ForwardRefRenderFunction<any, { border?: boolean; children: number }> = (
  { border = false, children },
  ref,
) => {
  return (
    <div
      ref={ref}
      className={clsx('inline-flex h-[1.125rem] w-[1.125rem] items-center justify-center', {
        'rounded-full bg-spotlight text-xs/3 text-white': border,
        'bg-text-tertiary': (children as number) > 3,
      })}
    >
      {children}
    </div>
  );
};

export default React.forwardRef(IndexColumn);
