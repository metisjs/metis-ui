import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import raf from 'rc-util/lib/raf';
import * as React from 'react';
import { devUseWarning } from '../../_util/warning';
import { ScrollbarRef } from '../../scrollbar';
import type { GetKey } from '../interface';
import type CacheMap from '../utils/CacheMap';

const MAX_TIMES = 10;

export type ScrollAlign = 'top' | 'bottom' | 'auto';

export type ScrollPos = {
  left?: number;
  top?: number;
};

export type ScrollTarget =
  | {
      index: number;
      align?: ScrollAlign;
      offset?: number;
    }
  | {
      key: React.Key;
      align?: ScrollAlign;
      offset?: number;
    };

export default function useScrollTo<T>(
  scrollbarRef: React.RefObject<ScrollbarRef>,
  data: T[],
  heights: CacheMap,
  itemHeight: number = 0,
  getKey: GetKey<T>,
  collectHeight: () => void,
  syncScrollTop: (newTop: number) => void,
): (arg: number | ScrollTarget) => void {
  const scrollRef = React.useRef<number>();

  const [syncState, setSyncState] = React.useState<{
    times: number;
    index: number;
    offset: number;
    originAlign?: ScrollAlign;
    targetAlign?: 'top' | 'bottom';
    lastTop?: number;
  }>();

  // ========================== Sync Scroll ==========================
  useLayoutEffect(() => {
    if (syncState && syncState.times < MAX_TIMES) {
      // Never reach
      if (!scrollbarRef.current) {
        setSyncState((ori) => ({ ...ori! }));
        return;
      }

      collectHeight();

      const { targetAlign, originAlign, index, offset } = syncState;
      const { clientHeight: height, scrollTop } = scrollbarRef.current.getValues();

      let needCollectHeight = false;
      let newTargetAlign: 'top' | 'bottom' | undefined = targetAlign;
      let targetTop: number | null = null;

      // Go to next frame if height not exist
      if (height) {
        const mergedAlign = targetAlign || originAlign;

        // Get top & bottom
        let stackTop = 0;
        let itemTop = 0;
        let itemBottom = 0;

        const maxLen = Math.min(data.length - 1, index);

        for (let i = 0; i <= maxLen; i += 1) {
          const key = getKey(data[i]);
          itemTop = stackTop;
          const cacheHeight = heights.get(key);
          itemBottom = itemTop + (cacheHeight === undefined ? itemHeight : cacheHeight);

          stackTop = itemBottom;
        }

        // Check if need sync height (visible range has item not record height)
        let leftHeight = mergedAlign === 'top' ? offset : height - offset;
        for (let i = maxLen; i >= 0; i -= 1) {
          const key = getKey(data[i]);
          const cacheHeight = heights.get(key);

          if (cacheHeight === undefined) {
            needCollectHeight = true;
            break;
          }

          leftHeight -= cacheHeight;
          if (leftHeight <= 0) {
            break;
          }
        }

        // Scroll to
        switch (mergedAlign) {
          case 'top':
            targetTop = itemTop - offset;
            break;
          case 'bottom':
            targetTop = itemBottom - height + offset;
            break;

          default: {
            const scrollBottom = scrollTop + height;
            if (itemTop < scrollTop) {
              newTargetAlign = 'top';
            } else if (itemBottom > scrollBottom) {
              newTargetAlign = 'bottom';
            }
          }
        }
        if (targetTop !== null) {
          syncScrollTop(targetTop);
        }

        // One more time for sync
        if (targetTop !== syncState.lastTop) {
          needCollectHeight = true;
        }
      }

      // Trigger next effect
      if (needCollectHeight) {
        setSyncState({
          ...syncState,
          times: syncState.times + 1,
          targetAlign: newTargetAlign,
          lastTop: targetTop!,
        });
      }
    } else if (process.env.NODE_ENV !== 'production' && syncState?.times === MAX_TIMES) {
      const warning = devUseWarning('VirtualList');
      warning(
        false,
        'usage',
        'Seems `scrollTo` with `virtual-list` reach the max limitation. Please fire issue for us. Thanks.',
      );
    }
  }, [syncState, scrollbarRef.current]);

  // =========================== Scroll To ===========================
  return (arg) => {
    // Normal scroll logic
    raf.cancel(scrollRef.current!);

    if (typeof arg === 'number') {
      syncScrollTop(arg);
    } else if (arg && typeof arg === 'object') {
      let index: number;
      const { align } = arg;

      if ('index' in arg) {
        ({ index } = arg);
      } else {
        index = data.findIndex((item) => getKey(item) === arg.key);
      }

      const { offset = 0 } = arg;

      setSyncState({
        times: 0,
        index,
        offset,
        originAlign: align,
      });
    }
  };
}
