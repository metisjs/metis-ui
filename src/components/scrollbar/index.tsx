import type { ScrollValues, ScrollbarsProps } from 'rc-scrollbars';
import { Scrollbars } from 'rc-scrollbars';
import React, { MutableRefObject, forwardRef, memo } from 'react';
import { SemanticClassName, clsx, getSemanticCls } from '../_util/classNameUtils';
import { ConfigContext } from '../config-provider';

export { ScrollValues };

export interface ScrollbarProps
  extends Omit<
    Partial<ScrollbarsProps>,
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
  className?: SemanticClassName<'view'>;
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
      style,
      ...restProps
    },
    ref,
  ) => {
    const semanticCls = getSemanticCls(className);
    const { getPrefixCls } = React.useContext(ConfigContext);
    const prefixCls = getPrefixCls('scrollbar', customizePrefixCls);

    return (
      <Scrollbars
        className={clsx(prefixCls, 'h-full, w-full', semanticCls.root)}
        autoHide={autoHide}
        onScrollFrame={onScroll}
        autoHeight={!!autoHeight}
        autoHeightMin={autoHeight ? autoHeight[0] : 0}
        autoHeightMax={autoHeight ? autoHeight[1] : 0}
        classes={{
          view: clsx(`${prefixCls}-view`, semanticCls.view),
        }}
        style={{ width: '', height: '', ...style }}
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
