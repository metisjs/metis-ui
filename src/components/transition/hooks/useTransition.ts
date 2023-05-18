import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import type { MutableRefObject } from 'react';
import useIsMounted from '../../_util/hooks/useIsMounted';
import Disposables from '../disposables';
import { transition } from '../utils';
import useDisposables from './useDisposables';

interface TransitionArgs {
  container: MutableRefObject<HTMLElement | null>;
  classes: MutableRefObject<{
    enter: string[];
    enterFrom: string[];
    enterTo: string[];

    leave: string[];
    leaveFrom: string[];
    leaveTo: string[];

    entered: string[];
  }>;
  direction: 'enter' | 'leave' | 'idle';
  onStart: MutableRefObject<(direction: TransitionArgs['direction']) => void>;
  onStop: MutableRefObject<(direction: TransitionArgs['direction']) => void>;
}

export default function useTransition({
  container,
  direction,
  classes,
  onStart,
  onStop,
}: TransitionArgs) {
  let mounted = useIsMounted();
  let d = useDisposables();

  let latestDirection = useLatestValue(direction);

  useLayoutEffect(() => {
    let dd = new Disposables();
    d.add(dd.dispose);

    let node = container.current;
    if (!node) return; // We don't have a DOM node (yet)
    if (latestDirection.current === 'idle') return; // We don't need to transition
    if (!mounted.current) return;

    dd.dispose();

    onStart.current(latestDirection.current);

    dd.add(
      transition(node, classes.current, latestDirection.current === 'enter', () => {
        dd.dispose();
        onStop.current(latestDirection.current);
      }),
    );

    return dd.dispose;
  }, [direction]);
}
