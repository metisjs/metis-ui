import * as React from 'react';
import type { SemanticRecord } from '@util/classNameUtils';
import { clsx, mergeSemanticCls } from '@util/classNameUtils';
import pickAttrs from 'rc-util/es/pickAttrs';
import type { BreadcrumbItemType, BreadcrumbProps } from './Breadcrumb';

type AddParameters<TFunction extends (...args: any) => any, TParameters extends [...args: any]> = (
  ...args: [...Parameters<TFunction>, ...TParameters]
) => ReturnType<TFunction>;

type ItemRender = NonNullable<BreadcrumbProps['itemRender']>;
type InternalItemRenderParams = AddParameters<ItemRender, [href?: string]>;

function getBreadcrumbName(item: BreadcrumbItemType, params: any) {
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
  item: BreadcrumbItemType,
  children: React.ReactNode,
  href?: string,
  className?: SemanticRecord<BreadcrumbProps['className']>,
  isLastItem?: boolean,
) {
  if (!children && !item.icon) {
    return null;
  }

  const { icon, className: itemClassName, onClick, ...restItem } = item;

  const semanticCls = mergeSemanticCls(className?.item, itemClassName)({});

  const passedProps = {
    ...pickAttrs(restItem, {
      data: true,
      aria: true,
    }),
    onClick,
  };

  const cls = clsx(
    `${prefixCls}-link`,
    'inline-flex h-full items-center gap-1 px-1 text-text-secondary',
    isLastItem && 'text-text',
    semanticCls.root,
  );

  let iconNode;
  if (icon) {
    iconNode = (
      <span className={clsx('inline-flex items-center text-base', semanticCls.icon)}>{icon}</span>
    );
  }

  if (href !== undefined) {
    return (
      <a {...passedProps} className={clsx(cls, 'hover:text-text')} href={href}>
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
  semanticCls: SemanticRecord<BreadcrumbProps['className']>,
  itemRender?: ItemRender,
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

    return renderItem(prefixCls, item, name, href, semanticCls, isLastItem);
  };

  return mergedItemRender;
}
