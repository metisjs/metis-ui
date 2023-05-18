import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import { useRef } from 'react';

export default function useIsMounted() {
  let mounted = useRef(false);

  useLayoutEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  return mounted;
}
