import type { HTMLAttributes } from 'react';
import React, { forwardRef, useContext } from 'react';
import omit from 'rc-util/lib/omit';
import { composeRef } from 'rc-util/lib/ref';
import Scrollbar from '../scrollbar';
import { VirtualListContext } from './context';

const Scroller = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => {
  const { prefixCls, onScroll, className, style, scrollbar } = useContext(VirtualListContext);

  return (
    <Scrollbar
      prefixCls={`${prefixCls}-scrollbar`}
      className={className}
      style={style}
      onScroll={onScroll}
      ref={scrollbar}
      renderView={(viewProps) => (
        <div {...viewProps} {...omit(props, ['style'])} ref={composeRef(ref, viewProps.ref)} />
      )}
    />
  );
});
export default Scroller;