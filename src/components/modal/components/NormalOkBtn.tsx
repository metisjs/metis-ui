import type { FC } from 'react';
import React, { useContext } from 'react';
import Button from '../../button';
import { ModalContext } from '../context';
import type { ModalProps } from '../interface';

export interface NormalOkBtnProps
  extends Pick<ModalProps, 'confirmLoading' | 'okType' | 'okButtonProps' | 'onOk'> {
  okTextLocale?: React.ReactNode;
}

const NormalOkBtn: FC = () => {
  const { confirmLoading, okButtonProps, okType, okTextLocale, onOk } = useContext(ModalContext);
  return (
    <Button type={okType} loading={confirmLoading} onClick={onOk} {...okButtonProps}>
      {okTextLocale}
    </Button>
  );
};

export default NormalOkBtn;
