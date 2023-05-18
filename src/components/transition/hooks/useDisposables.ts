import { useEffect, useState } from 'react';
import Disposables from '../disposables';

export default function useDisposables() {
  // Using useState instead of useRef so that we can use the initializer function.
  let [d] = useState(() => new Disposables());
  useEffect(() => () => d.dispose(), [d]);
  return d;
}
