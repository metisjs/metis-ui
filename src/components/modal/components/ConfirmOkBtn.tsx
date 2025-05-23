import type { FC } from 'react';
import React, { useContext } from 'react';
import ActionButton from '@util/ActionButton';
import { mergeSemanticCls } from '@util/classNameUtils';
import type { ConfirmModalProps } from '../ConfirmModal';
import { ModalContext } from '../context';

export interface ConfirmOkBtnProps
  extends Pick<
    ConfirmModalProps,
    'close' | 'isSilent' | 'okType' | 'okButtonProps' | 'rootPrefixCls' | 'onConfirm' | 'onOk'
  > {
  autoFocusButton?: false | 'ok' | 'cancel' | null;
  okTextLocale?: React.ReactNode;
}

const ConfirmOkBtn: FC = () => {
  const {
    autoFocusButton,
    close,
    isSilent,
    okButtonProps,
    rootPrefixCls,
    okTextLocale,
    okType,
    onConfirm,
    onOk,
  } = useContext(ModalContext);
  return (
    <ActionButton
      isSilent={isSilent}
      type={okType || 'primary'}
      actionFn={onOk}
      close={(...args: any[]) => {
        close?.(...args);
        onConfirm?.(true);
      }}
      autoFocus={autoFocusButton === 'ok'}
      buttonProps={{
        ...okButtonProps,
        className: mergeSemanticCls({ root: 'w-auto max-sm:w-full' }, okButtonProps?.className),
      }}
      prefixCls={`${rootPrefixCls}-btn`}
    >
      {okTextLocale}
    </ActionButton>
  );
};

export default ConfirmOkBtn;
