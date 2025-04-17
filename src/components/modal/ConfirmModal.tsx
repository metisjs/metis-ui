import * as React from 'react';
import {
  CheckOutline,
  ExclamationTriangleOutline,
  InformationCircleOutline,
  XMarkOutline,
} from '@metisjs/icons';
import { clsx, mergeSemanticCls } from '@util/classNameUtils';
import { CONTAINER_MAX_OFFSET, Z_INDEX_BASE } from '@util/hooks/useZIndex';
import ConfigProvider from '../config-provider';
import { useLocale } from '../locale';
import { default as ConfirmCancelBtn } from './components/ConfirmCancelBtn';
import { default as ConfirmOkBtn } from './components/ConfirmOkBtn';
import type { ModalContextProps } from './context';
import { ModalContextProvider } from './context';
import type { ModalFuncProps, ModalLocale } from './interface';
import Modal from './Modal';

export interface ConfirmModalProps extends ModalFuncProps {
  prefixCls: string;
  afterClose?: () => void;
  close?: (...args: any[]) => void;
  /**
   * `close` prop support `...args` that pass to the developer
   * that we can not break this.
   * Provider `onClose` for internal usage
   */
  onConfirm?: (confirmed: boolean) => void;
  autoFocusButton?: null | 'ok' | 'cancel';
  rootPrefixCls?: string;

  /** @private Internal Usage. Do not override this */
  locale?: ModalLocale;

  /**
   * Do not throw if is await mode
   */
  isSilent?: () => boolean;
}

const ConfirmFooter: React.FC<ConfirmModalProps> = (props) => {
  const {
    type,
    okText,
    okType = 'primary',
    cancelText,
    onOk,
    onCancel,
    okButtonProps,
    cancelButtonProps,
    footer,
    locale: staticLocale,
    okCancel,
    isSilent,
    rootPrefixCls,
    close,
    onConfirm,
  } = props;

  const [locale] = useLocale('Modal');

  const mergedLocale = staticLocale || locale;

  const mergedOkCancel = okCancel ?? type === 'confirm';

  const autoFocusButton = props.autoFocusButton === null ? false : props.autoFocusButton || 'ok';

  // ================== Locale Text ==================
  const okTextLocale = okText || (mergedOkCancel ? mergedLocale?.okText : mergedLocale?.justOkText);
  const cancelTextLocale = cancelText || mergedLocale?.cancelText;

  // ================= Context Value =================
  const btnCtxValue: ModalContextProps = {
    autoFocusButton,
    close,
    isSilent,
    okButtonProps: type === 'confirm' ? { danger: true, ...okButtonProps } : okButtonProps,
    rootPrefixCls,
    okTextLocale,
    okType,
    onConfirm,
    onOk,
    cancelButtonProps,
    cancelTextLocale,
    mergedOkCancel,
    onCancel,
  };

  const btnCtxValueMemo = React.useMemo(() => btnCtxValue, [...Object.values(btnCtxValue)]);

  let footerNode: React.ReactNode;
  if (typeof footer === 'function' || typeof footer === 'undefined') {
    footerNode = (
      <>
        <ConfirmCancelBtn />
        <ConfirmOkBtn />
      </>
    );

    if (typeof footer === 'function') {
      footerNode = footer(footerNode, {
        OkBtn: ConfirmCancelBtn,
        CancelBtn: ConfirmCancelBtn,
      });
    }
  } else {
    footerNode = footer;
  }

  return <ModalContextProvider value={btnCtxValueMemo}>{footerNode}</ModalContextProvider>;
};

