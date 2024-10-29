import React from 'react';
import type { ScrollbarProps, ScrollbarRef } from '../scrollbar';

export interface VirtualListContextProps {
  prefixCls?: string;
  onScroll?: ScrollbarProps['onScroll'];
  className?: ScrollbarProps['className'];
  style?: ScrollbarProps['style'];
  scrollbar: React.RefObject<ScrollbarRef>;
}

const VirtualListContext = React.createContext<VirtualListContextProps>(null!);

export { VirtualListContext };
