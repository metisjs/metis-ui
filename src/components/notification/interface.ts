import type * as React from 'react';

import { SemanticClassName } from '../_util/classNameUtils';
import type { BaseClosableType, ClosableType } from '../_util/hooks/useClosable';
import { TransitionProps } from '../transition';

interface DivProps extends React.HTMLProps<HTMLDivElement> {
  'data-testid'?: string;
}

export const NotificationPlacements = [
  'top',
  'topLeft',
  'topRight',
  'bottom',
  'bottomLeft',
  'bottomRight',
] as const;
export type NotificationPlacement = (typeof NotificationPlacements)[number];
export type NotificationPlacementRecord = Partial<Record<NotificationPlacement, OpenConfig[]>>;

export type IconType = 'success' | 'info' | 'error' | 'warning';

export interface ArgsProps {
  message: React.ReactNode;
  description?: React.ReactNode;
  btn?: React.ReactNode;
  key?: React.Key;
  onClose?: () => void;
  duration?: number | null;
  showProgress?: boolean;
  pauseOnHover?: boolean;
  icon?: React.ReactNode;
  placement?: NotificationPlacement;
  style?: React.CSSProperties;
  className?: SemanticClassName<'message' | 'icon' | 'description' | 'btn'>;
  readonly type?: IconType;
  onClick?: () => void;
  closable?: ClosableType;
  props?: DivProps;
  role?: 'alert' | 'status';
}

type StaticFn = (args: ArgsProps) => void;
export interface NotificationInstance {
  success: StaticFn;
  error: StaticFn;
  info: StaticFn;
  warning: StaticFn;
  open: StaticFn;
  destroy(key?: React.Key): void;
}

export interface NotificationAPI {
  open: (config: Partial<OpenConfig>) => void;
  close: (key: React.Key) => void;
  destroy: () => void;
}

export interface NotificationConfig {
  top?: number;
  bottom?: number;
  duration?: number;
  showProgress?: boolean;
  pauseOnHover?: boolean;
  prefixCls?: string;
  placement?: NotificationPlacement;
  closable?: ClosableType;
  maxCount?: number;
  stack?: StackConfig;
  transition?:
    | Partial<TransitionProps>
    | ((placement: NotificationPlacement) => Partial<TransitionProps>);
  props?: DivProps;
  getContainer?: () => HTMLElement | ShadowRoot;
  className?: (placement: NotificationPlacement) => SemanticClassName<'notice' | 'wrapper'>;
  style?: (placement: NotificationPlacement) => React.CSSProperties;
  onAllRemoved?: VoidFunction;
}

export interface NoticeConfig {
  content?: React.ReactNode;
  duration?: number;
  showProgress?: boolean;
  pauseOnHover?: boolean;
  closable?: BaseClosableType;
  className?: string;
  style?: React.CSSProperties;
  /** @private Internal usage. Do not override in your code */
  props?: React.HTMLAttributes<HTMLDivElement> & Record<string, any>;

  onClose?: VoidFunction;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export interface OpenConfig extends Omit<ArgsProps, 'type'> {
  key: React.Key;
  content?: React.ReactNode;
}

export type InnerOpenConfig = OpenConfig & { times?: number };

export type StackConfig =
  | boolean
  | {
      /**
       * When number is greater than threshold, notifications will be stacked together.
       * @default 3
       */
      threshold?: number;
      /**
       * Offset when notifications are stacked together.
       * @default 8
       */
      offset?: number;
      /**
       * Spacing between each notification when expanded.
       */
      gap?: number;
    };
