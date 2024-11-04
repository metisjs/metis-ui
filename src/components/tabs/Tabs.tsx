import * as React from 'react';
import { useEffect, useState } from 'react';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import isMobile from 'rc-util/lib/isMobile';
import omit from 'rc-util/lib/omit';
import { clsx, mergeSemanticCls, type SemanticClassName } from '../_util/classNameUtils';
import useSemanticCls from '../_util/hooks/useSemanticCls';
import { devUseWarning } from '../_util/warning';
import { ConfigContext } from '../config-provider';
import { TabContext } from './context';
import useAnimateConfig from './hooks/useAnimateConfig';
import type { GetIndicatorSize } from './hooks/useIndicator';
import type {
  AnimatedConfig,
  EditableConfig,
  MoreProps,
  OnTabScroll,
  RenderTabBar,
  Tab,
  TabBarExtraContent,
  TabPosition,
  TabsLocale,
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

  activeKey?: string;
  defaultActiveKey?: string;
  animated?: boolean | AnimatedConfig;
  renderTabBar?: RenderTabBar;
  tabBarExtraContent?: TabBarExtraContent;
  tabBarGutter?: number;
  tabPosition?: TabPosition;
  destroyInactiveTabPane?: boolean;

  type?: TabsType;
  size?: 'default' | 'middle' | 'small';
  centered?: boolean;
  editable?: EditableConfig;

  onChange?: (activeKey: string) => void;
  onTabClick?: (activeKey: string, e: React.KeyboardEvent | React.MouseEvent) => void;
  onTabScroll?: OnTabScroll;

  getPopupContainer?: (node: HTMLElement) => HTMLElement;

  // Accessibility
  locale?: TabsLocale;

  // Icons
  icons?: {
    add?: React.ReactNode;
    remove?: React.ReactNode;
    more?: React.ReactNode;
  };

  more?: MoreProps;
  indicator?: {
    size?: GetIndicatorSize;
    align?: 'start' | 'center' | 'end';
  };
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>((props, ref) => {
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
    tabBarGutter,
    tabBarExtraContent,
    locale,
    more,
    destroyInactiveTabPane,
    editable,
    size = 'default',
    renderTabBar,
    onChange,
    onTabClick,
    onTabScroll,
    getPopupContainer,
    indicator,
    icons,
    ...restProps
  } = props;

  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('tabs', customizePrefixCls);

  const tabs = React.useMemo<Tab[]>(
    () => (items || []).filter((item) => item && typeof item === 'object' && 'key' in item),
    [items],
  );

  const warning = devUseWarning('Tabs');

  let mergedEditable: EditableConfig | undefined = editable;
  if (!!editable && type === 'line') {
    mergedEditable = undefined;
    warning(false, 'usage', 'Default tabs not support editable, Please use `card` or `pills`.');
  }

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

  // ======================== Mobile ========================
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    // Only update on the client side
    setMobile(isMobile());
  }, []);

  // ====================== Active Key ======================
  const [mergedActiveKey, setMergedActiveKey] = useMergedState<string>(() => tabs[0]?.key, {
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
      [`${prefixCls}-editable`]: editable,
      [`${prefixCls}-${size}`]: size !== 'default',
      [`${prefixCls}-${type}`]: type !== 'line',
      [`${prefixCls}-centered`]: centered,
    },
    'flex text-sm text-text',
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
    editable: mergedEditable,
    locale,
    more,
    icons,
    tabBarGutter,
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

  return (
    <TabContext.Provider value={{ tabs, prefixCls, type }}>
      <div ref={ref} id={id} className={rootCls} {...restProps}>
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
