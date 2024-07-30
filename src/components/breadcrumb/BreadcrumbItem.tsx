import { ChevronDownOutline } from '@metisjs/icons';
import * as React from 'react';
import type { DropdownProps } from '../dropdown/Dropdown';
import Dropdown from '../dropdown/Dropdown';
import BreadcrumbSeparator from './BreadcrumbSeparator';

export interface SeparatorType {
  separator?: React.ReactNode;
  key?: React.Key;
}

type MenuType = NonNullable<DropdownProps['menu']>;
interface MenuItem {
  key?: React.Key;
  title?: React.ReactNode;
  label?: React.ReactNode;
  path?: string;
  href?: string;
}

export interface BreadcrumbItemProps extends SeparatorType {
  prefixCls?: string;
  href?: string;
  menu?: Omit<MenuType, 'items'> & {
    items: MenuItem[];
  };
  dropdownProps?: DropdownProps;
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLSpanElement>;
  className?: string;
  children?: React.ReactNode;
}

const BreadcrumbItem: React.FC<BreadcrumbItemProps> = (props) => {
  const { prefixCls, separator = '/', children, menu, dropdownProps, href } = props;

  const renderBreadcrumbNode = (breadcrumbItem: React.ReactNode) => {
    if (menu) {
      const mergeDropDownProps: DropdownProps = {
        ...dropdownProps,
      };

      const { items, ...menuProps } = menu || {};
      mergeDropDownProps.menu = {
        ...menuProps,
        items: items.map(({ key, title, label, path, href: menuHref }, index) => {
          let mergedLabel: React.ReactNode = label ?? title;

          if (path || menuHref) {
            mergedLabel = <a href={path ? `${href}${path}` : menuHref}>{mergedLabel}</a>;
          }

          return {
            key: key ?? index,
            label: mergedLabel as string,
          };
        }),
      };

      return (
        <Dropdown placement="bottom" {...mergeDropDownProps}>
          <span className={`${prefixCls}-overlay-link hover:text-text`}>
            {breadcrumbItem}
            <ChevronDownOutline className="h-4 w-4" />
          </span>
        </Dropdown>
      );
    }
    return breadcrumbItem;
  };

  // wrap to dropDown
  const link = renderBreadcrumbNode(children);
  if (link !== undefined && link !== null) {
    return (
      <>
        <li>{link}</li>
        {separator && <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>}
      </>
    );
  }
  return null;
};

export default BreadcrumbItem;
