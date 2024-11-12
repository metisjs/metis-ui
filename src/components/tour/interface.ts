import type { CSSProperties, ReactNode } from 'react';
import type { SemanticClassName } from '../_util/classNameUtils';
import type { ClosableType } from '../_util/hooks/useClosable';
import type { ButtonProps } from '../button';
import type { TooltipPlacement } from '../tooltip';
import type { TriggerProps } from '../trigger';
import type { Gap } from './hooks/useTarget';

export type TourPlacement = TooltipPlacement;

export type SemanticClassStruct = {
  popup?: string;
  mask?: string;
  next?: ButtonProps['className'];
  prev?: ButtonProps['className'];
  cover?: string;
  close?: string;
  content?: string;
  indicators?: string;
  title?: string;
  description?: string;
  footer?: string;
};

export interface TourStepInfo {
  arrow?: boolean | { pointAtCenter: boolean };
  target?: HTMLElement | (() => HTMLElement) | null | (() => null);
  title: ReactNode;
  description?: ReactNode;
  placement?: TourPlacement;
  mask?: boolean;
  className?: SemanticClassName<SemanticClassStruct>;
  style?: CSSProperties;
  scrollIntoViewOptions?: boolean | ScrollIntoViewOptions;
  closable?: ClosableType;
  // Display pictures or videos
  cover?: ReactNode;
  nextButtonProps?: Omit<ButtonProps, 'onClick'> & { children?: ReactNode };
  prevButtonProps?: Omit<ButtonProps, 'onClick'> & { children?: ReactNode };
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
  className?: SemanticClassName<SemanticClassStruct>;
  placement?: TourPlacement;
  gap?: Gap;
  scrollIntoViewOptions?: boolean | ScrollIntoViewOptions;
  zIndex?: number;
  getPopupContainer?: TriggerProps['getPopupContainer'];
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
