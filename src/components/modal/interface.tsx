import type { GetContainer } from 'rc-util/lib/PortalWrapper';
import type { CSSProperties, ReactNode } from 'react';
import { SemanticClassName } from '../_util/classNameUtils';
import { ClosableType } from '../_util/hooks/useClosable';
import { ButtonProps, ButtonType } from '../button';

export type ModalProps = {
  className?: SemanticClassName<'header' | 'body' | 'footer' | 'mask' | 'content' | 'wrapper'>;
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
  modalRender?: (node: ReactNode) => ReactNode;
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
  type?: 'info' | 'success' | 'error' | 'warn' | 'warning' | 'confirm';
  autoFocusButton?: null | 'ok' | 'cancel';
}

export interface ModalLocale {
  okText: string;
  cancelText: string;
  justOkText: string;
}
