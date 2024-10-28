import React from 'react';
import type { ScrollbarProps } from '../scrollbar';

export interface VirtualListContextProps {
  prefixCls?: string;
  autoHeight?: ScrollbarProps['autoHeight'];
  onScroll?: ScrollbarProps['onScroll'];
  className?: ScrollbarProps['className'];
  style?: ScrollbarProps['style'];
}

const VirtualListContext = React.createContext<VirtualListContextProps>({});

export { VirtualListContext };
