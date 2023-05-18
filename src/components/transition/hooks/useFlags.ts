import { useCallback, useState } from 'react';
import useIsMounted from '../../_util/hooks/useIsMounted';

export default function useFlags(initialFlags = 0) {
  const [flags, setFlags] = useState(initialFlags);
  const mounted = useIsMounted();

  const addFlag = useCallback(
    (flag: number) => {
      if (!mounted.current) return;
      setFlags((flags) => flags | flag);
    },
    [flags, mounted],
  );
  const hasFlag = useCallback((flag: number) => Boolean(flags & flag), [flags]);
  const removeFlag = useCallback(
    (flag: number) => {
      if (!mounted.current) return;
      setFlags((flags) => flags & ~flag);
    },
    [setFlags, mounted],
  );
  const toggleFlag = useCallback(
    (flag: number) => {
      if (!mounted.current) return;
      setFlags((flags) => flags ^ flag);
    },
    [setFlags],
  );

  return { flags, addFlag, hasFlag, removeFlag, toggleFlag };
}
