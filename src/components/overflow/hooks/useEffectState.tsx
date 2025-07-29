import * as React from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import useEvent from '@rc-component/util/lib/hooks/useEvent';
import channelUpdate from './channelUpdate';

type Updater<T> = T | ((origin: T) => T);

type UpdateCallbackFunc = VoidFunction;

type NotifyEffectUpdate = (callback: UpdateCallbackFunc) => void;

/**
 * Batcher for record any `useEffectState` need update.
 */
export function useBatcher() {
  // Updater Trigger
  const updateFuncRef = React.useRef<UpdateCallbackFunc[]>(null);

  // Notify update
  const notifyEffectUpdate: NotifyEffectUpdate = (callback) => {
    if (!updateFuncRef.current) {
      updateFuncRef.current = [];

      channelUpdate(() => {
        unstable_batchedUpdates(() => {
          updateFuncRef.current?.forEach((fn) => {
            fn();
          });
          updateFuncRef.current = null;
        });
      });
    }

    updateFuncRef.current.push(callback);
  };

  return notifyEffectUpdate;
}

/**
 * Trigger state update by `useLayoutEffect` to save perf.
 */
export default function useEffectState<T extends string | number | object>(
  notifyEffectUpdate: NotifyEffectUpdate,
  defaultValue: T | null,
): [T | null, (value: Updater<T>) => void] {
  // Value
  const [stateValue, setStateValue] = React.useState(defaultValue);

  // Set State
  const setEffectVal = useEvent((nextValue: Updater<T>) => {
    notifyEffectUpdate(() => {
      setStateValue(nextValue);
    });
  });

  return [stateValue, setEffectVal];
}
