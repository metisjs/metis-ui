import React, {
  forwardRef,
  Fragment,
  useContext,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { useEvent } from 'rc-util';
import type { FlatIndexLocationWithAlign, VirtuosoHandle } from 'react-virtuoso';
import { Virtuoso, type VirtuosoProps } from 'react-virtuoso';
import { ConfigContext } from '../config-provider';
import type { ScrollbarProps, ScrollbarRef } from '../scrollbar';
import Scrollbar from '../scrollbar';
import { VirtualListContext } from './context';
import Scroller from './Scroller';

export interface VirtualListProps<D, C>
  extends Omit<VirtuosoProps<D, C>, 'className' | 'itemContent' | 'onScroll' | 'computeItemKey'> {
  prefixCls?: string;
  virtual?: boolean;
  autoHeight?: ScrollbarProps['autoHeight'];
  className?: ScrollbarProps['className'];
  itemKey: string | ((item: D, index: number, context?: C) => React.Key);
  renderItem?: (data: D, index: number, context?: C) => React.ReactNode;
  onScroll?: ScrollbarProps['onScroll'];
}

export type VirtualListRef = Pick<VirtuosoHandle, 'scrollToIndex' | 'scrollTo'>;

export type VirtualType =
  | boolean
  | Omit<
      VirtualListProps<any, any>,
      'prefixCls' | 'data' | 'renderItem' | 'className' | 'style' | 'onScroll'
    >;

const InternalVirtualList = <D, C>(
  props: VirtualListProps<D, C>,
  ref: React.ForwardedRef<VirtualListRef>,
) => {
  const {
    prefixCls: customizePrefixCls,
    components,
    style,
    className,
    autoHeight,
    itemKey,
    virtual = true,
    data,
    renderItem,
    onScroll,
    ...restProps
  } = props;

  const { getPrefixCls } = useContext(ConfigContext);
  const prefixCls = getPrefixCls('virtual-list', customizePrefixCls);

  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const scrollbarRef = useRef<ScrollbarRef>(null);

  useImperativeHandle(
    ref,
    () => ({
      scrollToIndex: (location: number | FlatIndexLocationWithAlign) => {
        if (virtual) {
          virtuosoRef.current?.scrollToIndex(location);
        } else {
          const viewEl = scrollbarRef.current?.view;
          if (viewEl) {
            const listItems = viewEl.children;

            let index: number = 0;
            let align: ScrollLogicalPosition = 'start';
            let behavior: ScrollBehavior = 'auto';
            let offset: number = 0;

            if (typeof location === 'number') {
              index = location;
            } else {
              if (location.index === 'LAST') {
                index = listItems.length - 1;
              } else {
                index = location.index;
              }
              ({ align = 'start', behavior = 'auto', offset = 0 } = location);
            }

            // 检查索引是否有效
            if (index < 0 || index >= listItems.length) return;

            const item = listItems[index] as HTMLElement;
            // 计算目标元素相对于 ul 的偏移
            const itemTop = item.offsetTop;
            const itemHeight = item.offsetHeight;
            const listHeight = viewEl.offsetHeight;

            // 根据 align 计算滚动位置
            let scrollPosition = 0;
            if (align === 'start') {
              scrollPosition = itemTop;
            } else if (align === 'center') {
              scrollPosition = itemTop - listHeight / 2 + itemHeight / 2;
            } else if (align === 'end') {
              scrollPosition = itemTop - listHeight + itemHeight;
            }

            // 应用偏移量
            scrollPosition += offset;

            // 执行滚动
            viewEl.scrollTo({
              top: scrollPosition,
              behavior: behavior,
            });
          }
        }
      },
      scrollTo: (location: ScrollToOptions) => {
        if (virtual) {
          virtuosoRef.current?.scrollTo(location);
        } else {
          scrollbarRef.current?.scrollTo(location);
        }
      },
    }),
    [],
  );

  const itemContent = useEvent((index: number, data: D, context: C) =>
    renderItem?.(data, index, context),
  );

  const computeItemKey = useEvent((index: number, item: D, context?: C) => {
    if (typeof itemKey === 'function') {
      return itemKey(item, index, context);
    }

    return item[itemKey as keyof typeof item] as React.Key;
  });

  const contextValue = useMemo(
    () => ({ prefixCls, autoHeight, onScroll, className, style }),
    [
      prefixCls,
      JSON.stringify(autoHeight),
      JSON.stringify(className),
      JSON.stringify(style),
      onScroll,
    ],
  );

  const Header = components?.Header;
  const Footer = components?.Footer;

  return (
    <VirtualListContext.Provider value={contextValue}>
      {virtual ? (
        <Virtuoso<D, C>
          ref={virtuosoRef}
          data={data}
          {...restProps}
          itemContent={itemContent}
          computeItemKey={computeItemKey}
          components={{
            Scroller,
            ...components,
          }}
        />
      ) : (
        <Scrollbar
          prefixCls={`${prefixCls}-scrollbar`}
          ref={scrollbarRef}
          className={className}
          style={style}
          autoHeight={autoHeight}
          onScroll={onScroll}
        >
          {Header && <Header context={props.context} />}
          {data?.map((item, i) => (
            <Fragment key={computeItemKey(i, item)}>{renderItem?.(item, i)}</Fragment>
          ))}
          {Footer && <Footer context={props.context} />}
        </Scrollbar>
      )}
    </VirtualListContext.Provider>
  );
};

const VirtualList = forwardRef(InternalVirtualList) as (<D, C>(
  props: VirtualListProps<D, C> & {
    ref?: React.ForwardedRef<VirtualListRef>;
  },
) => ReturnType<typeof InternalVirtualList>) &
  Pick<React.FC, 'displayName'>;

if (process.env.NODE_ENV !== 'production') {
  VirtualList.displayName = 'VirtualList';
}

export default VirtualList;
