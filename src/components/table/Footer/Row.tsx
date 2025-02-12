import * as React from 'react';
import { clsx } from '@util/classNameUtils';
import { SummaryRowContext } from './contexts';

export interface FooterRowProps {
  children?: React.ReactNode;
  index: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e?: React.MouseEvent<HTMLElement>) => void;
}

export default function FooterRow({ children, className, index, ...props }: FooterRowProps) {
  const context = React.useMemo(() => ({ rowIndex: index }), [index]);

  return (
    <SummaryRowContext.Provider value={context}>
      <tr {...props} className={clsx('group/footer-row', className)}>
        {children}
      </tr>
    </SummaryRowContext.Provider>
  );
}
