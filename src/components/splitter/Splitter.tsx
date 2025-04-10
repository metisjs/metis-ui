import React, { useState } from 'react';
import useEvent from '@rc-component/util/es/hooks/useEvent';
import { clsx, mergeSemanticCls } from '@util/classNameUtils';
import useSemanticCls from '@util/hooks/useSemanticCls';
import type { GetProp } from '@util/type';
import { devUseWarning } from '@util/warning';
import ResizeObserver from 'rc-resize-observer';
import { ConfigContext } from '../config-provider';
import useItems from './hooks/useItems';
import useResizable from './hooks/useResizable';
import useResize from './hooks/useResize';
import useSizes from './hooks/useSizes';
import type { SplitterProps } from './interface';
import { InternalPanel } from './Panel';
import SplitBar from './SplitBar';

const Splitter: React.FC<React.PropsWithChildren<SplitterProps>> = (props) => {
  const {
    prefixCls: customizePrefixCls,
    className,
    style,
    layout = 'horizontal',
    children,
    onResizeStart,
    onResize,
    onResizeEnd,
  } = props;

  const { getPrefixCls } = React.useContext(ConfigContext);
  const prefixCls = getPrefixCls('splitter', customizePrefixCls);

  // ======================== Direct ========================
  const isVertical = layout === 'vertical';

  // ====================== Items Data ======================
  const items = useItems(children);

  // >>> Warning for uncontrolled
  if (process.env.NODE_ENV !== 'production') {
    const warning = devUseWarning('Splitter');

    let existSize = false;
    let existUndefinedSize = false;

    items.forEach((item) => {
      if (item.size !== undefined) {
        existSize = true;
      } else {
        existUndefinedSize = true;
      }
    });

    if (existSize && existUndefinedSize && !onResize) {
      warning(
        false,
        'usage',
        'When part of `Splitter.Panel` has `size`, `onResize` is required or change `size` to `defaultSize`.',
      );
    }
  }

  // ====================== Container =======================
  const [containerSize, setContainerSize] = useState<number | undefined>();

  const onContainerResize: GetProp<typeof ResizeObserver, 'onResize'> = (size) => {
    const { offsetWidth, offsetHeight } = size;
    const containerSize = isVertical ? offsetHeight : offsetWidth;
    if (containerSize === 0) {
      return;
    }
    setContainerSize(containerSize);
  };

  // ========================= Size =========================
  const [panelSizes, itemPxSizes, itemPtgSizes, itemPtgMinSizes, itemPtgMaxSizes, updateSizes] =
    useSizes(items, containerSize);

  // ====================== Resizable =======================
  const resizableInfos = useResizable(items, itemPxSizes);

  const [onOffsetStart, onOffsetUpdate, onOffsetEnd, onCollapse, movingIndex] = useResize(
    items,
    resizableInfos,
    itemPtgSizes,
    containerSize,
    updateSizes,
  );

  // ======================== Events ========================
  const onInternalResizeStart = useEvent((index: number) => {
    onOffsetStart(index);
    onResizeStart?.(itemPxSizes);
  });

  const onInternalResizeUpdate = useEvent((index: number, offset: number) => {
    const nextSizes = onOffsetUpdate(index, offset);
    onResize?.(nextSizes);
  });

  const onInternalResizeEnd = useEvent(() => {
    onOffsetEnd();
    onResizeEnd?.(itemPxSizes);
  });

  const onInternalCollapse = useEvent((index: number, type: 'start' | 'end') => {
    const nextSizes = onCollapse(index, type);
    onResize?.(nextSizes);
    onResizeEnd?.(nextSizes);
  });

  // ======================== Styles ========================
  const semanticCls = useSemanticCls(className, 'splitter');

  const rootCls = clsx(
    prefixCls,
    `${prefixCls}-${layout}`,
    'splitter',
    'text-text flex h-full w-full items-stretch text-sm',
    {
      'flex-col': layout === 'vertical',
    },
    semanticCls.root,
  );

  const maskCls = clsx(`${prefixCls}-mask`, `${prefixCls}-mask-${layout}`, 'fixed inset-0 z-1000', {
    'cursor-col-resize': layout === 'horizontal',
    'cursor-row-resize': layout === 'vertical',
  });

  // ======================== Render ========================
  const stackSizes = React.useMemo(() => {
    const mergedSizes: number[] = [];

    let stack = 0;
    for (let i = 0; i < items.length; i += 1) {
      stack += itemPtgSizes[i];
      mergedSizes.push(stack);
    }

    return mergedSizes;
  }, [itemPtgSizes]);

  return (
    <ResizeObserver onResize={onContainerResize}>
      <div style={style} className={rootCls}>
        {items.map((item, idx) => {
          // Panel
          const panel = (
            <InternalPanel
              {...item}
              prefixCls={prefixCls}
              size={panelSizes[idx]}
              className={mergeSemanticCls(item.className, semanticCls.panel)}
            />
          );

          // Split Bar
          let splitBar: React.ReactElement | null = null;

          const resizableInfo = resizableInfos[idx];
          if (resizableInfo) {
            const ariaMinStart = (stackSizes[idx - 1] || 0) + itemPtgMinSizes[idx];
            const ariaMinEnd = (stackSizes[idx + 1] || 100) - itemPtgMaxSizes[idx + 1];

            const ariaMaxStart = (stackSizes[idx - 1] || 0) + itemPtgMaxSizes[idx];
            const ariaMaxEnd = (stackSizes[idx + 1] || 100) - itemPtgMinSizes[idx + 1];

            splitBar = (
              <SplitBar
                index={idx}
                active={movingIndex === idx}
                prefixCls={prefixCls}
                vertical={isVertical}
                resizable={resizableInfo.resizable}
                ariaNow={stackSizes[idx] * 100}
                ariaMin={Math.max(ariaMinStart, ariaMinEnd) * 100}
                ariaMax={Math.min(ariaMaxStart, ariaMaxEnd) * 100}
                startCollapsible={resizableInfo.startCollapsible}
                endCollapsible={resizableInfo.endCollapsible}
                onOffsetStart={onInternalResizeStart}
                onOffsetUpdate={(index, offsetX, offsetY) => {
                  let offset = isVertical ? offsetY : offsetX;
                  onInternalResizeUpdate(index, offset);
                }}
                onOffsetEnd={onInternalResizeEnd}
                onCollapse={onInternalCollapse}
                className={semanticCls.bar}
              />
            );
          }

          return (
            <React.Fragment key={`split-panel-${idx}`}>
              {panel}
              {splitBar}
            </React.Fragment>
          );
        })}
        {/* Fake mask for cursor */}
        {typeof movingIndex === 'number' && <div aria-hidden className={maskCls} />}
      </div>
    </ResizeObserver>
  );
};

if (process.env.NODE_ENV !== 'production') {
  Splitter.displayName = 'Splitter';
}

export default Splitter;
