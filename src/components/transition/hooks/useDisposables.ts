import { useEffect, useState } from 'react';
import disposables from '../util/disposables';

export function useDisposables() {
  // Using useState instead of useRef so that we can use the initializer function.
  let [d] = useState(disposables);
  useEffect(() => () => d.dispose(), [d]);
  return d;
}
