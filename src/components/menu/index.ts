import type { MenuProps } from './Menu';
import InternalMenu from './Menu';
import type { MenuDividerProps } from './MenuDivider';
import MenuDivider from './MenuDivider';
import type { MenuItemProps } from './MenuItem';
import MenuItem from './MenuItem';
import type { MenuItemGroupProps } from './MenuItemGroup';
import MenuItemGroup from './MenuItemGroup';
import type { SubMenuProps } from './SubMenu';
import SubMenu from './SubMenu';
import type { MenuTheme } from './context/MenuContext';
import type { ItemType, MenuItemType, MenuRef } from './interface';

export type {
  MenuDividerProps,
  MenuItemGroupProps,
  MenuItemProps,
  MenuProps,
  MenuRef,
  MenuTheme,
  SubMenuProps,
};

type ComponentProps = MenuProps & React.RefAttributes<MenuRef>;

type GenericItemType<T = unknown> = T extends infer U extends MenuItemType
  ? unknown extends U
    ? ItemType
    : ItemType<U>
  : ItemType;

type GenericComponentProps<T = unknown> = Omit<ComponentProps, 'items'> & {
  items?: GenericItemType<T>[];
};

type CompoundedComponent = React.ForwardRefExoticComponent<GenericComponentProps> & {
  Item: typeof MenuItem;
  SubMenu: typeof SubMenu;
  Divider: typeof MenuDivider;
  ItemGroup: typeof MenuItemGroup;
};

interface GenericComponent extends Omit<CompoundedComponent, ''> {
  <T extends MenuItemType>(props: GenericComponentProps<T>): ReturnType<CompoundedComponent>;
}

const Menu = InternalMenu as GenericComponent;

Menu.Item = MenuItem;
Menu.SubMenu = SubMenu;
Menu.Divider = MenuDivider;
Menu.ItemGroup = MenuItemGroup;

if (process.env.NODE_ENV !== 'production') {
  Menu.displayName = 'Menu';
}

export default Menu;
