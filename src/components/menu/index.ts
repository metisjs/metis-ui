import type { MenuProps } from './Menu';
import Menu from './Menu';
import MenuDivider from './MenuDivider';
import type { MenuItemProps } from './MenuItem';
import MenuItem from './MenuItem';
import type { MenuItemGroupProps } from './MenuItemGroup';
import MenuItemGroup from './MenuItemGroup';
import type { SubMenuProps } from './SubMenu';
import SubMenu from './SubMenu';
import { useFullPath } from './context/PathContext';
import type { MenuRef } from './interface';

export {
  MenuDivider as Divider,
  MenuItem as Item,
  MenuItemGroup as ItemGroup,
  MenuItem,
  MenuItemGroup,
  SubMenu,
  /** @private Only used for antd internal. Do not use in your production. */
  useFullPath,
};

export type { MenuItemGroupProps, MenuItemProps, MenuProps, MenuRef, SubMenuProps };

type MenuType = typeof Menu & {
  Item: typeof MenuItem;
  SubMenu: typeof SubMenu;
  ItemGroup: typeof MenuItemGroup;
  Divider: typeof MenuDivider;
};

const ExportMenu = Menu as MenuType;

ExportMenu.Item = MenuItem;
ExportMenu.SubMenu = SubMenu;
ExportMenu.ItemGroup = MenuItemGroup;
ExportMenu.Divider = MenuDivider;

export default ExportMenu;
