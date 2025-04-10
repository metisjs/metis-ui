import type { CSSProperties, ReactNode } from 'react';
import type { GetContainer } from '@rc-component/util/es/PortalWrapper';
import type { SemanticClassName } from '@util/classNameUtils';
import type { ClosableType } from '@util/hooks/useClosable';
import type { ButtonProps, ButtonType } from '../button';

export type ModalProps = {
  className?: SemanticClassName<{
    header?: string;
    body?: string;
    footer?: string;
    mask?: string;
    close?: string;
  }>;
  keyboard?: boolean;
  style?: CSSProperties;
  mask?: boolean;
  children?: React.ReactNode;
  closable?: ClosableType;
  maskClosable?: boolean;
  open?: boolean;
  destroyOnClose?: boolean;
  title?: ReactNode;
  footer?:
    | React.ReactNode
    | ((
        originNode: React.ReactNode,
        extra: { OkBtn: React.FC; CancelBtn: React.FC },
      ) => React.ReactNode);
  prefixCls?: string;
  centered?: boolean;
  width?: string | number;
  height?: string | number;
  zIndex?: number;
  wrapProps?: React.HTMLProps<HTMLDivElement>;
  bodyProps?: React.HTMLProps<HTMLDivElement>;
  maskProps?: React.HTMLProps<HTMLDivElement>;
  getContainer?: GetContainer | false;
  modalRender?: (node: ReactNode) => React.ReactElement;
  forceRender?: boolean;
  focusTriggerAfterClose?: boolean;
  loading?: boolean;
  confirmLoading?: boolean;
  okText?: React.ReactNode;
  okType?: ButtonType;
  cancelText?: React.ReactNode;
  okButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
  onOk?: (e: React.SyntheticEvent) => void;
  onCancel?: (e: React.SyntheticEvent) => void;
  afterClose?: () => any;
  afterOpenChange?: (open: boolean) => void;
};

export interface ModalFuncProps extends Omit<ModalProps, 'loading'> {
  content?: React.ReactNode;
  type?: 'info' | 'success' | 'error' | 'warning' | 'confirm';
  autoFocusButton?: null | 'ok' | 'cancel';
  icon?: React.ReactNode;
  okCancel?: boolean;
  onOk?: (...args: any[]) => any;
  onCancel?: (...args: any[]) => any;
}

export interface ModalLocale {
  okText: string;
  cancelText: string;
  justOkText: string;
}
