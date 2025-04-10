import type { HTMLAttributes } from 'react';
import React, { forwardRef, useContext } from 'react';
import omit from '@rc-component/util/es/omit';
import { composeRef } from '@rc-component/util/es/ref';
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
        <div
          {...viewProps}
          {...omit(props, ['style'])}
          ref={composeRef(ref, viewProps.ref as React.Ref<HTMLDivElement>)}
        />
      )}
    />
  );
});
export default Scroller;
