import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import { useCallback, useEffect, useRef } from 'react';

let Optional = Symbol();

function useEvent<
  F extends (...args: any[]) => any,
  P extends any[] = Parameters<F>,
  R = ReturnType<F>,
>(cb: (...args: P) => R) {
  const cache = useRef(cb);

  useLayoutEffect(() => {
    cache.current = cb;
  }, [cb]);

  return useCallback((...args: P) => cache.current(...args), [cache]);
}

export default function useSyncRefs<TType>(
  ...refs: (React.MutableRefObject<TType | null> | ((instance: TType) => void) | null)[]
) {
  let cache = useRef(refs);

  useEffect(() => {
    cache.current = refs;
  }, [refs]);

  let syncRefs = useEvent((value: TType) => {
    for (let ref of cache.current) {
      if (!ref) continue;
      if (typeof ref === 'function') ref(value);
      else ref.current = value;
    }
  });

  return refs.every(
    (ref) =>
      !ref ||
      // @ts-expect-error
      ref?.[Optional],
  )
    ? undefined
    : syncRefs;
}
