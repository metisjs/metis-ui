import type React from 'react';
import type { DropdownProps } from '../dropdown';
import type { TransitionProps } from '../transition';
import type { TabNavListProps } from './TabNavList';
import type { TabPanelProps } from './TabPanelList/TabPanel';

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
  key: string;
  label: React.ReactNode;
}

type RenderTabBarProps = {
  id: string;
  activeKey: string;
  animated: AnimatedConfig;
  tabPosition: TabPosition;
  mobile: boolean;
  editable?: EditableConfig;
  locale?: TabsLocale;
  more?: MoreProps;
  onTabClick: (key: string, e: React.MouseEvent | React.KeyboardEvent) => void;
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

export interface EditableConfig {
  onEdit: (
    type: 'add' | 'remove',
    info: { key?: string; event: React.MouseEvent | React.KeyboardEvent },
  ) => void;
  showAdd?: boolean;
}

export interface AnimatedConfig {
  indicator?: boolean;
  tabPane?: boolean;
  tabPaneTransition?: TransitionProps;
}

export type OnTabScroll = (info: { direction: 'left' | 'right' | 'top' | 'bottom' }) => void;

export type TabBarExtraPosition = 'left' | 'right';

export type TabBarExtraMap = Partial<Record<TabBarExtraPosition, React.ReactNode>>;

export type TabBarExtraContent = React.ReactNode | TabBarExtraMap;
