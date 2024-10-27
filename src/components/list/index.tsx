import * as React from 'react';
import type { SemanticClassName } from '../_util/classNameUtils';
import { clsx, getSemanticCls, mergeSemanticCls } from '../_util/classNameUtils';
import useSemanticCls from '../_util/hooks/useSemanticCls';
import type { GetRequestType } from '../_util/type';
import { ConfigContext } from '../config-provider';
import DefaultRenderEmpty from '../config-provider/defaultRenderEmpty';
import type { ScrollbarRef, ScrollValues } from '../scrollbar';
import Scrollbar from '../scrollbar';
import type { SpinProps } from '../spin';
import Spin from '../spin';
import { ListContext } from './context';
import type { ListItemProps } from './Item';
import Item from './Item';
import useRequest from './useRequest';

export type { ListConsumerProps } from './context';
export type { ListItemMetaProps, ListItemProps } from './Item';

export type LazyLoadType =
  | boolean
  | {
      pageSize?: number;
    };

export interface ListProps<T, R extends LazyLoadType = false> {
  bordered?: boolean;
  className?: SemanticClassName<
    'items' | 'header' | 'footer' | 'scrollView',
    void,
    { item?: ListItemProps['className'] }
  >;
  style?: React.CSSProperties;
  dataSource?: T[];
  id?: string;
  loading?: boolean | SpinProps;
  prefixCls?: string;
  rowKey?: ((item: T) => React.Key) | keyof T;
  renderItem?: (item: T, index: number) => React.ReactNode;
  split?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  locale?: ListLocale;
  onScroll?: (values: ScrollValues, ev: React.UIEvent<HTMLElement>) => void;

  // >>> Request
  lazyLoad?: R;
  request?: GetRequestType<T, false, R extends false ? false : true>;
}

export interface ListLocale {
  emptyText?: React.ReactNode;
  noMoreText?: React.ReactNode;
}

function InternalList<T>(
  {
    prefixCls: customizePrefixCls,
    bordered = false,
    split = true,
    className,
    style,
    dataSource = [],
    header,
    footer,
    loading = false,
    rowKey,
    renderItem,
    locale,
    request,
    lazyLoad,
    onScroll,
    ...rest
  }: ListProps<T>,
  ref: React.ForwardedRef<ScrollbarRef>,
) {
  const { getPrefixCls, renderEmpty } = React.useContext(ConfigContext);
  const semanticCls = useSemanticCls(className, 'list');

  const {
    dataSource: requestDataSource,
    loading: requestLoading,
    onScroll: onInternalScroll,
    loadingMore,
    noMore,
  } = useRequest<T>(request, lazyLoad, onScroll);

  const mergedDataSource = request ? requestDataSource : dataSource;

  const renderInnerItem = (item: T, index: number) => {
    if (!renderItem) return null;

    let key: any;

    if (typeof rowKey === 'function') {
      key = rowKey(item);
    } else if (rowKey) {
      key = item[rowKey];
    } else {
      key = (item as any).key;
    }

    if (!key) {
      key = `list-item-${index}`;
    }

    return <React.Fragment key={key}>{renderItem(item, index)}</React.Fragment>;
  };

  const prefixCls = getPrefixCls('list', customizePrefixCls);

  let loadingProp = loading;
  if (typeof loadingProp === 'boolean') {
    loadingProp = {
      spinning: loadingProp,
    };
  }
  loadingProp.spinning = loadingProp.spinning ?? requestLoading;
  loadingProp.className = mergeSemanticCls(
    { wrapper: 'flex-1 h-0', indicator: 'h-full' },
    loadingProp.className,
  );

  const isLoading = !!loadingProp?.spinning;

  const rootCls = clsx(
    prefixCls,
    {
      [`${prefixCls}-split`]: split,
      [`${prefixCls}-bordered`]: bordered,
      [`${prefixCls}-loading`]: isLoading,
    },
    'relative flex flex-col rounded-lg text-sm text-text',
    {
      'border border-border': bordered,
    },
    semanticCls.root,
  );

  const itemsCls = clsx(
    `${prefixCls}-items`,
    {
      'divide-y divide-border-tertiary': split,
      'divide-border-secondary': split && bordered,
    },
    semanticCls.items,
  );

  const headerCls = clsx(
    `${prefixCls}-header`,
    'border-b border-border-secondary py-5',
    {
      'px-6': bordered,
    },
    semanticCls.header,
  );

  const footerCls = clsx(
    `${prefixCls}-footer`,
    'border-t border-border-secondary py-5',
    { 'px-6': bordered },
    semanticCls.footer,
  );

  let childrenContent: React.ReactNode = isLoading && <div style={{ minHeight: 53 }} />;
  if (mergedDataSource.length > 0) {
    const items = mergedDataSource.map((item: T, index: number) => renderInnerItem(item, index));
    childrenContent = (
      <Scrollbar
        prefixCls={`${prefixCls}-scrollbar`}
        component="ul"
        ref={ref}
        className={{ view: itemsCls }}
        onScroll={onInternalScroll}
      >
        {items}
        {loadingMore && (
          <li className="flex items-center justify-center py-5">
            <Spin />
          </li>
        )}
        {noMore && locale?.noMoreText && (
          <li className="flex items-center justify-center py-5 text-text-tertiary">
            {locale.noMoreText}
          </li>
        )}
      </Scrollbar>
    );
  } else if (!isLoading) {
    childrenContent = (
      <div className={`${prefixCls}-empty-text`}>
        {locale?.emptyText || renderEmpty?.('List') || <DefaultRenderEmpty componentName="List" />}
      </div>
    );
  }

  const contextValue = React.useMemo(
    () => ({
      bordered,
      itemClassName: semanticCls.item,
      metaClassName: getSemanticCls(semanticCls.item).meta,
    }),
    [bordered, JSON.stringify(className)],
  );

  return (
    <ListContext.Provider value={contextValue}>
      <div style={style} className={rootCls} {...rest}>
        {header && <div className={headerCls}>{header}</div>}
        <Spin {...loadingProp}>{childrenContent}</Spin>
        {footer && <div className={footerCls}>{footer}</div>}
      </div>
    </ListContext.Provider>
  );
}

const ListWithForwardRef = React.forwardRef(InternalList) as (<T, R extends LazyLoadType = false>(
  props: ListProps<T, R> & {
    ref?: React.ForwardedRef<ScrollbarRef>;
  },
) => ReturnType<typeof InternalList>) &
  Pick<React.FC, 'displayName'>;

if (process.env.NODE_ENV !== 'production') {
  ListWithForwardRef.displayName = 'List';
}

type CompoundedComponent = typeof ListWithForwardRef & {
  Item: typeof Item;
};

const List = ListWithForwardRef as CompoundedComponent;

List.Item = Item;

export default List;
