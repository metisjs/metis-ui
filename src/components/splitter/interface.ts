import type { SemanticClassName } from '@util/classNameUtils';
import type { SplitBarProps } from './SplitBar';

// ================ outside ================
export interface SplitterProps {
  prefixCls?: string;
  className?: SemanticClassName<{
    bar?: SplitBarProps['className'];
    panel?: PanelProps['className'];
  }>;
  style?: React.CSSProperties;
  layout?: 'horizontal' | 'vertical';
  onResizeStart?: (sizes: number[]) => void;
  onResize?: (sizes: number[]) => void;
  onResizeEnd?: (sizes: number[]) => void;
}

export interface PanelProps {
  className?: SemanticClassName;
  style?: React.CSSProperties;
  min?: number | string;
  max?: number | string;
  size?: number | string;
  collapsible?: boolean | { start?: boolean; end?: boolean };
  resizable?: boolean;
  defaultSize?: number | string;
}

// ================ inside ================

export interface InternalPanelProps extends PanelProps {
  prefixCls?: string;
}

export interface UseResizeProps extends Pick<SplitterProps, 'onResize'> {
  basicsState: number[];
  items: PanelProps[];
  panelsRef: React.RefObject<(HTMLDivElement | null)[]>;
  reverse: boolean;
  setBasicsState: React.Dispatch<React.SetStateAction<number[]>>;
}

export interface UseResize {
  setSize: (data: { size: number; index: number }[]) => void;
  setOffset: (offset: number, containerSize: number, index: number) => void;
}

export interface UseHandleProps
  extends Pick<SplitterProps, 'layout' | 'onResizeStart' | 'onResizeEnd'> {
  basicsState: number[];
  containerRef?: React.RefObject<HTMLDivElement | null>;
  setOffset: UseResize['setOffset'];
  setResizing: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface UseHandle {
  onStart: (x: number, y: number, index: number) => void;
}

export interface UseCollapsibleProps {
  basicsState: number[];
  collapsible?: PanelProps['collapsible'];
  index: number;
  reverse: boolean;
  setSize?: UseResize['setSize'];
}

export interface UseCollapsible {
  nextIcon: boolean;
  overlap: boolean;
  previousIcon: boolean;
  onFold: (type: 'previous' | 'next') => void;
  setOldBasics: () => void;
}
