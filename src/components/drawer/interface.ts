import type { PortalProps } from '@rc-component/portal';
import type { SemanticClassName } from '@util/classNameUtils';
import type { ClosableType } from '@util/hooks/useClosable';

export type Placement = 'left' | 'right' | 'top' | 'bottom';

export interface PushConfig {
  distance?: number | string;
}

export interface PanelEvents {
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseOver?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  onKeyUp?: React.KeyboardEventHandler<HTMLDivElement>;
}

export type PanelAccessibility = Pick<
  React.DialogHTMLAttributes<HTMLDivElement>,
  keyof React.AriaAttributes
>;

export interface PanelProps extends PanelEvents, PanelAccessibility {
  prefixCls: string;
  open?: boolean;
  inline?: boolean;
  push?: boolean | PushConfig;
  forceRender?: boolean;
  autoFocus?: boolean;
  keyboard?: boolean;
  zIndex?: number;
  closable?: ClosableType;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  placement: Placement;
  id?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  width?: number;
  height?: number;
  loading?: boolean;

  // Mask
  mask?: boolean;
  maskClosable?: boolean;

  // Events
  afterOpenChange?: (open: boolean) => void;
  onClose?: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;

  // className
  className?: SemanticClassName<{
    mask?: string;
    content?: string;
    header?: string;
    footer?: string;
    body?: string;
    close?: string;
  }>;

  drawerRender?: (node: React.ReactNode) => React.ReactNode;
}

export interface DrawerProps
  extends Omit<PanelProps, 'prefixCls' | 'inline' | 'scrollLocker' | 'placement'>,
    PanelEvents,
    PanelAccessibility {
  prefixCls?: string;
  open?: boolean;
  placement?: Placement;
  onClose?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  destroyOnClose?: boolean;
  getContainer?: PortalProps['getContainer'];
}
