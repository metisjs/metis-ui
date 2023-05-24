import * as React from 'react';
import { SpaceContext } from '.';
import { clsx } from '../_util/classNameUtils';

export interface ItemProps {
  className?: string;
  children: React.ReactNode;
  index: number;
  direction?: 'horizontal' | 'vertical';
  split?: string | React.ReactNode;
  wrap?: boolean;
}

export default function Item({ className, direction, index, children, split, wrap }: ItemProps) {
  const { horizontalSize, verticalSize, latestIndex, supportFlexGap } =
    React.useContext(SpaceContext);

  let style: React.CSSProperties = {};

  if (!supportFlexGap) {
    if (direction === 'vertical') {
      if (index < latestIndex) {
        style = { marginBottom: horizontalSize / (split ? 2 : 1) };
      }
    } else {
      style = {
        ...(index < latestIndex && { marginLeft: horizontalSize / (split ? 2 : 1) }),
        ...(wrap && { paddingBottom: verticalSize }),
      };
    }
  }

  if (children === null || children === undefined) {
    return null;
  }

  const clx = clsx('empty:hidden', className);

  return (
    <>
      <div className={clx} style={style}>
        {children}
      </div>
      {index < latestIndex && split && <span style={style}>{split}</span>}
    </>
  );
}
