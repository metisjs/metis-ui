import type * as React from 'react';
import type { SemanticClassName } from '@util/classNameUtils';

export interface ScrollbarProps {
  prefixCls?: string;
  children?: React.ReactNode;
  autoHeight?: false | number[];
  autoHide?: boolean;
  autoHideDuration?: number;
  autoHideTimeout?: number;
  className?: SemanticClassName<{
    view?: string;
    trackHorizontal?: string;
    trackVertical?: string;
    thumbHorizontal?: string;
    thumbVertical?: string;
  }>;
  id?: string;
  onScroll?: (values: ScrollValues, e: React.UIEvent<HTMLElement>) => void;
  onScrollStart?: () => void;
  onScrollStop?: () => void;
  thumbMinSize?: number;
  thumbSize?: number;
  universal?: boolean;
  style?: React.CSSProperties;
  component?: React.ComponentType<any> | string;
  renderView?: (
    props: React.HTMLAttributes<HTMLElement> & { ref: React.RefObject<HTMLElement> },
  ) => React.ReactElement;
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
