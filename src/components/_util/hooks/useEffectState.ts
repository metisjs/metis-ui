import { useCallback, useEffect, useState } from 'react';

type Trigger = (callback?: VoidFunction) => void;

/**
 * Trigger a callback on state change
 */
export default function useEffectState(): Trigger {
  const [effectId, setEffectId] = useState<{
    id: number;
    callback?: VoidFunction;
  }>({
    id: 0,
    callback: undefined,
  });

  const update = useCallback((callback?: VoidFunction) => {
    setEffectId(({ id }) => ({
      id: id + 1,
      callback,
    }));
  }, []);

  useEffect(() => {
    effectId.callback?.();
  }, [effectId]);

  return update;
}
