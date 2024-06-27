/* eslint-disable no-param-reassign */
import raf from 'rc-util/lib/raf';

function easeInOutCubic(t: number, b: number, c: number, d: number) {
  const cc = c - b;
  // biome-ignore lint: it is a common easing function
  t /= d / 2;
  if (t < 1) {
    return (cc / 2) * t * t * t + b;
  }
  // biome-ignore lint: it is a common easing function
  return (cc / 2) * ((t -= 2) * t * t + 2) + b;
}

export function isWindow(obj: any): obj is Window {
  return obj !== null && obj !== undefined && obj === obj.window;
}

export const getScroll = (target: HTMLElement | Window | Document | null): number => {
  if (typeof window === 'undefined') {
    return 0;
  }
  let result = 0;
  if (isWindow(target)) {
    result = target.pageYOffset;
  } else if (target instanceof Document) {
    result = target.documentElement.scrollTop;
  } else if (target instanceof HTMLElement) {
    result = target.scrollTop;
  } else if (target) {
    // According to the type inference, the `target` is `never` type.
    // Since we configured the loose mode type checking, and supports mocking the target with such shape below::
    //    `{ documentElement: { scrollLeft: 200, scrollTop: 400 } }`,
    //    the program may falls into this branch.
    // Check the corresponding tests for details. Don't sure what is the real scenario this happens.
    /* biome-ignore lint/complexity/useLiteralKeys: target is a never type */ /* eslint-disable-next-line dot-notation */
    result = target['scrollTop'];
  }

  if (target && !isWindow(target) && typeof result !== 'number') {
    result = (target.ownerDocument ?? target).documentElement?.scrollTop;
  }
  return result;
};

interface ScrollToOptions {
  /** Scroll container, default as window */
  getContainer?: () => HTMLElement | Window | Document;
  /** Scroll end callback */
  callback?: () => void;
  /** Animation duration, default as 450 */
  duration?: number;
}

export function scrollTo(y: number, options: ScrollToOptions = {}) {
  const { getContainer = () => window, callback, duration = 450 } = options;
  const container = getContainer();
  const scrollTop = getScroll(container);
  const startTime = Date.now();

  const frameFunc = () => {
    const timestamp = Date.now();
    const time = timestamp - startTime;
    const nextScrollTop = easeInOutCubic(time > duration ? duration : time, scrollTop, y, duration);
    if (isWindow(container)) {
      (container as Window).scrollTo(window.pageXOffset, nextScrollTop);
    } else if (container instanceof Document || container.constructor.name === 'HTMLDocument') {
      (container as Document).documentElement.scrollTop = nextScrollTop;
    } else {
      (container as HTMLElement).scrollTop = nextScrollTop;
    }
    if (time < duration) {
      raf(frameFunc);
    } else if (typeof callback === 'function') {
      callback();
    }
  };
  raf(frameFunc);
}
