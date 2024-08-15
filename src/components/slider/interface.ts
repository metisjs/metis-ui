import type React from 'react';
import { SemanticClassName } from '../_util/classNameUtils';
import { AbstractTooltipProps, TooltipPlacement } from '../tooltip';
import { MarkObj } from './Marks';

export type Direction = 'rtl' | 'ltr' | 'ttb' | 'btt';

export type OnStartMove = (
  e: React.MouseEvent | React.TouchEvent,
  valueIndex: number,
  startValues?: number[],
) => void;

export type AriaValueFormat = (value: number) => string;

export type SemanticName = 'tracks' | 'track' | 'rail' | 'handle';

export type Formatter = ((value?: number) => React.ReactNode) | null;

export interface SliderTooltipProps extends AbstractTooltipProps {
  prefixCls?: string;
  open?: boolean;
  placement?: TooltipPlacement;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  formatter?: Formatter;
  autoAdjustOverflow?: boolean;
}

export interface SliderBaseProps {
  prefixCls?: string;
  reverse?: boolean;
  min?: number;
  max?: number;
  step?: null | number;
  marks?: Record<string | number, React.ReactNode | MarkObj>;
  dots?: boolean;
  included?: boolean;
  disabled?: boolean;
  keyboard?: boolean;
  vertical?: boolean;
  className?: SemanticClassName<SemanticName>;
  id?: string;
  style?: React.CSSProperties;
  tooltip?: SliderTooltipProps;
  autoFocus?: boolean;
  railStyle?: React.CSSProperties;
  handleStyle?: React.CSSProperties;
  track?: boolean;

  onFocus?: React.FocusEventHandler<HTMLDivElement>;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
}

interface HandleGeneratorInfo {
  value?: number;
  dragging?: boolean;
  index: number;
}

export type HandleGeneratorFn = (config: {
  tooltipPrefixCls?: string;
  prefixCls?: string;
  info: HandleGeneratorInfo;
}) => React.ReactElement;

export interface SliderTooltipProps extends AbstractTooltipProps {
  prefixCls?: string;
  open?: boolean;
  placement?: TooltipPlacement;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  formatter?: Formatter;
  autoAdjustOverflow?: boolean;
}

export interface SliderSingleProps extends SliderBaseProps {
  range?: false;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  onChangeComplete?: (value: number) => void;
}

interface SliderRange {
  draggableTrack?: boolean;
}

export interface SliderRangeProps extends SliderBaseProps {
  range: true | SliderRange;
  value?: number[];
  defaultValue?: number[];
  onChange?: (value: number[]) => void;
  onChangeComplete?: (value: number[]) => void;
}

export interface SliderRef {
  focus: () => void;
  blur: () => void;
}
