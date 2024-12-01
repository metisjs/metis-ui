import * as React from 'react';
import ActionButton from '@util/ActionButton';
import { clsx } from '@util/classNameUtils';
import { getRenderPropValue } from '@util/getRenderPropValue';
import useSemanticCls from '@util/hooks/useSemanticCls';
import { cloneElement } from '@util/reactNode';
import type { PopconfirmProps } from '.';
import Button from '../button';
import { ConfigContext } from '../config-provider';
import { useLocale } from '../locale';
import defaultLocale from '../locale/en_US';

export interface PopconfirmLocale {
  okText: string;
  cancelText: string;
}

export interface OverlayProps
  extends Pick<
    PopconfirmProps,
    | 'className'
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
    className,
    close,
    onConfirm,
    onCancel,
    onPopupClick,
  } = props;

  const { getPrefixCls } = React.useContext(ConfigContext);

  const [contextLocale] = useLocale('Popconfirm', defaultLocale.Popconfirm);
  const theTitle = getRenderPropValue(title);
  const theDescription = getRenderPropValue(description);

  const semanticCls = useSemanticCls(className, 'popConfirm', { open: true });

  const contentCls = clsx(`${prefixCls}-inner-content`, 'text-sm text-text', semanticCls.root);
  const iconCls = clsx(
    `${prefixCls}-message-icon`,
    'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-error-bg text-error',
    semanticCls.icon,
  );
  const messageCls = clsx(`${prefixCls}-message`, 'flex gap-2');
  const messageTextCls = clsx(
    `${prefixCls}-message-text`,
    'flex min-h-8 flex-col justify-center gap-0.5',
  );
  const titleCls = clsx(`${prefixCls}-title`, 'font-medium text-text', semanticCls.title);
  const descriptionCls = clsx(
    `${prefixCls}-description`,
    'text-text-secondary',
    semanticCls.description,
  );
  const actionsCls = clsx(
    `${prefixCls}-actions`,
    'mt-2 flex justify-end gap-2',
    semanticCls.actions,
  );

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
      <div className={actionsCls}>
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
