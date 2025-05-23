import * as React from 'react';
import useForceUpdate from '@util/hooks/useForceUpdate';

type Updater<T> = (prev: T) => T;

export default function useSyncState<T>(
  defaultState: T,
  onChange?: (newValue: T, prevValue: T) => void,
): [() => T, (updater: T | Updater<T>) => void] {
  const stateRef = React.useRef<T>(defaultState);
  const forceUpdate = useForceUpdate();

  function setState(updater: any) {
    const newValue = typeof updater === 'function' ? updater(stateRef.current) : updater;
    if (newValue !== stateRef.current) {
      onChange?.(newValue, stateRef.current);
    }
    stateRef.current = newValue;
    forceUpdate();
  }

  return [() => stateRef.current, setState];
}
