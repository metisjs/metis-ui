import * as React from 'react';
import type { SemanticClassName } from '../_util/classNameUtils';
import { clsx } from '../_util/classNameUtils';
import useSemanticCls from '../_util/hooks/useSemanticCls';

export interface PopupProps {
  prefixCls?: string;
  children: (() => React.ReactNode) | React.ReactNode;
  id?: string;
  overlayInnerStyle?: React.CSSProperties;
  className?: SemanticClassName;
  style?: React.CSSProperties;
}

export default function Popup(props: PopupProps) {
  const { children, prefixCls, id, overlayInnerStyle, className, style } = props;

  const semanticCls = useSemanticCls(className);

  return (
    <div className={clsx(`${prefixCls}-content`, 'relative')} style={style}>
      <div
        className={clsx(
          `${prefixCls}-inner`,
          'box-border min-h-8 break-words rounded-md bg-[--metis-arrow-background-color] px-2 py-1.5 text-start text-sm text-white shadow-sm',
          semanticCls.root,
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
