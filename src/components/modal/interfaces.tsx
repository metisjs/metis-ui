import type { GetContainer } from 'rc-util/lib/PortalWrapper';
import type { CSSProperties, ReactNode, SyntheticEvent } from 'react';
import { ClosableType } from '../_util/hooks/useClosable';

export interface ModalClassNames {
  header?: string;
  body?: string;
  footer?: string;
  mask?: string;
  content?: string;
  wrapper?: string;
}

export interface ModalStyles {
  header?: CSSProperties;
  body?: CSSProperties;
  footer?: CSSProperties;
  mask?: CSSProperties;
  wrapper?: CSSProperties;
  content?: CSSProperties;
}

export type ModalProps = {
  className?: string;
  keyboard?: boolean;
  style?: CSSProperties;
  mask?: boolean;
  children?: React.ReactNode;
  afterClose?: () => any;
  afterOpenChange?: (open: boolean) => void;
  onClose?: (e: SyntheticEvent) => any;
  closable?: ClosableType;
  maskClosable?: boolean;
  open?: boolean;
  destroyOnClose?: boolean;
  title?: ReactNode;
  footer?: ReactNode;
  prefixCls?: string;
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
};
