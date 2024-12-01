import * as React from 'react';
import type { SemanticClassName } from '@util/classNameUtils';
import { clsx, mergeSemanticCls } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import type { AnyObject } from '@util/type';
import pickAttrs from 'rc-util/lib/pickAttrs';
import { ConfigContext } from '../config-provider';
import type { DropdownProps } from '../dropdown';
import type { BreadcrumbItemProps } from './BreadcrumbItem';
import BreadcrumbItem from './BreadcrumbItem';
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
  className?: SemanticClassName<{ icon?: string }>;
  dropdownProps?: DropdownProps;
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLSpanElement>;
}

export interface BreadcrumbProps<T extends AnyObject = AnyObject> {
  prefixCls?: string;
  params?: T;
  separator?: React.ReactNode;
  style?: React.CSSProperties;
  className?: SemanticClassName<{
    item?: BreadcrumbItemType['className'];
    separator?: string;
  }>;
  items?: BreadcrumbItemType[];
  itemRender?: (
    item: BreadcrumbItemType,
    params: T,
    items: BreadcrumbItemType[],
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
  const semanticCls = useSemanticCls(className, 'breadcrumb');

  let crumbs: React.ReactNode;

  const prefixCls = getPrefixCls('breadcrumb', customizePrefixCls);

  const mergedItemRender = useItemRender(prefixCls, semanticCls, itemRender);

  if (items && items.length > 0) {
    const paths: string[] = [];

    crumbs = items.map((item, index) => {
      const { path, key, menu, onClick, className: itemClassName, dropdownProps } = item;
      const mergedPath = getPath(params, path);

      if (mergedPath !== undefined) {
        paths.push(mergedPath);
      }

      const mergedKey = key ?? index;

      const itemProps: BreadcrumbItemProps = {};
      const isLastItem = index === items.length - 1;

      if (menu) {
        itemProps.menu = menu;
      }

      let { href } = item;
      if (paths.length && mergedPath !== undefined) {
        href = `${route.history === 'hash' ? '#/' : `${route.basename}`}${paths.join('/')}`;
      }

      const classStr = mergeSemanticCls(semanticCls.item, itemClassName)({});

      return (
        <BreadcrumbItem
          key={mergedKey}
          {...itemProps}
          {...pickAttrs(item, { data: true, aria: true })}
          className={classStr.root}
          separatorClassName={semanticCls.separator}
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

  const breadcrumbClassName = clsx(prefixCls, 'text-md text-text-secondary', semanticCls.root);

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
