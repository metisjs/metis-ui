import React from 'react';
import { useEvent, useMergedState } from '@rc-component/util';
import raf from '@rc-component/util/es/raf';

/**
 * Will be `true` immediately for next effect.
 * But will be `false` for a delay of effect.
 */
export default function useDelayState<T>(
  value?: T,
  defaultValue?: T,
  onChange?: (next?: T) => void,
): [state: T | undefined, setState: (nextState: T, immediately?: boolean) => void] {
  const [state, setState] = useMergedState(defaultValue, {
    value,
  });

  const nextValueRef = React.useRef(value);

  // ============================= Update =============================
  const rafRef = React.useRef<number>(null);
  const cancelRaf = () => {
    if (rafRef.current) raf.cancel(rafRef.current);
  };

  const doUpdate = useEvent(() => {
    setState(nextValueRef.current);

    if (onChange && state !== nextValueRef.current) {
      onChange(nextValueRef.current);
    }
  });

  const updateValue = useEvent((next: T, immediately?: boolean) => {
    cancelRaf();

    nextValueRef.current = next;

    if (next || immediately) {
      doUpdate();
    } else {
      rafRef.current = raf(doUpdate);
    }
  });

  React.useEffect(() => cancelRaf, []);

  return [state, updateValue];
}
