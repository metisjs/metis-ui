import * as React from 'react';
import toArray from '@rc-component/util/es/Children/toArray';
import { useComposeRef } from '@rc-component/util/es/ref';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import { cloneElement, isValidElement } from '@util/reactNode';
import type { SafeKey } from '@util/type';
import warning from '@util/warning';
import Overflow from 'rc-overflow';
import type { SiderContextProps } from '../layout/Sider';
import { SiderContext } from '../layout/Sider';
import type { TooltipProps } from '../tooltip';
import Tooltip from '../tooltip';
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
  eventKey: SafeKey;

  /** @private Do not use. Private warning empty usage */
  warnKey?: boolean;

  grouped?: boolean;
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
    grouped,

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
    mode,
    theme,
    itemClassName,
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

  const elementRef = React.useRef<HTMLLIElement>(null);
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
      // Note: For legacy code is reversed which not like other metis-ui component
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

    if (e.key === 'Enter') {
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

  // ============================ Style ============================
  const childrenLength = toArray(children).length;

  const semanticCls = useSemanticCls([itemClassName, className], {
    disabled: mergedDisabled,
    selected,
    hasIcon: !!icon,
    level,
    grouped,
  });

  const rootCls = clsx(
    itemCls,
    {
      [`${itemCls}-active`]: active,
      [`${itemCls}-selected`]: selected,
      [`${itemCls}-disabled`]: mergedDisabled,
      [`${itemCls}-danger`]: danger,
      [`${itemCls}-only-child`]: (icon ? childrenLength + 1 : childrenLength) === 1,
    },
    'relative block flex-none cursor-pointer',
    mode === 'horizontal' && theme === 'dark' && 'ps-2 pe-2 first:ps-4 last:pe-4',
    mode !== 'horizontal' && 'px-4',
    'in-[.submenu-popup]:px-1',
    mergedDisabled && 'cursor-not-allowed',
    semanticCls.root,
  );

  const innerCls = clsx(
    `${itemCls}-inner`,
    'flex items-center gap-2 transition-colors',
    firstLevel && 'gap-3 font-medium',
    {
      // >>> Light
      light: {
        // >>> Light Horizontal
        horizontal: {
          '-mt-[1px] mb-0 ps-4 pe-4 align-bottom first-line:top-[1px] after:absolute after:start-3 after:end-3 after:bottom-0 after:border-b-2 after:border-transparent after:transition-colors after:content-[""]':
            true,
          'text-text-secondary hover:text-text hover:after:border-border': !mergedDisabled,
          'text-text after:border-primary hover:after:border-primary': selected,
          'text-text-tertiary': mergedDisabled,
        },
        // >>> Light Vertical
        vertical: {
          'h-10 truncate rounded-md p-2 leading-10': true,
          'ps-4 pe-4': !firstLevel,
          'ps-7': !firstLevel && grouped,
          'pe-8': firstLevel && !isInlineCollapsed,
          'bg-fill-quinary text-primary': selected,
          'hover:bg-fill-quinary': !selected && !mergedDisabled,
          'text-text-tertiary': mergedDisabled,
        },
        // >>> Light Inline
        inline: {
          'h-10 rounded-md p-2 pe-8': true,
          'pe-7': !firstLevel,
          'bg-fill-quinary text-primary': selected,
          'hover:bg-fill-quinary': !selected && !mergedDisabled,
          'text-text-tertiary': mergedDisabled,
        },
      },
      // >>> Dark
      dark: {
        // >>> Dark Horizontal
        horizontal: {
          'h-9 rounded-md px-3 py-2 text-sm': true,
          'text-gray-300 hover:bg-gray-700/80 hover:text-white': !mergedDisabled && !selected,
          'bg-gray-700/80 text-white': selected,
          'text-gray-500': mergedDisabled,
        },
        // >>> Dark Vertical
        vertical: {
          'text-text-tertiary h-10 truncate rounded-md p-2 leading-10': true,
          'ps-4 pe-4 text-gray-300': !firstLevel,
          'ps-7': !firstLevel && grouped,
          'pe-8': firstLevel && !isInlineCollapsed,
          'bg-gray-700/80 text-white': selected,
          'hover:bg-gray-700/80': !selected && !mergedDisabled,
          'text-gray-500': mergedDisabled,
        },
        // >>> Dark Inline
        inline: {
          'text-text-tertiary h-10 rounded-md p-2 pe-8': true,
          'pe-7': !firstLevel,
          'bg-gray-700/80 text-white': selected,
          'hover:bg-gray-700/80 hover:text-white': !selected && !mergedDisabled,
          'text-gray-500': mergedDisabled,
        },
      },
    }[theme][mode],
    semanticCls.inner,
  );

  const iconCls = clsx(
    `${prefixCls}-item-icon`,
    'size-5 shrink-0 grow-0',
    firstLevel && 'h-6 w-6',
    mode !== 'horizontal' &&
      !mergedDisabled && {
        'text-text-tertiary': firstLevel && theme !== 'dark',
        'text-primary': selected && theme !== 'dark',
      },
    semanticCls.icon,
  );

  // ============================ Render ============================
  const optionRoleProps: React.HTMLAttributes<HTMLDivElement> = {};

  if (props.role === 'option') {
    optionRoleProps['aria-selected'] = selected;
  }

  const inlineStyle = React.useMemo(() => {
    const mergedStyle: React.CSSProperties = {};
    if (mode === 'inline' && !firstLevel) {
      mergedStyle.paddingInlineStart = `${level * (level === 1 ? 44 : 28)}px`;
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
        className={rootCls}
        onClick={onInternalClick}
        onKeyDown={onInternalKeyDown}
        onFocus={onInternalFocus}
      >
        <span style={{ ...inlineStyle, ...style }} className={innerCls}>
          {cloneElement(icon, {
            className: clsx(
              iconCls,
              isValidElement<{ className?: string }>(icon) ? icon.props?.className : '',
            ),
          })}
          <span
            className={clsx(
              `${prefixCls}-content`,
              'relative flex-1 truncate',
              {
                'opacity-0': firstLevel && isInlineCollapsed,
              },
              semanticCls.label,
            )}
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
