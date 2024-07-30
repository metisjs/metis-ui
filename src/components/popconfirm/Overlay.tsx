import * as React from 'react';
import { PopconfirmProps } from '.';
import ActionButton from '../_util/ActionButton';
import { clsx } from '../_util/classNameUtils';
import { getRenderPropValue } from '../_util/getRenderPropValue';
import { cloneElement } from '../_util/reactNode';
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

  const contentCls = clsx(`${prefixCls}-inner-content`, 'text-sm text-neutral-text');
  const iconCls = clsx(
    `${prefixCls}-message-icon`,
    'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-error-bg text-error',
  );
  const messageCls = clsx(`${prefixCls}-message`, 'flex gap-2');
  const messageTextCls = clsx(
    `${prefixCls}-message-text`,
    'flex min-h-8 flex-col justify-center gap-0.5',
  );
  const titleCls = clsx(`${prefixCls}-title`, 'font-medium text-neutral-text');
  const descriptionCls = clsx(`${prefixCls}-description`, 'text-neutral-text-secondary');
  const buttonsCls = clsx(`${prefixCls}-buttons`, 'mt-2 flex justify-end gap-2');

  return (
    <div className={contentCls} onClick={onPopupClick}>
      <div className={messageCls}>
        {icon && (
          <span className={iconCls}>
            {cloneElement(icon, (props) => ({
              ...props,
              className: clsx('h-5 w-5', props.className),
            }))}
          </span>
        )}
        <div className={messageTextCls}>
          {theTitle && <div className={titleCls}>{theTitle}</div>}
          {theDescription && <div className={descriptionCls}>{theDescription}</div>}
        </div>
      </div>
      <div className={buttonsCls}>
        {showCancel && (
          <Button onClick={onCancel} size="small" {...cancelButtonProps}>
            {cancelText || contextLocale?.cancelText}
          </Button>
        )}
        <ActionButton
          buttonProps={{
            size: 'small',
            type: okType,
            danger: true,
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
