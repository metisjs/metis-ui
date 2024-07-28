/* eslint-disable @typescript-eslint/no-use-before-define */
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import * as React from 'react';
import { useRef, useState } from 'react';
import { mergeSemanticCls, SemanticClassName } from '../_util/classNameUtils';
import { ConfigContext } from '../config-provider';
import Scrollbar, { ScrollbarProps, ScrollbarRef, ScrollValues } from '../scrollbar';
import type { InnerProps } from './Filler';
import Filler from './Filler';
import useChildren from './hooks/useChildren';
import { useGetSize } from './hooks/useGetSize';
import useHeights from './hooks/useHeights';
import type { ScrollPos, ScrollTarget } from './hooks/useScrollTo';
import useScrollTo from './hooks/useScrollTo';
import type { ExtraRenderInfo, GetKey, RenderFunc, SharedConfig } from './interface';

export type ScrollConfig = ScrollTarget | ScrollPos;

export type ScrollTo = (arg: number | ScrollConfig) => void;

export type VirtualListRef = {
  scrollTo: ScrollTo;
  getScrollInfo: () => ScrollValues;
};

export interface VirtualListProps<T>
  extends Omit<React.HTMLAttributes<any>, 'children' | 'className' | 'onScroll'> {
  prefixCls?: string;
  className?: SemanticClassName<'view'>;
  children: RenderFunc<T>;
  data: T[];
  height?: number;
  itemHeight?: number;
  /** If not match virtual scroll condition, Set List still use height of container. */
  fullHeight?: boolean;
  itemKey: keyof T | ((item: T) => React.Key);
  /** Set `false` will always use real scroll instead of virtual one */
  virtual?: boolean;
  /**
   * By default `scrollWidth` is same as container.
   * When set this, it will show the horizontal scrollbar and
   * `scrollWidth` will be used as the real width instead of container width.
   * When set, `virtual` will always be enabled.
   */
  scrollWidth?: number;

  onScroll?: ScrollbarProps['onScroll'];

  /** Trigger when render list item changed */
  onVisibleChange?: (visibleList: T[], fullList: T[]) => void;

  /** Inject to inner container props. Only use when you need pass aria related data */
  innerProps?: InnerProps;

  /** Render extra content into Filler */
  extraRender?: (info: ExtraRenderInfo) => React.ReactNode;
}

