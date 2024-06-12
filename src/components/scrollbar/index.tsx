import type { ScrollValues, ScrollbarsProps } from 'rc-scrollbars';
import { Scrollbars } from 'rc-scrollbars';
import React, { MutableRefObject, forwardRef, memo } from 'react';
import { ComplexClassName, clsx, getComplexCls } from '../_util/classNameUtils';
import { ConfigContext } from '../config-provider';

export interface ScrollbarProps
  extends Omit<
    ScrollbarsProps,
    | 'className'
    | 'autoHide'
    | 'onScrollFrame'
    | 'onScroll'
    | 'autoHeight'
    | 'autoHeightMax'
    | 'autoHeightMin'
    | 'classes'
  > {
  prefixCls?: string;
  className?: ComplexClassName<'view'>;
  overflowX?: boolean;
  autoHide?: boolean;
  autoHeight?: [number, number];
  onScroll?: (values: ScrollValues) => void;
}

export interface ScrollbarRef {
  view?: HTMLElement;
  getScrollLeft(): number;
  getScrollTop(): number;
  getScrollWidth(): number;
  getScrollHeight(): number;
  getClientWidth(): number;
  getClientHeight(): number;
  getValues(): ScrollValues;
  scrollLeft(left?: number): void;
  scrollTop(top?: number): void;
  scrollToLeft(): void;
  scrollToTop(): void;
  scrollToRight(): void;
  scrollToBottom(): void;
}

const Scrollbar = forwardRef<ScrollbarRef, ScrollbarProps>(
  (
    {
      prefixCls: customizePrefixCls,
      className,
      autoHeight,
      children,
      onScroll,
      autoHide = true,
      ...restProps
    },
    ref,
  ) => {
    const complexCls = getComplexCls(className);
    const { getPrefixCls } = React.useContext(ConfigContext);
    const prefixCls = getPrefixCls('scrollbar', customizePrefixCls);

    return (
      <Scrollbars
        className={clsx(prefixCls, complexCls.root)}
        autoHide={autoHide}
        onScrollFrame={onScroll}
        autoHeight={!!autoHeight}
        autoHeightMin={autoHeight ? autoHeight[0] : 0}
        autoHeightMax={autoHeight ? autoHeight[1] : 0}
        classes={{
          view: clsx(`${prefixCls}-view`, complexCls.view),
        }}
        ref={(sRef) => {
          if (ref && sRef) {
            if (typeof ref === 'function') {
              ref(sRef);
              return;
            }

            (ref as MutableRefObject<ScrollbarRef | null>).current = sRef;
          }
        }}
        {...restProps}
      >
        {children}
      </Scrollbars>
    );
  },
);

export default memo(Scrollbar);
