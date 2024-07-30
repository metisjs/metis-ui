import Overflow from 'rc-overflow';
import * as React from 'react';
import { clsx, getSemanticCls } from '../../_util/classNameUtils';
import useMemoizedFn from '../../_util/hooks/useMemoizedFn';
import { useZIndex } from '../../_util/hooks/useZIndex';
import { cloneElement, isValidElement } from '../../_util/reactNode';
import warning from '../../_util/warning';
import Icon from '../Icon';
import { useMenuId } from '../context/IdContext';
import MenuContextProvider, { MenuContext } from '../context/MenuContext';
import {
  PathTrackerContext,
  PathUserContext,
  useFullPath,
  useMeasure,
} from '../context/PathContext';
import useActive from '../hooks/useActive';
import type { MenuInfo, SubMenuType } from '../interface';
import { parseChildren } from '../utils/commonUtil';
import InlineSubMenuList from './InlineSubMenuList';
import PopupTrigger from './PopupTrigger';
import SubMenuList from './SubMenuList';

export interface SubMenuProps extends Omit<SubMenuType, 'key' | 'children' | 'label'> {
  title?: React.ReactNode;

  children?: React.ReactNode;

  /** @private Used for rest popup. Do not use in your prod */
  internalPopupClose?: boolean;

  /** @private Internal filled key. Do not set it directly */
  eventKey: string;

  /** @private Do not use. Private warning empty usage */
  warnKey?: boolean;

  // >>>>>>>>>>>>>>>>>>>>> Next  Round <<<<<<<<<<<<<<<<<<<<<<<
  // onDestroy?: DestroyEventHandler;
}

