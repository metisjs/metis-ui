import type { ScrollValues, ScrollbarsProps } from 'rc-scrollbars';
import { Scrollbars } from 'rc-scrollbars';
import type { MutableRefObject } from 'react';
import React, { forwardRef, memo } from 'react';
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

const Scrollbar = forwardRef<HTMLElement, ScrollbarProps>(
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
        ref={(sRef): void => {
          if (ref && sRef) {
            if (typeof ref === 'function') {
              ref(sRef.view ?? null);
              return;
            }

            (ref as MutableRefObject<HTMLElement | undefined>).current = sRef.view;
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
