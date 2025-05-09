import type { SemanticClassName } from '@util/classNameUtils';
import type { PresetColorType } from '@util/colors';
import type { AdjustOverflow } from '@util/placements';
import type { LiteralUnion } from '@util/type';
import type { TransitionProps } from '../transition';
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
  className?: SemanticClassName<
    {
      overlay?: string;
      arrow?: string;
      content?: string;
    },
    { open?: boolean }
  >;
  prefixCls?: string;
  color?: LiteralUnion<PresetColorType>;
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
  nativeElement?: HTMLElement;
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
