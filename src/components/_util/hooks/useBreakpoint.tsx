import { useUpdate } from 'ahooks';
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import { useRef } from 'react';
import type { ScreenMap } from '../responsiveObserver';
import useResponsiveObserver from '../responsiveObserver';

function useBreakpoint(refreshOnChange = true): ScreenMap {
  const screensRef = useRef<ScreenMap>({});
  const forceUpdate = useUpdate();
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
