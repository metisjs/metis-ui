import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';
import useLayoutEffect from '@rc-component/util/lib/hooks/useLayoutEffect';
import { clsx } from '@util/classNameUtils';
import type { SafeKey } from '@util/type';
import classNames from 'classnames';
import ResizeObserver from 'rc-resize-observer';
import { ConfigContext } from '../config-provider';
import { OverflowContext } from './context';
import useEffectState, { useBatcher } from './hooks/useEffectState';
import Item from './Item';
import type { ComponentType } from './RawItem';
import RawItem from './RawItem';

const RESPONSIVE = 'responsive' as const;
const INVALIDATE = 'invalidate' as const;

export { OverflowContext } from './context';

export type { ComponentType } from './RawItem';

export interface OverflowProps<ItemType> extends React.HTMLAttributes<any> {
  prefixCls?: string;
  className?: string;
  itemClassName?: string;
  style?: React.CSSProperties;
  data?: ItemType[];
  itemKey?: SafeKey | ((item: ItemType) => SafeKey);
  /** Used for `responsive`. It will limit render node to avoid perf issue */
  itemWidth?: number;
  renderItem?: (item: ItemType, info: { index: number }) => React.ReactNode;
  /** @private Do not use in your production. Render raw node that need wrap Item by developer self */
  renderRawItem?: (item: ItemType, index: number) => React.ReactElement;
  maxCount?: number | typeof RESPONSIVE | typeof INVALIDATE;
  renderRest?: React.ReactNode | ((omittedItems: ItemType[]) => React.ReactNode);
  /** @private Do not use in your production. Render raw node that need wrap Item by developer self */
  renderRawRest?: (omittedItems: ItemType[]) => React.ReactElement;
  suffix?: React.ReactNode;
  component?: ComponentType;
  itemComponent?: ComponentType;

  /** @private This API may be refactor since not well design */
  onVisibleChange?: (visibleCount: number) => void;

  /** When set to `full`, ssr will render full items by default and remove at client side */
  ssr?: 'full';
}

function defaultRenderRest<ItemType>(omittedItems: ItemType[]) {
  return `+ ${omittedItems.length} ...`;
}

