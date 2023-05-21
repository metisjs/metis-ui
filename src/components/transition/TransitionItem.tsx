import classNames from 'classnames';
import useLatestValue from 'meta-ui/_util/hooks/useLatestValue';
import useEvent from 'rc-util/lib/hooks/useEvent';
import React, {
  CSSProperties,
  ForwardRefRenderFunction,
  JSXElementConstructor,
  forwardRef,
  useEffect,
  useRef,
  useState,
} from 'react';
import useSyncRefs from '../_util/hooks/useSyncRefs';
import {
  NestingContext,
  OpenClosedContext,
  useParentNesting,
  useTransitionContext,
} from './context';
import useEvents from './hooks/useEvents';
import useFlags from './hooks/useFlags';
import useNesting from './hooks/useNestion';
import useTransition from './hooks/useTransition';
import {
  RenderStrategy,
  State,
  TransitionDirection,
  TransitionEvents,
  TreeStates,
} from './interface';
import { hasChildren, match, render, splitClasses, splitStyles } from './utils';

const DEFAULT_TRANSITION_CHILD_TAG = 'div' as const;

export interface TransitionItemProps extends TransitionEvents {
  as?: keyof JSX.IntrinsicElements | JSXElementConstructor<any>;
  className?: string;
  unmount?: boolean;
  enter?: string | CSSProperties;
  enterFrom?: string | CSSProperties;
  enterTo?: string | CSSProperties;
  entered?: string | CSSProperties;
  leave?: string | CSSProperties;
  leaveFrom?: string | CSSProperties;
  leaveTo?: string | CSSProperties;
  children?: React.ReactNode;
}

const InternalTransitionItem: ForwardRefRenderFunction<HTMLElement, TransitionItemProps> = (
  props,
  ref,
) => {
  const {
    // Event "handlers"
    beforeEnter,
    afterEnter,
    beforeLeave,
    afterLeave,

    // Class names
    enter,
    enterFrom,
    enterTo,
    entered,
    leave,
    leaveFrom,
    leaveTo,

    ...rest
  } = props as typeof props;
  const container = useRef<HTMLElement>(null);
  const transitionRef = useSyncRefs(container, ref);
  const strategy = rest.unmount ? RenderStrategy.Unmount : RenderStrategy.Hidden;

  const { show, appear, initial } = useTransitionContext();

  const [state, setState] = useState(show ? TreeStates.Visible : TreeStates.Hidden);

  const parentNesting = useParentNesting();
  const { register, unregister } = parentNesting;
  const prevShow = useRef<boolean | null>(null);

  useEffect(() => register(container), [register, container]);

  useEffect(() => {
    // If we are in another mode than the Hidden mode then ignore
    if (strategy !== RenderStrategy.Hidden) return;
    if (!container.current) return;

    // Make sure that we are visible
    if (show && state !== TreeStates.Visible) {
      setState(TreeStates.Visible);
      return;
    }

    return match(state, {
      [TreeStates.Hidden]: () => unregister(container),
      [TreeStates.Visible]: () => register(container),
    });
  }, [state, container, register, unregister, show, strategy]);

  const classes = useLatestValue({
    enter: splitClasses(enter),
    enterFrom: splitClasses(enterFrom),
    enterTo: splitClasses(enterTo),
    entered: splitClasses(entered),
    leave: splitClasses(leave),
    leaveFrom: splitClasses(leaveFrom),
    leaveTo: splitClasses(leaveTo),
  });

  const styles = useLatestValue({
    enter: splitStyles(enter),
    enterFrom: splitStyles(enterFrom),
    enterTo: splitStyles(enterTo),
    entered: splitStyles(entered),
    leave: splitStyles(leave),
    leaveFrom: splitStyles(leaveFrom),
    leaveTo: splitStyles(leaveTo),
  });

  const events = useEvents({
    beforeEnter,
    afterEnter,
    beforeLeave,
    afterLeave,
  });

  useEffect(() => {
    if (state === TreeStates.Visible && container.current === null) {
      throw new Error('Did you forget to passthrough the `ref` to the actual DOM node?');
    }
  }, [container, state]);

  // Skipping initial transition
  const skip = initial && !appear;

  const transitionDirection = (() => {
    if (skip) return 'idle';
    if (prevShow.current === show) return 'idle';
    return show ? 'enter' : 'leave';
  })() as TransitionDirection;

  const transitionStateFlags = useFlags(0);

  const beforeEvent = useEvent((direction: TransitionDirection) => {
    return match(direction, {
      enter: () => {
        transitionStateFlags.addFlag(State.Opening);
        events.current.beforeEnter();
      },
      leave: () => {
        transitionStateFlags.addFlag(State.Closing);
        events.current.beforeLeave();
      },
      idle: () => {},
    });
  });

  const afterEvent = useEvent((direction: TransitionDirection) => {
    return match(direction, {
      enter: () => {
        transitionStateFlags.removeFlag(State.Opening);
        events.current.afterEnter();
      },
      leave: () => {
        transitionStateFlags.removeFlag(State.Closing);
        events.current.afterLeave();
      },
      idle: () => {},
    });
  });

  const nesting = useNesting(() => {
    // When all children have been unmounted we can only hide ourselves if and only if we are not
    // transitioning ourselves. Otherwise we would unmount before the transitions are finished.
    setState(TreeStates.Hidden);
    unregister(container);
  }, parentNesting);

  useTransition({
    container,
    classes,
    styles,
    direction: transitionDirection,
    onStart: useLatestValue((direction) => {
      nesting.onStart(container, direction, beforeEvent);
    }),
    onStop: useLatestValue((direction) => {
      nesting.onStop(container, direction, afterEvent);

      if (direction === 'leave' && !hasChildren(nesting)) {
        // When we don't have children anymore we can safely unregister from the parent and hide
        // ourselves.
        setState(TreeStates.Hidden);
        unregister(container);
      }
    }),
  });

  useEffect(() => {
    if (!skip) return;

    if (strategy === RenderStrategy.Hidden) {
      prevShow.current = null;
    } else {
      prevShow.current = show;
    }
  }, [show, skip, state]);

  let theirProps: Record<string, any> = rest;
  if (appear && show && initial) {
    theirProps = {
      ...theirProps,
      // Already apply the `enter` and `enterFrom` on the server if required
      className: classNames(
        rest.className,
        typeof enter === 'string' && classes.current.enter,
        typeof enterFrom === 'string' && classes.current.enterFrom,
      ),
      style: {
        ...(typeof enter !== 'string' ? enter : {}),
        ...(typeof enterFrom !== 'string' ? enterFrom : {}),
      },
    };
  }

  return (
    <NestingContext.Provider value={nesting}>
      <OpenClosedContext.Provider
        value={
          match(state, {
            [TreeStates.Visible]: State.Open,
            [TreeStates.Hidden]: State.Closed,
          }) | transitionStateFlags.flags
        }
      >
        {render({
          props: { ...theirProps, ref: transitionRef },
          tag: DEFAULT_TRANSITION_CHILD_TAG,
          visible: state === TreeStates.Visible,
          name: 'TransitionItem',
        })}
      </OpenClosedContext.Provider>
    </NestingContext.Provider>
  );
};

const TransitionItem = forwardRef<HTMLElement, TransitionItemProps>(InternalTransitionItem);

if (process.env.NODE_ENV !== 'production') {
  TransitionItem.displayName = 'TransitionItem';
}

export default TransitionItem;
