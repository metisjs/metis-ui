import * as React from 'react';
import { useLayoutUpdateEffect } from '@rc-component/util/es/hooks/useLayoutEffect';
import raf from '@rc-component/util/es/raf';

/**
 * Trigger `callback` immediately when `condition` is `true`.
 * But trigger `callback` in next frame when `condition` is `false`.
 */
export default function useLockEffect(
  condition: boolean,
  callback: (next: boolean) => void,
  delayFrames = 1,
) {
  const callbackRef = React.useRef(callback);
  callbackRef.current = callback;

  useLayoutUpdateEffect(() => {
    if (condition) {
      callbackRef.current(condition);
    } else {
      const id = raf(() => {
        callbackRef.current(condition);
      }, delayFrames);

      return () => {
        raf.cancel(id);
      };
    }
  }, [condition]);
}