const InternalSubMenu = (props: SubMenuProps) => {
  const {
    className,

    theme: customTheme,

    icon,
    title,
    eventKey,
    warnKey,

    disabled,
    internalPopupClose,

    children,

    // Icons
    expandIcon,

    // Popup
    popupOffset,
    popupStyle,

    // Events
    onClick,
    onMouseEnter,
    onMouseLeave,
    onTitleClick,
    onTitleMouseEnter,
    onTitleMouseLeave,

    ...restProps
  } = props;

  const domDataId = useMenuId(eventKey);

  const semanticCls = getSemanticCls(className);

  const {
    prefixCls,
    mode,
    theme: contextTheme,
    className: contextClassName,
    openKeys,

    // Disabled
    disabled: contextDisabled,
    overflowDisabled,

    inlineCollapsed: isInlineCollapsed,

    // ActiveKey
    activeKey,

    // SelectKey
    selectedKeys,

    expandIcon: contextExpandIcon,

    // Events
    onItemClick,
    onOpenChange,

    onActive,
  } = React.useContext(MenuContext);

  const mergedTheme = customTheme || contextTheme;

  const { isSubPathKey } = React.useContext(PathUserContext);
  const connectedPath = useFullPath();
  const level = React.useContext(PathTrackerContext).length - 1;
  const firstLevel = level === 0;

  const subMenuPrefixCls = `${prefixCls}-submenu`;
  const mergedDisabled = contextDisabled || disabled;
  const elementRef = React.useRef<HTMLDivElement>(null);
  const popupRef = React.useRef<HTMLUListElement>(null);

  // ================================ Warn ================================
  if (process.env.NODE_ENV !== 'production' && warnKey) {
    warning(false, 'SubMenu should not leave undefined `key`.');
  }

  // ================================ Icon ================================
  const mergedExpandIcon = expandIcon || contextExpandIcon;

  // ================================ Open ================================
  const originOpen = openKeys.includes(eventKey);
  const open = !overflowDisabled && originOpen;

  // =============================== Select ===============================
  const childrenSelected = isSubPathKey(selectedKeys, eventKey);

  // =============================== Active ===============================
  const { active, ...activeProps } = useActive(
    eventKey,
    !!mergedDisabled,
    onTitleMouseEnter,
    onTitleMouseLeave,
  );

  // Fallback of active check to avoid hover on menu title or disabled item
  const [childrenActive, setChildrenActive] = React.useState(false);

  const triggerChildrenActive = (newActive: boolean) => {
    if (!mergedDisabled) {
      setChildrenActive(newActive);
    }
  };

  const onInternalMouseEnter: React.MouseEventHandler<HTMLLIElement> = (domEvent) => {
    triggerChildrenActive(true);

    onMouseEnter?.({
      key: eventKey,
      domEvent,
    });
  };

  const onInternalMouseLeave: React.MouseEventHandler<HTMLLIElement> = (domEvent) => {
    triggerChildrenActive(false);

    onMouseLeave?.({
      key: eventKey,
      domEvent,
    });
  };

  const mergedActive = React.useMemo(() => {
    if (active) {
      return active;
    }

    if (mode !== 'inline') {
      return childrenActive || isSubPathKey([activeKey], eventKey);
    }

    return false;
  }, [mode, active, activeKey, childrenActive, eventKey, isSubPathKey]);

  // =============================== Events ===============================
  // >>>> Title click
  const onInternalTitleClick: React.MouseEventHandler<HTMLElement> = (e) => {
    // Skip if disabled
    if (mergedDisabled) {
      return;
    }

    onTitleClick?.({
      key: eventKey,
      domEvent: e,
    });

    // Trigger open by click when mode is `inline`
    if (mode === 'inline') {
      onOpenChange(eventKey, !originOpen);
    }
  };

  // >>>> Context for children click
  const onMergedItemClick = useMemoizedFn((info: MenuInfo) => {
    onClick?.(info);
    onItemClick(info);
  });

  // >>>>> Visible change
  const onPopupVisibleChange = (newVisible: boolean) => {
    if (mode !== 'inline') {
      onOpenChange(eventKey, newVisible);
    }
  };

  /**
   * Used for accessibility. Helper will focus element without key board.
   * We should manually trigger an active
   */
  const onInternalFocus: React.FocusEventHandler<HTMLDivElement> = () => {
    onActive(eventKey);
  };

  // ============================ zIndex ============================
  const [zIndex] = useZIndex('Menu');

  // =============================== Render ===============================
  const popupId = domDataId ? `${domDataId}-popup` : undefined;

  const inlineStyle = React.useMemo(() => {
    const mergedStyle: React.CSSProperties = {};
    if (mode === 'inline' && !firstLevel) {
      mergedStyle.paddingInlineStart = `${level * (level === 1 ? 44 : 36)}px`;
    }
    return mergedStyle;
  }, []);

  // >>>>> Title
  let titleNode: React.ReactElement = (
    <div
      role="menuitem"
      className={clsx(
        `${subMenuPrefixCls}-title`,
        mode === 'horizontal' && 'flex h-[4rem] items-center',
        mode !== 'horizontal' && 'px-4',
        '[.submenu-popup_&]:px-1',
        contextClassName?.item,
        semanticCls.title,
      )}
      style={inlineStyle}
      tabIndex={mergedDisabled ? undefined : -1}
      ref={elementRef}
      title={typeof title === 'string' ? title : undefined}
      data-menu-id={overflowDisabled && domDataId ? undefined : domDataId}
      aria-expanded={open}
      aria-haspopup
      aria-controls={popupId}
      aria-disabled={mergedDisabled}
      onClick={onInternalTitleClick}
      onFocus={onInternalFocus}
      {...activeProps}
    >
      <span
        className={clsx(
          `${subMenuPrefixCls}-inner`,
          'flex items-center gap-2 whitespace-nowrap transition-colors',
          firstLevel && 'gap-3 font-medium',
          {
            // >>> Light
            light: {
              // >>> Light Horizontal
              horizontal: {
                '-mt-[1px] mb-0 align-bottom first-line:top-[1px] after:absolute after:bottom-0 after:end-3 after:start-3 after:border-b-2 after:border-transparent after:transition-colors after:content-[""]':
                  true,
                'text-text-secondary hover:text-text hover:after:border-border': !mergedDisabled,
                'text-text after:border-border': open,
                'text-text after:border-primary hover:after:border-primary': childrenSelected,
                'text-text-tertiary': mergedDisabled,
              },
              // >>> Light Vertical
              vertical: {
                'h-10 truncate rounded-md p-2': true,
                'px-4 leading-10 [.item-group_&]:ps-7': !firstLevel,
                'text-primary': childrenSelected,
                'hover:bg-fill-quaternary': !mergedDisabled,
                'text-text-tertiary': mergedDisabled,
              },
              // >>> Light Inline
              inline: {
                'h-10 rounded-md p-2': true,
                'text-primary': childrenSelected,
                'hover:bg-fill-quaternary': !mergedDisabled,
                'text-text-tertiary': mergedDisabled,
              },
            },
            // >>> Dark
            dark: {
              // >>> Dark Horizontal
              horizontal: {
                'relative flex h-9 items-center rounded-md px-3 text-sm leading-7': true,
                'text-gray-300 hover:bg-gray-700 hover:text-white':
                  !mergedDisabled && !childrenSelected,
                'bg-gray-700 text-white': mergedActive,
                'bg-gray-900 text-white': childrenSelected,
                'text-gray-500': mergedDisabled,
              },
              // >>> Dark Vertical
              vertical: {
                'h-10 truncate rounded-md p-2 text-text-tertiary': true,
                'px-4 leading-10 text-gray-300 [.item-group_&]:ps-7': !firstLevel,
                'text-white': childrenSelected,
                'hover:bg-gray-700': !mergedDisabled,
                'text-gray-500': mergedDisabled,
              },
              // >>> Dark Inline
              inline: {
                'h-10 rounded-md p-2 text-text-tertiary': true,
                'text-white': childrenSelected,
                'hover:bg-gray-700 hover:text-white': !mergedDisabled,
                'text-gray-500': mergedDisabled,
              },
            },
          }[contextTheme][mode],
          contextClassName?.itemInner,
          semanticCls.inner,
        )}
      >
        {cloneElement(icon, {
          className: clsx(
            `${prefixCls}-item-icon`,
            'h-5 w-5 flex-shrink-0 flex-grow-0',
            firstLevel && 'h-6 w-6',
            mode !== 'horizontal' && {
              'text-text-tertiary': firstLevel && contextTheme !== 'dark',
              'text-primary': childrenSelected && contextTheme !== 'dark',
            },
            contextClassName?.itemIcon,
            semanticCls.icon,
            isValidElement(icon) ? icon.props?.className : '',
          ),
        })}

        <span
          className={clsx(
            `${prefixCls}-title-content`,
            'flex-1 truncate',
            firstLevel && isInlineCollapsed && 'opacity-0',
            semanticCls.content,
          )}
        >
          {title}
        </span>

        {/* Only non-horizontal mode shows the icon */}
        <Icon
          icon={mode !== 'horizontal' ? mergedExpandIcon : null}
          props={{
            ...props,
            isOpen: open,
            // [Legacy] Not sure why need this mark
            isSubMenu: true,
          }}
        >
          {mode !== 'horizontal' ? (
            <svg
              viewBox="0 0 20 20"
              aria-hidden="true"
              className={clsx(
                `${subMenuPrefixCls}-arrow`,
                'h-5 w-5 transition-transform',
                // >>> In Popup
                {
                  '[.submenu-popup_&]:text-primary': childrenSelected,
                  '[.submenu-popup_&]:text-white': contextTheme === 'dark' && childrenSelected,
                },
                contextTheme !== 'dark' && 'text-text-tertiary',
                contextTheme !== 'dark' && childrenSelected && 'text-primary',
                open && mode === 'inline' && 'rotate-90',
                firstLevel && isInlineCollapsed && 'opacity-0',
                mergedDisabled && {
                  'text-text-tertiary': contextTheme === 'light',
                  'text-gray-500': contextTheme === 'dark',
                },
              )}
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              ></path>
            </svg>
          ) : null}
        </Icon>
      </span>
    </div>
  );

  // Cache mode if it change to `inline` which do not have popup motion
  const triggerModeRef = React.useRef(mode);
  if (mode !== 'inline' && connectedPath.length > 1) {
    triggerModeRef.current = 'vertical';
  } else {
    triggerModeRef.current = mode;
  }

  if (!overflowDisabled) {
    const triggerMode = triggerModeRef.current;

    // Still wrap with Trigger here since we need avoid react re-mount dom node
    // Which makes motion failed
    titleNode = (
      <PopupTrigger
        zIndex={zIndex}
        mode={triggerMode}
        prefixCls={subMenuPrefixCls}
        open={!internalPopupClose && open && mode !== 'inline'}
        popupClassName={semanticCls.popup}
        popupOffset={popupOffset}
        popupStyle={popupStyle}
        popup={
          <MenuContextProvider
            // Special handle of horizontal mode
            mode={triggerMode === 'horizontal' ? 'vertical' : triggerMode}
            theme={mergedTheme}
          >
            <SubMenuList id={popupId} ref={popupRef}>
              {children}
            </SubMenuList>
          </MenuContextProvider>
        }
        disabled={!!mergedDisabled}
        onOpenChange={onPopupVisibleChange}
      >
        {titleNode}
      </PopupTrigger>
    );
  }

  // >>>>> List node
  let listNode = (
    <Overflow.Item
      role="none"
      {...restProps}
      component="li"
      className={clsx(
        subMenuPrefixCls,
        `${subMenuPrefixCls}-${mode}`,
        {
          [`${subMenuPrefixCls}-open`]: open,
          [`${subMenuPrefixCls}-active`]: mergedActive,
          [`${subMenuPrefixCls}-selected`]: childrenSelected,
          [`${subMenuPrefixCls}-disabled`]: mergedDisabled,
        },
        'relative block flex-none cursor-pointer',
        mode === 'horizontal' && mergedTheme === 'light' && 'pe-4 ps-4',
        mode === 'horizontal' && mergedTheme === 'dark' && 'pe-2 ps-2 first:ps-4 last:pe-4',
        mergedDisabled && 'cursor-not-allowed',
        semanticCls.root,
      )}
      onMouseEnter={onInternalMouseEnter}
      onMouseLeave={onInternalMouseLeave}
    >
      {titleNode}

      {/* Inline mode */}
      {!overflowDisabled && (
        <InlineSubMenuList id={popupId} open={open} keyPath={connectedPath}>
          {children}
        </InlineSubMenuList>
      )}
    </Overflow.Item>
  );

  // >>>>> Render
  return (
    <MenuContextProvider
      onItemClick={onMergedItemClick}
      mode={mode === 'horizontal' ? 'vertical' : mode}
      expandIcon={mergedExpandIcon}
    >
      {listNode}
    </MenuContextProvider>
  );
};

export default function SubMenu(props: SubMenuProps) {
  const { eventKey, children } = props;

  const connectedKeyPath = useFullPath(eventKey);
  const childList: React.ReactElement[] = parseChildren(children, connectedKeyPath);

  // ==================== Record KeyPath ====================
  const measure = useMeasure();

  // eslint-disable-next-line consistent-return
  React.useEffect(() => {
    if (measure) {
      measure.registerPath(eventKey, connectedKeyPath);

      return () => {
        measure.unregisterPath(eventKey, connectedKeyPath);
      };
    }
  }, [connectedKeyPath]);

  let renderNode: React.ReactNode;

  // ======================== Render ========================
  if (measure) {
    renderNode = childList;
  } else {
    renderNode = <InternalSubMenu {...props}>{childList}</InternalSubMenu>;
  }

  return (
    <PathTrackerContext.Provider value={connectedKeyPath}>{renderNode}</PathTrackerContext.Provider>
  );
}
