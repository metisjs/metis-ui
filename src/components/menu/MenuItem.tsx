import Overflow from 'rc-overflow';
import toArray from 'rc-util/lib/Children/toArray';
import KeyCode from 'rc-util/lib/KeyCode';
import { useComposeRef } from 'rc-util/lib/ref';
import * as React from 'react';
import { clsx, getComplexCls } from '../_util/classNameUtils';
import { cloneElement, isValidElement } from '../_util/reactNode';
import warning from '../_util/warning';
import { SiderContext, SiderContextProps } from '../layout/Sider';
import Tooltip, { TooltipProps } from '../tooltip';
import { useMenuId } from './context/IdContext';
import { MenuContext } from './context/MenuContext';
import { PathTrackerContext, useFullPath, useMeasure } from './context/PathContext';
import useActive from './hooks/useActive';
import type { MenuInfo, MenuItemType } from './interface';

export interface MenuItemProps
  extends Omit<MenuItemType, 'label' | 'key' | 'title'>,
    Omit<
      React.HTMLAttributes<HTMLLIElement>,
      'title' | 'onClick' | 'onMouseEnter' | 'onMouseLeave' | 'onSelect' | 'className'
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
    icon,

    eventKey,
    warnKey,
    disabled,
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

  const complexCls = getComplexCls(className);

  const {
    prefixCls,
    mode,
    theme,
    className: contextClassName,
    onItemClick,

    disabled: contextDisabled,
    overflowDisabled,
    inlineCollapsed: isInlineCollapsed,

    // Select
    selectedKeys,

    // Active
    onActive,
  } = React.useContext(MenuContext);

  const { siderCollapsed } = React.useContext<SiderContextProps>(SiderContext);
  const level = React.useContext(PathTrackerContext).length;
  const firstLevel = level === 0;

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

  const inlineStyle = React.useMemo(() => {
    const mergedStyle: React.CSSProperties = {};
    if (mode === 'inline' && !firstLevel) {
      mergedStyle.paddingInlineStart = `${level * (level === 1 ? 44 : 36)}px`;
    }
    return mergedStyle;
  }, []);

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
        className={clsx(
          itemCls,
          {
            [`${itemCls}-active`]: active,
            [`${itemCls}-selected`]: selected,
            [`${itemCls}-disabled`]: mergedDisabled,
            [`${itemCls}-danger`]: danger,
            [`${itemCls}-only-child`]: (icon ? childrenLength + 1 : childrenLength) === 1,
          },
          'relative block flex-none cursor-pointer',
          mode === 'horizontal' && theme === 'dark' && 'pe-2 ps-2 first:ps-4 last:pe-4',
          mode !== 'horizontal' && 'px-4',
          '[.submenu-popup_&]:px-1',
          mergedDisabled && 'cursor-not-allowed',
          contextClassName?.item,
          complexCls.root,
        )}
        onClick={onInternalClick}
        onKeyDown={onInternalKeyDown}
        onFocus={onInternalFocus}
      >
        <span
          style={{ ...inlineStyle, ...style }}
          className={clsx(
            `${itemCls}-inner`,
            'flex items-center gap-2 transition-colors',
            firstLevel && 'gap-3',
            {
              // >>> Light
              light: {
                // >>> Light Horizontal
                horizontal: {
                  '-mt-[1px] mb-0 pe-4 ps-4 align-bottom first-line:top-[1px] after:absolute after:bottom-0 after:end-3 after:start-3 after:border-b-2 after:border-transparent after:transition-colors after:content-[""]':
                    true,
                  'text-neutral-text-secondary hover:text-neutral-text hover:after:border-neutral-border':
                    !mergedDisabled,
                  'text-neutral-text after:border-primary hover:after:border-primary': selected,
                  'text-neutral-text-quaternary': mergedDisabled,
                },
                // >>> Light Vertical
                vertical: {
                  'h-10 truncate rounded-md p-2 leading-10': true,
                  'pe-4 ps-4 [.item-group_&]:ps-7': !firstLevel,
                  'pe-8': firstLevel && !isInlineCollapsed,
                  'bg-neutral-fill-quaternary text-primary ': selected,
                  'hover:bg-neutral-fill-quaternary': !selected && !mergedDisabled,
                  'text-neutral-text-quaternary': mergedDisabled,
                },
                // >>> Light Inline
                inline: {
                  'h-10 rounded-md p-2 pe-8': true,
                  'pe-7': !firstLevel,
                  'bg-neutral-fill-quaternary text-primary': selected,
                  'hover:bg-neutral-fill-quaternary': !selected && !mergedDisabled,
                  'text-neutral-text-quaternary': mergedDisabled,
                },
              },
              // >>> Dark
              dark: {
                // >>> Dark Horizontal
                horizontal: {
                  'h-9 rounded-md px-3 py-2 text-sm': true,
                  'text-gray-300 hover:bg-gray-700 hover:text-white': !mergedDisabled && !selected,
                  'bg-gray-900 text-white': selected,
                  'text-gray-500': mergedDisabled,
                },
                // >>> Dark Vertical
                vertical: {
                  'h-10 truncate rounded-md p-2 leading-10 text-neutral-text-tertiary': true,
                  'pe-4 ps-4 text-gray-300 [.item-group_&]:ps-7': !firstLevel,
                  'pe-8': firstLevel && !isInlineCollapsed,
                  'bg-gray-700 text-white': selected,
                  'hover:bg-gray-700': !selected && !mergedDisabled,
                  'text-gray-500': mergedDisabled,
                },
                // >>> Dark Inline
                inline: {
                  'h-10 rounded-md p-2 pe-8 text-neutral-text-tertiary': true,
                  'pe-7': !firstLevel,
                  'bg-gray-700 text-white': selected,
                  'hover:bg-gray-700 hover:text-white': !selected && !mergedDisabled,
                  'text-gray-500': mergedDisabled,
                },
              },
            }[theme][mode],
            contextClassName?.itemInner,
            complexCls.inner,
          )}
        >
          {cloneElement(icon, {
            className: clsx(
              `${prefixCls}-item-icon`,
              'h-5 w-5 flex-shrink-0 flex-grow-0',
              firstLevel && 'h-6 w-6',
              mode !== 'horizontal' &&
                !mergedDisabled && {
                  'text-neutral-text-tertiary': firstLevel && theme !== 'dark',
                  'text-primary': selected && theme !== 'dark',
                },
              contextClassName?.itemIcon,
              complexCls.icon,
              isValidElement(icon) ? icon.props?.className : '',
            ),
          })}
          <span
            className={clsx(`${prefixCls}-title-content`, 'flex-1 truncate', {
              'opacity-0': firstLevel && isInlineCollapsed,
            })}
          >
            {children}
          </span>
        </span>
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
