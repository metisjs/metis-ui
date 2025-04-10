import { useCallback, useEffect, useRef } from 'react';
import { useEvent } from '@rc-component/util';

const useInterval = (fn: () => void, delay?: number, options: { immediate?: boolean } = {}) => {
  const timerCallback = useEvent(fn);
  const timerRef = useRef<NodeJS.Timeout>(undefined);

  const run = useCallback(() => {
    if (!delay) {
      return;
    }
    if (options.immediate) {
      timerCallback();
    }
    timerRef.current = setInterval(timerCallback, delay);
  }, [delay, options.immediate]);

  const clear = useCallback(() => {
    clearInterval(timerRef.current);
  }, []);

  const reset = useCallback(() => {
    clear();
    run();
  }, [clear, run]);

  useEffect(() => {
    run();
    return clear;
  }, [run]);

  return [clear, reset];
};

export default useInterval;
