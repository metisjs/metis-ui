import * as React from 'react';
import { useRef } from 'react';

export default (
  callback: (event: TransitionEvent) => void,
): [(element: HTMLElement) => void, (element: HTMLElement) => void] => {
  const cacheElementRef = useRef<HTMLElement>();

  // Cache callback
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  // Internal motion event handler
  const onInternalTransitionEnd = React.useCallback((event: TransitionEvent) => {
    callbackRef.current(event);
  }, []);

  // Remove events
  function removeTransitionEvents(element?: HTMLElement) {
    if (element) {
      element.removeEventListener('transitionend', onInternalTransitionEnd);
    }
  }

  // Patch events
  function patchTransitionEvents(element: HTMLElement) {
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
