import * as React from 'react';
import { useImperativeHandle } from 'react';
import { flushSync } from 'react-dom';
import { EllipsisHorizontalOutline } from '@metisjs/icons';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import { cloneElement, isValidElement } from '@util/reactNode';
import { collapseTransition } from '@util/transition';
import type { SafeKey } from '@util/type';
import warning from '@util/warning';
import Overflow from 'rc-overflow';
import { useEvent } from 'rc-util';
import useMergedState from 'rc-util/es/hooks/useMergedState';
import isEqual from 'rc-util/es/isEqual';
import { ConfigContext } from '../config-provider';
import { SiderContext } from '../layout/Sider';
import type { TransitionProps } from '../transition';
import { getMenuId, IdContext } from './context/IdContext';
import type { MenuTheme } from './context/MenuContext';
import MenuContextProvider from './context/MenuContext';
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
  MenuItemGroupType,
  MenuItemType,
  MenuMode,
  MenuRef,
  RenderIconType,
  SelectEventHandler,
  SelectInfo,
  SubMenuType,
  TriggerSubMenuAction,
} from './interface';
import MenuItem from './MenuItem';
import SubMenu from './SubMenu';
import { parseItems } from './utils/nodeUtil';

// optimize for render
const EMPTY_LIST: string[] = [];

export interface MenuProps
  extends Omit<
    React.HTMLAttributes<HTMLUListElement>,
    'onClick' | 'onSelect' | 'dir' | 'children' | 'className'
  > {
  prefixCls?: string;
  className?: SemanticClassName<{
    item?: MenuItemType['className'];
    group?: MenuItemGroupType['className'];
    sub?: SubMenuType['className'];
  }>;
  theme?: MenuTheme;
  items: ItemType[];

  disabled?: boolean;
  /** @private Disable auto overflow. Pls note the prop name may refactor since we do not final decided. */
  disabledOverflow?: boolean;

  // Mode
  mode?: MenuMode;
  inlineCollapsed?: boolean;

  // Open control
  defaultOpenKeys?: SafeKey[];
  openKeys?: SafeKey[];

  // Active control
  activeKey?: SafeKey;
  defaultActiveFirst?: boolean;

  // Selection
  selectable?: boolean;
  multiple?: boolean;

  defaultSelectedKeys?: SafeKey[];
  selectedKeys?: SafeKey[];

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
  onOpenChange?: (openKeys: SafeKey[]) => void;

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
    selectable,
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
    overflowedIndicator = <EllipsisHorizontalOutline className="h-5 w-5 align-middle" />,
    overflowedIndicatorPopupClassName,

    // Function
    getPopupContainer: customizeGetPopupContainer,

    // Events
    onClick,
    onOpenChange,
    onKeyDown,

    ...restProps
  } = props;

  const { siderCollapsed } = React.useContext(SiderContext);

  // ======================== Warning ==========================
  warning(
    !('inlineCollapsed' in props && mode !== 'inline'),
    'Menu',
    '`inlineCollapsed` should only be used when `mode` is inline.',
  );

  warning(
    !(siderCollapsed !== undefined && 'inlineCollapsed' in props),
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

  const triggerOpenKeys = (keys: SafeKey[], forceFlush = false) => {
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
    const collapsed = siderCollapsed ?? inlineCollapsed;
    const _mode = overrideObj.mode || mode;
    if ((_mode === 'inline' || _mode === 'vertical') && collapsed) {
      return ['vertical', collapsed];
    }
    return [_mode, false];
  }, [overrideObj.mode, mode, siderCollapsed, inlineCollapsed]);

  const defaultTransitions: Partial<{ [key in MenuMode | 'other']: TransitionProps }> =
    React.useMemo(
      () => ({
        inline: collapseTransition,
        other: {
          enter: 'transition ease-out duration-200',
          enterFrom: 'opacity-0',
          enterTo: 'opacity-100',
          leave: 'transition ease-in duration-150',
          leaveFrom: 'opacity-100',
          leaveTo: 'opacity-0',
        },
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
        : childList.slice(lastVisibleIndex + 1).map((child) => child.key as SafeKey),
    );
  }, [lastVisibleIndex, allVisible]);

  // ======================== Active ========================
  const [mergedActiveKey, setMergedActiveKey] = useMergedState<SafeKey | undefined>(
    activeKey || (defaultActiveFirst ? (childList[0].key as SafeKey) : undefined),
    {
      value: activeKey,
    },
  );

  const onActive = useEvent((key: SafeKey) => {
    setMergedActiveKey(key);
  });

  const onInactive = useEvent(() => {
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
  const mergedSelectable = selectable ?? overrideObj.selectable ?? true;

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
      let newSelectKeys: SafeKey[];

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
  const onInternalClick = useEvent((info: MenuInfo) => {
    onClick?.(info);
    overrideObj.onClick?.();
    triggerSelection(info);
  });

  const onInternalOpenChange = useEvent((key: SafeKey, open: boolean) => {
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
  const triggerAccessibilityOpen = (key: SafeKey, open?: boolean) => {
    const nextOpen = open ?? !mergedOpenKeys?.includes(key);

    onInternalOpenChange(key, nextOpen);
  };

  const onInternalKeyDown = useAccessibility(
    internalMode,
    mergedActiveKey as SafeKey,
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

  // ======================== Style ========================
  const semanticCls = useSemanticCls([overrideObj.className, className], 'menu');

  const rootCls = clsx(
    prefixCls,
    `${prefixCls}-${internalMode}`,
    'flex w-full text-sm text-text transition-[width]',
    {
      [`${prefixCls}-inline-collapsed`]: internalInlineCollapsed,
      'h-[4rem] leading-[4rem]': mergedMode === 'horizontal',
      'flex-col gap-1 py-2': mergedMode !== 'horizontal',
      'w-[72px] px-0': internalInlineCollapsed,
    },
    // >>> Dark
    theme === 'dark' && 'bg-gray-800',
    theme === 'dark' && internalMode === 'horizontal' && 'items-center',
    semanticCls.root,
  );

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
      className={rootCls}
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
            className={{ popup: overflowedIndicatorPopupClassName }}
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
          itemClassName={semanticCls.item}
          groupClassName={semanticCls.group}
          subClassName={semanticCls.sub}
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
