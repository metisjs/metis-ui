import useEvent from 'rc-util/lib/hooks/useEvent';
import useLayoutEffect from 'rc-util/lib/hooks/useLayoutEffect';
import React, {
  ForwardRefRenderFunction,
  Fragment,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import useSyncRefs from '../_util/hooks/useSyncRefs';
import TransitionItem, { TransitionItemProps } from './TransitionItem';
import { NestingContext, OpenClosedContext, TransitionContext } from './context';
import useNesting from './hooks/useNestion';
import { State, TransitionContextValues, TreeStates } from './interface';
import { hasChildren, render } from './utils';

export type TransitionProps = TransitionItemProps & {
  show?: boolean;
  appear?: boolean;
};

const InternalTransition: ForwardRefRenderFunction<HTMLElement, TransitionProps> = (props, ref) => {
  let { show, appear = false, unmount = true, ...theirProps } = props;
  const internalTransitionRef = useRef<HTMLElement | null>(null);
  const transitionRef = useSyncRefs(internalTransitionRef, ref);

  const usesOpenClosedState = useContext(OpenClosedContext);

  if (show === undefined && usesOpenClosedState !== null) {
    show = (usesOpenClosedState & State.Open) === State.Open;
  }

  if (![true, false].includes(show as unknown as boolean)) {
    throw new Error('A <Transition /> is used but it is missing a `show={true | false}` prop.');
  }

  const [state, setState] = useState(show ? TreeStates.Visible : TreeStates.Hidden);

  const nestingBag = useNesting(() => {
    setState(TreeStates.Hidden);
  });

  const [initial, setInitial] = useState(true);

  // Change the `initial` value
  const changes = useRef([show]);
  useLayoutEffect(() => {
    // We can skip this effect
    if (initial === false) {
      return;
    }

    // Track the changes
    if (changes.current[changes.current.length - 1] !== show) {
      changes.current.push(show);
      setInitial(false);
    }
  }, [changes, show]);

  const transitionBag = useMemo<TransitionContextValues>(
    () => ({ show: show as boolean, appear, initial }),
    [show, appear, initial],
  );

  useEffect(() => {
    if (show) {
      setState(TreeStates.Visible);
    } else if (!hasChildren(nestingBag)) {
      setState(TreeStates.Hidden);
    }
  }, [show, nestingBag]);

  const sharedProps = { unmount };

  const afterEnter = useEvent(() => {
    if (initial) setInitial(false);
    props.afterEnter?.();
  });

  const afterLeave = useEvent(() => {
    if (initial) setInitial(false);
    props.afterLeave?.();
  });

  return (
    <NestingContext.Provider value={nestingBag}>
      <TransitionContext.Provider value={transitionBag}>
        {render({
          props: {
            ...sharedProps,
            as: Fragment,
            children: (
              <TransitionItem
                ref={transitionRef}
                {...sharedProps}
                {...theirProps}
                afterEnter={afterEnter}
                afterLeave={afterLeave}
              />
            ),
          },
          tag: Fragment,
          visible: state === TreeStates.Visible,
          name: 'Transition',
        })}
      </TransitionContext.Provider>
    </NestingContext.Provider>
  );
};

const Transition = forwardRef<HTMLElement, TransitionProps>(InternalTransition);

if (process.env.NODE_ENV !== 'production') {
  Transition.displayName = 'Transition';
}

export default Transition;
