import * as React from 'react';
import { useEffect, useState } from 'react';
import { clsx, mergeSemanticCls, type SemanticClassName } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import type { SafeKey } from '@util/type';
import { devUseWarning } from '@util/warning';
import useMergedState from 'rc-util/es/hooks/useMergedState';
import isMobile from 'rc-util/es/isMobile';
import omit from 'rc-util/es/omit';
import { ConfigContext } from '../config-provider';
import type { MenuProps } from '../menu';
import type { TabContextProps } from './context';
import { TabContext } from './context';
import useAnimateConfig from './hooks/useAnimateConfig';
import type { GetIndicatorSize } from './hooks/useIndicator';
import type {
  AnimatedConfig,
  MoreProps,
  OnTabScroll,
  RenderTabBar,
  Tab,
  TabBarExtraContent,
  TabPosition,
  TabsLocale,
  TabsRef,
  TabsType,
} from './interface';
import type { TabNavListClassStruct } from './TabNavList';
import TabNavListWrapper from './TabNavList/Wrapper';
import TabPanelList from './TabPanelList';
import type { TabPanelProps } from './TabPanelList/TabPanel';

// Used for accessibility
let uuid = 0;

export interface TabsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'children' | 'className'> {
  prefixCls?: string;
  className?: SemanticClassName<
    {
      nav?: string;
      content?: string;
      panel?: TabPanelProps['className'];
    } & TabNavListClassStruct
  >;
  style?: React.CSSProperties;
  id?: string;

  items?: Tab[];

  activeKey?: SafeKey;
  defaultActiveKey?: SafeKey;
  animated?: boolean | AnimatedConfig;
  renderTabBar?: RenderTabBar;
  tabBarExtraContent?: TabBarExtraContent;
  tabPosition?: TabPosition;
  destroyInactiveTabPane?: boolean;

  type?: TabsType;
  size?: 'default' | 'middle' | 'small';
  centered?: boolean;

  renderTabContextMenu?: (tab: Tab) => MenuProps;
  addable?: boolean;
  closable?: boolean;
  renameAfterAdd?: boolean;
  onAdd?: (event: React.MouseEvent | React.KeyboardEvent) => void | string | Promise<string>;
  onClose?: (key: SafeKey, e: React.MouseEvent | React.KeyboardEvent) => void;
  onRename?: (key: SafeKey, name: string) => void;

  onChange?: (activeKey: SafeKey) => void;
  onTabClick?: (activeKey: SafeKey, e: React.KeyboardEvent | React.MouseEvent) => void;
  onTabScroll?: OnTabScroll;

  getPopupContainer?: (node: HTMLElement) => HTMLElement;

  // Accessibility
  locale?: TabsLocale;

  // Icons
  icons?: {
    add?: React.ReactNode;
    close?: React.ReactNode;
    more?: React.ReactNode;
  };

  more?: MoreProps;
  indicator?: {
    size?: GetIndicatorSize;
    align?: 'start' | 'center' | 'end';
  };
}

