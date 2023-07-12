import classNames from 'classnames';
import * as React from 'react';
import { clsx } from '../_util/classNameUtils';

export interface PopupProps {
  prefixCls?: string;
  children: (() => React.ReactNode) | React.ReactNode;
  id?: string;
  overlayInnerStyle?: React.CSSProperties;
  className?: string;
  style?: React.CSSProperties;
}

export default function Popup(props: PopupProps) {
  const { children, prefixCls, id, overlayInnerStyle, className, style } = props;

  return (
    <div className={classNames(`${prefixCls}-content`, className)} style={style}>
      <div
        className={clsx(`${prefixCls}-inner`, 'bg-neutral-bg-spotlight text-white')}
        id={id}
        role="tooltip"
        style={overlayInnerStyle}
      >
        {typeof children === 'function' ? children() : children}
      </div>
    </div>
  );
}
