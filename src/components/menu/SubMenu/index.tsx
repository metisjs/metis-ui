import * as React from 'react';
import { useEvent } from '@rc-component/util';
import { clsx } from '@util/classNameUtils';
import ExpandIcon from '@util/ExpandIcon';
import useSemanticCls from '@util/hooks/useSemanticCls';
import { useZIndex } from '@util/hooks/useZIndex';
import { cloneElement, isValidElement } from '@util/reactNode';
import type { SafeKey } from '@util/type';
import warning from '@util/warning';
import Overflow from 'rc-overflow';
import { useMenuId } from '../context/IdContext';
import MenuContextProvider, { MenuContext } from '../context/MenuContext';
import {
  PathTrackerContext,
  PathUserContext,
  useFullPath,
  useMeasure,
} from '../context/PathContext';
import useActive from '../hooks/useActive';
import Icon from '../Icon';
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
  eventKey: SafeKey;

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

  const {
    prefixCls,
    mode,
    theme: contextTheme,
    subClassName,
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
  const onMergedItemClick = useEvent((info: MenuInfo) => {
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

  // =============================== Style ===============================
  const semanticCls = useSemanticCls([subClassName, className], {
    disabled: mergedDisabled,
    active: mergedActive,
    childrenSelected,
    hasIcon: !!icon,
    level,
  });

  const rootCls = clsx(
    subMenuPrefixCls,
    `${subMenuPrefixCls}-${mode}`,
    {
      [`${subMenuPrefixCls}-open`]: open,
      [`${subMenuPrefixCls}-active`]: mergedActive,
      [`${subMenuPrefixCls}-selected`]: childrenSelected,
      [`${subMenuPrefixCls}-disabled`]: mergedDisabled,
    },
    'relative block flex-none cursor-pointer',
    mode === 'horizontal' && mergedTheme === 'light' && 'ps-4 pe-4',
    mode === 'horizontal' && mergedTheme === 'dark' && 'ps-2 pe-2 first:ps-4 last:pe-4',
    mergedDisabled && 'cursor-not-allowed',
    semanticCls.root,
  );

  const wrapperCls = clsx('in-[.submenu-popup]:px-1', {
    'flex h-[4rem] items-center': mode === 'horizontal',
    'px-4': mode !== 'horizontal',
  });

  const innerCls = clsx(
    `${subMenuPrefixCls}-inner`,
    'flex items-center gap-2 whitespace-nowrap transition-colors',
    firstLevel && 'gap-3 font-medium',
    {
      // >>> Light
      light: {
        // >>> Light Horizontal
        horizontal: {
          '-mt-[1px] mb-0 align-bottom first-line:top-[1px] after:absolute after:start-3 after:end-3 after:bottom-0 after:border-b-2 after:border-transparent after:transition-colors after:content-[""]':
            true,
          'text-text-secondary hover:text-text hover:after:border-border': !mergedDisabled,
          'text-text after:border-border': open,
          'text-text after:border-primary hover:after:border-primary': childrenSelected,
          'text-text-tertiary': mergedDisabled,
        },
        // >>> Light Vertical
        vertical: {
          'h-10 truncate rounded-md p-2': true,
          'px-4 leading-10 in-[.item-group]:ps-7': !firstLevel,
          'text-primary': childrenSelected,
          'hover:bg-fill-quinary': !mergedDisabled,
          'text-text-tertiary': mergedDisabled,
        },
        // >>> Light Inline
        inline: {
          'h-10 rounded-md p-2': true,
          'text-primary': childrenSelected,
          'hover:bg-fill-quinary': !mergedDisabled,
          'text-text-tertiary': mergedDisabled,
        },
      },
      // >>> Dark
      dark: {
        // >>> Dark Horizontal
        horizontal: {
          'relative flex h-9 items-center rounded-md px-3 text-sm leading-7': true,
          'text-gray-400 hover:bg-gray-800 hover:text-white': !mergedDisabled && !childrenSelected,
          'bg-gray-800 text-white': mergedActive || childrenSelected,
          'text-gray-500': mergedDisabled,
        },
        // >>> Dark Vertical
        vertical: {
          'text-text-tertiary h-10 truncate rounded-md p-2': true,
          'px-4 leading-10 text-gray-400 in-[.item-group]:ps-7': !firstLevel,
          'text-white': childrenSelected,
          'hover:bg-gray-800': !mergedDisabled,
          'text-gray-500': mergedDisabled,
        },
        // >>> Dark Inline
        inline: {
          'text-text-tertiary h-10 rounded-md p-2': true,
          'text-white': childrenSelected,
          'hover:bg-gray-800 hover:text-white': !mergedDisabled,
          'text-gray-500': mergedDisabled,
        },
      },
    }[contextTheme][mode],
    semanticCls.inner,
  );

  const iconCls = clsx(
    `${prefixCls}-item-icon`,
    'size-5 shrink-0 grow-0',
    firstLevel && 'h-6 w-6',
    mode !== 'horizontal' && {
      'text-text-tertiary': firstLevel && contextTheme !== 'dark',
      'text-primary': childrenSelected && contextTheme !== 'dark',
    },
    mergedDisabled && {
      'text-text-quaternary': contextTheme === 'light',
      'text-gray-500': contextTheme === 'dark',
    },
    semanticCls.icon,
  );

  const contentCls = clsx(
    `${prefixCls}-content`,
    'flex-1 truncate',
    firstLevel && isInlineCollapsed && 'opacity-0',
    semanticCls.label,
  );

  const expandCls = clsx(
    `${subMenuPrefixCls}-arrow`,
    'size-5 transition-transform',
    // >>> In Popup
    {
      'in-[.submenu-popup]:text-primary': childrenSelected,
      'in-[.submenu-popup]:text-white': contextTheme === 'dark' && childrenSelected,
    },
    contextTheme !== 'dark' && 'text-text-tertiary',
    contextTheme !== 'dark' && childrenSelected && 'text-primary',
    firstLevel && isInlineCollapsed && 'opacity-0',
    mergedDisabled && {
      'text-text-quaternary': contextTheme === 'light',
      'text-gray-500': contextTheme === 'dark',
    },
  );

  // =============================== Render ===============================
  const popupId = domDataId ? `${domDataId}-popup` : undefined;

  const inlineStyle = React.useMemo(() => {
    const mergedStyle: React.CSSProperties = {};
    if (mode === 'inline' && !firstLevel) {
      mergedStyle.paddingInlineStart = `${level * (level === 1 ? 44 : 28)}px`;
    }
    return mergedStyle;
  }, []);

  // >>>>> Title
  let titleNode: React.ReactElement = (
    <div
      role="menuitem"
      className={wrapperCls}
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
      <span className={innerCls} style={inlineStyle}>
        {cloneElement(icon, {
          className: clsx(
            iconCls,
            isValidElement<{ className?: string }>(icon) ? icon.props?.className : '',
          ),
        })}

        <span className={contentCls}>{title}</span>

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
            <ExpandIcon open={open && mode === 'inline'} className={expandCls} />
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
            <SubMenuList id={popupId} ref={popupRef} className={semanticCls.list}>
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
      className={rootCls}
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
