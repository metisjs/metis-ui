import React, { Children, isValidElement, ReactNode } from 'react';

import { flattenDeep } from 'lodash';
import { DisabledContextProvider } from '../config-provider/DisabledContext';
import { useLocale } from '../locale';
import SkeletonButton from '../skeleton/Button';
import NormalCancelBtn from './components/NormalCancelBtn';
import NormalOkBtn from './components/NormalOkBtn';
import type { ModalContextProps } from './context';
import { ModalContextProvider } from './context';
import type { ModalProps } from './interface';
import { getConfirmLocale } from './locale';

interface FooterProps {
  onOk?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  onCancel?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
}

export function getSkeletonButtons(children: ReactNode): ReactNode[] | null {
  const buttons = Children.map(children, (child) => {
    if (isValidElement(child)) {
      if (child.type === React.Fragment) {
        return getSkeletonButtons(child.props.children);
      }
      if (
        (child.type as any).__METIS_BUTTON ||
        child.type === NormalCancelBtn ||
        child.type === NormalOkBtn
      ) {
        return <SkeletonButton />;
      }
      return false;
    }
    return false;
  })?.filter(Boolean);

  return buttons?.length ? flattenDeep(buttons) : null;
}

const Footer: React.FC<
  FooterProps &
    Pick<
      ModalProps,
      | 'loading'
      | 'footer'
      | 'okText'
      | 'okType'
      | 'cancelText'
      | 'confirmLoading'
      | 'okButtonProps'
      | 'cancelButtonProps'
    >
> = (props) => {
  const {
    okText,
    okType = 'primary',
    cancelText,
    confirmLoading,
    onOk,
    onCancel,
    okButtonProps,
    cancelButtonProps,
    footer,
    loading,
  } = props;

  const [locale] = useLocale('Modal', getConfirmLocale());

  // ================== Locale Text ==================
  const okTextLocale = okText || locale?.okText;
  const cancelTextLocale = cancelText || locale?.cancelText;

  // ================= Context Value =================
  const btnCtxValue: ModalContextProps = {
    confirmLoading,
    okButtonProps,
    cancelButtonProps,
    okTextLocale,
    cancelTextLocale,
    okType,
    onOk,
    onCancel,
  };

  const btnCtxValueMemo = React.useMemo(() => btnCtxValue, [...Object.values(btnCtxValue)]);

  let footerNode: React.ReactNode;
  if (typeof footer === 'function' || typeof footer === 'undefined') {
    footerNode = (
      <>
        <NormalCancelBtn />
        <NormalOkBtn />
      </>
    );

    if (typeof footer === 'function') {
      footerNode = footer(footerNode, {
        OkBtn: NormalOkBtn,
        CancelBtn: NormalCancelBtn,
      });
    }
  } else {
    footerNode = footer;
  }

  if (loading) {
    const loadingNode = getSkeletonButtons(footerNode);
    if (loadingNode !== null) {
      footerNode = loadingNode;
    }
  }

  return (
    <DisabledContextProvider disabled={false}>
      <ModalContextProvider value={btnCtxValueMemo}>{footerNode}</ModalContextProvider>
    </DisabledContextProvider>
  );
};

export default Footer;
