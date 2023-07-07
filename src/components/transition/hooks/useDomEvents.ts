import * as React from 'react';
import { useRef } from 'react';

export default () => {
  const cacheElementRef = useRef<HTMLElement>();
  const callbackRef = useRef<(event: TransitionEvent) => void>();

  // Internal motion event handler
  const onInternalTransitionEnd = React.useCallback((event: TransitionEvent) => {
    callbackRef.current?.(event);
  }, []);

  // Remove events
  function removeTransitionEvents(element?: HTMLElement) {
    if (element) {
      element.removeEventListener('transitionend', onInternalTransitionEnd);
    }
  }

  // Patch events
  function patchTransitionEvents(element: HTMLElement, callback: (event: TransitionEvent) => void) {
    callbackRef.current = callback;

    if (cacheElementRef.current && cacheElementRef.current !== element) {
      removeTransitionEvents(cacheElementRef.current);
    }

    if (element && element !== cacheElementRef.current) {
      element.addEventListener('transitionend', onInternalTransitionEnd);

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