export function RawVirtualList<T>(props: VirtualListProps<T>, ref: React.Ref<VirtualListRef>) {
  const {
    prefixCls: customizePrefixCls,
    className,
    height,
    itemHeight,
    fullHeight = true,
    style,
    data,
    children,
    itemKey,
    virtual,
    scrollWidth,
    onScroll,
    onVisibleChange,
    innerProps,
    extraRender,
    ...restProps
  } = props;

  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('virtual-list', customizePrefixCls);

  // =============================== Item Key ===============================
  const getKey = React.useCallback<GetKey<T>>(
    (item: T) => {
      if (typeof itemKey === 'function') {
        return itemKey(item);
      }
      return item[itemKey] as React.Key;
    },
    [itemKey],
  );

  // ================================ Height ================================
  const [setInstanceRef, collectHeight, heights, heightUpdatedMark] = useHeights(getKey);

  // ================================= MISC =================================
  const useVirtual = !!(virtual !== false && height && itemHeight);
  const containerHeight = React.useMemo(
    () => Object.values(heights.maps).reduce((total, curr) => total + curr, 0),
    [heights.id, heights.maps],
  );
  const inVirtual =
    useVirtual &&
    data &&
    (Math.max(itemHeight * data.length, containerHeight) > height || !!scrollWidth);

  const mergedData = data || [];
  const scrollbarRef = useRef<ScrollbarRef>(null);
  const fillerInnerRef = useRef<HTMLDivElement>(null);

  const [offsetTop, setOffsetTop] = useState(0);
  const [offsetLeft, setOffsetLeft] = useState(0);

  const sharedConfig: SharedConfig<T> = {
    getKey,
  };

  // ================================ Scroll ================================
  const syncScrollTop = (newTop: number) => {
    setOffsetTop(() => {
      scrollbarRef.current?.scrollTop(newTop);
      return scrollbarRef.current?.getScrollTop() || 0;
    });
  };

  const syncScrollLeft = (newLeft: number) => {
    setOffsetLeft(() => {
      scrollbarRef.current?.scrollLeft(newLeft);
      return scrollbarRef.current?.getScrollLeft() || 0;
    });
  };

  const onInternalScroll = (values: ScrollValues) => {
    setOffsetTop(values.scrollTop);
    setOffsetLeft(values.scrollLeft);

    onScroll?.(values);
  };

  // ========================== Visible Calculation =========================
  const {
    scrollHeight,
    start,
    end,
    offset: fillerOffset,
  } = React.useMemo(() => {
    if (!useVirtual) {
      return {
        scrollHeight: undefined,
        start: 0,
        end: mergedData.length - 1,
        offset: undefined,
      };
    }

    // Always use virtual scroll bar in avoid shaking
    if (!inVirtual) {
      return {
        scrollHeight: fillerInnerRef.current?.offsetHeight || 0,
        start: 0,
        end: mergedData.length - 1,
        offset: undefined,
      };
    }

    let itemTop = 0;
    let startIndex: number | undefined = undefined;
    let startOffset: number | undefined = undefined;
    let endIndex: number | undefined = undefined;

    const dataLen = mergedData.length;
    for (let i = 0; i < dataLen; i += 1) {
      const item = mergedData[i];
      const key = getKey(item);

      const cacheHeight = heights.get(key);
      const currentItemBottom = itemTop + (cacheHeight === undefined ? itemHeight : cacheHeight);

      // Check item top in the range
      if (currentItemBottom >= offsetTop && startIndex === undefined) {
        startIndex = i;
        startOffset = itemTop;
      }

      // Check item bottom in the range. We will render additional one item for motion usage
      if (currentItemBottom > offsetTop + height && endIndex === undefined) {
        endIndex = i;
      }

      itemTop = currentItemBottom;
    }

    // When scrollTop at the end but data cut to small count will reach this
    if (startIndex === undefined) {
      startIndex = 0;
      startOffset = 0;

      endIndex = Math.ceil(height / itemHeight);
    }
    if (endIndex === undefined) {
      endIndex = mergedData.length - 1;
    }

    // Give cache to improve scroll experience
    endIndex = Math.min(endIndex + 1, mergedData.length - 1);

    return {
      scrollHeight: itemTop,
      start: startIndex,
      end: endIndex,
      offset: startOffset,
    };
  }, [inVirtual, useVirtual, offsetTop, mergedData, heightUpdatedMark, height]);

  const scrollTo = useScrollTo<T>(
    scrollbarRef,
    mergedData,
    heights,
    itemHeight,
    getKey,
    () => collectHeight(true),
    syncScrollTop,
  );

  React.useImperativeHandle(ref, () => ({
    getScrollInfo: () => scrollbarRef.current!.getValues(),
    scrollTo: (config) => {
      function isPosScroll(arg: any): arg is ScrollPos {
        return arg && typeof arg === 'object' && ('left' in arg || 'top' in arg);
      }

      if (isPosScroll(config)) {
        // Scroll X
        if (config.left !== undefined) {
          syncScrollLeft(config.left);
        }

        // Scroll Y
        if (config.top !== undefined) {
          scrollTo(config.top);
        }
      } else {
        scrollTo(config);
      }
    },
  }));

  // ================================ Effect ================================
  /** We need told outside that some list not rendered */
  useLayoutEffect(() => {
    if (onVisibleChange) {
      const renderList = mergedData.slice(start, end + 1);

      onVisibleChange(renderList, mergedData);
    }
  }, [start, end, mergedData]);

  // ================================ Extra =================================
  const getSize = useGetSize(mergedData, getKey, heights, itemHeight);

  const extraContent = extraRender?.({
    start,
    end,
    virtual: inVirtual,
    offsetX: offsetLeft,
    offsetY: fillerOffset ?? 0,
    getSize,
  });

  // ================================ Render ================================
  const listChildren = useChildren(
    mergedData,
    start,
    end,
    scrollWidth,
    offsetLeft,
    setInstanceRef,
    children,
    sharedConfig,
  );

  let scrollbarStyle: React.CSSProperties = { ...style };
  if (height) {
    scrollbarStyle = { [fullHeight ? 'height' : 'maxHeight']: height, ...scrollbarStyle };
  }

  return (
    <Scrollbar
      prefixCls={prefixCls}
      ref={scrollbarRef}
      className={mergeSemanticCls({ root: prefixCls }, className)}
      style={scrollbarStyle}
      onScroll={onInternalScroll}
      autoHeight={!fullHeight && height ? [0, height] : undefined}
      {...restProps}
    >
      <Filler
        prefixCls={prefixCls}
        height={scrollHeight}
        offsetX={offsetLeft}
        offsetY={fillerOffset}
        scrollWidth={scrollWidth}
        onInnerResize={collectHeight}
        ref={fillerInnerRef}
        innerProps={innerProps}
        extra={extraContent}
      >
        {listChildren}
      </Filler>
    </Scrollbar>
  );
}

const VirtualList = React.forwardRef<VirtualListRef, VirtualListProps<any>>(RawVirtualList);

VirtualList.displayName = 'VirtualList';

export default VirtualList as <Item = any>(
  props: VirtualListProps<Item> & { ref?: React.Ref<VirtualListRef> },
) => React.ReactElement;
