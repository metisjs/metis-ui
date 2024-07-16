import { ExclamationTriangleOutline } from '@metisjs/icons';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import omit from 'rc-util/lib/omit';
import * as React from 'react';
import type { RenderFunction } from '../_util/getRenderPropValue';
import type { ButtonProps, ButtonType } from '../button';
import { ConfigContext } from '../config-provider';
import type { PopoverProps } from '../popover';
import Popover from '../popover';
import type { AbstractTooltipProps, TooltipRef } from '../tooltip';
import Overlay from './Overlay';

export interface PopconfirmProps extends AbstractTooltipProps {
  title: React.ReactNode | RenderFunction;
  description?: React.ReactNode | RenderFunction;
  disabled?: boolean;
  onConfirm?: (e?: React.MouseEvent<HTMLElement>) => void;
  onCancel?: (e?: React.MouseEvent<HTMLElement>) => void;
  okText?: React.ReactNode;
  okType?: ButtonType;
  cancelText?: React.ReactNode;
  okButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
  showCancel?: boolean;
  icon?: React.ReactNode;
  onPopupClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

const Popconfirm = React.forwardRef<TooltipRef, PopconfirmProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    placement = 'top',
    trigger = 'click',
    okType = 'primary',
    icon = <ExclamationTriangleOutline />,
    children,
    onOpenChange,
    ...restProps
  } = props;

  const { getPrefixCls } = React.useContext(ConfigContext);
  const [open, setOpen] = useMergedState(false, {
    value: props.open,
    defaultValue: props.defaultOpen,
    onChange: onOpenChange,
  });

  const close = () => {
    setOpen(false, true);
  };

  const onConfirm = (e: React.MouseEvent<HTMLButtonElement>) => props.onConfirm?.call(this, e);

  const onCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(false, true);
    props.onCancel?.call(this, e);
  };

  const onInternalOpenChange: PopoverProps['onOpenChange'] = (value) => {
    const { disabled = false } = props;
    if (disabled) {
      return;
    }
    setOpen(value, true);
  };

  const prefixCls = getPrefixCls('popconfirm', customizePrefixCls);

  return (
    <Popover
      {...omit(restProps, ['title'])}
      trigger={trigger}
      placement={placement}
      onOpenChange={onInternalOpenChange}
      open={open}
      ref={ref}
      content={
        <Overlay
          okType={okType}
          icon={icon}
          {...props}
          prefixCls={prefixCls}
          close={close}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      }
      data-popover-inject
    >
      {children}
    </Popover>
  );
});

if (process.env.NODE_ENV !== 'production') {
  Popconfirm.displayName = 'Popconfirm';
}

export default Popconfirm;
