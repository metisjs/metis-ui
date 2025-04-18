import isVisible from '@rc-component/util/es/Dom/isVisible';
import raf from '@rc-component/util/es/raf';
import type { CustomFormat, PickerMode } from '../interface';

const scrollIds = new Map<HTMLElement, number>();

/** Trigger when element is visible in view */
export function waitElementReady(element: HTMLElement, callback: () => void): () => void {
  let id: number;

  function tryOrNextFrame() {
    if (isVisible(element)) {
      callback();
    } else {
      id = raf(() => {
        tryOrNextFrame();
      });
    }
  }

  tryOrNextFrame();

  return () => {
    raf.cancel(id);
  };
}

/* eslint-disable no-param-reassign */
export function scrollTo(element: HTMLElement, to: number, duration: number) {
  if (scrollIds.get(element)) {
    cancelAnimationFrame(scrollIds.get(element)!);
  }

  // jump to target if duration zero
  if (duration <= 0) {
    scrollIds.set(
      element,
      requestAnimationFrame(() => {
        element.scrollTop = to;
      }),
    );

    return;
  }
  const difference = to - element.scrollTop;
  const perTick = (difference / duration) * 10;

  scrollIds.set(
    element,
    requestAnimationFrame(() => {
      element.scrollTop += perTick;
      if (element.scrollTop !== to) {
        scrollTo(element, to, duration - 10);
      }
    }),
  );
}
/* eslint-enable */

export type KeyboardConfig = {
  onLeftRight?: ((diff: number) => void) | null;
  onCtrlLeftRight?: ((diff: number) => void) | null;
  onUpDown?: ((diff: number) => void) | null;
  onPageUpDown?: ((diff: number) => void) | null;
  onEnter?: (() => void) | null;
};
export function createKeyDownHandler(
  event: React.KeyboardEvent<HTMLElement>,
  { onLeftRight, onCtrlLeftRight, onUpDown, onPageUpDown, onEnter }: KeyboardConfig,
): boolean {
  const { key, ctrlKey, metaKey } = event;

  switch (key) {
    case 'ArrowLeft':
      if (ctrlKey || metaKey) {
        if (onCtrlLeftRight) {
          onCtrlLeftRight(-1);
          return true;
        }
      } else if (onLeftRight) {
        onLeftRight(-1);
        return true;
      }
      /* istanbul ignore next */
      break;

    case 'ArrowRight':
      if (ctrlKey || metaKey) {
        if (onCtrlLeftRight) {
          onCtrlLeftRight(1);
          return true;
        }
      } else if (onLeftRight) {
        onLeftRight(1);
        return true;
      }
      /* istanbul ignore next */
      break;

    case 'ArrowUp':
      if (onUpDown) {
        onUpDown(-1);
        return true;
      }
      /* istanbul ignore next */
      break;

    case 'ArrowDown':
      if (onUpDown) {
        onUpDown(1);
        return true;
      }
      /* istanbul ignore next */
      break;

    case 'PageUp':
      if (onPageUpDown) {
        onPageUpDown(-1);
        return true;
      }
      /* istanbul ignore next */
      break;

    case 'PageDown':
      if (onPageUpDown) {
        onPageUpDown(1);
        return true;
      }
      /* istanbul ignore next */
      break;

    case 'Enter':
      if (onEnter) {
        onEnter();
        return true;
      }
      /* istanbul ignore next */
      break;
  }

  return false;
}

// ===================== Format =====================
export function getDefaultFormat<DateType>(
  format: string | CustomFormat<DateType> | (string | CustomFormat<DateType>)[] | undefined,
  picker: PickerMode | undefined,
  showTime: boolean | object | undefined,
  use12Hours: boolean | undefined,
) {
  let mergedFormat = format;
  if (!mergedFormat) {
    switch (picker) {
      case 'time':
        mergedFormat = use12Hours ? 'hh:mm:ss a' : 'HH:mm:ss';
        break;

      case 'week':
        mergedFormat = 'gggg-wo';
        break;

      case 'month':
        mergedFormat = 'YYYY-MM';
        break;

      case 'quarter':
        mergedFormat = 'YYYY-[Q]Q';
        break;

      case 'year':
        mergedFormat = 'YYYY';
        break;

      default:
        mergedFormat = showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
    }
  }

  return mergedFormat;
}

// ====================== Mode ======================
export function elementsContains(
  elements: (HTMLElement | undefined | null)[],
  target: HTMLElement,
) {
  return elements.some((ele) => ele && ele.contains(target));
}

export function getOffsetUnit(placement: string = 'bottomLeft') {
  const placementRight = placement?.toLowerCase().endsWith('right');
  let offsetUnit = placementRight ? 'insetInlineEnd' : 'insetInlineStart';
  return offsetUnit;
}
