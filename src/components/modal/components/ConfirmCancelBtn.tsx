import type { FC } from 'react';
import React, { useContext } from 'react';
import ActionButton from '../../_util/ActionButton';
import type { ConfirmModalProps } from '../ConfirmModal';
import { ModalContext } from '../context';

export interface ConfirmCancelBtnProps
  extends Pick<
    ConfirmModalProps,
    'cancelButtonProps' | 'isSilent' | 'rootPrefixCls' | 'close' | 'onConfirm' | 'onCancel'
  > {
  autoFocusButton?: false | 'ok' | 'cancel' | null;
  cancelTextLocale?:
    | string
    | number
    | true
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | Iterable<React.ReactNode>;
  mergedOkCancel?: boolean;
}

const ConfirmCancelBtn: FC = () => {
  const {
    autoFocusButton,
    cancelButtonProps,
    cancelTextLocale,
    isSilent,
    mergedOkCancel,
    rootPrefixCls,
    close,
    onCancel,
    onConfirm,
  } = useContext(ModalContext);
  return mergedOkCancel ? (
    <ActionButton
      isSilent={isSilent}
      actionFn={onCancel}
      close={(...args: any[]) => {
        close?.(...args);
        onConfirm?.(false);
      }}
      autoFocus={autoFocusButton === 'cancel'}
      buttonProps={cancelButtonProps}
      prefixCls={`${rootPrefixCls}-btn`}
    >
      {cancelTextLocale}
    </ActionButton>
  ) : null;
};

export default ConfirmCancelBtn;
