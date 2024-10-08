import * as React from 'react';
import type { SemanticClassName } from '../_util/classNameUtils';
import { clsx, getSemanticCls } from '../_util/classNameUtils';

export interface PopupProps {
  prefixCls?: string;
  children: (() => React.ReactNode) | React.ReactNode;
  id?: string;
  overlayInnerStyle?: React.CSSProperties;
  className?: SemanticClassName<'inner'>;
  style?: React.CSSProperties;
}

export default function Popup(props: PopupProps) {
  const { children, prefixCls, id, overlayInnerStyle, className, style } = props;

  const semanticCls = getSemanticCls(className);

  return (
    <div className={clsx(`${prefixCls}-content`, 'relative', semanticCls.root)} style={style}>
      <div
        className={clsx(
          `${prefixCls}-inner`,
          'box-border min-h-8 break-words rounded-md bg-[--metis-arrow-background-color] px-2 py-1.5 text-start text-sm text-white shadow-sm',
          semanticCls.inner,
        )}
        id={id}
        role="tooltip"
        style={overlayInnerStyle}
      >
        {typeof children === 'function' ? children() : children}
      </div>
    </div>
  );
}
