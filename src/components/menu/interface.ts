import type * as React from 'react';
import type { SemanticClassName } from '../_util/classNameUtils';
import type { SafeKey } from '../_util/type';

// ========================= Options =========================
export interface SubMenuType<T extends MenuItemType = MenuItemType> {
  label?: React.ReactNode;
  children: ItemType<T>[];
  disabled?: boolean;
  key: SafeKey;
  className?: SemanticClassName<
    {
      title?: string;
      inner?: string;
      icon?: string;
      content?: string;
      popup?: string;
    },
    { disabled?: boolean; active?: boolean; childrenSelected?: boolean }
  >;
  icon?: React.ReactNode;
  theme?: 'dark' | 'light';

  // >>>>> Icon
  expandIcon?: RenderIconType;

  // >>>>> Active
  onMouseEnter?: MenuHoverEventHandler;
  onMouseLeave?: MenuHoverEventHandler;

  // >>>>> Popup
  popupOffset?: number[];
  popupStyle?: React.CSSProperties;

  // >>>>> Events
  onClick?: MenuClickEventHandler;
  onTitleClick?: (info: MenuTitleInfo) => void;
  onTitleMouseEnter?: MenuHoverEventHandler;
  onTitleMouseLeave?: MenuHoverEventHandler;
}

export interface MenuItemType
  extends Omit<
    React.HTMLAttributes<HTMLLIElement>,
    'title' | 'onClick' | 'onMouseEnter' | 'onMouseLeave' | 'className'
  > {
  label?: React.ReactNode;
  disabled?: boolean;
  itemIcon?: RenderIconType;
  key: SafeKey;
  danger?: boolean;
  icon?: React.ReactNode;
  title?: string;
  className?: SemanticClassName<
    { inner?: string; icon?: string; title?: string },
    { disabled?: boolean; selected?: boolean }
  >;

  // >>>>> Active
  onMouseEnter?: MenuHoverEventHandler;
  onMouseLeave?: MenuHoverEventHandler;

  // >>>>> Events
  onClick?: MenuClickEventHandler;
}

export interface MenuItemGroupType<T extends MenuItemType = MenuItemType> {
  type: 'group';
  label?: React.ReactNode;
  children?: ItemType<T>[];
  key?: SafeKey;
  className?: SemanticClassName<{ title?: string; list?: string }>;
}

export interface MenuDividerType {
  type: 'divider';
  dashed?: boolean;
  key?: SafeKey;
  className?: string;
}

export type ItemType<T extends MenuItemType = MenuItemType> =
  | T
  | SubMenuType<T>
  | MenuItemGroupType<T>
  | MenuDividerType
  | null;

// ========================== Basic ==========================
export type MenuMode = 'horizontal' | 'vertical' | 'inline';

export type BuiltinPlacements = Record<string, any>;

export type TriggerSubMenuAction = 'click' | 'hover';

export interface RenderIconInfo {
  isSelected?: boolean;
  isOpen?: boolean;
  isSubMenu?: boolean;
  disabled?: boolean;
}

export type RenderIconType = React.ReactNode | ((props: RenderIconInfo) => React.ReactNode);

export interface MenuInfo {
  key: SafeKey;
  keyPath: SafeKey[];
  domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
}

export interface MenuTitleInfo {
  key: SafeKey;
  domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
}

// ========================== Hover ==========================
export type MenuHoverEventHandler = (info: {
  key: SafeKey;
  domEvent: React.MouseEvent<HTMLElement>;
}) => void;

// ======================== Selection ========================
export interface SelectInfo extends MenuInfo {
  selectedKeys: SafeKey[];
}

export type SelectEventHandler = (info: SelectInfo) => void;

// ========================== Click ==========================
export type MenuClickEventHandler = (info: MenuInfo) => void;

export type MenuRef = {
  /**
   * Focus active child if any, or the first child which is not disabled will be focused.
   * @param options
   */
  focus: (options?: FocusOptions) => void;
  list: HTMLUListElement;
};
