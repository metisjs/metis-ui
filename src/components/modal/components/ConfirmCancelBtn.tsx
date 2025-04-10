import type { FC } from 'react';
import React, { useContext } from 'react';
import ActionButton from '@util/ActionButton';
import { mergeSemanticCls } from '@util/classNameUtils';
import type { ConfirmModalProps } from '../ConfirmModal';
import { ModalContext } from '../context';

export interface ConfirmCancelBtnProps
  extends Pick<
    ConfirmModalProps,
    'cancelButtonProps' | 'isSilent' | 'rootPrefixCls' | 'close' | 'onConfirm' | 'onCancel'
  > {
  autoFocusButton?: false | 'ok' | 'cancel' | null;
  cancelTextLocale?: React.ReactNode;
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
      buttonProps={{
        ...cancelButtonProps,
        className: mergeSemanticCls({ root: 'w-auto xs:w-full' }, cancelButtonProps?.className),
      }}
      prefixCls={`${rootPrefixCls}-btn`}
    >
      {cancelTextLocale}
    </ActionButton>
  ) : null;
};

export default ConfirmCancelBtn;
