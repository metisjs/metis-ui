import * as React from 'react';

import { clsx } from '../_util/classNameUtils';

const BreadcrumbSeparator: React.FC<
  React.PropsWithChildren<{ prefixCls?: string; className?: string }>
> = ({ prefixCls, className, children }) => {
  return (
    <li
      className={clsx(`${prefixCls}-separator`, 'mx-2 text-text-tertiary', className)}
      aria-hidden="true"
    >
      {children === '' ? children : children || '/'}
    </li>
  );
};

export default BreadcrumbSeparator;
