import * as React from 'react';
import { useRef } from 'react';

export default (
  callback: (event?: TransitionEvent) => void,
): [(element: HTMLElement) => void, (element: HTMLElement) => void] => {
  const cacheElementRef = useRef<HTMLElement>(null);

  // Cache callback
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  // Internal transition event handler
  const onInternalTransitionEnd = React.useCallback((event?: TransitionEvent) => {
    callbackRef.current(event);
  }, []);

  // Remove events
  function removeTransitionEvents(element?: HTMLElement | null) {
    if (element) {
      element.removeEventListener('transitionend', onInternalTransitionEnd);
    }
  }

  // Patch events
  function patchTransitionEvents(element: HTMLElement | null) {
    if (cacheElementRef.current && cacheElementRef.current !== element) {
      removeTransitionEvents(cacheElementRef.current);
    }

    if (element && element !== cacheElementRef.current) {
      const { transitionDuration, transitionDelay } = getComputedStyle(element);

      const [durationMs, delayMs] = [transitionDuration, transitionDelay].map((value) => {
        let [resolvedValue = 0] = value
          .split(',')
          // Remove falsy we can't work with
          .filter(Boolean)
          // Values are returned as `0.3s` or `75ms`
          .map((v) => (v.includes('ms') ? parseFloat(v) : parseFloat(v) * 1000))
          .sort((a, z) => z - a);

        return resolvedValue;
      });

      const totalDuration = durationMs + delayMs;
      if (totalDuration === 0) {
        onInternalTransitionEnd();
        return;
      }

      element.addEventListener('transitionend', onInternalTransitionEnd);

      // Save as cache in case dom removed trigger by `deadline`
      cacheElementRef.current = element;
    }
  }

  // Clean up when removed
  React.useEffect(
    () => () => {
      removeTransitionEvents(cacheElementRef.current);
    },
    [],
  );

  return [patchTransitionEvents, removeTransitionEvents];
};
