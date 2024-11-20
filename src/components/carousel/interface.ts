import type { CSSProperties, ReactNode } from 'react';
import type { SemanticClassName } from '../_util/classNameUtils';

export interface CarouselProps {
  prefixCls?: string;
  style?: CSSProperties;
  className?: SemanticClassName<{
    arrow?: string;
    indicator?: CarouselIndicatorProps['className'];
  }>;
  children?: ReactNode;
  defaultIndex?: number;
  autoPlay?: boolean | { interval?: number; hoverToPause?: boolean };
  speed?: number;
  animation?: 'slide' | 'fade' | 'card';
  trigger?: 'click' | 'hover';
  indicator?: boolean;
  vertical?: boolean;
  showArrow?: boolean;
  icons?: {
    prev?: ReactNode;
    next?: ReactNode;
  };
  indicatorPosition?: 'bottom' | 'top' | 'left' | 'right' | 'outer';
  timingFunc?: string;
  lazy?: boolean;
  onChange?: (index: number, prevIndex: number) => void;
}

export interface CarouselArrowProps
  extends Pick<CarouselProps, 'prefixCls' | 'vertical' | 'icons'> {
  className?: string;
  prev?: (e: any) => any;
  next?: (e: any) => any;
}

export interface CarouselIndicatorProps {
  prefixCls?: string;
  className?: SemanticClassName<{
    item: SemanticClassName<{ root: string }, { active?: boolean }>;
  }>;
  count: number;
  activeIndex?: number;
  position?: CarouselProps['indicatorPosition'];
  trigger?: CarouselProps['trigger'];
  onSelectIndex?: (e: number) => void;
}

export interface CarouselRef {
  goto: (index: number) => void;
  next: () => void;
  prev: () => void;
}