function ConfirmContent(
  props: ConfirmModalProps & {
    confirmPrefixCls: string;
  },
) {
  const { icon, confirmPrefixCls, type, title, content } = props;

  // Icon
  let mergedIcon: React.ReactNode = icon;

  // 支持传入{ icon: null }来隐藏`Modal.confirm`默认的Icon
  if (!icon && icon !== null) {
    switch (type) {
      case 'info':
        mergedIcon = <InformationCircleOutline />;
        break;

      case 'success':
        mergedIcon = <CheckOutline />;
        break;

      case 'error':
        mergedIcon = <XMarkOutline />;
        break;

      default:
        mergedIcon = <ExclamationTriangleOutline />;
    }
  }

  const hasTitle = title !== undefined && title !== null;
  const hasContent = content !== undefined && title !== null;

  const bodyCls = clsx(`${confirmPrefixCls}-body`, 'flex items-start max-sm:block');
  const iconCls = clsx(
    `${confirmPrefixCls}-icon`,
    'mx-0 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-2xl max-sm:mx-auto max-sm:h-12 max-sm:w-12',
    {
      'bg-error-bg text-error': type === 'confirm' || type === 'error',
      'bg-info-bg text-info': type === 'info',
      'bg-success-bg text-success': type === 'success',
      'bg-warning-bg text-warning': type === 'warning',
    },
  );
  const paragraphCls = clsx(
    `${confirmPrefixCls}-paragraph`,
    'mt-0 ml-4 text-left max-sm:mt-3 max-sm:ml-0 max-sm:text-center',
  );
  const titleCls = clsx(
    `${confirmPrefixCls}-title`,
    'text-text text-base leading-6 font-semibold',
    !hasContent && 'leading-10 max-sm:leading-6',
  );
  const contentCls = clsx(
    `${confirmPrefixCls}-content`,
    'text-text-secondary mt-2 text-sm',
    !hasTitle && 'mt-[0.625rem] max-sm:mt-0',
  );

  return (
    <div className={bodyCls}>
      <div className={iconCls}>{mergedIcon}</div>
      <div className={paragraphCls}>
        {hasTitle && <span className={titleCls}>{title}</span>}
        <div className={contentCls}>
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
}

const ConfirmModal: React.FC<ConfirmModalProps> = (props) => {
  const {
    close,
    zIndex,
    afterClose,
    open,
    keyboard,
    centered,
    getContainer,
    prefixCls,
    closable = false,
    footer,
    modalRender,
    focusTriggerAfterClose,
    onConfirm,
  } = props;

  const confirmPrefixCls = `${prefixCls}-confirm`;

  const width = props.width || 512;
  const style = props.style || {};
  const mask = props.mask === undefined ? true : props.mask;
  const maskClosable = props.maskClosable === undefined ? false : props.maskClosable;

  const classString = mergeSemanticCls(
    {
      root: clsx(confirmPrefixCls, `${confirmPrefixCls}-${props.type}`),
      footer: clsx('flex-row px-6 py-3 max-sm:flex-col-reverse max-sm:px-4'),
    },
    props.className,
  );

  // ========================= zIndex =========================
  const mergedZIndex = React.useMemo(() => {
    if (zIndex !== undefined) {
      return zIndex;
    }

    // Static always use max zIndex
    return Z_INDEX_BASE + CONTAINER_MAX_OFFSET;
  }, [zIndex]);

  // ========================= Render =========================
  const mergedFooter = footer !== null ? <ConfirmFooter {...props} /> : null;

  return (
    <Modal
      prefixCls={prefixCls}
      className={classString}
      onCancel={() => {
        close?.({ triggerCancel: true });
        onConfirm?.(false);
      }}
      open={open}
      title=""
      footer={mergedFooter}
      mask={mask}
      maskClosable={maskClosable}
      style={style}
      width={width}
      zIndex={mergedZIndex}
      afterClose={afterClose}
      keyboard={keyboard}
      centered={centered}
      getContainer={getContainer}
      closable={closable}
      modalRender={modalRender}
      focusTriggerAfterClose={focusTriggerAfterClose}
    >
      <ConfirmContent {...props} confirmPrefixCls={confirmPrefixCls} />
    </Modal>
  );
};

const ConfirmModalWrapper: React.FC<ConfirmModalProps> = (props) => {
  const { rootPrefixCls } = props;

  return (
    <ConfigProvider prefixCls={rootPrefixCls}>
      <ConfirmModal {...props} />
    </ConfigProvider>
  );
};

if (process.env.NODE_ENV !== 'production') {
  ConfirmModal.displayName = 'ConfirmModal';
  ConfirmModalWrapper.displayName = 'ConfirmModalWrapper';
}

export default ConfirmModalWrapper;
