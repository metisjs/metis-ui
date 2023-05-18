import { useRef } from 'react';

function useLatestValue<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;

  return ref;
}

export default useLatestValue;
