import { useRef } from 'react';
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import type { ScreenMap } from '../responsiveObserver';
import useResponsiveObserver from '../responsiveObserver';
import useForceUpdate from './useForceUpdate';

function useBreakpoint(refreshOnChange = true): ScreenMap {
  const screensRef = useRef<ScreenMap>({});
  const forceUpdate = useForceUpdate();
  const responsiveObserver = useResponsiveObserver();

  useLayoutEffect(() => {
    const token = responsiveObserver.subscribe((supportScreens) => {
      screensRef.current = supportScreens;
      if (refreshOnChange) {
        forceUpdate();
      }
    });

    return () => responsiveObserver.unsubscribe(token);
  }, []);

  return screensRef.current;
}

export default useBreakpoint;
