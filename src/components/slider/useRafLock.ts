import raf from 'rc-util/lib/raf';
import * as React from 'react';

export default function useRafLock(): [state: boolean, setState: (nextState: boolean) => void] {
  const [state, setState] = React.useState(false);

  const rafRef = React.useRef<number>();
  const cleanup = () => {
    raf.cancel(rafRef.current!);
  };

  const setDelayState = (nextState: boolean) => {
    cleanup();

    if (nextState) {
      setState(nextState);
    } else {
      rafRef.current = raf(() => {
        setState(nextState);
      });
    }
  };

  React.useEffect(() => cleanup, []);

  return [state, setDelayState];
}
