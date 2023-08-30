import { EllipsisHorizontalOutline } from '@metaoa/icons';
import Overflow from 'rc-overflow';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import isEqual from 'rc-util/lib/isEqual';
import * as React from 'react';
import { useImperativeHandle } from 'react';
import { flushSync } from 'react-dom';
import { clsx } from '../_util/classNameUtils';
import useMemoizedFn from '../_util/hooks/useMemoizedFn';
import { cloneElement, isValidElement } from '../_util/reactNode';
import warning from '../_util/warning';
import { ConfigContext } from '../config-provider';
import { SiderContextProps } from '../layout/Sider';
import { TransitionProps } from '../transition';
import MenuItem from './MenuItem';
import SubMenu from './SubMenu';
import { IdContext, getMenuId } from './context/IdContext';
import MenuContextProvider, { MenuTheme } from './context/MenuContext';
import OverrideContext from './context/OverrideContext';
import { PathRegisterContext, PathUserContext } from './context/PathContext';
import useAccessibility from './hooks/useAccessibility';
import useKeyRecords, { OVERFLOW_KEY } from './hooks/useKeyRecords';
import useUUID from './hooks/useUUID';
import type {
  BuiltinPlacements,
  ItemType,
  MenuClickEventHandler,
  MenuInfo,
  MenuMode,
  MenuRef,
  RenderIconType,
  SelectEventHandler,
  SelectInfo,
  TriggerSubMenuAction,
} from './interface';
import { parseItems } from './utils/nodeUtil';

// optimize for render
const EMPTY_LIST: string[] = [];

export interface MenuProps
  extends Omit<
      React.HTMLAttributes<HTMLUListElement>,
      'onClick' | 'onSelect' | 'dir' | 'children' | 'className'
    >,
    SiderContextProps {
  prefixCls?: string;
  className?: string;
  theme?: MenuTheme;
  items: ItemType[];

  disabled?: boolean;
  /** @private Disable auto overflow. Pls note the prop name may refactor since we do not final decided. */
  disabledOverflow?: boolean;

  // Mode
  mode?: MenuMode;
  inlineCollapsed?: boolean;

  // Open control
  defaultOpenKeys?: string[];
  openKeys?: string[];

  // Active control
  activeKey?: string;
  defaultActiveFirst?: boolean;

  // Selection
  selectable?: boolean;
  multiple?: boolean;

  defaultSelectedKeys?: string[];
  selectedKeys?: string[];

  onSelect?: SelectEventHandler;
  onDeselect?: SelectEventHandler;

  // Level
  inlineIndent?: number;

  // Transition
  transition?: TransitionProps;

  // Popup
  subMenuOpenDelay?: number;
  subMenuCloseDelay?: number;
  forceSubMenuRender?: boolean;
  triggerSubMenuAction?: TriggerSubMenuAction;
  builtinPlacements?: BuiltinPlacements;

  // Icon
  expandIcon?: RenderIconType;
  overflowedIndicator?: React.ReactNode;
  /** @private Internal usage. Do not use in your production. */
  overflowedIndicatorPopupClassName?: string;

  // >>>>> Function
  getPopupContainer?: (node: HTMLElement) => HTMLElement;

  // >>>>> Events
  onClick?: MenuClickEventHandler;
  onOpenChange?: (openKeys: string[]) => void;

  // >>>>> Sider
  collapsedWidth?: string | number;
}

