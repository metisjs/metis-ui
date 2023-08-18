import Overflow from 'rc-overflow';
import toArray from 'rc-util/lib/Children/toArray';
import KeyCode from 'rc-util/lib/KeyCode';
import { useComposeRef } from 'rc-util/lib/ref';
import * as React from 'react';
import { clsx } from '../_util/classNameUtils';
import warning from '../_util/warning';
import { SiderContext, SiderContextProps } from '../layout/Sider';
import Tooltip, { TooltipProps } from '../tooltip';
import Icon from './Icon';
import { useMenuId } from './context/IdContext';
import { MenuContext } from './context/MenuContext';
import { PathTrackerContext, useFullPath, useMeasure } from './context/PathContext';
import useActive from './hooks/useActive';
import type { MenuInfo, MenuItemType } from './interface';

export interface MenuItemProps
  extends Omit<MenuItemType, 'label' | 'key' | 'title'>,
    Omit<
      React.HTMLAttributes<HTMLLIElement>,
      'title' | 'onClick' | 'onMouseEnter' | 'onMouseLeave' | 'onSelect'
    > {
  title?: React.ReactNode;
  children?: React.ReactNode;

  /** @private Internal filled key. Do not set it directly */
  eventKey: string;

  /** @private Do not use. Private warning empty usage */
  warnKey?: boolean;
}

/**
 * Real Menu Item component
 */
const InternalMenuItem = React.forwardRef((props: MenuItemProps, ref: React.Ref<HTMLElement>) => {
  const {
    title,
    style,
    className,
    danger,

    eventKey,
    warnKey,
    disabled,
    itemIcon,
    children,

    // Aria
    role,

    // Active
    onMouseEnter,
    onMouseLeave,

    onClick,
    onKeyDown,

    onFocus,

    ...restProps
  } = props;

  const domDataId = useMenuId(eventKey);

  const {
    prefixCls,
    onItemClick,

    disabled: contextDisabled,
    overflowDisabled,
    inlineCollapsed: isInlineCollapsed,

    // Icon
    itemIcon: contextItemIcon,

    // Select
    selectedKeys,

    // Active
    onActive,
  } = React.useContext(MenuContext);
  const { siderCollapsed } = React.useContext<SiderContextProps>(SiderContext);
  const firstLevel = React.useContext(PathTrackerContext).length === 1;

  const itemCls = `${prefixCls}-item`;

  const elementRef = React.useRef<HTMLLIElement>();
  const mergedDisabled = contextDisabled || disabled;

  const mergedEleRef = useComposeRef(ref, elementRef);

  const connectedKeys = useFullPath(eventKey);

  // ================================ Warn ================================
  if (process.env.NODE_ENV !== 'production' && warnKey) {
    warning(false, 'MenuItem should not leave undefined `key`.');
  }

  // ============================= Info =============================
  const getEventInfo = (
    e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
  ): MenuInfo => {
    return {
      key: eventKey,
      // Note: For legacy code is reversed which not like other antd component
      keyPath: [...connectedKeys].reverse(),
      domEvent: e,
    };
  };

  // ================================ Title ================================
  let tooltipTitle = title;

  if (typeof title === 'undefined') {
    tooltipTitle = firstLevel ? children : '';
  } else if (title === false) {
    tooltipTitle = '';
  }

  const tooltipProps: TooltipProps = { title: tooltipTitle };

  if (!siderCollapsed && !isInlineCollapsed) {
    tooltipProps.title = null;
    tooltipProps.open = false;
  }

  // ============================= Icon =============================
  const mergedItemIcon = itemIcon || contextItemIcon;

  // ============================ Active ============================
  const { active, ...activeProps } = useActive(
    eventKey,
    !!mergedDisabled,
    onMouseEnter,
    onMouseLeave,
  );

  // ============================ Select ============================
  const selected = selectedKeys.includes(eventKey);

  // ============================ Events ============================
  const onInternalClick: React.MouseEventHandler<HTMLLIElement> = (e) => {
    if (mergedDisabled) {
      return;
    }

    const info = getEventInfo(e);

    onClick?.(info);
    onItemClick(info);
  };

  const onInternalKeyDown: React.KeyboardEventHandler<HTMLLIElement> = (e) => {
    onKeyDown?.(e);

    if (e.which === KeyCode.ENTER) {
      const info = getEventInfo(e);

      // Legacy. Key will also trigger click event
      onClick?.(info);
      onItemClick(info);
    }
  };

  /**
   * Used for accessibility. Helper will focus element without key board.
   * We should manually trigger an active
   */
  const onInternalFocus: React.FocusEventHandler<HTMLLIElement> = (e) => {
    onActive(eventKey);
    onFocus?.(e);
  };

  // ============================ Render ============================
  const optionRoleProps: React.HTMLAttributes<HTMLDivElement> = {};

  if (props.role === 'option') {
    optionRoleProps['aria-selected'] = selected;
  }

  const childrenLength = toArray(children).length;

  return (
    <Tooltip
      {...tooltipProps}
      placement="right"
      className={{ overlay: `${prefixCls}-inline-collapsed-tooltip` }}
    >
      <Overflow.Item
        title={typeof title === 'string' ? title : undefined}
        ref={mergedEleRef}
        role={role === null ? 'none' : role || 'menuitem'}
        tabIndex={disabled ? undefined : -1}
        data-menu-id={overflowDisabled && domDataId ? null : domDataId}
        {...restProps}
        {...activeProps}
        {...optionRoleProps}
        component="li"
        aria-disabled={disabled}
        style={style}
        className={clsx(
          itemCls,
          {
            [`${itemCls}-active`]: active,
            [`${itemCls}-selected`]: selected,
            [`${itemCls}-disabled`]: mergedDisabled,
            [`${itemCls}-danger`]: danger,
            [`${itemCls}-only-child`]: (mergedItemIcon ? childrenLength + 1 : childrenLength) === 1,
          },
          className,
        )}
        onClick={onInternalClick}
        onKeyDown={onInternalKeyDown}
        onFocus={onInternalFocus}
      >
        {children}
        <Icon
          props={{
            ...props,
            isSelected: selected,
          }}
          icon={mergedItemIcon}
        />
      </Overflow.Item>
    </Tooltip>
  );
});

function MenuItem(props: MenuItemProps, ref: React.Ref<HTMLElement>) {
  const { eventKey } = props;

  // ==================== Record KeyPath ====================
  const measure = useMeasure();
  const connectedKeyPath = useFullPath(eventKey);

  // eslint-disable-next-line consistent-return
  React.useEffect(() => {
    if (measure) {
      measure.registerPath(eventKey, connectedKeyPath);

      return () => {
        measure.unregisterPath(eventKey, connectedKeyPath);
      };
    }
  }, [connectedKeyPath]);

  if (measure) {
    return null;
  }

  // ======================== Render ========================
  return <InternalMenuItem {...props} ref={ref} />;
}

export default React.forwardRef(MenuItem);
