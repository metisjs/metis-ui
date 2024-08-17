import type * as React from 'react';
import type { SemanticClassName } from '../_util/classNameUtils';

export interface ScrollbarProps {
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
  thumbMinSize?: number;
  thumbSize?: number;
  universal?: boolean;
  style?: React.CSSProperties;
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
  getValues(): ScrollValues;
  scrollTo(options?: ScrollToOptions): void;
  scrollTo(x: number, y: number): void;
}
