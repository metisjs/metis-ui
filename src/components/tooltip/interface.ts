import { ComplexClassName } from '../_util/classNameUtils';
import { AdjustOverflow } from '../_util/placements';
import { TransitionProps } from '../transition';
import type { ActionType, AlignType, ArrowType, BuildInPlacements, TriggerProps } from '../trigger';

export interface AbstractTooltipProps
  extends Pick<TriggerProps, 'onPopupAlign' | 'builtinPlacements'> {
  trigger?: ActionType | ActionType[];
  defaultOpen?: boolean;
  open?: boolean;
  placement?: TooltipPlacement;
  onOpenChange?: (visible: boolean) => void;
  afterOpenChange?: (visible: boolean) => void;
  overlayStyle?: React.CSSProperties;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  getTooltipContainer?: (node: HTMLElement) => HTMLElement;
  destroyTooltipOnHide?: boolean;
  align?: AlignType;
  showArrow?: boolean | ArrowType;
  arrowContent?: React.ReactNode;
  id?: string;
  overlayInnerStyle?: React.CSSProperties;
  zIndex?: number;
  style?: React.CSSProperties;
  className?: ComplexClassName<'open' | 'overlay' | 'popup' | 'popupInner' | 'arrow'>;
  prefixCls?: string;
  color?: string;
  builtinPlacements?: BuildInPlacements;
  arrow?:
    | boolean
    | {
        pointAtCenter?: boolean;
      };
  autoAdjustOverflow?: boolean | AdjustOverflow;
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
  children?: React.ReactNode;
  transition?: Partial<TransitionProps>;
}

export interface TooltipRef {
  forceAlign: VoidFunction;
}

export type TooltipPlacement =
  | 'top'
  | 'left'
  | 'right'
  | 'bottom'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'leftTop'
  | 'leftBottom'
  | 'rightTop'
  | 'rightBottom';

export interface TooltipAlignConfig {
  points?: [string, string];
  offset?: [number | string, number | string];
  targetOffset?: [number | string, number | string];
  overflow?: { adjustX: boolean; adjustY: boolean };
  useCssRight?: boolean;
  useCssBottom?: boolean;
  useCssTransform?: boolean;
}

export type RenderFunction = () => React.ReactNode;

export interface TooltipPropsWithOverlay extends AbstractTooltipProps {
  title?: React.ReactNode | RenderFunction;
  overlay?: React.ReactNode | RenderFunction;
}

export interface TooltipPropsWithTitle extends AbstractTooltipProps {
  title: React.ReactNode | RenderFunction;
  overlay?: React.ReactNode | RenderFunction;
}

export declare type TooltipProps = TooltipPropsWithTitle | TooltipPropsWithOverlay;
