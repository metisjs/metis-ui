import pickAttrs from 'rc-util/lib/pickAttrs';
import * as React from 'react';
import { clsx } from '../_util/classNameUtils';
import type { BreadcrumbProps, InternalRouteType, ItemType } from './Breadcrumb';

type AddParameters<TFunction extends (...args: any) => any, TParameters extends [...args: any]> = (
  ...args: [...Parameters<TFunction>, ...TParameters]
) => ReturnType<TFunction>;

type ItemRender = NonNullable<BreadcrumbProps['itemRender']>;
type InternalItemRenderParams = AddParameters<ItemRender, [href?: string]>;

function getBreadcrumbName(route: InternalRouteType, params: any) {
  if (route.title === undefined || route.title === null) {
    return null;
  }
  const paramsKeys = Object.keys(params).join('|');
  return typeof route.title === 'object'
    ? route.title
    : String(route.title).replace(
        new RegExp(`:(${paramsKeys})`, 'g'),
        (replacement, key) => params[key] || replacement,
      );
}

export function renderItem(
  prefixCls: string,
  item: ItemType,
  children: React.ReactNode,
  href?: string,
  itemClassName?: string,
  isLastItem?: boolean,
) {
  if (children === null || children === undefined) {
    return null;
  }

  const { className, onClick, ...restItem } = item;

  const passedProps = {
    ...pickAttrs(restItem, {
      data: true,
      aria: true,
    }),
    onClick,
  };

  const cls = clsx(
    `${prefixCls}-link`,
    'px-1 !text-neutral-text-secondary',
    isLastItem && '!text-neutral-text',
    itemClassName,
    className,
  );

  if (href !== undefined) {
    return (
      <a {...passedProps} className={clsx(cls, 'hover:!text-neutral-text')} href={href}>
        {children}
      </a>
    );
  }

  return (
    <span {...passedProps} className={cls}>
      {children}
    </span>
  );
}

export default function useItemRender(
  prefixCls: string,
  itemRender?: ItemRender,
  itemClassName?: string,
) {
  const mergedItemRender: InternalItemRenderParams = (
    item,
    params,
    items,
    path,
    isLastItem,
    href,
  ) => {
    if (itemRender) {
      return itemRender(item, params, items, path, isLastItem);
    }

    const name = getBreadcrumbName(item, params);

    return renderItem(prefixCls, item, name, href, itemClassName, isLastItem);
  };

  return mergedItemRender;
}
