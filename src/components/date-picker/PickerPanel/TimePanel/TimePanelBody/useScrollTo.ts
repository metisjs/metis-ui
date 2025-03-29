import * as React from 'react';
import { useEvent } from 'rc-util';
import isVisible from 'rc-util/es/Dom/isVisible';
import raf from 'rc-util/es/raf';
import type { ScrollbarRef } from '../../../../scrollbar';

const SPEED_PTG = 1 / 3;

export default function useScrollTo(
  scrollbarRef: React.RefObject<ScrollbarRef>,
  value: number | string | undefined,
): [syncScroll: VoidFunction, clearScroll: VoidFunction, isScrolling: () => boolean] {
  // ========================= Scroll =========================
  const scrollingRef = React.useRef<boolean>(false);
  const scrollRafRef = React.useRef<number | null>(null);
  const scrollDistRef = React.useRef<number | null>(null);

  const isScrolling = () => scrollingRef.current;

  const stopScroll = () => {
    if (scrollRafRef.current) raf.cancel(scrollRafRef.current);
    scrollingRef.current = false;
  };

  const scrollRafTimesRef = React.useRef<number>(0);

  const startScroll = () => {
    const view = scrollbarRef.current?.view;
    scrollDistRef.current = null;
    scrollRafTimesRef.current = 0;

    if (view) {
      const targetLi = view.querySelector<HTMLLIElement>(`[data-value="${value}"]`)!;
      const firstLi = view.querySelector<HTMLLIElement>(`li`)!;

      const doScroll = () => {
        stopScroll();
        scrollingRef.current = true;
        scrollRafTimesRef.current += 1;

        const { scrollTop: currentTop } = scrollbarRef.current!.getValues();

        const firstLiTop = firstLi.offsetTop;
        const targetLiTop = targetLi.offsetTop;
        const targetTop = targetLiTop - firstLiTop;

        // Wait for element exist. 5 frames is enough
        if ((targetLiTop === 0 && targetLi !== firstLi) || !isVisible(view)) {
          if (scrollRafTimesRef.current <= 5) {
            scrollRafRef.current = raf(doScroll);
          }
          return;
        }

        const nextTop = currentTop + (targetTop - currentTop) * SPEED_PTG;
        const dist = Math.abs(targetTop - nextTop);

        // Break if dist get larger, which means user is scrolling
        if (scrollDistRef.current !== null && scrollDistRef.current < dist) {
          stopScroll();
          return;
        }
        scrollDistRef.current = dist;

        // Stop when dist is less than 1
        if (dist <= 1) {
          scrollbarRef.current?.scrollTo({ top: targetTop });
          stopScroll();
          return;
        }

        scrollbarRef.current?.scrollTo({ top: nextTop });

        scrollRafRef.current = raf(doScroll);
      };

      if (targetLi && firstLi) {
        doScroll();
      }
    }
  };

  // ======================== Trigger =========================
  const syncScroll = useEvent(startScroll);

  return [syncScroll, stopScroll, isScrolling];
}
