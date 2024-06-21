import pickAttrs from 'rc-util/lib/pickAttrs';
import * as React from 'react';
import { clsx, getComplexCls } from '../_util/classNameUtils';
import type { BreadcrumbProps, ItemType } from './Breadcrumb';

type AddParameters<TFunction extends (...args: any) => any, TParameters extends [...args: any]> = (
  ...args: [...Parameters<TFunction>, ...TParameters]
) => ReturnType<TFunction>;

type ItemRender = NonNullable<BreadcrumbProps['itemRender']>;
type InternalItemRenderParams = AddParameters<ItemRender, [href?: string]>;

function getBreadcrumbName(item: ItemType, params: any) {
  if (item.title === undefined || item.title === null) {
    return null;
  }
  const paramsKeys = Object.keys(params).join('|');
  return typeof item.title === 'object'
    ? item.title
    : String(item.title).replace(
        new RegExp(`:(${paramsKeys})`, 'g'),
        (replacement, key) => params[key] || replacement,
      );
}

export function renderItem(
  prefixCls: string,
  item: ItemType,
  children: React.ReactNode,
  href?: string,
  className?: BreadcrumbProps['className'],
  isLastItem?: boolean,
) {
  if (!children && !item.icon) {
    return null;
  }

  const complexCls = getComplexCls(className);
  const { icon, className: itemClassName, onClick, ...restItem } = item;

  const passedProps = {
    ...pickAttrs(restItem, {
      data: true,
      aria: true,
    }),
    onClick,
  };

  const cls = clsx(
    `${prefixCls}-link`,
    'inline-flex h-full items-center gap-1 px-1 !text-neutral-text-secondary',
    isLastItem && '!text-neutral-text',
    complexCls.item,
    itemClassName,
  );

  let iconNode;
  if (icon) {
    iconNode = (
      <span className={clsx('inline-flex items-center text-base', complexCls.icon)}>{icon}</span>
    );
  }

  if (href !== undefined) {
    return (
      <a {...passedProps} className={clsx(cls, 'hover:!text-neutral-text')} href={href}>
        {iconNode}
        {children}
      </a>
    );
  }

  return (
    <span {...passedProps} className={cls}>
      {iconNode}
      {children}
    </span>
  );
}

export default function useItemRender(
  prefixCls: string,
  itemRender?: ItemRender,
  complexCls: BreadcrumbProps['className'],
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

    return renderItem(prefixCls, item, name, href, complexCls, isLastItem);
  };

  return mergedItemRender;
}
