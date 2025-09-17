import React, {
  forwardRef,
  Fragment,
  useContext,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react';
import { useEvent } from '@rc-component/util';
import { clsx, mergeSemanticCls } from '@util/classNameUtils';
import usePrevious from '@util/hooks/usePrevious';
import type { FlatIndexLocationWithAlign } from 'react-virtuoso';
import { ConfigContext } from '../config-provider';
import type { ScrollbarRef, ScrollValues } from '../scrollbar';
import Scrollbar from '../scrollbar';
import type { ScrollPos, VirtualListProps, VirtualListRef } from './interface';

const InternalNormalList = <D, C>(
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
    data,
    atBottomThreshold = 4,
    atTopThreshold = 4,
    followOutput,
    alignToBottom,
    firstItemIndex = 0,
    initialTopMostItemIndex = 0,
    startReached,
    endReached,
    renderItem,
    onScroll,
  } = props;

  const { getPrefixCls } = useContext(ConfigContext);
  const prefixCls = getPrefixCls('virtual-list', customizePrefixCls);

  const scrollbarRef = useRef<ScrollbarRef>(null);
  const atBottomRef = useRef<boolean>(false);

  const previousFirstItemIndex = usePrevious(firstItemIndex);

  const scrollToIndex = useEvent((location: number | FlatIndexLocationWithAlign) => {
    const viewEl = scrollbarRef.current?.view;
    if (viewEl) {
      const listItems = viewEl.children;

      if (!listItems.length) return;

      let virtualIndex: number = 0;
      let align: ScrollLogicalPosition = 'start';
      let behavior: ScrollBehavior = 'auto';
      let offset: number = 0;

      if (typeof location === 'number') {
        virtualIndex = location;
      } else {
        if (location.index === 'LAST') {
          virtualIndex = listItems.length + firstItemIndex - 1;
        } else {
          virtualIndex = location.index;
        }
        ({ align = 'start', behavior = 'auto', offset = 0 } = location);
      }

      let domIndex = virtualIndex - firstItemIndex;
      domIndex = Math.min(Math.max(0, domIndex), listItems.length - 1);

      const item = listItems[domIndex] as HTMLElement;
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
  });

  useLayoutEffect(() => {
    if (previousFirstItemIndex && previousFirstItemIndex !== firstItemIndex) {
      scrollToIndex({ index: previousFirstItemIndex });
    }
  }, [firstItemIndex]);

  // 处理 followOutput 功能
  useEffect(() => {
    if (followOutput && data?.length) {
      const scrollValues = scrollbarRef.current?.getValues();
      if (scrollValues) {
        const followOutputScalarType =
          typeof followOutput === 'function' ? followOutput(atBottomRef.current) : followOutput;

        if (followOutputScalarType && atBottomRef.current) {
          requestAnimationFrame(() => {
            scrollToIndex({ index: 'LAST', behavior: 'smooth' });
          });
        }
      }
    }
  }, [data?.length, followOutput, atBottomThreshold, firstItemIndex]);

  useLayoutEffect(() => {
    if (initialTopMostItemIndex) {
      let indexLocation = initialTopMostItemIndex as number | FlatIndexLocationWithAlign;
      if (typeof indexLocation === 'number') {
        indexLocation = indexLocation + firstItemIndex;
      } else if (typeof indexLocation.index === 'number') {
        indexLocation.index += firstItemIndex;
      }
      scrollToIndex(indexLocation);
    }
  }, []);

  const scrollTo = (location: ScrollToOptions) => {
    scrollbarRef.current?.scrollTo(location);
  };

  const isPosScroll = (arg: any): arg is ScrollPos => {
    return arg && typeof arg === 'object' && ('left' in arg || 'top' in arg);
  };

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
        scrollToIndex(arg);
        return;
      }

      if (isPosScroll(arg)) {
        scrollTo(arg);
        return;
      }

      let virtualIndex: number;
      const { align } = arg;

      if ('index' in arg) {
        ({ index: virtualIndex } = arg);
      } else {
        const arrayIndex =
          data?.findIndex((item, i) => computeItemKey(i + firstItemIndex, item) === arg.key) ?? 0;
        virtualIndex = arrayIndex + firstItemIndex;
      }

      const { offset = 0, behavior } = arg;

      scrollToIndex({
        index: virtualIndex,
        align,
        behavior,
        offset,
      });
    },
  }));

  const handleScroll = (values: ScrollValues, e: React.UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = values;

    if (scrollHeight - scrollTop <= clientHeight + atBottomThreshold) {
      endReached?.();
      atBottomRef.current = true;
    } else {
      atBottomRef.current = false;
    }

    if (scrollTop <= atTopThreshold) {
      startReached?.();
    }

    onScroll?.(values, e);
  };

  const Header = components?.Header;
  const Footer = components?.Footer;

  return (
    <Scrollbar
      prefixCls={`${prefixCls}-scrollbar`}
      ref={scrollbarRef}
      className={mergeSemanticCls(
        { view: clsx(alignToBottom && 'flex flex-col *:first:mt-auto') },
        className,
      )}
      style={style}
      autoHeight={autoHeight}
      onScroll={handleScroll}
    >
      {Header && <Header context={props.context!} />}
      {data?.map((item, arrayIndex) => {
        const virtualIndex = arrayIndex + firstItemIndex;
        return (
          <Fragment key={computeItemKey(virtualIndex, item)}>
            {renderItem?.(item, virtualIndex)}
          </Fragment>
        );
      })}
      {Footer && <Footer context={props.context!} />}
    </Scrollbar>
  );
};

const NormalList = forwardRef(InternalNormalList) as <D, C = any>(
  props: VirtualListProps<D, C> & {
    ref?: React.ForwardedRef<VirtualListRef>;
  },
) => ReturnType<typeof InternalNormalList>;

export default NormalList;
