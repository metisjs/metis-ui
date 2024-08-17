import type { ReactNode } from 'react';
import React from 'react';
import { XMarkOutline } from '@metisjs/icons';
import omit from 'rc-util/lib/omit';
import { clsx } from '../classNameUtils';
import { cloneElement } from '../reactNode';

export type BaseClosableType = { closeIcon?: React.ReactNode } & React.AriaAttributes;
export type ClosableType = boolean | BaseClosableType;

export default (
  closable: ClosableType = false,
  props?: { className?: string; onClick?: (e: any) => void },
  defaultIcon: ReactNode = <XMarkOutline className={props?.className} onClick={props?.onClick} />,
): [boolean, ReactNode, React.AriaAttributes] => {
  if (closable === false) {
    return [false, null, {}];
  }

  if (closable === true) {
    return [true, defaultIcon, {}];
  }

  return [
    !!closable.closeIcon,
    !!closable.closeIcon
      ? cloneElement(closable.closeIcon, (oriProps) => ({
          className: clsx(props?.className, oriProps.className),
          onClick: oriProps.onClick ?? props?.onClick,
        }))
      : null,
    omit(closable, ['closeIcon']),
  ];
};
