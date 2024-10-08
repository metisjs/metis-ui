import * as React from 'react';
import ResizeObserver from 'rc-resize-observer';
import { getSemanticCls } from '../_util/classNameUtils';
import type { VirtualListProps } from './VirtualList';

export type InnerProps = Pick<React.HTMLAttributes<HTMLDivElement>, 'role' | 'id'>;

interface FillerProps {
  prefixCls?: string;
  className?: VirtualListProps<any>['className'];
  /** Virtual filler height. Should be `count * itemMinHeight` */
  height?: number;
  /** Set offset of visible items. Should be the top of start item position */
  offsetY?: number;
  offsetX?: number;

  scrollWidth?: number;

  children: React.ReactNode;

  onInnerResize?: () => void;

  innerProps?: InnerProps;

  extra?: React.ReactNode;
}

/**
 * Fill component to provided the scroll content real height.
 */
const Filler = React.forwardRef(
  (
    {
      className,
      height,
      offsetY,
      offsetX,
      children,
      onInnerResize,
      innerProps,
      extra,
    }: FillerProps,
    ref: React.Ref<HTMLDivElement>,
  ) => {
    const semanticCls = getSemanticCls(className);

    let outerStyle: React.CSSProperties = {};

    let innerStyle: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
    };

    if (offsetY !== undefined) {
      // Not set `width` since this will break `sticky: right`
      outerStyle = {
        height,
        position: 'relative',
        overflow: 'hidden',
      };

      innerStyle = {
        ...innerStyle,
        transform: `translateY(${offsetY}px)`,
        marginLeft: offsetX ? -offsetX : undefined,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
      };
    }

    return (
      <div style={outerStyle} className={semanticCls.outer}>
        <ResizeObserver
          onResize={({ offsetHeight }) => {
            if (offsetHeight && onInnerResize) {
              onInnerResize();
            }
          }}
        >
          <div style={innerStyle} ref={ref} {...innerProps} className={semanticCls.inner}>
            {children}
            {extra}
          </div>
        </ResizeObserver>
      </div>
    );
  },
);

export default Filler;