function Overflow<ItemType = any>(props: OverflowProps<ItemType>, ref: React.Ref<HTMLDivElement>) {
  const {
    prefixCls: customizePrefixCls,
    data = [],
    renderItem,
    renderRawItem,
    itemKey,
    itemWidth = 10,
    ssr,
    style,
    itemClassName,
    className,
    maxCount,
    renderRest,
    renderRawRest,
    suffix,
    component: Component = 'div',
    itemComponent,
    onVisibleChange,
    ...restProps
  } = props;

  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('overflow', customizePrefixCls);

  const fullySSR = ssr === 'full';

  const notifyEffectUpdate = useBatcher();

  const [containerWidth, setContainerWidth] = useEffectState<number>(notifyEffectUpdate, null);
  const mergedContainerWidth = containerWidth || 0;

  const [itemWidths, setItemWidths] = useEffectState(
    notifyEffectUpdate,
    new Map<React.Key, number>(),
  );

  const [prevRestWidth, setPrevRestWidth] = useEffectState<number>(notifyEffectUpdate, 0);
  const [restWidth, setRestWidth] = useEffectState<number>(notifyEffectUpdate, 0);

  const [suffixWidth, setSuffixWidth] = useEffectState<number>(notifyEffectUpdate, 0);
  const [suffixFixedStart, setSuffixFixedStart] = useState<number | null>(null);

  const [displayCount, setDisplayCount] = useState<number | null>(null);
  const mergedDisplayCount = React.useMemo(() => {
    if (displayCount === null && fullySSR) {
      return Number.MAX_SAFE_INTEGER;
    }

    return displayCount || 0;
  }, [displayCount, containerWidth]);

  const [restReady, setRestReady] = useState(false);

  const itemPrefixCls = `${prefixCls}-item`;

  // Always use the max width to avoid blink
  const mergedRestWidth = Math.max(prevRestWidth!, restWidth!);

  // ================================= Data =================================
  const isResponsive = maxCount === RESPONSIVE;
  const shouldResponsive = data.length && isResponsive;
  const invalidate = maxCount === INVALIDATE;

  /**
   * When is `responsive`, we will always render rest node to get the real width of it for calculation
   */
  const showRest = shouldResponsive || (typeof maxCount === 'number' && data.length > maxCount);

  const mergedData = useMemo(() => {
    let items = data;

    if (shouldResponsive) {
      if (containerWidth === null && fullySSR) {
        items = data;
      } else {
        items = data.slice(0, Math.min(data.length, mergedContainerWidth / itemWidth));
      }
    } else if (typeof maxCount === 'number') {
      items = data.slice(0, maxCount);
    }

    return items;
  }, [data, itemWidth, containerWidth, maxCount, shouldResponsive]);

  const omittedItems = useMemo(() => {
    if (shouldResponsive) {
      return data.slice(mergedDisplayCount + 1);
    }
    return data.slice(mergedData.length);
  }, [data, mergedData, shouldResponsive, mergedDisplayCount]);

  // ================================= Item =================================
  const getKey = useCallback(
    (item: ItemType, index: number) => {
      if (typeof itemKey === 'function') {
        return itemKey(item);
      }
      return (itemKey && (item as any)?.[itemKey]) ?? index;
    },
    [itemKey],
  );

  const mergedRenderItem = useCallback(renderItem || ((item: ItemType) => item), [renderItem]) as (
    item: ItemType,
    info: {
      index: number;
    },
  ) => React.ReactNode;

  function updateDisplayCount(
    count: number,
    suffixFixedStartVal?: number | null,
    notReady?: boolean,
  ) {
    // React 18 will sync render even when the value is same in some case.
    // We take `mergedData` as deps which may cause dead loop if it's dynamic generate.
    if (
      displayCount === count &&
      (suffixFixedStartVal === undefined || suffixFixedStartVal === suffixFixedStart)
    ) {
      return;
    }

    setDisplayCount(count);
    if (!notReady) {
      setRestReady(count < data.length - 1);

      onVisibleChange?.(count);
    }

    if (suffixFixedStartVal !== undefined) {
      setSuffixFixedStart(suffixFixedStartVal);
    }
  }

  // ================================= Size =================================
  function onOverflowResize(_: object, element: HTMLElement) {
    setContainerWidth(element.clientWidth);
  }

  function registerSize(key: React.Key, width: number | null) {
    setItemWidths((origin) => {
      const clone = new Map(origin);

      if (width === null) {
        clone.delete(key);
      } else {
        clone.set(key, width);
      }
      return clone;
    });
  }

  function registerOverflowSize(_: React.Key, width: number | null) {
    setRestWidth(width!);
    setPrevRestWidth(restWidth!);
  }

  function registerSuffixSize(_: React.Key, width: number | null) {
    setSuffixWidth(width!);
  }

  // ================================ Effect ================================
  function getItemWidth(index: number) {
    return itemWidths!.get(getKey(mergedData[index], index))!;
  }

  useLayoutEffect(() => {
    if (mergedContainerWidth && typeof mergedRestWidth === 'number' && mergedData) {
      let totalWidth = suffixWidth!;

      const len = mergedData.length;
      const lastIndex = len - 1;

      // When data count change to 0, reset this since not loop will reach
      if (!len) {
        updateDisplayCount(0, null);
        return;
      }

      for (let i = 0; i < len; i += 1) {
        let currentItemWidth = getItemWidth(i);

        // Fully will always render
        if (fullySSR) {
          currentItemWidth = currentItemWidth || 0;
        }

        // Break since data not ready
        if (currentItemWidth === undefined) {
          updateDisplayCount(i - 1, undefined, true);
          break;
        }

        // Find best match
        totalWidth += currentItemWidth;

        if (
          // Only one means `totalWidth` is the final width
          (lastIndex === 0 && totalWidth <= mergedContainerWidth) ||
          // Last two width will be the final width
          (i === lastIndex - 1 && totalWidth + getItemWidth(lastIndex)! <= mergedContainerWidth)
        ) {
          // Additional check if match the end
          updateDisplayCount(lastIndex, null);
          break;
        } else if (totalWidth + mergedRestWidth > mergedContainerWidth) {
          // Can not hold all the content to show rest
          updateDisplayCount(i - 1, totalWidth - currentItemWidth - suffixWidth! + restWidth!);
          break;
        }
      }

      if (suffix && getItemWidth(0) + suffixWidth! > mergedContainerWidth) {
        setSuffixFixedStart(null);
      }
    }
  }, [mergedContainerWidth, itemWidths, restWidth, suffixWidth, getKey, mergedData]);

  // ================================ Render ================================
  const displayRest = restReady && !!omittedItems.length;

  let suffixStyle: React.CSSProperties = {};
  if (suffixFixedStart !== null && shouldResponsive) {
    suffixStyle = {
      position: 'absolute',
      left: suffixFixedStart,
      top: 0,
    };
  }

  const itemSharedProps = {
    prefixCls: itemPrefixCls,
    className: itemClassName,
    responsive: !!shouldResponsive,
    component: itemComponent,
    invalidate,
  };

  // >>>>> Choice render fun by `renderRawItem`
  const internalRenderItemNode = renderRawItem
    ? (item: ItemType, index: number) => {
        const key = getKey(item, index);

        return (
          <OverflowContext.Provider
            key={key}
            value={{
              ...itemSharedProps,
              order: index,
              item,
              itemKey: key,
              registerSize,
              display: index <= mergedDisplayCount,
            }}
          >
            {renderRawItem(item, index)}
          </OverflowContext.Provider>
        );
      }
    : (item: ItemType, index: number) => {
        const key = getKey(item, index);

        return (
          <Item
            {...itemSharedProps}
            order={index}
            key={key}
            item={item}
            renderItem={mergedRenderItem}
            itemKey={key}
            registerSize={registerSize}
            display={index <= mergedDisplayCount}
          />
        );
      };

  // >>>>> Rest node
  const restContextProps = {
    order: displayRest ? mergedDisplayCount : Number.MAX_SAFE_INTEGER,
    className: clsx(`${itemPrefixCls}-rest`, itemSharedProps.className),
    registerSize: registerOverflowSize,
    display: displayRest,
  };

  const mergedRenderRest = renderRest || defaultRenderRest;

  const restNode = renderRawRest ? (
    <OverflowContext.Provider
      value={{
        ...itemSharedProps,
        ...restContextProps,
      }}
    >
      {renderRawRest(omittedItems)}
    </OverflowContext.Provider>
  ) : (
    <Item
      {...itemSharedProps}
      // When not show, order should be the last
      {...restContextProps}
    >
      {typeof mergedRenderRest === 'function' ? mergedRenderRest(omittedItems) : mergedRenderRest}
    </Item>
  );

  const overflowNode = (
    <Component
      className={classNames(!invalidate && prefixCls, className)}
      style={style}
      ref={ref}
      {...restProps}
    >
      {mergedData.map(internalRenderItemNode)}

      {/* Rest Count Item */}
      {showRest ? restNode : null}

      {/* Suffix Node */}
      {suffix && (
        <Item
          {...itemSharedProps}
          responsive={isResponsive}
          responsiveDisabled={!shouldResponsive}
          order={mergedDisplayCount}
          className={clsx(`${itemPrefixCls}-suffix`, itemSharedProps.className)}
          registerSize={registerSuffixSize}
          display
          style={suffixStyle}
        >
          {suffix}
        </Item>
      )}
    </Component>
  );

  return isResponsive ? (
    <ResizeObserver onResize={onOverflowResize} disabled={!shouldResponsive}>
      {overflowNode}
    </ResizeObserver>
  ) : (
    overflowNode
  );
}

const ForwardOverflow = React.forwardRef(Overflow);

type ForwardOverflowType = <ItemType = any>(
  props: React.PropsWithChildren<OverflowProps<ItemType>> & {
    ref?: React.Ref<HTMLDivElement>;
  },
) => React.ReactElement;

type FilledOverflowType = ForwardOverflowType & {
  Item: typeof RawItem;
  RESPONSIVE: typeof RESPONSIVE;
  /** Will work as normal `component`. Skip patch props like `prefixCls`. */
  INVALIDATE: typeof INVALIDATE;
};

ForwardOverflow.displayName = 'Overflow';

(ForwardOverflow as unknown as FilledOverflowType).Item = RawItem;
(ForwardOverflow as unknown as FilledOverflowType).RESPONSIVE = RESPONSIVE;
(ForwardOverflow as unknown as FilledOverflowType).INVALIDATE = INVALIDATE;

// Convert to generic type
export default ForwardOverflow as unknown as FilledOverflowType;
