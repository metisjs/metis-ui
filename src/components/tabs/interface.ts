import type React from 'react';
import type { SafeKey } from '../_util/type';
import type { DropdownProps } from '../dropdown';
import type { TransitionProps } from '../transition';
import type { TabNavListProps } from './TabNavList';
import type { TabPanelProps } from './TabPanelList/TabPanel';
import type { TabsProps } from './Tabs';

export type TriggerProps = {
  trigger?: 'hover' | 'click';
};

export type IconsType = {
  add?: React.ReactNode;
  remove?: React.ReactNode;
  more?: React.ReactNode;
};

export type MoreProps = Omit<DropdownProps, 'children'>;

export type SizeInfo = [width: number, height: number];

export type TabSizeMap = Map<
  React.Key,
  { width: number; height: number; left: number; top: number }
>;

export interface TabOffset {
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
}

export type TabOffsetMap = Map<React.Key, TabOffset>;

export type TabsType = 'line' | 'pills' | 'card';

export type TabPosition = 'left' | 'right' | 'top' | 'bottom';

export interface Tab extends Omit<TabPanelProps, 'tab'> {
  key: SafeKey;
  label: React.ReactNode;
}

type RenderTabBarProps = {
  id: string;
  activeKey: SafeKey;
  animated: AnimatedConfig;
  tabPosition: TabPosition;
  mobile: boolean;
  editConfig: EditableConfig;
  locale?: TabsLocale;
  more?: MoreProps;
  onTabClick: (key: SafeKey, e: React.MouseEvent | React.KeyboardEvent) => void;
  onTabScroll?: OnTabScroll;
  extra?: TabBarExtraContent;
  style?: React.CSSProperties;
};

export type RenderTabBar = (
  props: RenderTabBarProps,
  DefaultTabBar: React.ComponentType<TabNavListProps>,
) => React.ReactElement;

export interface TabsLocale {
  dropdownAriaLabel?: string;
  removeAriaLabel?: string;
  addAriaLabel?: string;
}

export type EditableConfig = Pick<
  TabsProps,
  'closable' | 'addable' | 'renameAfterAdd' | 'onAdd' | 'onRemove' | 'onRename'
>;

export interface AnimatedConfig {
  indicator?: boolean;
  tabPane?: boolean;
  tabPaneTransition?: TransitionProps;
}

export type OnTabScroll = (info: { direction: 'left' | 'right' | 'top' | 'bottom' }) => void;

export type TabBarExtraPosition = 'left' | 'right';

export type TabBarExtraMap = Partial<Record<TabBarExtraPosition, React.ReactNode>>;

export type TabBarExtraContent = React.ReactNode | TabBarExtraMap;

export interface TabsRef {
  triggerRename: (key: SafeKey) => void;
}
