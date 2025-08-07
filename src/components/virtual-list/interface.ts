import type { VirtuosoProps } from 'react-virtuoso';
import type { ScrollbarProps, ScrollValues } from '../scrollbar';

export interface VirtualListProps<D, C>
  extends Omit<
    VirtuosoProps<D, C>,
    'className' | 'itemContent' | 'onScroll' | 'computeItemKey' | 'startReached' | 'endReached'
  > {
  prefixCls?: string;
  virtual?: boolean;
  autoHeight?: ScrollbarProps['autoHeight'];
  className?: ScrollbarProps['className'];
  itemKey: string | ((item: D, index: number, context?: C) => React.Key);
  renderItem?: (data: D, index: number, context?: C) => React.ReactNode;
  onScroll?: ScrollbarProps['onScroll'];
  startReached?: () => void;
  endReached?: () => void;
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

export type ScrollConfig = ScrollTarget | ScrollPos;

export type ScrollTo = (arg: number | ScrollConfig) => void;

export type VirtualListRef = {
  scrollTo: ScrollTo;
  getScrollValues: () => ScrollValues;
  nativeElement: HTMLElement;
};
