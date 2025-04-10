import { useRef } from 'react';
import useLayoutEffect from '@rc-component/util/es/hooks/useLayoutEffect';

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
