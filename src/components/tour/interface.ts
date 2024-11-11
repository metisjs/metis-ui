import type { CSSProperties, ReactNode } from 'react';
import type { SemanticClassName } from '../_util/classNameUtils';
import type { ClosableType } from '../_util/hooks/useClosable';
import type { ButtonProps } from '../button';
import type { TriggerProps } from '../trigger';
import type { Gap } from './hooks/useTarget';
import type { PlacementType } from './placements';

export interface TourStepInfo {
  arrow?: boolean | { pointAtCenter: boolean };
  target?: HTMLElement | (() => HTMLElement) | null | (() => null);
  title: ReactNode;
  description?: ReactNode;
  placement?: PlacementType;
  mask?: boolean;
  className?: SemanticClassName;
  style?: CSSProperties;
  scrollIntoViewOptions?: boolean | ScrollIntoViewOptions;
  closable?: ClosableType;
  onPrev?: () => void;
  onNext?: () => void;
  // Display pictures or videos
  cover?: ReactNode;
  nextButtonProps?: Omit<ButtonProps, 'onClick'>;
  prevButtonProps?: Omit<ButtonProps, 'onClick'>;
  type?: 'default' | 'primary';
}

export interface TourProps extends Pick<TriggerProps, 'onPopupAlign'> {
  prefixCls?: string;
  steps?: TourStepInfo[];
  open?: boolean;
  defaultCurrent?: number;
  current?: number;
  onChange?: (current: number) => void;
  onClose?: (current: number) => void;
  onFinish?: () => void;
  closable?: TourStepInfo['closable'];
  mask?: boolean;
  arrow?: boolean | { pointAtCenter: boolean };
  className?: SemanticClassName;
  placement?: PlacementType;
  gap?: Gap;
  animated?: boolean | { placeholder: boolean };
  scrollIntoViewOptions?: boolean | ScrollIntoViewOptions;
  zIndex?: number;
  getPopupContainer?: TriggerProps['getPopupContainer'];
  builtinPlacements?:
    | TriggerProps['builtinPlacements']
    | ((config?: { arrowPointAtCenter?: boolean }) => TriggerProps['builtinPlacements']);
  disabledInteraction?: boolean;
  indicatorsRender?: (current: number, total: number) => ReactNode;
  //	default type, affects the background color and text color
  type?: 'default' | 'primary';
}

export interface TourLocale {
  Next: string;
  Previous: string;
  Finish: string;
}
