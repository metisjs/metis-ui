import React from 'react';
import { clsx } from './classNameUtils';

export interface ExpandIconProps {
  open?: boolean;
  className?: string;
}

const ExpandIcon = ({ open, className }: ExpandIconProps) => (
  <svg
    viewBox="0 0 20 20"
    aria-hidden="true"
    className={clsx('transition-transform', open && 'rotate-90', className)}
    fill="currentColor"
    aria-label={open ? 'expanded' : 'collapsed'}
  >
    <path
      fillRule="evenodd"
      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
      clipRule="evenodd"
    ></path>
  </svg>
);

export default ExpandIcon;