const Tabs = React.forwardRef<TabsRef, TabsProps>((props, ref) => {
  const {
    id,
    prefixCls: customizePrefixCls,
    className,
    items,
    activeKey,
    defaultActiveKey,
    type = 'line',
    centered,
    animated,
    tabPosition = 'top',
    tabBarExtraContent,
    locale,
    more,
    destroyInactiveTabPane,
    size = 'default',
    closable,
    addable,
    renameAfterAdd = true,
    renderTabContextMenu,
    renderTabBar,
    onChange,
    onTabClick,
    onTabScroll,
    getPopupContainer,
    onAdd,
    onClose,
    onRename,
    indicator,
    icons,
    ...restProps
  } = props;

  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('tabs', customizePrefixCls);

  const [renamingKey, setRenamingKey] = useState<SafeKey>();

  const tabs = React.useMemo<Tab[]>(
    () => (items || []).filter((item) => item && typeof item === 'object' && 'key' in item),
    [items],
  );

  const warning = devUseWarning('Tabs');

  let mergedTabPosition = tabPosition;
  if (type !== 'line' && (tabPosition === 'left' || tabPosition === 'right')) {
    mergedTabPosition = 'top';
    warning(
      false,
      'usage',
      '`card` and `pills` tabs not support vertical position, Please use `line`.',
    );
  }

  const mergedAnimated = useAnimateConfig(animated);

  React.useImperativeHandle(ref, () => ({ triggerRename: setRenamingKey }));

  // ======================== Mobile ========================
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    // Only update on the client side
    setMobile(isMobile());
  }, []);

  // ====================== Active Key ======================
  const [mergedActiveKey, setMergedActiveKey] = useMergedState<SafeKey>(() => tabs[0]?.key, {
    value: activeKey,
    defaultValue: defaultActiveKey,
  });
  const [activeIndex, setActiveIndex] = useState(() =>
    tabs.findIndex((tab) => tab.key === mergedActiveKey),
  );

  // Reset active key if not exist anymore
  useEffect(() => {
    let newActiveIndex = tabs.findIndex((tab) => tab.key === mergedActiveKey);
    if (newActiveIndex === -1) {
      newActiveIndex = Math.max(0, Math.min(activeIndex, tabs.length - 1));
      setMergedActiveKey(tabs[newActiveIndex]?.key);
    }
    setActiveIndex(newActiveIndex);
  }, [tabs.map((tab) => tab.key).join('_'), mergedActiveKey, activeIndex]);

  // ===================== Accessibility ====================
  const [mergedId, setMergedId] = useMergedState('', {
    value: id,
  });

  // Async generate id to avoid ssr mapping failed
  useEffect(() => {
    if (!id) {
      setMergedId(`metis-tabs-${process.env.NODE_ENV === 'test' ? 'test' : uuid}`);
      uuid += 1;
    }
  }, []);

  // ======================== Events ========================
  function onInternalTabClick(key: string, e: React.MouseEvent | React.KeyboardEvent) {
    onTabClick?.(key, e);
    const isActiveChanged = key !== mergedActiveKey;
    setMergedActiveKey(key);
    if (isActiveChanged) {
      onChange?.(key);
    }
  }

  // ======================== Style ========================
  const semanticCls = useSemanticCls(className, 'tabs');

  const rootCls = clsx(
    prefixCls,
    `${prefixCls}-${mergedTabPosition}`,
    {
      [`${prefixCls}-mobile`]: mobile,
      [`${prefixCls}-${size}`]: size !== 'default',
      [`${prefixCls}-${type}`]: type !== 'line',
      [`${prefixCls}-centered`]: centered,
    },
    'flex w-full text-sm text-text',
    {
      'flex-col': mergedTabPosition === 'top' || mergedTabPosition === 'bottom',
    },
    semanticCls.root,
  );

  // ======================== Render ========================
  const sharedProps = {
    id: mergedId,
    activeKey: mergedActiveKey,
    animated: mergedAnimated,
    tabPosition: mergedTabPosition,
    mobile,
  };

  const tabNavBarProps = {
    ...sharedProps,
    centered,
    editConfig: { onAdd, onClose, onRename, closable, addable, renameAfterAdd },
    locale,
    more,
    icons,
    onTabClick: onInternalTabClick,
    onTabScroll,
    extra: tabBarExtraContent,
    panes: null,
    getPopupContainer,
    indicator,
    className: mergeSemanticCls(
      semanticCls.nav,
      omit(semanticCls, ['root', 'nav', 'content', 'panel']),
    ),
  };

  const context: TabContextProps = {
    tabs,
    prefixCls,
    type,
    size,
    renderTabContextMenu,
    renamingKey,
    triggerRename: setRenamingKey,
    cancelRename: () => setRenamingKey(undefined),
  };

  return (
    <TabContext.Provider value={context}>
      <div id={id} className={rootCls} {...restProps}>
        <TabNavListWrapper {...tabNavBarProps} renderTabBar={renderTabBar} />
        <TabPanelList
          destroyInactiveTabPane={destroyInactiveTabPane}
          {...sharedProps}
          animated={mergedAnimated}
          className={semanticCls.content}
          panelClassName={semanticCls.panel}
        />
      </div>
    </TabContext.Provider>
  );
});

if (process.env.NODE_ENV !== 'production') {
  Tabs.displayName = 'Tabs';
}

export default Tabs;
