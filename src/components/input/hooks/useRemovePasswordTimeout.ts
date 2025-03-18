import { useEffect, useRef } from 'react';
import type { InputRef } from '../interface';

export default function useRemovePasswordTimeout(
  inputRef: React.RefObject<HTMLInputElement | InputRef | null>,
  triggerOnMount?: boolean,
) {
  const removePasswordTimeoutRef = useRef<NodeJS.Timeout[]>([]);
  const removePasswordTimeout = () => {
    removePasswordTimeoutRef.current.push(
      setTimeout(() => {
        const el =
          (inputRef as React.RefObject<InputRef | null>).current?.input ??
          (inputRef as React.RefObject<HTMLInputElement | null>).current;
        if (el && el.getAttribute('type') === 'password' && el.hasAttribute('value')) {
          el.removeAttribute('value');
        }
      }),
    );
  };

  useEffect(() => {
    if (triggerOnMount) {
      removePasswordTimeout();
    }

    return () =>
      removePasswordTimeoutRef.current.forEach((timer) => {
        if (timer) {
          clearTimeout(timer);
        }
      });
  }, []);

  return removePasswordTimeout;
}
