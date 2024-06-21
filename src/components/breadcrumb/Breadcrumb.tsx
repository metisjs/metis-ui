import pickAttrs from 'rc-util/lib/pickAttrs';
import * as React from 'react';
import { ComplexClassName, clsx, getComplexCls } from '../_util/classNameUtils';
import type { AnyObject } from '../_util/type';
import { ConfigContext } from '../config-provider';
import type { DropdownProps } from '../dropdown';
import type { BreadcrumbItemProps } from './BreadcrumbItem';
import BreadcrumbItem from './BreadcrumbItem';
import BreadcrumbSeparator from './BreadcrumbSeparator';
import useItemRender from './useItemRender';

export interface BreadcrumbItemType {
  key?: React.Key;
  /**
   * Different with `path`. Directly set the link of this item.
   */
  href?: string;
  /**
   * Different with `href`. It will concat all prev `path` to the current one.
   */
  path?: string;
  title?: React.ReactNode;
  icon?: React.ReactNode;
  menu?: BreadcrumbItemProps['menu'];
  className?: string;
  dropdownProps?: DropdownProps;
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLSpanElement>;
}

export interface BreadcrumbSeparatorType {
  type: 'separator';
  separator?: React.ReactNode;
}

export type ItemType = Partial<BreadcrumbItemType & BreadcrumbSeparatorType>;

export interface BreadcrumbProps<T extends AnyObject = AnyObject> {
  prefixCls?: string;
  params?: T;
  separator?: React.ReactNode;
  style?: React.CSSProperties;
  className?: ComplexClassName<'item' | 'separator' | 'icon'>;
  items?: ItemType[];
  itemRender?: (
    item: ItemType,
    params: T,
    items: ItemType[],
    paths: string[],
    isLastItem: boolean,
  ) => React.ReactNode;
}

const getPath = <T extends AnyObject = AnyObject>(params: T, path?: string) => {
  if (path === undefined) {
    return path;
  }
  let mergedPath = (path || '').replace(/^\//, '');
  Object.keys(params).forEach((key) => {
    mergedPath = mergedPath.replace(`:${key}`, params[key]!);
  });
  return mergedPath;
};

const Breadcrumb = <T extends AnyObject = AnyObject>(props: BreadcrumbProps<T>) => {
  const {
    prefixCls: customizePrefixCls,
    separator = '/',
    style,
    className,
    items,
    itemRender,
    params = {},
    ...restProps
  } = props;

  const { getPrefixCls, route } = React.useContext(ConfigContext);
  const complexCls = getComplexCls(className);

  let crumbs: React.ReactNode;

  const prefixCls = getPrefixCls('breadcrumb', customizePrefixCls);

  const mergedItemRender = useItemRender(prefixCls, itemRender, complexCls);

  if (items && items.length > 0) {
    const paths: string[] = [];

    crumbs = items.map((item, index) => {
      const {
        path,
        key,
        type,
        menu,
        onClick,
        className: itemClassName,
        separator: itemSeparator,
        dropdownProps,
      } = item;
      const mergedPath = getPath(params, path);

      if (mergedPath !== undefined) {
        paths.push(mergedPath);
      }

      const mergedKey = key ?? index;

      if (type === 'separator') {
        return (
          <BreadcrumbSeparator
            key={mergedKey}
            prefixCls={prefixCls}
            className={complexCls.separator}
          >
            {itemSeparator}
          </BreadcrumbSeparator>
        );
      }

      const itemProps: BreadcrumbItemProps = {};
      const isLastItem = index === items.length - 1;

      if (menu) {
        itemProps.menu = menu;
      }

      let { href } = item;
      if (paths.length && mergedPath !== undefined) {
        href = `${route.history === 'hash' ? '#/' : `${route.basename}`}${paths.join('/')}`;
      }

      return (
        <BreadcrumbItem
          key={mergedKey}
          {...itemProps}
          {...pickAttrs(item, { data: true, aria: true })}
          className={itemClassName}
          dropdownProps={dropdownProps}
          href={href}
          separator={isLastItem ? '' : separator}
          onClick={onClick}
          prefixCls={prefixCls}
        >
          {mergedItemRender(item, params, items, paths, isLastItem, href)}
        </BreadcrumbItem>
      );
    });
  }

  const breadcrumbClassName = clsx(
    prefixCls,
    'text-md text-neutral-text-secondary',
    complexCls.root,
  );

  return (
    <nav className={breadcrumbClassName} style={style} {...restProps}>
      <ol className={clsx('flex flex-wrap')}>{crumbs}</ol>
    </nav>
  );
};

if (process.env.NODE_ENV !== 'production') {
  Breadcrumb.displayName = 'Breadcrumb';
}

export default Breadcrumb;
