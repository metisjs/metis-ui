import type { VirtuosoProps } from 'react-virtuoso';
import type { ScrollbarProps } from '../scrollbar';

export interface VirtualListProps<D, C>
  extends Omit<VirtuosoProps<D, C>, 'className' | 'itemContent' | 'onScroll' | 'computeItemKey'> {
  prefixCls?: string;
  virtual?: boolean;
  autoHeight?: ScrollbarProps['autoHeight'];
  className?: ScrollbarProps['className'];
  itemKey: string | ((item: D, index: number, context?: C) => React.Key);
  renderItem?: (data: D, index: number, context?: C) => React.ReactNode;
  onScroll?: ScrollbarProps['onScroll'];
}

export type ScrollPos = {
  left?: number;
  top?: number;
};

export type ScrollAlign = 'start' | 'center' | 'end';

export type ScrollBehavior = 'auto' | 'smooth';

export type ScrollTarget =
  | {
      index: number;
      align?: ScrollAlign;
      behavior?: ScrollBehavior;
      offset?: number;
    }
  | {
      key: React.Key;
      align?: ScrollAlign;
      behavior?: ScrollBehavior;
      offset?: number;
    };

export interface ScrollInfo {
  left: number;
  top: number;
}

export type ScrollConfig = ScrollTarget | ScrollPos;

export type ScrollTo = (arg: number | ScrollConfig) => void;

export type VirtualListRef = { scrollTo: ScrollTo; getScrollInfo: () => ScrollInfo };

export type VirtualType =
  | boolean
  | Omit<
      VirtualListProps<any, any>,
      'prefixCls' | 'data' | 'renderItem' | 'className' | 'style' | 'onScroll'
    >;
