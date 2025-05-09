import * as React from 'react';
import { ChevronDownOutline } from '@metisjs/icons';
import { clsx } from '@util/classNameUtils';
import type { SafeKey } from '@util/type';
import type { DropdownProps } from '../dropdown/Dropdown';
import Dropdown from '../dropdown/Dropdown';
import BreadcrumbSeparator from './BreadcrumbSeparator';

export interface SeparatorType {
  separator?: React.ReactNode;
  key?: React.Key;
}

type MenuType = NonNullable<DropdownProps['menu']>;
interface MenuItem {
  key?: SafeKey;
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
  separatorClassName?: string;
  children?: React.ReactNode;
}

const BreadcrumbItem: React.FC<BreadcrumbItemProps> = (props) => {
  const {
    prefixCls,
    separator = '/',
    children,
    menu,
    dropdownProps,
    href,
    className,
    separatorClassName,
  } = props;

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
            label: mergedLabel,
          };
        }),
      };

      return (
        <Dropdown placement="bottom" {...mergeDropDownProps}>
          <span className={clsx(`${prefixCls}-overlay-link`, 'hover:text-text')}>
            {breadcrumbItem}
            <ChevronDownOutline className="size-4" />
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
        <li className={className}>{link}</li>
        {separator && (
          <BreadcrumbSeparator prefixCls={prefixCls} className={separatorClassName}>
            {separator}
          </BreadcrumbSeparator>
        )}
      </>
    );
  }
  return null;
};

export default BreadcrumbItem;
