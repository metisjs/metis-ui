import useLatestValue from 'meta-ui/_util/hooks/useLatestValue';
import useEvent from 'rc-util/lib/hooks/useEvent';
import { useMemo, useRef } from 'react';
import useIsMounted from '../../_util/hooks/useIsMounted';
import {
  ContainerElement,
  NestingContextValues,
  RenderStrategy,
  TransitionDirection,
  TreeStates,
} from '../interface';
import { hasChildren, match } from '../utils';
import useDisposables from './useDisposables';

export default function useNesting(done?: () => void, parent?: NestingContextValues) {
  const doneRef = useLatestValue(done);
  const transitionableChildren = useRef<NestingContextValues['children']['current']>([]);
  const mounted = useIsMounted();
  const d = useDisposables();

  const unregister = useEvent((container: ContainerElement, strategy = RenderStrategy.Hidden) => {
    const idx = transitionableChildren.current.findIndex(({ el }) => el === container);
    if (idx === -1) return;

    match(strategy, {
      [RenderStrategy.Unmount]() {
        transitionableChildren.current.splice(idx, 1);
      },
      [RenderStrategy.Hidden]() {
        transitionableChildren.current[idx].state = TreeStates.Hidden;
      },
    });

    d.microTask(() => {
      if (!hasChildren(transitionableChildren) && mounted.current) {
        doneRef.current?.();
      }
    });
  });

  const register = useEvent((container: ContainerElement) => {
    const child = transitionableChildren.current.find(({ el }) => el === container);
    if (!child) {
      transitionableChildren.current.push({ el: container, state: TreeStates.Visible });
    } else if (child.state !== TreeStates.Visible) {
      child.state = TreeStates.Visible;
    }

    return () => unregister(container, RenderStrategy.Unmount);
  });

  const todos = useRef<(() => void)[]>([]);
  const wait = useRef<Promise<void>>(Promise.resolve());

  const chains = useRef<
    Record<TransitionDirection, [identifier: ContainerElement, promise: Promise<void>][]>
  >({
    enter: [],
    leave: [],
    idle: [],
  });

  const onStart = useEvent(
    (
      container: ContainerElement,
      direction: TransitionDirection,
      cb: (direction: TransitionDirection) => void,
    ) => {
      // Clear out all existing todos
      todos.current.splice(0);

      // Remove all existing promises for the current container from the parent because we can
      // ignore those and use only the new one.
      if (parent) {
        parent.chains.current[direction] = parent.chains.current[direction].filter(
          ([containerInParent]) => containerInParent !== container,
        );
      }

      // Wait until our own transition is done
      parent?.chains.current[direction].push([
        container,
        new Promise<void>((resolve) => {
          todos.current.push(resolve);
        }),
      ]);

      // Wait until our children are done
      parent?.chains.current[direction].push([
        container,
        new Promise<void>((resolve) => {
          Promise.all(chains.current[direction].map(([, promise]) => promise)).then(() =>
            resolve(),
          );
        }),
      ]);

      if (direction === 'enter') {
        wait.current = wait.current.then(() => parent?.wait.current).then(() => cb(direction));
      } else {
        cb(direction);
      }
    },
  );

  const onStop = useEvent(
    (
      _container: ContainerElement,
      direction: TransitionDirection,
      cb: (direction: TransitionDirection) => void,
    ) => {
      Promise.all(chains.current[direction].splice(0).map(([, promise]) => promise)) // Wait for my children
        .then(() => {
          todos.current.shift()?.(); // I'm ready
        })
        .then(() => cb(direction));
    },
  );

  return useMemo(
    () => ({
      children: transitionableChildren,
      register,
      unregister,
      onStart,
      onStop,
      wait,
      chains,
    }),
    [register, unregister, transitionableChildren, onStart, onStop, chains, wait],
  );
}
