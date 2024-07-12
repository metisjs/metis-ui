import {
  CheckOutline,
  ExclamationTriangleOutline,
  InformationCircleOutline,
  XMarkOutline,
} from '@metisjs/icons';
import * as React from 'react';
import { clsx } from '../_util/classNameUtils';
import { CONTAINER_MAX_OFFSET, Z_INDEX_BASE } from '../_util/hooks/useZIndex';
import { devUseWarning } from '../_util/warning';
import ConfigProvider from '../config-provider';
import { useLocale } from '../locale';
import CancelBtn from './components/ConfirmCancelBtn';
import OkBtn from './components/ConfirmOkBtn';
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

export function ConfirmContent(
  props: ConfirmModalProps & {
    confirmPrefixCls: string;
  },
) {
  const {
    icon,
    okText,
    cancelText,
    confirmPrefixCls,
    type,
    okCancel,
    footer,
    locale: staticLocale,
    ...resetProps
  } = props;

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

  // 默认为 true，保持向下兼容
  const mergedOkCancel = okCancel ?? type === 'confirm';

  const autoFocusButton = props.autoFocusButton === null ? false : props.autoFocusButton || 'ok';

  const [locale] = useLocale('Modal');

  const mergedLocale = staticLocale || locale;

  // ================== Locale Text ==================
  const okTextLocale = okText || (mergedOkCancel ? mergedLocale?.okText : mergedLocale?.justOkText);
  const cancelTextLocale = cancelText || mergedLocale?.cancelText;

  // ================= Context Value =================
  const btnCtxValue: ModalContextProps = {
    autoFocusButton,
    cancelTextLocale,
    okTextLocale,
    mergedOkCancel,
    ...resetProps,
  };
  const btnCtxValueMemo = React.useMemo(() => btnCtxValue, [...Object.values(btnCtxValue)]);

  // ====================== Footer Origin Node ======================
  const footerOriginNode = (
    <>
      <CancelBtn />
      <OkBtn />
    </>
  );

  const hasTitle = props.title !== undefined && props.title !== null;

  const bodyCls = `${confirmPrefixCls}-body`;

  return (
    <div className={`${confirmPrefixCls}-body-wrapper`}>
      <div
        className={clsx(bodyCls, {
          [`${bodyCls}-has-title`]: hasTitle,
        })}
      >
        {mergedIcon}
        <div className={`${confirmPrefixCls}-paragraph`}>
          {hasTitle && <span className={`${confirmPrefixCls}-title`}>{props.title}</span>}
          <div className={`${confirmPrefixCls}-content`}>{props.content}</div>
        </div>
      </div>

      {footer === undefined || typeof footer === 'function' ? (
        <ModalContextProvider value={btnCtxValueMemo}>
          <div className={`${confirmPrefixCls}-btns`}>
            {typeof footer === 'function'
              ? footer(footerOriginNode, {
                  OkBtn,
                  CancelBtn,
                })
              : footerOriginNode}
          </div>
        </ModalContextProvider>
      ) : (
        footer
      )}
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
    modalRender,
    focusTriggerAfterClose,
    onConfirm,
  } = props;

  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('Modal');

    [
      ['visible', 'open'],
      ['bodyStyle', 'styles.body'],
      ['maskStyle', 'styles.mask'],
    ].forEach(([deprecatedName, newName]) => {
      warning.deprecated(!(deprecatedName in props), deprecatedName, newName);
    });
  }

  const confirmPrefixCls = `${prefixCls}-confirm`;

  const width = props.width || 416;
  const style = props.style || {};
  const mask = props.mask === undefined ? true : props.mask;
  // 默认为 false，保持旧版默认行为
  const maskClosable = props.maskClosable === undefined ? false : props.maskClosable;

  const classString = clsx(confirmPrefixCls, `${confirmPrefixCls}-${props.type}`, props.className);

  // ========================= zIndex =========================
  const mergedZIndex = React.useMemo(() => {
    if (zIndex !== undefined) {
      return zIndex;
    }

    // Static always use max zIndex
    return Z_INDEX_BASE + CONTAINER_MAX_OFFSET;
  }, [zIndex]);

  // ========================= Render =========================
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
      footer={null}
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