const Menu = React.forwardRef<MenuRef, MenuProps>((props, ref) => {
  const {
    prefixCls: customizePrefixCls,
    style,
    theme = 'light',
    className,
    tabIndex = 0,
    items,

    id,

    // Mode
    mode = 'vertical',
    inlineCollapsed,

    // Disabled
    disabled,
    disabledOverflow,

    // Open
    subMenuOpenDelay = 0.1,
    subMenuCloseDelay = 0.1,
    forceSubMenuRender,
    defaultOpenKeys,
    openKeys,

    // Active
    activeKey,
    defaultActiveFirst,

    // Selection
    selectable = true,
    multiple = false,
    defaultSelectedKeys,
    selectedKeys,
    onSelect,
    onDeselect,

    // Level
    inlineIndent = 24,

    // Transition
    transition,

    // Popup
    triggerSubMenuAction = 'hover',
    builtinPlacements,

    // Icon
    expandIcon,
    overflowedIndicator = <EllipsisHorizontalOutline className="h-5 w-5" />,
    overflowedIndicatorPopupClassName,

    // Function
    getPopupContainer: customizeGetPopupContainer,

    // Events
    onClick,
    onOpenChange,
    onKeyDown,

    ...restProps
  } = props;

  // ======================== Warning ==========================
  warning(
    !('inlineCollapsed' in props && mode !== 'inline'),
    'Menu',
    '`inlineCollapsed` should only be used when `mode` is inline.',
  );

  warning(
    !(props.siderCollapsed !== undefined && 'inlineCollapsed' in props),
    'Menu',
    '`inlineCollapsed` not control Menu under Sider. Should set `collapsed` on Sider instead.',
  );

  const override = React.useContext(OverrideContext);
  const overrideObj = override || {};

  const { getPrefixCls, getPopupContainer: globalGetPopupContainer } =
    React.useContext(ConfigContext);
  const getPopupContainer = customizeGetPopupContainer ?? globalGetPopupContainer;

  const prefixCls = getPrefixCls('menu', customizePrefixCls || overrideObj.prefixCls);

  const childList: React.ReactElement[] = React.useMemo(
    () => parseItems(items, EMPTY_LIST),
    [items],
  );

  const [mounted, setMounted] = React.useState(false);

  const containerRef = React.useRef<HTMLUListElement>(null);

  const uuid = useUUID(id);

  // ========================= Open =========================
  const [mergedOpenKeys, setMergedOpenKeys] = useMergedState(defaultOpenKeys, {
    value: openKeys,
    postState: (keys) => keys || EMPTY_LIST,
  });

  const triggerOpenKeys = (keys: string[], forceFlush = false) => {
    function doUpdate() {
      setMergedOpenKeys(keys);
      onOpenChange?.(keys);
    }

    if (forceFlush) {
      flushSync(doUpdate);
    } else {
      doUpdate();
    }
  };

  // >>>>> Cache & Reset open keys when inlineCollapsed changed
  const [inlineCacheOpenKeys, setInlineCacheOpenKeys] = React.useState(mergedOpenKeys);

  const mountRef = React.useRef(false);

  // ========================= Mode =========================
  const [mergedMode, mergedInlineCollapsed] = React.useMemo<[MenuMode, boolean]>(() => {
    const _mode = overrideObj.mode || mode;
    if ((_mode === 'inline' || _mode === 'vertical') && inlineCollapsed) {
      return ['vertical', inlineCollapsed];
    }
    return [_mode, false];
  }, [overrideObj.mode, mode, inlineCollapsed]);

  const defaultTransitions: Partial<{ [key in MenuMode | 'other']: TransitionProps }> =
    React.useMemo(
      () => ({
        horizontal: {
          leave: 'transition ease-in duration-1500',
          leaveFrom: 'opacity-100',
          leaveTo: 'opacity-0',
        },
        inline: {},
        other: {},
      }),
      [],
    );

  const isInlineMode = mergedMode === 'inline';

  const [internalMode, setInternalMode] = React.useState(mergedMode);
  const [internalInlineCollapsed, setInternalInlineCollapsed] =
    React.useState(mergedInlineCollapsed);

  React.useEffect(() => {
    setInternalMode(mergedMode);
    setInternalInlineCollapsed(mergedInlineCollapsed);

    if (!mountRef.current) {
      return;
    }
    // Synchronously update MergedOpenKeys
    if (isInlineMode) {
      setMergedOpenKeys(inlineCacheOpenKeys);
    } else {
      // Trigger open event in case its in control
      triggerOpenKeys(EMPTY_LIST);
    }
  }, [mergedMode, mergedInlineCollapsed]);

  // ====================== Responsive ======================
  const [lastVisibleIndex, setLastVisibleIndex] = React.useState(0);
  const allVisible =
    lastVisibleIndex >= childList.length - 1 || internalMode !== 'horizontal' || disabledOverflow;

  // Cache
  React.useEffect(() => {
    if (isInlineMode) {
      setInlineCacheOpenKeys(mergedOpenKeys);
    }
  }, [mergedOpenKeys]);

  React.useEffect(() => {
    mountRef.current = true;

    return () => {
      mountRef.current = false;
    };
  }, []);

  // ========================= Path =========================
  const {
    registerPath,
    unregisterPath,
    refreshOverflowKeys,

    isSubPathKey,
    getKeyPath,
    getKeys,
    getSubPathKeys,
  } = useKeyRecords();

  const registerPathContext = React.useMemo(
    () => ({ registerPath, unregisterPath }),
    [registerPath, unregisterPath],
  );

  const pathUserContext = React.useMemo(() => ({ isSubPathKey }), [isSubPathKey]);

  React.useEffect(() => {
    refreshOverflowKeys(
      allVisible
        ? EMPTY_LIST
        : childList.slice(lastVisibleIndex + 1).map((child) => child.key as string),
    );
  }, [lastVisibleIndex, allVisible]);

  // ======================== Active ========================
  const [mergedActiveKey, setMergedActiveKey] = useMergedState(
    activeKey || (defaultActiveFirst ? (childList[0].key as string) : undefined),
    {
      value: activeKey,
    },
  );

  const onActive = useMemoizedFn((key: string) => {
    setMergedActiveKey(key);
  });

  const onInactive = useMemoizedFn(() => {
    setMergedActiveKey(undefined);
  });

  useImperativeHandle(ref, () => ({
    list: containerRef.current!,
    focus: (options) => {
      const shouldFocusKey = mergedActiveKey ?? childList.find((node) => !node.props.disabled)?.key;
      if (shouldFocusKey) {
        containerRef.current
          ?.querySelector<HTMLLIElement>(
            `li[data-menu-id='${getMenuId(uuid!, shouldFocusKey as string)}']`,
          )
          ?.focus?.(options);
      }
    },
  }));

  // ======================== Select ========================
  // >>>>> Select keys
  const [mergedSelectKeys, setMergedSelectKeys] = useMergedState(defaultSelectedKeys || [], {
    value: selectedKeys,

    // Legacy convert key to array
    postState: (keys) => {
      if (Array.isArray(keys)) {
        return keys;
      }

      if (keys === null || keys === undefined) {
        return EMPTY_LIST;
      }

      return [keys];
    },
  });

  // ======================= Selectable ========================
  const mergedSelectable = selectable ?? overrideObj.selectable;

  // ====================== Expand Icon ========================
  let mergedExpandIcon: MenuProps['expandIcon'];
  if (typeof expandIcon === 'function') {
    mergedExpandIcon = expandIcon;
  } else {
    const beClone: React.ReactNode = expandIcon || overrideObj.expandIcon;
    mergedExpandIcon = cloneElement(beClone, {
      className: clsx(
        `${prefixCls}-submenu-expand-icon`,
        isValidElement(beClone) ? beClone.props?.className : '',
      ),
    });
  }

  // >>>>> Trigger select
  const triggerSelection = (info: MenuInfo) => {
    if (mergedSelectable) {
      // Insert or Remove
      const { key: targetKey } = info;
      const exist = mergedSelectKeys.includes(targetKey);
      let newSelectKeys: string[];

      if (multiple) {
        if (exist) {
          newSelectKeys = mergedSelectKeys.filter((key) => key !== targetKey);
        } else {
          newSelectKeys = [...mergedSelectKeys, targetKey];
        }
      } else {
        newSelectKeys = [targetKey];
      }

      setMergedSelectKeys(newSelectKeys);

      // Trigger event
      const selectInfo: SelectInfo = {
        ...info,
        selectedKeys: newSelectKeys,
      };

      if (exist) {
        onDeselect?.(selectInfo);
      } else {
        onSelect?.(selectInfo);
      }
    }

    // Whatever selectable, always close it
    if (!multiple && mergedOpenKeys?.length && internalMode !== 'inline') {
      triggerOpenKeys(EMPTY_LIST);
    }
  };

  // ========================= Open =========================
  /**
   * Click for item. SubMenu do not have selection status
   */
  const onInternalClick = useMemoizedFn((info: MenuInfo) => {
    onClick?.(info);
    overrideObj.onClick?.();
    triggerSelection(info);
  });

  const onInternalOpenChange = useMemoizedFn((key: string, open: boolean) => {
    let newOpenKeys = mergedOpenKeys?.filter((k) => k !== key) ?? [];

    if (open) {
      newOpenKeys.push(key);
    } else if (internalMode !== 'inline') {
      // We need find all related popup to close
      const subPathKeys = getSubPathKeys(key);
      newOpenKeys = newOpenKeys.filter((k) => !subPathKeys.has(k));
    }

    if (!isEqual(mergedOpenKeys, newOpenKeys, true)) {
      triggerOpenKeys(newOpenKeys, true);
    }
  });

  // ==================== Accessibility =====================
  const triggerAccessibilityOpen = (key: string, open?: boolean) => {
    const nextOpen = open ?? !mergedOpenKeys?.includes(key);

    onInternalOpenChange(key, nextOpen);
  };

  const onInternalKeyDown = useAccessibility(
    internalMode,
    mergedActiveKey as string,
    uuid!,

    containerRef,
    getKeys,
    getKeyPath,

    setMergedActiveKey,
    triggerAccessibilityOpen,

    onKeyDown,
  );

  // ======================== Effect ========================
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // ======================== Render ========================

  // >>>>> Children
  const wrappedChildList =
    internalMode !== 'horizontal' || disabledOverflow
      ? childList
      : // Need wrap for overflow dropdown that do not response for open
        childList.map((child, index) => (
          // Always wrap provider to avoid sub node re-mount
          <MenuContextProvider key={child.key} overflowDisabled={index > lastVisibleIndex}>
            {child}
          </MenuContextProvider>
        ));

  // >>>>> Container
  const container = (
    <Overflow
      id={id}
      ref={containerRef as any}
      prefixCls={`${prefixCls}-overflow`}
      component="ul"
      itemComponent={MenuItem}
      className={clsx(
        prefixCls,
        `${prefixCls}-${internalMode}`,
        'text-sm text-neutral-text transition-width',
        {
          [`${prefixCls}-inline-collapsed`]: internalInlineCollapsed,
          'flex h-[4rem] leading-[4rem]': mergedMode === 'horizontal',
          'px-6': mergedMode === 'inline',
        },
        // >>> Dark
        theme === 'dark' && {
          'items-center bg-gray-800': true,
        },
        className,
      )}
      style={style}
      role="menu"
      tabIndex={tabIndex}
      data={wrappedChildList}
      renderRawItem={(node) => node}
      renderRawRest={(omitItems) => {
        // We use origin list since wrapped list use context to prevent open
        const len = omitItems.length;

        const originOmitItems = len ? childList.slice(-len) : null;

        return (
          <SubMenu
            eventKey={OVERFLOW_KEY}
            title={overflowedIndicator}
            disabled={allVisible}
            internalPopupClose={len === 0}
            popupClassName={overflowedIndicatorPopupClassName}
          >
            {originOmitItems}
          </SubMenu>
        );
      }}
      maxCount={
        internalMode !== 'horizontal' || disabledOverflow
          ? Overflow.INVALIDATE
          : Overflow.RESPONSIVE
      }
      ssr="full"
      data-menu-list
      onVisibleChange={(newLastIndex) => {
        setLastVisibleIndex(newLastIndex);
      }}
      onKeyDown={onInternalKeyDown}
      {...restProps}
    />
  );

  // >>>>> Render
  return (
    <OverrideContext.Provider value={null}>
      <IdContext.Provider value={uuid}>
        <MenuContextProvider
          prefixCls={prefixCls}
          inlineCollapsed={mergedInlineCollapsed || false}
          theme={theme}
          mode={internalMode}
          openKeys={mergedOpenKeys}
          // Disabled
          disabled={disabled}
          // Transition
          transition={mounted ? transition : undefined}
          defaultTransitions={mounted ? defaultTransitions : undefined}
          // Active
          activeKey={mergedActiveKey}
          onActive={onActive}
          onInactive={onInactive}
          // Selection
          selectedKeys={mergedSelectKeys}
          // Level
          inlineIndent={inlineIndent}
          // Popup
          subMenuOpenDelay={subMenuOpenDelay}
          subMenuCloseDelay={subMenuCloseDelay}
          forceSubMenuRender={forceSubMenuRender}
          builtinPlacements={builtinPlacements}
          triggerSubMenuAction={triggerSubMenuAction}
          getPopupContainer={getPopupContainer}
          // Icon
          expandIcon={mergedExpandIcon}
          // Events
          onItemClick={onInternalClick}
          onOpenChange={onInternalOpenChange}
        >
          <PathUserContext.Provider value={pathUserContext}>{container}</PathUserContext.Provider>

          {/* Measure menu keys. Add `display: none` to avoid some developer miss use the Menu */}
          <div style={{ display: 'none' }} aria-hidden>
            <PathRegisterContext.Provider value={registerPathContext}>
              {childList}
            </PathRegisterContext.Provider>
          </div>
        </MenuContextProvider>
      </IdContext.Provider>
    </OverrideContext.Provider>
  );
});

export default Menu;
