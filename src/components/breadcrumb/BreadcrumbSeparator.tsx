import * as React from 'react';
import { clsx } from '@util/classNameUtils';

const BreadcrumbSeparator: React.FC<
  React.PropsWithChildren<{ prefixCls?: string; className?: string }>
> = ({ prefixCls, className, children }) => {
  return (
    <li
      className={clsx(
        `${prefixCls}-separator`,
        'text-text-tertiary mx-2 inline-flex items-center',
        className,
      )}
      aria-hidden="true"
    >
      {children === '' ? children : children || '/'}
    </li>
  );
};

export default BreadcrumbSeparator;
