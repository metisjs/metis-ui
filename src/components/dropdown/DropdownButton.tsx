import * as React from 'react';
import Button from '../button';
import { ConfigContext } from '../config-provider';
import Space from '../space';
import { useCompactItemContext } from '../space/Compact';
import Dropdown from './Dropdown';

import { EllipsisHorizontalOutline } from '@metisjs/icons';
import { SemanticClassName, clsx, getSemanticCls } from '../_util/classNameUtils';
import type { ButtonProps } from '../button';
import { ButtonHTMLType } from '../button/Button';
import { SizeType } from '../config-provider/SizeContext';
import type { DropdownProps } from './Dropdown';

export type DropdownButtonType = 'default' | 'primary' | 'link' | 'text';

export interface DropdownButtonProps extends DropdownProps {
  className?: SemanticClassName<'overlay' | 'open' | 'button'>;
  type?: DropdownButtonType;
  htmlType?: ButtonHTMLType;
  danger?: boolean;
  disabled?: boolean;
  loading?: ButtonProps['loading'];
  onClick?: React.MouseEventHandler<HTMLElement>;
  icon?: React.ReactNode;
  href?: string;
  title?: string;
  buttonsRender?: (buttons: React.ReactNode[]) => React.ReactNode[];
  size?: SizeType;
  style?: React.CSSProperties;
  prefixCls?: string;
  children?: React.ReactNode;
}

type CompoundedComponent = React.FC<DropdownButtonProps> & {
  /** @internal */
  __METIS_BUTTON: boolean;
};

const DropdownButton: CompoundedComponent = (props) => {
  const { getPopupContainer: getContextPopupContainer, getPrefixCls } =
    React.useContext(ConfigContext);

  const {
    prefixCls: customizePrefixCls,
    type = 'default',
    danger,
    disabled,
    loading,
    onClick,
    htmlType,
    children,
    className,
    menu,
    arrow,
    autoFocus,
    trigger,
    align,
    open,
    onOpenChange,
    placement,
    getPopupContainer,
    href,
    icon = <EllipsisHorizontalOutline />,
    title,
    buttonsRender = (buttons: React.ReactNode[]) => buttons,
    mouseEnterDelay,
    mouseLeaveDelay,
    destroyPopupOnHide,
    dropdownRender,
    ...restProps
  } = props;

  const semanticCls = getSemanticCls(className);
  const prefixCls = getPrefixCls('dropdown', customizePrefixCls);
  const buttonPrefixCls = `${prefixCls}-button`;

  const dropdownProps: DropdownProps = {
    menu,
    arrow,
    autoFocus,
    align,
    disabled,
    trigger: disabled ? [] : trigger,
    onOpenChange,
    getPopupContainer: getPopupContainer || getContextPopupContainer,
    mouseEnterDelay,
    mouseLeaveDelay,
    destroyPopupOnHide,
    dropdownRender,
    className: { overlay: semanticCls.overlay, open: semanticCls.open },
  };

  const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls);

  const classes = clsx(buttonPrefixCls, semanticCls.root, compactItemClassnames);

  if ('open' in props) {
    dropdownProps.open = open;
  }

  if ('placement' in props) {
    dropdownProps.placement = placement;
  } else {
    dropdownProps.placement = 'bottomRight';
  }

  const leftButton = (
    <Button
      type={type}
      danger={danger}
      disabled={disabled}
      loading={loading}
      onClick={onClick}
      htmlType={htmlType}
      href={href}
      title={title}
      className={semanticCls.button}
    >
      {children}
    </Button>
  );

  const rightButton = (
    <Button type={type} danger={danger} icon={icon} className={semanticCls.button} />
  );

  const [leftButtonToRender, rightButtonToRender] = buttonsRender([leftButton, rightButton]);

  return (
    <Space.Compact className={classes} size={compactSize} block {...restProps}>
      {leftButtonToRender}
      <Dropdown {...dropdownProps}>{rightButtonToRender}</Dropdown>
    </Space.Compact>
  );
};

DropdownButton.__METIS_BUTTON = true;

export default DropdownButton;
