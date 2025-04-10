import * as React from 'react';
import useLayoutEffect from '@rc-component/util/es/hooks/useLayoutEffect';

/**
 * Trigger only when component unmount
 */
export default function useUnmount(triggerStart: VoidFunction, triggerEnd: VoidFunction) {
  const [firstMount, setFirstMount] = React.useState(false);

  useLayoutEffect(() => {
    if (firstMount) {
      triggerStart();

      return () => {
        triggerEnd();
      };
    }
  }, [firstMount]);

  useLayoutEffect(() => {
    setFirstMount(true);

    return () => {
      setFirstMount(false);
    };
  }, []);
}
