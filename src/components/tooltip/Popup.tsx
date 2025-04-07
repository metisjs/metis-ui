import * as React from 'react';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';

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
          'box-border min-h-8 rounded-md bg-(--metis-arrow-background-color) px-2 py-1.5 text-start text-sm break-words text-white shadow-xs backdrop-blur-2xl',
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
