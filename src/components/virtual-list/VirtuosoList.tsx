import React, { forwardRef, useContext, useImperativeHandle, useMemo, useRef } from 'react';
import { useEvent } from '@rc-component/util';
import omit from '@rc-component/util/es/omit';
import { clsxDependency } from '@util/hooks/useSemanticCls';
import type { VirtuosoHandle } from 'react-virtuoso';
import { Virtuoso } from 'react-virtuoso';
import { ConfigContext } from '../config-provider';
import type { ScrollbarRef, ScrollValues } from '../scrollbar';
import { VirtualListContext } from './context';
import type { ScrollPos, VirtualListProps, VirtualListRef } from './interface';
import Scroller from './Scroller';

const InternalVirtuosoList = <D, C>(
  props: VirtualListProps<D, C>,
  ref: React.ForwardedRef<VirtualListRef>,
) => {
  const {
    prefixCls: customizePrefixCls,
    components,
    style,
    className,
    itemKey,
    data,
    atBottomThreshold = 4,
    atTopThreshold = 4,
    startReached,
    endReached,
    renderItem,
    onScroll,
    ...restProps
  } = omit(props, ['virtual', 'autoHeight']);

  const { getPrefixCls } = useContext(ConfigContext);
  const prefixCls = getPrefixCls('virtual-list', customizePrefixCls);

  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const scrollbarRef = useRef<ScrollbarRef>(null);

  const isPosScroll = (arg: any): arg is ScrollPos => {
    return arg && typeof arg === 'object' && ('left' in arg || 'top' in arg);
  };

  const itemContent = useEvent((index: number, data: D, context: C) =>
    renderItem?.(data, index, context),
  );

  const computeItemKey = useEvent((index: number, item: D, context?: C) => {
    if (typeof itemKey === 'function') {
      return itemKey(item, index, context);
    }

    return item[itemKey as keyof typeof item] as React.Key;
  });

  useImperativeHandle(ref, () => ({
    nativeElement: scrollbarRef.current!.view!,
    getScrollValues: () => scrollbarRef.current!.getValues(),
    scrollTo: (arg) => {
      if (!arg) return;

      if (typeof arg === 'number') {
        virtuosoRef.current?.scrollToIndex(arg);
        return;
      }

      if (isPosScroll(arg)) {
        virtuosoRef.current?.scrollTo(arg);
        return;
      }

      let index: number;
      const { align } = arg;

      if ('index' in arg) {
        ({ index } = arg);
      } else {
        index = data?.findIndex((item, i) => computeItemKey(i, item) === arg.key) ?? 0;
      }

      const { offset = 0, behavior } = arg;

      virtuosoRef.current?.scrollToIndex({
        index,
        align,
        behavior,
        offset,
      });
    },
  }));

  const handleScroll = useEvent((values: ScrollValues, e: React.UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = values;

    if (scrollHeight - scrollTop <= clientHeight + atBottomThreshold) {
      endReached?.();
    }

    if (scrollTop <= atTopThreshold) {
      startReached?.();
    }

    onScroll?.(values, e);
  });

  const contextValue = useMemo(
    () => ({ prefixCls, onScroll: handleScroll, className, style, scrollbar: scrollbarRef }),
    [prefixCls, clsxDependency(className), JSON.stringify(style), handleScroll],
  );

  return (
    <VirtualListContext.Provider value={contextValue}>
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
    </VirtualListContext.Provider>
  );
};

const VirtuosoList = forwardRef(InternalVirtuosoList) as <D, C = any>(
  props: VirtualListProps<D, C> & {
    ref?: React.ForwardedRef<VirtualListRef>;
  },
) => ReturnType<typeof InternalVirtuosoList>;

export default VirtuosoList;
