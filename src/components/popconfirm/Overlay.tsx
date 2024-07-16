import * as React from 'react';
import { PopconfirmProps } from '.';
import ActionButton from '../_util/ActionButton';
import { clsx } from '../_util/classNameUtils';
import { getRenderPropValue } from '../_util/getRenderPropValue';
import Button from '../button';
import { ConfigContext } from '../config-provider';
import { useLocale } from '../locale';
import defaultLocale from '../locale/zh_CN';

export interface PopconfirmLocale {
  okText: string;
  cancelText: string;
}

export interface OverlayProps
  extends Pick<
    PopconfirmProps,
    | 'icon'
    | 'okButtonProps'
    | 'cancelButtonProps'
    | 'cancelText'
    | 'okText'
    | 'okType'
    | 'showCancel'
    | 'title'
    | 'description'
    | 'onPopupClick'
  > {
  prefixCls: string;
  close?: (...args: any[]) => void;
  onConfirm?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
  onCancel?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
}

const Overlay: React.FC<OverlayProps> = (props) => {
  const {
    prefixCls,
    okButtonProps,
    cancelButtonProps,
    title,
    description,
    cancelText,
    okText,
    okType = 'primary',
    icon,
    showCancel = true,
    close,
    onConfirm,
    onCancel,
    onPopupClick,
  } = props;

  const { getPrefixCls } = React.useContext(ConfigContext);

  const [contextLocale] = useLocale('Popconfirm', defaultLocale.Popconfirm);
  const theTitle = getRenderPropValue(title);
  const theDescription = getRenderPropValue(description);

  return (
    <div className={`${prefixCls}-inner-content`} onClick={onPopupClick}>
      <div className={`${prefixCls}-message`}>
        {icon && <span className={`${prefixCls}-message-icon`}>{icon}</span>}
        <div className={`${prefixCls}-message-text`}>
          {theTitle && <div className={clsx(`${prefixCls}-title`)}>{theTitle}</div>}
          {theDescription && <div className={`${prefixCls}-description`}>{theDescription}</div>}
        </div>
      </div>
      <div className={`${prefixCls}-buttons`}>
        {showCancel && (
          <Button onClick={onCancel} size="small" {...cancelButtonProps}>
            {cancelText || contextLocale?.cancelText}
          </Button>
        )}
        <ActionButton
          buttonProps={{
            size: 'small',
            type: okType,
            ...okButtonProps,
          }}
          actionFn={onConfirm}
          close={close}
          prefixCls={getPrefixCls('btn')}
          quitOnNullishReturnValue
          emitEvent
        >
          {okText || contextLocale?.okText}
        </ActionButton>
      </div>
    </div>
  );
};

export default Overlay;
