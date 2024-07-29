import * as React from 'react';
import { SemanticClassName } from '../_util/classNameUtils';

export interface ScrollbarsProps {
  prefixCls?: string;
  children?: React.ReactNode;
  autoHeight?: false | number[];
  autoHide?: boolean;
  autoHideDuration?: number;
  autoHideTimeout?: number;
  className?: SemanticClassName<
    'view' | 'trackHorizontal' | 'trackVertical' | 'thumbHorizontal' | 'thumbVertical'
  >;
  id?: string;
  onScroll?: (values: ScrollValues, e: React.UIEvent<HTMLElement>) => void;
  onScrollStart?: () => void;
  onScrollStop?: () => void;
  thumbMinSize: number;
  thumbSize?: number;
  universal: boolean;
}

export interface ScrollValues {
  left: number;
  top: number;
  scrollLeft: number;
  scrollTop: number;
  scrollWidth: number;
  scrollHeight: number;
  clientWidth: number;
  clientHeight: number;
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
