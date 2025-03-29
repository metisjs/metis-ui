import { useEffect, useRef } from 'react';
import useEvent from 'rc-util/es/hooks/useEvent';

let Optional = Symbol();

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
